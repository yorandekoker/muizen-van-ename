/* Pagina voor het scherm in het muizenhol (Raspberry Pi, volledig scherm). */
'use strict';
const kEl = document.getElementById('kscreen');
let state = null;
const post = (url, body) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) }).then(r => r.json()).catch(() => null);

function render() {
  const id = Flow.view(state).k;
  const found = new Set(((state && state.found) || []).map(n => ITEMS[n - 1].id));
  kEl.className = 'kscreen' + (id.startsWith('gevonden') ? ' ok' : '');
  kEl.innerHTML = KIOSK[id](found);
}
kEl.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]'); if (!b || b.disabled) return;
  post('/api/kiosk/action', { type: b.dataset.act, item: b.dataset.item ? Number(b.dataset.item) : undefined }).then(r => setState(r));
});
function fit() {
  const box = document.getElementById('kbox').getBoundingClientRect();
  kEl.style.transform = `scale(${Math.min(box.width / 1920, box.height / 1080)})`;
}
const resizeObserver = new ResizeObserver(fit);
resizeObserver.observe(document.getElementById('kbox'));
addEventListener('resize', fit);
if (window.visualViewport) visualViewport.addEventListener('resize', fit);
fit(); render();
const es = new EventSource('/api/kiosk/stream');
let lastJson = '';
function setState(st) { const j = JSON.stringify(st); if (j === lastJson) return; lastJson = j; state = st; render(); }
es.onmessage = (e) => setState(JSON.parse(e.data));
/* vangnet voor als de live verbinding niet werkt */
setInterval(() => fetch('/api/kiosk', { cache: 'no-store' }).then(r => r.json()).then(setState).catch(() => {}), 1500);
