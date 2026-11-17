// /ki-im-unternehmen (Vorlage „Beweis“, Lando On Track). Alle Texte wortlich aus src/inhalt/ki-im-unternehmen.js,
// in der Reihenfolge der Live-Seite (REIHENFOLGE). Grosse Szene der Seite: das drehbare 3D-Architekturmodell, das beim
// Hereinscrollen aufzieht und sich in seine Ausgangslage dreht. Alles andere sind Einspielungen (Balken, Clip, Zaehler).
import {
  kapitelseite, seitenkopf, abschnitt, ebenenmodell, weiterKapitel, teileHtml, zahlHoch,
  gsap, reduced, esc, el, qs, qsa, knopf, ziel,
} from './gemeinsam.js';
import { check } from '@kern/bausteine/index.js';
import * as I from '../inhalt/ki-im-unternehmen.js';
import { LEAD } from '../inhalt/backend.js';
import { KOPF as METHODE_KOPF } from '../inhalt/methode.js';
import './ki-im-unternehmen.css';

const S = kapitelseite();
const main = S.main;

/* ---------------- 0 Seitenkopf (Antwort zuerst) ---------------- */
main.append(seitenkopf({
  ...I.KOPF,
  sprung: [
    { text: I.VORGEHEN.kicker, href: `#${I.VORGEHEN.id}` },
    { text: I.REIFEGRAD.kicker, href: `#${I.REIFEGRAD.id}` },
    { text: I.WERTSCHOEPFUNG.kicker, href: `#${I.WERTSCHOEPFUNG.id}` },
    { text: I.VORGEHENSMODELL.kicker, href: '#vorgehensmodell' },
    { text: I.ARCHITEKTUR.kicker, href: `#${I.ARCHITEKTUR.id}` },
  ],
}));

/* ---------------- 1 Woran es haengt: Vergleich, Riesenzahlen 80 % / 6 % ---------------- */
{
  const W = I.WORAN_ES_HAENGT;
  const a = abschnitt({ id: 'woran-es-haengt', kicker: W.kicker, titel: W.titel, intro: W.intro });
  const D = W.diagramm;
  a.inhalt.append(el(`
    <div class="ks-zwei kiu-vergleich" data-reveal="up">
      ${W.vergleich.map((v) => `
        <div class="ks-karte${v.akzent ? ' ks-karte--akzent' : ''}">
          <h3 class="ks-karte__titel">${esc(v.titel)}</h3>
          <ul class="ks-striche">${v.punkte.map((p) => `<li>${esc(W.punktVor)}${esc(p)}</li>`).join('')}</ul>
        </div>`).join('')}
    </div>`));
  const fig = el(`
    <figure class="ks-figur kiu-zahlen">
      <figcaption class="ks-figur__titel" data-reveal="bar">${esc(D.titel)}</figcaption>
      <div class="kiu-zahlen__reihen">
        ${D.balken.map((b) => `
          <div class="kiu-zahl${b.akzent ? ' kiu-zahl--akzent' : ''}">
            <p class="kiu-zahl__wert" aria-hidden="true"><b data-wert="${b.v}">${esc(b.anzeige.replace(/\s*%$/, ''))}</b><span>%</span></p>
            <div class="kiu-zahl__balken" aria-hidden="true"><i style="--w:${b.v / 100}"></i></div>
            <p class="kiu-zahl__label"><span class="sr-only">${esc(b.anzeige)} </span>${esc(b.label)}</p>
          </div>`).join('')}
      </div>
      <p class="ks-quelle">${teileHtml(D.quelle)}</p>
    </figure>`);
  a.inhalt.append(fig);
  main.append(a.el);
  S.nachStart(() => {
    qsa('.kiu-zahl__wert b', fig).forEach((b) => zahlHoch(b, Number(b.dataset.wert), { dauer: 2 }));
    if (reduced) return;
    qsa('.kiu-zahl__balken i', fig).forEach((i, n) => gsap.fromTo(i, { scaleX: 0 }, { scaleX: 1, duration: 1.6, delay: n * 0.15, ease: 'expo.out', scrollTrigger: { trigger: i, start: 'top 88%', once: true } }));
  });
}

/* ---------------- 2 Kurs · Crew · Schiff: Dreieck, drei Karten, Symptomtabelle ---------------- */
{
  const V = I.VORGEHEN;
  const T = V.dreieck;
  const a = abschnitt({ id: V.id, kicker: V.kicker, titel: V.titel, intro: V.intro, ton: 'hell' });
  // Dreieck wie live (viewBox 0 -50 600 350): Ecken mit Name und Sachbegriff, in der Mitte „ein Vorhaben“
  const ecke = (p, i) => {
    const oben = p.y < 100;
    return `<g class="kiu-ecke" data-i="${i}">
      <circle class="kiu-ecke__ring" cx="${p.x}" cy="${p.y}" r="30" />
      <circle class="kiu-ecke__punkt" cx="${p.x}" cy="${p.y}" r="5" />
      <text class="kiu-ecke__name" x="${p.x}" y="${p.y + (oben ? -62 : 56)}" text-anchor="middle">${esc(p.t)}</text>
      <text class="kiu-ecke__sach" x="${p.x}" y="${p.y + (oben ? -42 : 76)}" text-anchor="middle">${esc(p.s)}</text>
    </g>`;
  };
  const dreieck = el(`
    <div class="kiu-dreieck">
      <svg viewBox="${T.viewBox}" role="img" aria-label="${esc(T.ariaLabel)}">
        <polygon class="kiu-dreieck__linie" points="${T.polygon}" pathLength="1" />
        ${T.punkte.map(ecke).join('')}
        <text class="kiu-dreieck__mitte" x="300" y="160" text-anchor="middle">${esc(T.mitte)}</text>
      </svg>
    </div>`);
  a.inhalt.append(dreieck);
  const karten = el(`
    <div class="ks-drei kiu-kcs">
      ${V.karten.map((d, i) => `
        <article class="ks-karte kiu-kcs__karte" data-i="${i}">
          <div class="kiu-kcs__kopf"><h3>${esc(d.name)}</h3><span>${esc(d.fach)}</span></div>
          <p class="kiu-kcs__claim">${esc(d.claim)}</p>
          <p class="kiu-kcs__text">${esc(d.desc)}</p>
        </article>`).join('')}
    </div>`);
  a.inhalt.append(karten);
  // Karte und Ecke gehoeren zusammen: Hover oder Fokus auf der Karte hebt die Ecke hervor
  qsa('.kiu-kcs__karte', karten).forEach((k) => {
    const an = (x) => qs(`.kiu-ecke[data-i="${k.dataset.i}"]`, dreieck).classList.toggle('is-an', x);
    k.addEventListener('pointerenter', () => an(true)); k.addEventListener('pointerleave', () => an(false));
    k.addEventListener('focus', () => an(true)); k.addEventListener('blur', () => an(false));
  });
  const Y = V.symptome;
  a.inhalt.append(el(`
    <figure class="ks-figur kiu-symptome">
      <figcaption class="ks-figur__titel" data-reveal="bar">${esc(Y.titel)}</figcaption>
      <div class="ks-tabelle" role="table" aria-label="${esc(Y.ariaLabel)}">
        ${Y.zeilen.map((z) => `<div class="ks-tabelle__zeile" role="row"><p class="ks-tabelle__kopf" role="rowheader">${esc(z.kopf)}</p><p class="ks-tabelle__text" role="cell">${esc(z.text)}</p></div>`).join('')}
      </div>
    </figure>`));
  main.append(a.el);
  S.nachStart(() => {
    if (reduced) return;
    const svg = qs('svg', dreieck);
    gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 80%', once: true } })
      .fromTo(qs('.kiu-dreieck__linie', svg), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'expo.inOut' })
      .fromTo(qsa('.kiu-ecke', svg), { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.7, stagger: 0.14, ease: 'back.out(1.6)' }, 0.5)
      .fromTo(qs('.kiu-dreieck__mitte', svg), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 1.1);
    qsa('.kiu-kcs__karte', karten).forEach((k, i) => gsap.fromTo(k, { clipPath: 'inset(100% 0% 0% 0% round 14px)', y: 40 }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', y: 0, duration: 1.05, delay: i * 0.1, ease: 'expo.inOut', clearProps: 'clipPath,transform', scrollTrigger: { trigger: karten, start: 'top 85%', once: true } }));
  });
}

/* ---------------- 3 Reifegrad-Check, darunter die Checkliste zum Herunterladen ---------------- */
{
  const R = I.REIFEGRAD;
  const RC = R.check;
  const a = abschnitt({ id: R.id, kicker: R.kicker, titel: R.titel, intro: R.intro });
  // Konfiguration fuer den Baustein `check`: Fragen, Regeln und Texte wortlich aus REIFEGRAD_CHECK (wie start.js → CHECK),
  // im Ergebnis nur der Knopf der Live-Seite („Ergebnis gemeinsam besprechen“ → /kontakt).
  const rc = check({
    ariaLabel: R.kicker,
    fragen: RC.dimensionen.map((d) => ({ key: d.key, titel: d.title, etikett: d.quer ? RC.texte.querEtikett : '', antworten: d.levels })),
    auswerten(werte) {
      const e = I.reifegradAuswerten(werte);
      return { kopf: RC.texte.ergebnisKopf(e.avg), stufe: e.stufe.n, name: e.stufe.name, hinweis: e.gekappt ? RC.texte.gekappt(e.vorlaeufig, e.finale) : '', label: RC.texte.schrittLabel, text: e.stufe.schritt, roh: e };
    },
    stufeWort: 'Stufe',
    texte: { zaehler: (i) => RC.texte.zaehler(i), offen: (n) => RC.texte.offen(n), ergebnis: 'Ihre Einstiegsstufe', neu: RC.texte.neu },
    ctas: [{ ...RC.texte.cta, art: 'accent' }],
    fussnote: RC.texte.fussnote,
  });
  a.inhalt.append(el('<div class="kiu-check"></div>'));
  qs('.kiu-check', a.inhalt).append(rc.el);
  window.__check = rc;   // fuer qa
  a.inhalt.append(downloadKarte(R.checkliste));
  main.append(a.el);
}

/* ---------------- 4 Wertschoepfungsstufen (Pyramide), Quellenangabe im Kicker wie live ---------------- */
{
  const W = I.WERTSCHOEPFUNG;
  const a = abschnitt({ id: W.id, kicker: W.kicker, titel: W.titel, intro: W.intro, ton: 'hell' });
  const stufe = (s) => `
    <li class="kiu-stufe${s.corridor ? ' kiu-stufe--korridor' : ''}">
      <div class="kiu-stufe__form" aria-hidden="true"><i style="--w:${s.width}%"><b>${esc(s.n)}</b></i></div>
      <div class="kiu-stufe__text"><h3><span class="sr-only">${esc(s.n)} </span>${esc(s.title)}</h3><p>${esc(s.desc)}</p></div>
    </li>`;
  const vor = W.stufen.filter((s, i) => i < W.stufen.findIndex((x) => x.corridor));
  const korridor = W.stufen.filter((s) => s.corridor);
  const nach = W.stufen.slice(W.stufen.findIndex((x) => x.corridor) + korridor.length);
  const fig = el(`
    <figure class="ks-figur kiu-pyramide">
      <figcaption class="sr-only">${esc(W.srTitel)}</figcaption>
      <ol class="kiu-stufen">
        ${vor.map(stufe).join('')}
        <li class="kiu-korridor"><ol class="kiu-stufen">${korridor.map(stufe).join('')}</ol></li>
        ${nach.map(stufe).join('')}
      </ol>
      <p class="kiu-pyramide__hinweis">${esc(W.hinweis)}</p>
    </figure>`);
  // Nummerierung: die verschachtelte Liste soll fuer Screenreader keine eigene Ebene sein
  qs('.kiu-korridor', fig).setAttribute('role', 'presentation');
  a.inhalt.append(fig);
  main.append(a.el);
  S.nachStart(() => {
    if (reduced) return;
    const formen = qsa('.kiu-stufe__form i', fig);
    const texte = qsa('.kiu-stufe__text', fig);
    gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 78%', once: true } })
      .fromTo(formen, { scaleX: 0 }, { scaleX: 1, duration: 1.1, stagger: 0.12, ease: 'expo.out' })
      .fromTo(texte, { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, duration: 0.8, stagger: 0.12, ease: 'expo.out' }, 0.15)
      .fromTo(qs('.kiu-korridor', fig), { '--korridor': 0 }, { '--korridor': 1, duration: 1, ease: 'power2.out' }, 0.6);
  });
}

/* ---------------- 5 Vorgehensmodell: Ebenenmodell, drei Straenge (aufklappbar) ---------------- */
{
  const V = I.VORGEHENSMODELL;
  const a = abschnitt({ id: 'vorgehensmodell', kicker: V.kicker, titel: V.titel, intro: V.intro });
  a.inhalt.append(ebenenmodell(I.EBENENMODELL, V.ebenenmodellAktiv));
  a.inhalt.append(el(`
    <div class="ks-akk kiu-straenge" data-reveal="up">
      ${V.straenge.map((s) => `
        <details class="ks-akk__teil kiu-strang">
          <summary>
            <span class="kiu-strang__kopf">
              <span class="kiu-strang__name">${esc(s.name)}</span>
              <span class="kiu-strang__titel">${esc(s.title)}</span>
              ${s.note ? `<span class="kiu-strang__note">${esc(s.note)}</span>` : ''}
              <span class="kiu-strang__erg">${esc(V.ergebnisLabel)}${esc(s.result)}</span>
            </span>
            <span class="ks-akk__plus" aria-hidden="true"></span>
          </summary>
          <div class="ks-akk__inhalt">
            <ol class="kiu-schritte">${s.steps.map((t, i) => `<li><b>${i + 1}</b><span>${esc(t)}</span></li>`).join('')}</ol>
          </div>
        </details>`).join('')}
    </div>`));
  main.append(a.el);
}

/* ---------------- 6 Architektur: drehbares 3D-Modell (grosse Szene), Download, sieben Schichten ---------------- */
{
  const A = I.ARCHITEKTUR;
  const M = A.modell3d;
  const a = abschnitt({ id: A.id, kicker: A.kicker, titel: A.titel, intro: A.intro, klasse: 'kiu-arch' });
  const figur = el(`
    <figure class="kiu-modell">
      <div class="kiu-modell__rahmen">
        <div class="kiu-modell__buehne" data-lenis-prevent-wheel>${M.markup}</div>
        <div class="kiu-modell__signatur" aria-hidden="true">
          <img src="/brand/nn-monogramm.png" alt="" width="40" height="40" decoding="async" />
          <div><b>${esc(M.signatur.zeile1)}</b><small>${esc(M.signatur.zeile2)}</small></div>
        </div>
        <button class="kiu-modell__voll" type="button">${esc(M.vollbild.an)}</button>
        <p class="kiu-modell__laden" aria-hidden="true">${esc(M.signatur.zeile2)} …</p>
      </div>
      <figcaption class="ks-quelle">${esc(M.bildunterschrift)}</figcaption>
    </figure>`);
  a.inhalt.append(figur);
  a.inhalt.append(downloadKarte(A.download, { vorschau: A.vorschau }));
  const U = A.uebersicht;
  const karte = (n, titel, items) => `<div class="kiu-schicht"><p class="kiu-schicht__titel"><b>${esc(n)}</b>${esc(titel)}</p>${items ? `<p class="kiu-schicht__text">${esc(items)}</p>` : ''}</div>`;
  a.inhalt.append(el(`
    <details class="ks-akk__teil kiu-uebersicht">
      <summary><span class="kiu-uebersicht__sum">${esc(U.summary)}</span><span class="ks-akk__plus" aria-hidden="true"></span></summary>
      <div class="ks-akk__inhalt">
        <div class="kiu-schichten">
          <ol class="kiu-schichten__liste">
            ${U.schichten.map((l) => `<li>${l.parts
              ? `<div class="kiu-schichten__teile" style="--n:${l.parts.length}">${l.parts.map((p) => karte(p.n, `${l.title}: ${p.title}`, p.items)).join('')}</div>`
              : karte(l.n, l.title, l.items)}</li>`).join('')}
          </ol>
          <div class="kiu-schichten__leiste"><span>${esc(U.leiste)}</span></div>
        </div>
        <p class="kiu-schichten__satz">${teileHtml(U.text)}</p>
      </div>
    </details>`));
  main.append(a.el);
  modellVerdrahten(figur, M, A.vorschau);
}

/* ---------------- 7 Uebergang Umsetzung, dann weiter zum naechsten Kapitel ---------------- */
{
  const U = I.UMSETZUNG;
  const a = abschnitt({ kicker: U.kicker, titel: U.h2, intro: U.text, klasse: 'kiu-umsetzung', rand: true });
  a.inhalt.append(el(`<div class="kiu-umsetzung__wege" data-reveal="up">${knopf({ ...U.links[0], art: 'accent' })}${knopf({ ...U.links[1], art: 'linie' })}</div>`));
  main.append(a.el);
  main.append(weiterKapitel({ label: 'Nächstes Kapitel', titel: 'Im Projekt', text: METHODE_KOPF.h1, href: '/methode' }));
}

S.fertig();

/* =====================================================================================================
   Download gegen freiwillige Kontaktdaten (wie ArchitekturDownload.tsx). Regeln wie der Server der Live-Seite
   (backend.js → LEAD): Honeypot leer, Angaben freiwillig, E-Mail/Telefon nach Muster, mit Kontaktdaten ist die
   Einwilligung Pflicht. Danach liefert der Worker die Datei (POST D.endpoint).
   ===================================================================================================== */
function downloadKarte(D, { vorschau } = {}) {
  const F = I.DOWNLOAD_FORMULAR;
  const id = (n) => `${D.idp}-${n}`;
  const feld = (f) => `<div class="ks-feld"><label for="${id(f.name)}">${esc(f.label)}</label><input id="${id(f.name)}" name="${f.name}" type="${f.type}" autocomplete="${f.autoComplete}" placeholder="${esc(f.placeholder)}" /><p class="ks-fehler" id="${id(f.name)}-fehler" hidden></p></div>`;
  const [fName, fMail, fTel] = F.felder;
  const root = el(`
    <div class="kiu-download" id="${esc(D.idp)}-download">
      <div class="kiu-download__info">
        <p class="bs-label">${esc(D.kicker)}</p>
        <h3 class="kiu-download__titel">${esc(D.titel)}</h3>
        <p class="kiu-download__text">${esc(D.text)}</p>
        ${vorschau ? `<img class="kiu-download__bild" src="${esc(vorschau.datei)}" alt="${esc(vorschau.alt)}" width="${vorschau.width}" height="${vorschau.height}" loading="lazy" decoding="async" />` : ''}
      </div>
      <div class="kiu-download__formular">
        <form class="ks-formular" novalidate>
          <p class="ks-formular__hinweis">${esc(F.hinweis)}</p>
          ${feld(fName)}
          <div class="ks-formular__reihe">${feld(fMail)}${feld(fTel)}</div>
          <div class="ks-honig" aria-hidden="true"><label for="${id(F.honeypot.name)}">${esc(F.honeypot.label)}</label><input id="${id(F.honeypot.name)}" name="${F.honeypot.name}" tabindex="-1" autocomplete="off" /></div>
          <label class="ks-einwilligung"><input id="${id('consent')}" name="consent" type="checkbox" /><span>${teileHtml(F.einwilligung(D.was))}</span></label>
          <p class="ks-fehler" id="${id('consent')}-fehler" hidden></p>
          <p class="ks-fehler" role="alert" hidden></p>
          <button class="bs-knopf bs-knopf--accent" type="submit"><span>${esc(D.knopf)}</span><i aria-hidden="true">↓</i></button>
        </form>
        <div class="ks-danke" hidden tabindex="-1">
          <p class="ks-danke__titel">${esc(F.danke.titel)}</p>
          <p>${esc(F.danke.text)}</p>
          <button class="ks-textknopf" type="button">${esc(F.danke.knopf)}</button>
        </div>
      </div>
    </div>`);
  const form = qs('form', root);
  const fehler = qs('.ks-fehler[role="alert"]', root);
  const danke = qs('.ks-danke', root);
  const senden = qs('button[type="submit"]', form);
  // Fehler am Feld (Interface-Review MEDIUM): Meldung direkt unter dem Feld, Feld mit aria-invalid und aria-describedby
  const zeigeFehler = (t, feldName) => {
    const f = feldName && form.elements[feldName];
    const p = f && document.getElementById(`${f.id}-fehler`);
    if (!p) { fehler.textContent = t; fehler.hidden = false; return; }
    p.textContent = t; p.hidden = false;
    f.setAttribute('aria-invalid', 'true'); f.setAttribute('aria-describedby', p.id);
    f.focus();
  };
  const fehlerWeg = () => {
    qsa('.ks-fehler', form).forEach((p) => { p.hidden = true; });
    qsa('[aria-invalid]', form).forEach((f) => { f.removeAttribute('aria-invalid'); f.removeAttribute('aria-describedby'); });
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    fehlerWeg();
    const fd = new FormData(form);
    const daten = {
      name: String(fd.get('name') || '').trim(), email: String(fd.get('email') || '').trim(), phone: String(fd.get('phone') || '').trim(),
      consent: fd.get('consent') === 'on', website: String(fd.get('website') || ''),
    };
    const L = LEAD.fehler;
    if (daten.website) return zeigeFehler(L.ungueltig.error);
    if (daten.name.length > 120) return zeigeFehler(L.nameZuLang.error, 'name');
    if (daten.email && (!LEAD.email.test(daten.email) || daten.email.length > 200)) return zeigeFehler(L.email.error, 'email');
    if (daten.phone && (!LEAD.phone.test(daten.phone) || (daten.phone.match(/\d/g) || []).length < 6)) return zeigeFehler(L.telefon.error, 'phone');
    const kontakt = Boolean(daten.name || daten.email || daten.phone);
    if (kontakt && !daten.consent) return zeigeFehler(L.einwilligung.error, 'consent');
    const knopfText = qs('span', senden).textContent;
    senden.disabled = true;
    qs('span', senden).textContent = F.ladeText;
    try {
      // Wie live: POST D.endpoint mit JSON { name, email, phone, consent, website } (F.anfrage). Der Worker meldet
      // Angaben per Mail an Frank und antwortet mit der Datei selbst (sie liegt nicht oeffentlich, A8).
      const res = await fetch(D.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(daten) });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        return zeigeFehler(j.error ?? F.fehlerStandard);
      }
      const blob = await res.blob();
      const adresse = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = adresse;
      link.download = D.dateiname;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(adresse), 60_000);
      window.__downloads = [...(window.__downloads || []), D.dateiname];   // fuer qa
      form.hidden = true;
      danke.hidden = false;
      danke.focus();
    } catch {
      zeigeFehler(F.fehlerVerbindung);
    } finally {
      senden.disabled = false;
      qs('span', senden).textContent = knopfText;
    }
  });
  qs('.ks-textknopf', danke).addEventListener('click', () => { danke.hidden = true; form.hidden = false; qs('input', form).focus(); });
  return root;
}

/* =====================================================================================================
   3D-Modell: Renderer, Szene und Stil aus public/inhalt/architektur/ (von der Live-Seite; model3d.js mit zwei markierten
   Ergaenzungen: Pause ausser Sicht, Pfeiltasten auf Reglern).
   Ablauf wie Architektur3D.tsx: szene.json laden, als window.SCENE ablegen, model3d.js einbinden. Erst kurz vor
   Sichtbarkeit (Stylesheet zuerst, der Renderer misst die Buehne beim Start). Ergaenzt: Vollbild, NN-Signatur,
   Wischen auf dem Handy (waagerecht dreht, senkrecht scrollt), Einflug beim Hereinscrollen.
   ===================================================================================================== */
function modellVerdrahten(figur, M, ersatz) {
  const rahmen = qs('.kiu-modell__rahmen', figur);
  const voll = qs('.kiu-modell__voll', figur);
  const buehne = qs('.m3d', figur);
  let geladen = false;
  let beruehrt = false;   // sobald jemand selbst dreht, steuert der Einflug nicht mehr
  async function laden() {
    if (geladen) return;
    geladen = true;
    try {
      const css = new Promise((ok) => {
        const l = document.createElement('link');
        l.rel = 'stylesheet'; l.href = M.stylesheet;
        l.onload = ok; l.onerror = ok;
        document.head.appendChild(l);
      });
      const [szene] = await Promise.all([fetch(M.szene).then((r) => {
        if (!r.ok) throw new Error(`szene.json ${r.status}`);   // NN-WR-06: 404 liefert sonst HTML, json() scheitert unklar
        return r.json();
      }), css]);
      // Canvas-Beschriftungen in Inter: @fontsource registriert die Familie als „Inter Variable“, nicht „Inter“ (NN-IN-06)
      if (szene.theme?.sans && !szene.theme.sans.includes('Inter Variable')) szene.theme.sans = `'Inter Variable',${szene.theme.sans}`;
      window.SCENE = szene;
      await new Promise((ok, fehler) => {
        const s = document.createElement('script');
        s.src = M.renderer; s.onload = ok; s.onerror = () => fehler(new Error('model3d.js nicht geladen'));
        document.body.appendChild(s);
      });
      io.disconnect();
      // Handy: waagerechtes Wischen dreht, senkrechtes scrollt die Seite (Renderer setzt touch-action: none)
      qs('#model', figur).style.touchAction = 'pan-y';
      qs('.kiu-modell__ersatz', rahmen)?.remove();
      rahmen.classList.remove('is-fehler');
      rahmen.classList.add('is-geladen');
      window.__modell = true;   // fuer qa
    } catch (e) {
      console.warn('[ki-im-unternehmen] 3D-Modell nicht geladen:', e?.message || e);
      // NN-WR-06: Vorschaubild statt endlosem „Lädt“; beim naechsten Eintritt neuer Versuch
      geladen = false;
      if (ersatz && !qs('.kiu-modell__ersatz', rahmen)) {
        rahmen.insertAdjacentHTML('beforeend', `<img class="kiu-modell__ersatz" src="${esc(ersatz.datei)}" alt="${esc(ersatz.alt)}" width="${ersatz.width}" height="${ersatz.height}" decoding="async" />`);
      }
      rahmen.classList.add('is-fehler');
    }
  }
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) laden(); }, { rootMargin: '150% 0px' });
  io.observe(figur);
  ['pointerdown', 'wheel', 'keydown'].forEach((t) => buehne.addEventListener(t, () => { beruehrt = true; }, { passive: true }));
  qsa('input[type="range"]', buehne).forEach((r) => r.addEventListener('pointerdown', () => { beruehrt = true; }));

  // Vollbild wie live: der Rahmen geht ins Vollbild, der Renderer misst beim Resize neu
  voll.addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else rahmen.requestFullscreen?.().catch(() => {});
  });
  document.addEventListener('fullscreenchange', () => { voll.textContent = document.fullscreenElement === rahmen ? M.vollbild.aus : M.vollbild.an; });
  if (!rahmen.requestFullscreen) voll.hidden = true;

  // Einflug (grosse Szene): beim Hereinscrollen zieht der Rahmen per Clip auf, das Modell dreht sich ueber den
  // Y-Regler in seine Ausgangslage (−70° → 0°). Kein Pin: das Mausrad dreht ueber dem Modell, ein Pin wuerde fangen.
  if (reduced) return;
  const regler = qs('#rot-y', figur);
  const setzeY = (grad) => {
    if (beruehrt || !regler || !window.__modell) return;
    regler.value = String(Math.round(grad));
    regler.dispatchEvent(new Event('input'));
  };
  gsap.fromTo(rahmen, { clipPath: 'inset(14% 22% 14% 22% round 22px)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 6px)', ease: 'none',
    scrollTrigger: {
      trigger: figur, start: 'top 92%', end: 'top 18%', scrub: 0.6,
      onUpdate: (st) => setzeY(-70 * (1 - st.progress)),
    },
  });
}
