// Faecher (Lando: Social-Karten). Hochformat-Karten liegen als Faecher (Mitte vorn, aussen gedreht).
// Beim Eintritt steigen sie von unten auf. Hover hebt eine Karte und schiebt die Nachbarn federnd weg
// (elastic.out(1, 0.75), 0,5 s, 50 ms Entprellung). Karten mit href sind Links, „deko“-Karten nur Bild.
// Reduced Motion: Faecher steht, Hover hebt nur die Ebene.
import { gsap, ScrollTrigger, reduced } from '../motion.js';
import './grund.css';
import './faecher.css';
import { el, esc, qs, qsa, ziel, kiHinweis, mobilMQ } from './hilfen.js';

/**
 * @param {object} c
 * @param {{bild:string, text?:string, href?:string, deko?:boolean, position?:string}[]} c.karten
 * @param {string} [c.hinweis]              Kennzeichnung je Bild, z. B. „KI-generiert“
 * @param {{text:string, href:string}[]} [c.links]  Textlinks unter dem Faecher
 * @param {string} [c.titel]
 * @param {'dunkel'|'hell'} [c.ton='hell']
 * @param {string} [c.id]
 */
export function faecher(c) {
  const ton = c.ton || 'hell';
  const karte = (k) => {
    // Pfeil nur an Karten, die ein Link sind; eine Karte mit Text ohne href ist ein Halter (z. B. Konto ohne Adresse)
    const pfeil = k.href && !k.deko ? ' <i aria-hidden="true">↗</i>' : '';
    const innen = `<img src="${esc(k.bild)}" alt="" loading="lazy" decoding="async"${k.position ? ` style="object-position:${esc(k.position)}"` : ''} />${kiHinweis(c.hinweis)}${k.text ? `<b>${esc(k.text)}${pfeil}</b>` : ''}`;
    return k.href && !k.deko
      ? `<li><a class="bs-faecher__karte" ${ziel({ href: k.href, extern: true })}>${innen}</a></li>`
      : `<li aria-hidden="true"><span class="bs-faecher__karte">${innen}</span></li>`;
  };
  const root = el(`
    <section class="bs-faecher bs-ton-${ton}" data-ton="${ton}"${c.id ? ` id="${c.id}"` : ''}>
      ${c.titel ? `<h2 class="bs-h2 bs-faecher__titel bs-wrap" data-reveal="bar">${c.titel}</h2>` : ''}
      <ul class="bs-faecher__feld">${c.karten.map(karte).join('')}</ul>
      ${c.links?.length ? `<p class="bs-faecher__links bs-wrap">${c.links.map((l) => `<a ${ziel({ ...l, extern: true })}><span data-roll>${esc(l.text)}</span></a>`).join('')}</p>` : ''}
    </section>`);
  const feld = qs('.bs-faecher__feld', root);
  const li = qsa('li', feld);
  const n = li.length;
  const mitte = (n - 1) / 2;
  // Rechts der Mitte liegt die naechste Karte zur Mitte hin links darueber: Beschriftung dort rechtsbuendig, sonst ist
  // ihr Anfang verdeckt (faecher.css)
  li.forEach((e, i) => e.classList.toggle('bs-faecher__rechts', i > mitte));

  const lage = (i) => {
    const o = i - mitte;
    const mob = mobilMQ.matches;
    return { x: o * (mob ? Math.min(64, window.innerWidth * 0.165) : Math.min(230, window.innerWidth * 0.155)), y: Math.pow(Math.abs(o), 1.7) * (mob ? 8 : 12), rotation: o * (mob ? 6.5 : 6), scale: 1 - Math.abs(o) * 0.045 };
  };
  const ebene = (i, k = -1) => String(k < 0 ? 10 - Math.round(Math.abs(i - mitte)) : (i === k ? 20 : 10 - Math.abs(i - k)));

  function start() {
    li.forEach((e, i) => { e.style.zIndex = ebene(i); });
    if (reduced) {
      li.forEach((e, i) => gsap.set(e, lage(i)));
      window.addEventListener('resize', () => li.forEach((e, i) => gsap.set(e, lage(i))));
    } else {
      const grund = (dauer = 0.6) => li.forEach((e, i) => { e.style.zIndex = ebene(i); gsap.to(e, { ...lage(i), duration: dauer, ease: 'elastic.out(1, 0.75)', overwrite: 'auto' }); });
      // opacity statt autoAlpha: Links in den Karten bleiben per Tab erreichbar; Fokus spielt den Faecher sofort ein
      li.forEach((e) => gsap.set(e, { x: 0, y: 420, rotation: 0, scale: 0.8, opacity: 0 }));
      let da = false;
      const einspielen = (sofort) => {
        if (da) return;
        da = true;
        li.forEach((e, i) => (sofort === true ? gsap.set(e, { ...lage(i), opacity: 1 })
          : gsap.to(e, { ...lage(i), opacity: 1, duration: 1.1, ease: 'expo.out', delay: Math.abs(i - mitte) * 0.08 })));
      };
      ScrollTrigger.create({ trigger: feld, start: 'top 80%', once: true, onEnter: einspielen });
      feld.addEventListener('focusin', () => einspielen(true));
      let timer = 0;
      const heben = (k) => {
        clearTimeout(timer);
        timer = setTimeout(() => li.forEach((e, i) => {
          const l = lage(i);
          e.style.zIndex = ebene(i, k);
          if (i === k) gsap.to(e, { x: l.x, y: l.y - 40, rotation: l.rotation * 0.3, scale: 1.08, duration: 0.5, ease: 'elastic.out(1, 0.75)', overwrite: 'auto' });
          else { const d = i - k; gsap.to(e, { x: l.x + Math.sign(d) * (70 / Math.abs(d)), y: l.y, rotation: l.rotation, scale: l.scale, duration: 0.5, delay: Math.abs(d) * 0.02, ease: 'elastic.out(1, 0.75)', overwrite: 'auto' }); }
        }), 50);
      };
      const senken = () => { clearTimeout(timer); timer = setTimeout(() => grund(), 60); };
      li.forEach((e, i) => {
        e.addEventListener('pointerenter', (ev) => { if (ev.pointerType === 'mouse') heben(i); });
        e.addEventListener('pointerleave', (ev) => { if (ev.pointerType === 'mouse') senken(); });
        e.addEventListener('focusin', () => heben(i));
        e.addEventListener('focusout', senken);
      });
      window.addEventListener('resize', () => grund(0.3));
    }
  }
  return { el: root, start };
}
