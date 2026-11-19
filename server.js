/* De muizen van Ename — server (Node 18+, geen extra pakketten).
   Dient de website en houdt de toestand van het spel bij. Kiosk en gsm krijgen elke wijziging direct via SSE.
   Starten:  node server.js        (poort via PORT, sleutel voor de bordjes via HW_KEY) */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const Flow = require('./public/flow.js');

const PORT = process.env.PORT || 3000;
const HW_KEY = process.env.HW_KEY || '';          /* leeg = geen sleutel nodig (alleen voor testen) */
const IDLE_MS = Number(process.env.IDLE_MS || 30 * 60 * 1000);   /* sessie verloopt na zoveel stilte */
const BUSY_MS = Number(process.env.BUSY_MS || 10 * 60 * 1000);   /* muizenhol geldt als bezet bij activiteit binnen dit venster */
const PUBLIC = path.join(__dirname, 'public');

const sessions = new Map();        /* id -> { id, state, claimed, updated, clients:Set } */
let kioskId = null;                /* sessie die nu op de kiosk staat */
const kioskClients = new Set();

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.gif': 'image/gif', '.ico': 'image/x-icon' };

const now = () => Date.now();
const newId = () => crypto.randomBytes(4).toString('hex');
const publicState = (s) => (s ? { id: s.id, ...s.state } : null);

function sweep() {
  for (const [id, s] of sessions) if (now() - s.updated > IDLE_MS) { sessions.delete(id); if (kioskId === id) kioskId = null; }
}
function send(set, data) { const line = `data: ${JSON.stringify(data)}\n\n`; for (const res of set) res.write(line); }
function push(s) { send(s.clients, publicState(s)); if (kioskId === s.id) send(kioskClients, publicState(s)); }
function pushKiosk() { send(kioskClients, publicState(sessions.get(kioskId))); }

function json(res, code, obj) { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); }
function body(req) {
  return new Promise((resolve) => { let d = ''; req.on('data', (c) => { d += c; if (d.length > 1e5) req.destroy(); }); req.on('end', () => { try { resolve(d ? JSON.parse(d) : {}); } catch { resolve({}); } }); });
}
function sse(req, res, set, first) {
  res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
  res.write(`data: ${JSON.stringify(first)}\n\n`);
  set.add(res);
  const ping = setInterval(() => res.write(': ping\n\n'), 20000);
  req.on('close', () => { clearInterval(ping); set.delete(res); });
}
const hwOk = (req, url) => !HW_KEY || url.searchParams.get('key') === HW_KEY || req.headers['x-key'] === HW_KEY;

function act(s, action) {
  const before = JSON.stringify(s.state);
  s.state = Flow.apply(s.state, action);
  s.updated = now();
  if (JSON.stringify(s.state) !== before) push(s);
  return s;
}
function endSession(s) { sessions.delete(s.id); if (kioskId === s.id) kioskId = null; send(s.clients, null); pushKiosk(); }

function create(claimed) {
  const s = { id: newId(), state: Flow.fresh(), claimed, updated: now(), clients: new Set() };
  sessions.set(s.id, s); kioskId = s.id; pushKiosk(); return s;
}

async function api(req, res, url) {
  sweep();
  const p = url.pathname, m = req.method;

  /* gsm: bij een gezin horen bij de kiosk */
  if (p === '/api/join' && m === 'POST') {
    const b = await body(req);
    const own = b.id && sessions.get(b.id);
    if (own && kioskId === own.id) { own.updated = now(); return json(res, 200, { id: own.id }); }
    const cur = sessions.get(kioskId);
    if (!cur) return json(res, 200, { id: create(true).id });
    if (!cur.claimed) { cur.claimed = true; cur.updated = now(); return json(res, 200, { id: cur.id }); }
    if (now() - cur.updated > BUSY_MS || cur.state.stage === 'einde') { endSession(cur); return json(res, 200, { id: create(true).id }); }
    return json(res, 200, { busy: true });
  }
  let mm;
  if ((mm = p.match(/^\/api\/sessions\/([a-f0-9]+)\/(stream|action)$/))) {
    const s = sessions.get(mm[1]);
    if (mm[2] === 'stream' && m === 'GET') return sse(req, res, s ? s.clients : new Set(), publicState(s));
    if (!s) return json(res, 404, { error: 'onbekende sessie' });
    if (mm[2] === 'action' && m === 'POST') {
      const a = await body(req);
      if (a.type === 'restart') { endSession(s); return json(res, 200, { ok: true }); }
      act(s, a); return json(res, 200, publicState(s));
    }
  }

  /* ophalen zonder live verbinding (tunnels en sommige netwerken laten SSE niet door) */
  if ((mm = p.match(/^\/api\/sessions\/([a-f0-9]+)$/)) && m === 'GET') return json(res, 200, publicState(sessions.get(mm[1])));
  if (p === '/api/kiosk' && m === 'GET') return json(res, 200, publicState(sessions.get(kioskId)));

  /* kiosk */
  if (p === '/api/kiosk/stream' && m === 'GET') return sse(req, res, kioskClients, publicState(sessions.get(kioskId)));
  if (p === '/api/kiosk/action' && m === 'POST') {
    const a = await body(req);
    let s = sessions.get(kioskId);
    if (a.type === 'start') { if (!s) s = create(false); s.updated = now(); return json(res, 200, publicState(s)); }
    if (!s) return json(res, 200, null);
    if (a.type === 'restart') { endSession(s); return json(res, 200, null); }
    act(s, a); return json(res, 200, publicState(s));
  }

  /* bordjes en de Pi (beveiligd met HW_KEY als die is ingesteld) */
  if (p === '/api/detect' && m === 'POST') {        /* NFC-lezer: { "item": 1..5 } */
    if (!hwOk(req, url)) return json(res, 401, { error: 'sleutel' });
    const b = await body(req); const s = sessions.get(kioskId);
    if (s) act(s, { type: 'detect', item: b.item }); return json(res, 200, { ok: !!s, state: publicState(s) });
  }
  if ((mm = p.match(/^\/api\/post\/([1-5])\/(solved|failed)$/)) && m === 'POST') {   /* post 1 tot 3 melden hier */
    if (!hwOk(req, url)) return json(res, 401, { error: 'sleutel' });
    const s = sessions.get(kioskId);
    if (s) act(s, { type: mm[2] === 'solved' ? 'solve' : 'fail', item: Number(mm[1]) });
    return json(res, 200, { ok: !!s });
  }
  if (p === '/api/health') return json(res, 200, { ok: true, sessions: sessions.size, kiosk: kioskId });
  json(res, 404, { error: 'niet gevonden' });
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  try {
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    let f = decodeURIComponent(url.pathname); if (f === '/') f = '/phone.html';
    const full = path.normalize(path.join(PUBLIC, f));
    if (!full.startsWith(PUBLIC)) { res.writeHead(403); return res.end(); }
    fs.readFile(full, (e, d) => {
      if (e) { res.writeHead(404); return res.end('Niet gevonden'); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(full)] || 'application/octet-stream', 'Cache-Control': 'no-cache' }); res.end(d);
    });
  } catch (e) { console.error(e); if (!res.headersSent) json(res, 500, { error: 'serverfout' }); }
}).listen(PORT, () => console.log(`De muizen van Ename draait op http://localhost:${PORT}  (gsm: /, kiosk: /kiosk.html, demo: /demo.html)`));
