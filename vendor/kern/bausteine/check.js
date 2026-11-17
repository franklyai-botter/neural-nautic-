// Check: Selbsttest mit einer Frage nach der anderen (z. B. Reifegrad-Check), Ergebnis als grosse Stufe mit Text.
// Fragen, Auswertung und alle sichtbaren Texte kommen als Konfiguration; der Baustein rechnet nichts selbst
// und formuliert nichts. Laeuft nur im Browser: keine Speicherung, keine Uebergabe in Adressen oder an Dritte.
//
// Bedienung: Antworten sind echte Radio-Felder (Pfeiltasten waehlen, Tab wechselt zu den Schritt-Knoepfen,
// Enter geht weiter). Ein Klick oder Tipp auf eine Antwort waehlt und geht nach kurzer Pause zur naechsten Frage.
// Ueber die Schrittleiste (1/6 … 6/6) kommt man zu jeder schon beantworteten Frage zurueck.
// Screenreader: Jede Frage ist ein <fieldset> mit <legend>; der Wechsel wird ueber eine Live-Region angesagt,
// das Ergebnis steht in einer Live-Region und bekommt den Fokus.
// Reduced Motion: Wechsel ohne Animation.
import { gsap, reduced } from '../motion.js';
import './grund.css';
import './check.css';
import { el, esc, qs, qsa, knopf } from './hilfen.js';

/**
 * @param {object} c
 * @param {{key:string, titel:string, etikett?:string, antworten:string[]}[]} c.fragen   Antwort i hat den Wert i
 * @param {(werte:Record<string,number>)=>{kopf:string, stufe:string|number, name:string, hinweis?:string, label?:string, text:string}} c.auswerten
 *        Ergebnis aus den Werten: kopf (Zeile darueber), stufe (grosse Ziffer), name, hinweis (optional, z. B. Deckelung),
 *        label + text (Empfehlung). Wird erst aufgerufen, wenn alle Fragen beantwortet sind.
 * @param {object} c.texte
 * @param {(i:number, n:number)=>string} c.texte.zaehler        z. B. „3/6“
 * @param {(offen:number, n:number)=>string} [c.texte.offen]    Zeile unter der Frage
 * @param {string} c.texte.ergebnis                             Name des Ergebnis-Schritts (Schrittleiste, Ansage)
 * @param {string} c.texte.neu                                  Knopf „neu beginnen“
 * @param {string} [c.stufeWort]                                Wort vor der grossen Ziffer, z. B. „Stufe“
 * @param {{text:string, href:string, extern?:boolean, art?:string, klein?:string}[]} [c.ctas]  Knoepfe im Ergebnis
 * @param {string} [c.fussnote]
 * @param {string} [c.ariaLabel]
 * @param {string} [c.id]
 * @param {(ergebnis:object|null)=>void} [c.onErgebnis]
 */
export function check(c) {
  const n = c.fragen.length;
  const T = c.texte;
  const uid = `bs-check-${Math.random().toString(36).slice(2, 7)}`;
  const frage = (f, i) => `
    <fieldset class="bs-check__frage" data-i="${i}" hidden>
      <legend class="bs-check__legende">
        <span class="bs-check__zaehler">${esc(T.zaehler(i, n))}</span>
        <span class="bs-check__titel">${esc(f.titel)}</span>
        ${f.etikett ? `<span class="bs-check__etikett">${esc(f.etikett)}</span>` : ''}
      </legend>
      <div class="bs-check__antworten">
        ${f.antworten.map((a, v) => `
          <label class="bs-check__antwort" style="--v:${v}">
            <input type="radio" name="${uid}-${esc(f.key)}" value="${v}" />
            <span class="bs-check__wert" aria-hidden="true">${v}</span>
            <span class="bs-check__text">${esc(a)}</span>
          </label>`).join('')}
      </div>
    </fieldset>`;
  const root = el(`
    <div class="bs-check"${c.id ? ` id="${c.id}"` : ''}>
      <form class="bs-check__form" novalidate${c.ariaLabel ? ` aria-label="${esc(c.ariaLabel)}"` : ''}>
        <ol class="bs-check__leiste">
          ${c.fragen.map((f, i) => `<li><button type="button" class="bs-check__schritt" data-i="${i}" aria-label="${esc(T.zaehler(i, n))} ${esc(f.titel)}"><span aria-hidden="true">${i + 1}</span></button></li>`).join('')}
          <li><button type="button" class="bs-check__schritt bs-check__schritt--ziel" data-i="${n}" aria-label="${esc(T.ergebnis)}" disabled><span aria-hidden="true">✓</span></button></li>
        </ol>
        <div class="bs-check__buehne">
          ${c.fragen.map(frage).join('')}
          <div class="bs-check__ergebnis" data-i="${n}" hidden tabindex="-1" role="group" aria-label="${esc(T.ergebnis)}"></div>
        </div>
        <div class="bs-check__fuss">
          <p class="bs-check__offen"></p>
          <div class="bs-check__pfeile">
            <button type="button" class="bs-check__pfeil" data-r="-1"><i aria-hidden="true">←</i></button>
            <button type="submit" class="bs-check__pfeil" data-r="1"><i aria-hidden="true">→</i></button>
          </div>
        </div>
      </form>
      <p class="sr-only" aria-live="polite" data-ansage></p>
      ${c.fussnote ? `<p class="bs-check__fussnote">${esc(c.fussnote)}</p>` : ''}
    </div>`);
  const form = qs('form', root);
  const tafeln = qsa('[data-i].bs-check__frage, .bs-check__ergebnis', root);
  const schritte = qsa('.bs-check__schritt', root);
  const ergebnisEl = qs('.bs-check__ergebnis', root);
  const offenEl = qs('.bs-check__offen', root);
  const ansage = qs('[data-ansage]', root);
  const [zurueck, weiter] = qsa('.bs-check__pfeil', root);
  let werte = {};
  let stand = 0;        // 0 … n-1 Frage, n = Ergebnis
  let timer = 0;

  const beantwortet = (i) => werte[c.fragen[i].key] !== undefined;
  const alle = () => c.fragen.every((_, i) => beantwortet(i));
  const erreichbar = (i) => (i === n ? alle() : i === 0 || c.fragen.slice(0, i).every((_, k) => beantwortet(k)));
  const schrittName = (i) => (i === n ? T.ergebnis : `${T.zaehler(i, n)} ${c.fragen[i].titel}`);

  function leiste() {
    schritte.forEach((b, i) => {
      b.disabled = !erreichbar(i);
      b.classList.toggle('is-fertig', i < n && beantwortet(i));
      if (i === stand) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    const offen = c.fragen.filter((_, i) => !beantwortet(i)).length;
    offenEl.textContent = stand < n && T.offen ? T.offen(offen, n) : '';
    zurueck.disabled = stand === 0;
    weiter.disabled = stand >= n || !erreichbar(stand + 1);
    zurueck.hidden = weiter.hidden = stand === n;
    if (stand > 0 && stand < n + 1) zurueck.setAttribute('aria-label', schrittName(stand - 1)); else zurueck.removeAttribute('aria-label');
    if (stand < n) weiter.setAttribute('aria-label', schrittName(stand + 1));
    root.dataset.stand = stand === n ? 'ergebnis' : String(stand + 1);
  }

  function ergebnisFuellen() {
    const e = c.auswerten({ ...werte });
    ergebnisEl.innerHTML = `
      <p class="bs-check__kopf">${esc(e.kopf)}</p>
      <p class="bs-check__stufe"><span class="bs-check__ziffer">${c.stufeWort ? `<small>${esc(c.stufeWort)}</small>` : ''}<b>${esc(e.stufe)}</b></span><span class="bs-check__name">${esc(e.name)}</span></p>
      ${e.hinweis ? `<p class="bs-check__hinweis">${esc(e.hinweis)}</p>` : ''}
      <p class="bs-check__schrittText">${e.label ? `<b>${esc(e.label)}</b> ` : ''}${esc(e.text)}</p>
      <div class="bs-check__ctas">
        ${(c.ctas || []).map((k) => `<span class="bs-check__cta">${knopf(k)}${k.klein ? `<small>${esc(k.klein)}</small>` : ''}</span>`).join('')}
        <button type="button" class="bs-knopf bs-knopf--linie bs-check__neu">${esc(T.neu)}</button>
      </div>`;
    // Buchstaben-Roll fuer die neu erzeugten Knoepfe ist nicht verdrahtet (autoWire lief schon): Text bleibt stehen
    qs('.bs-check__neu', ergebnisEl).addEventListener('click', neu);
    c.onErgebnis?.(e);
    return e;
  }

  function zeigen(i, { fokus = true, richtung = 1 } = {}) {
    clearTimeout(timer);
    if (i < 0 || i > n || !erreichbar(i)) return;
    const alt = tafeln[stand];
    const neuT = tafeln[i];
    stand = i;
    let e = null;
    if (i === n) e = ergebnisFuellen();
    tafeln.forEach((t) => { t.hidden = t !== neuT; });
    leiste();
    ansage.textContent = i === n ? `${T.ergebnis}: ${c.stufeWort ? `${c.stufeWort} ` : ''}${e.stufe} ${e.name}` : schrittName(i);
    if (!reduced && alt !== neuT) {
      const teile = i === n ? [...neuT.children] : [qs('.bs-check__legende', neuT), ...qsa('.bs-check__antwort', neuT)];
      // Schneller Start (Frank, 15.11.2026: „check die Animation“): mit expo.inOut war die Flaeche beim Wechsel ~0,2 s leer
      gsap.fromTo(neuT, { clipPath: richtung > 0 ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.out', clearProps: 'clipPath' });
      gsap.from(teile, { y: 18 * richtung, opacity: 0,   /* nicht autoAlpha: unsichtbare Felder nehmen keinen Fokus an */ duration: 0.45, ease: 'power3.out', stagger: 0.04, delay: 0.03, clearProps: 'all' });
    }
    if (fokus) {
      const ziel = i === n ? ergebnisEl : (qs('input:checked', neuT) || qs('input', neuT));
      ziel.focus({ preventScroll: true });
    }
  }

  function neu() {
    werte = {};
    qsa('input', root).forEach((r) => { r.checked = false; });
    qsa('.bs-check__antwort', root).forEach((l) => l.classList.remove('is-an'));
    c.onErgebnis?.(null);
    zeigen(0, { richtung: -1 });
  }

  // Auswahl: change gilt fuer Maus, Finger und Pfeiltasten
  form.addEventListener('change', (ev) => {
    const r = ev.target;
    if (r.type !== 'radio') return;
    const i = Number(r.closest('.bs-check__frage').dataset.i);
    werte[c.fragen[i].key] = Number(r.value);
    qsa('.bs-check__antwort', tafeln[i]).forEach((l) => l.classList.toggle('is-an', l.contains(r)));
    leiste();
  });
  // Klick oder Tipp auf eine Antwort geht nach kurzer Pause weiter (Tastatur: Enter).
  // Nicht an event.detail festmachen: Touchpads, Stifte und manche Browser melden echte Klicks mit detail 0.
  // Stattdessen merken, ob kurz vorher ein Zeiger (Maus, Finger, Stift) auf einer Antwort war.
  let zeigerZeit = -1e9;
  const weiterNachPause = () => {
    clearTimeout(timer);
    const von = stand;
    timer = setTimeout(() => { if (stand === von && beantwortet(von)) zeigen(von + 1, { fokus: false }); }, reduced ? 0 : 380);
  };
  form.addEventListener('pointerdown', (ev) => { if (ev.target.closest('.bs-check__antwort')) zeigerZeit = performance.now(); });
  form.addEventListener('click', (ev) => {
    const l = ev.target.closest('.bs-check__antwort');
    if (!l) return;
    if (ev.detail > 0 || performance.now() - zeigerZeit < 1500) weiterNachPause();
  });
  // Rueckfall: Auswahl per Zeiger, auch wenn kein click ankommt (z. B. Zeiger beim Druecken verrutscht)
  form.addEventListener('change', (ev) => {
    if (ev.target.type === 'radio' && performance.now() - zeigerZeit < 1500) weiterNachPause();
  });
  form.addEventListener('submit', (ev) => { ev.preventDefault(); if (stand < n && beantwortet(stand)) zeigen(stand + 1); });
  zurueck.addEventListener('click', () => zeigen(stand - 1, { richtung: -1 }));
  schritte.forEach((b, i) => b.addEventListener('click', () => zeigen(i, { richtung: i < stand ? -1 : 1 })));

  tafeln[0].hidden = false;
  leiste();

  return {
    el: root,
    /** Stand: Werte, aktueller Schritt (1 … n oder 'ergebnis') */
    get werte() { return { ...werte }; },
    get stand() { return stand === n ? 'ergebnis' : stand + 1; },
    neu,
  };
}
