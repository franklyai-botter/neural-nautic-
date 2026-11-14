// Startseite des NeuralNautic-Funnels (Vorlage „Buehne“): Seitenrahmen und die Plaetze L1–L12.
// Alle Inhalte kommen aus src/inhalt/start.js, alle Bausteine aus @kern/bausteine, Hero und Ganzkoerper-Szene
// aus @kern/hero (werden nachgeladen, three.js steckt nur in deren Chunk).
import '@fontsource-variable/inter-tight';
import '@fontsource-variable/inter';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
// @kern/base.css und @kern/hero/hero.css laedt index.html per <link> (src/funnel/kritisch.css)
import {
  ScrollTrigger, reduced, initScroll, autoWire, pageTransitions, prefetchOnHover,
} from '@kern/motion.js';
import {
  kopf, menue, preloader, laufband, logowirbel, bildkarte, manifest, quergalerie, feldTitel, feldText, feldZahl, feldBild, feldZitat,
  weiche, videoVorhang, karten, callout, store, nachweise, faecher, fusskarte, hilfen,
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

/* ---------------- L2 + L3: Hero, schrumpft zur Bildkarte im Logo-Wirbel ---------------- */
const E = I.EINSTIEG;
const wirbel = logowirbel(I.WIRBEL);
let wirbelGeladen = false;
const bk = teil(bildkarte({
  el: document.getElementById('start'),
  weg: 3.9, von: 0.5, bis: 0.76,
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
  onSchrumpf: (p) => wirbel.setEin((p - 0.3) / 0.7),
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
main.append(teil(quergalerie({
  id: 'methode',
  ariaLabel: M.titel,
  felder: [
    feldTitel({ titel: esc(M.titel), text: esc(M.text), weiter: 'weiter scrollen' }),
    feldText({ gross: M.teile[0].name, klein: M.teile[0].fach, claim: M.teile[0].claim, text: M.teile[0].desc, lage: 'oben' }),
    feldBild({ src: '/bilder/frank-hero-links-1000.webp', w: 1000, h: 563, form: 'hoch', lage: 'unten', hinweis: I.KI, position: '24% 30%' }),
    feldText({ gross: M.teile[1].name, klein: M.teile[1].fach, claim: M.teile[1].claim, text: M.teile[1].desc, lage: 'mitte' }),
    feldBild({ src: '/bilder/frank-ganzkoerper-dunkelblau-640.webp', w: 640, h: 960, form: 'klein', lage: 'oben', ton: true, hinweis: I.KI, position: '50% 12%' }),
    feldText({ gross: M.teile[2].name, klein: M.teile[2].fach, claim: M.teile[2].claim, text: M.teile[2].desc, lage: 'unten' }),
    feldBild({ src: '/bilder/exoskelett-portraet-rechts-1000.webp', w: 1000, h: 563, form: 'gross', lage: 'mitte', hinweis: I.KI }),
    feldZitat({ link: M.link, lage: 'unten' }),
    feldTitel({ titel: esc(S.titel) }),
    feldBild({ ...S.bild, form: 'hoch', lage: 'mitte', position: '50% 0%' }),
    ...S.schichten.map(([nr, titel, text], i) => feldZahl({ nr, titel, text, lage: lagen[i % 3] })),
    feldZitat({ link: S.link, lage: 'mitte' }),
  ],
})).el);

/* ---------------- L6: Weiche, L7: der Film als Vorhang darueber ---------------- */
const W = I.WEGE;
const wch = teil(weiche({ id: 'wege', titel: esc(W.titel), links: W.links, rechts: W.rechts, bildHinweis: I.KI }));
const film = teil(videoVorhang({ ...I.FILM, id: 'film' }));
wch.danach.appendChild(film.el);
main.append(wch.el);

/* ---------------- L8: die 8 Leistungen als Karten, in der Mitte die Ganzkoerper-Szene ---------------- */
const L = I.LEISTUNGEN;
let szene = null;
const kt = teil(karten({
  id: 'leistungen',
  titel: esc(L.titel), text: L.text,
  karten: L.karten.map((c) => ({ ...c, href: `/leistungen#${c.anker}` })),
  figur: L.figur, ergebnisLabel: L.ergebnisLabel, mehr: L.mehr, cta: L.cta, alle: W.alle,
  lenis,
  onFortschritt: (p) => { if (szene && hilfen.mobilMQ.matches) szene.test({ scroll: p }); },
}));
main.append(kt.el);

/* ---------------- L9: Callout Werkzeuge ---------------- */
main.append(callout({ id: 'werkzeuge', satz: true, label: W.werkzeuge.titel, titel: esc(W.werkzeuge.text), knopf: { text: W.werkzeuge.knopf, href: W.werkzeuge.href } }).el);

/* ---------------- L10: Store-Platz ---------------- */
main.append(store({ ...I.STORE, titel: esc(I.STORE.titel), id: 'ki-check' }).el);

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
// Schnittstelle: funnel-vorlage/docs/HERO.md. Beide teilen sich die Strecke ihres Bausteins:
// der Hero die der Bildkarte (bk.bahn), die Szene die der Karten (kt.bahn).
async function heroStarten() {
  if (param.get('hero') === 'aus') return;
  try {
    const [{ createHero }, { default: figuren }] = await Promise.all([import('@kern/hero/hero.js'), import('../../figuren.json')]);
    window.__hero = createHero(bk.bahn, { figuren, lenis });
  } catch (e) {
    console.warn('[funnel] Hero nicht geladen, das Standbild bleibt stehen:', e?.message || e);
  }
}
async function szeneStarten() {
  if (param.get('hero') === 'aus') return;
  try {
    const [{ createSzene }, { default: figuren }] = await Promise.all([import('@kern/hero/szene.js'), import('../../figuren.json')]);
    const n = L.karten.length;
    // je Leistung leuchtet ein Bauteil: gleiche Schritte wie die Karten (karten.js: 2 % Vorlauf, 1,5 % Nachlauf)
    const punkte = L.karten.map((c, i) => ({ von: 0.02 + (i / n) * 0.965, bis: 0.02 + ((i + 1) / n) * 0.965, x: c.teil.x / 100, y: c.teil.y / 100, r: 0.075 }));
    const buehne = document.createElement('div');
    buehne.className = 'szene__buehne';
    kt.figur.prepend(buehne);
    kt.pin.classList.add('szene__pin');
    szene = createSzene(kt.bahn, {
      figuren, szene: I.LEISTUNGEN.szene, spur: true,
      ablauf: { punkte },
      platz: { desktop: { x: 0.5, y: 0.5, hoehe: 1.98 }, mobil: { x: 0.5, y: 0.5, hoehe: 0.88 } },
      grund: getComputedStyle(document.documentElement).getPropertyValue('--bs-dunkel').trim(),
    });
    kt.figur.classList.add('is-szene');
    window.__szene = szene;
  } catch (e) {
    console.warn('[funnel] Ganzkörper-Szene nicht geladen, das Standbild bleibt stehen:', e?.message || e);
  }
}
offen.then(heroStarten);
// Seitenwechsel: WebGL freigeben (HERO.md)
window.addEventListener('pagehide', (e) => { if (!e.persisted) { window.__hero?.dispose?.(); szene?.dispose?.(); } });
// die Szene erst, wenn der Abschnitt naeher kommt
new IntersectionObserver(([e], io) => { if (e.isIntersecting) { io.disconnect(); szeneStarten(); } }, { rootMargin: '200% 0px' }).observe(kt.el);
