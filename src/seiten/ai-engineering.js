// /ai-engineering (Welle 2, Paket B). Vorlage „Strecke“ (Lando: Calendar), STRUKTUR-VORSCHLAG 4/6.
// Alle Texte woertlich aus src/inhalt/ai-engineering.js (Live: app/ai-engineering/page.tsx). Rahmen aus ./gemeinsam.js.
//
// Aufbau: Seitenkopf · Der Unterschied (Vergleichstabelle mit Hover, hell) · Risikoklassen (Tabelle, 2 Klassen
// hervorgehoben) · die grosse Szene: 5 Stationen als Strecke mit 5 nummerierten Kurven, gepinnt (position: sticky);
// beim Scrollen zeichnet sich die Strecke, ein Punkt faehrt sie ab, die erreichte Station leuchtet · Was Sie bekommen
// (4 Karten, hell) · Abschluss „Lösung anfragen“ → /kontakt · Weiter zum naechsten Kapitel · Fusskarte.
import '@kern/base.css';
import { kapitelseite, seitenkopf, abschnitt, weiterKapitel, teileHtml, gsap, ScrollTrigger, reduced, esc, el, qs, qsa } from './gemeinsam.js';
import { callout } from '@kern/bausteine/index.js';
import './ai-engineering.css';
import * as I from '../inhalt/ai-engineering.js';
import { MENUE } from '../inhalt/start.js';
import { KOPF as KOPF_NAECHSTES } from '../inhalt/ki-tool-kompass.js';

const S = kapitelseite();
// Lenis misst die Seitenhoehe vor dem Sprung per Anker neu (sonst Sprung auf 0; gehoert in gemeinsam.js, gemeldet)
S.nachStart(() => S.lenis?.resize?.());

/* ---------------- Seitenkopf ---------------- */
S.main.append(seitenkopf({ ...I.KOPF, sprung: [
  { text: I.UNTERSCHIED.kicker, href: '#unterschied' }, { text: I.RISIKOKLASSEN.kicker, href: '#risikoklassen' },
  { text: I.STATIONEN.kicker, href: '#stationen' }, { text: I.ERGEBNIS.kicker, href: '#ergebnis' },
] }));

/* ---------------- 1 Der Unterschied: Vergleichstabelle ---------------- */
const U = I.UNTERSCHIED;
const T1 = U.tabelle;
const a1 = abschnitt({ id: 'unterschied', kicker: U.kicker, titel: U.h2, intro: U.text, ton: 'hell' });
a1.inhalt.append(el(`
  <div class="nn-tab-w">
    <table class="nn-tab nn-vergleich" aria-label="${esc(T1.ariaLabel)}">
      <thead><tr>${T1.spalten.map((s, i) => `<th scope="col"${i === 2 ? ' class="nn-tab__hervor"' : ''}>${s ? esc(s) : '<span class="sr-only">–</span>'}</th>`).join('')}</tr></thead>
      <tbody>${T1.zeilen.map((z) => `
        <tr>
          <th scope="row">${esc(z.dim)}</th>
          <td><span class="nn-ml">${esc(T1.mobilLabels.vibe)}</span>${esc(z.vibe)}</td>
          <td class="nn-tab__hervor"><span class="nn-ml">${esc(T1.mobilLabels.eng)}</span>${esc(z.eng)}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`));
a1.inhalt.append(el(`<p class="nn-nachsatz" data-reveal="bar">${esc(U.nachsatz)}</p>`));
S.main.append(a1.el);

/* ---------------- 2 Risikoklassen: wann es Engineering braucht ---------------- */
const R = I.RISIKOKLASSEN;
const T2 = R.tabelle;
const a2 = abschnitt({ id: 'risikoklassen', kicker: R.kicker, titel: R.h2, intro: R.text, ton: 'dunkel' });
a2.inhalt.append(el(`
  <div class="nn-tab-w">
    <table class="nn-tab nn-risiko" aria-label="${esc(T2.ariaLabel)}">
      <thead><tr>${T2.spalten.map((s) => `<th scope="col">${esc(s)}</th>`).join('')}</tr></thead>
      <tbody>${T2.zeilen.map((z) => `
        <tr${z.wir ? ' class="is-wir"' : ''}>
          <th scope="row">${esc(z.klasse)}</th>
          <td><span class="nn-ml">${esc(T2.mobilLabels.loesung)}</span>${esc(z.loesung)}</td>
          <td><span class="nn-ml">${esc(T2.mobilLabels.wer)}</span>${esc(z.wer)}</td>
          <td><span class="nn-ml">${esc(T2.mobilLabels.pruefung)}</span>${esc(z.pruefung)}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`));
a2.inhalt.append(el(`
  <div class="nn-hinweise">
    ${R.hinweise.map((h, i) => `<p class="nn-hinweis${i === 0 ? ' nn-hinweis--wir' : ''}">${esc(h)}</p>`).join('')}
    <p class="nn-satzlink">${teileHtml(R.abschluss)}</p>
  </div>`));
S.main.append(a2.el);

/* ---------------- 3 Stationen: Strecke mit 5 nummerierten Kurven (die grosse Szene) ---------------- */
const ST = I.STATIONEN;
const N = ST.liste.length;
// Kurvenpunkte der Strecke (viewBox 400 x 1000): abwechselnd links und rechts, dazwischen weiche Boegen
const K = [[78, 140], [322, 320], [78, 500], [322, 680], [78, 860]].slice(0, N);
const START = [200, 8]; const ZIEL = [200, 992];
const punkte = [START, ...K, ZIEL];
const pfad = punkte.reduce((d, p, i) => {
  if (!i) return `M${p[0]},${p[1]}`;
  const v = punkte[i - 1];
  const dy = (p[1] - v[1]) * 0.62;
  return `${d} C${v[0]},${v[1] + dy} ${p[0]},${p[1] - dy} ${p[0]},${p[1]}`;
}, '');
const szene = el(`
  <section class="nn-st bs-ton-dunkel" data-ton="dunkel" id="stationen" aria-labelledby="stationen-titel">
    <div class="bs-wrap nn-st__kopf">
      <p class="bs-label" data-reveal="bar">${esc(ST.kicker)}</p>
      <h2 class="ks-ab__titel" id="stationen-titel" data-reveal="bar">${esc(ST.h2)}</h2>
      <p class="ks-ab__intro" data-reveal="bar" data-delay="0.12">${esc(ST.text)}</p>
    </div>
    <div class="nn-st__bahn" style="--n:${N}">
      <div class="nn-st__pin">
        <div class="bs-wrap nn-st__raster">
          <div class="nn-st__strecke" aria-hidden="true">
            <svg viewBox="0 0 400 1000" preserveAspectRatio="xMidYMid meet">
              <path class="nn-st__grund" d="${pfad}" />
              <path class="nn-st__spur" d="${pfad}" pathLength="1" />
              ${K.map(([x, y], i) => `<g class="nn-st__kurve" data-i="${i}" transform="translate(${x} ${y})"><circle r="30" /><text text-anchor="middle" dy="7">${esc(ST.liste[i].n)}</text></g>`).join('')}
              <circle class="nn-st__wagen" r="9" cx="${START[0]}" cy="${START[1]}" />
            </svg>
          </div>
          <ol class="nn-st__liste">${ST.liste.map((s, i) => `
            <li class="nn-station" data-i="${i}">
              <span class="nn-station__nr" aria-hidden="true">${esc(s.n)}</span>
              <div>
                <h3 class="nn-station__titel">${esc(s.title)}</h3>
                <p class="nn-station__text">${esc(s.desc)}</p>
                <p class="nn-station__erg"><span aria-hidden="true">${esc(ST.darstellung.haken)}</span> <b>${esc(ST.darstellung.ergebnisLabel)}</b>${esc(s.result)}</p>
              </div>
            </li>`).join('')}
          </ol>
        </div>
      </div>
    </div>
  </section>`);
S.main.append(szene);

const svgPfad = qs('.nn-st__grund', szene);
const spur = qs('.nn-st__spur', szene);
const wagen = qs('.nn-st__wagen', szene);
const kurven = qsa('.nn-st__kurve', szene);
const stationen = qsa('.nn-station', szene);
let laenge = 0; let anteile = [];
function messen() {
  laenge = svgPfad.getTotalLength();
  // Anteil der Streckenlaenge an jeder Kurve (Abtastung)
  anteile = K.map(([x, y]) => {
    let best = 0; let d = Infinity;
    for (let s = 0; s <= 400; s++) { const p = svgPfad.getPointAtLength((s / 400) * laenge); const q = (p.x - x) ** 2 + (p.y - y) ** 2; if (q < d) { d = q; best = s / 400; } }
    return best;
  });
}
function setFortschritt(p) {
  const f = Math.max(0, Math.min(1, p));
  spur.style.strokeDashoffset = String(1 - f);
  szene.style.setProperty('--p', f.toFixed(4));   // senkrechte Linie ohne Pin
  const pt = svgPfad.getPointAtLength(f * laenge);
  wagen.setAttribute('cx', pt.x.toFixed(1)); wagen.setAttribute('cy', pt.y.toFixed(1));
  let aktiv = -1;
  anteile.forEach((a, i) => { if (f >= a - 0.004) aktiv = i; });
  kurven.forEach((k, i) => { k.classList.toggle('is-erreicht', i <= aktiv); k.classList.toggle('is-aktiv', i === aktiv); });
  stationen.forEach((s, i) => { s.classList.toggle('is-erreicht', i <= aktiv); s.classList.toggle('is-aktiv', i === aktiv); });
}
messen();
const gepinnt = () => window.matchMedia('(min-width: 992px) and (min-height: 760px)').matches;
S.nachStart(() => {
  messen();
  if (reduced) { szene.classList.add('is-still'); setFortschritt(1); return; }
  const mm = gsap.matchMedia();
  // Desktop: Abschnitt steht (sticky), die Strecke zeichnet sich ueber die Bahn
  mm.add('(min-width: 992px) and (min-height: 760px)', () => {
    const st = ScrollTrigger.create({ trigger: qs('.nn-st__bahn', szene), start: 'top top', end: 'bottom bottom', onUpdate: (s) => setFortschritt(s.progress * 1.06 - 0.02) });
    return () => st.kill();
  });
  // Klein: nichts gepinnt, die Strecke zeichnet sich beim Durchscrollen der Liste
  mm.add('not all and (min-width: 992px) and (min-height: 760px)', () => {
    const st = ScrollTrigger.create({ trigger: qs('.nn-st__liste', szene), start: 'top 70%', end: 'bottom 60%', onUpdate: (s) => setFortschritt(s.progress) });
    return () => st.kill();
  });
});
setFortschritt(0);
window.__stationen = { setFortschritt, gepinnt };

/* ---------------- 4 Was Sie bekommen: 4 Karten ---------------- */
const E = I.ERGEBNIS;
const a4 = abschnitt({ id: 'ergebnis', kicker: E.kicker, titel: E.h2, intro: E.text, ton: 'hell' });
a4.inhalt.append(el(`
  <div class="nn-erg">
    <ul class="nn-erg__karten">${E.karten.map((k, i) => `
      <li class="nn-erg__karte"><span class="nn-erg__nr" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h3>${esc(k.title)}</h3><p>${esc(k.desc)}</p></li>`).join('')}
    </ul>
    <p class="nn-satzlink">${teileHtml(E.verweis)}</p>
  </div>`));
S.main.append(a4.el);
S.nachStart(() => {
  if (reduced) return;
  const karten = qsa('.nn-erg__karte', a4.el);
  gsap.fromTo(karten, { clipPath: 'inset(100% 0% 0% 0% round 14px)', y: 40 }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', y: 0, duration: 1.05, ease: 'expo.inOut', stagger: 0.08, clearProps: 'clipPath,transform',
    scrollTrigger: { trigger: qs('.nn-erg__karten', a4.el), start: 'top 85%', once: true } });
});

/* ---------------- Abschluss und Weiter zum naechsten Kapitel ---------------- */
const A = I.ABSCHLUSS;
S.main.append(callout({ id: 'abschluss', titel: esc(A.h2), text: A.text, knopf: A.cta, satz: true }).el);
const nachher = MENUE.eintraege[MENUE.eintraege.findIndex((e) => e.href === I.ROUTE) + 1];
S.main.append(weiterKapitel({ label: 'Nächstes Kapitel', titel: nachher.text, text: KOPF_NAECHSTES.h1, href: nachher.href }));

S.fertig();
