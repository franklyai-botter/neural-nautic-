// Gemeinsamer Rahmen der Kapitelseiten (Welle 2). Angelegt von Paket A, gelesen von allen Kapitelseiten.
// Muster aus src/funnel/main.js (Startseite, nicht geaendert): Kopf mit „KI-Check buchen“, Menue-Vorhang,
// Seitenwechsel, Prefetch, Fusskarte mit Laufband, Preloader. Kopf-, Menue- und Fussdaten sind dieselben wie auf der
// Startseite (src/inhalt/start.js, dort aus navigation.js und site.js zugeordnet), damit der Rahmen ueberall gleich ist.
//
// Benutzung in src/seiten/<seite>.js:
//   import { kapitelseite, seitenkopf, abschnitt, weiterKapitel } from './gemeinsam.js';
//   const S = kapitelseite();                         // Rahmen steht, S.main ist <main id="inhalt">
//   S.main.append(seitenkopf({ eyebrow, h1, text }));
//   const a = abschnitt({ id, kicker, titel, intro, ton: 'hell' }); a.inhalt.append(…); S.main.append(a.el);
//   S.main.append(weiterKapitel({ label, titel, text, href }));
//   S.fertig();                                       // nach dem Aufbau: Schriften abwarten, Bewegung verdrahten
// HTML-Seite: siehe ki-im-unternehmen/index.html (Lader, Sprunglink, <main id="inhalt">, Skript).
import '@fontsource-variable/inter-tight';
import '@fontsource-variable/inter';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import { gsap, ScrollTrigger, reduced, initScroll, autoWire, pageTransitions, prefetchOnHover } from '@kern/motion.js';
import { kopf, menue, preloader, laufband, fusskarte, hilfen } from '@kern/bausteine/index.js';
import { createNetz } from '@kern/netz/netz.js';
import { netzHintergrund } from '../funnel/netz-hintergrund.js';
import { KOPF, MENUE, FUSS, SITE } from '../inhalt/start.js';
import { chatWidget } from './chat.js';
import './gemeinsam.css';

export { gsap, ScrollTrigger, reduced, hilfen };
export const { esc, el, qs, qsa, knopf, ziel } = hilfen;

/**
 * Seitenrahmen aufbauen. Gibt { main, lenis, kopf, teil(b), nachStart(fn), fertig() } zurueck.
 * @param {object} [o]
 * @param {boolean} [o.chat=true]   Chat-Platzhalter unten rechts (der echte Chat kommt mit dem Server-Teil)
 */
export function kapitelseite(o = {}) {
  document.body.classList.add('nn', 'ks');
  const main = document.getElementById('inhalt');
  const lenis = initScroll();
  const starten = [];
  const teil = (b) => { if (b && b.start) starten.push(() => b.start()); return b; };

  // Kopf, Menue, Seitenwechsel, Prefetch (wie Startseite)
  const k = kopf(KOPF);
  document.body.prepend(k.el, k.fortschritt);
  const sprung = document.querySelector('.bs-sprung');
  if (sprung) document.body.prepend(sprung);       // Sprunglink bleibt das erste Tab-Ziel
  // Aktuelle Seite im Menue markieren: der Baustein vergleicht href mit location.pathname („/leistungen“ gegen
  // „/leistungen/“). Fuer den Eintrag dieser Seite den Pfad genau so setzen, wie er in der Adresse steht.
  const hier = location.pathname.replace(/\/index\.html$/, '/');
  const ohneSchraeg = (h) => (h.length > 1 ? h.replace(/\/+$/, '') : h);
  const eintraege = MENUE.eintraege.map((e) => (ohneSchraeg(e.href) === ohneSchraeg(hier) ? { ...e, href: hier } : e));
  const m = menue({ ...MENUE, eintraege, knopf: k.menueKnopf, lenis, still: reduced });
  k.el.after(m.el);
  pageTransitions();
  prefetchOnHover();

  // Sprungziele auf derselben Seite: weich scrollen, Fokus mitnehmen
  const hinScrollen = (zielEl, sofort) => {
    if (lenis && !sofort) lenis.scrollTo(zielEl, { duration: 1.4, force: true, offset: -Math.min(110, window.innerHeight * 0.12) });
    else { const y = zielEl.getBoundingClientRect().top + window.scrollY - Math.min(110, window.innerHeight * 0.12); window.scrollTo(0, y); if (lenis) lenis.scrollTo(y, { immediate: true, force: true }); }
    zielEl.setAttribute('tabindex', '-1');
    zielEl.focus({ preventScroll: true });
  };
  // kaputte Prozentkodierung (z. B. #%E0%A4%A) wirft sonst einen URIError (NN-WR-14)
  const idAusHash = (h) => { try { return decodeURIComponent(h); } catch { return h; } };
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    const zielEl = a && a.getAttribute('href').length > 1 && document.getElementById(idAusHash(a.getAttribute('href').slice(1)));
    if (!zielEl) return;
    e.preventDefault();
    hinScrollen(zielEl);
    history.replaceState(null, '', a.getAttribute('href'));
  });

  // Fusskarte mit Laufband, Daumen-CTA (mobil), Chat-Platzhalter
  const fuss = fusskarte(FUSS);
  const fussBand = teil(laufband({ art: 'schrift', lenis, tempo: 70, eintraege: [`${esc(SITE.name)} ·`] }));
  fuss.band.appendChild(fussBand.el);
  main.after(fuss.el, k.daumen);
  if (o.chat !== false) document.body.append(chatWidget());

  // Preloader (Stern als Maske), falls die Seite ihn im HTML hat
  const offen = preloader(document.querySelector('[data-lader]'), { bereit: document.fonts.ready, still: reduced, maxWarten: 300, dauer: 0.5 });

  let gestartet = false;
  function fertig() {
    if (gestartet) return offen;
    gestartet = true;
    document.fonts.ready.then(() => {
      autoWire(document);
      // ein fehlerhafter Start bricht den Rest nicht ab (NN-WR-02)
      starten.forEach((f) => { try { f(); } catch (e) { console.warn('[seite] Start fehlgeschlagen:', e); } });
      ScrollTrigger.refresh();
      k.messen();
      // Sprungziel aus der Adresse (z. B. /ki-im-unternehmen#reifegrad von der Startseite): erst jetzt existiert es
      const h = location.hash.length > 1 && document.getElementById(idAusHash(location.hash.slice(1)));
      // Lenis kennt sonst noch die Hoehe des leeren <main> und landet bei 0: vorher neu messen
      if (h) requestAnimationFrame(() => { lenis?.resize?.(); ScrollTrigger.refresh(); lenis?.resize?.(); hinScrollen(h, true); });
      window.__bereit = true;   // fuer die Pruefskripte
      netzHintergrund(main);   // Netz hinter allen dunklen Abschnitten (Frank, 15.11.2026)
    });
    return offen;
  }
  return { main, lenis, kopf: k, menue: m, teil, nachStart: (f) => starten.push(f), fertig };
}

/** Text aus { teile: [Text | { text, href, extern? }] } als HTML (Links intern oder extern). */
export function teileHtml(t) {
  const teile = Array.isArray(t) ? t : t?.teile || [];
  return teile.map((x) => (typeof x === 'string' ? esc(x) : `<a ${ziel(x)}>${esc(x.text)}</a>`)).join('');
}

/**
 * Seitenkopf: Eyebrow, H1, Einleitung (wortlich aus den Daten), darunter optional Sprunglinks (Pillen).
 * Hintergrund: das neuronale Netz (Cyan auf Petrol), laeuft nur im Bild, Reduced Motion = Standbild.
 * @param {{eyebrow:string, h1:string, text:string, sprung?:{text:string, href:string}[], netz?:boolean}} c
 */
export function seitenkopf(c) {
  const root = el(`
    <header class="ks-kopf bs-ton-dunkel" data-ton="dunkel">
      <div class="bs-wrap ks-kopf__innen">
        <p class="bs-label" data-reveal="bar">${esc(c.eyebrow)}</p>
        <h1 class="ks-kopf__h1" data-reveal="bar">${esc(c.h1)}</h1>
        <p class="ks-kopf__text" data-reveal="bar" data-delay="0.15">${esc(c.text)}</p>
        ${c.sprung?.length ? `<nav class="ks-kopf__fuss" aria-label="Auf dieser Seite" data-reveal="up">${c.sprung.map((s) => `<a class="ks-pille" href="${esc(s.href)}">${esc(s.text)}</a>`).join('')}</nav>` : ''}
      </div>
    </header>`);
  if (c.netz !== false) {
    const flaeche = el('<div class="ks-kopf__netz" aria-hidden="true"></div>');
    root.prepend(flaeche);
    // Netz erst anlegen, wenn der Kopf im DOM haengt und Masse hat (netz.js misst beim Anlegen; der erste
    // ResizeObserver-Aufruf wird dort uebersprungen). Danach einmal groesse() zur Sicherheit.
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || !flaeche.offsetWidth) return;
      io.disconnect();
      try {
        const netz = createNetz(flaeche, { farbe: '63,212,224', dichte: 0.8 });
        requestAnimationFrame(() => netz?.groesse?.());
        window.addEventListener('pagehide', (ev) => { if (!ev.persisted) netz?.dispose?.(); });
      } catch (err) { console.warn('[kapitel] Netz im Seitenkopf nicht gestartet:', err?.message || err); }
    }, { rootMargin: '50% 0px' });
    io.observe(flaeche);
  }
  return root;
}

/**
 * Abschnitt mit Kicker (Label), Titel als Aussagesatz (H2) und Einleitung. Inhalt kommt in .inhalt.
 * @param {{id?:string, kicker?:string, titel:string, intro?:string, ton?:'dunkel'|'hell', klasse?:string, rand?:boolean}} c
 * @returns {{el:HTMLElement, inhalt:HTMLElement, kopf:HTMLElement}}
 */
export function abschnitt(c) {
  const ton = c.ton || 'dunkel';
  const tid = c.id ? `${c.id}-titel` : `ks-${Math.random().toString(36).slice(2, 8)}`;
  const root = el(`
    <section class="ks-ab bs-ton-${ton}${c.rand ? ' ks-ab--rand' : ''}${c.klasse ? ` ${c.klasse}` : ''}" data-ton="${ton}"${c.id ? ` id="${esc(c.id)}"` : ''} aria-labelledby="${tid}">
      <div class="bs-wrap">
        <div class="ks-ab__kopf">
          ${c.kicker ? `<p class="bs-label" data-reveal="bar">${esc(c.kicker)}</p>` : ''}
          <h2 class="ks-ab__titel" id="${tid}" data-reveal="bar">${esc(c.titel)}</h2>
          ${c.intro ? `<p class="ks-ab__intro" data-reveal="bar" data-delay="0.12">${esc(c.intro)}</p>` : ''}
        </div>
        <div class="ks-ab__inhalt"></div>
      </div>
    </section>`);
  return { el: root, inhalt: qs('.ks-ab__inhalt', root), kopf: qs('.ks-ab__kopf', root) };
}

/**
 * Ebenenmodell (Unternehmen / Projekt) aus src/inhalt/ebenenmodell.js, die eigene Ebene hervorgehoben.
 * @param {object} E  EBENENMODELL
 * @param {'unternehmen'|'projekt'} aktiv
 */
export function ebenenmodell(E, aktiv) {
  const R = E.regeln;
  const ebene = (x) => {
    const an = x.schluessel === aktiv;
    return `
      <div class="ks-ebene${an ? ' ks-ebene--aktiv' : ''}"${an ? ' aria-current="page"' : ''}>
        <div class="ks-ebene__kopf">
          <div>
            <p class="ks-ebene__kicker">${esc(x.kicker)}${an ? esc(R.aktivZusatz) : ''}</p>
            <p class="ks-ebene__titel">${an ? esc(x.title) : `<a href="${esc(x.href)}">${esc(x.title)}<i aria-hidden="true">${esc(R.linkNach)}</i></a>`}</p>
          </div>
          <p class="ks-ebene__rhythmus">${esc(x.rhythm)}</p>
        </div>
        <ol class="ks-ebene__liste">${x.items.map((t, i) => `<li>${x.steps ? `<b>${esc(R.schrittNummer(i))}</b>` : ''}${esc(t)}</li>`).join('')}</ol>
      </div>`;
  };
  const [p1, p2] = E.pfeile;
  return el(`
    <figure class="ks-ebenen">
      <figcaption class="ks-ebenen__titel">${esc(E.titel)}</figcaption>
      <div data-reveal="up">
        ${ebene(E.ebenen[0])}
        <div class="ks-ebenen__pfeile">
          <span><b aria-hidden="true">${esc(p1.zeichen)}</b>${esc(p1.text)}</span>
          <span>${esc(p2.text)}<b aria-hidden="true">${esc(p2.zeichen)}</b></span>
        </div>
        ${ebene(E.ebenen[1])}
      </div>
      <p class="ks-ebenen__fuss">${teileHtml(E.fuss)}</p>
    </figure>`);
}

/**
 * „Weiter zum naechsten Kapitel“: grosser Querverweis am Seitenende (Lando-Callout), ganze Flaeche klickbar,
 * Hover fuellt per Ellipse in Akzentfarbe. Label und Titel kommen von der Seite (Name des naechsten Kapitels).
 * @param {{label:string, titel:string, text?:string, href:string, ton?:'dunkel'|'hell'}} c
 */
export function weiterKapitel(c) {
  const ton = c.ton || 'hell';
  return el(`
    <section class="ks-weiter bs-ton-${ton}" data-ton="${ton}" aria-label="${esc(c.label)}: ${esc(c.titel)}">
      <span class="ks-weiter__fuellung" aria-hidden="true"></span>
      <div class="bs-wrap ks-weiter__innen">
        <p class="bs-label ks-weiter__label" data-reveal="bar">${esc(c.label)}</p>
        <p class="ks-weiter__titel" data-reveal="bar"><a class="ks-weiter__link" href="${esc(c.href)}">${esc(c.titel)}<i aria-hidden="true">→</i></a></p>
        ${c.text ? `<p class="ks-weiter__text" data-reveal="bar">${esc(c.text)}</p>` : ''}
      </div>
    </section>`);
}

/** Zahl beim Einspielen hochzaehlen (Riesenzahlen). Reduced Motion: steht sofort. */
export function zahlHoch(zahlEl, wert, { dauer = 1.6, start = 'top 85%', format = (v) => String(Math.round(v)) } = {}) {
  if (reduced) { zahlEl.textContent = format(wert); return; }
  const o = { v: 0 };
  zahlEl.textContent = format(0);
  gsap.to(o, { v: wert, duration: dauer, ease: 'expo.out', scrollTrigger: { trigger: zahlEl, start, once: true }, onUpdate: () => { zahlEl.textContent = format(o.v); } });
}

/* Chat-Platzhalter: Knopf wie live (Kompassrose), oeffnet einen Hinweis. Sendet nichts.
   SERVER-TEIL (Welle 2): hier den echten Chat einsetzen (src/inhalt/chat.js → CHAT, backend.js → CHAT_API). */
