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
window.__punkte = [];
window.__szenen = [...document.querySelectorAll('[data-szene]')].map((el) => createSzene(el, {
  figuren, szene: el.dataset.szene, steuerung, onPunkt: (p) => window.__punkte.push(p ? p.name : null),
}));
