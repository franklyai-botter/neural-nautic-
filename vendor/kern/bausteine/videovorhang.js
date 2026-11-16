// Video-Vorhang (Lando: formatfuellendes Foto schiebt sich ueber die gepinnte Weiche, danach Parallaxe).
// Hier laeuft ein stummer Film. Er laedt erst kurz vor Sichtbarkeit (kein Byte beim Seitenstart),
// spielt nur, solange er zu sehen ist, und hat einen Knopf zum Anhalten (WCAG 2.2.2).
// Reduced Motion: nur das Standbild, der Film startet erst auf Knopfdruck.
import { reduced } from '../motion.js';
import './grund.css';
import './videovorhang.css';
import { el, esc, qs, kiHinweis } from './hilfen.js';

/**
 * @param {object} c
 * @param {string} c.video          mp4
 * @param {string} c.poster         Standbild
 * @param {number} c.w
 * @param {number} c.h
 * @param {string} [c.alt]          Beschreibung des Films
 * @param {string} [c.hinweis]      z. B. „KI-generiert“
 * @param {{an:string, aus:string}} [c.knopf]  Beschriftung: an = laeuft (anhalten), aus = steht (abspielen)
 * @param {string} [c.inhalt]       HTML ueber dem Film (optional)
 * @param {string} [c.id]
 */
export function videoVorhang(c) {
  const k = c.knopf || { an: 'Film anhalten', aus: 'Film abspielen' };
  const root = el(`
    <div class="bs-vorhang bs-ton-dunkel" data-ton="dunkel"${c.id ? ` id="${c.id}"` : ''}>
      <div class="bs-vorhang__bild"${reduced ? '' : ' data-parallax="-14"'}>
        <img src="${esc(c.poster)}" alt="${esc(c.alt || '')}" width="${c.w}" height="${c.h}" loading="lazy" decoding="async" />
        <video muted loop playsinline preload="none" poster="${esc(c.poster)}" width="${c.w}" height="${c.h}" aria-hidden="true" tabindex="-1"></video>
      </div>
      ${kiHinweis(c.hinweis)}
      <button class="bs-vorhang__knopf" type="button" aria-pressed="false"><i aria-hidden="true"></i><span class="sr-only">${esc(k.aus)}</span></button>
      ${c.inhalt ? `<div class="bs-vorhang__inhalt">${c.inhalt}</div>` : ''}
    </div>`);
  const video = qs('video', root);
  const btn = qs('.bs-vorhang__knopf', root);
  let geladen = false;
  let gewollt = !reduced;   // soll er laufen, wenn er sichtbar ist?
  let sichtbar = false;

  const zeigen = () => {
    const laeuft = !video.paused;
    btn.setAttribute('aria-pressed', String(laeuft));
    qs('.sr-only', btn).textContent = laeuft ? k.an : k.aus;
    root.classList.toggle('is-laeuft', laeuft);
  };
  const laden = () => { if (geladen) return; geladen = true; video.src = c.video; video.load(); };
  const regeln = () => {
    if (sichtbar && gewollt) { laden(); video.play().catch(() => {}); } else video.pause();
  };
  video.addEventListener('play', zeigen);
  video.addEventListener('pause', zeigen);
  video.addEventListener('playing', () => root.classList.add('is-bereit'));
  btn.addEventListener('click', () => { gewollt = video.paused; regeln(); });

  function start() {
    // laden kurz vor Sichtbarkeit, spielen nur im Bild
    if (!reduced) new IntersectionObserver(([e], io) => { if (e.isIntersecting) { laden(); io.disconnect(); } }, { rootMargin: '120% 0px' }).observe(root);
    new IntersectionObserver(([e]) => { sichtbar = e.isIntersecting; regeln(); }, { threshold: 0.15 }).observe(root);
    document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); else regeln(); });
  }
  return { el: root, start, video };
}
