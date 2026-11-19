/* De muizen van Ename — schermen (alleen layout en knoppen, geen sensoren of logica).
   Alle maten volgen de Figma-schermen van 390 x 844. Elk scherm staat hieronder als een lijst met absoluut geplaatste onderdelen. */
'use strict';

const INK = '#2A4F69';

/* ---------- illustraties ---------- */
function mouseInner(sad) {
  const mouth = sad
    ? `<path d="M86 108 Q100 97 114 108" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`
    : `<path d="M84 102 Q100 114 116 102" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
  return `<path d="M132 196 C178 206 198 160 172 140" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
<ellipse cx="100" cy="150" rx="52" ry="62" fill="#D9D7CE" stroke="${INK}" stroke-width="4"/>
<ellipse cx="100" cy="158" rx="30" ry="42" fill="#F4F2ED"/>
<ellipse cx="47" cy="158" rx="12" ry="30" transform="rotate(8 47 158)" fill="#D9D7CE" stroke="${INK}" stroke-width="3.5"/><ellipse cx="153" cy="158" rx="12" ry="30" transform="rotate(-8 153 158)" fill="#D9D7CE" stroke="${INK}" stroke-width="3.5"/>
<circle cx="52" cy="40" r="30" fill="#D9D7CE" stroke="${INK}" stroke-width="4"/><circle cx="52" cy="40" r="18" fill="#EDD1C7"/>
<circle cx="148" cy="40" r="30" fill="#D9D7CE" stroke="${INK}" stroke-width="4"/><circle cx="148" cy="40" r="18" fill="#EDD1C7"/>
<ellipse cx="100" cy="82" rx="56" ry="48" fill="#D9D7CE" stroke="${INK}" stroke-width="4"/>
<circle cx="80" cy="76" r="4.5" fill="${INK}"/><circle cx="120" cy="76" r="4.5" fill="${INK}"/>
<ellipse cx="100" cy="92" rx="6" ry="4.5" fill="#C88A80"/>${mouth}
<path d="M60 92 L28 86 M60 98 L28 100 M140 92 L172 86 M140 98 L172 100" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
<ellipse cx="78" cy="205" rx="16" ry="8" fill="#D9D7CE" stroke="${INK}" stroke-width="3.5"/>
<ellipse cx="122" cy="205" rx="16" ry="8" fill="#D9D7CE" stroke="${INK}" stroke-width="3.5"/>`;
}
const mouse = (x, y, w, h, sad) => `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 200 230">${mouseInner(sad)}</svg>`;
const groundEl = (x, y, w, h, fill) => `<ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w / 2}" ry="${h / 2}" fill="${fill || '#E7E5DC'}"/>`;
/* losse muis met grond, 205 x 203 zoals in Figma */
const mouseGroup = (left, top, sad, ground) => `<svg class="a" style="left:${left}px;top:${top}px" width="205" height="203" viewBox="0 0 205 203" role="img" aria-label="${sad ? 'Een droevige muis' : 'Een muis'}">${groundEl(5, 186, 200, 18, ground)}${mouse(27, 0, 167, 192, sad)}</svg>`;
/* gezin 342 x 208 */
function family(left, top, withHole, ground, k) {
  k = k || 1;
  const hole = withHole ? `<path d="M61 196 V120 A110 110 0 0 1 281 120 V196 Z" fill="#F4F2ED" stroke="${INK}" stroke-width="3"/>` : '';
  return `<svg class="a" style="left:${left}px;top:${top}px" width="${342 * k}" height="${208 * k}" viewBox="0 0 342 208" role="img" aria-label="${withHole ? 'De muizenfamilie bij haar muizenhol' : 'De muizenfamilie'}">
${groundEl(10, 178, 322, 24, ground)}${hole}${mouse(12, 26, 132, 152)}${mouse(194, 26, 132, 152)}${mouse(122, 80, 94, 108)}</svg>`;
}

/* ---------- iconen ---------- */
const I = {
  vib: (c) => `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="${c}" stroke-width="2" aria-hidden="true"><rect x="10" y="4" width="12" height="24" rx="2.5"/><path d="M4 10v12M28 10v12M1 13v6M31 13v6"/></svg>`,
  check: '<svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="#356242" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 29l14 14L48 12"/></svg>',
  cross: '<svg width="52" height="52" viewBox="0 0 52 52" fill="none" stroke="#99473F" stroke-width="3.5" stroke-linecap="round" aria-hidden="true"><path d="M10 10l32 32M42 10L10 42"/></svg>',
  ear: '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#2A4F69" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M14 30c0-4 6-5 6-11a7 7 0 1 0-14 0"/><path d="M20 19c0-6 12-6 12 1 0 5-6 6-6 11a5 5 0 0 1-9 2"/></svg>',
  hand: '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#2A4F69" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="20" cy="20" r="12"/><circle cx="20" cy="20" r="4"/></svg>',
  circle: '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#2A4F69" stroke-width="3" aria-hidden="true"><circle cx="18" cy="18" r="12"/></svg>',
  triangle: '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#2A4F69" stroke-width="3" stroke-linejoin="round" aria-hidden="true"><path d="M18 5L32 30H4z"/></svg>',
  square: '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#2A4F69" stroke-width="3" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="6" width="24" height="24"/></svg>',
  star: '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#2A4F69" stroke-width="3" stroke-linejoin="round" aria-hidden="true"><path d="M18 4l4.2 9.4 10.3 1-7.7 6.9 2.2 10.1L18 26l-9 5.4 2.2-10.1-7.7-6.9 10.3-1z"/></svg>'
};
/* ---------- bouwstenen ---------- */
const ROLE_ALL = 'Voor het hele gezin', ROLE_DUO = 'Voor het kind en de volwassene';
const title = (top, text, cls) => `<h1 class="a t ${cls || ''}" style="top:${top}px">${text}</h1>`;
const desc = (top, text, w) => `<p class="a d" style="top:${top}px;margin:0${w ? ';width:' + w + 'px' : ''}">${text}</p>`;
const primary = (label, act) => `<button class="a btn" data-act="${act}">&gt; ${label}</button>`;
const helpLink = () => `<button class="a link" type="button">&gt; Ik heb hulp nodig</button>`;
const hint = (left, top, color, text) => `<div class="a hint" style="left:${left}px;top:${top}px">${I.vib(color)}<span>${text}</span></div>`;
const codeBoxes = (top, code) => `<div class="a" style="left:24px;top:${top}px;width:342px;height:96px" role="group" aria-label="Code: ${code.join(' ')}">${code.map((c, i) => `<div class="a codebox" style="left:${i * 119.33}px">${c}</div>`).join('')}</div>`;
const symbolCircle = (left, top, icon) => `<div class="a symbol" style="left:${left}px;top:${top}px">${icon}</div>`;
const phoneAnimation = (n) => `<img class="phone-animation" src="animations/opd${n}.gif" alt="Uitleg opdracht ${n}" loading="eager">`;
const kioskAnimation = (n) => `<img class="kiosk-animation" src="animations/opd${n}.gif" alt="Uitleg opdracht ${n}" loading="eager">`;
const completeAnimation = (n) => `<img class="complete-animation" src="animations/opd${n}_complete.gif" alt="" loading="eager">`;


const OR = '#C86B02';
const ITEMS = [
  { id: 'lampje', name: 'Lampje', svg: `<path d="M-8 -14 Q0 -22 8 -14" fill="none" stroke="${INK}" stroke-width="2.5"/><rect x="-11" y="-14" width="22" height="26" rx="5" fill="#FFE08A" stroke="${INK}" stroke-width="2.5"/><rect x="-8" y="12" width="16" height="5" rx="2" fill="${INK}"/><path d="M-4 -3 H4 M0 -3 V8" stroke="${OR}" stroke-width="2.5" stroke-linecap="round"/>` },
  { id: 'boek', name: 'Receptboekje', svg: `<rect x="-15" y="-12" width="30" height="24" rx="3" fill="${OR}" stroke="${INK}" stroke-width="2.5"/><path d="M-9 -12 V12" stroke="${INK}" stroke-width="2.5"/><path d="M-3 -4 H9 M-3 2 H9" stroke="#fff" stroke-width="2" stroke-linecap="round"/>` },
  { id: 'doos', name: 'Muziekdoosje', svg: `<rect x="-17" y="-8" width="34" height="22" rx="3" fill="#B8864F" stroke="${INK}" stroke-width="2.5"/><path d="M-17 -2 H17" stroke="${INK}" stroke-width="2"/><path d="M17 3 H24 V-6" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="-8" r="3" fill="${OR}" stroke="${INK}" stroke-width="2"/>` },
  { id: 'kompas', name: 'Kompas', svg: `<circle r="16" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M0 -11 L5 0 L0 11 L-5 0 Z" fill="${OR}" stroke="${INK}" stroke-width="2" transform="rotate(40)"/><circle r="2" fill="${INK}"/>` },
  { id: 'sleutel', name: 'Sleutel', svg: `<circle cx="-9" cy="0" r="8" fill="#E2B33C" stroke="${INK}" stroke-width="2.5"/><circle cx="-9" cy="0" r="3" fill="#fff" stroke="${INK}" stroke-width="2"/><path d="M-1 0 H17 M11 0 V7 M16 0 V5" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M-1 0 H17 M11 0 V7 M16 0 V5" stroke="#E2B33C" stroke-width="2.4" stroke-linecap="round"/>` }
];
const itemSvg = (it, size) => `<svg width="${size}" height="${size}" viewBox="-28 -28 56 56" aria-hidden="true">${it.svg}</svg>`;

/* ---------- schermen ---------- */
/* volgorde = volgorde van de tijdelijke navigatie. primaire knoppen springen naar het scherm met de opgegeven id */
const SCREENS = [
  { id: 'welkom', name: '1 · Welkom', role: ROLE_ALL, body: (st, ctx) =>
    title(136, 'Welkom') + desc(188, ctx && ctx.busy ? 'Het muizenhol wordt nu door een ander gezin gebruikt. Probeer het zo meteen opnieuw.' : 'Klik om verder te gaan.') + family(24, 240, false) + `<button class="a btn phone-welcome-btn" data-act="start">&gt; Verder</button>` },
  { id: 'post1', name: '3 · Post 1 · Kabels', role: ROLE_DUO, body:
    title(151, 'Verbind de kabels', 'navy') +
    desc(203, 'Kind: verbind de vier koorden met het contact met hetzelfde symbool. Volwassene: lees het patroon voor.') +
    `<div class="a card" style="left:24px;top:359px;width:342px;height:150px"><div class="a lab" style="left:16px;top:14px">Het patroon voor de volwassene</div>
      ${[I.circle, I.triangle, I.square, I.star].map((s, i) => `<div class="a tile" style="left:${16 + i * 80}px;top:50px;width:70px">${s}</div>`).join('')}</div>` +
    mouseGroup(0, 520, false) + helpLink() },
  { id: 'post2', name: '4 · Post 2 · Recept', role: ROLE_DUO, body:
    title(151, 'Leg het recept', 'navy') +
    desc(203, 'Kind: zoek de stroken waarvan de randen in elkaar passen. Volwassene: lees de tekst om de volgorde te controleren.') +
    `<div class="a card" style="left:24px;top:359px;width:342px;height:272px"><div class="a lab" style="left:16px;top:14px">De stroken van het recept</div>
      ${[1, 2, 3, 4, 5].map((n, i) => `<div class="a strip" style="left:16px;top:${48 + i * 44}px;width:310px"><b>${n}</b>Tekst van strook ${n}</div>`).join('')}</div>` +
    helpLink() },
  { id: 'post3', name: '5 · Post 3 · Luisterpost', role: ROLE_DUO, body:
    title(151, 'Luister samen', 'navy') +
    desc(203, 'Jullie staan bij twee verschillende palen. Praat met elkaar en vind het juiste geluid.') +
    `<div class="a card" style="left:24px;top:331px;width:165px;height:176px"><div class="a" style="left:16px;top:16px">${I.ear}</div><div class="a lab" style="left:16px;top:66px">Post A</div><div class="a" style="left:16px;top:92px;width:136px;font-size:16px;line-height:22px">Houd je oor tegen het doosje en luister.</div></div>
     <div class="a card" style="left:201px;top:331px;width:165px;height:176px"><div class="a" style="left:16px;top:16px">${I.hand}</div><div class="a lab" style="left:16px;top:66px">Post B</div><div class="a" style="left:16px;top:92px;width:136px;font-size:16px;line-height:22px">Kies de knop met het juiste symbool.</div></div>` +
    mouseGroup(0, 520, false) + helpLink() },
  { id: 'post4', name: '6 · Post 4 · Zoek de locatie', role: ROLE_DUO, body:
    title(151, 'Zoek de locatie', 'navy') + desc(203, 'Zoek met de gsm. De thermometer laat zien hoe dichtbij je bent.') +
    mouseGroup(0, 413, false) +
    `<div class="a card" style="left:207px;top:259px;width:120px;height:406px"><svg class="a" style="left:0;top:0" width="120" height="406" viewBox="0 0 120 406" role="img" aria-label="Thermometer die laat zien hoe dichtbij je bent">
      <rect x="44" y="24" width="32" height="294" rx="16" fill="#fff" stroke="${INK}" stroke-width="3"/><rect x="50" y="30" width="20" height="282" rx="10" fill="#CED9DF"/>
      <clipPath id="tc"><rect x="50" y="30" width="20" height="282" rx="10"/></clipPath><rect id="thfill" clip-path="url(#tc)" x="50" y="312" width="20" height="0" fill="${INK}"/>
      <g stroke="#fff" stroke-width="2">${Array.from({ length: 16 }, (_, i) => `<path d="M50 ${50 + i * 16} h9"/>`).join('')}</g>
      <circle cx="60" cy="338" r="40" fill="${INK}"/></svg></div>` +
    hint(44, 670, INK, 'Je gsm trilt als je er bent') + helpLink() },
  { id: 'post5', name: '7 · Post 5 · Word niet gevangen', role: ROLE_DUO, body:
    title(218, 'Word niet gevangen') + desc(270, 'Probeer zo stil mogelijk het pad af te lopen of de kat zal je vangen') +
    `<div class="a track" style="top:350px"><i id="noise" style="width:0"></i></div><div class="a scale" style="top:389px"><span>muisstil</span><span>te luid</span></div>` +
    hint(24, 435, 'var(--orange)', 'Je gsm trilt als je te veel beweegt') + helpLink() },
  { id: 'gelukt', name: '8 · Gelukt (post 1 tot 3)', role: ROLE_ALL, tone: 'ok', body:
    (st) => `<div class="a complete-phone" style="left:24px;top:248px">${completeAnimation(st.item)}</div>` +
    title(478, 'Gelukt! De muizen zijn blij', 'ok') + desc(574, 'Het doosje wordt nu geopend') + primary('Ga verder', 'to_leg') },
  { id: 'code', name: '9 · Goed gedaan met code (post 4 en 5)', role: ROLE_ALL, tone: 'ok', body: (st) =>
    `<div class="a complete-phone" style="left:24px;top:248px">${completeAnimation(st.item)}</div>` +
    title(475, 'Goed gedaan!', 'ok') + desc(535, 'De code van het kistje is') + codeBoxes(579, (CONFIG.CODES[st.item] || ['?', '?', '?'])) + primary('Ga verder', 'to_leg') },
  { id: 'oei', name: '10 · Oei, fout', role: ROLE_DUO, tone: 'bad', body:
    `<svg class="a" style="left:24px;top:279px" width="342" height="210" viewBox="0 0 342 210">${groundEl(100, 185, 200, 18, '#EBCFC9')}${mouse(119, 10, 156, 180, true)}</svg>` +
    symbolCircle(36, 292, I.cross) +
    title(497, 'Oei, probeer het nog eens!') + desc(585, 'Probeer het opnieuw, stap voor stap.') + primary('Probeer opnieuw', 'retry') },
  { id: 'einde', name: '11 · Einde · De muizen zijn thuis', role: ROLE_ALL, body:
    title(226, 'De muizen zijn thuis!') + desc(278, 'Volg hoe het verhaal afloopt op het centrale scherm.') + family(24, 358, true) + primary('Naar het muizenhol', 'restart') }
];



/* ======================================================================
   Telefoon: extra schermen (kijk naar het muizenhol, info per voorwerp)
   ====================================================================== */
const monitorIcon = '<svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="#2A4F69" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="10" width="44" height="30" rx="4"/><path d="M20 48h16M28 40v8"/></svg>';
const kijk = (id, ttl, txt) => ({ id, role: ROLE_ALL, body:
  symbolCircle(151, 150, monitorIcon) + title(272, ttl, 'navy') + desc(380, txt) + family(24, 520, true) });
const PHONE = Object.fromEntries(SCREENS.map(s => [s.id, s]));
/* TIJDELIJK: terug naar het overzicht en de opdracht als voltooid markeren, tot de echte posten werken */
const tempBar = `<div class="phone-temp-actions"><button class="tmpbtn" type="button" data-act="back">&lt; Terug</button><button class="tmpbtn" type="button" data-act="solve">Opdracht voltooien</button></div>`;
for (let n = 1; n <= 5; n++) PHONE['post' + n].body += tempBar;
PHONE.kijkVerhaal = kijk('kijkVerhaal', 'Ga naar het muizenhol', 'Het verhaal speelt af op het scherm in het muizenhol. Kijk goed mee!');
PHONE.kijkKeuze = kijk('kijkKeuze', 'Kies een voorwerp', 'Kies op het scherm in het muizenhol wat jullie willen zoeken.');
PHONE.kijkLeg = kijk('kijkLeg', 'Leg het voorwerp op de lezer', 'Leg het voorwerp bij het muizenhol op de lezer en kijk naar het scherm.');
PHONE.kijkLeg.body += primary('Voorwerp op de lezer leggen', 'detect');
PHONE.kijkGevonden = kijk('kijkGevonden', 'Goed zo!', 'Het voorwerp is herkend. Kijk naar het scherm in het muizenhol.');
ITEMS.forEach((it, i) => {
  PHONE['info' + (i + 1)] = { id: 'info' + (i + 1), role: ROLE_ALL, body:
    `<div class="a card phone-explanation" style="left:24px;top:148px;width:342px;height:200px">${phoneAnimation(i + 1)}</div>` +
    title(376, it.name, 'navy') +
    `<div class="phone-info-actions"><button class="link" type="button" data-act="back">&lt; Kies een ander voorwerp</button>${primary('Naar de opdracht', 'to_task')}</div>` };
});

/* ======================================================================
   Kiosk (1920 x 1080): eigen voorstel, er zijn nog geen wireframes
   ====================================================================== */
const kt = (top, text, cls, left) => `<h1 class="a kt ${cls || ''}" style="top:${top}px${left ? ';left:' + left + 'px' : ''}">${text}</h1>`;
const kd = (top, text, left, w) => `<p class="a kd" style="top:${top}px;${left ? 'left:' + left + 'px;' : ''}${w ? 'width:' + w + 'px' : ''}">${text}</p>`;
const kbtn = (label, act, left, top) => `<button class="a kbtn" data-act="${act}" style="left:${left || 120}px;top:${top || 880}px">&gt; ${label}</button>`;
const klink = (label, act, left, top) => `<button class="a klink" data-act="${act}" style="left:${left}px;top:${top}px">${label}</button>`;
/* legende met alle voorwerpen in cirkels: nog niet gevonden = doorzichtig, gevonden = volledig zichtbaar */
function legend(top, found) {
  const n = ITEMS.filter(it => found.has(it.id)).length;
  return `<div class="a klab" style="left:120px;top:${top}px">Gevonden spulletjes: ${n} van ${ITEMS.length}</div>` +
    ITEMS.map((it, i) => `<div class="a kcircle ${found.has(it.id) ? 'on' : 'off'}" style="left:${120 + i * 170}px;top:${top + 56}px" role="img" aria-label="${it.name}: ${found.has(it.id) ? 'gevonden' : 'nog niet gevonden'}">${itemSvg(it, 92)}</div>`).join('');
}
const KIOSK = {
  welkom: () => kt(180, 'Welkom') + kd(310, 'Klik om verder te gaan.') + family(960, 330, false, null, 2.4) + kbtn('Verder', 'start'),
  verhaal: () => `<div class="kintro"><video id="introVideo" muted playsinline preload="auto" controlslist="nodownload noplaybackrate nofullscreen" disablepictureinpicture aria-label="Intro van het muizenverhaal"><source src="animations/intro.mp4" type="video/mp4"></video><button class="intro-play" type="button" data-act="play_intro" aria-label="Speel de intro af"><span aria-hidden="true">▶</span></button></div>`,
  keuze: (f) => kt(100, 'Wat zoeken we?') + kd(220, 'Tik op een voorwerp om de opdracht te zien.') +
    ITEMS.map((it, i) => `<button type="button" class="a kcard ktile" data-act="pick" data-item="${i + 1}"${f.has(it.id) ? ' disabled' : ''} style="left:${80 + i * 360}px;top:310px;width:320px;height:300px">${itemSvg(it, 170)}<span>${it.name}</span></button>`).join('') +
    legend(690, f),
  einde: () => kt(180, 'De muizen zijn thuis!') + kd(310, 'hier speelt het slotverhaal af', 120, 1000) + family(960, 480, true, null, 2.4)
};
ITEMS.forEach((it, i) => {
  KIOSK['info' + (i + 1)] = () =>
    `<div class="a kcard k-explanation" style="left:120px;top:240px;width:640px;height:640px">${kioskAnimation(i + 1)}</div>` +
    kt(250, it.name, 'navy', 860) +
    kbtn('Naar de opdracht', 'to_task', 860, 640) + klink('&lt; Kies een ander voorwerp', 'back', 860, 800);
  KIOSK['gevonden' + (i + 1)] = (f) =>
    `<div class="a ksym" style="left:120px;top:120px">${I.check.replace('width="56" height="56"', 'width="100" height="100"')}</div>` +
    kt(330, `${it.name} gevonden!`, 'ok found-title') + kd(450, 'Placeholder: hier komt de tekst bij het voorwerp.', 120, 900) +
    `<div class="a ksym big" style="left:1180px;top:160px">${itemSvg(it, 330)}</div>` +
    legend(640, f) + kbtn('Verder', 'next', 120, 880);
});

