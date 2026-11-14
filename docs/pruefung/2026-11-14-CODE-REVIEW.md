---
phase: funnel-neuralnautic-welle1-2
reviewed: 2026-11-14T21:33:40Z
depth: deep
files_reviewed: 31
files_reviewed_list:
  - src/funnel/main.js
  - src/funnel/funnel.css
  - src/funnel/kritisch.css
  - src/seiten/gemeinsam.js
  - src/seiten/gemeinsam.css
  - src/seiten/ki-im-unternehmen.js
  - src/seiten/ki-im-unternehmen.css
  - src/seiten/methode.js
  - src/seiten/methode.css
  - src/seiten/leistungen.js
  - src/seiten/leistungen.css
  - src/seiten/ai-engineering.js
  - src/seiten/ai-engineering.css
  - src/seiten/ki-tool-kompass.js
  - src/seiten/ki-tool-kompass.css
  - src/seiten/wissen.js
  - src/seiten/wissen.css
  - src/seiten/ueber-mich.js
  - src/seiten/ueber-mich.css
  - src/seiten/kontakt.js
  - src/seiten/kontakt.css
  - src/seiten/impressum.js
  - src/seiten/datenschutz.js
  - src/seiten/impressum-datenschutz.js
  - src/seiten/impressum-datenschutz.css
  - public/inhalt/architektur/model3d.js
  - public/_headers
  - public/404.html
  - index.html
  - vite.config.js
  - wrangler.jsonc
findings:
  critical: 3
  warning: 15
  info: 15
  total: 33
status: issues_found
---

# NeuralNautic-Funnel: Code-Review-Bericht

**Geprüft:** 2026-11-14T21:33:40Z
**Tiefe:** deep (Aufrufketten in `@kern/motion.js`, `@kern/bausteine/*`, `@kern/hero/*`, `@kern/netz/netz.js` nachverfolgt, nur lesend)
**Dateien:** 31 (dazu zum Verständnis gelesen: die 10 Kapitel-`index.html`, `src/inhalt/*.js`, `public/inhalt/architektur/szene.json`, `public/robots.txt`)
**Status:** issues_found

## Zusammenfassung

Der Code ist ordentlich gebaut: Reduced Motion ist fast überall berücksichtigt, WebGL wird in der Nähe angelegt und in der Ferne wieder freigegeben (Hero, Karte, Sternfahrt, Szene, Netz pausieren außer Sicht), externe Links setzen durchgehend `rel="noopener noreferrer"`, und es gibt **keine Aufrufe an Drittanbieter**. Fonts liegen selbst gehostet (`@fontsource`), Calendly ist nur verlinkt und nicht eingebettet, es gibt kein Iconify, keine Videos von fremden Hosts und keine Tracker. Datenwerte gelangen fast nur über `esc()` ins DOM.

Die schweren Befunde betreffen nicht die Animation, sondern das, was beim Ersatz von neuralnautic.de zählt:

1. **Kontaktformular und Download-Formulare melden Erfolg, senden aber nichts.** Anfragen und Leads gehen verloren, und die Seite verspricht trotzdem eine Rückmeldung. Laut Brief ist das ein Zwischenstand. Es fehlt aber jede Sperre, die verhindert, dass dieser Stand live geht.
2. **Alle Seiten haben ein leeres `<main>`.** Impressum, Datenschutz und alle Kapitel entstehen nur per JavaScript. Ohne JS (LLM-Crawler, Social-Vorschauen, Barriere-Werkzeuge, Skriptfehler) bleibt die Seite leer, und der `<noscript>`-Hinweis verweist auf neuralnautic.de, also nach dem Umschalten auf sich selbst.
3. Eine Reihe von Go-Live-Lücken: keine CSP und kein HSTS, `interest-cohort` erzeugt Konsolenfehler, Trailing-Slash-Umleitung gegen Canonicals, fehlende Weiterleitungen alter URLs, ein Build, der auf Cloudflare ohne `../funnel-vorlage` scheitert, und ein öffentlich abrufbares Checklisten-PDF, das live absichtlich hinter der Route lag.

Dazu kommen Robustheitsfehler: Ein Skriptfehler hinterlässt einen dauerhaft schwarzen Bildschirm, das 3D-Modell rendert endlos auch außer Sicht und fängt das Mausrad über 84 % der Fensterhöhe ab, und die Regler lassen sich per Tastatur nicht bedienen.

## Narrative Findings (AI reviewer)

## Critical Issues

### CR-01: Kontaktformular meldet „Danke, wir melden uns in 24 Stunden“, versendet aber nichts

**Datei:** `src/seiten/kontakt.js:280-283`, `:298-301` (Text: `src/inhalt/kontakt.js:47-51`, `:43`)
**Problem:** `senden()` gibt ohne Netzaufruf `{ ok: true }` zurück. Jede Anfrage endet im Danke-Zustand mit „Wir melden uns in der Regel innerhalb von 24 Stunden bei Ihnen.“ Die Daten werden verworfen, der Interessent wartet vergeblich, und Frank erfährt nichts davon. Der Kommentar markiert die Stelle zwar als Server-Teil, aber nichts verhindert, dass dieser Stand mit dem nächsten Push (laut `wrangler.jsonc:5` „Push = Deploy“) auf neuralnautic.de landet. Das ist auf einer Beratungsseite der teuerste mögliche Fehler: verlorene Leads und ein falsches Versprechen gegenüber Kunden.
**Fix:** Bis die Funktion steht, ehrlich und fail-closed scheitern statt Erfolg vortäuschen, außer im lokalen Dev-Betrieb:
```js
async function senden(daten) {
  if (import.meta.env.DEV) return { ok: true };          // lokale Vorschau
  const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(daten) });
  if (!res.ok) { const j = await res.json().catch(() => ({})); return { ok: false, error: j.error }; }
  return { ok: true };
}
```
Ohne Backend liefert `/api/contact` dann 404, und der Nutzer sieht `F.fehlerStandard` statt eines falschen Danke. Zusätzlich im Fehlertext eine Ausweichadresse (E-Mail) nennen. Vor dem Umschalten als Abnahmepunkt prüfen: echte Testanfrage kommt bei Frank an.

### CR-02: Download-Formulare holen Einwilligung und Kontaktdaten ein und verwerfen sie

**Datei:** `src/seiten/ki-im-unternehmen.js:323-338` (Texte: `src/inhalt/ki-im-unternehmen.js:196`, `:205-211`, `:216-220`; Datenschutz: `src/inhalt/datenschutz.js:167`)
**Problem:** Das Formular fordert Name, E-Mail und Telefon an, verlangt dafür die Einwilligung „… um mich dazu per E-Mail oder Telefon zu kontaktieren“, und der Hinweis verspricht „Wenn Sie uns Ihre Kontaktdaten hinterlassen, melden wir uns gern“. Danach startet nur der Download. Die Angaben gehen nirgends hin. Die Datenschutzerklärung (Abschnitt Downloads) beschreibt eine Übermittlung per Resend, die es nicht gibt. Das ist ein stiller Lead-Verlust und eine Einwilligung zu einem Zweck, der nie erfüllt wird.
**Fix:** Wie bei CR-01: Außerhalb von `import.meta.env.DEV` an `D.endpoint` senden, bei Fehler `zeigeFehler(...)`. Alternativ bis zum Server-Teil die drei Kontaktfelder und die Einwilligung ausblenden („Download ohne Angaben“), damit niemand Daten einträgt, die verworfen werden. Den auskommentierten `fetch` (Zeile 327-328) nicht als Kommentar stehen lassen, sondern hinter die DEV-Weiche setzen.

### CR-03: Alle Inhalte, auch Impressum und Datenschutz, entstehen nur per JavaScript; `<noscript>` verweist nach dem Ersatz auf sich selbst

**Datei:** `index.html:32-51`, alle `*/index.html` (z. B. `leistungen/index.html` mit `<main id="inhalt" tabindex="-1"></main>` und `<noscript>… <a href="https://neuralnautic.de/leistungen">`), `src/seiten/impressum-datenschutz.js:16-45`
**Problem:** Das ausgelieferte HTML jeder Kapitelseite hat ein leeres `<main>`. Ohne ausgeführtes JS sehen Besucher nur den Hinweis „Diese Seite braucht JavaScript. Die vollständige Website: neuralnautic.de/…“. Sobald diese Seite neuralnautic.de **ist**, zeigt der Link auf genau diese leere Seite. Folgen:
- **Impressum und Datenschutzerklärung** sind ohne JS leer. § 5 DDG verlangt „unmittelbar erreichbar und ständig verfügbar“.
- **Auffindbarkeit:** Die Live-Seite (Next.js) liefert serverseitig gerendertes HTML. Crawler ohne JS-Ausführung (GPTBot, ClaudeBot, PerplexityBot, LinkedIn- und X-Vorschau, viele SEO-Werkzeuge) sehen nach dem Umschalten keine einzige Zeile Text. Das ist genau die Lücke aus dem Playbook „Website-Auffindbarkeit“: alles im Repo geprüft, aber außen nichts sichtbar.
- Jeder Skriptfehler (siehe WR-01) bedeutet eine leere Seite statt eines lesbaren Rests.
**Fix:** Mindestens Impressum und Datenschutz als statisches HTML im Build erzeugen. Für die Kapitelseiten ein Prerender-Schritt im Vite-Build: einen Plugin-Hook, der die Inhaltsmodule (`src/inhalt/*.js` sind reine Daten) beim Build in semantisches HTML im `<main>` schreibt, das die Seitenskripte dann übernehmen oder ersetzen. Den `<noscript>`-Verweis auf neuralnautic.de entfernen, sobald die Domain umzieht.

## Warnings

### WR-01: Ein Skriptfehler hinterlässt einen dauerhaft schwarzen Bildschirm (Lader ohne CSS-Notausgang)

**Datei:** `index.html:19-21`, `:29`; `src/funnel/main.js:455`; `src/seiten/gemeinsam.js:79` (gleiches Muster in allen Kapitel-HTMLs)
**Problem:** `.bs-lader` liegt mit `position: fixed; inset: 0; z-index: 9000` über der Seite und wird nur durch `preloader()` entfernt. Auf der Startseite läuft dieser Aufruf erst in Zeile 455. Jede Ausnahme in den Zeilen 22-454 (z. B. `qs('.hero__pin', startEl)` ergibt `null`, eine geänderte Struktur von `figuren.json`, `structuredClone`/`:has` in älterem Safari) oder ein Modul, das nicht lädt, lässt den Stern für immer auf schwarzem Grund stehen. `<noscript>` hilft nur bei abgeschaltetem JS, nicht bei Skriptfehlern.
**Fix:** CSS-Notausgang im Inline-Style, unabhängig vom Skript:
```css
.bs-lader { animation: bs-lader-weg 0s linear 3s forwards; }
@keyframes bs-lader-weg { to { visibility: hidden; opacity: 0; pointer-events: none; } }
```
Auf der Startseite `preloader(...)` an den Anfang von `main.js` ziehen (direkt nach `initScroll()`).

### WR-02: Ein fehlerhafter Baustein-Start bricht die Verdrahtung der ganzen Seite ab

**Datei:** `src/funnel/main.js:457-463`; `src/seiten/gemeinsam.js:85-95`
**Problem:** `starten.forEach((f) => f())` läuft ohne Absicherung. Wirft ein einziger `start()` (Laufband, Wirbel, eine `nachStart`-Funktion einer Seite), bleiben alle folgenden Starts, `ScrollTrigger.refresh()`, `k.messen()`, der Hash-Sprung und `window.__bereit` aus. Elemente mit `gsap.set(... autoAlpha: 0)` oder Clip-Startzuständen bleiben dann unsichtbar, die Seite ist halb verdrahtet, und es gibt einen unbehandelten Promise-Fehler in der Konsole.
**Fix:**
```js
starten.forEach((f) => { try { f(); } catch (e) { console.warn('[funnel] Start fehlgeschlagen:', e); } });
```
Das gleiche gilt für `zeichnen`/`crewAusrichten` hinter `document.fonts.ready.then`.

### WR-03: 3D-Modell rendert endlos weiter, auch außer Sicht und im Hintergrund-Tab

**Datei:** `public/inhalt/architektur/model3d.js:348-356`, `:363-367`
**Problem:** `frame()` ruft sich bedingungslos per `requestAnimationFrame` auf und baut in jedem Bild die ganze Szene neu (`collect()`, Sortierung, Text mit Halo). Das passiert auch, wenn das Modell weit außerhalb des Fensters liegt, also während der ganzen restlichen `/ki-im-unternehmen`-Seite. Auf Laptops und Handys kostet das dauerhaft CPU und Akku. Die anderen Szenen (Hero, Sternfahrt, Netz) pausieren außer Sicht, diese nicht.
**Fix:** Nur zeichnen, wenn sichtbar und wenn sich etwas bewegt:
```js
var sichtbar = true;
new IntersectionObserver(function (es) { sichtbar = es[0].isIntersecting; if (sichtbar) requestAnimationFrame(frame); }).observe(canvas);
function frame() {
  if (!sichtbar || document.hidden) return;   // Schleife endet, IO startet sie neu
  ...
  requestAnimationFrame(frame);
}
```
Zusätzlich: Liegt `|goal - rot|` unter einer Schwelle und gibt es keine Eingabe, nicht neu zeichnen.

### WR-04: Mausrad-Falle: das Modell schluckt das Scrollen über 84 % der Fensterhöhe

**Datei:** `public/inhalt/architektur/model3d.js:301-306`; `src/seiten/ki-im-unternehmen.js:221` (`data-lenis-prevent-wheel`); `src/seiten/ki-im-unternehmen.css:98` (`.m3d { height: min(84vh, 900px) }`)
**Problem:** Der `wheel`-Handler ruft immer `preventDefault()` auf, Lenis ignoriert das Rad dort zusätzlich. Wer auf dem Desktop durch die Seite scrollt und mit dem Zeiger auf das Modell kommt, bleibt stecken: das Rad dreht nur noch das Modell. Bei 84vh Höhe ist fast das ganze Fenster eine Falle. Der Code-Kommentar (Zeile 400) erkennt das Problem beim Pin, nicht aber beim Rad selbst.
**Fix:** Das Rad nur abfangen, wenn das Modell aktiviert ist (Klick oder Fokus) oder mit Modifikator. Sonst normal scrollen lassen:
```js
canvas.addEventListener('wheel', function (e) {
  if (!stage.matches(':focus-within') && !e.shiftKey && !e.ctrlKey) return;   // Seite scrollt weiter
  e.preventDefault(); ...
}, { passive: false });
```
`data-lenis-prevent-wheel` entsprechend nur im aktiven Zustand setzen. Den Hinweistext („Mausrad dreht …“) anpassen.

### WR-05: Regler des 3D-Modells per Tastatur nicht bedienbar (Pfeiltasten drehen die falsche Achse)

**Datei:** `public/inhalt/architektur/model3d.js:323-335`, `:274`
**Problem:** Der `keydown`-Handler hängt an `.m3d`, und die Range-Regler liegen darin. Pfeiltasten auf einem Regler blubbern nach oben: `ArrowLeft/Right` ändern `goal.y` und rufen `preventDefault()` auf. Damit unterbleibt die Standardaktion des Reglers. Auf dem X- und dem Z-Regler drehen Links/Rechts also die Y-Achse, der Z-Regler lässt sich per Tastatur gar nicht verstellen. Weil `syncUI()` den fokussierten Regler absichtlich nicht aktualisiert (Zeile 274), zeigt der Regler danach einen veralteten Wert. Die Regler sind die zugängliche Bedienung des Modells, sie fallen damit für Tastaturnutzer aus.
**Fix:**
```js
stage.addEventListener('keydown', function (e) {
  if (e.target.matches('input, button')) return;   // Regler und Knopf behalten ihr Standardverhalten
  ...
});
```

### WR-06: Fehlerpfad beim Laden des 3D-Modells: keine Statusprüfung, kein erneuter Versuch, „Lädt“ bleibt für immer stehen

**Datei:** `src/seiten/ki-im-unternehmen.js:362-386`
**Problem:** `fetch(M.szene).then((r) => r.json())` prüft `r.ok` nicht. Bei 404 liefert Cloudflare die `404.html`, und `json()` scheitert mit einem SyntaxError, statt den eigentlichen Grund zu melden. `geladen = true` bleibt nach einem Fehler gesetzt, ein zweiter Versuch ist ausgeschlossen. Der Platzhalter `.kiu-modell__laden` („Referenzmodell …“) bleibt stehen, das Modell fehlt ohne Ersatz. `s.onerror = fehler` lehnt mit einem `Event` ab, `e?.message` ist dann `undefined`. Außerdem setzt `window.SCENE` und das Nachladen eines klassischen Skripts einen globalen Zustand, der bei einem zweiten Aufruf das IIFE doppelt ausführen würde.
**Fix:** `if (!r.ok) throw new Error(\`szene.json ${r.status}\`)`. Im `catch` den Rahmen auf ein Standbild umschalten (die Vorschau `A.vorschau` ist schon da) und `geladen = false` setzen, damit ein späterer Versuch möglich ist. `onerror = () => fehler(new Error('model3d.js nicht geladen'))`.

### WR-07: `_headers`: keine CSP, kein HSTS, und `interest-cohort` erzeugt einen Konsolenfehler

**Datei:** `public/_headers:1-6`
**Problem:**
- **Keine `Content-Security-Policy`.** Die Seite schreibt viel HTML über `innerHTML`/`<template>` (Bausteine, `rollText`, `M.markup`). Eine CSP ist die zweite Verteidigungslinie, falls künftig Daten von außen (Chat-Antworten aus Mistral, Formularfehler vom Server) in diese Senken laufen. Für einen Chat mit LLM-Ausgabe ist sie Pflicht.
- **Kein `Strict-Transport-Security`.**
- `Permissions-Policy: … interest-cohort=()` ist ein entfernter FLoC-Schalter. Chrome meldet dafür „Error with Permissions-Policy header: Unrecognized feature: 'interest-cohort'“ als Konsolenfehler. Das verletzt das Kriterium „0 Konsolenfehler“, fällt aber in der QA nicht auf, weil der Vite-Dev-Server `_headers` nicht anwendet.
- `X-Robots-Tag: noindex, nofollow` steht hier, in jedem `<meta name="robots">` und in `public/robots.txt` (`Disallow: /`). Für den Prototyp ist das richtig, beim Umschalten müssen aber alle drei Stellen gemeinsam fallen (siehe WR-09).
**Fix:** Zuerst als `Content-Security-Policy-Report-Only` testen, dann scharf schalten:
```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()
```
(`'unsafe-inline'` bei Styles ist nötig wegen der vielen `style="--…"`-Attribute und des Inline-`<style>`. JSON-LD ist als `application/ld+json` kein ausführbares Skript.)

### WR-08: Schrägstrich-Umleitung widerspricht Canonicals und Live-URLs

**Datei:** `wrangler.jsonc:9-12`; `vite.config.js:13-24`; Canonicals z. B. `leistungen/index.html:13`
**Problem:** Die Kapitel liegen als `<seite>/index.html` vor. Mit dem Workers-Standard `html_handling: "auto-trailing-slash"` leitet Cloudflare `/leistungen` per 307 auf `/leistungen/` um. Alle internen Links, das Menü, die Live-Adressen und die Canonicals (`https://neuralnautic.de/leistungen`) zeigen aber auf die Form **ohne** Schrägstrich. Das heißt: Jede Navigation macht einen Umweg über die Umleitung, und jedes Canonical verweist auf eine URL, die umleitet. Google wertet das als widersprüchliches Signal. Der Dev-Server bildet dasselbe mit **301** nach, und Browser merken sich 301 dauerhaft.
**Fix:** In `wrangler.jsonc` unter `assets` `"html_handling": "drop-trailing-slash"` setzen. Dann liefert `/leistungen` direkt die Seite aus, wie live. Im Dev-Plugin die Seite intern umschreiben (`req.url = pfad + '/index.html'`) statt umzuleiten, mindestens aber 302 statt 301.

### WR-09: Für den Ersatz von neuralnautic.de fehlen Canonicals, Weiterleitungen und gültige JSON-LD-URLs

**Datei:** `ueber-mich/index.html:20`; `ki-im-unternehmen/index.html`, `methode/index.html`, `wissen/index.html`, `ueber-mich/index.html`, `kontakt/index.html`, `impressum/index.html`, `datenschutz/index.html` (je ohne `<link rel="canonical">`); `index.html:6-7`; `public/robots.txt`; `public/_headers:6`
**Problem:**
- Sieben von elf Seiten haben kein Canonical und keine Open-Graph-Angaben, die Startseite auch nicht.
- Das JSON-LD auf `/ueber-mich` verweist auf `https://neuralnautic.de/frank-portrait.webp` und `…/cert-tuev-sued.pdf`. Im Funnel liegen beide Dateien unter `/inhalt/…`, die Root-URLs liefern nach dem Umschalten 404.
- Es gibt keine `public/_redirects`. Alte Live-URLs (`/use-cases`, `/frank-portrait.webp`, `/cert-tuev-sued.pdf`, `/logo-monogram.png`, `/architektur/…`) brechen damit, samt allen Backlinks darauf.
- Der Kommentar „Funnel auf Subdomain … soll ihr bei Google keine Konkurrenz machen“ (`index.html:6`, in allen Kapitel-HTMLs) beschreibt einen überholten Plan und lädt dazu ein, `noindex` stehen zu lassen.
**Fix:** `public/_redirects` mit 301 für alle alten Pfade anlegen (Liste aus `neural-nautic-live/public` und `app/` ableiten). JSON-LD-URLs auf `/inhalt/…` umstellen oder die Dateien zusätzlich unter den alten Pfaden ausliefern. Canonical und OG für alle Seiten ergänzen. Eine Go-Live-Checkliste anlegen: `robots.txt`, `X-Robots-Tag`, `<meta robots>`, `noscript`-Link, Chat-Platzhalter (WR-12), Formular-Backend (CR-01/02).

### WR-10: Build auf Cloudflare scheitert, weil der Kern außerhalb des Repos liegt

**Datei:** `vite.config.js:8`, `:28-29`; `wrangler.jsonc:5`
**Problem:** `@kern` zeigt auf `../funnel-vorlage/src/kern`. Workers Builds klont nur dieses Repo, `npm run build` findet dort weder `@kern/motion.js` noch `kritisch.css`/`@import '@kern/base.css'`. `wrangler.jsonc` beschreibt „Push = Deploy“, der erste Push nach dem Anlegen des Repos ergibt also einen roten Build. Das ist ein Szenario, das Frank beim Reviewer schon einmal geschadet hat (CLAUDE.md, rag-infra-442). Das Vendoring-Skript, auf das der Kommentar verweist, existiert im Repo nicht.
**Fix:** Vor dem ersten Push das Vendoring-Skript anlegen und im Build-Befehl ausführen. Alternativ den Kern als Git-Submodul oder npm-Workspace-Paket einbinden. Der Build muss ohne Nachbarordner grün laufen; das als CI-Schritt prüfen.

### WR-11: Checklisten-PDF liegt öffentlich, obwohl die Live-Seite es bewusst nur über die Route ausliefert

**Datei:** `public/inhalt/downloads/NeuralNautic_KI-Checkliste_Reifegrad-und-Risiko.pdf`; Verweis `src/inhalt/ki-im-unternehmen.js:240`; Gegenaussage `src/inhalt/backend.js:81`
**Problem:** `backend.js` hält fest: „Auf der Live-Seite liegt das PDF bewusst nicht in public/, sondern wird nur über diese Route ausgeliefert.“ Im Funnel liegt es unter einer festen, erratbaren URL. Wenn später die Lead-Route kommt, bleibt die Direkt-URL offen, und das Formular lässt sich umgehen. Sobald `noindex` fällt, kann die Datei zudem in den Suchindex geraten.
**Fix:** Mit dem Server-Teil das PDF aus `public/` nehmen und nur noch über die Worker-Route ausliefern (Asset-Binding im Worker, `Cache-Control: no-store`). Bis dahin mindestens `/inhalt/downloads/*` mit `X-Robots-Tag: noindex` in `_headers` versehen, damit die Regel den Wegfall des globalen `noindex` überlebt.

### WR-12: Chat-Platzhalter zeigt Besuchern einen internen Bauhinweis

**Datei:** `src/seiten/gemeinsam.js:226-244`, `:76`
**Problem:** Auf jeder Kapitelseite steht unten rechts der Chat-Knopf. Ein Klick zeigt „Der Chat kommt mit dem Server-Teil.“ Das ist ein Entwicklerhinweis, kein Text für Kunden. Nach dem Umschalten fehlt der heutige Mistral-Chat, und die Lücke ist sichtbar. Dazu reagieren zwei globale `Escape`-Handler (Chat und Menü) gleichzeitig, und beide ziehen den Fokus auf ihren Knopf.
**Fix:** Den Platzhalter bis zum Server-Teil standardmäßig aus (`o.chat ?? import.meta.env.DEV`) oder mit einem kundentauglichen Text samt Link auf `/kontakt`. Den Escape-Handler nur reagieren lassen, wenn der Fokus in der Blase oder auf dem Knopf liegt.

### WR-13: `/wissen` legt Pin und Layout einmalig beim Laden fest

**Datei:** `src/seiten/wissen.js:170`, `:184-185`, `:190-206`
**Problem:** `gepinnt` wird einmal berechnet. Wer ein Tablet dreht oder das Fenster unter 992 px bzw. 620 px Höhe verkleinert, behält die 320vh-Strecke mit Sticky-Pin (`wissen.css:37-40`) auf einem schmalen Layout. Umgekehrt bleibt nach dem Vergrößern der Pin aus. `methode.js:119` und `ai-engineering.js:149-159` lösen das mit `matchMedia`-Listener bzw. `gsap.matchMedia()`, `/wissen` nicht.
**Fix:** Wie in `ai-engineering.js` `gsap.matchMedia()` verwenden und darin Klasse `is-gepinnt`, ScrollTrigger und IO-Abspielweg auf- und abbauen.

### WR-14: `decodeURIComponent` auf den Hash wirft bei kaputten URLs

**Datei:** `src/seiten/gemeinsam.js:64`, `:91`
**Problem:** Ein Link oder eine Adresse wie `/kontakt#%E0%A4%A` wirft `URIError`. In `fertig()` (Zeile 91) passiert das innerhalb von `document.fonts.ready.then`: `window.__bereit` wird nie gesetzt, und in der Konsole steht ein unbehandelter Fehler. Die Adresse kann ein Dritter verlinken.
**Fix:**
```js
const idAusHash = (h) => { try { return decodeURIComponent(h); } catch { return h; } };
```

### WR-15: 404-Seite verlinkt auf `/keramik/`, eine Seite eines anderen Projekts

**Datei:** `public/404.html:3`
**Problem:** Die Fehlerseite stammt aus der Vorlage und bietet „Keramik“ als zweiten Weg an. Im NN-Funnel gibt es diese Seite nicht, der Link führt erneut auf die 404. Nach dem Umschalten sieht jeder Besucher eines alten Links das.
**Fix:** Den Link entfernen und stattdessen `/leistungen` und `/kontakt` anbieten, dazu Titel und Text in NN-Wortlaut.

## Info

### IN-01: Fokus-Hervorhebung im Dreieck kann nie greifen

**Datei:** `src/seiten/ki-im-unternehmen.js:99-103`
**Problem:** `focus`/`blur` hängen an `<article>`-Karten ohne `tabindex` und ohne fokussierbaren Inhalt. Die Handler sind toter Code, für Tastaturnutzer gibt es keinen Ersatz für den Hover.
**Fix:** `tabindex="0"` an die Karten oder auf `focusin`/`focusout` umstellen und die Karten fokussierbar machen, sonst die beiden Zeilen streichen.

### IN-02: HUD: Lade-Listener sammeln sich, Uhr läuft endlos

**Datei:** `src/seiten/ueber-mich.js:144`, `:116-118`
**Problem:** Lädt das nächste Kamerabild länger als 4,2 s oder schlägt es fehl, hängt jeder Intervall-Takt einen weiteren `load`-Listener an. Es gibt keinen `error`-Zweig, später laufen mehrere Timelines. `setInterval(tick, 1000)` läuft auch außerhalb der Sicht und wird nie beendet.
**Fix:** Vor dem Wechsel prüfen, ob ein Wechsel läuft (`if (wechselLaeuft) return`), dazu `error`-Listener mit `{ once: true }`. Die Uhr im selben IntersectionObserver starten und stoppen wie Rauschen und Wechsel.

### IN-03: Akkordeon im KI Tool Kompass: schnelles Doppelklicken erzeugt gegenläufige Tweens

**Datei:** `src/seiten/ki-tool-kompass.js:263-276`
**Problem:** Öffnen und Schließen laufen auf dasselbe Element ohne `overwrite`. Ein Klick während des Öffnens startet den Schließ-Tween, danach räumt `clearProps` des Öffnens die Höhe auf: Der Inhalt springt kurz auf und wird dann geschlossen.
**Fix:** `gsap.killTweensOf(inhalt)` vor jedem neuen Tween oder `overwrite: true`.

### IN-04: „Nächstes Kapitel“ halb aus dem Menü, halb fest verdrahtet

**Datei:** `src/seiten/leistungen.js:253-254`, `src/seiten/ai-engineering.js:185-186`, `src/seiten/ki-tool-kompass.js:296-297`
**Problem:** Titel und Ziel kommen aus `MENUE.eintraege[index + 1]`, der Text aus einem fest importierten `KOPF` (z. B. `ki-im-unternehmen.js`). Ändert sich die Menüreihenfolge, passen Titel und Text nicht mehr zusammen. Fehlt `ROUTE` im Menü, wird es Eintrag 0 (Start), steht die Seite am Ende, folgt ein TypeError auf `undefined.text`.
**Fix:** Ziel, Titel und Text aus einer Tabelle (Route → KOPF) gemeinsam ermitteln, mit Rückfall auf `null` (dann keinen Querverweis zeigen).

### IN-05: Danke-Text der Checkliste spricht von „der Grafik“ und „Fragen zur Architektur“

**Datei:** `src/seiten/ki-im-unternehmen.js:293-296` (Text `src/inhalt/ki-im-unternehmen.js:216-220`)
**Problem:** Beide Downloads nutzen denselben Danke-Wortlaut, auch das Checklisten-PDF. Wörtlich von der Live-Seite übernommen, aber sichtbar falsch. Der Knopf „Erneut herunterladen“ lädt nicht herunter, sondern zeigt nur das Formular wieder.
**Fix:** Mit Frank klären, ob der Wortlaut je Unterlage angepasst werden darf (`D.danke` statt `F.danke`).

### IN-06: Beschriftungen im 3D-Modell fallen auf die Systemschrift zurück

**Datei:** `public/inhalt/architektur/szene.json` (`theme.sans = "Inter,system-ui,sans-serif"`), genutzt in `model3d.js:185`
**Problem:** `@fontsource-variable/inter` registriert die Familie als `Inter Variable`, nicht `Inter`. Die Canvas-Beschriftungen nutzen deshalb `system-ui`. `wissen.js:142` macht es richtig (`"Inter Variable", Inter`).
**Fix:** In der Szene `"'Inter Variable',Inter,system-ui,sans-serif"` setzen oder `T.sans` beim Laden in `ki-im-unternehmen.js` überschreiben.

### IN-07: QA-Hilfen hängen in Produktion am `window`

**Datei:** `src/funnel/main.js:70`, `:314`, `:404`, `:429`, `:558`; `src/seiten/ki-im-unternehmen.js:145`, `:335`, `:382`; `src/seiten/ueber-mich.js:156`, `:209`, `:213`; `src/seiten/kontakt.js:318`; `src/seiten/wissen.js:211` u. a.
**Problem:** `window.__wirbel`, `__org`, `__leistungen`, `__check`, `__hero`, `__karte`, `__kontakt`, `__downloads` … erlauben jedem Skript, Formulare und Szenen zu steuern (`window.__kontakt.danke()`). Kein Sicherheitsloch, aber unnötige Angriffsfläche und Speicherbindung.
**Fix:** Hinter `if (import.meta.env.DEV || new URLSearchParams(location.search).has('qa'))` legen.

### IN-08: Ladetext zerstört die Roll-Struktur des Sende-Knopfs

**Datei:** `src/seiten/kontakt.js:296`, `:300`
**Problem:** `rollText` (`@kern/motion.js:108-114`) ersetzt den Inhalt von `[data-roll]` durch zwei Zeichenreihen und setzt `aria-label`. `knopfSpan.textContent = …` überschreibt das. Nach einem Fehler hat der Knopf keinen Roll-Effekt mehr, und `aria-label` nennt während des Ladens weiter „Anfrage senden“.
**Fix:** Den Ladetext in ein eigenes Element neben `[data-roll]` schreiben und den Knopf mit `aria-busy="true"` markieren.

### IN-09: Doppelte `pagehide`-Handler; `prepend(null)` ohne Wächter

**Datei:** `src/funnel/main.js:536`, `:562`, `:30`
**Problem:** Hero-Dispose ist in zwei `pagehide`-Handlern verteilt (einer ruft `heroAus()`, der andere direkt `window.__hero?.dispose?.()`). Das ist harmlos, aber verwirrend. `document.body.prepend(document.querySelector('.bs-sprung'))` fügt den Text „null“ ein, falls der Sprunglink im HTML fehlt; `gemeinsam.js:43-44` prüft das, die Startseite nicht.
**Fix:** Einen Handler (`heroAus(); karteAus(); galerieAus();`), dazu `if (sprung)`.

### IN-10: Tote Regel `.nn-hero-ersatz`

**Datei:** `src/funnel/funnel.css:38`
**Problem:** Die Klasse wird nirgends mehr gesetzt (Platzhalter aus der Zeit vor `@kern/hero`).
**Fix:** Entfernen.

### IN-11: `wrangler.jsonc`: veralteter Kommentar, workers.dev bleibt nach Go-Live offen, Datenschutz nennt Workers Logs

**Datei:** `wrangler.jsonc:13-19`; `src/inhalt/datenschutz.js:121`
**Problem:** Der Kommentar nennt `nn-ki-funnel.<konto>.workers.dev`, der Worker heißt `funnel-neuralnautic`. Mit `workers_dev: true` bleibt nach dem Umschalten eine zweite, öffentlich erreichbare Kopie der Seite stehen (Duplicate Content, sobald `noindex` fällt). Die Datenschutzerklärung beschreibt Workers Logs mit Löschung nach sieben Tagen, `observability.enabled` steht aber auf `false`.
**Fix:** Beim Umschalten `workers_dev: false` setzen. Datenschutzerklärung und Konfiguration angleichen (eins von beiden ändern). Kommentar korrigieren.

### IN-12: HTML-Senken für Daten: `E.satz` roh, `rollText` ohne Escaping

**Datei:** `src/funnel/main.js:76`; Kern `@kern/motion.js:111-113` (aufgerufen über `autoWire` auf allen Seiten)
**Problem:** `E.satz` enthält absichtlich `<strong>` und geht unescaped ins DOM. `rollText` liest `textContent` (also bereits entschlüsselten Text) und setzt die Zeichen ungeschützt wieder per `innerHTML` ein. Ein Knopftext mit `<` oder `&` würde als HTML gelesen. Heute sind alle Daten statisch und vertrauenswürdig, es gibt also keine Lücke. Sobald Chat-Antworten oder Servertexte durch `data-roll` laufen, ist das eine XSS-Senke. Der Kern wird separat geprüft, hier nur als Aufrufstelle gemeldet.
**Fix:** In `rollText` jedes Zeichen über `esc()` laufen lassen. Für `E.satz` im Datenmodul festhalten, dass das Feld HTML ist (z. B. `satzHtml`).

### IN-13: Pyramide setzt ein Korridor-Element voraus

**Datei:** `src/seiten/ki-im-unternehmen.js:159-161`
**Problem:** Ohne Stufe mit `corridor` liefert `findIndex` −1: `vor` ist leer, und `nach` wird `slice(-1)`, also nur die letzte Stufe. Die anderen verschwinden still.
**Fix:** `const k = W.stufen.findIndex((x) => x.corridor); if (k < 0) { /* alle Stufen ohne Korridor */ }`.

### IN-14: Drei Kapitelseiten binden `kritisch.css` nicht im HTML ein

**Datei:** `leistungen/index.html`, `ai-engineering/index.html`, `ki-tool-kompass/index.html`; `src/seiten/leistungen.js:133`, `ai-engineering.js:8`, `ki-tool-kompass.js:196`
**Problem:** Die anderen Seiten laden das Grundstylesheet per `<link>` im Kopf, diese drei per `import '@kern/base.css'` erst mit dem Skript. Bei Reduced Motion (Lader per Inline-CSS ausgeblendet) gibt es einen kurzen unformatierten Zustand, z. B. einen sichtbaren Sprunglink. Das Muster ist uneinheitlich.
**Fix:** Wie bei den übrigen Seiten `<link rel="stylesheet" href="/src/funnel/kritisch.css" />` im Kopf, den JS-Import streichen.

### IN-15: `dist/` veraltet, Dev-Port weicht vom Brief ab

**Datei:** `dist/` (enthält nur die Startseite, keine Kapitel); `vite.config.js:29`
**Problem:** `wrangler deploy` ohne vorherigen Build würde einen Stand ohne Kapitelseiten ausliefern. `server.port: 5191` mit `strictPort` kollidiert mit dem Hero-Agenten (Brief: NN läuft auf 5193). `npm run dev` scheitert deshalb, solange der Hero-Server läuft.
**Fix:** `dist/` steht schon in `.gitignore`; vor jedem `wrangler deploy` bauen (`cf:dev` tut das bereits). Port auf 5193.

---

_Geprüft: 2026-11-14T21:33:40Z_
_Prüfer: Claude (gsd-code-reviewer)_
_Tiefe: deep_
