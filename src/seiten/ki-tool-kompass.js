// /ki-tool-kompass (Welle 2, Paket B). Vorlage „Strecke“ als Liste (Lando: Calendar-Liste), STRUKTUR-VORSCHLAG 4/6.
// Alle Texte woertlich aus src/inhalt/ki-tool-kompass.js (Live: app/ki-tool-kompass/page.tsx). Rahmen aus ./gemeinsam.js.
//
// Aufbau: Seitenkopf · die grosse Szene: 11 Werkzeugkategorien als Zeilen mit Hover, daneben gepinnt (position: sticky)
// der NN-Kompassstern, der seinen Kurs durch das neuronale Netz sucht (Baustein sternfahrt, wie L5 der Startseite) ·
// 11 Bewertungskriterien als Akkordeon (hell) · Kaufen oder bauen (ganze Karte ist ein Link) · Abschluss → /kontakt ·
// Weiter zum naechsten Kapitel · Fusskarte.
import '@kern/base.css';
import { kapitelseite, seitenkopf, abschnitt, weiterKapitel, gsap, reduced, esc, el, qs, qsa } from './gemeinsam.js';
import { callout, sternfahrt } from '@kern/bausteine/index.js';
import './ki-tool-kompass.css';
import * as I from '../inhalt/ki-tool-kompass.js';
import { MENUE } from '../inhalt/start.js';
import { KOPF as KOPF_NAECHSTES } from '../inhalt/wissen.js';

const S = kapitelseite();
// Lenis misst die Seitenhoehe vor dem Sprung per Anker neu (sonst Sprung auf 0; gehoert in gemeinsam.js, gemeldet)
S.nachStart(() => S.lenis?.resize?.());
const zwei = (i) => String(i + 1).padStart(2, '0');

/* ---------------- Seitenkopf ---------------- */
S.main.append(seitenkopf({ ...I.KOPF, sprung: [
  { text: I.KATEGORIEN.h2, href: '#kategorien' }, { text: I.KRITERIEN.h2, href: '#kriterien' }, { text: I.BRUECKE.kicker, href: '#bruecke' },
] }));

/* ---------------- Die grosse Szene: Kategorien mit dem Stern im Netz ---------------- */
const KA = I.KATEGORIEN;
const szene = el(`
  <section class="nn-kat bs-ton-dunkel" data-ton="dunkel" id="kategorien" aria-labelledby="kategorien-titel">
    <div class="bs-wrap nn-kat__raster">
      <div class="nn-kat__leiste">
        <h2 class="ks-ab__titel nn-kat__titel" id="kategorien-titel" data-reveal="bar">${esc(KA.h2)}</h2>
        <div class="nn-kat__buehne" aria-hidden="true"></div>
      </div>
      <ol class="nn-kat__liste">${KA.liste.map((k, i) => `
        <li class="nn-kat__zeile"><span class="nn-kat__nr" aria-hidden="true">${zwei(i)}</span><span class="nn-kat__name">${esc(k)}</span></li>`).join('')}
      </ol>
    </div>
  </section>`);
S.main.append(szene);
const buehne = qs('.nn-kat__buehne', szene);
let stern = null;
function sternAn() {
  if (stern) return;
  stern = sternfahrt({ signet: { src: '/brand/nn-stern-2026-10-kompass.png' }, farbe: '63,212,224', staerke: 2, schub: () => (S.lenis ? S.lenis.velocity : 0) });
  buehne.appendChild(stern.el);
  stern.start();   // Reduced Motion: Netz-Standbild, Stern an fester Stelle
}
function sternAus() { if (!stern) return; stern.dispose(); stern.el.remove(); stern = null; }
S.nachStart(() => {
  new IntersectionObserver(([e]) => { if (e.isIntersecting) sternAn(); }, { rootMargin: '100% 0px' }).observe(szene);
  new IntersectionObserver(([e]) => { if (!e.isIntersecting) sternAus(); }, { rootMargin: '250% 0px' }).observe(szene);
  if (reduced) return;
  // Zeilen steigen nacheinander auf (Clip von unten), die Nummer folgt
  qsa('.nn-kat__zeile', szene).forEach((z) => {
    gsap.fromTo(z, { clipPath: 'inset(0% 0% 100% 0%)', y: 24 }, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 0.9, ease: 'expo.out', clearProps: 'clipPath,transform',
      scrollTrigger: { trigger: z, start: 'top 92%', once: true } });
  });
});
window.addEventListener('pagehide', (e) => { if (!e.persisted) sternAus(); });
window.__stern = () => stern;

/* ---------------- 11 Bewertungskriterien als Akkordeon ---------------- */
const KR = I.KRITERIEN;
const a2 = abschnitt({ id: 'kriterien', titel: KR.h2, ton: 'hell' });
a2.inhalt.append(el(`
  <div class="ks-akk nn-krit">${KR.liste.map((k, i) => `
    <details class="ks-akk__teil"${i === 0 ? ' open' : ''}>
      <summary><span class="nn-krit__frage"><b>${esc(k.n)}</b><span>${esc(k.q)}</span></span><span class="ks-akk__plus" aria-hidden="true"></span></summary>
      <div class="ks-akk__inhalt"><p class="nn-krit__text">${esc(k.desc)}</p></div>
    </details>`).join('')}
  </div>`));
S.main.append(a2.el);
// Aufklappen weich (Hoehe), Reduced Motion: sofort
if (!reduced) {
  qsa('details', a2.el).forEach((d) => {
    const inhalt = qs('.ks-akk__inhalt', d);
    qs('summary', d).addEventListener('click', (e) => {
      e.preventDefault();
      if (d.open) {
        gsap.to(inhalt, { height: 0, opacity: 0, duration: 0.45, ease: 'expo.inOut', onComplete: () => { d.open = false; gsap.set(inhalt, { clearProps: 'height,opacity' }); } });
      } else {
        d.open = true;
        gsap.fromTo(inhalt, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.6, ease: 'expo.out', clearProps: 'height,opacity' });
      }
    });
  });
}

/* ---------------- Kaufen oder bauen: Bruecke zu AI Engineering ---------------- */
const B = I.BRUECKE;
const titel = B.titel.replace(/\s*→$/, '');   // Pfeil wie live am Titelende, als eigenes Zeichen gesetzt
S.main.append(el(`
  <section class="nn-br bs-ton-hell" data-ton="hell" id="bruecke" aria-label="${esc(B.kicker)}">
    <div class="bs-wrap">
      <a class="nn-br__karte" href="${esc(B.href)}">
        <span class="nn-br__fuellung" aria-hidden="true"></span>
        <span class="bs-label nn-br__kicker">${esc(B.kicker)}</span>
        <span class="nn-br__titel">${esc(titel)}${titel !== B.titel ? ' <i aria-hidden="true">→</i>' : ''}</span>
        <span class="nn-br__text">${esc(B.text)}</span>
      </a>
    </div>
  </section>`));

/* ---------------- Abschluss und Weiter zum naechsten Kapitel ---------------- */
const A = I.ABSCHLUSS;
S.main.append(callout({ id: 'abschluss', titel: esc(A.h2), text: A.text, knopf: A.cta, satz: true }).el);
const nachher = MENUE.eintraege[MENUE.eintraege.findIndex((e) => e.href === I.ROUTE) + 1];
S.main.append(weiterKapitel({ label: 'Nächstes Kapitel', titel: nachher.text, text: KOPF_NAECHSTES.h1, href: nachher.href }));

S.fertig();
