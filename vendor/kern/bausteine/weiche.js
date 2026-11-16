// Weiche (Lando: ON TRACK / OFF TRACK): gepinnte Gabel mit zwei Wegen, je ein Satz und ein Knopf.
// Von den Raendern fahren zwei Bildkarten herein (Scrub). In den Platz „danach“ kann ein Vorhang
// (z. B. videoVorhang) gehaengt werden, der sich ueber die stehende Weiche schiebt.
// Mobil: Wege untereinander, Bilder kleiner. Reduced Motion: nichts gepinnt, Bilder stehen.
import { gsap, reduced, barReveal } from '../motion.js';
import './grund.css';
import './weiche.css';
import { el, esc, qs, qsa, knopf, kiHinweis, mobilMQ } from './hilfen.js';

/**
 * @param {object} c
 * @param {string} c.titel                      Aussage ueber beiden Wegen
 * @param {{titel:string, text:string, href:string, knopf?:string, bild?:{src:string,w:number,h:number,position?:string}}} c.links
 * @param {{titel:string, text:string, href:string, knopf?:string, bild?:object}} c.rechts
 * @param {string} [c.bildHinweis]              z. B. „KI-generiert“
 * @param {'dunkel'|'hell'} [c.ton='hell']
 * @param {string} [c.id]
 */
export function weiche(c) {
  const ton = c.ton || 'hell';
  const weg = (w, seite) => `
    <div class="bs-weiche__weg bs-weiche__weg--${seite}">
      <h3 class="bs-weiche__wort">${esc(w.titel)}</h3>
      <p class="bs-weiche__satz">${esc(w.text)}</p>
      ${knopf({ text: w.knopf || w.titel, href: w.href, art: 'accent' })}
    </div>`;
  const bild = (w, seite) => (w.bild ? `
    <figure class="bs-weiche__bild bs-weiche__bild--${seite}" aria-hidden="true">
      <img src="${esc(w.bild.src)}" alt="" width="${w.bild.w}" height="${w.bild.h}" loading="lazy" decoding="async"${w.bild.position ? ` style="object-position:${esc(w.bild.position)}"` : ''} />
      ${kiHinweis(c.bildHinweis)}
    </figure>` : '');
  const root = el(`
    <section class="bs-weiche bs-ton-${ton}" data-ton="${ton}"${c.id ? ` id="${c.id}"` : ''}>
      <div class="bs-weiche__pin">
        ${bild(c.links, 'l')}${bild(c.rechts, 'r')}
        <div class="bs-weiche__innen">
          <h2 class="bs-weiche__titel">${c.titel}</h2>
          <div class="bs-weiche__wege">${weg(c.links, 'l')}${weg(c.rechts, 'r')}</div>
        </div>
      </div>
      <div class="bs-weiche__danach"></div>
    </section>`);
  const danach = qs('.bs-weiche__danach', root);

  function start() {
    if (reduced) return;
    const mm = gsap.matchMedia();
    mm.add({ desk: '(min-width: 992px)', mob: '(max-width: 991px)' }, (ctx) => {
      const { desk } = ctx.conditions;
      const st = { trigger: root, start: 'top bottom', end: 'top top', scrub: true };
      gsap.fromTo(qs('.bs-weiche__bild--l', root), { x: 0, xPercent: -120, rotation: -10 }, { x: 0, xPercent: desk ? -44 : -46, rotation: -4, ease: 'none', scrollTrigger: st });
      gsap.fromTo(qs('.bs-weiche__bild--r', root), { x: 0, xPercent: 120, rotation: 10 }, { x: 0, xPercent: desk ? 44 : 46, rotation: 4, ease: 'none', scrollTrigger: st });
    });
    // Mobil ohne Zeilen-Balken: der schmale Titel soll frei umbrechen duerfen (gesplittete Zeilen brechen sonst doppelt)
    if (mobilMQ.matches) gsap.from(qs('.bs-weiche__titel', root), { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: root, start: 'top 45%', once: true } });
    else barReveal(qs('.bs-weiche__titel', root), { trigger: root, start: 'top 45%' });
    qsa('.bs-weiche__weg', root).forEach((w, i) => gsap.from(w.children, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.09, delay: 0.2 + i * 0.12,
      scrollTrigger: { trigger: root, start: 'top 35%', once: true } }));
  }
  return { el: root, danach, start };
}
