/* Demo zonder server: dezelfde stroom en schermen, maar alles lokaal in één pagina. */
'use strict';
const $ = (s) => document.querySelector(s);
const kEl = $('#kscreen'), pEl = $('#pscreen'), pick = $('#pick'), det = $('#det');
let state = Flow.fresh(), idle = true;

/* lijst om doorheen te bladeren */
const LIST = [{ name: 'Welkom (kiosk wacht)', st: null }, { name: 'Verhaal speelt af', st: { stage: 'verhaal', item: null, found: [] } }, { name: 'Kiezen wat we zoeken', st: { stage: 'keuze', item: null, found: [] } }];
ITEMS.forEach((it, i) => { const n = i + 1, nm = it.name, st = (stage, found) => ({ stage, item: n, found: found || [] });
  LIST.push({ name: `${nm} · info`, st: st('info') }, { name: `${nm} · opdracht op gsm`, st: st('opdr') }, { name: `${nm} · ${n <= 3 ? 'gelukt' : 'goed gedaan met code'}`, st: st('res') },
    { name: `${nm} · leg het voorwerp op de lezer`, st: st('leg') }, { name: `${nm} · voorwerp herkend`, st: st('gev', [n]) }); });
LIST.push({ name: 'Oei, niet gelukt (post 5)', st: { stage: 'oei', item: 5, found: [] } }, { name: 'Einde · de muizen zijn thuis', st: { stage: 'einde', item: null, found: [1, 2, 3, 4, 5] } });
LIST.forEach((l, i) => pick.add(new Option((i + 1) + ' · ' + l.name, i)));
ITEMS.forEach((it, i) => det.add(new Option(it.name, i + 1)));

function render() {
  const v = Flow.view(idle ? null : state), found = new Set((idle ? [] : state.found).map(n => ITEMS[n - 1].id));
  const ps = PHONE[v.p];
  document.querySelector('#pbox').className = 'box phone-box' + (ps.tone ? ' ' + ps.tone : '');
  pEl.className = 'screen clean-phone' + (ps.tone ? ' ' + ps.tone : '');
  pEl.innerHTML = `<div class="phone-body">${typeof ps.body === 'function' ? ps.body(state, {}) : ps.body}</div>`;
  document.querySelector('#kbox').className = 'box kiosk-box' + (v.k.startsWith('gevonden') ? ' ok' : '');
  kEl.className = 'kscreen' + (v.k.startsWith('gevonden') ? ' ok' : '');
  kEl.innerHTML = KIOSK[v.k](found);
  const i = LIST.findIndex(l => (l.st === null && idle) || (l.st && !idle && l.st.stage === state.stage && l.st.item === state.item));
  if (i >= 0) pick.value = i;
}
function act(type, item) { if (type === 'start') { if (idle) { idle = false; state = Flow.fresh(); } } else if (type === 'restart') { idle = true; state = Flow.fresh(); } else if (!idle) state = Flow.apply(state, { type, item }); render(); }
document.addEventListener('click', (e) => { const b = e.target.closest('#kscreen [data-act],#pscreen [data-act]'); if (!b || b.disabled) return; act(b.dataset.act, b.dataset.item ? Number(b.dataset.item) : state.item); });
function jump(i) { const l = LIST[Math.max(0, Math.min(LIST.length - 1, i))]; if (!l.st) { idle = true; state = Flow.fresh(); } else { idle = false; state = JSON.parse(JSON.stringify(l.st)); } render(); }
const cur = () => Math.max(0, Number(pick.value) || 0);
$('#prev').onclick = () => jump(cur() - 1); $('#nxt').onclick = () => jump(cur() + 1); pick.onchange = () => jump(cur());
$('#solve').onclick = () => act('solve', state.item);
det.onchange = () => { if (det.value) act('detect', Number(det.value)); det.value = ''; };

function fitOne(boxSel, el, w, h) { const b = $(boxSel).getBoundingClientRect(); el.style.transform = `scale(${Math.min(b.width / w, b.height / h)})`; }
function fit() { fitOne('#kbox', kEl, 1920, 1080); fitOne('#pbox', pEl, 390, 844); }
addEventListener('resize', fit); render(); fit();
