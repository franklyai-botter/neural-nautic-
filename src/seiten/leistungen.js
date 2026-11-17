// /leistungen (Welle 2, Paket B). Vorlage „Karten, die sich oeffnen“ (Lando: Helm-Galerie gross), STRUKTUR-VORSCHLAG 4/6.
// Alle Texte woertlich aus src/inhalt/leistungen.js (Live: app/leistungen/page.tsx). Rahmen aus ./gemeinsam.js (Paket A).
//
// Aufbau: Seitenkopf mit Sprungleiste (8 Pillen) · die grosse Szene: 8 Leistungskarten, daneben am Desktop eine
// gepinnte Leiste (position: sticky) mit rollender Nummer 01–08, dem Titel der aktiven Leistung und dem Verzeichnis
// samt Fortschritt · Abschluss „Sprechen wir über Ihren nächsten KI-Schritt.“ · Weiter zum naechsten Kapitel · Fusskarte.
// Jede Karte oeffnet sich beim Hereinscrollen (Clip von unten, dann das Detailfeld per Ellipse): Langtext,
// Haekchenliste, Ergebnis, Knopf und Zusatzlink stehen vollstaendig im Text, nichts ist hinter einem Klick versteckt.
// Anker: id = start.js → LEISTUNGEN.karten[].anker (die Startseite verlinkt /leistungen#<anker>).
import '@kern/base.css';
import { kapitelseite, seitenkopf, weiterKapitel, gsap, ScrollTrigger, reduced, esc, el, qs, qsa, knopf, hilfen } from './gemeinsam.js';
import { callout } from '@kern/bausteine/index.js';
import './leistungen.css';
import * as L from '../inhalt/leistungen.js';
import { LEISTUNGEN as START_LEISTUNGEN, MENUE } from '../inhalt/start.js';
import { KOPF as KOPF_NAECHSTES } from '../inhalt/ki-im-unternehmen.js';

const S = kapitelseite();
const n = L.LEISTUNGEN.length;

// Sprungziele: dieselben Anker, auf die die Startseite (L8) zeigt. Fehlt einer, entsteht er aus dem Titel.
const ANKER = Object.fromEntries(START_LEISTUNGEN.karten.map((k) => [k.titel, k.anker]));
const anker = (titel) => ANKER[titel] || titel.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const STERN = '/brand/nn-stern-kompass-128.png';

/* ---------------- Seitenkopf: Eyebrow, H1, Einleitung, darunter die 8 Leistungen als Sprungleiste ---------------- */
S.main.append(seitenkopf({ ...L.KOPF, sprung: L.LEISTUNGEN.map((s) => ({ text: s.title, href: `#${anker(s.title)}` })) }));

/* ---------------- Die grosse Szene: Leiste (gepinnt) + 8 Karten ---------------- */
const karte = (s, i) => {
  const id = anker(s.title);
  return `
    <article class="nn-l" id="${esc(id)}" aria-labelledby="${esc(id)}-titel" data-i="${i}">
      <div class="nn-l__kopf">
        <p class="nn-l__nr"><img src="${STERN}" alt="" width="20" height="20" decoding="async" loading="lazy" /><span>${esc(L.KARTE.nummer(i))}</span></p>
        <h2 class="nn-l__titel" id="${esc(id)}-titel">${esc(s.title)}</h2>
        <p class="nn-l__kurz">${esc(s.short)}</p>
      </div>
      <div class="nn-l__detail">
        <p class="nn-l__lang">${esc(s.long)}</p>
        <div class="nn-l__unten">
          <ul class="nn-l__liste">${s.items.map((t) => `<li><span class="nn-l__haken" aria-hidden="true">${esc(L.KARTE.haken)}</span><span>${esc(t)}</span></li>`).join('')}</ul>
          <div class="nn-l__seite">
            <p class="nn-l__erg"><b>${esc(L.KARTE.ergebnisLabel)}</b>${esc(s.result)}</p>
            <div class="nn-l__wege">
              ${knopf({ ...L.KARTE.cta, klasse: 'nn-l__cta' })}
              ${s.more ? hilfen.textlink({ text: `${s.more.label}${L.KARTE.zusatzlinkNach}`, href: s.more.href }, 'nn-l__mehr') : ''}
            </div>
          </div>
        </div>
      </div>
    </article>`;
};
const [nr0] = L.KARTE.nummer(0);   // erste Ziffer der Nummer („0“), steht fest; die zweite rollt
const szene = el(`
  <section class="nn-ls bs-ton-dunkel" data-ton="dunkel" id="alle-leistungen" aria-label="${esc(L.KOPF.eyebrow)}">
    <div class="bs-wrap nn-ls__raster">
      <div class="nn-ls__leiste">
        <p class="nn-ls__zahl" aria-hidden="true"><span>${esc(nr0)}</span><span class="nn-ls__fenster"><span class="nn-ls__rolle">${L.LEISTUNGEN.map((_, i) => `<span>${esc(L.KARTE.nummer(i).slice(1))}</span>`).join('')}</span></span></p>
        <p class="nn-ls__aktiv" aria-hidden="true"><span>${esc(L.LEISTUNGEN[0].title)}</span></p>
        <nav class="nn-ls__index" aria-label="${esc(L.KOPF.eyebrow)}">
          <span class="nn-ls__spur" aria-hidden="true"><i></i></span>
          <ol>${L.LEISTUNGEN.map((s, i) => `<li><a class="nn-ls__link" href="#${esc(anker(s.title))}" data-i="${i}"><small>${esc(L.KARTE.nummer(i))}</small><span>${esc(s.title)}</span></a></li>`).join('')}</ol>
        </nav>
      </div>
      <div class="nn-ls__karten">${L.LEISTUNGEN.map(karte).join('')}</div>
    </div>
  </section>`);
S.main.append(szene);

const karten = qsa('.nn-l', szene);
const indexLinks = qsa('.nn-ls__index a', szene);
const rolle = qs('.nn-ls__rolle', szene);
const aktivTitel = qs('.nn-ls__aktiv', szene);
const spur = qs('.nn-ls__spur i', szene);
let aktiv = -1;

function setAktiv(i) {
  if (i === aktiv || i < 0) return;
  const vorher = aktiv;
  aktiv = i;
  rolle.style.transform = `translateY(${-i}em)`;            // Ziffer rollt (CSS-Uebergang, bei Reduced Motion sofort)
  indexLinks.forEach((a, k) => a.classList.toggle('is-aktiv', k === i));
  karten.forEach((k, j) => k.classList.toggle('is-aktiv', j === i));
  const neu = el(`<span>${esc(L.LEISTUNGEN[i].title)}</span>`);
  if (reduced || vorher < 0) { aktivTitel.replaceChildren(neu); return; }
  const alt = aktivTitel.firstElementChild;
  const r = i > vorher ? 1 : -1;
  aktivTitel.append(neu);
  gsap.fromTo(neu, { yPercent: 105 * r }, { yPercent: 0, duration: 0.7, ease: 'expo.out' });
  if (alt) gsap.to(alt, { yPercent: -105 * r, duration: 0.5, ease: 'expo.out', onComplete: () => alt.remove() });
}
setAktiv(0);

// Lenis kennt die Seitenhoehe noch vom leeren <main> und klemmt den Sprung per Anker (#ki-architektur) sonst auf 0:
// vor dem Sprung in fertig() neu messen. (Gehoert eigentlich in gemeinsam.js, an Paket A gemeldet.)
S.nachStart(() => S.lenis?.resize?.());

S.nachStart(() => {
  // Aktive Leistung = die Karte, die die Fenstermitte kreuzt
  karten.forEach((k, i) => ScrollTrigger.create({
    trigger: k, start: 'top 55%', end: 'bottom 55%',
    onToggle: (st) => { if (st.isActive) setAktiv(i); },
  }));
  // Fortschritt im Verzeichnis
  ScrollTrigger.create({
    trigger: qs('.nn-ls__karten', szene), start: 'top 55%', end: 'bottom 55%',
    onUpdate: (st) => { spur.style.transform = `scaleY(${st.progress.toFixed(4)})`; },
  });
  if (reduced) { spur.style.transform = 'scaleY(1)'; return; }
  // Karten oeffnen sich: Karte per Clip von unten, dann das Detailfeld per Ellipse von oben, darin die Zeilen gestaffelt
  karten.forEach((k) => {
    const detail = qs('.nn-l__detail', k);
    const kopfTeile = [...qs('.nn-l__kopf', k).children];
    const zeilen = [qs('.nn-l__lang', k), ...qsa('.nn-l__liste li', k), qs('.nn-l__erg', k), qs('.nn-l__wege', k)];
    const tl = gsap.timeline({ paused: true })
      .fromTo(k, { clipPath: 'inset(100% 0% 0% 0% round 16px)' }, { clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: 1.05, ease: 'expo.inOut', clearProps: 'clipPath' })
      .fromTo(kopfTeile, { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out', stagger: 0.07 }, 0.42)
      .fromTo(detail, { clipPath: 'ellipse(70% 0% at 50% 0%)' }, { clipPath: 'ellipse(150% 160% at 50% 0%)', duration: 1.0, ease: 'expo.inOut', clearProps: 'clipPath' }, 0.62)
      .fromTo(zeilen, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out', stagger: 0.035 }, 0.86);
    ScrollTrigger.create({ trigger: k, start: 'top 88%', once: true, onEnter: () => tl.play() });
    // Uebersprungen (Sprung per Anker nach unten): sofort fertig zeigen, damit beim Hochscrollen nichts leer ist
    ScrollTrigger.create({ trigger: k, start: 'bottom top', once: true, onEnter: () => tl.progress(1) });
  });
});

/* ---------------- Abschluss und Weiter zum naechsten Kapitel ---------------- */
const A = L.ABSCHLUSS;
S.main.append(callout({ id: 'abschluss', titel: esc(A.h2), text: A.text, knopf: A.cta, satz: true }).el);
const nachher = MENUE.eintraege[MENUE.eintraege.findIndex((e) => e.href === L.ROUTE) + 1];
S.main.append(weiterKapitel({ label: 'Nächstes Kapitel', titel: nachher.text, text: KOPF_NAECHSTES.h1, href: nachher.href }));

S.fertig();
window.__leistungen = { setAktiv, get aktiv() { return aktiv; } };   // fuer qa/leistungen
