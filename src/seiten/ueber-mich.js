// /ueber-mich (Paket C, Vorlage „Mensch“ nach Landos „Off Track“): Seitenkopf, Ueberwachungs-Karte (HUD) mit Profil,
// die 6 Staerken als quer laufende Kapitel in der Ganzkoerper-Szene aus dem Hero-Kern (die eine grosse Szene der Seite),
// Gespraech/LinkedIn, Zertifikate als Titel mit Lorbeer, weiter zum Kontakt.
// Der KI-Film unter dem Seitenkopf (NnFilm.tsx der Live-Seite) ist entfallen (Frank 17.11.2026: „Das Video nehmen wir
// komplett raus“); das Profil folgt direkt auf den Seitenkopf.
// Texte und Dateien wortlich aus src/inhalt/ueber-mich.js (page.tsx, NnHud.tsx, LinkedInButton.tsx).
// JSON-LD Person und Open Graph stehen statisch in ueber-mich/index.html.
import { kapitelseite, seitenkopf, weiterKapitel, esc, el, qs, qsa, knopf, ziel, reduced, gsap, ScrollTrigger } from './gemeinsam.js';
import * as U from '../inhalt/ueber-mich.js';
import { KOPF as KONTAKT } from '../inhalt/kontakt.js';
import figuren from '../../figuren.json';
import './ueber-mich.css';

const S = kapitelseite();
S.main.append(seitenkopf(U.KOPF));

/* ---------------- Profil: HUD-Karte (NnHud.tsx), Name/Rolle/Ort, drei Absaetze ---------------- */
const H = U.HUD;
const P = U.PROFIL;
// Spy-Check im Mantel (Frank, 14.11.2026): die HUD-Karte der Live-Seite als Live-Overlay auf Frank im Mantel
// (Ganzkoerper frontal, links, rechts aus figuren.json), wie eine Ueberwachungskamera, die alle paar Sekunden per
// Scan-Band den Blickwinkel wechselt. Das alte Video ueberwachung.mp4 zeigt andere Kleidung und ist kein Hauptbild mehr.
// Gesichtsrahmen aus den Kopf-Ankern der Bilder (figuren.json), HUD-Texte wortlich aus HUD. Im Abgleich-Panel steht wie
// live das echte Portraet. Reduced Motion: Standbild frontal mit allen HUD-Elementen, ohne Rauschen und Wechsel.
// Seit 15.11.2026 (Frank): Frank im Ganzkoerper aus den Referenzbildern (figuren.szenen.frank, dieselben wie die L3-Karte
// der Startseite). Die Taillenbilder zeigten einen Knopfmantel, der zu keinem anderen Bild passt. Karte 2:3 wie die
// Bilder, das Bild fuellt sie ganz; Gesichtsrahmen aus den Ankern (oben = Scheitel, kh = Kopfhoehe, b = Kopfbreite).
const ANSICHTEN = figuren.szenen.frank.ansichten;
const KARTE_SEITE = 2 / 3;                                    // Breite / Hoehe der Karte (= Bilder 1024 x 1536)
const KAMERAS = ['frontal', 'links', 'rechts'].map((k) => {
  const v = ANSICHTEN[k];
  const a = v.anker;
  const name = v.foto;
  const m = figuren.bilder[name];
  const s = Math.max(a.kh / KARTE_SEITE, a.b) * 1.25;         // Rahmen (quadratisch) als Anteil der Kartenbreite
  const ym = a.oben + a.kh * 0.5;                              // Kopfmitte als Anteil der Kartenhoehe
  return {
    src: `/bilder/${name}-1000.webp`, srcset: m.breiten.map((w) => `/bilder/${name}-${w}.webp ${w}w`).join(', '),
    rahmen: { left: `${((a.x - s / 2) * 100).toFixed(2)}%`, top: `${((ym - (s * KARTE_SEITE) / 2) * 100).toFixed(2)}%`, width: `${(s * 100).toFixed(2)}%` },
  };
});
const HUD_SIZES = '(max-width: 991px) 100vw, 420px';
const hudHtml = `
  <div class="nn-hud${reduced ? ' nn-hud--ruhig' : ''}" role="img" aria-label="${esc(H.ariaLabel)}">
    <img class="nn-hud__bild" src="${KAMERAS[0].src}" srcset="${KAMERAS[0].srcset}" sizes="${HUD_SIZES}" alt="" decoding="async" />
    <img class="nn-hud__bild nn-hud__bild--neu" alt="" decoding="async" hidden />
    <div class="nn-hud__toenung"></div>
    <canvas class="nn-hud__rauschen" width="120" height="180"></canvas>
    <div class="nn-hud__ebene" aria-hidden="true">
      <div class="nn-hud__scan"></div>
      <div class="nn-hud__band"></div>
      <div class="nn-hud__verlauf"></div>
      <i class="nn-hud__ecke nn-hud__ecke--ol"></i><i class="nn-hud__ecke nn-hud__ecke--or"></i>
      <i class="nn-hud__ecke nn-hud__ecke--ul"></i><i class="nn-hud__ecke nn-hud__ecke--ur"></i>
      <div class="nn-hud__rahmen"></div>
      <div class="nn-hud__gesicht"><span>${esc(H.gesichtText)}</span>${[[32, 42], [68, 42], [50, 60], [37, 76], [63, 76], [50, 18]].map(([px, py]) => `<b style="left:${px}%;top:${py}%"></b>`).join('')}</div>
      <div class="nn-hud__abgleich">
        <b>${esc(H.abgleich.titel)}</b>
        <img src="${esc(H.portraitAbgleich.datei)}" alt="" decoding="async" />
        <div class="nn-hud__daten">${H.abgleich.daten.map((d) => `<div>${esc(d).replace(/ {2,}/g, (m) => '&nbsp;'.repeat(m.length))}</div>`).join('')}</div>
        <div class="nn-hud__balken"><i></i></div>
      </div>
      ${H.skills.map((s, i) => `
        <div class="nn-hud__verb" style="top:calc(${52 + i * 11}% + 2.4cqw);animation-delay:${(1.8 + i * 0.35).toFixed(2)}s"></div>
        <div class="nn-hud__skill" style="top:${52 + i * 11}%;animation-delay:${(1.95 + i * 0.35).toFixed(2)}s"><small>${esc(s.label.toUpperCase())}</small><em>${esc(s.value)}</em></div>`).join('')}
      <div class="nn-hud__rec"><i></i>${esc(H.rec)}</div>
      <div class="nn-hud__ki">${esc(H.kennzeichnung)}</div>
      <div class="nn-hud__zeit"></div>
    </div>
  </div>`;
const profil = el(`
  <section class="nn-profil bs-ton-dunkel" data-ton="dunkel" aria-label="${esc(P.name)}">
    <div class="bs-wrap nn-profil__raster">
      <div class="nn-profil__karte">
        ${hudHtml}
        <div class="nn-profil__wer">
          <p class="nn-profil__name">${esc(P.name)}</p>
          <p class="nn-profil__rolle">${esc(P.rolle)}</p>
          <p class="nn-profil__ort">${esc(P.ort)}</p>
        </div>
      </div>
      <div class="nn-profil__text">
        ${P.absaetze.map((a, i) => `<p class="${i === 0 ? 'nn-profil__einstieg' : 'nn-profil__absatz'}" data-reveal="bar"${i ? ` data-delay="${(i * 0.1).toFixed(1)}"` : ''}>${esc(a)}</p>`).join('')}
      </div>
    </div>
  </section>`);
S.main.append(profil);

// HUD: Kamera, Rauschen und Animation nur im Sichtbereich (ab 25 %), Uhr jede Sekunde
const hud = qs('.nn-hud', profil);
const bildAlt = qs('.nn-hud__bild', hud);
const bildNeu = qs('.nn-hud__bild--neu', hud);
const band = qs('.nn-hud__band', hud);
const gesicht = qs('.nn-hud__gesicht', hud);
const zeitEl = qs('.nn-hud__zeit', hud);
const rauschen = qs('.nn-hud__rauschen', hud);
const pad = (n) => String(n).padStart(2, '0');
const zeitText = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;   // H.zeitFormat
const tick = () => { zeitEl.textContent = zeitText(new Date()); };
tick();
setInterval(tick, 1000);
Object.assign(gesicht.style, KAMERAS[0].rahmen);
// Rauschen: kleines Graubild, hochskaliert; bei Reduced Motion ein festes Bild
const rctx = rauschen.getContext('2d');
const rbild = rctx.createImageData(rauschen.width, rauschen.height);
function rauschZeichnen() {
  const d = rbild.data;
  for (let i = 0; i < d.length; i += 4) { const v = (Math.random() * 255) | 0; d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 255; }
  rctx.putImageData(rbild, 0, 0);
}
rauschZeichnen();
let kamera = 0; let hudSichtbar = false; let wechselUhr = 0; let rauschUhr = 0; let geladen = false;
function kameraWechsel() {
  if (!hudSichtbar || reduced) return;
  const n = (kamera + 1) % KAMERAS.length;
  const k = KAMERAS[n];
  bildNeu.srcset = k.srcset; bildNeu.sizes = HUD_SIZES; bildNeu.src = k.src;
  bildNeu.hidden = false;
  const fertig = () => {
    gsap.timeline({ onComplete: () => { bildAlt.srcset = k.srcset; bildAlt.src = k.src; bildNeu.hidden = true; kamera = n; } })
      .fromTo(bildNeu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power2.inOut' }, 0)
      .fromTo(band, { top: '0%', autoAlpha: 1 }, { top: '100%', duration: 0.7, ease: 'power2.inOut' }, 0)
      .set(band, { autoAlpha: 0 })
      .fromTo(hud, { '--stoer': 1 }, { '--stoer': 0, duration: 0.35, ease: 'steps(4)' }, 0);
    Object.assign(gesicht.style, k.rahmen);
  };
  if (bildNeu.complete && bildNeu.naturalWidth) fertig(); else bildNeu.addEventListener('load', fertig, { once: true });
}
new IntersectionObserver(([e]) => {
  hudSichtbar = e.isIntersecting;
  hud.classList.toggle('nn-hud--an', hudSichtbar);
  if (reduced) return;
  clearInterval(wechselUhr); clearInterval(rauschUhr);
  if (!hudSichtbar) return;
  if (!geladen) { geladen = true; KAMERAS.slice(1).forEach((k) => { const i = new Image(); i.srcset = k.srcset; i.sizes = HUD_SIZES; i.src = k.src; }); }
  wechselUhr = setInterval(kameraWechsel, 4200);
  rauschUhr = setInterval(rauschZeichnen, 90);
}, { threshold: H.regeln.sichtbarAb }).observe(hud);
window.__hud = { wechsel: kameraWechsel, kameras: KAMERAS };   // fuer die Pruefung

/* ---------------- Was mich auszeichnet: 6 Staerken quer laufend in der Ganzkoerper-Szene ----------------
   Die Szene (createSzene aus @kern/hero/szene.js, figuren.szenen.frank) pinnt selbst: Strecke von 4 Bildschirmhoehen.
   Waehrend der Strecke dreht sich Frank (frontal, links, frontal, rechts) und wird in der Mitte zum Exo; links laufen die
   Staerken seitlich durch. Reduced Motion oder kein WebGL2: Standbild, die Staerken stehen als Liste daneben. */
const ST = P.staerken;
const zwei = (n) => String(n).padStart(2, '0');
const staerken = el(`
  <section class="nn-staerken szene" id="staerken" data-ton="dunkel" aria-labelledby="staerken-titel" style="--szene-scroll:3">
    <div class="szene__pin">
      <div class="nn-staerken__ui">
        <h2 class="nn-staerken__titel" id="staerken-titel">${esc(ST.h2)}</h2>
        <p class="nn-staerken__zaehler" aria-hidden="true"><b>01</b><span> / ${zwei(ST.liste.length)}</span></p>
        <div class="nn-staerken__fenster">
          <ol class="nn-staerken__spur">
            ${ST.liste.map((t, i) => `<li class="nn-staerke${i === 0 ? ' is-aktiv' : ''}"><span class="nn-staerke__kopf" aria-hidden="true"><b>${zwei(i + 1)}</b><i>${esc(ST.haken)}</i></span><p>${esc(t)}</p></li>`).join('')}
          </ol>
        </div>
        <div class="nn-staerken__punkte" aria-hidden="true">${ST.liste.map(() => '<i></i>').join('')}</div>
      </div>
    </div>
  </section>`);
S.main.append(staerken);
const spur = qs('.nn-staerken__spur', staerken);
const karten = qsa('.nn-staerke', staerken);
const punkte = qsa('.nn-staerken__punkte i', staerken);
const zaehler = qs('.nn-staerken__zaehler b', staerken);
let aktiv = -1;
function staerkenSetzen(p) {
  if (staerken.classList.contains('szene--still') || reduced) return;
  const t = Math.min(1, Math.max(0, (p - 0.06) / 0.84));          // Anteil der Strecke, auf dem die Spur laeuft
  const i = Math.min(karten.length - 1, Math.floor(t * karten.length));
  if (i === aktiv) return;
  aktiv = i;
  // je Kapitel ein Schritt nach links (weich per CSS-Uebergang), die aktive Karte steht immer ganz im Fenster
  const schritt = karten[1] ? karten[1].offsetLeft - karten[0].offsetLeft : 0;
  spur.style.transform = `translate3d(${(-i * schritt).toFixed(1)}px,0,0)`;
  karten.forEach((k, j) => k.classList.toggle('is-aktiv', j === i));
  punkte.forEach((k, j) => k.classList.toggle('is-an', j <= i));
  zaehler.textContent = zwei(i + 1);
}

// Ablauf der Figur fuer diese Seite (ueberschreibt den Beispielablauf in figuren.json): Drehung, Exo in der Mitte, zurueck
const ABLAUF = {
  ansichten: [{ bei: 0, ansicht: 'frontal' }, { bei: 0.2, ansicht: 'links' }, { bei: 0.42, ansicht: 'frontal' }, { bei: 0.64, ansicht: 'rechts' }, { bei: 0.86, ansicht: 'frontal' }],
  exo: [{ von: 0.3, bis: 0.46, zu: 1 }, { von: 0.76, bis: 0.9, zu: 0 }],
  punkte: [],
};
const PLATZ = { desktop: { x: 0.74, y: 0.53, hoehe: 0.86 }, mobil: { x: 0.5, y: 0.34, hoehe: 0.58 } };
let szene = null;
async function szeneAn() {
  if (szene || window.__szeneLaedt) return;
  window.__szeneLaedt = true;
  try {
    const [{ createSzene }, { default: figuren }] = await Promise.all([import('@kern/hero/szene.js'), import('../../figuren.json')]);
    szene = createSzene(staerken, { figuren, szene: 'frank', scrollhoehe: 3, ablauf: ABLAUF, platz: PLATZ });
    window.__szenen = [szene];
    szene.bereit.then((m) => { if (m === 'still') { staerken.classList.add('nn-staerken--liste'); ScrollTrigger.refresh(); } });
    if (szene.modus === 'still') { staerken.classList.add('nn-staerken--liste'); ScrollTrigger.refresh(); }
  } catch (e) {
    console.warn('[ueber-mich] Szene nicht geladen, die Staerken stehen als Liste:', e?.message || e);
    staerken.classList.add('nn-staerken--liste');
    ScrollTrigger.refresh();
  }
}
if (reduced) staerken.classList.add('nn-staerken--liste');
new IntersectionObserver(([e], io) => { if (e.isIntersecting) { io.disconnect(); szeneAn(); } }, { rootMargin: '200% 0px' }).observe(staerken);
window.addEventListener('pagehide', (e) => { if (!e.persisted) szene?.dispose?.(); });

/* ---------------- Gespraech anfragen, LinkedIn ---------------- */
const LI = U.LINKEDIN_KNOPF;
const LI_PFAD = 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';
const wege = el(`
  <section class="nn-wege bs-ton-dunkel" data-ton="dunkel" aria-label="${esc(P.cta.text)}">
    <div class="bs-wrap nn-wege__innen" data-reveal="up">
      ${knopf({ text: P.cta.text, href: P.cta.href, gross: true })}
      <a class="nn-linkedin" ${ziel({ href: LI.href, extern: true })} aria-label="${esc(LI.ariaLabel)}">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="2" y="2" width="20" height="20" fill="#fff" /><path fill="${esc(LI.farbe)}" d="${LI_PFAD}" /></svg>
        <span>${esc(LI.label)}</span><span class="nn-linkedin__pfeil" aria-hidden="true">${esc(LI.pfeil)}</span>
      </a>
    </div>
  </section>`);
S.main.append(wege);

/* ---------------- Zertifikate: zwei Titel mit Lorbeer (Lando: Titel) ---------------- */
const Z = U.ZERTIFIKATE;
// Lorbeerzweig als Schmuck (eigene Zeichnung, kein Logo): Blaetter paarweise entlang eines Bogens
function zweig(spiegeln) {
  const cx = 56; const cy = 58;
  const bl = [];
  for (let i = 0; i < 7; i++) {
    const th = ((112 + i * 21) * Math.PI) / 180;            // von unten (112°) ueber links nach oben (238°)
    for (const [r, kipp] of [[47, -30], [37, 30]]) {
      const x = cx + r * Math.cos(th); const y = cy + r * Math.sin(th);
      const rot = (th * 180) / Math.PI + 90 + kipp;
      bl.push(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(7.4 - i * 0.4).toFixed(1)}" ry="${(3.1 - i * 0.14).toFixed(1)}" transform="rotate(${rot.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" />`);
    }
  }
  return `<svg class="nn-lorbeer${spiegeln ? ' nn-lorbeer--r' : ''}" viewBox="0 0 50 116" aria-hidden="true" focusable="false"><path d="M 45.1 98.6 A 42 42 0 0 1 38.2 19.9" fill="none" stroke="currentColor" stroke-width="1.4" />${bl.join('')}</svg>`;
}
const zert = el(`
  <section class="nn-zert bs-ton-hell" data-ton="hell" id="${esc(Z.id)}" aria-labelledby="zertifikate-titel">
    <div class="bs-wrap">
      <div class="ks-ab__kopf nn-zert__kopf">
        <p class="bs-label bs-label--mitte" data-reveal="bar">${esc(Z.eyebrow)}</p>
        <h2 class="ks-ab__titel" id="zertifikate-titel" data-reveal="bar">${esc(Z.h2)}</h2>
        <p class="ks-ab__intro" data-reveal="bar" data-delay="0.12">${esc(Z.text)}</p>
      </div>
      <div class="nn-zert__karten">
        ${Z.karten.map((k) => `
          <article class="nn-zert__karte">
            <a class="nn-zert__bild" ${ziel({ href: k.link.datei || k.link.href, extern: true })} aria-label="${esc(k.bildAriaLabel)}">
              <img src="${esc(k.bild.datei)}" alt="${esc(k.bild.alt)}" width="${k.bild.width}" height="${k.bild.height}" loading="lazy" decoding="async" />
            </a>
            <p class="nn-zert__aussteller">${esc(k.aussteller)}</p>
            <div class="nn-zert__titelzeile">${zweig(false)}<h3 class="nn-zert__titel">${esc(k.titel)}</h3>${zweig(true)}</div>
            <p class="nn-zert__ebene">${esc(k.ebene)}</p>
            <p class="nn-zert__text">${esc(k.text)}</p>
            <p class="nn-zert__inhalte">${k.inhalte.map(esc).join('<br />')}</p>
            <p class="nn-zert__nachweis">${esc(k.nachweis)}</p>
            <a class="bs-link nn-zert__link" ${ziel({ href: k.link.datei || k.link.href, extern: true })}><span>${esc(k.link.text.replace(/\s*→$/, ''))}</span><i aria-hidden="true">→</i></a>
          </article>`).join('')}
      </div>
    </div>
  </section>`);
S.main.append(zert);

/* ---------------- Weiter zum naechsten Kapitel ---------------- */
S.main.append(weiterKapitel({ label: 'Weiter zum nächsten Kapitel', titel: KONTAKT.eyebrow, text: KONTAKT.h1, href: '/kontakt', ton: 'dunkel' }));

/* ---------------- Bewegung ---------------- */
S.nachStart(() => {
  ScrollTrigger.create({ trigger: staerken, start: 'top top', end: 'bottom bottom', onUpdate: (s) => staerkenSetzen(s.progress), onRefresh: (s) => { aktiv = -1; staerkenSetzen(s.progress); } });
  if (reduced) return;
  // HUD-Karte und Name: Clip von unten
  gsap.from(qs('.nn-profil__karte', profil), { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut', clearProps: 'clipPath', scrollTrigger: { trigger: profil, start: 'top 80%', once: true } });
  // Zertifikate: Bilder per Clip, Lorbeer waechst, Rest steigt auf
  qsa('.nn-zert__karte', zert).forEach((k, i) => {
    gsap.timeline({ scrollTrigger: { trigger: k, start: 'top 85%', once: true }, delay: i * 0.12 })
      .from(qs('.nn-zert__bild', k), { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.1, ease: 'expo.inOut', clearProps: 'clipPath' })
      .from(qsa('.nn-lorbeer', k), { scale: 0.6, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08 }, '-=0.5')
      .from([...k.children].filter((c) => !c.classList.contains('nn-zert__bild')), { y: 20, opacity: 0, duration: 0.7, ease: 'expo.out', stagger: 0.05 }, '-=0.7');
  });
});

S.fertig();
