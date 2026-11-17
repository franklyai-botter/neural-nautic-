// Gemeinsame Rechnung fuer Bildplatzierung. Dieselben Formeln stehen in hero.css (calc mit cq-Einheiten),
// damit das <picture> des ersten Eindrucks und das Canvas deckungsgleich liegen.

export const MOBIL_BIS = 991;                       // < 992 px gilt als mobil (wie Lando)
export const FORMAT = { desktop: 1.5, mobil: 0.5 }; // Bezugslaenge L = min(H, W / FORMAT)

export const istMobil = () => window.matchMedia(`(max-width: ${MOBIL_BIS}px)`).matches;
export const klemme = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const glatt = (t) => t * t * (3 - 2 * t);
export const mische = (a, b, t) => a + (b - a) * t;

export function bezug(W, H, mobil) { return Math.min(H, W / (mobil ? FORMAT.mobil : FORMAT.desktop)); }

/** Rechteck eines Bildes, dessen Kopf (anker) mit Breite k*L an der Stelle (x*W, y*H) sitzt. */
export function rechteckKopf(bild, anker, platz, W, H, L) {
  const h = (L * platz.kopf) / anker.b, w = h * (bild.b / bild.h);
  return { x: platz.x * W - anker.x * w, y: platz.y * H - anker.y * h, w, h };
}

/** Rechteck eines Ganzkoerperbildes: Figur (Scheitel bis Sohle) mit Hoehe hoehe*L, Mitte bei (x*W, y*H). */
export function rechteckFigur(bild, anker, platz, W, H, L) {
  const span = Math.max(0.05, anker.unten - anker.oben);
  const h = (L * platz.hoehe) / span, w = h * (bild.b / bild.h);
  return { x: platz.x * W - anker.mx * w, y: platz.y * H - ((anker.oben + anker.unten) / 2) * h, w, h };
}

export function bildUrl(pfad, name, breite) { return `${pfad}${name}-${breite}.webp`; }

/** Kleinste vorhandene Breite, die die gewuenschte abdeckt; sonst die groesste. */
export function waehleBreite(bild, px) {
  const b = [...bild.breiten].sort((a, c) => a - c);
  return b.find((w) => w >= px * 0.92) ?? b[b.length - 1];
}

// Einmal pruefen und den Pruefkontext sofort freigeben: jeder offene Kontext zaehlt gegen Chromes Grenze von
// 16 aktiven Kontexten, bei deren Ueberschreiten der aelteste (der Hero) verloren geht.
let gl2 = null;
export function webgl2Vorhanden() {
  if (gl2 !== null) return gl2;
  try {
    const c = document.createElement('canvas').getContext('webgl2');
    gl2 = !!c;
    c?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch { gl2 = false; }
  return gl2;
}

export const bewegungReduziert = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Satz aus figuren.json waehlen: ?satz=a|b in der Adresse gewinnt, dann opt, dann Vorgabe der Datei. */
export function waehleSatz(figuren, wunsch) {
  let q = null;
  try { q = new URLSearchParams(location.search).get('satz'); } catch { /* egal */ }
  const name = [q, wunsch, figuren.satz, Object.keys(figuren.saetze)[0]].find((n) => n && figuren.saetze[n]);
  return { name, satz: figuren.saetze[name] };
}
