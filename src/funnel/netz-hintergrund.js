// Neuronales Netz im Hintergrund jedes dunklen Abschnitts (Frank, 15.11.2026: „die neuronalen Netze fehlen oft im
// Hintergrund“). Auf der Live-Seite liegt NeuralBackground.tsx fest hinter der ganzen Seite; im Funnel haben die
// Abschnitte deckende Flaechen, deshalb bekommt jeder dunkle Abschnitt eine eigene Ebene hinter seinem Inhalt.
// Die Ebene ist fensterhoch und laeuft mit (sticky), wirkt also wie der feste Hintergrund der Live-Seite und bleibt
// auch bei sehr langen Abschnitten klein. Jedes Netz pausiert selbst, solange es nicht zu sehen ist (netz.js).
// Ausgenommen: Abschnitte mit eigenem Netz oder eigener WebGL-Buehne (Hero, Bildkarte, Szene, Kapitelkopf).
import './netz-hintergrund.css';

const AUSNAHMEN = '.nn-hero, .bs-bildkarte, .szene, .ks-kopf';
const NN_CYAN = '63,212,224';

export function netzHintergrund(wurzel) {
  if (!wurzel) return;
  const netze = [];
  const los = async () => {
    try {
      const { createNetz } = await import('@kern/netz/netz.js');
      [...wurzel.querySelectorAll(':scope > [data-ton="dunkel"]')].forEach((s, i) => {
        if (s.matches(AUSNAHMEN) || s.querySelector(':scope > .nn-netz__grund')) return;
        s.classList.add('nn-netz');
        const grund = document.createElement('div');
        grund.className = 'nn-netz__grund';
        grund.setAttribute('aria-hidden', 'true');
        const fenster = document.createElement('div');
        fenster.className = 'nn-netz__fenster';
        grund.append(fenster);
        s.prepend(grund);
        // Aufloesung 1: Linien sind duenn und halbtransparent, doppelte Pixel lohnen den Speicher nicht
        netze.push(createNetz(fenster, { farbe: NN_CYAN, dichte: 0.8, deckkraft: 0.6, aufloesung: 1, seed: 7 + i }));
      });
    } catch (e) { console.warn('[netz] Hintergrund nicht geladen:', e?.message || e); }
  };
  if ('requestIdleCallback' in window) requestIdleCallback(los, { timeout: 1500 }); else setTimeout(los, 600);
  window.addEventListener('pagehide', (e) => { if (!e.persisted) netze.forEach((n) => n.dispose?.()); });
}
