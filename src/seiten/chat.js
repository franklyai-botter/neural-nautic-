// KI-Chat unten rechts (Pruefpunkt A7), Nachbau von neural-nautic-live app/components/ChatWidget.tsx.
// Texte und Regeln: src/inhalt/chat.js (CHAT). Server: POST /api/chat mit { messages }, Antwort { message, model }
// oder { error } (Texte in backend.js -> CHAT_API.fehler, kommen vom Worker). backend.js wird hier bewusst NICHT
// importiert: es ist die Vorlage fuer den Worker und enthaelt die Systemanweisung.
//
// Aufbau: Hinweisblase („Fragen zu KI? Ich helfe.“), Knopf (Sprechblase aus Milchglas mit dem NN-Stern),
// Fenster (Kopf, DSGVO-Hinweis, Verlauf, Eingabe, Haftungszeile). Mobil (< 640 px) als Blatt ueber dem Knopf,
// an den sichtbaren Bereich (visualViewport) angepasst wie live.
//
// Sicherheit: Modellantworten gehen NIE als HTML in die Seite. markdownKnoten() baut DOM-Knoten mit
// textContent (Absaetze, Listen, fett, kursiv, Code, Links nur http(s) und Pfade ab „/“).
// Genutzt von der Startseite (src/funnel/main.js) und allen Kapitelseiten (gemeinsam.js).
import { hilfen } from '@kern/bausteine/index.js';
import { CHAT } from '../inhalt/chat.js';
import './chat.css';

const { el, esc, qs } = hilfen;

// NN-Stern aus public/brand (= Brand-Assets/neuralnautic/abgeleitet/nn-stern-kompass-128.png), unveraendert.
const STERN = '/brand/nn-stern-kompass-128.png';
const MOBIL_UNTER = CHAT.regeln.mobilBreiteUnter;           // 640: Knopfgroesse, Blatt, Hinweisblase nach Scrollen
const SEITE_LINKS_BIS = 991;                                // bis hier sitzt rechts unten „KI-Check buchen“ (Kern, .bs-daumen)
const B = CHAT.barrierefrei;

const istMobil = () => window.innerWidth < MOBIL_UNTER;
const stillMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------------- Sicherer Markdown-Renderer (nur DOM, kein innerHTML) ---------------- */

/** Adresse pruefen: nur http(s) und Pfade auf dieser Seite („/kontakt“, nicht „//…“ oder „/\…“). */
export function sichereAdresse(roh) {
  const h = String(roh || '').trim();
  if (!h || /[\u0000- \u007f\\<>"'`]/.test(h)) return null;
  if (/^\/(?![/\\])/.test(h)) return { href: h, extern: false };
  if (!/^https?:\/\//i.test(h)) return null;
  try {
    const u = new URL(h);
    return (u.protocol === 'https:' || u.protocol === 'http:') && u.hostname ? { href: u.href, extern: true } : null;
  } catch { return null; }
}

function link(ziel, kinder) {
  const a = document.createElement('a');
  a.href = ziel.href;
  if (ziel.extern) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  a.append(...kinder);
  if (ziel.extern) {
    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = ` ${B.neuerTab}`;
    a.append(sr);
  }
  return a;
}

// fett (**x** / __x__), Code (`x`), Link ([x](url)), nackte http(s)-Adresse, kursiv (*x*)
const INLINE = /(\*\*|__)(?=\S)([^\n]*?\S)\1|`([^`\n]+)`|\[([^\]\n]+)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"\n]*")?\s*\)|(https?:\/\/[^\s<>()]*[^\s<>().,;:!?"'*_])|\*(?=\S)([^*\n]*?\S)\*/g;

/** Zeile mit Hervorhebungen und Links in Knoten zerlegen. Alles andere bleibt Text. */
function inline(text, tiefe = 0, ohneLinks = false) {
  const out = [];
  if (tiefe > 4) { out.push(document.createTextNode(text)); return out; }
  const re = new RegExp(INLINE.source, 'g');
  let pos = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > pos) out.push(document.createTextNode(text.slice(pos, m.index)));
    const [ganz, , fett, code, ltext, lziel, nackt, kursiv] = m;
    if (fett !== undefined) {
      const s = document.createElement('strong');
      s.append(...inline(fett, tiefe + 1, ohneLinks));
      out.push(s);
    } else if (code !== undefined) {
      const c = document.createElement('code');
      c.textContent = code;
      out.push(c);
    } else if (ltext !== undefined) {
      const ziel = !ohneLinks && sichereAdresse(lziel);
      const kinder = inline(ltext, tiefe + 1, true);
      out.push(...(ziel ? [link(ziel, kinder)] : kinder));
    } else if (nackt !== undefined) {
      const ziel = !ohneLinks && sichereAdresse(nackt);
      out.push(ziel ? link(ziel, [document.createTextNode(nackt)]) : document.createTextNode(nackt));
    } else if (kursiv !== undefined) {
      const e = document.createElement('em');
      e.append(...inline(kursiv, tiefe + 1, ohneLinks));
      out.push(e);
    } else {
      out.push(document.createTextNode(ganz));
    }
    pos = m.index + ganz.length;
  }
  if (pos < text.length) out.push(document.createTextNode(text.slice(pos)));
  return out;
}

/**
 * Antworttext (Markdown, wie ihn Mistral liefert) als DocumentFragment.
 * Bloecke: Absatz (Leerzeile trennt, einfacher Umbruch = <br>), Liste (- * • oder 1. 1)), Zwischentitel (#…),
 * Codeblock (```), Zitat (> wird als Absatz gezeigt), Trennlinie (wird weggelassen).
 */
export function markdownKnoten(text) {
  const frag = document.createDocumentFragment();
  const zeilen = String(text ?? '').replace(/\r\n?/g, '\n').split('\n');
  let absatz = [];
  let liste = null;     // { typ: 'ul' | 'ol', el, letzter }
  let code = null;      // Zeilen eines Codeblocks

  const absatzZu = () => {
    if (!absatz.length) return;
    const p = document.createElement('p');
    absatz.forEach((z, i) => { if (i) p.append(document.createElement('br')); p.append(...inline(z)); });
    frag.append(p);
    absatz = [];
  };
  const listeZu = () => { liste = null; };

  for (const roh of zeilen) {
    if (code) {
      if (/^\s*```/.test(roh)) {
        const pre = document.createElement('pre');
        const c = document.createElement('code');
        c.textContent = code.join('\n');
        pre.append(c);
        frag.append(pre);
        code = null;
      } else code.push(roh);
      continue;
    }
    if (/^\s*```/.test(roh)) { absatzZu(); listeZu(); code = []; continue; }
    if (!roh.trim()) { absatzZu(); listeZu(); continue; }
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(roh)) { absatzZu(); listeZu(); continue; }

    const titel = /^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/.exec(roh);
    if (titel) {
      absatzZu(); listeZu();
      const p = document.createElement('p');
      p.className = 'nn-chat__zwischentitel';
      const s = document.createElement('strong');
      s.append(...inline(titel[1]));
      p.append(s);
      frag.append(p);
      continue;
    }

    const ul = /^\s*[-*•+]\s+(.*)$/.exec(roh);
    const ol = ul ? null : /^\s*(\d{1,4})[.)]\s+(.*)$/.exec(roh);
    if (ul || ol) {
      absatzZu();
      const typ = ul ? 'ul' : 'ol';
      if (!liste || liste.typ !== typ) {
        const l = document.createElement(typ);
        if (ol && ol[1] !== '1') l.start = Number(ol[1]);
        frag.append(l);
        liste = { typ, el: l, letzter: null };
      }
      const li = document.createElement('li');
      li.append(...inline(ul ? ul[1] : ol[2]));
      liste.el.append(li);
      liste.letzter = li;
      continue;
    }

    // eingerueckte Folgezeile gehoert zum letzten Listenpunkt
    if (liste && liste.letzter && /^\s{2,}\S/.test(roh)) {
      liste.letzter.append(document.createElement('br'), ...inline(roh.trim()));
      continue;
    }
    listeZu();
    absatz.push(roh.replace(/^\s*>\s?/, '').trim());
  }
  if (code) {
    // nicht geschlossener Codeblock: als Text zeigen
    const pre = document.createElement('pre');
    const c = document.createElement('code');
    c.textContent = code.join('\n');
    pre.append(c);
    frag.append(pre);
  }
  absatzZu();
  return frag;
}

/* ---------------- Widget ---------------- */

function hinweisKnoten() {
  const p = document.createElement('p');
  p.className = 'nn-chat__hinweis-text';
  for (const t of CHAT.hinweis.teile) {
    if (typeof t === 'string') p.append(document.createTextNode(t));
    else {
      const a = document.createElement('a');
      a.href = t.href;
      a.textContent = t.text;
      p.append(a);
    }
  }
  return p;
}

export function chatWidget() {
  const vorhanden = qs('.nn-chat');
  if (vorhanden) return vorhanden;

  const root = el(`
    <div class="nn-chat">
      <div class="nn-chat__tipp" hidden>
        <p>${esc(CHAT.tipp.text)}</p>
        <button class="nn-chat__tipp-zu" type="button" aria-label="${esc(CHAT.tipp.schliessenAria)}"><span aria-hidden="true">${esc(CHAT.tipp.schliessenZeichen)}</span></button>
      </div>
      <button class="nn-chat__knopf" type="button" aria-expanded="false" aria-controls="nn-chat-fenster" aria-label="${esc(CHAT.knopf.ariaOeffnen)}">
        <span class="nn-chat__form" aria-hidden="true">
          <svg class="nn-chat__glas" viewBox="0 0 64 76" preserveAspectRatio="none" focusable="false">
            <defs>
              <linearGradient id="nn-chat-glas" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#ffffff" stop-opacity=".96" />
                <stop offset=".55" stop-color="#ffffff" stop-opacity=".8" />
                <stop offset="1" stop-color="#e6f2f2" stop-opacity=".9" />
              </linearGradient>
            </defs>
            <path d="M14 0H50Q64 0 64 14V50Q64 64 50 64H40L32 76L24 64H14Q0 64 0 50V14Q0 0 14 0Z" fill="url(#nn-chat-glas)" stroke="rgba(13,115,119,.4)" stroke-width="1.2" vector-effect="non-scaling-stroke" />
            <path d="M16 3H48Q60 3 61 13" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" vector-effect="non-scaling-stroke" />
          </svg>
          <img class="nn-chat__stern" src="${STERN}" alt="" width="58" height="58" decoding="async" />
        </span>
        <svg class="nn-chat__x" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
          <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
      <section class="nn-chat__fenster" id="nn-chat-fenster" role="dialog" aria-modal="false" aria-labelledby="nn-chat-titel" data-lenis-prevent hidden>
        <div class="nn-chat__griff" aria-hidden="true"></div>
        <header class="nn-chat__kopf">
          <img src="${STERN}" alt="" width="40" height="40" decoding="async" />
          <p class="nn-chat__titel" id="nn-chat-titel">${esc(CHAT.kopf.titel)}</p>
          <p class="nn-chat__etikett">${esc(CHAT.kopf.etikett)}</p>
        </header>
        <div class="nn-chat__hinweis"></div>
        <div class="nn-chat__verlauf" role="region" aria-label="${esc(B.verlauf)}" tabindex="0" data-lenis-prevent>
          <p class="nn-chat__begruessung">${esc(CHAT.begruessung)}</p>
          <div class="nn-chat__laden" hidden aria-hidden="true"><span></span><span></span><span></span></div>
        </div>
        <form class="nn-chat__eingabe" novalidate>
          <label class="sr-only" for="nn-chat-frage">${esc(B.eingabe)}</label>
          <input id="nn-chat-frage" type="text" name="frage" autocomplete="off" enterkeyhint="send"
            maxlength="${CHAT.eingabe.maxLength}" placeholder="${esc(CHAT.eingabe.placeholder)}" />
          <button class="nn-chat__senden" type="submit" aria-label="${esc(B.senden)}" disabled>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false">
              <path d="M16 9H2M16 9l-6-6M16 9l-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </form>
        <p class="nn-chat__haftung">${esc(CHAT.haftung)}</p>
        <div class="sr-only nn-chat__ansage" aria-live="polite" aria-atomic="true"></div>
      </section>
    </div>`);

  const tipp = qs('.nn-chat__tipp', root);
  const tippZu = qs('.nn-chat__tipp-zu', root);
  const knopf = qs('.nn-chat__knopf', root);
  const fenster = qs('.nn-chat__fenster', root);
  const hinweisPlatz = qs('.nn-chat__hinweis', root);
  const verlauf = qs('.nn-chat__verlauf', root);
  const begruessung = qs('.nn-chat__begruessung', root);
  const laden = qs('.nn-chat__laden', root);
  const form = qs('.nn-chat__eingabe', root);
  const eingabe = qs('input', form);
  const senden = qs('.nn-chat__senden', form);
  const ansage = qs('.nn-chat__ansage', root);

  // DSGVO-Hinweis mit „OK“ (wegklickbar, gilt fuer diesen Seitenaufruf wie live)
  const hinweisText = hinweisKnoten();
  const ok = document.createElement('button');
  ok.type = 'button';
  ok.className = 'nn-chat__ok';
  ok.textContent = CHAT.hinweis.knopf;
  hinweisText.append(' ', ok);
  hinweisPlatz.append(hinweisText);
  ok.addEventListener('click', () => {
    hinweisPlatz.remove();
    eingabe.focus({ preventScroll: true });
    lage();
  });

  /** Gespraech fuer den Server: nur erfolgreiche Fragen und Antworten. */
  const gespraech = [];
  let offen = false;
  let laedt = false;

  /* ---------- Hinweisblase ---------- */
  let tippGesehen = false;
  try { tippGesehen = sessionStorage.getItem(CHAT.tipp.regeln.sessionStorageKey) === '1'; } catch { /* privat: Blase zeigen */ }
  let tippUhr = 0;
  let tippAus = 0;
  const merkeTipp = () => {
    tippGesehen = true;
    try { sessionStorage.setItem(CHAT.tipp.regeln.sessionStorageKey, '1'); } catch { /* egal */ }
  };
  function tippWeg() {
    clearTimeout(tippUhr);
    clearTimeout(tippAus);
    window.removeEventListener('scroll', beimScrollen);
    const fokusDrin = tipp.contains(document.activeElement);
    if (!tipp.hidden) merkeTipp();
    tipp.hidden = true;
    if (fokusDrin) knopf.focus({ preventScroll: true });
  }
  function tippZeigen() {
    if (offen || tippGesehen) return;
    tipp.hidden = false;
    // Neubau: Mobil verschwindet die Blase nach 10 s von selbst (C1: nichts dauerhaft verdecken). Live bleibt sie.
    if (istMobil()) tippAus = setTimeout(tippWeg, 10000);
  }
  function beimScrollen() {
    if (window.scrollY > CHAT.tipp.regeln.mobilNachScrollPx) {
      window.removeEventListener('scroll', beimScrollen);
      tippZeigen();
    }
  }
  if (!tippGesehen) {
    if (istMobil()) window.addEventListener('scroll', beimScrollen, { passive: true });
    else tippUhr = setTimeout(tippZeigen, CHAT.tipp.regeln.desktopNachMs);
  }
  tippZu.addEventListener('click', (e) => { e.stopPropagation(); tippWeg(); });

  /* ---------- Lage: mobil als Blatt ueber dem Knopf, am sichtbaren Bereich ausgerichtet ---------- */
  let sicherUnten = 0;
  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;bottom:0;height:env(safe-area-inset-bottom,0px);pointer-events:none;visibility:hidden';
  document.body.append(probe);
  sicherUnten = probe.offsetHeight;
  probe.remove();

  function kopfUnten() {
    // Der Seitenkopf (Logo, Menue-Knopf) liegt ueber allem (z-index 800): das Blatt bleibt darunter.
    const m = qs('.bs-kopf__menue');
    const r = m && m.getBoundingClientRect();
    return r && r.bottom > 0 ? r.bottom : 0;
  }

  function lage() {
    if (!offen || !istMobil()) {
      fenster.style.top = '';
      fenster.style.height = '';
      return;
    }
    const vv = window.visualViewport;
    const vvH = vv ? vv.height : window.innerHeight;
    const vvTop = vv ? vv.offsetTop : 0;
    if (!vvH) return;
    const g = CHAT.knopf.groesse.mobil;
    const knopfOben = g.hoehe + 12 + sicherUnten;                   // Knopf: 12 px ueber dem Rand (wie „KI-Check buchen“)
    const oben = Math.max(8, kopfUnten() + 8);
    const platz = Math.max(0, vvH - knopfOben - 8 - oben);
    const hoehe = Math.min(CHAT.regeln.mobilMaxHoehe, Math.max(100, platz));
    const top = Math.max(vvTop + oben, vvTop + vvH - knopfOben - 8 - hoehe);
    fenster.style.top = `${Math.round(top)}px`;
    fenster.style.height = `${Math.round(hoehe)}px`;
  }
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', lage);
    window.visualViewport.addEventListener('scroll', lage);
  }
  window.addEventListener('resize', lage);

  /* ---------- Oeffnen / Schliessen ---------- */
  function setzen(auf, { fokus = true } = {}) {
    if (auf === offen) return;
    offen = auf;
    if (auf) tippWeg();
    if (auf && !tippGesehen) merkeTipp();      // Neubau: wer den Chat geoeffnet hat, braucht die Blase nicht mehr
    root.classList.toggle('ist-offen', auf);
    knopf.setAttribute('aria-expanded', String(auf));
    knopf.setAttribute('aria-label', auf ? CHAT.knopf.ariaSchliessen : CHAT.knopf.ariaOeffnen);
    fenster.hidden = !auf;
    lage();
    if (auf) {
      if (fokus) eingabe.focus({ preventScroll: true });
      verlauf.scrollTop = verlauf.scrollHeight;
    } else if (fokus) knopf.focus({ preventScroll: true });
  }
  knopf.addEventListener('click', () => setzen(!offen));

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || e.defaultPrevented) return;
    if (document.body.classList.contains('bs-menue-offen')) return;   // Menue liegt darueber und schliesst selbst
    if (offen) {
      const drin = root.contains(document.activeElement) || document.activeElement === document.body;
      setzen(false, { fokus: drin });
    } else if (!tipp.hidden && tipp.contains(document.activeElement)) tippWeg();
  });

  /* ---------- Verlauf ---------- */
  function sanftScrollen(top) {
    verlauf.scrollTo({ top, behavior: stillMQ.matches ? 'auto' : 'smooth' });
  }

  function blase(art, text) {
    const zeile = document.createElement('div');
    zeile.className = `nn-chat__zeile nn-chat__zeile--${art}`;
    const b = document.createElement('div');
    b.className = 'nn-chat__blase';
    const wer = document.createElement('span');
    wer.className = 'sr-only';
    wer.textContent = `${art === 'ich' ? B.ich : B.assistent} `;
    const inhalt = document.createElement('div');
    inhalt.className = 'nn-chat__text';
    if (art === 'ki') inhalt.append(markdownKnoten(text));
    else {
      const p = document.createElement('p');
      p.textContent = text;        // Nutzertext und Fehlertexte: nur Text
      inhalt.append(p);
    }
    b.append(wer, inhalt);
    zeile.append(b);
    verlauf.insertBefore(zeile, laden);
    begruessung.hidden = true;
    return { zeile, inhalt };
  }

  function sagen(text) {
    ansage.textContent = '';
    requestAnimationFrame(() => { ansage.textContent = text; });
  }

  function knopfZustand() {
    senden.disabled = laedt || !eingabe.value.trim();
  }
  eingabe.addEventListener('input', knopfZustand);
  // Enter sendet (Formular), Umschalt+Enter nicht (CHAT.regeln)
  eingabe.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.shiftKey) e.preventDefault(); });

  function ladenSetzen(an) {
    laedt = an;
    laden.hidden = !an;
    verlauf.setAttribute('aria-busy', String(an));
    knopfZustand();
  }

  /** Anfrage an den Server: die letzten 20 erfolgreichen Nachrichten, je hoechstens 2000 Zeichen, beginnend mit „user“. */
  function anfrageNachrichten() {
    const n = gespraech.slice(-CHAT.regeln.maxVerlauf).map((m) => ({ role: m.role, content: m.content.slice(0, CHAT.eingabe.maxLength) }));
    while (n.length && n[0].role !== 'user') n.shift();
    return n;
  }

  async function fragen(text) {
    const frage = text.trim().slice(0, CHAT.eingabe.maxLength);
    if (!frage || laedt) return;
    gespraech.push({ role: 'user', content: frage });
    blase('ich', frage);
    eingabe.value = '';
    ladenSetzen(true);
    sagen(B.laedt);
    sanftScrollen(verlauf.scrollHeight);

    let antwort;
    let fehler = false;
    const abbruch = new AbortController();
    const uhr = setTimeout(() => abbruch.abort(), CHAT.regeln.zeitlimitMs);
    try {
      const res = await fetch(CHAT.endpoint, {
        method: CHAT.anfrage.methode,
        headers: { 'Content-Type': CHAT.anfrage.contentType },
        body: JSON.stringify({ messages: anfrageNachrichten() }),
        signal: abbruch.signal,
      });
      const data = await res.json();
      const nachricht = typeof data?.message === 'string' ? data.message.trim() : '';
      if (res.ok && nachricht) antwort = nachricht;
      else {
        // wie live: data.message || data.error || fehler.antwortFehlt (Texte vom Worker, z. B. 503/502)
        fehler = true;
        antwort = nachricht || (typeof data?.error === 'string' && data.error.trim()) || CHAT.fehler.antwortFehlt;
      }
    } catch {
      fehler = true;
      antwort = CHAT.fehler.verbindung;
    } finally {
      clearTimeout(uhr);
    }

    ladenSetzen(false);
    if (fehler) gespraech.pop();     // Neubau: die gescheiterte Frage und der Fehlertext gehen nicht an den Server
    else gespraech.push({ role: 'assistant', content: antwort });
    const { zeile, inhalt } = blase(fehler ? 'fehler' : 'ki', antwort);
    // innerText trennt Absaetze und Listenpunkte, textContent wuerde sie zusammenkleben
    sagen(`${B.assistent} ${(inhalt.innerText || inhalt.textContent).trim()}`);
    // Lange Antwort: an ihren Anfang scrollen, kurze: ans Ende
    sanftScrollen(Math.min(zeile.offsetTop - 12, verlauf.scrollHeight));
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = eingabe.value;
    eingabe.focus({ preventScroll: true });
    fragen(text);
  });

  document.body.classList.add('nn-chat-da');   // Fusskarte haelt unten Platz frei (chat.css)
  return root;
}
