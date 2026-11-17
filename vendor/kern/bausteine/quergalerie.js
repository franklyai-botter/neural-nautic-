// Quer-Galerie (Lando: gepinnte horizontale Galerie). Der Abschnitt bleibt stehen, die Felder fahren ~1:1 zum
// Scrollweg nach links. Bilder werden per Clip von unten eingespielt, Textfelder steigen gestaffelt auf.
// Kapitelmarke: Ab dem Feld c.hellAb liegen die Felder auf einem hellen Blatt mit gewoelbter Kante, das mit dem
// Inhalt hereinfaehrt. Der Wechsel dunkel -> hell ist damit eine harte, gewollte Kante und laeuft nie durch ein Grau.
// Mobil (< 992 px): senkrecht im Zickzack, nichts ist gepinnt. Reduced Motion: Felder umbrechen, alles sichtbar.
//
// Felder baut der Funnel aus den Helfern unten (feldTitel, feldText, feldZahl, feldBild, feldZitat) oder als eigenes HTML.
import { gsap, ScrollTrigger, reduced, clipReveal } from '../motion.js';
import './grund.css';
import './quergalerie.css';
import { el, esc, qs, qsa, textlink, kiHinweis, ziel } from './hilfen.js';

const lage = (l) => (l ? ` bs-quer__feld--${l}` : '');

/** Titelfeld am Anfang eines Kapitels. */
export const feldTitel = ({ label, titel, text, weiter, id }) => `
  <div class="bs-quer__feld bs-quer__feld--titel">
    ${label ? `<p class="bs-label">${esc(label)}</p>` : ''}
    <h2 class="bs-h2"${id ? ` id="${id}"` : ''}>${titel}</h2>
    ${text ? `<p class="bs-lauf">${text}</p>` : ''}
    ${weiter ? `<p class="bs-quer__weiter" aria-hidden="true">${esc(weiter)} <span>→</span></p>` : ''}
  </div>`;

/** Textfeld mit grossem Wort: { gross, klein, claim, text, lage: 'oben'|'mitte'|'unten' } */
export const feldText = ({ gross, klein, claim, text, lage: l }) => `
  <article class="bs-quer__feld bs-quer__feld--text${lage(l)}">
    ${klein ? `<p class="bs-quer__klein">${esc(klein)}</p>` : ''}
    <h3 class="bs-quer__gross">${esc(gross)}</h3>
    ${claim ? `<p class="bs-quer__claim">${esc(claim)}</p>` : ''}
    ${text ? `<p class="bs-lauf">${esc(text)}</p>` : ''}
  </article>`;

/** Nummernfeld (Umrissziffer): { nr, titel, text, lage } */
export const feldZahl = ({ nr, titel, text, lage: l }) => `
  <article class="bs-quer__feld bs-quer__feld--zahl${lage(l)}">
    <span class="bs-quer__nr" aria-hidden="true">${esc(nr)}</span>
    <h3><span class="sr-only">${esc(nr)}: </span>${esc(titel)}</h3>
    ${text ? `<p class="bs-lauf">${esc(text)}</p>` : ''}
  </article>`;

/** Bildfeld: { src, w, h, alt, form: 'gross'|'breit'|'hoch'|'hochgross'|'klein', lage, ton (entsaettigt, hintere Ebene), hinweis, href, ariaLabel, position,
 *  aufbau: n } - mit aufbau baut sich das Bild beim Scrollen in n Stufen von unten nach oben auf (z. B. Schichten einer Grafik);
 *  das Bild selbst bleibt unveraendert, nur der sichtbare Ausschnitt waechst.
 *  mobil: { src, w, h } - eigener Bildausschnitt fuer schmale Bildschirme (senkrechte Galerie, bis 991 px); das Feld
 *  steht dort dann in voller Breite, damit der Ausschnitt lesbar bleibt. */
export const feldBild = (b) => {
  const bild = `<img src="${esc(b.src)}" alt="${esc(b.alt || '')}" width="${b.w}" height="${b.h}" loading="lazy" decoding="async"${b.position ? ` style="object-position:${esc(b.position)}"` : ''} />`;
  const img = b.mobil
    ? `<picture><source media="(max-width: 991px)" srcset="${esc(b.mobil.src)}" width="${b.mobil.w}" height="${b.mobil.h}" />${bild}</picture>`
    : bild;
  const innen = `<div class="bs-quer__clip">${img}${kiHinweis(b.hinweis)}</div>`;
  return `
  <figure class="bs-quer__feld bs-quer__feld--bild bs-quer__feld--${b.form || 'gross'}${lage(b.lage)}${b.ton ? ' is-ton' : ''}${b.mobil ? ' hat-mobil' : ''}"${b.aufbau ? ` data-aufbau="${Number(b.aufbau)}"` : ''}>
    ${b.href ? `<a ${ziel(b)}${b.ariaLabel ? ` aria-label="${esc(b.ariaLabel)}"` : ''}>${innen}</a>` : innen}
  </figure>`;
};

/**
 * Filmfeld: kurzer stummer Film in Schleife, in Bildform und mit derselben Einspielung wie ein Bild.
 * { quellen: [{ src, type }], poster, w, h, alt, form, lage, hinweis }. Der Film laedt erst kurz vor Sichtbarkeit,
 * laeuft nur im Fenster und pausiert sonst. Reduced Motion: nur das Poster.
 */
export const feldFilm = (b) => `
  <figure class="bs-quer__feld bs-quer__feld--bild bs-quer__feld--${b.form || 'gross'}${lage(b.lage)}">
    <div class="bs-quer__clip bs-quer__film">
      <img src="${esc(b.poster)}" alt="${esc(b.alt || '')}" width="${b.w}" height="${b.h}" loading="lazy" decoding="async" />
      <video muted loop playsinline preload="none" width="${b.w}" height="${b.h}" aria-hidden="true" tabindex="-1" data-quellen="${esc(JSON.stringify(b.quellen))}"></video>
      ${kiHinweis(b.hinweis)}
    </div>
  </figure>`;

/**
 * Paarfeld: zwei Ganzkoerperfiguren nebeneinander, gleich gross und unten buendig, dazwischen ein schlichtes Zeichen
 * (z. B. „+“ fuer Mensch + Agent). Zwei ruhige Bilder, kein Scroll-Effekt; eingespielt wird wie jedes Bild per Clip,
 * das Zeichen danach mit zwei Balken.
 * { links, rechts: { src, w, h, alt, mitte (Koerpermitte als Anteil der Bildbreite), maske (Alpha-Maske, optional) },
 *   zeichen: 'plus', hinweis, lage }
 */
export const feldPaar = (b) => {
  const figur = (f, seite) => `<span class="bs-quer__figur bs-quer__figur--${seite}"><img src="${esc(f.src)}" alt="${esc(f.alt || '')}" width="${f.w}" height="${f.h}" loading="lazy" decoding="async" style="--mitte:${f.mitte ?? 0.5}${f.maske ? `;-webkit-mask-image:url(${esc(f.maske)});mask-image:url(${esc(f.maske)})` : ''}" /></span>`;
  return `
  <figure class="bs-quer__feld bs-quer__feld--bild bs-quer__feld--paar${lage(b.lage)}">
    <div class="bs-quer__clip bs-quer__paar">${figur(b.links, 'l')}${figur(b.rechts, 'r')}${b.zeichen === 'plus' ? '<i class="bs-quer__plus" aria-hidden="true"></i>' : ''}${kiHinweis(b.hinweis)}</div>
  </figure>`;
};

/**
 * Buehnenfeld: leerer Kasten in Bildform, in den die Seite etwas Lebendiges haengt (z. B. eine kleine Hero-Buehne).
 * { name, form, lage, standbild?: { src, w, h, alt, position }, hinweis }. Das Standbild steht, bis die Buehne da ist,
 * und bleibt bei Reduced Motion. Zugriff ueber die Rueckgabe von quergalerie(): buehnen[name].
 */
export const feldBuehne = (b) => `
  <figure class="bs-quer__feld bs-quer__feld--bild bs-quer__feld--${b.form || 'hoch'}${lage(b.lage)}">
    <div class="bs-quer__clip bs-quer__buehne" data-buehne="${esc(b.name)}">${b.standbild ? `<img class="bs-quer__stand" src="${esc(b.standbild.src)}" alt="${esc(b.standbild.alt || '')}" width="${b.standbild.w}" height="${b.standbild.h}" loading="lazy" decoding="async"${b.standbild.position ? ` style="object-position:${esc(b.standbild.position)}"` : ''} />` : ''}${kiHinweis(b.hinweis)}</div>
  </figure>`;

/** Schlussfeld mit Link: { text (Zitat oder Satz), link, links (mehrere, untereinander), lage } */
export const feldZitat = ({ text, link, links, lage: l }) => `
  <div class="bs-quer__feld bs-quer__feld--zitat${lage(l)}">
    ${text ? `<p class="bs-quer__satz">${text}</p>` : ''}
    ${(links || (link ? [link] : [])).map((x) => textlink(x)).join('')}
  </div>`;

/**
 * @param {object} c
 * @param {string[]} c.felder        HTML der Felder in Reihenfolge
 * @param {number} [c.hellAb]        Index des Felds, mit dem das helle Blatt beginnt (Vorgabe: das zweite Titelfeld;
 *                                   gibt es keins, bleibt die Galerie dunkel)
 * @param {string} [c.id]
 * @param {string} [c.ariaLabel]
 */
export function quergalerie(c) {
  let ab = c.hellAb;
  if (ab == null) { const t = c.felder.map((f, i) => (f.includes('bs-quer__feld--titel') ? i : -1)).filter((i) => i > 0); ab = t.length ? t[0] : -1; }
  const dunkel = ab > 0 ? c.felder.slice(0, ab) : c.felder;
  const hellFelder = ab > 0 ? c.felder.slice(ab) : [];
  const root = el(`
    <section class="bs-quer bs-ton-dunkel" data-ton="dunkel"${c.id ? ` id="${c.id}"` : ''}${c.ariaLabel ? ` aria-label="${esc(c.ariaLabel)}"` : ''}>
      <div class="bs-quer__pin"><div class="bs-quer__spur${hellFelder.length ? ' hat-blatt' : ''}">${dunkel.join('')}${hellFelder.length ? `<div class="bs-quer__blatt bs-ton-hell">${hellFelder.join('')}</div>` : ''}</div></div>
    </section>`);
  const spur = qs('.bs-quer__spur', root);
  const blatt = qs('.bs-quer__blatt', root);

  // Ton fuer den Kopf: hell, sobald das Blatt unter dem Kopf liegt
  function ton(hell) {
    const t = hell ? 'hell' : 'dunkel';
    if (root.dataset.ton === t) return;
    root.dataset.ton = t;
    root.dispatchEvent(new CustomEvent('bs:ton', { bubbles: true }));
  }
  function tonMessen() {
    if (!blatt) return;
    const r = blatt.getBoundingClientRect();
    ton(window.innerWidth >= 992 ? r.left < window.innerWidth * 0.42 : r.top <= 44);
  }

  // Filme: Quellen erst kurz vor Sichtbarkeit setzen, nur im Fenster abspielen
  function filme() {
    qsa('.bs-quer__film video', root).forEach((v) => {
      let geladen = false;
      v.addEventListener('playing', () => v.parentElement.classList.add('is-laeuft'), { once: true });
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !geladen) {
          geladen = true;
          JSON.parse(v.dataset.quellen).forEach((q) => { const s = document.createElement('source'); s.src = q.src; if (q.type) s.type = q.type; v.appendChild(s); });
          v.load();
        }
      }, { rootMargin: '60%' }).observe(v);
      new IntersectionObserver(([e]) => { if (e.isIntersecting && geladen !== null) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.2 }).observe(v);
    });
  }

  function start() {
    if (reduced) { root.classList.replace('bs-ton-dunkel', 'bs-ton-hell'); ton(true); return; }
    filme();
    const mm = gsap.matchMedia();
    const felder = qsa('.bs-quer__feld', spur);

    mm.add('(min-width: 992px)', () => {
      const weg = () => Math.max(0, spur.scrollWidth - window.innerWidth);
      // c.tempo: waagerechte Pixel je gescrolltem Pixel (Vorgabe 1). >1 verkuerzt die Strecke, die Galerie faehrt schneller.
      const setH = () => { root.style.height = `${window.innerHeight + weg() / (c.tempo || 1)}px`; };
      setH();
      ScrollTrigger.addEventListener('refreshInit', setH);
      // Was links hinausfaehrt, blendet aus: kein angeschnittener Buchstabe am Fensterrand
      const rand = () => felder.forEach((f) => {
        const r = f.getBoundingClientRect();
        const a = r.right >= r.width ? 1 : Math.max(0, Math.min(1, (r.right / Math.min(r.width, window.innerWidth * 0.34) - 0.25) / 0.75));
        f.style.opacity = a < 1 ? a.toFixed(2) : '';
      });
      const fahrt = gsap.to(spur, { x: () => -weg(), ease: 'none', onUpdate: rand,
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.5, invalidateOnRefresh: true } });
      felder.forEach((f) => {
        if (f.classList.contains('bs-quer__feld--titel') && f === felder[0]) return;
        const clip = qs('.bs-quer__clip', f);
        const st = { trigger: f, containerAnimation: fahrt, start: 'left 90%', once: true };
        if (clip && f.dataset.aufbau) {
          // Aufbau in Stufen, an die Fahrt gekoppelt (vor und zurueck)
          gsap.fromTo(clip, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: `steps(${f.dataset.aufbau})`,
            scrollTrigger: { trigger: f, containerAnimation: fahrt, start: 'left 88%', end: 'left 38%', scrub: true } });
        } else if (clip) {
          const tl = gsap.timeline({ scrollTrigger: st })
            .fromTo(clip, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut' });
          const bild = clip.classList.contains('bs-quer__buehne') || clip.classList.contains('bs-quer__paar') ? null : qs('img', clip);
          const plus = qs('.bs-quer__plus', clip);
          if (plus) tl.fromTo(plus, { '--bs-plus': 0 }, { '--bs-plus': 1, duration: 0.9, ease: 'expo.inOut' }, 0.55);
          if (bild) tl.fromTo(bild, { scale: 1.25 }, { scale: 1, duration: 1.5, ease: 'expo.out' }, 0);
        } else {
          gsap.from(f.children, { y: 50, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, scrollTrigger: st });
        }
      });
      // Tastatur (K-WR-06): Fokus in einem Feld holt die passende Stelle der Fahrt ins Bild, statt den Pin seitlich zu scrollen
      const aufFokus = (e) => {
        const f = e.target.closest('.bs-quer__feld');
        const st = fahrt.scrollTrigger;
        if (!f || !st) return;
        const w = weg(), x = Math.min(w, Math.max(0, f.offsetLeft - window.innerWidth * 0.3));
        const y = st.start + (st.end - st.start) * (x / (w || 1));
        if (window.lenis) window.lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y);
      };
      spur.addEventListener('focusin', aufFokus);
      return () => { spur.removeEventListener('focusin', aufFokus); ScrollTrigger.removeEventListener('refreshInit', setH); root.style.height = ''; felder.forEach((f) => { f.style.opacity = ''; }); };
    });
    mm.add('(max-width: 991px)', () => {
      felder.forEach((f) => {
        const clip = qs('.bs-quer__clip', f);
        if (clip && f.dataset.aufbau) gsap.fromTo(clip, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: `steps(${f.dataset.aufbau})`,
          scrollTrigger: { trigger: f, start: 'top 82%', end: 'top 30%', scrub: true } });
        else if (clip) clipReveal(clip);
        else gsap.from(f.children, { y: 40, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: f, start: 'top 86%', once: true } });
      });
    });
    // Kopf-Ton am Blatt ausrichten
    ScrollTrigger.create({ trigger: root, start: 'top bottom', end: 'bottom top', onUpdate: tonMessen, onRefresh: tonMessen });
  }
  const buehnen = Object.fromEntries(qsa('[data-buehne]', root).map((b) => [b.dataset.buehne, b]));
  return { el: root, start, buehnen };
}
