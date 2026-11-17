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
 * @param {(HTMLElement|string)[]} [o.verdeckt]  Elemente (oder Selektoren, beim Oeffnen aufgeloest), die waehrend der
 *                                     Oeffnung unsichtbar bleiben und danach in o.einblenden s erscheinen. Grund: Zwischen den
 *                                     duennen Strahlen des Signets bleibt die Flaeche als Zwickel stehen; beim Aufzoomen zogen
 *                                     diese als dunkle schraege Balken ueber das, was durch das Loch zu sehen war (Frank
 *                                     17.11.2026: Balken quer ueber dem Gesicht im Hero). Nur per Skript (inline opacity):
 *                                     ohne JavaScript, bei Reduced Motion und ohne Ladezeichen bleibt alles sofort sichtbar.
 * @param {number} [o.einblenden=0.28] Dauer des Einblendens der verdeckten Elemente in s
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
    const verdeckt = (o.verdeckt || []).flatMap((x) => (typeof x === 'string' ? [...document.querySelectorAll(x)] : [x])).filter(Boolean);
    if (verdeckt.length) gsap.set(verdeckt, { opacity: 0 });   // vor dem ersten Bild der Oeffnung: nichts scheint durch
    const frei = () => {
      weg();
      if (verdeckt.length) gsap.to(verdeckt, { opacity: 1, duration: o.einblenden ?? 0.28, ease: 'power1.out', clearProps: 'opacity' });
      fertig();
    };
    lader.classList.add('is-offen');
    gsap.timeline({ onComplete: frei })
      // Signet waechst kurz an, das Loch in seiner Form zoomt auf und gibt die Seite frei
      .to(logo, { scale: 1.6, autoAlpha: 0, duration: dauer * 0.45, ease: 'power2.in' }, 0)
      .to(zustand, { g: 1, duration: dauer, ease: 'expo.in', onUpdate: () => {
        lader.style.setProperty('--bs-g', `${Math.round(60 + zustand.g * vmax * 14)}px`);
      } }, 0)
      .to(lader, { autoAlpha: 0, duration: dauer * 0.22, ease: 'none' }, dauer * 0.8);
  }));
}
