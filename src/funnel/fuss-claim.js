// Footer-Slogan als Link (Frank 24.11.2026): „Für regulierte Branchen gehärtet.“ fuehrt zur Erklaerung auf
// /leistungen#gehaertet. Bewusst hier und nicht in @kern/bausteine/fusskarte.js: der Kern kommt aus funnel-vorlage
// und wird von anderen Seiten mitbenutzt. Der Link legt sich UM das <p class="bs-fuss__claim">, damit der
// Zeilen-Reveal (data-reveal="bar", SplitText auf dem <p>) unveraendert bleibt.
import './fuss-claim.css';

/**
 * @param {HTMLElement} fussEl  Wurzel der Fusskarte (fusskarte(...).el)
 * @param {string} [href]       Ziel, z. B. FUSS.claimHref
 */
export function claimVerlinken(fussEl, href) {
  const p = fussEl?.querySelector('.bs-fuss__claim');
  if (!p || !href) return;
  const a = document.createElement('a');
  a.className = 'nn-fuss-claim';
  a.href = href;
  p.replaceWith(a);
  a.append(p);
}
