// Testseite fuer den Bildpaar-Hero und die Ganzkoerper-Szene (NeuralNautic). Keine Inhalte.
import '@fontsource-variable/inter';
import '@fontsource-variable/inter-tight';
import '@fontsource/jetbrains-mono/500.css';
import { initScroll } from '@kern/motion.js';
import { createHero } from '@kern/hero/hero.js';
import { createSzene } from '@kern/hero/szene.js';
import figuren from '../../figuren.json';

const lenis = initScroll();
// ?extern=1 prueft die Steuerung von aussen (setFortschritt), wie sie die echte Seite nutzen kann
const extern = new URLSearchParams(location.search).get('extern') === '1';
const steuerung = extern ? 'extern' : 'eigen';
const hero = createHero(document.querySelector('[data-hero]'), { figuren, lenis, steuerung });
window.__hero = hero; // fuer tools/qa_hero.py
// Zweite Szene der Testseite: Positionswechsel (Bahn) mit Blick in Bewegungsrichtung
const BAHN = {
  scrollhoehe: 4, ansichten: [], punkte: [], blick: 'bewegung',
  bahn: [{ bei: 0, x: 0.24 }, { bei: 0.45, x: 0.74 }, { bei: 0.62, x: 0.74 }, { bei: 1, x: 0.3, hoehe: 0.7 }],
  exo: [{ von: 0.28, bis: 0.44, zu: 1 }],
};
window.__punkte = [];
window.__szenen = [...document.querySelectorAll('[data-szene]')].map((el) => createSzene(el, {
  figuren, szene: el.dataset.szene, steuerung, onPunkt: (p) => window.__punkte.push(p ? p.name : null),
  ...(el.dataset.bahn ? { ablauf: BAHN } : {}),
}));
