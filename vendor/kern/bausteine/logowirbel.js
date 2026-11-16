// Logo-Wirbel: Logos laufen frei (ohne Kachel, ohne Rahmen) auf flachen, ineinanderliegenden Bahnen um die Mitte
// (Vorlage: KiLogoWirbel der NeuralNautic-Website). Die Bahnen laufen hinter der Bildkarte durch, die der Aufrufer
// darueberlegt; Logos auf der hinteren Bahnhaelfte sind kleiner und blasser. Sie halten festen Abstand und
// verdecken einander nie. Passen nicht alle gleichzeitig, laufen die uebrigen nach: Hinter der Karte (c.versteck)
// wechselt ein Platz zum naechsten wartenden Logo.
//
// Logos werden unveraendert als <img> gezeigt, nie umgefaerbt und nie nachgebaut. Dunkle Logos bekommen automatisch
// einen sehr weichen, randlosen Lichtschein dahinter (radialer Verlauf ins Dunkel, Staerke nach Helligkeit des Logos),
// damit sie auf dunklem Grund lesbar bleiben. Eintraege mit `schein: false` (eigene Signete) bekommen nie einen.
// Bilder laden erst mit laden(). Reduced Motion: keine Bahnen, geordnetes Raster in gleicher Groesse (.is-still).
import { reduced } from '../motion.js';
import './grund.css';
import './logowirbel.css';
import { el, esc } from './hilfen.js';

/**
 * @param {object} c
 * @param {{src:string, name:string, breit?:boolean, schein?:boolean}[]} c.logos
 * @param {string} [c.ariaLabel]     Vorspann des Bild-Labels, die Namen werden angehaengt
 * @param {number} [c.hoehe=0.4]     senkrechte Ausdehnung der aeusseren Bahn (Anteil der halben Hoehe)
 * @param {number} [c.luft=24]       Mindestabstand zwischen zwei Logos in px
 * @param {number} [c.tempo=26]      Geschwindigkeit der aeusseren Bahn in px/s (innere Bahnen laufen gegenlaeufig, langsamer)
 * @param {()=>number} [c.versteck]  halbe Breite der Zone in der Mitte, in der Logos verdeckt sind (z. B. halbe Kartenbreite):
 *                                   dort wechseln Plaetze zum naechsten wartenden Logo. Ohne Angabe bleiben ueberzaehlige unsichtbar.
 */
export function logowirbel(c) {
  const namen = [...new Set(c.logos.map((l) => l.name))].join(', ');
  const root = el(`<div class="bs-wirbel" role="img" aria-label="${esc(c.ariaLabel ? `${c.ariaLabel}: ` : '')}${esc(namen)}">
    ${c.logos.map((l, i) => `<div class="bs-wirbel__logo${l.breit ? ' is-breit' : ''}" title="${esc(l.name)}" data-i="${i}"><img data-src="${esc(l.src)}" alt="" decoding="async" /></div>`).join('')}
  </div>`);
  const kacheln = [...root.children];
  let ein = reduced ? 1 : 0;   // 0 = alle in der Mitte und unsichtbar, 1 = auf der Bahn
  let raf = 0;
  let sichtbar = false;
  let t0 = performance.now();
  let geladen = false;
  if (reduced) root.classList.add('is-still');

  /* ---------- Helligkeit je Logo: dunkle bekommen einen weichen Schein ---------- */
  const lin = (v) => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
  function pruefen(img, kachel, logo) {
    try {
      const n = 40;
      const cv = document.createElement('canvas');
      cv.width = n; cv.height = n;
      const x = cv.getContext('2d', { willReadFrequently: true });
      x.drawImage(img, 0, 0, n, n);
      const d = x.getImageData(0, 0, n, n).data;
      let summe = 0, zahl = 0, dunkel = 0, ecken = 0;
      for (let i = 0; i < d.length; i += 4) {
        const a = d[i + 3] / 255;
        if (a < 0.25) continue;
        const L = 0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]);
        summe += L * a; zahl += a;
        if (L < 0.06) dunkel += a;
      }
      for (const [ex, ey] of [[0, 0], [n - 1, 0], [0, n - 1], [n - 1, n - 1]]) if (d[(ey * n + ex) * 4 + 3] > 200) ecken++;
      const mittel = zahl ? summe / zahl : 1;
      const anteil = zahl ? dunkel / zahl : 0;
      // Schein, wenn ein grosser Teil des Logos fast schwarz ist; Staerke waechst mit dem dunklen Anteil
      const staerke = logo.schein === false || ecken >= 3 ? 0 : Math.max(0, Math.min(1, (anteil - 0.3) / 0.45));
      kachel.dataset.hell = mittel.toFixed(3);
      kachel.dataset.dunkel = anteil.toFixed(2);
      kachel.dataset.flaeche = ecken >= 3 ? '1' : '0';   // Bild bringt eine eigene deckende Flaeche mit (z. B. JPG)
      kachel.dataset.schein = staerke.toFixed(2);
      if (staerke > 0.02) { kachel.classList.add('hat-schein'); kachel.style.setProperty('--bs-schein', staerke.toFixed(2)); }
    } catch { /* fremde Herkunft oder kein Canvas: ohne Schein */ }
  }

  // Bahnen: ineinanderliegende „Rennbahnen“ (zwei Geraden, zwei Halbkreise). Auf jeder Bahn liegen Plaetze in
  // gleichem Abstand entlang der Strecke und laufen gemeinsam um: so kann kein Logo ein anderes verdecken, in
  // keiner Stellung. Untere Gerade = vorn (gross, deckend), obere = hinten (kleiner, blasser).
  let bahnen = [];
  let plaetze = [];    // { bahn, s0, logo, drin }
  let warten = [];     // Logos ohne Platz, in Reihenfolge
  function planen() {
    const w = root.clientWidth;
    const h = root.clientHeight;
    if (!w || !h) return;
    const g = kacheln[0].offsetWidth || 80;
    const abstand = g + (c.luft ?? 24);
    const rand = g / 2 + 14;
    const hw = w / 2 - rand;
    const b0 = Math.min((h / 2 - rand) * (c.hoehe ?? 0.4), hw);
    bahnen = [];
    for (let j = 0; ; j++) {
      const b = b0 - j * abstand;
      const a = hw - j * abstand;
      if (b < abstand / 2 || a < b) break;
      const gerade = 2 * (a - b);
      const laenge = 2 * gerade + 2 * Math.PI * b;
      bahnen.push({ a, b, gerade, laenge, zahl: Math.floor(laenge / abstand), richtung: j % 2 ? -1 : 1, tempo: (c.tempo ?? 26) * (j % 2 ? 0.7 : 1) / 1000 });
    }
    const frei = bahnen.reduce((s, x) => s + x.zahl, 0);
    const n = Math.min(kacheln.length, frei);
    // Plaetze nach Fassungsvermoegen auf die Bahnen verteilen
    let rest = n;
    bahnen.forEach((x) => { const z = Math.min(rest, Math.round(n * x.zahl / (frei || 1)), x.zahl); x.belegt = z; rest -= z; });
    for (let j = 0; rest > 0 && j < bahnen.length; j++) { const mehr = Math.min(rest, bahnen[j].zahl - bahnen[j].belegt); bahnen[j].belegt += mehr; rest -= mehr; }
    plaetze = [];
    const zaehler = bahnen.map(() => 0);
    // Logos reihum auf die Bahnen legen, damit die vorderen der Liste nicht alle auf einer Bahn sitzen
    for (let i = 0, j = 0; i < n; i++) {
      let versuche = 0;
      while (zaehler[j] >= bahnen[j].belegt && versuche++ < bahnen.length) j = (j + 1) % bahnen.length;
      const x = bahnen[j];
      plaetze.push({ bahn: x, s0: (zaehler[j] / x.belegt) * x.laenge, logo: i, drin: false });
      zaehler[j]++;
      j = (j + 1) % bahnen.length;
    }
    warten = [];
    for (let i = n; i < kacheln.length; i++) { warten.push(i); verbergen(i); }
  }
  function verbergen(i) { const st = kacheln[i].style; st.opacity = '0'; st.visibility = 'hidden'; }
  // Punkt auf der Rennbahn bei Streckenlaenge s (ab Mitte der unteren Geraden)
  function punkt(x, s) {
    const u = ((s % x.laenge) + x.laenge) % x.laenge;
    const g2 = x.gerade / 2;
    const bogen = Math.PI * x.b;
    if (u < g2) return [u, x.b];
    if (u < g2 + bogen) { const w = (u - g2) / x.b; return [g2 + Math.sin(w) * x.b, Math.cos(w) * x.b]; }
    if (u < g2 + bogen + x.gerade) return [g2 - (u - g2 - bogen), -x.b];
    if (u < g2 + 2 * bogen + x.gerade) { const w = (u - g2 - bogen - x.gerade) / x.b; return [-g2 - Math.sin(w) * x.b, -Math.cos(w) * x.b]; }
    return [-g2 + (u - g2 - 2 * bogen - x.gerade), x.b];
  }

  function setzen(t) {
    if (reduced) return;   // Raster per CSS
    if (!bahnen.length) planen();
    const e = ein * ein * (3 - 2 * ein);
    const versteck = warten.length && c.versteck ? c.versteck() : 0;
    for (const p of plaetze) {
      const x = p.bahn;
      const [px, py] = punkt(x, p.s0 + x.richtung * x.tempo * t);
      // hinter der Karte: Platz an das naechste wartende Logo geben (einmal je Durchgang)
      if (versteck) {
        const drin = Math.abs(px) < versteck;
        if (drin && !p.drin) { verbergen(p.logo); warten.push(p.logo); p.logo = warten.shift(); }
        p.drin = drin;
      }
      const st = kacheln[p.logo].style;
      const tiefe = py / x.b;                                   // -1 hinten (oben) … 1 vorn (unten)
      const s = (0.8 + 0.2 * (tiefe + 1) / 2) * (0.6 + 0.4 * e);
      st.visibility = e > 0.01 ? 'visible' : 'hidden';
      st.transform = `translate(-50%, -50%) translate(${(px * (0.3 + 0.7 * e)).toFixed(1)}px, ${(py * e).toFixed(1)}px) scale(${s.toFixed(3)})`;
      st.zIndex = String(Math.round((tiefe + 1) * 50));
      st.opacity = (e * (0.6 + 0.4 * (tiefe + 1) / 2)).toFixed(2);
    }
  }
  const schritt = (jetzt) => { if (sichtbar && ein > 0) setzen(jetzt - t0); raf = requestAnimationFrame(schritt); };

  return {
    el: root,
    /** Bilder anfordern (erst kurz vor Sichtbarkeit aufrufen). */
    laden() {
      if (geladen) return;
      geladen = true;
      root.querySelectorAll('img[data-src]').forEach((im) => {
        const k = im.parentElement;
        im.addEventListener('load', () => pruefen(im, k, c.logos[Number(k.dataset.i)]), { once: true });
        im.src = im.dataset.src;
      });
    },
    /** 0 … 1: Logos fahren aus der Mitte auf ihre Bahn (z. B. an den Scroll gekoppelt). */
    setEin(p) { ein = reduced ? 1 : Math.min(1, Math.max(0, p)); if (reduced || !sichtbar) setzen(reduced ? 0 : performance.now() - t0); },
    /** Pruefwerte je Logo (nach dem Laden): Helligkeit, dunkler Anteil, eigene Flaeche, Schein */
    pruefwerte() { return kacheln.map((k, i) => ({ name: c.logos[i].name, src: c.logos[i].src, hell: Number(k.dataset.hell), dunkel: Number(k.dataset.dunkel), flaeche: k.dataset.flaeche === '1', schein: Number(k.dataset.schein) })); },
    get stand() { return { plaetze: plaetze.length, warten: warten.length, bahnen: bahnen.length }; },
    start() {
      t0 = performance.now();
      new IntersectionObserver(([e]) => { sichtbar = e.isIntersecting; }, { threshold: 0 }).observe(root);
      window.addEventListener('resize', () => { planen(); setzen(reduced ? 0 : performance.now() - t0); });
      if (reduced) { this.laden(); setzen(0); } else raf = requestAnimationFrame(schritt);
    },
    stop() { cancelAnimationFrame(raf); },
  };
}
