// Kleine Helfer fuer alle Bausteine. Kein Framework: Bausteine bauen DOM aus Konfiguration.
export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** HTML-Zeichenkette -> ein Element. */
export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export const qs = (s, r = document) => r.querySelector(s);
export const qsa = (s, r = document) => [...r.querySelectorAll(s)];

/** Ist das Ziel extern (http…)? Dann neuer Tab mit noopener. */
export const istExtern = (href) => /^https?:\/\//.test(href || '');
export function ziel(l) {
  const ext = l.extern ?? istExtern(l.href);
  return `href="${esc(l.href)}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}`;
}

/**
 * Knopf als Link. art: 'accent' | 'linie' | 'hell'. Der Text rollt beim Hover (data-roll, motion.js rollText).
 * { text, href, extern, art, gross, pfeil, klasse }
 */
export function knopf(k) {
  const pfeil = k.pfeil === false ? '' : `<i aria-hidden="true">${(k.extern ?? istExtern(k.href)) ? '↗' : '→'}</i>`;
  return `<a class="bs-knopf bs-knopf--${k.art || 'accent'}${k.gross ? ' bs-knopf--gross' : ''}${k.klasse ? ` ${k.klasse}` : ''}" ${ziel(k)}><span data-roll>${esc(k.text)}</span>${pfeil}</a>`;
}

/** Textlink mit Unterstrich. Ein Pfeil am Textende („… →“) wird als eigenes Zeichen gesetzt. */
export function textlink(l, klasse = '') {
  const m = /^(.*?)\s*([→↗])$/.exec(l.text);
  const text = m ? m[1] : l.text;
  const pf = m ? m[2] : '';
  return `<a class="bs-link ${klasse}" ${ziel(l)}><span>${esc(text)}</span>${pf ? `<i aria-hidden="true">${pf}</i>` : ''}</a>`;
}

/** Kennzeichnung fuer generierte Bilder (Art. 50 AI Act). */
export const kiHinweis = (text) => (text ? `<span class="bs-ki">${esc(text)}</span>` : '');

export const mobilMQ = window.matchMedia('(max-width: 991px)');
export const zweistellig = (n) => String(n).padStart(2, '0');
