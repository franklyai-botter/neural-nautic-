// Nachweise (Lando: „Partners & Campaigns“, Partner als Beweis): Aussage, Satz, Link, dazu Belege als Bilder
// (Zertifikate, Urkunden) und ein Platz fuer das Partner-Laufband. Bilder werden per Clip eingespielt.
import './grund.css';
import './nachweise.css';
import { el, esc, qs, textlink, ziel } from './hilfen.js';

/**
 * @param {object} c
 * @param {string} c.titel
 * @param {string} [c.text]
 * @param {{text:string, href:string}} [c.link]
 * @param {{bild:string, w:number, h:number, href:string, titel:string}[]} [c.belege]  titel = sichtbare Unterschrift und Linkname
 * @param {string} [c.bandLabel]     Ueberschrift ueber dem Laufband-Platz
 * @param {'dunkel'|'hell'} [c.ton='hell']
 * @param {string} [c.id]
 */
export function nachweise(c) {
  const ton = c.ton || 'hell';
  const root = el(`
    <section class="bs-nachweise bs-ton-${ton}" data-ton="${ton}"${c.id ? ` id="${c.id}"` : ''}>
      <div class="bs-wrap bs-nachweise__kopf">
        <h2 class="bs-h2" data-reveal="bar">${c.titel}</h2>
        <div class="bs-nachweise__text" data-reveal="up">
          ${c.text ? `<p class="bs-lauf">${esc(c.text)}</p>` : ''}
          ${c.link ? `<p>${textlink(c.link)}</p>` : ''}
        </div>
      </div>
      ${c.belege?.length ? `<ul class="bs-wrap bs-nachweise__belege">${c.belege.map((b) => `
        <li class="${b.w > b.h ? 'is-quer' : 'is-hoch'}"><figure>
          <a ${ziel(b)} data-reveal="clip" tabindex="-1" aria-hidden="true"><img src="${esc(b.bild)}" alt="" width="${b.w}" height="${b.h}" loading="lazy" decoding="async" /></a>
          <figcaption data-reveal="up"><a ${ziel(b)}>${esc(b.titel)}</a></figcaption>
        </figure></li>`).join('')}</ul>` : ''}
      <div class="bs-nachweise__band">
        ${c.bandLabel ? `<p class="bs-label bs-label--mitte">${esc(c.bandLabel)}</p>` : ''}
        <div class="bs-nachweise__bandplatz"></div>
      </div>
    </section>`);
  return { el: root, band: qs('.bs-nachweise__bandplatz', root) };
}
