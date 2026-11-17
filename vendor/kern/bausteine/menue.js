// Menue im Vorhang (Lando): Ellipse faellt per clip-path von oben, Links steigen gestaffelt auf,
// je Eintrag eine Bildkachel (grau), Hover oder Fokus faerbt die zugehoerige Kachel.
// Anders als beim Vorbild per Tastatur bedienbar: Enter/Leertaste oeffnet, Esc schliesst,
// Tab bleibt im Menue (Knopf + Menue), der Rest der Seite ist solange inert.
import { gsap } from '../motion.js';
import './grund.css';
import './menue.css';
import { el, esc, ziel, qs, qsa, knopf as knopfHtml, kiHinweis, zweistellig } from './hilfen.js';

/**
 * @param {object} c
 * @param {HTMLButtonElement} c.knopf      Menue-Knopf aus kopf()
 * @param {{text:string, href:string, bild?:string, position?:string}[]} c.eintraege   position = object-position der Kachel
 * @param {{text:string, href:string}[]} [c.nebenLinks]
 * @param {{text:string, href:string}} [c.cta]   nur mobil sichtbar (am Desktop steht der CTA im Kopf)
 * @param {string} [c.bildHinweis]         z. B. „KI-generiert“
 * @param {string} [c.titel]               aria-label des Dialogs
 * @param {object|null} [c.lenis]          wird beim Oeffnen angehalten
 * @param {boolean} [c.still]              Reduced Motion
 */
export function menue(c) {
  const pfad = location.pathname.replace(/\/index\.html$/, '/');
  const mitBild = c.eintraege.filter((e) => e.bild);
  const spalte = (sp) => mitBild.map((e, k) => (k % 2 === sp
    ? `<figure data-i="${c.eintraege.indexOf(e)}" style="--k:${k}"><img data-src="${esc(e.bild)}" alt=""${e.position ? ` style="object-position:${esc(e.position)}"` : ''} />${kiHinweis(c.bildHinweis)}</figure>` : '')).join('');
  const root = el(`
    <div class="bs-menue bs-ton-dunkel" id="bs-menue" data-lenis-prevent>
      <div class="bs-menue__innen">
        <nav class="bs-menue__nav" aria-label="${esc(c.titel || 'Menü')}">
          ${c.eintraege.map((e, i) => `<a ${ziel(e)} data-i="${i}" style="--i:${i}"${e.href === pfad ? ' aria-current="page"' : ''}><small>${zweistellig(i + 1)}</small><span>${esc(e.text)}</span></a>`).join('')}
        </nav>
        <div class="bs-menue__bilder" aria-hidden="true">
          <div class="bs-menue__spalte">${spalte(0)}</div>
          <div class="bs-menue__spalte">${spalte(1)}</div>
        </div>
        <div class="bs-menue__fuss">
          ${(c.nebenLinks || []).map((l) => `<a class="bs-menue__neben" ${ziel(l)}><span data-roll>${esc(l.text)}</span></a>`).join('')}
          ${c.cta ? knopfHtml({ ...c.cta, klasse: 'bs-menue__cta' }) : ''}
        </div>
      </div>
    </div>`);
  // Disclosure-Muster statt aria-modal (K-WR-05): der Menue-Knopf im Kopf bleibt erreichbar und schliesst das Menue,
  // auch mit VoiceOver ohne Esc-Taste. data-lenis-prevent: Rad und Wischen scrollen das offene Menue (K-WR-04).
  const btn = c.knopf;
  btn.setAttribute('aria-controls', 'bs-menue');
  root.inert = true;
  const links = qsa('.bs-menue__nav a', root);
  const kacheln = qsa('figure', root);
  let offen = false;
  let geladen = false;

  const aktiv = (i) => {
    kacheln.forEach((k) => k.classList.toggle('is-aktiv', Number(k.dataset.i) === i));
    links.forEach((a) => a.classList.toggle('is-aktiv', Number(a.dataset.i) === i));
  };
  const aktuell = links.findIndex((a) => a.hasAttribute('aria-current'));
  links.forEach((a) => {
    const i = Number(a.dataset.i);
    a.addEventListener('pointerenter', () => aktiv(i));
    a.addEventListener('focus', () => aktiv(i));
  });
  qs('.bs-menue__nav', root).addEventListener('pointerleave', () => aktiv(aktuell));

  // Bildspalten laufen gegenlaeufig zur Maus-Hoehe (Lando: +-6 rem, 2 s Nachfuehrung)
  const spalten = qsa('.bs-menue__spalte', root);
  if (!c.still && spalten.length) {
    const zu = spalten.map((s) => gsap.quickTo(s, 'y', { duration: 2, ease: 'power2.out' }));
    root.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const p = e.clientY / window.innerHeight - 0.5;
      zu[0](p * -90);
      if (zu[1]) zu[1](p * 90);
    });
  }

  function setzen(auf, { fokus = true } = {}) {
    if (auf === offen) return;
    offen = auf;
    if (auf && !geladen) { geladen = true; qsa('img[data-src]', root).forEach((im) => { im.src = im.dataset.src; }); }
    root.classList.toggle('is-open', auf);
    root.inert = !auf;
    document.body.classList.toggle('bs-menue-offen', auf);
    btn.setAttribute('aria-expanded', String(auf));
    qs('.sr-only', btn).textContent = auf ? btn.dataset.zu : btn.dataset.auf;
    if (c.lenis) { if (auf) c.lenis.stop(); else c.lenis.start(); } else document.documentElement.style.overflow = auf ? 'hidden' : '';
    // alles ausser Kopf und Menue aus der Tab-Reihenfolge nehmen
    const kopfEl = btn.closest('header');
    qsa('body > *').forEach((n) => { if (n !== root && n !== kopfEl && !n.classList.contains('veil')) n.inert = auf; });
    if (kopfEl) qsa('a, button', kopfEl).forEach((n) => { if (n !== btn) n.tabIndex = auf ? -1 : 0; });
    aktiv(aktuell);
    if (auf && fokus) setTimeout(() => (links[Math.max(0, aktuell)] || links[0])?.focus({ preventScroll: true }), c.still ? 0 : 120);
    if (!auf && fokus && root.contains(document.activeElement)) btn.focus({ preventScroll: true });
    root.dispatchEvent(new CustomEvent('bs:menue', { bubbles: true, detail: { offen: auf } }));
  }

  btn.addEventListener('click', () => setzen(!offen));
  document.addEventListener('keydown', (e) => {
    if (!offen) return;
    if (e.key === 'Escape') { e.preventDefault(); setzen(false); btn.focus({ preventScroll: true }); return; }
    if (e.key !== 'Tab') return;
    const f = [btn, ...qsa('a, button', root).filter((n) => n.offsetParent !== null)];
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && (i === f.length - 1 || i === -1)) { e.preventDefault(); f[0].focus(); }
  });
  // Link auf die aktuelle Seite: Menue zu und nach oben
  root.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    if (a.origin === location.origin && a.pathname === location.pathname && !a.hash) {
      e.preventDefault();
      setzen(false, { fokus: false });
      if (c.lenis) c.lenis.scrollTo(0, { duration: c.still ? 0 : 1.2, force: true }); else window.scrollTo(0, 0);
    }
  });
  window.addEventListener('pageshow', (e) => { if (e.persisted) setzen(false, { fokus: false }); });

  return { el: root, oeffnen: () => setzen(true), schliessen: () => setzen(false), get offen() { return offen; } };
}
