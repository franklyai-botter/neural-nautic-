// Gemeinsamer Bewegungs-Baukasten nach den Mustern von landonorris.com
// (Belege: Projekte/marketing/lando-referenz/berichte/home-oben.md, home-unten.md, navigation.md).
// Nur Prinzipien, kein fremder Code. Jede Funktion respektiert prefers-reduced-motion.
//
// Markup-Konventionen (in beiden Seiten nutzbar):
//   data-reveal="bar"        Textzeilen hinter einem Farbbalken freigeben (Lando: Manifest, Labels)
//                            Farbe per CSS-Variable --bar am Element oder Abschnitt
//   data-reveal="up"         Kinder gestaffelt von unten einblenden
//   data-reveal="clip"       Bild von unten aufziehen, Inhalt skaliert 1.2 -> 1 (Bild-Einspielung)
//   data-visor               Abschnitt mit gewoelbter Oberkante, oeffnet sich beim Scrollen (Scrub)
//   data-parallax="-12"      Element wandert beim Durchscrollen um n % seiner Hoehe
//   data-roll                Button-Text: Buchstaben rollen beim Hover gestaffelt nach oben
//   data-progress            Element wird per scaleY zum Scroll-Fortschrittsbalken
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };
export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = window.matchMedia('(hover: none)').matches;

const EASE_IO = 'power3.inOut';

/** Lenis + ScrollTrigger an einem Takt. Gibt die Lenis-Instanz zurueck (oder null bei Reduced Motion). */
export function initScroll() {
  if (reduced) {
    document.documentElement.classList.add('is-reduced');
    return null;
  }
  document.addEventListener('focusin', fokusEinspielen);
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.2 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.lenis = lenis; // auch fuer die Screenshot-Skripte
  return lenis;
}

/**
 * Tastatur (IF-1): Einspielungen arbeiten mit opacity statt autoAlpha, damit Links und Knoepfe darin per Tab
 * erreichbar bleiben (visibility: hidden nimmt sie aus der Tab-Folge). Bekommt ein Element den Fokus, bevor es
 * eingespielt ist, laeuft seine Einspielung sofort zu Ende. Scrub-Strecken folgen dem Scrollen: dorthin scrollen,
 * wo die Einspielung des fokussierten Elements fertig ist.
 */
function fokusEinspielen(e) {
  let ziel = null;
  for (let n = e.target; n && n !== document.body; n = n.parentElement) {
    for (const t of gsap.getTweensOf(n)) {
      let top = t;
      while (top.parent && top.parent !== gsap.globalTimeline) top = top.parent;
      if (top.repeat?.() === -1 || top.progress() === 1) continue;
      const st = top.scrollTrigger || t.scrollTrigger;
      if (st?.vars?.scrub) {
        if (st.vars.containerAnimation || t.parent !== top || !top.duration()) continue;
        const ende = Math.min(1, t.endTime() / top.duration());
        if (top.progress() < ende) ziel = Math.max(ziel ?? 0, st.start + (st.end - st.start) * ende + 2);
        continue;
      }
      top.progress(1);
    }
  }
  if (ziel !== null) requestAnimationFrame(() => (window.lenis ? window.lenis.scrollTo(ziel, { immediate: true, force: true }) : window.scrollTo(0, ziel)));
}

/** Textzeilen hinter einem Farbbalken freigeben. Laeuft einmal beim Eintritt. */
export function barReveal(el, { delay = 0, stagger = 0.09, start = 'top 85%', trigger } = {}) {
  if (reduced) return;
  const split = SplitText.create(el, { type: 'lines', linesClass: 'rv-line' });
  const lines = split.lines.map((line) => {
    const txt = document.createElement('span');
    txt.className = 'rv-text';
    while (line.firstChild) txt.appendChild(line.firstChild);
    const bar = document.createElement('span');
    bar.className = 'rv-bar';
    bar.setAttribute('aria-hidden', 'true');
    line.append(txt, bar);
    return { txt, bar };
  });
  gsap.set(lines.map((l) => l.txt), { opacity: 0 });
  gsap.set(lines.map((l) => l.bar), { scaleX: 0, transformOrigin: 'left center' });
  const tl = gsap.timeline({ paused: true, delay });
  lines.forEach(({ txt, bar }, i) => {
    const t = i * stagger;
    tl.to(bar, { scaleX: 1, duration: 0.45, ease: EASE_IO }, t)
      .set(txt, { opacity: 1 }, t + 0.45)
      .set(bar, { transformOrigin: 'right center' }, t + 0.45)
      .to(bar, { scaleX: 0, duration: 0.5, ease: EASE_IO }, t + 0.45);
  });
  ScrollTrigger.create({ trigger: trigger || el, start, once: true, onEnter: () => tl.play() });
  return tl;
}

/** Kinder gestaffelt von unten einblenden. */
export function upReveal(el, { stagger = 0.08, y = 40, start = 'top 85%' } = {}) {
  if (reduced) return;
  const kids = el.children.length ? [...el.children] : [el];
  gsap.from(kids, {
    y, opacity: 0, duration: 0.9, ease: 'expo.out', stagger,
    scrollTrigger: { trigger: el, start, once: true },
  });
}

/** Bild von unten aufziehen, Inhalt zoomt dabei zurueck (Bild-Einspielung). */
export function clipReveal(el, { start = 'top 88%', duration = 1.2 } = {}) {
  if (reduced) return;
  const inner = el.querySelector('img, video, canvas, .clip-inner') || el;
  const tl = gsap.timeline({ scrollTrigger: { trigger: el, start, once: true } });
  // clearProps: ein stehengebliebener Clip schneidet sonst den Fokusring aussen am Element ab (IF-3)
  tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration, ease: 'expo.inOut', clearProps: 'clipPath' });
  if (inner !== el) tl.fromTo(inner, { scale: 1.2 }, { scale: 1, duration: duration + 0.3, ease: 'expo.out' }, 0);
  return tl;
}

/** Abschnitt mit gewoelbter Oberkante: Ellipse oeffnet sich beim Scrollen (Lando: Visier-Uebergang). */
export function visor(el) {
  if (reduced) return;
  gsap.fromTo(el,
    { clipPath: 'ellipse(75% 0% at 50% 0%)' },
    { clipPath: 'ellipse(160% 120% at 50% 0%)', ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 15%', scrub: true } });
}

/** Parallaxe: Element wandert beim Durchscrollen um n % der eigenen Hoehe. */
export function parallax(el, amount = Number(el.dataset.parallax) || -10) {
  if (reduced) return;
  gsap.fromTo(el, { yPercent: -amount / 2 }, {
    yPercent: amount / 2, ease: 'none',
    scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true },
  });
}

const ZEICHEN = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Button-Text in zwei Zeilen Buchstaben zerlegen; CSS rollt sie beim Hover (.btn-roll). */
export function rollText(el) {
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  // textContent ist schon entschluesselt: jedes Zeichen wieder maskieren, sonst wird „<“ oder „&lt;“ zu Markup (K-WR-15).
  // Woerter als eigene Gruppe: schmal (IF-2) bricht der Knopf zwischen Woertern um, nie mitten im Wort.
  const row = (cls) => {
    let i = 0;
    const wort = (w) => `<span class="roll__wort">${[...w].map((c) => `<span style="--i:${i++}">${ZEICHEN[c] || c}</span>`).join('')}</span>`;
    return `<span class="roll__row ${cls}" aria-hidden="true">${text.split(/ +/).map((w) => { const s = wort(w); i++; return s; }).join(' ')}</span>`;
  };
  el.innerHTML = `<span class="roll">${row('roll__a')}${row('roll__b')}</span>`;
}

/** Fortschrittsbalken am rechten Rand. */
export function progressBar(el) {
  gsap.set(el, { scaleY: 0, transformOrigin: 'top center' });
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => gsap.set(el, { scaleY: s.progress }) });
}

/** Zielseite vorladen, sobald die Maus ueber einem internen Link ist (Lando: Prefetch beim Hover). */
export function prefetchOnHover(root = document) {
  const done = new Set();
  root.addEventListener('pointerover', (e) => {
    const a = e.target.closest?.('a[href]');
    if (!a || a.origin !== location.origin || a.pathname === location.pathname || done.has(a.pathname)) return;
    done.add(a.pathname);
    const l = document.createElement('link');
    l.rel = 'prefetch';
    l.href = a.pathname;
    document.head.appendChild(l);
  });
}

/** Seitenwechsel mit Vorhang in der Akzentfarbe, unter 600 ms (Lando braucht 2-2,5 s). */
export function pageTransitions() {
  const veil = document.createElement('div');
  veil.className = 'veil';
  veil.setAttribute('aria-hidden', 'true');
  document.body.appendChild(veil);
  if (!reduced && sessionStorageGet('veil') === '1') {
    gsap.fromTo(veil, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.5, ease: 'expo.inOut', delay: 0.05 });
  } else {
    gsap.set(veil, { clipPath: 'inset(100% 0% 0% 0%)' });
  }
  sessionStorageSet('veil', '0');
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    if (a.origin !== location.origin || a.pathname === location.pathname || a.hasAttribute('download')) return;
    e.preventDefault();
    sessionStorageSet('veil', '1');
    if (reduced) { location.href = a.href; return; }
    gsap.fromTo(veil, { clipPath: 'inset(100% 0% 0% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 0.38, ease: 'expo.in',
      onComplete: () => { location.href = a.href; },
    });
  });
  // Zurueck-Taste (bfcache): Vorhang wieder oeffnen
  window.addEventListener('pageshow', (e) => { if (e.persisted) gsap.set(veil, { clipPath: 'inset(100% 0% 0% 0%)' }); });
}

function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch { return null; } }
function sessionStorageSet(k, v) { try { sessionStorage.setItem(k, v); } catch { /* privat */ } }

/**
 * Jeder Satz beginnt am linken Rand (Frank, 15.11.2026, generelle Regel): In Ueberschriften, Claims und grossen Zeilen
 * mit mehreren Saetzen steht nach jedem Satzende ein Zeilenumbruch. Fliesstext bleibt unberuehrt.
 * Greift auf h1–h3, .bs-fuss__claim und [data-satzweise]; ausnehmen mit data-satzweise="aus".
 * Arbeitet ueber Textknoten hinweg (auch wenn Woerter einzeln in Spans stehen), Abkuerzungen wie „z. B.“ bleiben.
 */
const SATZ_ENDE = /([.!?…])(["“”»)]?)(\s+)(?=["„»(]?[A-ZÄÖÜ0-9])/g;
const ABKUERZUNG = /(?:^|\s)(?:[A-Za-zÄÖÜäöü]|\d+|bzw|ca|inkl|vgl|usw|evtl|ggf|Nr|Dr|Prof|St|Mio|Mrd|Tsd|Art|Abs|Kap|Ziff|Jan|Feb|Mär|Apr|Jun|Jul|Aug|Sep|Sept|Okt|Nov|Dez)$/;   // auch „1. Analyse“
// Nur echte Ueberschriften: steckt Blockinhalt darin (Karte, Aufklapper mit Absaetzen), bleibt das Element unberuehrt
const BLOCK = 'p, div, li, ul, ol, dl, figure, section, article, button, table';
export function satzzeilen(root = document) {
  root.querySelectorAll('h1, h2, h3, .bs-fuss__claim, [data-satzweise]').forEach((el) => {
    if (el.dataset.satzweise === 'aus' || el.dataset.satzzeilen || el.querySelector(BLOCK)) return;
    el.dataset.satzzeilen = '1';
    const knoten = []; const starts = []; let text = '';
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) { starts.push(text.length); knoten.push(n); text += n.data; }
    const stellen = [];
    for (const m of text.matchAll(SATZ_ENDE)) {
      if (ABKUERZUNG.test(text.slice(0, m.index))) continue;
      stellen.push(m.index + m[1].length + m[2].length);   // erstes Leerzeichen nach dem Satzende
    }
    for (const pos of stellen.reverse()) {
      let i = starts.length - 1;
      while (i > 0 && starts[i] > pos) i--;
      const rest = knoten[i].splitText(pos - starts[i]);
      rest.data = rest.data.replace(/^\s+/, '');
      rest.parentNode.insertBefore(document.createElement('br'), rest);
    }
  });
}

/** Alles mit data-Attributen verdrahten. Erst nach document.fonts.ready aufrufen (Zeilenumbruch). */
export function autoWire(root = document) {
  satzzeilen(root);   // vor den Zeilen-Animationen, damit SplitText die Umbrueche kennt
  root.querySelectorAll('[data-reveal="bar"]').forEach((el) => barReveal(el, { delay: Number(el.dataset.delay) || 0 }));
  root.querySelectorAll('[data-reveal="up"]').forEach((el) => upReveal(el));
  root.querySelectorAll('[data-reveal="clip"]').forEach((el) => clipReveal(el));
  root.querySelectorAll('[data-visor]').forEach((el) => visor(el));
  root.querySelectorAll('[data-parallax]').forEach((el) => parallax(el));
  root.querySelectorAll('[data-roll]').forEach((el) => rollText(el));
  root.querySelectorAll('[data-progress]').forEach((el) => progressBar(el));
}
