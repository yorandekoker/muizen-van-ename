/* De muizen van Ename — stroom van het spel.
   Eén plek die bepaalt welk scherm de kiosk en de gsm tonen en wat een actie doet.
   Werkt in de browser en in Node (server.js). Voorwerp n hoort bij post n. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(); else root.Flow = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const COUNT = 5;

  /* stages: verhaal, keuze, info, opdr, res, leg, oei, gev, einde  (welkom = kiosk wacht op een gezin) */
  const fresh = () => ({ stage: 'verhaal', item: null, found: [] });
  const clone = (s) => JSON.parse(JSON.stringify(s));

  /* ontvangt een toestand en een actie, geeft de nieuwe toestand terug (of dezelfde als de actie nu niet past) */
  function apply(state, action) {
    const s = clone(state), a = action || {}, n = Number(a.item) || null;
    const ok = (x) => x >= 1 && x <= COUNT;
    switch (a.type) {
      case 'story_done':
        if (s.stage === 'verhaal') { s.stage = 'keuze'; s.item = null; } break;
      case 'pick':
        if (s.stage === 'keuze' && ok(n) && !s.found.includes(n)) { s.stage = 'info'; s.item = n; } break;
      case 'back':
        if (s.stage === 'info') { s.stage = 'keuze'; s.item = null; } break;
      case 'to_task':
        if (s.stage === 'info') s.stage = 'opdr'; break;
      case 'solve':   /* een post (of de gsm bij post 4 en 5) meldt: opdracht gelukt */
        if (s.stage === 'opdr' && (!n || n === s.item)) s.stage = 'res'; break;
      case 'fail':
        if (s.stage === 'opdr' && (!n || n === s.item)) s.stage = 'oei'; break;
      case 'retry':
        if (s.stage === 'oei') s.stage = 'opdr'; break;
      case 'to_leg':
        if (s.stage === 'res') s.stage = 'leg'; break;
      case 'detect':  /* de NFC-lezer op de kiosk ziet een voorwerp */
        if (ok(n) && ['keuze', 'info', 'opdr', 'res', 'leg', 'oei'].includes(s.stage)) {
          if (!s.found.includes(n)) s.found.push(n);
          s.stage = 'gev'; s.item = n;
        } break;
      case 'next':
        if (s.stage === 'gev') { s.stage = s.found.length >= COUNT ? 'einde' : 'keuze'; s.item = null; } break;
      default: break;
    }
    return s;
  }

  /* welk scherm toont de kiosk (k) en welk de gsm (p) */
  function view(state) {
    const s = state || { stage: 'welkom', item: null, found: [] }, n = s.item;
    switch (s.stage) {
      case 'welkom': return { k: 'welkom', p: 'welkom' };
      case 'verhaal': return { k: 'verhaal', p: 'kijkVerhaal' };
      case 'keuze': return { k: 'keuze', p: 'kijkKeuze' };
      case 'info': return { k: 'info' + n, p: 'info' + n };
      case 'opdr': return { k: 'keuze', p: 'post' + n };
      case 'res': return { k: 'keuze', p: n <= 3 ? 'gelukt' : 'code' };
      case 'leg': return { k: 'keuze', p: 'kijkLeg' };
      case 'oei': return { k: 'keuze', p: 'oei' };
      case 'gev': return { k: 'gevonden' + n, p: 'kijkGevonden' };
      case 'einde': return { k: 'einde', p: 'einde' };
      default: return { k: 'welkom', p: 'welkom' };
    }
  }
  return { COUNT, fresh, apply, view };
});
