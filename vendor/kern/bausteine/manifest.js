// Manifest (Lando: grosser Satz, Akzentwoerter in Markenfarbe, Zeilen erscheinen hinter einem Farbbalken, ca. 1 s).
// Die Balkenfarbe kommt aus --bar (Ton des Abschnitts) oder aus c.balken.
import './grund.css';
import './manifest.css';
import { el, esc, textlink } from './hilfen.js';

/**
 * @param {object} c
 * @param {string} c.titel     Satz, darf <em> fuer Akzentwoerter enthalten
 * @param {string} [c.text]    Fliesstext darunter
 * @param {string} [c.label]
 * @param {{text:string, href:string}} [c.link]
 * @param {'dunkel'|'hell'} [c.ton='dunkel']
 * @param {string} [c.balken]  CSS-Farbe des Balkens
 * @param {string} [c.id]
 */
export function manifest(c) {
  const ton = c.ton || 'dunkel';
  const root = el(`
    <section class="bs-manifest bs-ton-${ton}" data-ton="${ton}"${c.id ? ` id="${esc(c.id)}"` : ''}${c.balken ? ` style="--bar:${esc(c.balken)}"` : ''}>
      <div class="bs-wrap">
        ${c.label ? `<p class="bs-label" data-reveal="bar">${esc(c.label)}</p>` : ''}
        <h2 class="bs-manifest__titel" data-reveal="bar">${c.titel}</h2>
        ${c.text || c.link ? `<div class="bs-manifest__text" data-reveal="up">
          ${c.text ? `<p class="bs-lauf">${esc(c.text)}</p>` : ''}
          ${c.link ? `<p>${textlink(c.link)}</p>` : ''}
        </div>` : ''}
      </div>
    </section>`);
  return { el: root };
}
