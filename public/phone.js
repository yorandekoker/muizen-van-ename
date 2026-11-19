/* Pagina voor op de gsm: toont het scherm dat bij de gedeelde toestand hoort en stuurt acties naar de server. */
'use strict';
const pEl = document.getElementById('pscreen');
const KEY = 'ename.sid';
let sid = null, state = null, ctx = {}, es = null, sensorKey = '', permAsked = false;
try { sid = localStorage.getItem(KEY); } catch (e) { /* */ }
const saveSid = (v) => { sid = v; try { v ? localStorage.setItem(KEY, v) : localStorage.removeItem(KEY); } catch (e) { /* */ } };

const post = (url, body) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) }).then(r => r.json()).catch(() => null);
const sendAct = (type, item) => sid ? post(`/api/sessions/${sid}/action`, { type, item }).then(r => { if (r && r.stage) setState(r); return r; }) : null;

function render() {
  const id = Flow.view(state).p, s = PHONE[id];
  pEl.className = 'screen' + (s.tone ? ' ' + s.tone : '');
  let body = typeof s.body === 'function' ? s.body(state || {}, ctx) : s.body;
  if (state && state.stage === 'opdr' && state.item >= 4 && Sensors.needsPermission() && !permAsked) body += `<button class="a btn perm" data-act="perm">&gt; Sensoren toestaan</button>`;
  pEl.innerHTML = statusBar + `<div class="a role">${I.user}<span>${s.role}</span></div><div class="a divider"></div>` + body + '<div class="a home"></div>';
  syncSensors();
}

/* sensoren aan voor post 4 en 5, anders uit */
function syncSensors() {
  const key = state && state.stage === 'opdr' && state.item >= 4 ? 'p' + state.item : '';
  if (key === sensorKey) return;
  sensorKey = key; Sensors.stop();
  if (key === 'p4') Sensors.startPost4(CONFIG.POST4, (lvl) => {
    const r = document.getElementById('thfill'); if (r) { r.setAttribute('y', 312 - 282 * lvl); r.setAttribute('height', 282 * lvl); }
  }, () => sendAct('solve', 4));
  if (key === 'p5') Sensors.startPost5(CONFIG.POST5, (lvl) => {
    const r = document.getElementById('noise'); if (r) r.style.width = Math.round(lvl * 100) + '%';
  }, () => sendAct('fail', 5), () => sendAct('solve', 5));
}

let lastJson = '';
function setState(st) {
  const j = JSON.stringify(st); if (j === lastJson) return; lastJson = j;
  if (st === null && sid) { saveSid(null); closeStream(); }
  state = st; render();
}
/* vangnet: elke 1,5 seconde de toestand ophalen, voor als de live verbinding niet werkt */
setInterval(() => { if (!sid) return; fetch(`/api/sessions/${sid}`, { cache: 'no-store' }).then(r => r.json()).then(setState).catch(() => {}); }, 1500);
function closeStream() { if (es) { es.close(); es = null; } }
function openStream() {
  closeStream(); if (!sid) return;
  es = new EventSource(`/api/sessions/${sid}/stream`);
  es.onmessage = (e) => setState(JSON.parse(e.data));
}

pEl.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const act = b.dataset.act;
  if (act === 'perm') { permAsked = true; await Sensors.request(); render(); return; }
  if (act === 'start') {
    permAsked = true; Sensors.request();
    const r = await post('/api/join', { id: sid });
    if (r && r.id) { ctx = {}; saveSid(r.id); openStream(); fetch(`/api/sessions/${r.id}`, { cache: 'no-store' }).then(x => x.json()).then(setState).catch(() => {}); } else { ctx = { busy: true }; render(); }
    return;
  }
  if (act === 'to_task' && state && state.item >= 4) { permAsked = true; Sensors.request(); }
  if (act === 'restart') { await sendAct('restart'); saveSid(null); closeStream(); state = null; render(); return; }
  sendAct(act, state && state.item);
});

function fit() {
  const box = document.getElementById('pbox').getBoundingClientRect();
  pEl.style.transform = `scale(${Math.min(box.width / 390, box.height / 844)})`;
}
addEventListener('resize', fit);
if (/[?&]test=1/.test(location.search)) Sensors.testPanel();
fit(); render(); openStream();
