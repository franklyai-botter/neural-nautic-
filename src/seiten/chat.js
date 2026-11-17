// KI-Chat unten rechts (Pruefpunkt A7), Nachbau von neural-nautic-live app/components/ChatWidget.tsx.
// Texte und Regeln: src/inhalt/chat.js (CHAT). Server: POST /api/chat mit { messages }, Antwort { message, model }
// oder { error } (Texte in backend.js -> CHAT_API.fehler, kommen vom Worker). backend.js wird hier bewusst NICHT
// importiert: es ist die Vorlage fuer den Worker und enthaelt die Systemanweisung.
//
// Aufbau: Hinweisblase („Fragen zu KI? Ich helfe.“), Knopf (Sprechblase aus Milchglas mit dem NN-Stern),
// Fenster (Kopf, DSGVO-Hinweis, Verlauf, Eingabe, Haftungszeile). Mobil (< 640 px) seit 17.11.2026 als Vollbild-Blatt
// (Frank: „es deckt sich ständig irgendwas ab, vor allem der Eingabebereich“): deckt den ganzen sichtbaren Bereich
// (visualViewport, also immer ueber der Tastatur), Eingabe unten, nur der Verlauf scrollt, die Seite dahinter ist
// gesperrt (overflow, Lenis, inert), Knopf und „KI-Potenzialcheck buchen“ sind solange weg, Schliessen oben rechts,
// Escape und die Zurueck-Taste schliessen. Vorher: halbdurchsichtiges Blatt ueber dem Knopf, Seitenkopf, Buchungsleiste
// und Knopf lagen darueber bzw. daneben. Desktop und Tablet unveraendert.
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
      <section class="nn-chat__fenster" id="nn-chat-fenster" role="dialog" aria-modal="false" aria-labelledby="nn-chat-titel" tabindex="-1" data-lenis-prevent hidden>
        <header class="nn-chat__kopf">
          <img src="${STERN}" alt="" width="40" height="40" decoding="async" />
          <p class="nn-chat__titel" id="nn-chat-titel">${esc(CHAT.kopf.titel)}</p>
          <p class="nn-chat__etikett">${esc(CHAT.kopf.etikett)}</p>
          <button class="nn-chat__zu" type="button" aria-label="${esc(CHAT.knopf.ariaSchliessen)}">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
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

  /* ---------- Lage: mobil Vollbild-Blatt ueber dem sichtbaren Bereich (Tastatur bleibt darunter) ---------- */
  let blatt = false;          // Vollbild-Blatt aktiv (offen und schmal)
  let verlaufEintrag = false; // eigener Eintrag im Browserverlauf, damit „Zurueck“ den Chat schliesst
  let gesperrt = [];          // Geschwister des Chats, die waehrend des Blatts inert sind

  /** Seite hinter dem Blatt sperren bzw. freigeben: kein Scrollen, kein Fokus, nicht vorgelesen. */
  function blattSetzen(an) {
    if (an === blatt) return;
    blatt = an;
    document.documentElement.classList.toggle('nn-chat-blatt', an);
    fenster.setAttribute('aria-modal', String(an));
    // DSGVO-Hinweis im Blatt als erster Eintrag des Verlaufs: steht beim Oeffnen oben, scrollt aber mit, statt bei
    // offener Tastatur auf kleinen Handys fast den ganzen Platz ueber der Eingabe zu belegen
    if (hinweisPlatz.isConnected) { if (an) verlauf.prepend(hinweisPlatz); else verlauf.before(hinweisPlatz); }
    if (an) {
      window.lenis?.stop();
      gesperrt = [...document.body.children].filter((n) => n !== root && !n.inert && n.tagName !== 'SCRIPT');
      gesperrt.forEach((n) => { n.inert = true; });
    } else {
      window.lenis?.start();
      gesperrt.forEach((n) => { n.inert = false; });
      gesperrt = [];
      fenster.style.top = '';
      fenster.style.height = '';
      fenster.classList.remove('ist-tastatur');
    }
  }

  function lage() {
    blattSetzen(offen && istMobil());
    if (!blatt) return;
    const vv = window.visualViewport;
    const vvH = vv ? vv.height : window.innerHeight;
    if (!vvH) return;
    // iOS verkleinert bei offener Tastatur nur den sichtbaren Bereich und verschiebt ihn (offsetTop): das Blatt folgt ihm
    fenster.style.top = `${Math.round(vv ? vv.offsetTop : 0)}px`;
    fenster.style.height = `${Math.round(vvH)}px`;
    fenster.classList.toggle('ist-tastatur', vvH < window.innerHeight * 0.8);   // Tastatur offen: unten ohne Safe-Area-Rand
  }
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', lage);
    window.visualViewport.addEventListener('scroll', lage);
  }
  window.addEventListener('resize', lage);

  /* ---------- Oeffnen / Schliessen ---------- */
  function setzen(auf, { fokus = true, ausVerlauf = false } = {}) {
    if (auf === offen) return;
    offen = auf;
    if (auf) tippWeg();
    if (auf && !tippGesehen) merkeTipp();      // Neubau: wer den Chat geoeffnet hat, braucht die Blase nicht mehr
    root.classList.toggle('ist-offen', auf);
    knopf.setAttribute('aria-expanded', String(auf));
    knopf.setAttribute('aria-label', auf ? CHAT.knopf.ariaSchliessen : CHAT.knopf.ariaOeffnen);
    fenster.hidden = !auf;
    if (!auf) document.documentElement.classList.remove('nn-unten-weg');   // nach dem Schliessen sind Knopf und Leiste da
    lage();
    // Mobil: „Zurueck“ schliesst den Chat statt die Seite zu verlassen (eigener Verlaufseintrag, gleiche Adresse)
    if (auf && blatt && !verlaufEintrag) {
      try { history.pushState({ ...(history.state || {}), nnChat: true }, ''); verlaufEintrag = true; } catch { /* egal */ }
    } else if (!auf && verlaufEintrag) {
      verlaufEintrag = false;
      if (!ausVerlauf && history.state?.nnChat) history.back();
    }
    if (auf) {
      // Mobil nicht ins Eingabefeld: die Tastatur kaeme sofort und deckte Hinweis und Verlauf. Fokus auf das Blatt.
      if (fokus) (blatt ? fenster : eingabe).focus({ preventScroll: true });
      verlauf.scrollTop = verlauf.scrollHeight;
    } else if (fokus) knopf.focus({ preventScroll: true });
  }
  knopf.addEventListener('click', () => setzen(!offen));
  qs('.nn-chat__zu', root).addEventListener('click', () => setzen(false));
  window.addEventListener('popstate', () => { if (offen && verlaufEintrag) setzen(false, { ausVerlauf: true }); });

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

  /* ---------- Handy und Tablet (bis 991 px): Knopf und „KI-Potenzialcheck buchen“ beim Runterscrollen weg ----------
     Frank 17.11.2026 (Variante B): beim Lesen nach unten blenden sie aus, beim Hochscrollen, beim Halten (0,7 s ohne
     Scrollen) und am Seitenende wieder ein. Bei offenem Chat bleiben sie weg (Blatt). Desktop unveraendert. */
  const untenMQ = window.matchMedia('(max-width: 991.98px)');
  let letztY = window.scrollY;
  let ruheUhr = 0;
  const untenWeg = (weg) => document.documentElement.classList.toggle('nn-unten-weg', weg);
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const d = y - letztY;
    letztY = y;
    if (!untenMQ.matches || offen) return;
    const ende = y + window.innerHeight >= document.documentElement.scrollHeight - 4;
    if (ende || d < -4) untenWeg(false);
    else if (d > 6 && y > 120) { untenWeg(true); if (!tipp.hidden) tippWeg(); }
    clearTimeout(ruheUhr);
    ruheUhr = setTimeout(() => untenWeg(false), 700);
  }, { passive: true });
  untenMQ.addEventListener('change', () => untenWeg(false));

  /* ---------- Alle Breiten: Knopf und Hinweisblase weichen aus, solange sie einen Knopf der Seite verdecken wuerden ----------
     Pruefung (Ismajl-Check, 17.11.2026): am Desktop lagen beide ueber „KI-Potenzialcheck buchen“ der Bildkarte (Startseite).
     Gemessen wird die Ruhelage (fixe Lage aus dem berechneten Stil), nicht die verschobene, sonst flackert es. */
  const ruheLage = (e) => {
    const cs = getComputedStyle(e);
    const w = e.offsetWidth;
    const h = e.offsetHeight;
    const rechts = parseFloat(cs.right);
    const l = cs.right === 'auto' || Number.isNaN(rechts) ? parseFloat(cs.left) : window.innerWidth - rechts - w;
    const b = window.innerHeight - parseFloat(cs.bottom);
    return { l, r: l + w, t: b - h, b };
  };
  let weichtBild = 0;
  function weichtPruefen() {
    weichtBild = 0;
    if (offen) return;
    const lagen = [ruheLage(knopf)];
    if (!tipp.hidden) lagen.push(ruheLage(tipp));
    const deckt = [...document.querySelectorAll('main .bs-knopf')].some((a) => {
      const q = a.getBoundingClientRect();
      return q.width > 0 && lagen.some((r) => q.left < r.r && r.l < q.right && q.top < r.b && r.t < q.bottom);
    });
    root.classList.toggle('weicht', deckt);
  }
  const weicht = () => { if (!weichtBild) weichtBild = requestAnimationFrame(weichtPruefen); };
  window.addEventListener('scroll', weicht, { passive: true });
  window.addEventListener('resize', weicht);
  weicht();

  document.body.classList.add('nn-chat-da');   // Fusskarte haelt unten Platz frei (chat.css)
  return root;
}
