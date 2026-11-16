// Sternfahrt: Das neuronale Netz (kern/netz/netz.js, Originalparameter) als Bild, durch das ein Signet schwirrt,
// als suche es seinen Kurs: frei und ruhig auf weichen Bahnen, wie die Signete im Visier des Hero. Es laeuft Knoten
// an, haelt aber nicht an: kurz vor dem Knoten waehlt es den naechsten und schwenkt in einem Bogen dorthin. In seiner
// Naehe leuchten Knoten und Linien auf, Signale laufen auf sein Ziel zu.
//
// Markenregeln fuer das Signet sind eingebaut: nur Verschiebung und gleichmaessige Groesse (Tiefe, +-7 %), nie gedreht,
// verzerrt oder umgefaerbt, kein Schatten, kein Schein, kein Ring. Nichts ist um das Signet ausgespart: Netz und Licht
// laufen ungestoert dahinter weiter. Die Bahn haelt das ganze Signet im Feld.
// Reduced Motion: Netz-Standbild, das Signet steht gross an fester Stelle.
//
// Technik: Das Netz laeuft im fremden Takt (netz.schritt() je Bild), ein gemeinsamer Takt mit der Seite (gsap.ticker).
// Die Knotenlagen liest der Baustein beim Zeichnen des Netzes mit (arc-Aufrufe am Canvas dieser einen Instanz);
// netz.js selbst bleibt unveraendert.
import { gsap, reduced } from '../motion.js';
import { createNetz } from '../netz/netz.js';
import './grund.css';
import './sternfahrt.css';
import { el, esc, qs } from './hilfen.js';

const REICHWEITE = 200;   // wie MAX_DIST im Netz: so weit reichen Linien
const ATEM = 0.07;        // Tiefe: gleichmaessige Groesse +-7 %
const RAND = 6;           // Abstand des Signets zum Feldrand in px
const MIN_G = 18;         // kleiner wird das Signet nie

/**
 * @param {object} c
 * @param {{src:string}} c.signet          Datei aus public/brand (unveraendert als <img>)
 * @param {string} [c.farbe='63,212,224']  Netzfarbe als "r,g,b"
 * @param {number} [c.seed]                gleiches Netz bei jedem Laden
 * @param {number} [c.tempo]               Fahrt in px/s (Vorgabe: 0,45 x Signethoehe, mindestens 30)
 * @param {number} [c.staerke=1]           Praesenz des Netzes: Deckkraft von Linien, Knoten und Signalen mal staerke (Farbe
 *                                         bleibt), Linien etwas breiter, mehr Signale; 2 = etwa doppelt so praesent
 * @param {()=>number} [c.schub]           liefert das Scrolltempo (z. B. () => lenis.velocity): fuehrt Richtung und Tempo leicht mit
 */
// Praesenz: Alpha jeder rgba-Farbe dieses einen Kontexts mal k (Farbton bleibt), Linien etwas breiter.
// So bleibt netz.js unveraendert (Originalparameter), nur diese Instanz zeichnet kraeftiger.
function verstaerke(ctx, k) {
  const P = CanvasRenderingContext2D.prototype;
  const alpha = (v) => (typeof v === 'string'
    ? v.replace(/rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/, (_, r, g, b, a) => `rgba(${r},${g},${b},${Math.min(1, (parseFloat(a) || 0) * k).toFixed(3)})`)
    : v);
  for (const n of ['fillStyle', 'strokeStyle']) {
    const d = Object.getOwnPropertyDescriptor(P, n);
    Object.defineProperty(ctx, n, { configurable: true, get: () => d.get.call(ctx), set: (v) => d.set.call(ctx, alpha(v)) });
  }
  const lw = Object.getOwnPropertyDescriptor(P, 'lineWidth');
  Object.defineProperty(ctx, 'lineWidth', { configurable: true, get: () => lw.get.call(ctx), set: (v) => lw.set.call(ctx, v * (1 + 0.35 * (k - 1))) });
}

export function sternfahrt(c) {
  const root = el(`<div class="bs-sternfahrt" aria-hidden="true">
    <div class="bs-sternfahrt__netz"></div>
    <canvas class="bs-sternfahrt__licht"></canvas>
    <img class="bs-sternfahrt__signet" src="${esc(c.signet.src)}" alt="" decoding="async" />
  </div>`);
  const netzEl = qs('.bs-sternfahrt__netz', root);
  const licht = qs('canvas', root);
  const lctx = licht.getContext('2d');
  const signet = qs('img', root);
  const farbe = c.farbe || '63,212,224';
  let netz = null;
  let knoten = [];
  let mitlesen = [];
  let W = 0, H = 0, g = 110, b = 110, dpr = 1;
  let sichtbar = false, laeuft = false, io = null;
  // Fahrt: Ort, Geschwindigkeit, Zielknoten (oder freier Punkt, wenn kein Knoten passt)
  const F = { x: 0, y: 0, vx: 0, vy: 0, ziel: -1, vor: -1, frei: null, zeit: 0, ph: Math.random() * 20, s: 1 };
  let signale = [];
  let naechstesSignal = 0;

  // Grenzen fuer die Mitte des Signets: das ganze Signet (in groesster Groesse) bleibt im Feld
  const hx = () => Math.min(W / 2, b * (1 + ATEM) / 2 + RAND);
  const hy = () => Math.min(H / 2, g * (1 + ATEM) / 2 + RAND);
  const klemme = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const tempo = () => c.tempo ?? Math.max(30, g * 0.45);
  const ST = Math.max(0.2, c.staerke ?? 1);

  function messen() {
    W = netz.breite; H = netz.hoehe;
    // Richtgroesse aus dem CSS, begrenzt auf das Feld
    signet.style.height = '';
    const richt = signet.offsetHeight || 110;
    g = Math.max(MIN_G, Math.min(richt, Math.min(W, H) * 0.4));
    if (Math.abs(g - richt) > 0.5) signet.style.height = `${g.toFixed(1)}px`;
    b = signet.naturalWidth && signet.naturalHeight ? g * signet.naturalWidth / signet.naturalHeight : g;   // Seitenverhaeltnis der Datei
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    licht.width = Math.round(W * dpr); licht.height = Math.round(H * dpr);
    lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function netzBild() { mitlesen = []; netz.schritt(); if (mitlesen.length) knoten = mitlesen; }

  const imFeld = (k) => k[0] >= hx() && k[0] <= W - hx() && k[1] >= hy() && k[1] <= H - hy();
  function zielPunkt() {
    const k = F.ziel >= 0 ? knoten[F.ziel] : F.frei;
    return k ? [klemme(k[0], hx(), W - hx()), klemme(k[1], hy(), H - hy())] : [W / 2, H * 0.45];
  }

  function naechstesZiel() {
    const schub = klemme((c.schub?.() || 0) / 12, -1, 1);
    const v = Math.hypot(F.vx, F.vy);
    const weit = Math.max(REICHWEITE * 1.5, Math.min(W, H) * 0.7);
    let summe = 0;
    const kand = [];
    knoten.forEach((k, j) => {
      if (j === F.ziel || !imFeld(k)) return;
      const dx = k[0] - F.x, dy = k[1] - F.y, d = Math.hypot(dx, dy);
      if (d < g * 0.55 || d > weit) return;
      // lieber nicht zurueck, lieber im Schwung weiter (kein harter Haken), lieber in Scrollrichtung
      // (Seite scrollt abwaerts = Galerie faehrt nach links = Signet zieht nach rechts voraus)
      const schwung = v > 1 ? (F.vx * dx + F.vy * dy) / (v * d) : 0;
      const w = (j === F.vor ? 0.12 : 1) * (1 + 0.55 * schwung) * (1 + 0.8 * schub * (dx / d));
      summe += w; kand.push([j, w]);
    });
    F.vor = F.ziel; F.zeit = 0;
    if (!kand.length) {   // kein Knoten passt (sehr kleines Feld): freier Punkt im Feld
      F.ziel = -1;
      F.frei = [hx() + Math.random() * Math.max(0, W - 2 * hx()), hy() + Math.random() * Math.max(0, H - 2 * hy())];
      return;
    }
    let r = Math.random() * summe;
    let wahl = kand[kand.length - 1];
    for (const k of kand) { r -= k[1]; if (r <= 0) { wahl = k; break; } }
    F.ziel = wahl[0]; F.frei = null;
  }

  function fahrt(dt) {
    if (F.ziel >= knoten.length) F.ziel = -1;
    if (F.ziel < 0 && !F.frei) naechstesZiel();
    let z = zielPunkt();
    let dx = z[0] - F.x, dy = z[1] - F.y, d = Math.hypot(dx, dy);
    // kein Halt: kurz vor dem Knoten (oder wenn er zu lange nicht erreicht wird) das naechste Ziel
    if (d < Math.max(26, g * 0.3) || F.zeit > 7) {
      naechstesZiel();
      z = zielPunkt(); dx = z[0] - F.x; dy = z[1] - F.y; d = Math.hypot(dx, dy);
    }
    F.zeit += dt; F.ph += dt;
    const schub = klemme((c.schub?.() || 0) / 12, -1, 1);
    const v0 = tempo() * (1 + 0.5 * Math.abs(schub)) * (0.62 + 0.38 * Math.min(1, d / 130));   // am Knoten etwas langsamer
    const ux = d > 0.01 ? dx / d : 0, uy = d > 0.01 ? dy / d : 0;
    const quer = 0.42 * Math.sin(F.ph * 0.83) + 0.2 * Math.sin(F.ph * 0.37 + 1.7);   // weicher Bogen statt gerader Linie
    const wx = (ux - uy * quer) * v0 + schub * tempo() * 0.35;
    const wy = (uy + ux * quer) * v0;
    const k = Math.min(1, 1.5 * dt);   // traege Lenkung: Richtungswechsel werden zu Kurven
    F.vx += (wx - F.vx) * k; F.vy += (wy - F.vy) * k;
    F.x += F.vx * dt; F.y += F.vy * dt;
    // Feldrand: das Signet bleibt ganz im Feld
    const x0 = hx(), x1 = W - hx(), y0 = hy(), y1 = H - hy();
    if (F.x < x0) { F.x = x0; F.vx = Math.abs(F.vx) * 0.3; } else if (F.x > x1) { F.x = x1; F.vx = -Math.abs(F.vx) * 0.3; }
    if (F.y < y0) { F.y = y0; F.vy = Math.abs(F.vy) * 0.3; } else if (F.y > y1) { F.y = y1; F.vy = -Math.abs(F.vy) * 0.3; }
    F.s = 1 + ATEM * Math.sin(F.ph * 0.52);   // Tiefe wie im Visier: nur gleichmaessige Groesse
  }

  // nur verschieben und gleichmaessig skalieren: keine Drehung, keine Verzerrung
  function lage() {
    signet.style.transform = `translate(${(F.x - b / 2).toFixed(1)}px, ${(F.y - g / 2).toFixed(1)}px) scale(${F.s.toFixed(4)})`;
  }

  function lichtBild(dt) {
    lctx.clearRect(0, 0, W, H);
    const ziel = F.ziel >= 0 ? knoten[F.ziel] : null;
    const umkreis = Math.max(150, g * 1.5);
    // Knoten und Linien in der Naehe des Signets leuchten auf (laufen hinter dem Signet durch)
    const nah = [];
    knoten.forEach((k) => {
      const d = Math.hypot(k[0] - F.x, k[1] - F.y);
      if (d < umkreis) nah.push([k, 1 - d / umkreis]);
    });
    for (const [k, s] of nah) {
      lctx.beginPath(); lctx.arc(k[0], k[1], 2.6 + 1.6 * s, 0, Math.PI * 2);
      lctx.fillStyle = `rgba(${farbe},${(0.55 * s).toFixed(3)})`; lctx.fill();
      if (!ziel) continue;
      const d = Math.hypot(k[0] - ziel[0], k[1] - ziel[1]);
      if (d > 1 && d < REICHWEITE) {
        lctx.strokeStyle = `rgba(${farbe},${(0.42 * s * (1 - d / REICHWEITE)).toFixed(3)})`;
        lctx.lineWidth = 1; lctx.beginPath(); lctx.moveTo(k[0], k[1]); lctx.lineTo(ziel[0], ziel[1]); lctx.stroke();
      }
    }
    // Signale laufen auf das Ziel des Signets zu (Radius und Verlauf wie im Netz)
    if (!reduced && ziel) {
      naechstesSignal -= dt;
      if (naechstesSignal <= 0 && signale.length < Math.round(5 * ST)) {
        naechstesSignal = (0.35 + Math.random() * 0.5) / ST;
        const quellen = knoten.map((k, j) => [j, Math.hypot(k[0] - ziel[0], k[1] - ziel[1])]).filter(([j, d]) => j !== F.ziel && d > 50 && d < REICHWEITE);
        if (quellen.length) signale.push({ von: quellen[Math.floor(Math.random() * quellen.length)][0], nach: F.ziel, t: 0, tempo: 0.5 + Math.random() * 0.5 });
      }
      signale = signale.filter((s) => s.t <= 1 && knoten[s.von] && knoten[s.nach]);
      for (const s of signale) {
        const a = knoten[s.von], z = knoten[s.nach];
        lctx.beginPath(); lctx.arc(a[0] + (z[0] - a[0]) * s.t, a[1] + (z[1] - a[1]) * s.t, 2.8, 0, Math.PI * 2);
        lctx.fillStyle = `rgba(${farbe},${(0.75 * (1 - Math.abs(s.t - 0.5) * 2)).toFixed(3)})`; lctx.fill();
        s.t += s.tempo * dt;
      }
    }
  }

  function takt(_, ms) {
    if (!sichtbar || !netz) return;
    const dt = Math.min(0.05, (ms || 16) / 1000);
    netzBild();
    if (!knoten.length) return;
    fahrt(dt);
    lage();
    lichtBild(dt);
  }
  // Start und fester Platz bei Reduced Motion: etwas ueber der Bildmitte
  function grundstellung() {
    F.x = klemme(W / 2, hx(), W - hx()); F.y = klemme(H * 0.45, hy(), H - hy());
    F.vx = 0; F.vy = 0; F.ziel = -1; F.vor = -1; F.frei = null; F.zeit = 0; F.s = 1;
  }

  function start() {
    if (netz) return;
    netz = createNetz(netzEl, { farbe, seed: c.seed, takt: 'extern' });
    // Knotenlagen mitlesen: Signale zeichnet das Netz mit Radius 2,8, alles andere sind Knoten (in fester Reihenfolge)
    const nctx = netz.canvas.getContext('2d');
    const arc = nctx.arc.bind(nctx);
    nctx.arc = (x, y, r, ...rest) => { if (r !== 2.8) mitlesen.push([x, y]); return arc(x, y, r, ...rest); };
    if (ST !== 1) { verstaerke(nctx, ST); verstaerke(lctx, ST); }
    const bereit = () => {
      if (!netz) return;
      messen();
      netzBild();
      grundstellung();
      lage();
      if (knoten.length) lichtBild(0);
      root.classList.add('is-bereit');
    };
    if (signet.complete) bereit(); else signet.addEventListener('load', bereit, { once: true });
    if (reduced) return;
    io = new IntersectionObserver(([e]) => { sichtbar = e.isIntersecting; }, { rootMargin: '10%' });
    io.observe(root);
    window.addEventListener('resize', neuMessen);
    gsap.ticker.add(takt);
    laeuft = true;
  }
  function neuMessen() {
    if (!netz) return;
    requestAnimationFrame(() => {
      if (!netz) return;
      messen(); signale = []; F.ziel = -1; F.frei = null;
      F.x = klemme(F.x, hx(), W - hx()); F.y = klemme(F.y, hy(), H - hy());
      lage();
    });
  }
  function dispose() {
    if (laeuft) gsap.ticker.remove(takt);
    laeuft = false;
    window.removeEventListener('resize', neuMessen);
    io?.disconnect(); io = null;
    netz?.dispose(); netz = null;
    knoten = []; signale = [];
    root.classList.remove('is-bereit');
  }
  return { el: root, start, dispose, get lage() { return { x: F.x, y: F.y, g, b, s: F.s, W, H, knoten: knoten.length }; } };
}
