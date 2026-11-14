// /kontakt (Paket C, Vorlage „Footer-Karte mit Formular“): Seitenkopf, Formular in der Leuchtrand-Karte, Danke-Zustand,
// Abschluss mit dem KI-Check. Texte wortlich aus src/inhalt/kontakt.js (Formular, Anliegen, Danke) und start.js (Abschluss).
// Felder, Reihenfolge, Pflicht und Platzhalter wie live (app/kontakt/page.tsx).
import { kapitelseite, seitenkopf, esc, el, qs, reduced, gsap } from './gemeinsam.js';
import { callout } from '@kern/bausteine/index.js';
import { createNetz } from '@kern/netz/netz.js';
import * as K from '../inhalt/kontakt.js';
import { ABSCHLUSS } from '../inhalt/start.js';
import './kontakt.css';

const S = kapitelseite();
S.main.append(seitenkopf(K.KOPF));

/* ---------------- Formular in der Leuchtrand-Karte ---------------- */
const F = K.FORMULAR;
const feld = (name) => F.felder.find((f) => f.name === name);
// autocomplete hilft beim Ausfuellen (kein sichtbarer Text)
const AUTO = { name: 'name', company: 'organization', email: 'email', phone: 'tel', topic: 'off', message: 'off' };
function feldHtml(f) {
  const id = `kontakt-${f.name}`;
  const pflicht = f.pflicht ? ' required aria-required="true"' : '';
  let eingabe;
  if (f.type === 'select') {
    eingabe = `<select id="${id}" name="${f.name}"${pflicht}><option value="">${esc(f.leerOption)}</option>${f.optionen.map((o) => `<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select>`;
  } else if (f.type === 'textarea') {
    eingabe = `<textarea id="${id}" name="${f.name}" rows="${f.zeilen || 6}" placeholder="${esc(f.placeholder)}"${pflicht}></textarea>`;
  } else {
    const typ = f.type === 'email' ? 'email' : (f.name === 'phone' ? 'tel' : 'text');
    eingabe = `<input id="${id}" name="${f.name}" type="${typ}" placeholder="${esc(f.placeholder)}" autocomplete="${AUTO[f.name]}"${pflicht} />`;
  }
  return `<div class="ks-feld"><label for="${id}">${esc(f.label)}</label>${eingabe}</div>`;
}
// Knopftext „Anfrage senden →“: der Pfeil steht als eigenes Zeichen wie bei allen Knoepfen
const knopfText = F.knopf.replace(/\s*→$/, '');

const ab = el(`
  <section class="nn-kontakt bs-ton-dunkel" data-ton="dunkel" aria-label="${esc(K.KOPF.eyebrow)}">
    <div class="nn-kontakt__netz" aria-hidden="true"></div>
    <div class="bs-wrap nn-kontakt__wrap">
      <div class="nn-kontakt__karte" data-karte>
        <span class="nn-kontakt__rand" aria-hidden="true"></span>
        <form class="ks-formular nn-kontakt__formular" novalidate>
          <div class="ks-formular__reihe">${feldHtml(feld('name'))}${feldHtml(feld('company'))}</div>
          <div class="ks-formular__reihe">${feldHtml(feld('email'))}${feldHtml(feld('phone'))}</div>
          ${feldHtml(feld('topic'))}
          ${feldHtml(feld('message'))}
          <div class="nn-kontakt__senden">
            <button class="bs-knopf bs-knopf--accent bs-knopf--gross" type="submit"><span data-roll>${esc(knopfText)}</span><i aria-hidden="true">→</i></button>
          </div>
          <p class="ks-fehler" role="alert" hidden></p>
          <p class="ks-formular__hinweis">${esc(F.datenhinweis)}</p>
        </form>
      </div>
    </div>
  </section>`);
S.main.append(ab);

const form = qs('form', ab);
const knopfEl = qs('button[type="submit"]', form);
const knopfSpan = qs('button[type="submit"] > span', form);
const fehlerEl = qs('.ks-fehler', form);

/* SERVER-TEIL (Welle 2): Versand an POST /api/contact (Resend), Daten als JSON { name, company, email, phone, topic, message },
   Regeln und Mailtext in src/inhalt/backend.js → KONTAKT_API, MAIL. Bis dahin wird nichts gesendet: die Funktion meldet
   sofort Erfolg, die Seite zeigt den Danke-Zustand. Antwortet der Server spaeter mit Fehler, kommt dessen `error` oder
   F.fehlerStandard in .ks-fehler. */
async function senden(daten) {
  void daten;
  return { ok: true };
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  fehlerEl.hidden = true;
  if (!form.checkValidity()) {
    form.reportValidity();
    form.querySelector(':invalid')?.focus();
    return;
  }
  const fd = new FormData(form);
  const daten = Object.fromEntries(F.anfrage.felder.map((n) => [n, fd.get(n)]));
  knopfEl.disabled = true;
  knopfSpan.textContent = F.ladeText;
  let antwort;
  try { antwort = await senden(daten); } catch { antwort = { ok: false }; }
  knopfEl.disabled = false;
  knopfSpan.textContent = knopfText;
  if (antwort.ok) { danke(); return; }
  fehlerEl.textContent = antwort.error || F.fehlerStandard;
  fehlerEl.hidden = false;
});

// Danke-Zustand ersetzt das Formular (wie live)
function danke() {
  const d = el(`
    <div class="ks-danke nn-kontakt__danke" role="status">
      <span class="nn-kontakt__haken" aria-hidden="true">${esc(K.DANKE.zeichen)}</span>
      <h2 class="ks-danke__titel" tabindex="-1">${esc(K.DANKE.h2)}</h2>
      <p>${esc(K.DANKE.text)}</p>
    </div>`);
  form.replaceWith(d);
  qs('h2', d).focus({ preventScroll: true });
  if (!reduced) gsap.from(d.children, { y: 18, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'expo.out' });   // opacity statt autoAlpha: der Fokus muss auf die Ueberschrift duerfen
}
window.__kontakt = { form, danke };   // fuer die Pruefung

// Netz hinter der Karte (Cyan auf Petrol), nur im Bild; Reduced Motion = Standbild
try {
  const netz = createNetz(qs('.nn-kontakt__netz', ab), { farbe: '63,212,224', dichte: 0.7, deckkraft: 0.5 });
  window.addEventListener('pagehide', (e) => { if (!e.persisted) netz?.dispose?.(); });
} catch (err) { console.warn('[kontakt] Netz nicht gestartet:', err?.message || err); }

// Einspielung: die Karte faehrt per Clip auf, die Felder folgen gestaffelt
S.nachStart(() => {
  if (reduced) return;
  const karte = qs('[data-karte]', ab);
  gsap.timeline({ scrollTrigger: { trigger: karte, start: 'top 88%', once: true } })
    .fromTo(karte, { clipPath: 'inset(12% 6% 88% 6% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.1, ease: 'expo.inOut', clearProps: 'clipPath' })
    .from(form.children, { y: 22, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out' }, '-=0.45');
});

/* ---------------- Abschluss: der KI-Check (wie Startseite) ---------------- */
S.main.append(callout({ id: 'abschluss', ton: 'hell', gross: true, logo: ABSCHLUSS.logo, titel: esc(ABSCHLUSS.titel), text: ABSCHLUSS.text, knopf: ABSCHLUSS.cta, klein: ABSCHLUSS.beruhigung }).el);

S.fertig();
