// Store-Teaser (Lando: „Lando Store“: Anlass, Satz, Bildcollage, ein Knopf; kein Raster, keine Preise).
// Der Abschnitt oeffnet mit dem Visier-Bogen (data-visor, motion.js). Rechts eine Collage mit Parallaxe,
// darunter optionale Teaser-Karten (z. B. Downloads), die auf die Seite mit dem Formular fuehren.
// Zwischen Kopf und Teasern liegt ein freier Platz (z. B. fuer den Baustein check). Ohne Bilder steht der Kopf zweispaltig.
import './grund.css';
import './store.css';
import { el, esc, qs, knopf, kiHinweis } from './hilfen.js';

/**
 * @param {object} c
 * @param {string} [c.label]
 * @param {string} c.titel
 * @param {string} [c.zeile]         Zeile ueber dem Titel (Anlass)
 * @param {string} [c.text]
 * @param {{text:string, href:string, extern?:boolean}} [c.cta]
 * @param {{src:string, w:number, h:number, alt?:string, hinweis?:string, position?:string}[]} [c.bilder]  bis zu 3
 * @param {{kicker?:string, titel:string, text?:string, knopf:string, href:string}[]} [c.teaser]
 * @param {'dunkel'|'hell'} [c.ton='hell']
 * @param {string} [c.id]
 */
export function store(c) {
  const ton = c.ton || 'hell';
  const bild = (b, i) => `
    <figure class="bs-store__bild bs-store__bild--${i + 1}" data-parallax="${[-10, 16, -22][i] ?? -10}">
      <div data-reveal="clip"><img src="${esc(b.src)}" alt="${esc(b.alt || '')}" width="${b.w}" height="${b.h}" loading="lazy" decoding="async"${b.position ? ` style="object-position:${esc(b.position)}"` : ''} />${kiHinweis(b.hinweis)}</div>
    </figure>`;
  const root = el(`
    <section class="bs-store bs-ton-${ton}${c.bilder?.length ? '' : ' bs-store--ohne-bild'}" data-ton="${ton}" data-visor${c.id ? ` id="${c.id}"` : ''}>
      <div class="bs-wrap bs-store__innen">
        <div class="bs-store__text">
          ${c.label ? `<p class="bs-label" data-reveal="bar">${esc(c.label)}</p>` : ''}
          ${c.zeile ? `<p class="bs-store__zeile" data-reveal="bar">${esc(c.zeile)}</p>` : ''}
          <h2 class="bs-h2 bs-store__titel" data-reveal="bar">${c.titel}</h2>
          ${c.text ? `<p class="bs-lauf" data-reveal="bar">${esc(c.text)}</p>` : ''}
          ${c.cta ? `<p data-reveal="up">${knopf({ gross: true, ...c.cta })}</p>` : ''}
        </div>
        ${c.bilder?.length ? `<div class="bs-store__collage">${c.bilder.slice(0, 3).map(bild).join('')}</div>` : ''}
      </div>
      <div class="bs-wrap bs-store__platz"></div>
      ${c.teaser?.length ? `<ul class="bs-wrap bs-store__teaser" data-reveal="up">${c.teaser.map((t) => `
        <li><a class="bs-store__karte" href="${esc(t.href)}">
          ${t.kicker ? `<small>${esc(t.kicker)}</small>` : ''}
          <b>${esc(t.titel)}</b>
          ${t.text ? `<span>${esc(t.text)}</span>` : ''}
          <em><span data-roll>${esc(t.knopf)}</span><i aria-hidden="true">→</i></em>
        </a></li>`).join('')}</ul>` : ''}
    </section>`);
  return { el: root, platz: qs('.bs-store__platz', root) };
}
