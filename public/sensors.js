/* Sensoren van de gsm voor post 4 (locatie) en post 5 (beweging). Alles met een testmodus (?test=1). */
const Sensors = (() => {
  let geoId = null, motionHandler = null, timer = null, last = null, testMode = false;
  const listeners = {};
  const rad = (d) => d * Math.PI / 180;
  const dist = (a, b, c, d) => { const R = 6371000, dp = rad(c - a), dl = rad(d - b); const x = Math.sin(dp / 2) ** 2 + Math.cos(rad(a)) * Math.cos(rad(c)) * Math.sin(dl / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); };
  const buzz = (p) => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) { /* iPhone ondersteunt trillen niet */ } };

  /* Moet vanuit een tik van de gebruiker worden aangeroepen (iPhone vraagt dan toestemming). */
  async function request() {
    try { if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') await DeviceMotionEvent.requestPermission(); } catch (e) { /* geweigerd */ }
    try { navigator.geolocation && navigator.geolocation.getCurrentPosition(() => {}, () => {}, { enableHighAccuracy: true, timeout: 4000 }); } catch (e) { /* */ }
  }
  function needsPermission() { return typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function'; }

  function stop() {
    if (geoId != null && navigator.geolocation) navigator.geolocation.clearWatch(geoId);
    if (motionHandler) removeEventListener('devicemotion', motionHandler);
    clearInterval(timer); geoId = motionHandler = timer = null;
  }

  /* Post 4: onLevel(0..1), onFound() */
  function startPost4(cfg, onLevel, onFound) {
    stop(); let hits = 0, done = false;
    const feed = (m) => {
      if (done) return; onLevel(Math.max(0, Math.min(1, 1 - m / cfg.rangeM)));
      hits = m <= cfg.foundM ? hits + 1 : 0;
      if (hits >= 2) { done = true; buzz([300, 100, 300]); onFound(); }
    };
    listeners.dist = feed;
    if (cfg.lat != null && navigator.geolocation) {
      geoId = navigator.geolocation.watchPosition((p) => feed(dist(p.coords.latitude, p.coords.longitude, cfg.lat, cfg.lng)), () => {}, { enableHighAccuracy: true, maximumAge: 1000 });
    }
  }

  /* Post 5: onLevel(0..1), onFail(), onFinish() */
  function startPost5(cfg, onLevel, onFail, onFinish) {
    stop(); let ema = 0, over = 0, done = false; const t0 = Date.now();
    const feed = (a) => {
      if (done) return;
      ema = ema * 0.85 + a * 0.15; const lvl = Math.max(0, Math.min(1, ema / cfg.noiseMax)); onLevel(lvl);
      if (lvl > 0.8) buzz(60);
      over = lvl >= 1 ? over + 1 : 0;
      if (over >= 5) { done = true; buzz([400]); onFail(); }
    };
    listeners.noise = feed;
    motionHandler = (e) => {
      const g = e.acceleration && e.acceleration.x != null ? e.acceleration : null;
      let a;
      if (g) a = Math.hypot(g.x || 0, g.y || 0, g.z || 0);
      else { const q = e.accelerationIncludingGravity || {}; a = Math.abs(Math.hypot(q.x || 0, q.y || 0, q.z || 0) - 9.81); }
      feed(a);
    };
    addEventListener('devicemotion', motionHandler);
    const finish = () => { if (!done) { done = true; buzz([300, 100, 300]); onFinish(); } };
    listeners.finish = finish;
    if (cfg.endLat != null && navigator.geolocation) {
      let hits = 0;
      geoId = navigator.geolocation.watchPosition((p) => { hits = dist(p.coords.latitude, p.coords.longitude, cfg.endLat, cfg.endLng) <= cfg.endM ? hits + 1 : 0; if (hits >= 2) finish(); }, () => {}, { enableHighAccuracy: true, maximumAge: 1000 });
    } else {
      timer = setInterval(() => { if (Date.now() - t0 >= cfg.secondsIfNoEnd * 1000) { clearInterval(timer); finish(); } }, 500);
    }
  }

  /* Testpaneel (alleen met ?test=1): doet alsof de gsm beweegt of ergens staat. */
  function testPanel() {
    testMode = true;
    const d = document.createElement('div');
    d.id = 'testpanel';
    d.innerHTML = `<b>Test</b> afstand tot voorwerp <input id="tdist" type="range" min="0" max="80" value="80"><output id="tdo">80 m</output>
      · beweging <input id="tshake" type="range" min="0" max="8" step="0.5" value="0"><output id="tso">0</output>
      <button id="tfin" type="button">pad klaar</button>`;
    document.body.appendChild(d);
    d.querySelector('#tdist').oninput = (e) => { d.querySelector('#tdo').textContent = e.target.value + ' m'; listeners.dist && listeners.dist(Number(e.target.value)); };
    d.querySelector('#tshake').oninput = (e) => { d.querySelector('#tso').textContent = e.target.value; };
    d.querySelector('#tfin').onclick = () => listeners.finish && listeners.finish();
    setInterval(() => listeners.noise && listeners.noise(Number(d.querySelector('#tshake').value)), 100);
  }
  return { request, needsPermission, startPost4, startPost5, stop, testPanel, _listeners: listeners };
})();
