// Bildkarte (Lando: „Hero schrumpft zur Bildkarte, dahinter das Laufband“).
// Eine gepinnte Buehne in voller Groesse (dort sitzt der Hero) schrumpft beim Scrollen zur Karte in der Mitte.
// Hinter der Karte liegt eine freie Ebene (Logo-Wirbel, Laufband), um sie herum fuenf Textplaetze.
//
// Eine Strecke, drei Phasen (Anteile am Scrollweg): 0 … von = der Hero spielt seine eigene Scroll-Szene,
// von … bis = Schrumpfen, bis … 1 = die fertige Ansicht steht.
// Zusammenspiel mit @kern/hero: createHero(b.bahn, …) nutzt dieselbe Strecke; dafuer bekommen Pin und Buehne
// ueber c.klassen die Klassen, die der Hero erwartet (hero__pin, hero__buehne).
// Mobil bleibt nur der Platz „ol“ (Kernsatz) in der gepinnten Ansicht, die uebrigen Plaetze laufen darunter weiter.
// Reduced Motion: nichts ist gepinnt, Buehne, Text und Ebene stehen untereinander.
import { gsap, ScrollTrigger, reduced, barReveal } from '../motion.js';
import './grund.css';
import './bildkarte.css';
import { el, qs, qsa, kiHinweis, mobilMQ } from './hilfen.js';

const STANDARD = { desktop: { h: 0.62, verh: 0.62, x: 0.5, y: 0.52 }, mobil: { h: 0.46, verh: 0.66, x: 0.5, y: 0.5 } };
const ORDNUNG = ['ol', 'or', 'ul', 'ur', 'um'];

/**
 * @param {object} c
 * @param {HTMLElement} [c.el]      vorhandener Abschnitt aus dem HTML (fuer den ersten Eindruck ohne Skript):
 *                                  <section class="bs-bildkarte"><div class="bs-bildkarte__bahn"><div class="bs-bildkarte__pin"><div class="bs-bildkarte__buehne">…
 * @param {number} [c.weg=3.6]      Laenge der Strecke in Bildschirmhoehen
 * @param {number} [c.von=0.52]     Anteil, ab dem die Buehne schrumpft
 * @param {number} [c.bis=0.8]      Anteil, bei dem die Karte steht
 * @param {{desktop:object, mobil:object}} [c.karte]  Zielkarte: h (Anteil der Hoehe), verh (Breite/Hoehe), x, y (Mitte)
 * @param {number} [c.radius=26]
 * @param {{ol?:string, or?:string, ul?:string, ur?:string, um?:string}} c.plaetze  HTML je Platz (oben links … unten Mitte)
 * @param {string} [c.kernsatz='.bs-h1']  Selektor im Platz „ol“, der per Farbbalken erscheint
 * @param {string} [c.hinweis]      Kennzeichnung an der Karte, z. B. „KI-generiert“ (entfaellt, wenn der Hero selbst kennzeichnet)
 * @param {{pin?:string, buehne?:string}} [c.klassen]  Zusatzklassen fuer das Zusammenspiel mit dem Hero
 * @param {string} [c.id]
 * @param {(p:number)=>void} [c.onFortschritt]  0 … 1 ueber die ganze Strecke
 * @param {(p:number)=>void} [c.onSchrumpf]     0 … 1 waehrend des Schrumpfens (modus 'karte': waehrend der Abschnitt hereinfaehrt)
 * @param {'schrumpf'|'karte'} [c.modus='schrumpf']  'karte': die Buehne ist von Anfang an die Karte (eigene Buehne, z. B. ein
 *                                  eigener Hero im Kasten), nichts schrumpft; `weg` = kurze Rast, gepinnt (0 = nicht gepinnt)
 */
export function bildkarte(c) {
  const weg = c.weg ?? 3.6;
  const von = c.von ?? 0.52;
  const bis = c.bis ?? 0.8;
  const karte = { desktop: { ...STANDARD.desktop, ...c.karte?.desktop }, mobil: { ...STANDARD.mobil, ...c.karte?.mobil } };
  const P = c.plaetze || {};
  const alsKarte = c.modus === 'karte';

  const root = c.el || el('<section class="bs-bildkarte"></section>');
  root.classList.add('bs-bildkarte', 'bs-ton-dunkel');
  root.dataset.ton = 'dunkel';
  if (c.id) root.id = c.id;
  root.style.setProperty('--bs-weg', weg);
  root.classList.toggle('bs-bildkarte--karte', alsKarte);
  const mach = (eltern, klasse, tag = 'div', vorn = false) => {
    let n = qs(`:scope > .${klasse}`, eltern);
    if (!n) { n = document.createElement(tag); n.className = klasse; if (vorn) eltern.prepend(n); else eltern.appendChild(n); }
    return n;
  };
  const bahn = mach(root, 'bs-bildkarte__bahn');
  const pin = mach(bahn, 'bs-bildkarte__pin');
  const buehne = mach(pin, 'bs-bildkarte__buehne');
  const hinter = mach(pin, 'bs-bildkarte__hinter', 'div', true);
  const rahmen = mach(pin, 'bs-bildkarte__rahmen');
  rahmen.setAttribute('aria-hidden', 'true');
  rahmen.innerHTML = kiHinweis(c.hinweis);
  const text = mach(pin, 'bs-bildkarte__text');
  text.innerHTML = ORDNUNG.map((k) => (P[k] ? `<div class="bs-bildkarte__platz bs-bildkarte__platz--${k}" data-platz="${k}">${P[k]}</div>` : '')).join('');
  const nach = mach(root, 'bs-bildkarte__nach');
  nach.classList.add('bs-wrap');
  const marke = mach(root, 'bs-bildkarte__marke', 'i');
  marke.setAttribute('aria-hidden', 'true');
  marke.style.top = alsKarte ? '50vh' : `calc(${(weg * (von + (bis - von) * 0.62) + 1) * 100}vh)`;
  if (c.klassen?.pin) pin.classList.add(c.klassen.pin);
  if (c.klassen?.buehne) buehne.classList.add(c.klassen.buehne);

  // Mobil: alle Plaetze ausser dem Kernsatz laufen unter der gepinnten Ansicht weiter
  const sortieren = () => {
    const mobil = mobilMQ.matches && !reduced;
    (mobil ? ['ol'] : ORDNUNG).forEach((k) => { const p = qs(`[data-platz="${k}"]`, root); if (p) text.appendChild(p); });
    if (mobil) ['ul', 'ur', 'or', 'um'].forEach((k) => { const p = qs(`[data-platz="${k}"]`, root); if (p) nach.appendChild(p); });
  };

  function geometrie() {
    const W = pin.clientWidth;
    const H = pin.clientHeight;
    const k = mobilMQ.matches ? karte.mobil : karte.desktop;
    const ch = H * k.h;
    const s = ch / H;
    // Die Karte kann nicht breiter sein als die verkleinerte Buehne (schmale Bildschirme), sonst steht der Rahmen ueber
    const cw = Math.min(ch * k.verh, W * 0.84, alsKarte ? W : W * s);
    const ix = Math.max(0, (W - cw / s) / 2 / W * 100);
    const g = { s, ix, x: (k.x - 0.5) * W, y: (k.y - 0.5) * H, r: (c.radius ?? 26) / s };
    root.style.setProperty('--kx', `${k.x * W - cw / 2}px`);
    root.style.setProperty('--ky', `${k.y * H - ch / 2}px`);
    root.style.setProperty('--kw', `${cw}px`);
    root.style.setProperty('--kh', `${ch}px`);
    root.style.setProperty('--kmitte', `${k.y * H}px`);
    return g;
  }

  function start() {
    sortieren();
    mobilMQ.addEventListener('change', () => { sortieren(); ScrollTrigger.refresh(); });
    if (reduced) { geometrie(); window.addEventListener('resize', geometrie); c.onFortschritt?.(0); c.onSchrumpf?.(1); return; }
    if (alsKarte) { karteStarten(); return; }

    let g = geometrie();
    const d = bis - von;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: bahn, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true,
        onRefreshInit: () => { g = geometrie(); },
        onUpdate: (st) => {
          c.onFortschritt?.(st.progress);
          c.onSchrumpf?.(Math.min(1, Math.max(0, (st.progress - von) / d)));
        },
      },
    });
    tl.fromTo(buehne, { scale: 1, x: 0, y: 0, clipPath: 'inset(0% 0% 0% 0% round 0px)' },
      { scale: () => g.s, x: () => g.x, y: () => g.y, clipPath: () => `inset(0% ${g.ix}% 0% ${g.ix}% round ${g.r}px)`, ease: 'power2.inOut', duration: d }, von)
      .fromTo(rahmen, { opacity: 0 }, { opacity: 1, duration: d * 0.25 }, von + d * 0.75)
      .fromTo(text, { opacity: 0 }, { opacity: 1, duration: d * 0.3 }, von + d * 0.5)   // opacity: Links darin bleiben per Tab erreichbar
      .to({}, { duration: 1 - bis }, bis);
    c.onFortschritt?.(0);
    c.onSchrumpf?.(0);
    einspielen();
  }

  function einspielen() {
    // Kernsatz per Farbbalken, die uebrigen Plaetze gestaffelt von unten, einmalig beim Erreichen der Marke
    const kern = qs(c.kernsatz || '.bs-h1', text);
    const einmal = { trigger: marke, start: 'top bottom', once: true };
    if (kern) barReveal(kern, { trigger: marke, start: 'top bottom' });
    qsa('[data-platz]', text).forEach((p, i) => {
      const kinder = [...p.children].filter((n) => n !== kern);
      if (kinder.length) gsap.from(kinder, { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, delay: 0.2 + i * 0.08, scrollTrigger: einmal });
    });
    qsa('[data-platz]', nach).forEach((p) => {
      gsap.from(p.children, { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: p, start: 'top 88%', once: true } });
    });
  }

  // modus 'karte': Karte, Rahmen und Texte stehen von Anfang an; onSchrumpf meldet das Hereinfahren des Abschnitts
  function karteStarten() {
    geometrie();
    ScrollTrigger.create({ trigger: root, start: 'top bottom', end: 'top top', invalidateOnRefresh: true,
      onRefreshInit: geometrie, onUpdate: (st) => c.onSchrumpf?.(st.progress) });
    ScrollTrigger.create({ trigger: bahn, start: 'top top', end: 'bottom bottom', onUpdate: (st) => c.onFortschritt?.(st.progress) });
    c.onFortschritt?.(0);
    c.onSchrumpf?.(0);
    einspielen();
  }

  return { el: root, bahn, pin, buehne, hinter, rahmen, start };
}
