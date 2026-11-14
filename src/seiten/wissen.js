// /wissen – Ausguck (Paket C, Vorlage „Beweis“): Seitenkopf, „Aktuelle Einordnungen“ mit vier Einordnungen.
// Grosse Szene der Seite: die Kapital-Wolke der ersten Einordnung (Markt). Am Desktop gepinnt, der Scroll fuehrt Quartal fuer
// Quartal durch die 15 Quartale (Riesenzahl, Punktwolke, Balken, Saisontabelle laufen mit). Mobil und ohne Pin wie live:
// Animation startet, sobald die Grafik zu 35 % sichtbar ist. Reduced Motion: Endstand ohne Animation.
// Texte, Zahlen, Quellen und Zeichenregeln wortlich aus src/inhalt/wissen.js (KapitalWolke.tsx, page.tsx, kapital.ts).
import { kapitelseite, seitenkopf, weiterKapitel, esc, el, qs, qsa, reduced, gsap, ScrollTrigger } from './gemeinsam.js';
import * as W from '../inhalt/wissen.js';
import { KOPF as UEBER_MICH } from '../inhalt/ueber-mich.js';
import './wissen.css';

const S = kapitelseite();
S.main.append(seitenkopf(W.KOPF));

const D = W.EINORDNUNG_DARSTELLUNG;
const KW = W.KAPITAL_WOLKE;
const R = KW.regeln;
const Q = W.KAPITAL_QUARTALE;
const V = W.KAPITAL_VERGLEICHE;
const kum = W.kapitalKumuliert(Q);
const gesamt = kum.at(-1);
const maxQ = Math.max(...Q.map((x) => x.summe));
const de = (n) => n.toLocaleString('de-DE');

const folgeHtml = (e) => `<p class="nn-einordnung__folge"><b>${esc(D.folgeLabel)}</b>${esc(e.folge)}${e.link
  ? ` <a class="nn-einordnung__link" href="${esc(e.link.href)}">${esc(e.link.text)}${esc(D.linkNach)}</a>` : ''}</p>`;
const quelleHtml = (e) => `<p class="ks-quelle nn-einordnung__quelle">${esc(D.quelleLabel)}${esc(e.quelle)}</p>`;
const kopfHtml = (e, i) => `
  <p class="nn-einordnung__kopfzeile">${esc(D.kopfzeile(e))}</p>
  <h3 class="nn-einordnung__titel" id="einordnung-${i + 1}" data-reveal="bar">${esc(e.titel)}</h3>`;

/* ---------------- Abschnitt „Aktuelle Einordnungen“ ---------------- */
const ab = el(`
  <section class="nn-ausguck bs-ton-hell" data-ton="hell" id="einordnungen" aria-labelledby="einordnungen-titel">
    <div class="bs-wrap"><h2 class="ks-ab__titel nn-ausguck__titel" id="einordnungen-titel" data-reveal="bar">${esc(W.LISTE.h2)}</h2></div>
  </section>`);
S.main.append(ab);

/* ---------------- Einordnung 1 mit der Kapital-Wolke ---------------- */
const e1 = W.EINORDNUNGEN.find((e) => e.grafik === 'kapital');
const [achseVon, achseBis] = KW.achse(Q);
const kapital = el(`
  <article class="nn-kapital" aria-labelledby="einordnung-1">
    <div class="nn-kapital__bahn">
      <div class="nn-kapital__pin">
        <div class="bs-wrap nn-kapital__raster">
          <div class="nn-kapital__text">
            ${kopfHtml(e1, 0)}
            <p class="nn-einordnung__befund">${esc(e1.befund)}</p>
            <div class="nn-kapital__fortschritt" aria-hidden="true"><i></i></div>
          </div>
          <figure class="nn-kapital__grafik">
            <div class="nn-kapital__kopf">
              <span class="nn-kapital__summe">${esc(KW.summeText(gesamt))}</span>
              <span class="nn-kapital__stand">${esc(KW.standText(Q.at(-1).q))}</span>
            </div>
            <canvas class="nn-kapital__wolke" role="img" aria-label="${esc(KW.ariaLabel(gesamt, V))}"></canvas>
            <div class="nn-kapital__balken" aria-hidden="true">${Q.map((x) => `<i title="${esc(KW.balkenTitel(x))}" style="--h:${((x.summe / maxQ) * 100).toFixed(2)}%"></i>`).join('')}</div>
            <div class="nn-kapital__achse"><span>${esc(achseVon)}</span><button type="button" class="nn-kapital__nochmal">${esc(KW.knopf)}</button><span>${esc(achseBis)}</span></div>
          </figure>
        </div>
      </div>
    </div>
    <div class="bs-wrap nn-kapital__nach">
      ${folgeHtml(e1)}
      <dl class="nn-saison">${Q.map((x) => { const [q, wert] = KW.balkenTitel(x).split(': '); return `<div><dt>${esc(q)}</dt><dd>${esc(wert)}</dd></div>`; }).join('')}</dl>
      ${quelleHtml(e1)}
      <p class="ks-quelle nn-kapital__vermerk">${esc(W.KAPITAL_QUELLENVERMERK.quartale)}</p>
      <p class="ks-quelle nn-kapital__vermerk">${esc(W.KAPITAL_QUELLENVERMERK.vergleiche)}</p>
    </div>
  </article>`);
ab.append(kapital);

/* ---------------- Einordnungen 2–4 als Liste ---------------- */
const liste = el('<div class="bs-wrap nn-einordnungen"></div>');
W.EINORDNUNGEN.forEach((e, i) => {
  if (e === e1) return;
  liste.append(el(`
    <article class="nn-einordnung" aria-labelledby="einordnung-${i + 1}">
      <div class="nn-einordnung__kopf">${kopfHtml(e, i)}</div>
      <div class="nn-einordnung__inhalt" data-reveal="up">
        <p class="nn-einordnung__befund">${esc(e.befund)}</p>
        ${folgeHtml(e)}
        ${quelleHtml(e)}
      </div>
    </article>`));
});
ab.append(liste);

/* ---------------- Weiter zum naechsten Kapitel ---------------- */
S.main.append(weiterKapitel({ label: 'Weiter zum nächsten Kapitel', titel: UEBER_MICH.eyebrow, text: UEBER_MICH.h1, href: '/ueber-mich', ton: 'dunkel' }));

/* ---------------- Kapital-Wolke: Zeichnen (Regeln wie KapitalWolke.tsx) ---------------- */
const leinwand = qs('.nn-kapital__wolke', kapital);
const summeEl = qs('.nn-kapital__summe', kapital);
const standEl = qs('.nn-kapital__stand', kapital);
const balken = qsa('.nn-kapital__balken i', kapital);
const saison = qsa('.nn-saison > div', kapital);
const fortschrittEl = qs('.nn-kapital__fortschritt i', kapital);
const AKZENT = R.akzentRgb;
const GRAU = R.grauRgb;
const GOLD = Math.PI * (3 - Math.sqrt(5));   // R.goldenerWinkel
let zustand = { n: Q.length };               // gezeigte Quartale (kommazahlig = Quartal waechst gerade)

function aktuellBei(n) {
  const ganz = Math.floor(n);
  const rest = n - ganz;
  const basis = ganz > 0 ? kum[Math.min(ganz, Q.length) - 1] : 0;
  return ganz >= Q.length ? gesamt : basis + rest * Q[ganz].summe;
}

function zeichnen() {
  const n = Math.max(0, Math.min(Q.length, zustand.n));
  const stand = Math.ceil(n - 1e-6);                   // Quartale, die (teilweise) zu sehen sind
  const aktuell = aktuellBei(n);
  summeEl.textContent = KW.summeText(aktuell);
  standEl.textContent = KW.standText(stand > 0 ? Q[stand - 1].q : null);
  balken.forEach((b, i) => { b.className = i < stand ? (i === stand - 1 ? 'is-jetzt' : 'is-an') : ''; });
  saison.forEach((s, i) => { s.className = i < stand ? (i === stand - 1 ? 'is-jetzt' : 'is-an') : ''; });
  if (fortschrittEl) fortschrittEl.style.transform = `scaleX(${(n / Q.length).toFixed(4)})`;

  const ctx = leinwand.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = leinwand.clientWidth;
  if (!w || !ctx) return;
  if (leinwand.width !== Math.round(w * dpr)) { leinwand.width = Math.round(w * dpr); leinwand.height = Math.round(w * dpr); }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, w);
  const mitte = w / 2;
  const groesster = Math.max(gesamt, ...V.map((v) => v.mrd));
  const schritt = (w / 2 - 12) / Math.sqrt(groesster);          // Abstand so, dass alles hineinpasst
  const r = Math.max(0.8, schritt * 0.36);
  const punkte = Math.round(aktuell);
  for (let k = 0; k < punkte; k++) {
    const rad = schritt * Math.sqrt(k + 0.5);                    // R.punktRadius
    const a = k * GOLD;
    ctx.beginPath();
    ctx.arc(mitte + rad * Math.cos(a), mitte + rad * Math.sin(a), r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${AKZENT},${k > punkte - 40 ? 0.95 : 0.7})`;
    ctx.fill();
  }
  ctx.setLineDash([3, 4]);
  ctx.font = '500 12px "Inter Variable", Inter, sans-serif';
  V.forEach((v, i) => {
    const rad = schritt * Math.sqrt(v.mrd);                      // R.ringRadius: flaechentreu
    ctx.beginPath();
    ctx.arc(mitte, mitte, rad, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${GRAU},0.9)`;
    ctx.lineWidth = 1;
    ctx.stroke();
    const winkel = -Math.PI / 4 + i * (Math.PI / 2.2);
    const x = mitte + rad * Math.cos(winkel);
    const y = mitte + rad * Math.sin(winkel);
    const txt = KW.ringText(v);
    const tw = ctx.measureText(txt).width;
    const links = Math.cos(winkel) < 0;
    const tx = Math.min(w - tw - 6, Math.max(6, links ? x - 8 - tw : x + 8));
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.fillRect(tx - 5, y - 11, tw + 10, 18);
    ctx.fillStyle = '#2E4F57';
    ctx.textAlign = 'left';
    ctx.fillText(txt, tx, y + 2);
    ctx.setLineDash([3, 4]);
  });
  ctx.setLineDash([]);
}
new ResizeObserver(() => zeichnen()).observe(leinwand);

/* ---------------- Kapital-Wolke: Ablauf ---------------- */
const PIN = '(min-width: 992px) and (min-height: 620px)';
const pinnen = () => !reduced && window.matchMedia(PIN).matches;
let lauf = null;          // laufende Zeit-Animation (live: Quartal fuer Quartal; „↻ noch einmal“)
let scrollN = Q.length;   // Stand aus dem Scroll (nur gepinnt)
function abspielen() {
  lauf?.kill();
  if (reduced) { zustand.n = Q.length; zeichnen(); return; }
  zustand.n = 0;
  zeichnen();
  // live: alle R.msJeQuartal ms ein Quartal, Start nach R.startVerzoegerungMs; hier als gleichmaessiges Wachsen
  lauf = gsap.to(zustand, { n: Q.length, duration: (Q.length * R.msJeQuartal) / 1000, delay: R.startVerzoegerungMs / 1000, ease: 'none', onUpdate: zeichnen,
    onComplete: () => { lauf = null; if (gepinnt) { zustand.n = scrollN; zeichnen(); } } });
}
qs('.nn-kapital__nochmal', kapital).addEventListener('click', abspielen);
// Pin gleich beim Aufbau festlegen (Hoehe der Strecke steht, bevor ScrollTrigger misst)
let gepinnt = pinnen();
kapital.classList.toggle('is-gepinnt', gepinnt);

S.nachStart(() => {
  zeichnen();
  if (reduced) return;
  // NN-WR-13: Pin und Ablauf folgen der Fenstergroesse (Drehen, Fenster verkleinern), wie in ai-engineering.js
  gsap.matchMedia().add({ pin: PIN, frei: 'not all and (min-width: 992px) and (min-height: 620px)' }, (mmk) => {
    gepinnt = mmk.conditions.pin;
    kapital.classList.toggle('is-gepinnt', gepinnt);
    return gepinnt ? pinAufbauen() : freiAufbauen();
  });
  // Einspielung der Saisontabelle: Zellen per Clip von unten
  gsap.from(saison, { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.8, ease: 'expo.out', stagger: 0.03, clearProps: 'clipPath',
    scrollTrigger: { trigger: qs('.nn-saison', kapital), start: 'top 90%', once: true } });
});

function pinAufbauen() {
  // Scroll fuehrt: von 4 % bis 84 % der Strecke laufen die 15 Quartale durch, danach steht der Endstand
  ScrollTrigger.create({
    trigger: qs('.nn-kapital__bahn', kapital), start: 'top top', end: 'bottom bottom',
    onUpdate: (s) => {
      scrollN = Math.min(1, Math.max(0, (s.progress - 0.04) / 0.8)) * Q.length;
      if (!lauf) { zustand.n = scrollN; zeichnen(); }
    },
    onRefresh: (s) => { scrollN = Math.min(1, Math.max(0, (s.progress - 0.04) / 0.8)) * Q.length; if (!lauf) { zustand.n = scrollN; zeichnen(); } },
  });
}

function freiAufbauen() {
  // wie live: einmal abspielen, sobald die Grafik zu R.sichtbarAb sichtbar ist
  zustand.n = 0;
  zeichnen();
  const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; io.disconnect(); abspielen(); }, { threshold: R.sichtbarAb });
  io.observe(leinwand);
  return () => io.disconnect();
}
window.__kapital = { zustand, zeichnen, abspielen };   // fuer die Pruefung

S.fertig();
