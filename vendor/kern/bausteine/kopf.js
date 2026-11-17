// Kopf: Logo, Haupt-CTA (immer sichtbar, Lando: STORE), Menue-Knopf, Fortschrittsbalken rechts.
// Mobil (< 992 px) wandert der CTA nach unten in die Daumenzone.
// Der Kopf passt seine Farbe an den Abschnitt darunter an: Abschnitte tragen data-ton="hell|dunkel".
import './grund.css';
import './kopf.css';
import { el, esc, ziel, qs, qsa } from './hilfen.js';

/**
 * @param {object} c
 * @param {{src:string, alt?:string, name?:string, href?:string}} c.logo  Logo-Datei aus public/brand
 * @param {{text:string, href:string, extern?:boolean}} c.cta
 * @param {{auf:string, zu:string}} [c.menue]  Beschriftung des Menue-Knopfs (fuer Screenreader)
 * @returns {{el:HTMLElement, fortschritt:HTMLElement, daumen:HTMLElement, menueKnopf:HTMLButtonElement, messen:Function}}
 */
export function kopf(c) {
  const m = c.menue || { auf: 'Menü öffnen', zu: 'Menü schließen' };
  const root = el(`
    <header class="bs-kopf">
      <a class="bs-kopf__logo" href="${esc(c.logo.href || '/')}" aria-label="${esc(c.logo.name || '')}, zur Startseite">
        <img src="${esc(c.logo.src)}" alt="${esc(c.logo.alt || '')}" width="44" height="44" />
        ${c.logo.name ? `<span>${esc(c.logo.name)}</span>` : ''}
      </a>
      <div class="bs-kopf__rechts">
        <a class="bs-knopf bs-knopf--accent bs-kopf__cta" ${ziel(c.cta)}><span data-roll>${esc(c.cta.text)}</span></a>
        <button class="bs-kopf__menue" type="button" aria-expanded="false" aria-haspopup="dialog">
          <span class="sr-only">${esc(m.auf)}</span><i aria-hidden="true"></i><i aria-hidden="true"></i>
        </button>
      </div>
    </header>`);
  const fortschritt = el('<div class="bs-fortschritt" aria-hidden="true"><span data-progress></span></div>');
  const daumen = el(`<a class="bs-knopf bs-knopf--accent bs-daumen" ${ziel(c.cta)}><span>${esc(c.cta.text)}</span><i aria-hidden="true">↗</i></a>`);
  const menueKnopf = qs('.bs-kopf__menue', root);
  menueKnopf.dataset.auf = m.auf;
  menueKnopf.dataset.zu = m.zu;

  // Ton unter dem Kopf bestimmen. Abschnitte, die ihren Ton unterwegs wechseln, melden das mit dem Ereignis bs:ton.
  let letzter = '';
  function messen() {
    document.documentElement.classList.toggle('is-scrolled', window.scrollY > 10);
    let ton = 'dunkel';
    for (const s of qsa('[data-ton]')) {
      const r = s.getBoundingClientRect();
      if (r.top <= 44 && r.bottom > 44) ton = s.dataset.ton;
    }
    if (ton !== letzter) { letzter = ton; document.body.dataset.ton = ton; }
  }
  window.addEventListener('scroll', messen, { passive: true });
  window.addEventListener('resize', messen);
  document.addEventListener('bs:ton', messen);

  return { el: root, fortschritt, daumen, menueKnopf, messen };
}
