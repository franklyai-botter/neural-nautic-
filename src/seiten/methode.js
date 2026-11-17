// /methode – KI im Projekt (Vorlage „Strecke“, Lando Calendar). Texte wortlich aus src/inhalt/methode.js.
// Grosse Szene der Seite: die fuenf Phasen als Strecke mit fuenf nummerierten Kurven. Am Desktop gepinnt: die Linie
// zeichnet sich beim Scrollen, an jeder Kurve erscheint die Phase daneben. Mobil und bei Reduced Motion: senkrechte
// Strecke, nichts gepinnt. Danach sechs Prinzipien als Liste mit Hover, Abschluss, weiter zum naechsten Kapitel.
import { kapitelseite, seitenkopf, abschnitt, ebenenmodell, weiterKapitel, gsap, ScrollTrigger, reduced, esc, el, qs, qsa } from './gemeinsam.js';
import { callout } from '@kern/bausteine/index.js';
import * as I from '../inhalt/methode.js';
import { KOPF as AIE_KOPF } from '../inhalt/ai-engineering.js';
import './methode.css';

const S = kapitelseite();
const main = S.main;

/* ---------------- Seitenkopf, darunter das Ebenenmodell (aktiv: Projekt) ---------------- */
main.append(seitenkopf(I.KOPF));
main.append(el(`<section class="ks-ab bs-ton-dunkel me-ebenen" data-ton="dunkel" aria-label="${esc(I.EBENENMODELL.titel)}"><div class="bs-wrap"></div></section>`));
qs('.me-ebenen .bs-wrap', main).append(ebenenmodell(I.EBENENMODELL, I.EBENENMODELL_AKTIV));

/* ---------------- Fuenf Phasen als Strecke ---------------- */
const P = I.PHASEN;
const D = I.PHASE_DARSTELLUNG;
// Strecke im SVG (viewBox 0 0 600 900): fuenf Kurven im Wechsel rechts/links, an jedem Scheitel die Nummer
const PFAD = 'M300,0 C430,0 480,60 470,100 C455,170 200,190 130,280 C70,360 420,370 470,460 C520,550 180,560 130,640 C80,720 430,740 470,820 C490,870 380,900 300,900';
const SCHEITEL = [[470, 100], [130, 280], [470, 460], [130, 640], [470, 820]];
const phase = (p, i) => `
  <article class="me-phase" data-i="${i}">
    <p class="me-phase__nr" aria-hidden="true">${esc(p.n)}</p>
    <h2 class="me-phase__titel"><span class="sr-only">${esc(p.n)} </span>${esc(p.title)}</h2>
    <p class="me-phase__text">${esc(p.desc)}</p>
    <p class="me-phase__erg"><b aria-hidden="true">${esc(D.haken)}</b><span>${esc(D.ergebnisLabel)}${esc(p.result)}</span></p>
  </article>`;
const strecke = el(`
  <section class="me-strecke bs-ton-dunkel" data-ton="dunkel" id="phasen" aria-label="${esc(P.map((p) => p.title).join(', '))}">
    <div class="me-strecke__bahn">
      <div class="me-strecke__pin">
        <div class="bs-wrap me-strecke__raster">
          <div class="me-strecke__karte" aria-hidden="true">
            <svg viewBox="0 0 600 900" preserveAspectRatio="xMidYMid meet">
              <path class="me-strecke__strasse" d="${PFAD}" />
              <path class="me-strecke__mitte" d="${PFAD}" />
              <path class="me-strecke__linie" d="${PFAD}" />
              ${SCHEITEL.map(([x, y], i) => `<g class="me-kurve" data-i="${i}"><circle cx="${x}" cy="${y}" r="30" /><text x="${x}" y="${y + 6}" text-anchor="middle">${esc(P[i].n)}</text></g>`).join('')}
              <circle class="me-strecke__wagen" r="9" cx="300" cy="0" />
            </svg>
          </div>
          <div class="me-strecke__phasen">${P.map(phase).join('')}</div>
          <ol class="me-strecke__leiste" aria-hidden="true">${P.map((p, i) => `<li data-i="${i}"><b>${esc(p.n)}</b><span>${esc(p.title)}</span></li>`).join('')}</ol>
        </div>
      </div>
    </div>
  </section>`);
main.append(strecke);

/* ---------------- Sechs Prinzipien ---------------- */
{
  const R = I.PRINZIPIEN;
  const a = abschnitt({ id: 'prinzipien', titel: R.h2, ton: 'hell', klasse: 'me-prinzipien' });
  a.inhalt.append(el(`
    <ul class="ks-tabelle me-prinzipien__liste" data-reveal="up">
      ${R.liste.map((x, i) => `<li class="ks-tabelle__zeile"><h3 class="ks-tabelle__kopf"><span class="me-prinzipien__nr" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${esc(x.title)}</h3><p class="ks-tabelle__text">${esc(x.desc)}</p></li>`).join('')}
    </ul>`));
  main.append(a.el);
}

/* ---------------- Abschluss, weiter zum naechsten Kapitel ---------------- */
main.append(callout({ id: 'abschluss', titel: esc(I.ABSCHLUSS.h2), knopf: I.ABSCHLUSS.cta, satz: true }).el);
main.append(weiterKapitel({ label: 'Nächstes Kapitel', titel: 'AI Engineering', text: AIE_KOPF.h1, href: '/ai-engineering' }));

/* ---------------- Strecke verdrahten ---------------- */
const mq = window.matchMedia('(min-width: 992px) and (min-height: 620px)');
const svg = qs('svg', strecke);
const linie = qs('.me-strecke__linie', svg);
const wagen = qs('.me-strecke__wagen', svg);
const phasen = qsa('.me-phase', strecke);
const kurven = qsa('.me-kurve', svg);
const leiste = qsa('.me-strecke__leiste li', strecke);
const L = linie.getTotalLength();
// Laenge der Linie an jedem Scheitel (naechster Punkt auf dem Pfad)
const scheitelLaenge = SCHEITEL.map(([x, y]) => {
  let best = 0; let d = Infinity;
  for (let s = 0; s <= L; s += 2) { const q = linie.getPointAtLength(s); const dd = (q.x - x) ** 2 + (q.y - y) ** 2; if (dd < d) { d = dd; best = s; } }
  return best;
});
// Knoten: bei p = 0,1 / 0,3 / … / 0,9 erreicht die Linie Scheitel 1 … 5, bei p = 1 das Ende
const KP = [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1];
const KL = [0, ...scheitelLaenge, L];
let aktiv = -1;
function setze(p) {
  let k = 1; while (k < KP.length - 1 && p > KP[k]) k++;
  const t = Math.min(1, Math.max(0, (p - KP[k - 1]) / (KP[k] - KP[k - 1])));
  const len = KL[k - 1] + (KL[k] - KL[k - 1]) * t;
  linie.style.strokeDashoffset = String(L - len);
  const q = linie.getPointAtLength(Math.max(0.01, len));
  wagen.setAttribute('cx', q.x.toFixed(1)); wagen.setAttribute('cy', q.y.toFixed(1));
  let i = 0; scheitelLaenge.forEach((s, n) => { if (len >= s - 1) i = n; });
  kurven.forEach((g, n) => g.classList.toggle('is-erreicht', len >= scheitelLaenge[n] - 1));
  if (i !== aktiv) {
    aktiv = i;
    phasen.forEach((ph, n) => ph.classList.toggle('is-aktiv', n === i));
    leiste.forEach((li, n) => li.classList.toggle('is-aktiv', n === i));
  }
}
linie.style.strokeDasharray = String(L);
let st = null;
function einrichten() {
  st?.kill(); st = null;
  const gepinnt = !reduced && mq.matches;
  strecke.classList.toggle('is-gepinnt', gepinnt);
  if (!gepinnt) { linie.style.strokeDashoffset = '0'; kurven.forEach((g) => g.classList.add('is-erreicht')); phasen.forEach((ph) => ph.classList.add('is-aktiv')); wagen.style.display = 'none'; aktiv = -1; return; }
  wagen.style.display = '';
  phasen.forEach((ph) => ph.classList.remove('is-aktiv'));
  aktiv = -1;
  setze(0);
  st = ScrollTrigger.create({ trigger: qs('.me-strecke__bahn', strecke), start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: (s) => setze(s.progress) });
  window.__strecke = st;   // fuer qa
}
S.nachStart(() => {
  einrichten();
  mq.addEventListener('change', () => { einrichten(); ScrollTrigger.refresh(); });
  // mobil / ohne Pin: die Phasen spielen einzeln ein
  if (!reduced && !mq.matches) phasen.forEach((ph) => gsap.fromTo(ph, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: ph, start: 'top 88%', once: true } }));
});
S.fertig();
