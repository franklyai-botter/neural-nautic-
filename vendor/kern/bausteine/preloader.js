// Preloader-Maske (Lando: die „4“ oeffnet die Seite). Hier: das Signet der Marke als Maskenbild.
// Die Logo-Datei wird als mask-image benutzt, nicht nachgezeichnet. Dauer unter 1 s, kein Fortschrittsbalken.
//
// Das Element steht schon im HTML, damit es vor dem ersten Skript gemalt wird:
//   <div class="bs-lader" data-lader style="--bs-maske:url(/brand/signet.png)"><img src="/brand/signet.png" alt=""></div>
// Das kritische CSS dafuer steht in preloader.css und sollte zusaetzlich inline im <head> liegen (siehe BAUSTEINE.md).
import { gsap } from '../motion.js';
import './preloader.css';

/**
 * @param {HTMLElement} lader          das Element aus dem HTML
 * @param {object} [o]
 * @param {Promise} [o.bereit]         oeffnet, sobald erfuellt (z. B. Hero-Bild dekodiert) …
 * @param {number} [o.maxWarten=450]   … spaetestens aber nach so vielen ms
 * @param {number} [o.dauer=0.6]       Dauer der Oeffnung in s
 * @param {boolean} [o.still]          Reduced Motion: sofort weg
 * @returns {Promise<void>} erfuellt, wenn die Seite frei ist
 */
export function preloader(lader, o = {}) {
  if (!lader) return Promise.resolve();
  const weg = () => { lader.remove(); document.documentElement.classList.add('bs-geladen'); };
  if (o.still) { weg(); return Promise.resolve(); }
  // abgelehntes bereit (z. B. img.decode() bei defektem Bild) oeffnet trotzdem (K-WR-12)
  const warten = Promise.race([Promise.resolve(o.bereit).catch(() => {}), new Promise((r) => setTimeout(r, o.maxWarten ?? 450))]);
  return warten.then(() => new Promise((fertig) => {
    const dauer = o.dauer ?? 0.6;
    const logo = lader.querySelector('img');
    const zustand = { g: 0 };
    const vmax = Math.max(window.innerWidth, window.innerHeight);
    lader.classList.add('is-offen');
    gsap.timeline({ onComplete: () => { weg(); fertig(); } })
      // Signet waechst kurz an, das Loch in seiner Form zoomt auf und gibt die Seite frei
      .to(logo, { scale: 1.6, autoAlpha: 0, duration: dauer * 0.45, ease: 'power2.in' }, 0)
      .to(zustand, { g: 1, duration: dauer, ease: 'expo.in', onUpdate: () => {
        lader.style.setProperty('--bs-g', `${Math.round(60 + zustand.g * vmax * 14)}px`);
      } }, 0)
      .to(lader, { autoAlpha: 0, duration: dauer * 0.22, ease: 'none' }, dauer * 0.8);
  }));
}
