// Laufband (Lando: Partner-Logos, Schrift hinter der Bildkarte): Endlosband, laeuft auch ohne Scrollen,
// wird beim Scrollen schneller und kippt die Richtung beim Hochscrollen. Haelt an, wenn es nicht zu sehen ist,
// bei Hover und bei Tastaturfokus (WCAG 2.2.2). Reduced Motion: steht, Eintraege umbrechen.
import { gsap, reduced } from '../motion.js';
import './grund.css';
import './laufband.css';
import { el, esc } from './hilfen.js';

/**
 * @param {object} c
 * @param {string[]} c.eintraege      HTML je Eintrag (Logo-<img>, Text …)
 * @param {number} [c.richtung=-1]    -1 nach links, 1 nach rechts
 * @param {number} [c.tempo=46]       px pro Sekunde im Leerlauf
 * @param {string} [c.art='karten']   'karten' (Logos in Kacheln) | 'schrift' (grosse Woerter)
 * @param {string} [c.ariaLabel]
 * @param {object|null} [c.lenis]     fuer die Kopplung ans Scrolltempo
 */
export function laufband(c) {
  const root = el(`<div class="bs-band bs-band--${c.art || 'karten'}"${c.ariaLabel ? ` role="group" aria-label="${esc(c.ariaLabel)}"` : ' aria-hidden="true"'}>
    <ul class="bs-band__in">${c.eintraege.map((h) => `<li>${h}</li>`).join('')}</ul></div>`);
  const inner = root.firstElementChild;
  const satz = [...inner.children];
  const richtung = c.richtung ?? -1;
  let breite = 0;
  let x = 0;
  let v = 0;
  let laeuft = false;
  let pause = false;

  function fuellen() {
    // Liste so oft kopieren, bis sie gut doppelt so breit ist wie der Bildschirm
    [...inner.children].slice(satz.length).forEach((n) => n.remove());
    const eine = inner.scrollWidth + parseFloat(getComputedStyle(inner).columnGap || 0);
    if (!eine) return;
    breite = eine;
    const kopien = Math.min(14, Math.ceil((window.innerWidth * 2.2) / eine));
    for (let k = 0; k < kopien; k++) {
      satz.forEach((li) => {
        const n = li.cloneNode(true);
        n.setAttribute('aria-hidden', 'true');
        n.querySelectorAll('a, button').forEach((a) => { a.tabIndex = -1; });
        inner.appendChild(n);
      });
    }
  }
  function tick(_, dt) {
    if (!laeuft || pause || !breite) return;
    const sv = c.lenis ? c.lenis.velocity : 0;
    v += (Math.abs(sv) * 3.2 - v) * 0.1;
    x += richtung * ((c.tempo ?? 46) + v * 14) * (dt / 1000) * (sv < -0.5 ? -1 : 1);
    x = ((x % breite) - breite) % breite;
    inner.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
  }

  function start() {
    if (reduced) { root.classList.add('is-still'); return; }
    fuellen();
    window.addEventListener('resize', fuellen);
    new IntersectionObserver(([e]) => { laeuft = e.isIntersecting; }, { rootMargin: '80px' }).observe(root);
    root.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') pause = true; });
    root.addEventListener('pointerleave', () => { pause = false; });
    root.addEventListener('focusin', (e) => {
      pause = true;
      // IF-4: den fokussierten Eintrag ins Bild holen (der Originalsatz liegt beim Laufen meist links ausserhalb)
      const li = e.target.closest('li');
      if (!li || !breite) return;
      root.scrollLeft = 0;
      x = Math.min(0, x + root.getBoundingClientRect().left + 24 - li.getBoundingClientRect().left);
      inner.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    });
    root.addEventListener('focusout', () => { pause = false; });
    gsap.ticker.add(tick);
  }
  return { el: root, start };
}
