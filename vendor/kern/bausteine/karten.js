// Karten mit Detailfeld (Lando: Helm-Galerie mit Ellipsen-Hover; hier zusaetzlich „Karten, die sich oeffnen“).
// Die Karte zeigt Nummer, Bildausschnitt und Titel. Hover oder Fokus zieht per Ellipsen-Clip (0,75 s) das Ergebnis
// darueber. Ein Klick oeffnet das Detailfeld als zugaenglichen Dialog (<dialog>, Fokus bleibt drin, Esc schliesst,
// Fokus kehrt zur Karte zurueck).
//
// In der Mitte steht eine Figur (Platz fuer die Ganzkoerper-Szene). Am Desktop ist der Abschnitt gepinnt:
// Beim Scrollen wird eine Karte nach der anderen aktiv, onAktiv(i) und onFortschritt(p) steuern die Szene.
// Ohne Szene zeigt ein Marker auf dem Standbild das Bauteil der aktiven Karte.
// Auftakt (c.auftakt, in Bildschirmhoehen): Am Anfang der Strecke fehlt die rechte Kartenspalte noch. Dort kann die
// Figur stehen und in die Mitte wandern (Szene in der breiten Buehne `buehne` hinter den Karten); die rechten Karten
// spielen sich ein, sobald sie den Platz frei macht. Erst danach beginnen die Schritte.
// Mobil: Figur bleibt oben stehen, die Karten laufen in zwei Spalten darunter durch. Reduced Motion: nichts gepinnt.
import { gsap, ScrollTrigger, reduced, isTouch } from '../motion.js';
import './grund.css';
import './karten.css';
import { el, esc, qs, qsa, knopf, textlink, kiHinweis, zweistellig, mobilMQ } from './hilfen.js';

/**
 * @param {object} c
 * @param {string} [c.label]
 * @param {string} c.titel
 * @param {string} [c.text]
 * @param {{titel:string, kurz:string, ergebnis:string, href:string, teil?:{x:number,y:number,zoom:number}}[]} c.karten
 * @param {{src:string, klein?:string, w:number, h:number, alt?:string, hinweis?:string}} c.figur  Standbild in der Mitte, Quelle der Ausschnitte
 * @param {string} [c.ergebnisLabel='Ergebnis']
 * @param {string} [c.kartenLabel='Leistung']
 * @param {string} [c.mehr]                    Linktext im Detailfeld
 * @param {{text:string, href:string}} [c.cta] Knopf im Detailfeld
 * @param {{text:string, href:string}} [c.alle] Link unter den Karten
 * @param {object} [c.texte]                   { schliessen, zurueck, weiter, oeffnen }
 * @param {number} [c.schritt=0.3]             Scrollweg je Karte in Bildschirmhoehen (Desktop)
 * @param {number} [c.auftakt=0]               Scrollweg vor dem ersten Schritt in Bildschirmhoehen (Desktop), siehe oben
 * @param {object|null} [c.lenis]
 * @param {(i:number)=>void} [c.onAktiv]       aktive Karte (-1 = keine)
 * @param {(p:number)=>void} [c.onFortschritt] 0 … 1 ueber den Abschnitt
 * @param {string} [c.id]
 */
export function karten(c) {
  const T = { schliessen: 'Schließen', zurueck: 'Vorherige', weiter: 'Nächste', oeffnen: 'Details öffnen', ...c.texte };
  const n = c.karten.length;
  const halb = Math.ceil(n / 2);
  const klein = c.figur.klein || c.figur.src;
  const schritt = c.schritt ?? 0.3;
  const auftaktWeg = c.auftakt ?? 0;
  const auftakt = auftaktWeg / (n * schritt + auftaktWeg || 1);   // Anteil an der Strecke
  const ausschnitt = (k, src) => (k.teil ? `background-image:url(${esc(src)});background-size:${k.teil.zoom * 100}% auto;background-position:${k.teil.x}% ${k.teil.y}%` : '');
  const karte = (k, i) => `
    <li class="bs-karte-w"><button class="bs-karte" type="button" data-i="${i}" aria-haspopup="dialog" aria-label="${esc(k.titel)}: ${esc(T.oeffnen)}">
      <span class="bs-karte__vorn">
        <span class="bs-karte__nr"><span>${zweistellig(i + 1)}</span><span>${esc(c.kartenLabel || 'Leistung')}</span></span>
        <span class="bs-karte__bild" data-stil="${ausschnitt(k, klein)}"></span>
        <span class="bs-karte__titel">${esc(k.titel)}</span>
      </span>
      <span class="bs-karte__erg">
        <small>${esc(c.ergebnisLabel || 'Ergebnis')}</small>
        <span class="bs-karte__ergtext">${esc(k.ergebnis)}</span>
        <b>${esc(k.titel)} <i aria-hidden="true">+</i></b>
      </span>
      <span class="bs-karte__rahmen" aria-hidden="true"></span>
    </button></li>`;
  const root = el(`
    <section class="bs-karten bs-ton-dunkel" data-ton="dunkel"${c.id ? ` id="${c.id}"` : ''} style="--bs-schritte:${n};--bs-schritt:${schritt};--bs-auftakt:${auftaktWeg}">
      <div class="bs-karten__bahn"><div class="bs-karten__pin">
        <div class="bs-karten__buehne" aria-hidden="true"></div>
        <header class="bs-karten__kopf bs-wrap">
          ${c.label ? `<p class="bs-label">${esc(c.label)}</p>` : ''}
          <h2 class="bs-h2 bs-karten__h">${c.titel}</h2>
          ${c.text ? `<p class="bs-lauf">${esc(c.text)}</p>` : ''}
        </header>
        <div class="bs-karten__feld bs-wrap">
          <ul class="bs-karten__spalte bs-karten__spalte--l">${c.karten.slice(0, halb).map((k, i) => karte(k, i)).join('')}</ul>
          <div class="bs-karten__figur">
            <div class="bs-karten__stand">
              <img data-src="${esc(c.figur.src)}" alt="${esc(c.figur.alt || '')}" width="${c.figur.w}" height="${c.figur.h}" decoding="async" />
              <i class="bs-karten__punkt" aria-hidden="true"></i>
            </div>
            ${kiHinweis(c.figur.hinweis)}
          </div>
          <ul class="bs-karten__spalte bs-karten__spalte--r">${c.karten.slice(halb).map((k, i) => karte(k, i + halb)).join('')}</ul>
        </div>
        ${c.alle ? `<p class="bs-karten__alle bs-wrap">${textlink(c.alle)}</p>` : ''}
      </div></div>
      <dialog class="bs-detail" aria-labelledby="bs-detail-titel" data-lenis-prevent>
        <div class="bs-detail__innen">
          <div class="bs-detail__bild"><span></span>${kiHinweis(c.figur.hinweis)}</div>
          <div class="bs-detail__text">
            <p class="bs-label"><span data-d="nr"></span></p>
            <h3 id="bs-detail-titel" class="bs-detail__titel" data-d="titel" tabindex="-1"></h3>
            <p class="bs-lauf" data-d="kurz"></p>
            <div class="bs-detail__erg"><small>${esc(c.ergebnisLabel || 'Ergebnis')}</small><p data-d="ergebnis"></p></div>
            <div class="bs-detail__wege">
              ${c.cta ? knopf(c.cta) : ''}
              <a class="bs-link" data-d="mehr"><span>${esc(c.mehr || 'Mehr')}</span><i aria-hidden="true">→</i></a>
            </div>
          </div>
          <div class="bs-detail__leiste">
            <button type="button" class="bs-detail__pfeil" data-d="zurueck" aria-label="${esc(T.zurueck)}"><i aria-hidden="true">←</i></button>
            <span class="bs-detail__zahl" data-d="zahl" aria-hidden="true"></span>
            <button type="button" class="bs-detail__pfeil" data-d="weiter" aria-label="${esc(T.weiter)}"><i aria-hidden="true">→</i></button>
            <button type="button" class="bs-detail__zu" data-d="zu"><span>${esc(T.schliessen)}</span><i aria-hidden="true">×</i></button>
          </div>
        </div>
      </dialog>
    </section>`);
  const dlg = qs('dialog', root);
  const knoepfe = qsa('.bs-karte', root);
  const figur = qs('.bs-karten__figur', root);
  const punkt = qs('.bs-karten__punkt', root);
  const d = (k) => qs(`[data-d="${k}"]`, dlg);
  let aktiv = -1;
  let hover = -1;
  let scrollAktiv = -1;
  let offen = -1;

  function setAktiv(i) {
    if (i === aktiv) return;
    aktiv = i;
    knoepfe.forEach((b, k) => b.classList.toggle('is-aktiv', k === i));
    const t = i >= 0 ? c.karten[i].teil : null;
    punkt.classList.toggle('is-an', !!t);
    if (t) { punkt.style.left = `${t.x}%`; punkt.style.top = `${t.y}%`; }
    c.onAktiv?.(i);
  }
  const waehlen = () => setAktiv(hover >= 0 ? hover : scrollAktiv);

  knoepfe.forEach((b, i) => {
    b.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hover = i; waehlen(); } });
    b.addEventListener('pointerleave', () => { hover = -1; waehlen(); });
    b.addEventListener('focus', () => { if (b.matches(':focus-visible')) { hover = i; waehlen(); } });
    b.addEventListener('blur', () => { hover = -1; waehlen(); });
    b.addEventListener('click', () => oeffnen(i));
  });

  /* ---------- Detailfeld ---------- */
  function fuellen(i) {
    const k = c.karten[i];
    offen = i;
    d('nr').textContent = `${c.kartenLabel || 'Leistung'} ${zweistellig(i + 1)}`;
    d('titel').textContent = k.titel;
    d('kurz').textContent = k.kurz;
    d('ergebnis').textContent = k.ergebnis;
    d('zahl').textContent = `${zweistellig(i + 1)} / ${zweistellig(n)}`;
    const mehr = d('mehr');
    if (k.href) { mehr.href = k.href; mehr.hidden = false; } else mehr.hidden = true;
    qs('.bs-detail__bild > span', dlg).style.cssText = ausschnitt({ teil: k.teil ? { ...k.teil, zoom: Math.max(1.6, k.teil.zoom * 0.62) } : null }, c.figur.src);
    setAktiv(i);
  }
  function oeffnen(i) {
    fuellen(i);
    if (dlg.open) return;
    dlg.showModal();
    c.lenis?.stop();
    requestAnimationFrame(() => dlg.classList.add('is-open'));
    d('titel').focus({ preventScroll: true });
  }
  function schliessen() {
    if (!dlg.open || dlg.classList.contains('is-zu')) return;
    const fertig = () => { dlg.classList.remove('is-zu', 'is-open'); dlg.close(); };
    if (reduced) { fertig(); return; }
    dlg.classList.add('is-zu');
    dlg.classList.remove('is-open');
    setTimeout(fertig, 420);
  }
  dlg.addEventListener('close', () => {
    c.lenis?.start();
    const b = knoepfe[offen];
    offen = -1;
    hover = -1;
    waehlen();
    b?.focus({ preventScroll: true });
  });
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); schliessen(); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) schliessen(); });
  d('zu').addEventListener('click', schliessen);
  const blaettern = (r) => {
    const i = (offen + r + n) % n;
    if (reduced) { fuellen(i); return; }
    const innen = qs('.bs-detail__text', dlg);
    gsap.timeline()
      .to(innen, { autoAlpha: 0, y: -14 * r, duration: 0.18, ease: 'power2.in', onComplete: () => fuellen(i) })
      .fromTo(innen, { y: 14 * r }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'expo.out' });
  };
  d('zurueck').addEventListener('click', () => blaettern(-1));
  d('weiter').addEventListener('click', () => blaettern(1));
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') blaettern(1);
    if (e.key === 'ArrowLeft') blaettern(-1);
  });

  // Rechte Spalte ein- oder ausspielen (nur mit Auftakt, Desktop)
  let rechtsDa = true;
  function rechts(an, sofort = false) {
    if (an === rechtsDa && !sofort) return;
    rechtsDa = an;
    const k = knoepfe.slice(halb);
    if (sofort || reduced) { gsap.set(k, { clearProps: 'clipPath,visibility,opacity' }); return; }
    if (an) gsap.fromTo(k, { clipPath: 'inset(100% 0% 0% 0% round 14px)', autoAlpha: 1 }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: 0.9, ease: 'expo.inOut', stagger: 0.07, overwrite: true });
    else gsap.to(k, { clipPath: 'inset(100% 0% 0% 0% round 14px)', duration: 0.5, ease: 'expo.in', stagger: 0.04, overwrite: true, onComplete: () => gsap.set(k, { autoAlpha: 0 }) });
  }

  function start() {
    if (auftakt && !reduced && !mobilMQ.matches) { rechtsDa = false; gsap.set(knoepfe.slice(halb), { autoAlpha: 0 }); }
    // Bilder erst kurz vor Sichtbarkeit anfordern
    new IntersectionObserver(([e], io) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      qsa('[data-stil]', root).forEach((s) => { s.style.cssText = s.dataset.stil; });
      qsa('img[data-src]', root).forEach((im) => { im.src = im.dataset.src; });
    }, { rootMargin: '100% 0px' }).observe(root);
    if (isTouch) root.classList.add('is-touch');
    if (reduced) return;

    const mm = gsap.matchMedia();
    // Desktop: gepinnt, je Scrollschritt wird eine Karte aktiv
    mm.add('(min-width: 992px)', () => {
      const st = ScrollTrigger.create({
        trigger: qs('.bs-karten__bahn', root), start: 'top top', end: 'bottom bottom',
        onUpdate: (s) => {
          c.onFortschritt?.(s.progress);
          const q = (s.progress - auftakt) / (1 - auftakt);   // Fortschritt nach dem Auftakt
          scrollAktiv = q <= 0.02 || q >= 0.985 ? -1 : Math.min(n - 1, Math.floor((q - 0.02) / 0.965 * n));
          if (auftakt) rechts(s.progress >= auftakt * 0.84);
          if (hover < 0 && offen < 0) waehlen();
        },
        onLeave: () => { scrollAktiv = -1; waehlen(); },
        onLeaveBack: () => { scrollAktiv = -1; waehlen(); },
      });
      // Einfahrt: aeussere Spalten starten tiefer und laufen auf 0 (Lando: Spalten-Parallaxe)
      const ein = { trigger: root, start: 'top bottom', end: 'top top', scrub: true };
      gsap.fromTo(qs('.bs-karten__spalte--l', root), { y: 140 }, { y: 0, ease: 'none', scrollTrigger: ein });
      gsap.fromTo(qs('.bs-karten__spalte--r', root), { y: 220 }, { y: 0, ease: 'none', scrollTrigger: ein });
      gsap.fromTo(figur, { y: 60, scale: 0.94 }, { y: 0, scale: 1, ease: 'none', scrollTrigger: ein });
      return () => { st.kill(); rechts(true, true); };
    });
    // Mobil: Figur steht oben, die Karte nahe der Bildmitte ist aktiv
    mm.add('(max-width: 991px)', () => {
      const st = ScrollTrigger.create({
        trigger: qs('.bs-karten__feld', root), start: 'top 60%', end: 'bottom 60%',
        onUpdate: (s) => {
          c.onFortschritt?.(s.progress);
          const y = window.innerHeight * 0.74;
          let best = -1; let dist = 1e9;
          knoepfe.forEach((b, i) => { const r = b.getBoundingClientRect(); const a = Math.abs((r.top + r.bottom) / 2 - y); if (a < dist) { dist = a; best = i; } });
          scrollAktiv = best;
          if (offen < 0) waehlen();
        },
        onLeave: () => { scrollAktiv = -1; waehlen(); },
        onLeaveBack: () => { scrollAktiv = -1; waehlen(); },
      });
      return () => st.kill();
    });
    // Karten per Clip von unten einspielen (die rechte Spalte wartet am Desktop auf das Ende des Auftakts)
    knoepfe.forEach((b, i) => {
      if (auftakt && !mobilMQ.matches && i >= halb) return;
      gsap.fromTo(b, { clipPath: 'inset(100% 0% 0% 0% round 14px)' }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: 1.1, ease: 'expo.inOut', delay: (i % halb) * 0.06,
        scrollTrigger: { trigger: mobilMQ.matches ? b : root, start: mobilMQ.matches ? 'top 94%' : 'top 70%', once: true }, onComplete: () => gsap.set(b, { clearProps: 'clipPath' }) });
    });
  }

  return { el: root, bahn: qs('.bs-karten__bahn', root), pin: qs('.bs-karten__pin', root), buehne: qs('.bs-karten__buehne', root), feld: qs('.bs-karten__feld', root),
    figur, auftakt, start, setAktiv, oeffnen, schliessen };
}
