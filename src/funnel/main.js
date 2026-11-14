// Startseite des NeuralNautic-Funnels (Vorlage „Buehne“): Seitenrahmen und die Plaetze L1–L12.
// Alle Inhalte kommen aus src/inhalt/start.js, alle Bausteine aus @kern/bausteine, Hero und Ganzkoerper-Szene
// aus @kern/hero (werden nachgeladen, three.js steckt nur in deren Chunk).
import '@fontsource-variable/inter-tight';
import '@fontsource-variable/inter';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
// @kern/base.css und @kern/hero/hero.css laedt index.html per <link> (src/funnel/kritisch.css)
import {
  gsap, ScrollTrigger, reduced, initScroll, autoWire, pageTransitions, prefetchOnHover,
} from '@kern/motion.js';
import {
  kopf, menue, preloader, laufband, logowirbel, sternfahrt, bildkarte, manifest, quergalerie, feldTitel, feldText, feldZahl, feldBild, feldFilm, feldPaar, feldBuehne, feldZitat,
  weiche, videoVorhang, karten, callout, store, check, nachweise, faecher, fusskarte, hilfen,
} from '@kern/bausteine/index.js';
import './funnel.css';
import * as I from '../inhalt/start.js';

const { esc, knopf, ziel, el, qs } = hilfen;
const param = new URLSearchParams(location.search);
const main = document.getElementById('inhalt');
const lenis = initScroll();
const starten = [];   // start()-Funktionen der Bausteine, laufen nach document.fonts.ready
const teil = (b) => { if (b.start) starten.push(() => b.start()); return b; };

/* ---------------- Seitenrahmen: Kopf, Menue, Seitenwechsel ---------------- */
const k = kopf(I.KOPF);
document.body.prepend(k.el, k.fortschritt);
document.body.prepend(document.querySelector('.bs-sprung'));   // Sprunglink bleibt das erste Tab-Ziel
const m = menue({ ...I.MENUE, knopf: k.menueKnopf, lenis, still: reduced });
k.el.after(m.el);
pageTransitions();
prefetchOnHover();
// Sprungziele auf dieser Seite (z. B. das Hero-Widget zum Reifegrad-Check): weich scrollen, Fokus mitnehmen
document.addEventListener('click', (e) => {
  const a = e.target.closest?.('a[href^="#"]');
  const ziel = a && a.getAttribute('href').length > 1 && document.getElementById(a.getAttribute('href').slice(1));
  if (!ziel) return;
  e.preventDefault();
  if (lenis) lenis.scrollTo(ziel, { duration: 1.6, force: true, offset: -window.innerHeight * 0.12 }); else ziel.scrollIntoView();
  ziel.setAttribute('tabindex', '-1');
  ziel.focus({ preventScroll: true });
});

/* ---------------- L2 + L3: Hero, schrumpft zur Bildkarte im Logo-Wirbel ---------------- */
const E = I.EINSTIEG;
// Eine Strecke fuer Hero und Bildkarte (Anteile am Scrollweg):
//   0,00-0,33 Zurueckzoomen, Ganzkoerper baut sich auf        0,33-0,57 Drehung links -> frontal -> rechts -> frontal
//   0,36-0,50 Umwandlung zum Exo                             0,57-0,62 das Exo steht frontal
//   0,62-0,80 die Buehne schrumpft zur Karte, dabei laeuft die Exo-Kante zurueck (0,64-0,78): in der Karte steht
//             wieder der echte Frank im Ganzkoerper, die Mausspur legt das Exo frei, im Leerlauf laeuft der Scan
const BK = { von: 0.62, bis: 0.8 };
const HERO_PHASEN = { zoomBis: 0.33, druckVon: 0.14, druckBis: 0.33, umVon: 0.36, umBis: 0.5, drehVon: 0.33, drehBis: 0.57, rueckVon: 0.64, rueckBis: 0.78, ruheAb: 0.82 };
const HERO_DREHUNG = ['links', 'frontal', 'rechts', 'frontal'];
// Logos frei auf dem Grund, gross; hinter der Karte ruecken wartende Logos nach
const wirbel = logowirbel({ ...I.WIRBEL, hoehe: 0.4, versteck: () => (parseFloat(getComputedStyle(bk.el).getPropertyValue('--kw')) || 0) * 0.32 });
window.__wirbel = wirbel;
let wirbelGeladen = false;
const bk = teil(bildkarte({
  el: document.getElementById('start'),
  weg: 4.6, von: BK.von, bis: BK.bis,
  klassen: { pin: 'hero__pin', buehne: 'hero__buehne' },
  plaetze: {
    ol: `<h1 class="bs-h1">${esc(E.h1[0])}<br /><em>${esc(E.h1[1])}</em></h1>`,
    ul: `<p class="nn-satz">${E.satz}</p>
         <p class="bs-klein">${esc(E.quelle.text)} · <a href="${esc(E.quelle.link.href)}">${esc(E.quelle.link.text)}</a></p>`,
    ur: `${knopf(E.cta)}<p class="nn-beruhigung">${esc(E.beruhigung)}</p>`,
    or: `<p class="nn-beleg">${esc(E.beleg)}</p>
         <div class="nn-belege">
           ${E.links.map((l) => `<a class="nn-pille" href="${esc(l.href)}">${esc(l.text)}</a>`).join('')}
           ${I.ZERTIFIKATE.map((z) => `<a class="nn-mini" ${ziel({ href: z.href, extern: true })} title="${esc(z.titel)}" aria-label="${esc(z.titel)}"><img data-src="${esc(z.bild)}" alt="" width="36" height="36" /></a>`).join('')}
         </div>`,
    um: `<p class="bs-klein">${esc(I.WIRBEL.hinweis)}</p>`,
  },
  onFortschritt: (p) => {
    bk.el.classList.toggle('is-unterwegs', p > 0.03);
    if (!wirbelGeladen && p > 0.12) nachladen();
  },
  onSchrumpf: (p) => wirbel.setEin((p - 0.25) / 0.75),
}));
bk.hinter.appendChild(wirbel.el);
starten.push(() => wirbel.start());
function nachladen() {
  wirbelGeladen = true;
  wirbel.laden();
  bk.el.querySelectorAll('img[data-src]').forEach((im) => { im.src = im.dataset.src; });
}
if (reduced) starten.push(nachladen);

// Bedienelemente ueber dem Hero: Widget unten links (Lando: Next-Race-Karte), Scroll-Hinweis
const heroUi = el(`
  <div class="nn-hero-ui">
    <a class="nn-widget" href="${esc(I.WIDGET.href)}">
      <span class="nn-widget__lasche">${esc(I.WIDGET.lasche)}</span>
      <span class="nn-widget__zahl" aria-hidden="true"><b>${esc(I.WIDGET.zahl)}</b><small>${esc(I.WIDGET.einheit)}</small></span>
      <span class="nn-widget__text">${esc(I.WIDGET.text)}</span>
    </a>
    <p class="nn-scrollen" aria-hidden="true"><span></span>Scrollen</p>
  </div>`);
bk.pin.appendChild(heroUi);

/* ---------------- L4: Manifest ---------------- */
main.append(manifest({ ...I.MANIFEST, id: 'manifest' }).el);

/* ---------------- L5: Kurs, Crew, Schiff und die 7 Schichten, quer laufend ---------------- */
const M = I.METHODE;
const S = I.SCHICHTEN;
const lagen = ['oben', 'unten', 'mitte'];
const qg = teil(quergalerie({
  id: 'methode',
  ariaLabel: M.titel,
  felder: [
    feldTitel({ titel: esc(M.titel), text: esc(M.text), weiter: 'weiter scrollen' }),
    feldText({ gross: M.teile[0].name, klein: M.teile[0].fach, claim: M.teile[0].claim, text: M.teile[0].desc, lage: 'oben' }),
    // Bild bei Kurs: der NN-Kompassstern sucht seinen Kurs durch das neuronale Netz (Baustein sternfahrt, unten)
    feldBuehne({ name: 'kurs', form: 'hoch', lage: 'unten' }),
    feldText({ gross: M.teile[1].name, klein: M.teile[1].fach, claim: M.teile[1].claim, text: M.teile[1].desc, lage: 'mitte' }),
    // Bild bei Crew: Mensch + Agent. Frank und das Exo im Ganzkoerper, gleich gross, unten buendig, dazwischen ein Plus.
    // Zwei ruhige Bilder ohne Scroll-Effekt (Frank, 14.11.2026); Mensch links, Agent rechts.
    feldPaar({ links: I.bild('ganzFoto', 1000), rechts: I.bild('ganzExo', 1000), zeichen: 'plus', hinweis: I.KI, lage: 'mitte' }),
    feldText({ gross: M.teile[2].name, klein: M.teile[2].fach, claim: M.teile[2].claim, text: M.teile[2].desc, lage: 'unten' }),
    // Bild bei Schiff: das NeuralNautic-Schiff in Fahrt (kurzer Film in Schleife)
    feldFilm({ ...I.SCHIFF_FILM, form: 'gross', lage: 'oben' }),
    feldZitat({ link: M.link, lage: 'unten' }),
    feldTitel({ titel: esc(S.titel) }),
    // Architektur-Grafik der sieben Schichten: baut sich Schicht fuer Schicht von unten nach oben auf
    feldBild({ ...S.bild, form: 'hoch', lage: 'mitte', position: '50% 0%', aufbau: 7 }),
    ...S.schichten.map(([nr, titel, text], i) => feldZahl({ nr, titel, text, lage: lagen[i % 3] })),
    feldZitat({ link: S.link, lage: 'mitte' }),
  ],
}));
main.append(qg.el);

/* ---------------- L6: Weiche, L7: der Film als Vorhang darueber ---------------- */
const W = I.WEGE;
const wch = teil(weiche({ id: 'wege', titel: esc(W.titel), links: W.links, rechts: W.rechts, bildHinweis: I.KI }));
const film = teil(videoVorhang({ ...I.FILM, id: 'film' }));
wch.danach.appendChild(film.el);
main.append(wch.el);

/* ---------------- L8: die 8 Leistungen als Karten, in der Mitte die Ganzkoerper-Szene ---------------- */
const L = I.LEISTUNGEN;
let szene = null;
let kartenP = 0;
const kt = teil(karten({
  id: 'leistungen',
  titel: esc(L.titel), text: L.text,
  karten: L.karten.map((c) => ({ ...c, href: `/leistungen#${c.anker}` })),
  figur: L.figur, ergebnisLabel: L.ergebnisLabel, mehr: L.mehr, cta: L.cta, alle: W.alle,
  auftakt: 0.7,   // Positionswechsel: die Figur kommt von rechts in die Mitte, erst dann erscheinen die rechten Karten
  lenis,
  onFortschritt: (p) => { kartenP = p; szene?.setFortschritt(p); },
}));
main.append(kt.el);

/* ---------------- L9: Callout Werkzeuge ---------------- */
main.append(callout({ id: 'werkzeuge', satz: true, label: W.werkzeuge.titel, titel: esc(W.werkzeuge.text), knopf: { text: W.werkzeuge.knopf, href: W.werkzeuge.href } }).el);

/* ---------------- L10: Store-Platz ---------------- */
const st = store({ ...I.STORE, titel: esc(I.STORE.titel) });
const rc = check(I.CHECK);
st.platz.appendChild(rc.el);
main.append(st.el);
window.__check = rc;   // fuer qa/start/check_test.py

/* ---------------- L11: wer dahintersteht, Zertifikate, Partner-Laufband ---------------- */
const V = I.VERTRAUEN;
const nw = nachweise({ id: 'nachweise', titel: esc(V.titel), text: V.text, link: V.link, belege: I.ZERTIFIKATE, bandLabel: V.partnerLabel });
const band = teil(laufband({
  ariaLabel: V.partnerLabel, lenis, tempo: 46,
  eintraege: V.partner.map((p) => `<a ${ziel({ href: p.href, extern: true })} aria-label="${esc(p.name)}"><img data-src="${esc(p.logo)}" alt="${esc(p.name)}" width="${p.w}" height="${p.h}" style="height:${p.h}px" /></a>`),
}));
nw.band.appendChild(band.el);
// Partner-Logos erst kurz vor Sichtbarkeit anfordern (loading=lazy greift im Laufband nicht verlaesslich)
new IntersectionObserver(([e], io) => { if (e.isIntersecting) { io.disconnect(); nw.el.querySelectorAll('img[data-src]').forEach((im) => { im.src = im.dataset.src; }); } }, { rootMargin: '150% 0px' }).observe(nw.el);
main.append(nw.el);

/* ---------------- L12: Faecher zu den Kanaelen, Abschluss, Fusskarte ---------------- */
main.append(teil(faecher({ ...I.KANAELE, id: 'kanaele' })).el);
const A = I.ABSCHLUSS;
main.append(callout({ id: 'abschluss', ton: 'hell', gross: true, logo: A.logo, titel: esc(A.titel), text: A.text, knopf: A.cta, klein: A.beruhigung }).el);
const fuss = fusskarte(I.FUSS);
const fussBand = teil(laufband({ art: 'schrift', lenis, tempo: 70, eintraege: [`${esc(I.SITE.name)} ·`] }));
fuss.band.appendChild(fussBand.el);
main.after(fuss.el, k.daumen);

/* ---------------- L1: Preloader, dann Bewegung verdrahten ---------------- */
const heroBild = qs('.hero__bild img', bk.buehne);
const bildDa = heroBild ? (heroBild.complete ? Promise.resolve() : new Promise((r) => { heroBild.addEventListener('load', r, { once: true }); heroBild.addEventListener('error', r, { once: true }); })) : Promise.resolve();
const offen = preloader(document.querySelector('[data-lader]'), { bereit: bildDa, still: reduced, maxWarten: 300, dauer: 0.5 });

document.fonts.ready.then(() => {
  autoWire(document);
  starten.forEach((f) => f());
  ScrollTrigger.refresh();
  k.messen();
  window.__bereit = true;   // fuer die Pruefskripte in qa/start
});

/* ---------------- Hero und Ganzkoerper-Szene nachladen ---------------- */
// Schnittstelle: funnel-vorlage/docs/HERO.md. Der Hero teilt sich die Strecke der Bildkarte (bk.bahn) und
// bekommt eigene Phasengrenzen; die Szene sitzt im Figurenplatz der Karten und wird von aussen gefuehrt.
async function heroStarten() {
  if (param.get('hero') === 'aus') return;
  try {
    const [{ createHero }, { default: figuren }] = await Promise.all([import('@kern/hero/hero.js'), import('../../figuren.json')]);
    window.__hero = createHero(bk.bahn, { figuren, lenis, phasen: HERO_PHASEN, ganzAnsichten: HERO_DREHUNG });
  } catch (e) {
    console.warn('[funnel] Hero nicht geladen, das Standbild bleibt stehen:', e?.message || e);
  }
}
// Positionswechsel (HERO.md, ablauf.bahn): Im Auftakt der Leistungen steht die Figur als Mensch rechts, wo die zweite
// Kartenspalte noch fehlt, schaut nach links zu Titel und ersten Karten, wandert in die Mitte und wird dabei zum Exo.
// Danach steht sie frontal, je Karte leuchtet ein Bauteil. Am Desktop liegt die Szene in der breiten Buehne hinter den
// Karten, mobil im Figurenplatz, der oben stehen bleibt.
let szeneModul = null;
function szeneBauen() {
  if (!szeneModul) return;
  const { createSzene, figuren } = szeneModul;
  szene?.dispose?.();
  document.querySelectorAll('.nn-szene').forEach((n) => n.remove());
  const mobil = hilfen.mobilMQ.matches;
  const n = L.karten.length;
  const a = mobil ? 0.14 : kt.auftakt;
  const von = (i) => a + (1 - a) * (0.02 + (i / n) * 0.965);
  const punkte = L.karten.map((c, i) => ({ von: von(i), bis: von(i + 1), x: c.teil.x / 100, y: c.teil.y / 100, r: 0.075 }));
  let platz = { x: 0.5, y: 0.5, hoehe: 0.88 };
  let xStart = 0.72;
  if (!mobil) {
    const P = kt.pin.getBoundingClientRect();
    const F = kt.feld.getBoundingClientRect();
    const Rr = kt.el.querySelector('.bs-karten__spalte--r').getBoundingClientRect();
    const Lg = Math.min(P.height, P.width / 1.5);
    platz = { x: 0.5, y: (F.top + F.height / 2 - P.top) / P.height, hoehe: (F.height * 0.93) / Lg };
    xStart = (Rr.left + Rr.width / 2 - P.left) / P.width;
  }
  const el2 = document.createElement('div');
  el2.className = 'nn-szene';
  (mobil ? kt.figur : kt.buehne).prepend(el2);
  kt.el.classList.toggle('is-breit', !mobil);
  kt.figur.classList.toggle('is-szene', mobil);
  szene = createSzene(el2, {
    figuren, szene: I.LEISTUNGEN.szene, steuerung: 'extern', spur: true,
    ablauf: {
      bahn: [{ bei: 0, x: xStart }, { bei: a * 0.18, x: xStart }, { bei: a * 0.92, x: 0.5 }, { bei: 1, x: 0.5 }],
      ansichten: [{ bei: 0, ansicht: 'links' }, { bei: a * 0.95, ansicht: 'frontal' }],
      exo: [{ von: a * 0.4, bis: a * 0.95, zu: 1 }],
      punkte,
    },
    platz: { desktop: platz, mobil: platz },
    grund: getComputedStyle(document.documentElement).getPropertyValue(mobil ? '--bs-dunkel' : '--bs-flaeche').trim(),
  });
  szene.setFortschritt(kartenP);
  window.__szene = szene;
}
async function szeneStarten() {
  if (param.get('hero') === 'aus' || reduced) return;   // Reduced Motion: Standbild mit Marker
  try {
    const [{ createSzene }, { default: figuren }] = await Promise.all([import('@kern/hero/szene.js'), import('../../figuren.json')]);
    szeneModul = { createSzene, figuren };
    szeneBauen();
    hilfen.mobilMQ.addEventListener('change', szeneBauen);
  } catch (e) {
    console.warn('[funnel] Ganzkörper-Szene nicht geladen, das Standbild bleibt stehen:', e?.message || e);
  }
}
// ---------------- L5: die Bilder der Quer-Galerie ----------------
// Kurs:   Baustein sternfahrt. Der NN-Kompassstern wandert durch das neuronale Netz; das Scrolltempo fuehrt ihn leicht mit.
// Crew:   feldPaar, zwei ruhige Bilder mit Plus (oben), kein Skript.
// Schiff: feldFilm, das Schiff in Fahrt (oben). Die Architektur-Grafik baut sich im Kapitel der sieben Schichten auf.
// Die Sternfahrt entsteht erst, wenn die Galerie naeher kommt, und wird wieder freigegeben, wenn sie weit weg ist.
let galerie = null;
function galerieAn() {
  if (galerie || !qg.buehnen.kurs) return;
  const stern = sternfahrt({ signet: { src: '/brand/nn-stern-2026-10-kompass.png' }, farbe: '63,212,224', schub: () => (lenis ? lenis.velocity : 0) });
  qg.buehnen.kurs.appendChild(stern.el);
  stern.start();   // bei Reduced Motion: Netz-Standbild, Stern an fester Stelle
  galerie = { stern };
}
function galerieAus() {
  if (!galerie) return;
  galerie.stern.dispose();
  galerie.stern.el.remove();
  galerie = null;
}
new IntersectionObserver(([e]) => { if (e.isIntersecting) galerieAn(); }, { rootMargin: '120% 0px' }).observe(qg.el);
new IntersectionObserver(([e]) => { if (!e.isIntersecting) galerieAus(); }, { rootMargin: '320% 0px' }).observe(qg.el);
window.__galerie = () => galerie;

offen.then(heroStarten);
// Seitenwechsel: WebGL freigeben (HERO.md)
window.addEventListener('pagehide', (e) => { if (!e.persisted) { window.__hero?.dispose?.(); szene?.dispose?.(); galerieAus(); } });
// die Szene erst, wenn der Abschnitt naeher kommt
new IntersectionObserver(([e], io) => { if (e.isIntersecting) { io.disconnect(); szeneStarten(); } }, { rootMargin: '200% 0px' }).observe(kt.el);
