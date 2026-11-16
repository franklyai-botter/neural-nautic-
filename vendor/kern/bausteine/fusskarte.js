// Fusskarte (Lando: dunkle Footer-Karte, die aus einem Farbverlauf aufsteigt). Hier mit Leuchtrand:
// ein Lichtpunkt laeuft langsam um den Kartenrand. Claim und Spalten erscheinen per Farbbalken (ca. 1,1 s).
// Hinter dem Inhalt kann ein Laufband liegen (Platz „band“). Reduced Motion: Rand leuchtet ruhig.
import './grund.css';
import './fusskarte.css';
import { el, esc, qs, knopf, ziel, istExtern } from './hilfen.js';

/**
 * @param {object} c
 * @param {{src:string, alt:string, w:number, h:number}} c.logo       Datei aus public/brand
 * @param {string} c.claim
 * @param {string} [c.ort]
 * @param {{text:string, href:string}} [c.cta]
 * @param {{titel:string, links:[string,string][]}[]} c.spalten      Links als [Text, Ziel]
 * @param {string} c.copyright
 * @param {[string,string][]} [c.recht]
 * @param {string} [c.id]
 */
export function fusskarte(c) {
  const link = ([text, href]) => `<li><a ${ziel({ href })}${istExtern(href) ? '' : ''}><span data-roll>${esc(text)}</span></a></li>`;
  const root = el(`
    <footer class="bs-fuss"${c.id ? ` id="${c.id}"` : ''}>
      <div class="bs-fuss__karte bs-ton-dunkel" data-ton="dunkel">
        <span class="bs-fuss__rand" aria-hidden="true"></span>
        <div class="bs-fuss__band" aria-hidden="true"></div>
        <div class="bs-fuss__kopf">
          <img class="bs-fuss__logo" src="${esc(c.logo.src)}" alt="${esc(c.logo.alt)}" width="${c.logo.w}" height="${c.logo.h}" loading="lazy" decoding="async" />
          <p class="bs-fuss__claim" data-reveal="bar">${esc(c.claim)}</p>
          ${c.ort ? `<p class="bs-fuss__ort">${esc(c.ort)}</p>` : ''}
          ${c.cta ? knopf({ ...c.cta, art: 'accent' }) : ''}
        </div>
        <div class="bs-fuss__spalten">
          ${c.spalten.map((s) => `<nav aria-label="${esc(s.titel)}"><p class="bs-label">${esc(s.titel)}</p><ul>${s.links.map(link).join('')}</ul></nav>`).join('')}
        </div>
        <div class="bs-fuss__ende">
          <p>${esc(c.copyright)}</p>
          ${c.recht?.length ? `<ul>${c.recht.map(link).join('')}</ul>` : ''}
        </div>
      </div>
    </footer>`);
  // Spalten auf Hoehe der Ueberschrift: gemessener Abstand der Ueberschrift im linken Block (Logo jeder Marke)
  const fussKarte = root.querySelector('.bs-fuss__karte');
  const fussKopf = root.querySelector('.bs-fuss__kopf');
  const fussClaim = root.querySelector('.bs-fuss__claim');
  const fussAusrichten = () => fussKarte.style.setProperty('--fuss-claim-oben', `${fussClaim.offsetTop}px`);
  if (fussKopf && fussClaim && 'ResizeObserver' in window) new ResizeObserver(fussAusrichten).observe(fussKopf);

  return { el: root, band: qs('.bs-fuss__band', root) };
}
