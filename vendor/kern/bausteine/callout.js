// Callout (Lando: „See more helmets …“ mit einem Knopf): eine Aussage, ein Querverweis.
// Zeilen erscheinen hinter dem Farbbalken (ca. 1 s). Auch als Abschluss mit Signet und Beruhigungszeile nutzbar.
import './grund.css';
import './callout.css';
import { el, esc, knopf } from './hilfen.js';

/**
 * @param {object} c
 * @param {string} [c.label]
 * @param {string} c.titel
 * @param {string} [c.text]
 * @param {{text:string, href:string, extern?:boolean, art?:string}} c.knopf
 * @param {string} [c.klein]          Zeile unter dem Knopf
 * @param {{src:string, w:number, h:number, alt?:string}} [c.logo]  Signet ueber dem Titel (Datei aus public/brand)
 * @param {'dunkel'|'hell'} [c.ton='dunkel']
 * @param {boolean} [c.gross]         groessere Schrift (Abschluss)
 * @param {boolean} [c.satz]          Titel ist ein ganzer Satz: mittlere Schriftgroesse
 * @param {string} [c.id]
 */
export function callout(c) {
  const ton = c.ton || 'dunkel';
  const root = el(`
    <section class="bs-callout bs-ton-${ton}${c.gross ? ' bs-callout--gross' : ''}${c.satz ? ' bs-callout--satz' : ''}" data-ton="${ton}"${c.id ? ` id="${c.id}"` : ''}>
      <div class="bs-wrap bs-callout__innen">
        ${c.logo ? `<img class="bs-callout__logo" src="${esc(c.logo.src)}" alt="${esc(c.logo.alt || '')}" width="${c.logo.w}" height="${c.logo.h}" loading="lazy" decoding="async" data-reveal="up" />` : ''}
        ${c.label ? `<p class="bs-label bs-label--mitte" data-reveal="bar">${esc(c.label)}</p>` : ''}
        <h2 class="bs-callout__titel" data-reveal="bar">${c.titel}</h2>
        ${c.text ? `<p class="bs-lauf bs-callout__text" data-reveal="bar">${esc(c.text)}</p>` : ''}
        <div class="bs-callout__wege" data-reveal="up">
          ${knopf({ gross: true, ...c.knopf })}
          ${c.klein ? `<p class="bs-klein">${esc(c.klein)}</p>` : ''}
        </div>
      </div>
    </section>`);
  return { el: root };
}
