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
  kopf, menue, preloader, laufband, logowirbel, sternfahrt, bildkarte, manifest, quergalerie, feldTitel, feldText, feldZahl, feldBild, feldFilm, feldBuehne, feldZitat,
  weiche, videoVorhang, karten, callout, store, check, nachweise, faecher, fusskarte, hilfen,
} from '@kern/bausteine/index.js';
import './funnel.css';
import * as I from '../inhalt/start.js';
import figuren from '../../figuren.json';

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

/* ---------------- L2: Hero (nur Portraet), Schnitt, L3: Bildkarte als eigene Buehne im Logo-Wirbel ---------------- */
const E = I.EINSTIEG;
// L2: Der Hero zeigt nur das Portraet. Scrollen wandelt Frank zum Exo (Kante vom Kopf zu den Schultern); Mausspur,
// Leerlauf-Scan und Ansichten folgen der Maus wie am Seitenanfang. Kein Zurueckzoomen, kein Ganzkoerper. Strecke:
//   0,03-0,50 Umwandlung zum Exo     0,50-0,55 das Exo steht
//   0,55-1,00 Schnitt: L3 faehrt als Vorhang mit Visier-Bogen ueber den stehenden Hero (kein Morphen)
const HERO_HOEHE = 3.2;                          // Strecke in Bildschirmhoehen; die letzte gehoert dem Vorhang
const HERO_PHASEN = { umVon: 0.03, umBis: 0.5 };
const startEl = document.getElementById('start');
const heroEl = qs('[data-hero]', startEl);
const heroPin = qs('.hero__pin', startEl);
const heroBuehne = qs('.hero__buehne', startEl);
// index.html bringt fuer den ersten Eindruck die Bildkarten-Klassen mit; der Abschnitt ist jetzt nur noch der Hero
startEl.classList.remove('bs-bildkarte');
startEl.classList.add('nn-hero', 'bs-ton-dunkel');
startEl.dataset.ton = 'dunkel';
if (!reduced) { heroEl.classList.add('hero'); heroEl.style.setProperty('--hero-scroll', HERO_HOEHE); }   // Hoehe steht vor dem Skript des Heros

// L3: Die Karte steht von Anfang an (bildkarte, modus 'karte'). Darin Frank real im Ganzkoerper (Hochglanz-Paare aus
// figuren.szenen.frank): Ansicht folgt der Maus ueber der Karte, ohne Eingabe langsamer Wechsel durch die Ansichten,
// Mausspur legt das Exo frei, im Leerlauf nur das Scan-Band. Mobil: Tippen links/Mitte/rechts oder waagerecht wischen.
const KARTE = { desktop: { h: 0.64, verh: 0.6, x: 0.5, y: 0.56 }, mobil: { h: 0.5, verh: 0.62, x: 0.5, y: 0.62 } };
// Logos frei auf dem Grund, gross; hinter der Karte ruecken wartende Logos nach
const wirbel = logowirbel({ ...I.WIRBEL, hoehe: 0.4, versteck: () => (parseFloat(getComputedStyle(bk.el).getPropertyValue('--kw')) || 0) * 0.32 });
window.__wirbel = wirbel;
let wirbelGeladen = false;
const bk = teil(bildkarte({
  id: 'einstieg', modus: 'karte', weg: 0.5, karte: KARTE,
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
  // die Logos fahren aus der Karte auf ihre Bahnen, waehrend der Vorhang steigt
  onSchrumpf: (p) => wirbel.setEin((p - 0.35) / 0.65),
}));
bk.el.classList.add('nn-karte');
if (!reduced) bk.el.classList.add('nn-karte--vorhang');
startEl.after(bk.el);
bk.hinter.appendChild(wirbel.el);
starten.push(() => wirbel.start());
function nachladen() {
  if (wirbelGeladen) return;
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
heroPin.appendChild(heroUi);

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
    // oben buendig mit dem Textblock „Kurs“ (Frank, 14.11.2026)
    feldBuehne({ name: 'kurs', form: 'hoch', lage: 'oben' }),
    feldText({ gross: M.teile[1].name, klein: M.teile[1].fach, claim: M.teile[1].claim, text: M.teile[1].desc, lage: 'mitte' }),
    // Crew (Frank, 14.11.2026): ein Organigramm mit Ablauf aus den Teams, darunter mittig die Formel MI + KI = Magie.
    // Eigenes HTML/SVG in der Buehne, Aufbau unten (organigramm()). Ersetzt das Bild Mensch + Agent und die Gleichung.
    feldBuehne({ name: 'crew', form: 'gross', lage: 'oben' }),
    feldText({ gross: M.teile[2].name, klein: M.teile[2].fach, claim: M.teile[2].claim, text: M.teile[2].desc, lage: 'unten' }),
    // Bild bei Schiff: das moderne NN-Forschungsschiff in Fahrt, Monogramm und Kompassstern als Aufdruck auf dem Rumpf
    // (funnel-vorlage/tools/aufdruck_video.py). enterprise.png ist nicht mehr eingebunden.
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

/* ---------------- L5: Organigramm der Crew (Feld nach dem Crew-Text) ----------------
   Struktur fest vorgegeben (Frank, 14.11.2026): Geschaeftsfuehrung -> Fuehrungskraefte -> Multiplikatoren -> Team 1 und
   Team 2; KI-Agenten unterstuetzen beide Teams (gestrichelt). Punkte = Personen. Sichtbar ist HTML mit SVG-Linien
   (aria-hidden), Screenreader lesen eine verschachtelte Liste. Einspielung von oben nach unten, Reduced Motion: sofort. */
const ORG = {
  label: 'Organigramm der Crew',
  knoten: [['g', 'Geschäftsführung', 1], ['f', 'Führungskräfte', 3], ['m', 'Multiplikatoren', 2], ['t1', 'Team 1', 4], ['t2', 'Team 2', 4]],
  ki: 'KI-Agenten', kiAnzahl: 4, kante: 'unterstützen',
  linien: [['g', 'f'], ['f', 'm'], ['m', 't1'], ['m', 't2'], ['t1', 'w0'], ['t2', 'w0'], ['w0', 'w1'], ['w1', 'w2']],
  // Ablauf unter den Teams (Frank, 14.11.2026)
  ablauf: ['Wissen aus den Teams sichern', 'In Prozessen automatisieren', 'Bewährte Abläufe skalieren'],
  // Formel unter dem Organigramm (Frank, 14.11.2026)
  formel: [['MI', 'Menschliche Intelligenz'], '+', ['KI', 'Künstliche Intelligenz'], '=', ['Magie', 'Mensch und KI im Zusammenspiel']],
};
// Figuren: „Jeder Punkt ist ein Ich“ (Frank) – Frank im Ganzkoerper (Hochglanz-Foto), bei den KI-Agenten das Exo.
// Ausschnitt ueber die Anker aus figuren.json (Kopf oben … Fuesse unten, Koerpermitte), freigestellt ueber die Hof-Maske.
function figurStil(rolle) {
  const b = I.bild(rolle, 640);
  const gk = figuren.saetze[figuren.satz].figuren[0].ganzkoerper;
  const m = figuren.bilder[rolle === 'ganzExo' ? gk.exo : gk.foto];
  const a = gk.anker;
  return `--fig:url(${b.src});--fig-maske:url(${b.maske});--k:${(1 / (a.unten - a.oben)).toFixed(4)};--a:${(m.b / m.h).toFixed(4)};--mx:${a.mx ?? a.x};--oben:${a.oben}`;
}
function organigramm(buehne) {
  // Anordnung nach Franks Vorlage (14.11.2026): links untereinander Geschaeftsfuehrung -> Fuehrungskraefte -> Multiplikatoren,
  // KI-Agenten rechts auf Hoehe der Fuehrungskraefte, unten Team 1 (unter Multiplikatoren) und Team 2 (unter KI-Agenten).
  const kn = Object.fromEntries(ORG.knoten.map(([id, name, n]) => [id, { name, n }]));
  const figurenHtml = (n, exo) => `<span class="nn-org__figuren${exo ? ' nn-org__figuren--exo' : ''}">${'<i></i>'.repeat(n)}</span>`;
  const knoten = (id) => `<div class="nn-org__knoten" data-k="${id}">${figurenHtml(kn[id].n)}<b>${esc(kn[id].name)}</b></div>`;
  const formelText = ORG.formel.map((f) => (Array.isArray(f) ? `${f[0]} (${f[1]})` : f)).join(' ');
  const kiLinien = ['ki-g', 'ki-f', 'ki-m', 'ki-t1', 'ki-t2'];   // KI-Agenten unterstuetzen alle Ebenen (Frank, 14.11.2026)
  const wurzel = el(`
    <div class="nn-org nn-org--crew">
      <ul class="sr-only" aria-label="${esc(ORG.label)}">
        <li>${esc(kn.g.name)}<ul><li>${esc(kn.f.name)}<ul><li>${esc(kn.m.name)}<ul><li>${esc(kn.t1.name)}</li><li>${esc(kn.t2.name)}</li></ul></li></ul></li></ul></li>
        <li>${esc(ORG.ki)} ${esc(ORG.kante)} alle Ebenen: ${esc(['g', 'f', 'm', 't1'].map((id) => kn[id].name).join(', '))} und ${esc(kn.t2.name)}</li>
      </ul>
      <ol class="sr-only" aria-label="Ablauf aus den Teams">${ORG.ablauf.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
      <p class="sr-only">${esc(formelText)}</p>
      <div class="nn-org__bild" aria-hidden="true">
        <svg class="nn-org__linien" xmlns="http://www.w3.org/2000/svg">${ORG.linien.map(([a, b]) => `<path data-l="${a}-${b}" pathLength="1" />`).join('')}${ORG.linien.map(([a, b]) => `<path class="nn-org__pfeil" data-p="${a}-${b}" />`).join('')}</svg>
        <svg class="nn-org__ki-linien" xmlns="http://www.w3.org/2000/svg">${kiLinien.map((id) => `<path data-l="${id}" /><path class="nn-org__pfeil" data-p="${id}" />`).join('')}</svg>
        ${knoten('g')}${knoten('f')}<div class="nn-org__knoten nn-org__knoten--ki" data-k="ki">${figurenHtml(ORG.kiAnzahl, true)}<b>${esc(ORG.ki)}</b><span class="nn-org__kante">${esc(ORG.kante)}</span></div>${knoten('m')}${knoten('t1')}${knoten('t2')}
        ${ORG.ablauf.map((t, i) => `<div class="nn-org__knoten nn-org__schritt" data-k="w${i}"><b>${esc(t)}</b></div>`).join('')}
        <div class="nn-org__formel">${ORG.formel.map((f) => (Array.isArray(f)
          ? `<div class="nn-org__term"><b>${esc(f[0])}</b><small>${esc(f[1])}</small></div>` : `<span class="nn-org__zeichen">${esc(f)}</span>`)).join('')}</div>
      </div>
      ${hilfen.kiHinweis(I.KI)}
    </div>`);
  buehne.append(wurzel);
  const bild = qs('.nn-org__bild', wurzel);
  // Figuren erst kurz vor Sichtbarkeit laden (zwei Fotos und zwei Masken fuer alle Figuren)
  new IntersectionObserver(([e], io) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    wurzel.style.cssText = figurStil('ganzFoto');
    qs('.nn-org__figuren--exo', wurzel).style.cssText = figurStil('ganzExo');
  }, { rootMargin: '100% 100%' }).observe(wurzel);
  // Linien aus den Lagen der Knoten: duenn, rechtwinklig, Pfeilspitze am Ziel
  function zeichnen() {
    const w = bild.offsetWidth; const h = bild.offsetHeight;
    if (!w) return;
    for (const s of bild.querySelectorAll('svg')) s.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const P = Object.fromEntries(['g', 'f', 'm', 't1', 't2', 'ki', 'w0', 'w1', 'w2'].map((id) => [id, lageIn(bild, id)]));
    const spitze = (x, y) => `M${x - 4.5},${y - 6.5} L${x},${y - 0.5} L${x + 4.5},${y - 6.5}`;
    const setze = (sel, d) => qs(sel, bild).setAttribute('d', d);
    const yA = P.m.b + (P.t1.t - P.m.b) * 0.36;     // Knick der Linie Multiplikatoren -> Team 2
    const yB = P.m.b + (P.t1.t - P.m.b) * 0.68;     // Knick der gestrichelten Linie KI-Agenten -> Team 1
    const tb = Math.max(P.t1.b, P.t2.b); const yC = tb + (P.w0.t - tb) * 0.5;   // Teams laufen zusammen
    const linien = {
      'g-f': [`M${P.g.x},${P.g.b} V${P.f.t}`, P.g.x, P.f.t],
      'f-m': [`M${P.f.x},${P.f.b} V${P.m.t}`, P.f.x, P.m.t],
      'm-t1': [`M${P.m.x},${P.m.b} V${P.t1.t}`, P.m.x, P.t1.t],
      'm-t2': [`M${P.m.x},${P.m.b} V${yA} H${P.t2.x} V${P.t2.t}`, P.t2.x, P.t2.t],
      't1-w0': [`M${P.t1.x},${P.t1.b} V${yC} H${P.w0.x} V${P.w0.t}`, P.w0.x, P.w0.t],
      't2-w0': [`M${P.t2.x},${P.t2.b} V${yC} H${P.w0.x} V${P.w0.t}`, P.w0.x, P.w0.t],
      'w0-w1': [`M${P.w0.x},${P.w0.b} V${P.w1.t}`, P.w1.x, P.w1.t],
      'w1-w2': [`M${P.w1.x},${P.w1.b} V${P.w2.t}`, P.w2.x, P.w2.t],
    };
    for (const [id, [d, x, y]] of Object.entries(linien)) { setze(`[data-l="${id}"]`, d); setze(`[data-p="${id}"]`, spitze(x, y)); }
    // KI-Agenten als Spalte rechts: kurze gestrichelte Pfeile nach links zu Geschaeftsfuehrung, Fuehrungskraeften und
    // Multiplikatoren, nach unten zu den Teams (links mit Knick zu Team 1, rechts gerade zu Team 2)
    const links = (x, y) => `M${x + 6.5},${y - 4.5} L${x + 0.5},${y} L${x + 6.5},${y + 4.5}`;
    for (const id of ['g', 'f', 'm']) {
      const y = (P[id].t + P[id].b) / 2;
      setze(`[data-l="ki-${id}"]`, `M${P.ki.l},${y} H${P[id].r}`);
      setze(`[data-p="ki-${id}"]`, links(P[id].r, y));
    }
    const off = Math.max(18, (P.ki.r - P.ki.l) * 0.28);
    const x1 = P.ki.x - off; const x2 = P.ki.x + off;
    const e1 = P.t1.x + (P.t1.r - P.t1.x) * 0.55;   // Eintritt in Team 1 (rechte Haelfte, neben der Linie von oben)
    setze('[data-l="ki-t1"]', `M${x1},${P.ki.b} V${yB} H${e1} V${P.t1.t}`);
    setze('[data-l="ki-t2"]', `M${x2},${P.ki.b} V${P.t2.t}`);
    setze('[data-p="ki-t1"]', spitze(e1, P.t1.t));
    setze('[data-p="ki-t2"]', spitze(x2, P.t2.t));
  }
  new ResizeObserver(zeichnen).observe(bild);
  document.fonts.ready.then(zeichnen);
  if (reduced) return;
  // Einspielung von oben nach unten: Kasten per Clip, Linie waechst, Pfeilspitze, naechster Kasten …; zuletzt KI-Agenten,
  // die gestrichelten Linien und die Pills, danach die Formel
  const k = (id) => qs(`[data-k="${id}"]`, bild);
  const l = (n) => qs(`[data-l="${n}"]`, bild);
  const p = (n) => qs(`[data-p="${n}"]`, bild);
  const clip = () => ({ clipPath: 'inset(0% 0% 100% 0% round 10px)' });
  const auf = { clipPath: 'inset(0% 0% 0% 0% round 10px)', duration: 0.55, ease: 'expo.out' };
  const wachsen = { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut' };
  const spitzeAn = { autoAlpha: 1, duration: 0.18 };
  gsap.set(bild.querySelectorAll('.nn-org__linien path[data-l]'), { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(bild.querySelectorAll('.nn-org__linien .nn-org__pfeil'), { autoAlpha: 0 });
  gsap.set(qs('.nn-org__ki-linien', bild), { clipPath: 'inset(0% 0% 100% 0%)' });
  gsap.set([k('g'), k('f'), k('m'), k('t1'), k('t2'), k('ki'), k('w0'), k('w1'), k('w2')], clip());
  gsap.set(bild.querySelectorAll('.nn-org__figuren i'), { autoAlpha: 0, y: 6 });
  gsap.set(bild.querySelectorAll('.nn-org__kante'), { autoAlpha: 0 });
  gsap.set(bild.querySelectorAll('.nn-org__term'), clip());
  gsap.set(bild.querySelectorAll('.nn-org__zeichen'), { autoAlpha: 0, y: 8 });
  const figuren = (ids) => [ids.flatMap((id) => [...k(id).querySelectorAll('.nn-org__figuren i')]), { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'expo.out' }, '<0.15'];
  const tl = gsap.timeline({ paused: true })
    .to(k('g'), auf).to(...figuren(['g']))
    .to(l('g-f'), wachsen, '-=0.15').to(p('g-f'), spitzeAn, '-=0.05')
    .to(k('f'), auf).to(...figuren(['f']))
    .to(l('f-m'), wachsen, '-=0.15').to(p('f-m'), spitzeAn, '-=0.05')
    .to(k('m'), auf).to(...figuren(['m']))
    .to([l('m-t1'), l('m-t2')], wachsen, '-=0.15').to([p('m-t1'), p('m-t2')], spitzeAn, '-=0.05')
    .to([k('t1'), k('t2')], { ...auf, stagger: 0.08 }).to(...figuren(['t1', 't2']))
    .to(k('ki'), auf, '-=0.2').to(...figuren(['ki']))
    .to(qs('.nn-org__ki-linien', bild), { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' }, '-=0.2')
    .to(bild.querySelectorAll('.nn-org__kante'), { autoAlpha: 1, duration: 0.35, stagger: 0.1 }, '-=0.45')
    // Ablauf: die Teams laufen zusammen, dann Schritt fuer Schritt nach unten
    .to([l('t1-w0'), l('t2-w0')], wachsen, '-=0.1').to([p('t1-w0'), p('t2-w0')], spitzeAn, '-=0.05').to(k('w0'), auf)
    .to(l('w0-w1'), wachsen, '-=0.15').to(p('w0-w1'), spitzeAn, '-=0.05').to(k('w1'), auf)
    .to(l('w1-w2'), wachsen, '-=0.15').to(p('w1-w2'), spitzeAn, '-=0.05').to(k('w2'), auf)
    // zuletzt die Formel: Kaesten per Clip, Zeichen dazwischen
    .to(bild.querySelectorAll('.nn-org__term'), { ...auf, stagger: 0.16 }, '-=0.1')
    .to(bild.querySelectorAll('.nn-org__zeichen'), { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.16, ease: 'expo.out' }, '<0.2');
  new IntersectionObserver(([e], io) => { if (e.intersectionRatio > 0.35) { io.disconnect(); tl.play(); } }, { threshold: [0, 0.35, 0.6] }).observe(bild);
  window.__org = tl;   // fuer qa: window.__org.progress(1)
}

// Lage eines Knotens im Organigramm (Layout-Pixel)
function lageIn(bild, id) {
  // Lage eines Knotens in Layout-Pixeln von bild (eine Skalierung per transform faellt heraus)
  const r = qs(`[data-k="${id}"]`, bild).getBoundingClientRect();
  const o = bild.getBoundingClientRect();
  const f = o.width / (bild.offsetWidth || o.width || 1) || 1;
  const L = (r.left - o.left) / f; const T = (r.top - o.top) / f; const W = r.width / f; const H = r.height / f;
  return { l: L, r: L + W, t: T, b: T + H, x: L + W / 2 };
}
// Crew-Feld aufbauen: das Organigramm mit Ablauf, darunter mittig die Formel und ein KI-Label
const crewPaar = el('<div class="nn-crew-paar"><div class="nn-crew-paar__teile"></div></div>');
qg.buehnen.crew.append(crewPaar);
const crewTeile = qs('.nn-crew-paar__teile', crewPaar);
organigramm(crewTeile);
const orgWurzel = crewTeile.firstElementChild;
crewPaar.append(qs('p.sr-only', orgWurzel), qs('.nn-org__formel', orgWurzel), qs('.bs-ki', orgWurzel));

// Organigramm und Gleichung oben buendig mit dem Titel „Crew“ (Frank, 14.11.2026): Felder um den Abstand des Titels setzen
const crewFelder = [qg.buehnen.crew.closest('.bs-quer__feld')];
const crewTitel = [...qg.el.querySelectorAll('.bs-quer__gross')].find((h) => h.textContent === M.teile[1].name);
// Massstab an die verfuegbare Hoehe koppeln (Frank: beide Organigramme und die Formel immer ganz im Fenster): Oberkante
// am Crew-Titel, das Paar wird bei Bedarf gleichmaessig verkleinert (0,62 … 1); reicht das nicht, rueckt es nach oben.
function crewAusrichten() {
  crewFelder.forEach((f) => { f.style.paddingTop = ''; });
  crewPaar.style.transform = '';
  crewPaar.style.transformOrigin = '';
  if (reduced || window.innerWidth < 992 || !crewTitel) return;
  const spur = crewFelder[0].parentElement.getBoundingClientRect().top;
  const kopf = Math.min(110, window.innerHeight * 0.12);                  // Platz unter dem Seitenkopf
  const rand = 30;                                                        // Luft unten (KI-Label, Fensterrand)
  let oben = Math.max(kopf, crewTitel.getBoundingClientRect().top - spur);
  const h = crewPaar.offsetHeight;
  const w = crewPaar.offsetWidth;
  let s = Math.min(1, (window.innerHeight - oben - rand) / h, (window.innerWidth * 0.94) / w);
  if (s < 0.62) { s = 0.62; oben = Math.max(kopf, window.innerHeight - rand - h * s); }
  crewFelder.forEach((f) => { f.style.paddingTop = `${Math.round(oben)}px`; });
  if (s < 0.999) { crewPaar.style.transformOrigin = '50% 0'; crewPaar.style.transform = `scale(${s.toFixed(3)})`; }
  crewPaar.dataset.skala = s.toFixed(3);
}
document.fonts.ready.then(crewAusrichten);
window.addEventListener('resize', crewAusrichten);

/* ---------------- L8: die 8 Leistungen als grosse Karten (Frank, 14.11.2026: ohne Exo, nur Inhalt) ----------------
   Baustein `karten` fuer Karte, Ellipsen-Hover (0,75 s) und Detailfeld (Dialog). Ohne Figur und ohne Bilder; die Seite
   ruft start() nicht auf (kein Pin, keine Figur) und ordnet je Karte Titel (h3 mit dem Knopf), Kurztext, Ergebnis und
   Link. Klickflaeche = ganze Karte (Pseudo-Element des Knopfs), der Link liegt darueber. Der NN-Kompassstern steht als
   kleines Icon in der Nummernzeile, unveraendert (nur Verschiebung/Deckkraft beim Einspielen). */
const L = I.LEISTUNGEN;
const kt = karten({
  id: 'leistungen', titel: esc(L.titel), text: L.text,
  karten: L.karten.map((k) => ({ titel: k.titel, kurz: k.kurz, ergebnis: k.ergebnis, href: `/leistungen#${k.anker}` })),
  figur: { src: '', w: 1, h: 1, alt: '' },
  ergebnisLabel: L.ergebnisLabel, mehr: L.mehr, cta: L.cta, alle: W.alle, lenis,
});
kt.el.classList.add('nn-leistungen');
const leistungsKarten = [...kt.el.querySelectorAll('.bs-karte-w')];
leistungsKarten.forEach((li, i) => {
  const k = L.karten[i];
  const knopfEl = qs('.bs-karte', li);
  const titel = document.createElement('h3');
  titel.className = 'nn-lk__titel';
  li.prepend(titel);
  titel.append(knopfEl);
  li.insertAdjacentHTML('beforeend', `
    <p class="nn-lk__kurz">${esc(k.kurz)}</p>
    <div class="nn-lk__erg"><small>${esc(L.ergebnisLabel)}</small><p>${esc(k.ergebnis)}</p></div>
    <a class="bs-link nn-lk__mehr" href="/leistungen#${esc(k.anker)}"><span>${esc(L.mehr)}<span class="sr-only">: ${esc(k.titel)}</span></span><i aria-hidden="true">→</i></a>`);
  qs('.bs-karte__nr', knopfEl).insertAdjacentHTML('afterbegin', '<img class="nn-lk__stern" src="/brand/nn-stern-kompass-128.png" alt="" width="20" height="20" decoding="async" />');
});
main.append(kt.el);
// Einspielen wie Schichten: jede Karte steigt per Clip von unten auf, darin stapeln sich die Ebenen von unten nach
// oben (Link, Ergebnis, Kurztext, Titel, Nummer), zuletzt erscheint der Stern. Je Reihe gestaffelt.
function leistungenEin() {
  if (reduced) return;
  const spalten = getComputedStyle(kt.feld).gridTemplateColumns.split(' ').length || 1;
  leistungsKarten.forEach((li, i) => {
    const d = (i % spalten) * 0.1;
    const ebenen = ['.nn-lk__mehr', '.nn-lk__erg', '.nn-lk__kurz', '.bs-karte__titel'].map((s) => qs(s, li));
    const nr = [...li.querySelectorAll('.bs-karte__nr > span')];
    gsap.timeline({ scrollTrigger: { trigger: li, start: 'top 92%', once: true } })
      .fromTo(li, { clipPath: 'inset(100% 0% 0% 0% round 14px)', y: 46 }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', y: 0, duration: 1.05, ease: 'expo.inOut', clearProps: 'clipPath,transform' }, d)
      .fromTo(ebenen, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out', stagger: 0.07 }, d + 0.4)
      .fromTo(nr, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' }, d + 0.78)
      .fromTo(qs('.nn-lk__stern', li), { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' }, d + 0.98);
  });
}
starten.push(leistungenEin);
window.__leistungen = kt;   // fuer qa: Dialog oeffnen

/* ---------------- L9: Callout Werkzeuge ---------------- */
main.append(callout({ id: 'werkzeuge', satz: true, label: W.werkzeuge.titel, titel: esc(W.werkzeuge.text), knopf: { text: W.werkzeuge.knopf, href: W.werkzeuge.href } }).el);

/* ---------------- L10: Store-Platz ---------------- */
const st = store({ ...I.STORE, titel: esc(I.STORE.titel) });
const rc = check(I.CHECK);
// Gesperrten Weiter-Pfeil erklaeren (Frank, 14.11.2026): sichtbarer Hinweis, title und aria-describedby nur solange
// er gesperrt ist; die Optik (gedimmt, not-allowed, Hover der Antworten) steht in funnel.css. Baustein unveraendert.
{
  const weiter = qs('.bs-check__pfeil[data-r="1"]', rc.el);
  if (weiter) {
    const hinweis = el(`<span class="nn-check-hinweis" id="nn-check-hinweis">${esc(I.CHECK_HINWEIS)}</span>`);
    weiter.parentElement.prepend(hinweis);
    const pruefen = () => {
      if (weiter.disabled) { weiter.title = I.CHECK_HINWEIS; weiter.setAttribute('aria-describedby', hinweis.id); }
      else { weiter.removeAttribute('title'); weiter.removeAttribute('aria-describedby'); }
    };
    new MutationObserver(pruefen).observe(weiter, { attributes: true, attributeFilter: ['disabled'] });
    pruefen();
  }
}
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
const heroBild = qs('.hero__bild img', heroBuehne);
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
// Schnittstelle: funnel-vorlage/docs/HERO.md. Zwei Buehnen: der Hero (L2, eigene gepinnte Strecke, nur Portraet)
// und die Bildkarte (L3, steuerung 'extern', Ganzkoerper mit drei Ansichten).
// WebGL nur in der Naehe (hoechstens zwei Kontexte zugleich: Hero und Karte): anlegen, wenn der Abschnitt naeher als
// 1,2 Bildschirmhoehen ist, freigeben, wenn er weiter als 3 weg ist. Das Standbild bleibt jeweils stehen.
function inDerNaehe(ziel, an, aus) {
  let nah = false;
  new IntersectionObserver(([e]) => { if (e.isIntersecting) { nah = true; an(); } }, { rootMargin: '120% 0px' }).observe(ziel);
  new IntersectionObserver(([e]) => { if (!e.isIntersecting) { nah = false; aus(); } }, { rootMargin: '300% 0px' }).observe(ziel);
  return () => nah;
}
const heroModul = () => Promise.all([import('@kern/hero/hero.js'), import('../../figuren.json')]);
// L2: ohne Ganzkoerper laeuft die Umwandlung am Portraet (HERO.md, „Kleine Buehne“); figuren.json bleibt unberuehrt
function heroFiguren(figuren) {
  const k = structuredClone(figuren);
  for (const s of Object.values(k.saetze)) for (const f of s.figuren) { delete f.ganzkoerper; delete f.platzGanz; }
  k.buehne.scrollhoehe = HERO_HOEHE;
  return k;
}
// L3: die Hochglanz-Paare der Szene als die drei Ansichten der Karte. Figur fuellt 86 % der Kartenhoehe, Scheitel 7 %
// unter dem Rand. Bezugslaenge im Kasten (layout.js): Desktop L = Breite / 1,5 = verh / 1,5 x Hoehe, mobil L = Hoehe.
function karteFiguren(figuren) {
  const k = structuredClone(figuren);
  const sz = k.szenen.frank.ansichten, a = sz.frontal.anker, fuell = 0.86, rand = 0.07;
  const platz = (LzuH) => { const kopf = fuell * a.b / ((a.unten - a.oben) * LzuH); return { x: 0.5, y: rand + (a.y - a.oben) * kopf * LzuH / a.b, kopf }; };
  for (const s of Object.values(k.saetze)) for (const f of s.figuren) {
    if (f.id !== 'frank') continue;
    f.ansichten = { links: sz.links, frontal: sz.frontal, rechts: sz.rechts };
    delete f.ganzkoerper; delete f.platzGanz;
    f.platz = { desktop: platz(KARTE.desktop.verh / 1.5), mobil: platz(1) };
  }
  delete k.buehne.scrollhoehe;
  return k;
}
let heroFrei = false, heroLaeuft = 0;
async function heroStarten() {
  if (param.get('hero') === 'aus' || window.__hero || heroLaeuft) return;
  const nr = ++heroLaeuft;
  try {
    const [{ createHero }, { default: figuren }] = await heroModul();
    if (nr !== heroLaeuft || !heroNah()) return;
    window.__hero = createHero(heroEl, { figuren: heroFiguren(figuren), lenis, phasen: HERO_PHASEN,
      onBereit: (m) => { if (m === 'still') bk.el.classList.remove('nn-karte--vorhang'); } });   // ohne WebGL2: kein Vorhang
  } catch (e) {
    console.warn('[funnel] Hero nicht geladen, das Standbild bleibt stehen:', e?.message || e);
  } finally { if (nr === heroLaeuft) heroLaeuft = 0; }
}
function heroAus() { heroLaeuft = 0; window.__hero?.dispose?.(); window.__hero = null; }
const heroNah = inDerNaehe(startEl, () => { if (heroFrei) heroStarten(); }, heroAus);

let karteLaeuft = 0;
async function karteAn() {
  nachladen();
  if (param.get('hero') === 'aus' || window.__karte || karteLaeuft) return;
  const nr = ++karteLaeuft;
  try {
    const [{ createHero }, { default: figuren }] = await heroModul();
    if (nr !== karteLaeuft) return;
    const kasten = qs('.nn-karte-hero', bk.buehne) || bk.buehne.appendChild(el('<div class="nn-karte-hero"><div class="hero__pin"><div class="hero__buehne"></div></div></div>'));
    window.__karte = createHero(kasten, {
      figuren: karteFiguren(figuren), steuerung: 'extern', zeigerRaum: 'buehne',
      ansichtSchwelle: { mass: 'breite', an: 0.17, aus: 0.08 },
      ansichtLeerlauf: { folge: ['frontal', 'links', 'frontal', 'rechts'], takt: 4.5 },
      leerlaufVoll: 0,
    });
  } catch (e) {
    console.warn('[funnel] Bildkarte nicht geladen:', e?.message || e);
  } finally { if (nr === karteLaeuft) karteLaeuft = 0; }
}
function karteAus() { karteLaeuft = 0; window.__karte?.dispose?.(); window.__karte = null; }
inDerNaehe(bk.el, karteAn, karteAus);
window.addEventListener('pagehide', (e) => { if (!e.persisted) { heroAus(); karteAus(); } });

// Positionswechsel (HERO.md, ablauf.bahn): Im Auftakt der Leistungen steht die Figur als Mensch rechts, wo die zweite
// Kartenspalte noch fehlt, schaut nach links zu Titel und ersten Karten, wandert in die Mitte und wird dabei zum Exo.
// Danach steht sie frontal, je Karte leuchtet ein Bauteil. Am Desktop liegt die Szene in der breiten Buehne hinter den
// Karten, mobil im Figurenplatz, der oben stehen bleibt.
let galerie = null;
function galerieAn() {
  if (galerie || !qg.buehnen.kurs) return;
  const stern = sternfahrt({ signet: { src: '/brand/nn-stern-2026-10-kompass.png' }, farbe: '63,212,224', staerke: 2, schub: () => (lenis ? lenis.velocity : 0) });   // Stern frei, ohne Schutzzone; Netz doppelt so praesent
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

offen.then(() => { heroFrei = true; if (heroNah()) heroStarten(); });
// Seitenwechsel: WebGL freigeben (HERO.md)
window.addEventListener('pagehide', (e) => { if (!e.persisted) { window.__hero?.dispose?.(); galerieAus(); } });
// die Szene erst, wenn der Abschnitt naeher kommt
