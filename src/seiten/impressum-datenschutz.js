// Vorlage „Lesen“ fuer /impressum und /datenschutz (Paket C): ruhige Rechtsseite, Text wortlich aus den Daten.
// Aufbau der Daten (src/inhalt/impressum.js, datenschutz.js): ABSCHNITTE = [{ titel, inhalt: [{ typ: 'absatz', text, teile? } |
// { typ: 'liste', punkte: [{ text, teile? }] }] }]. Zeilenumbrueche (\n) werden zu <br>, Links aus `teile` bleiben Links.
// Die VERMERKE der Daten sind intern (Entwurfsstand) und erscheinen nicht auf der Seite.
import { kapitelseite, seitenkopf, weiterKapitel, teileHtml, esc, el, reduced, gsap } from './gemeinsam.js';
import './impressum-datenschutz.css';

const zeilen = (html) => html.replace(/\n/g, '<br />');
const textHtml = (x) => zeilen(x.teile ? teileHtml(x.teile) : esc(x.text));
const anker = (titel, i) => `abschnitt-${i + 1}`;

/**
 * @param {object} D  Datenmodul (KOPF, ABSCHNITTE, SCHLUSSLINKS)
 * @param {{inhaltsverzeichnis?: boolean}} [o]
 */
export function rechtsseite(D, o = {}) {
  const S = kapitelseite();
  S.main.append(seitenkopf({ ...D.KOPF, netz: false }));

  const abschnitte = D.ABSCHNITTE.map((a, i) => {
    // 11.1 / 11.2: Unterabschnitte (live gleich gestaltet, hier als h3 fuer die Gliederung)
    const unter = /^\d+\.\d+\s/.test(a.titel);
    const h = unter ? 'h3' : 'h2';
    const teile = a.inhalt.map((b) => (b.typ === 'liste'
      ? `<ul class="nn-lesen__liste">${b.punkte.map((p) => `<li>${textHtml(p)}</li>`).join('')}</ul>`
      : `<p>${textHtml(b)}</p>`)).join('');
    return `<section class="nn-lesen__teil${unter ? ' nn-lesen__teil--unter' : ''}" id="${anker(a.titel, i)}" aria-labelledby="${anker(a.titel, i)}-t">
        <${h} class="nn-lesen__titel" id="${anker(a.titel, i)}-t">${esc(a.titel)}</${h}>${teile}
      </section>`;
  }).join('');

  const verzeichnis = o.inhaltsverzeichnis
    ? `<nav class="nn-lesen__nav" data-lenis-prevent aria-label="${esc(D.KOPF.h1.replace(/­/g, ''))}">
        <ol>${D.ABSCHNITTE.map((a, i) => `<li${/^\d+\.\d+\s/.test(a.titel) ? ' class="nn-lesen__nav-unter"' : ''}><a href="#${anker(a.titel, i)}">${esc(a.titel)}</a></li>`).join('')}</ol>
      </nav>`
    : '';

  const body = el(`
    <section class="nn-lesen bs-ton-hell${o.inhaltsverzeichnis ? ' nn-lesen--nav' : ''}" data-ton="hell" aria-label="${esc(D.KOPF.h1.replace(/­/g, ''))}">
      <div class="bs-wrap nn-lesen__raster">
        ${verzeichnis}
        <div class="nn-lesen__text">${abschnitte}</div>
      </div>
    </section>`);
  S.main.append(body);

  // Querverweis am Ende: der Schlusslink der Live-Seite („→ Datenschutzerklärung“ bzw. „→ Impressum“)
  for (const l of D.SCHLUSSLINKS) {
    S.main.append(weiterKapitel({ label: D.KOPF.eyebrow, titel: l.text.replace(/^→\s*/, ''), href: l.href, ton: 'dunkel' }));
  }

  // Aktiven Abschnitt im Verzeichnis markieren (nur Anzeige, kein Scroll-Effekt)
  if (o.inhaltsverzeichnis) {
    const links = new Map([...body.querySelectorAll('.nn-lesen__nav a')].map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((eintraege) => {
      for (const e of eintraege) {
        if (!e.isIntersecting) continue;
        links.forEach((a) => a.removeAttribute('aria-current'));
        links.get(e.target.id)?.setAttribute('aria-current', 'true');
      }
    }, { rootMargin: '-30% 0px -60% 0px' });
    body.querySelectorAll('.nn-lesen__teil').forEach((t) => io.observe(t));
  }

  // Einspielung: Abschnitte steigen leicht auf (ruhig, nur einmal)
  S.nachStart(() => {
    if (reduced) return;
    body.querySelectorAll('.nn-lesen__teil').forEach((t) => {
      gsap.from(t, { y: 26, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 92%', once: true } });
    });
  });
  S.fertig();
  return S;
}
