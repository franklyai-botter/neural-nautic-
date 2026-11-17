# Brief: NeuralNautic-Funnel, Welle 1 (14.11.2026)

## Auftrag (Frank, sinngemäß)

„Bau die NeuralNautic-Website lokal, noch nicht pushen. Nimm alle Inhalte mit. Den Header und das
Video packen wir dort rein, wo es Sinn macht. Die Scroll-Effekte sollen immer wieder auftauchen,
nicht nur im Header. Auch die Ganzkörperansichten sollen scrollfähig sein.“ Entschieden ist
**Variante A: Bühne plus Kapitelseiten**, dazu die Karten, die sich öffnen.

Strukturvorschlag mit allen Zuordnungen (Pflichtlektüre):
`C:\Users\frank\Projekte\nn-ki-funnel\docs\STRUKTUR-VORSCHLAG.md`, Abschnitte 1, 2, 4 und 6.

**Welle 1** = Seitenrahmen (Kopf, Menü, Footer, Seitenwechsel) + **Startseite komplett** + alle
Bausteine, die sie braucht. Danach **Halt**: Frank sieht die Startseite an, erst dann folgen die
8 Kapitelseiten (Welle 2). Parallel zieht ein zweiter Agent alle Inhalte der Live-Seite als Daten
heraus, damit Welle 2 sofort starten kann.

Die Live-Seite bleibt unberührt. Live-Repo nur lesen:
`C:\Users\frank\Projekte\neural-nautic-live` (Next.js, `447000b`).

## Wer schreibt wo

| Agent | darf schreiben |
|---|---|
| **Hero** (läuft schon) | `funnel-vorlage/src/kern/hero/**`, `funnel-vorlage/tools/bilder.py`, `qa_hero.py`, `docs/HERO.md`; im Funnel `public/bilder/**`, `figuren.json`, `bilder-quellen.json`, `hero-test.html`, `src/hero-test/**` |
| **Bühne** | `funnel-vorlage/src/kern/bausteine/**`, `funnel-vorlage/docs/BAUSTEINE.md`; im Funnel `index.html`, `src/funnel/**`, `src/inhalt/start.js`, `public/medien/**`, `qa/start/**` |
| **Inhalt** | im Funnel `src/inhalt/**` außer `start.js`, `public/inhalt/**`, `docs/ABNAHME-INHALTE.md` |

Für alle:
- Nicht ändern: `src/kern/motion.js`, `src/kern/base.css`, `package.json`, `vite.config.js`,
  `wrangler.jsonc`, `public/brand/**`. Bedarf im Bericht melden.
- **Kein `npm install`, keine Commits, keine verändernden Git-Befehle, nichts pushen.**
- Keine Inhalte erfinden. Texte, Zahlen und Quellen wörtlich aus dem Live-Repo. Als Person nur Frank.
- Logos nur aus `public/brand/` (byte-gleiche Kopien der zentralen Ablage). Nie nachbauen. Nutzt die
  Live-Seite eine Logo-Variante, die dort fehlt (z. B. `for42-wordmark-nn.svg`), melden, nicht kopieren.
- Python mit `python -I`.

## Bühne: Seitenrahmen

- **Kopf:** NN-Logo (`public/brand/`), Menü-Knopf, Haupt-CTA **„KI-Check buchen“** immer sichtbar
  (Lando: STORE), Ziel `KI_CHECK_BUCHEN` aus `neural-nautic-live/app/site.ts`. Mobil wandert der CTA
  nach unten in die Daumenzone. Dünner Fortschrittsbalken rechts (`data-progress`).
- **Menü** im Lando-Vorhang (Ellipse per clip-path, Bilder gestaffelt, Hover färbt), per Tastatur
  bedienbar, Esc schließt, Fokus bleibt im Menü. Einträge mit den Live-Adressen: Start, Leistungen
  `/leistungen`, Im Unternehmen `/ki-im-unternehmen`, Im Projekt `/methode`, AI Engineering
  `/ai-engineering`, KI Tool Kompass `/ki-tool-kompass`, Ausguck `/wissen`, Über mich `/ueber-mich`,
  Kontakt `/kontakt`. Die Unterseiten entstehen in Welle 2, Links dürfen bis dahin ins 404 laufen.
- **Footer** als Lando-Karte mit Leuchtrand: Claim, alle Seiten, Spalten und Links wie
  `neural-nautic-live/app/components/Footer.tsx`, LinkedIn Frank, LinkedIn NN, X, for42, Impressum,
  Datenschutz, „© · NeuralNautic · in Gründung · Frank Schütt“.
- **Seitenwechsel** über `pageTransitions()` und `prefetchOnHover()` aus `@kern/motion.js`.

## Bühne: Startseite (Plätze L1–L12 aus dem Strukturvorschlag)

| Platz | Inhalt | Hinweise |
|---|---|---|
| L1 | Preloader: NN-Stern als Maske öffnet die Seite | unter 1 s, Stern-PNG als `mask-image`, nicht nachzeichnen |
| L2 | **Hero** aus `@kern/hero` (Schnittstelle in `funnel-vorlage/docs/HERO.md`, entsteht gerade) | bis er da ist: statisches `<picture>` aus `public/bilder/`. Beim Scrollen Porträt → Ganzkörper |
| L3 | **Der alte Header kommt hierher:** Der Hero schrumpft zur Bildkarte in der Mitte, um sie kreisen die 61 Logos der Modellanbieter (wie heute der Logo-Wirbel mit Franks Foto in der Mitte, `KiLogoWirbel.tsx`), dazu H1 „AI-ern Sie noch – oder profitieren Sie schon?“, McKinsey-Satz mit Quelle, Beruhigungssatz, Zertifikatszeile und der Hinweis „anbieterneutral … keine Partnerschaft“ | Logos aus `neural-nautic-live/public/ki-logos/` samt `LIZENZ.txt` nach `public/medien/ki-logos/` |
| L4 | Manifest „Viele Unternehmen probieren KI aus …“ | Farbbalken in Cyan |
| L5 | Kurs, Crew, Schiff und die 7 Schichten | gepinnt, quer laufend; mobil senkrecht im Zickzack |
| L6 | Weiche „Im Unternehmen“ / „Im Projekt“ | Ziele `/ki-im-unternehmen`, `/methode` |
| L7 | **Das Video kommt hierher:** KI-Film (`public/frank-ki/film.mp4`, Poster `film.webp`) als Vollbild-Vorhang, der sich über die Weiche schiebt | Label „KI-generiert“, stumm, lädt erst kurz vor Sichtbarkeit, Pause bei Reduced Motion |
| L8 | Die 8 Leistungen als Karten, die sich öffnen (Kurztext, Ergebnis, Link auf `/leistungen#…`) | Wiederkehrender Scroll-Effekt: **Ganzkörper-Szene** aus `@kern/hero` (Exo dreht sich, je Leistung leuchtet ein Bauteil). Ist sie noch nicht fertig, Karten zuerst ohne |
| L9 | Callout „Werkzeuge“ → `/ki-tool-kompass` | Balken-Reveal |
| L10 | Store-Platz: KI-Potenzialcheck (Calendly) plus die zwei Downloads als Teaser → `/ki-im-unternehmen` | Lead-Formulare kommen in Welle 2 |
| L11 | „Hinter NeuralNautic stehen geprüfte Kompetenz …“, Partner-Laufband (for42, spring.gate, Karlson aus `public/brand/partner/`), 2 Zertifikate | Zertifikatbilder aus `neural-nautic-live/public/zertifikate/` nach `public/medien/` |
| L12 | Fächer → LinkedIn Frank, LinkedIn NN, X; Abschluss „Bereit für den ersten sinnvollen KI-Schritt?“ mit CTA; Footer | |

Den Inhalt der Startseite legst du selbst als Daten in `src/inhalt/start.js` ab (wörtlich aus
`neural-nautic-live/app/page.tsx`).

## Bühne: Bausteine im Kern

Jeder Baustein, den die Startseite braucht, kommt **wiederverwendbar** nach
`funnel-vorlage/src/kern/bausteine/` (Konfiguration statt fester Texte, eigenes CSS mit Variablen für
die Markenfarben, Reduced Motion und Touch eingebaut), beschrieben in `docs/BAUSTEINE.md`:
Kopf, Menü-Vorhang, Fußkarte, Preloader-Maske, Laufband, Logo-Wirbel, Manifest, Quer-Galerie,
Weiche, Video-Vorhang, Karten mit Detailfeld (als zugänglicher Dialog), Callout, Fächer,
Store-Teaser. Künftige Funnels (for42, Keramik, weitere) setzen sich daraus zusammen.

Einspielungen wie bei Lando: Belege in `C:\Users\frank\Projekte\marketing\lando-referenz\berichte\`
(`home-oben.md`, `home-unten.md`, `navigation.md`, `mobil.md`), Video
`screens\home-oben\video\home_komplett_mausrad_1440x900.webm`. Timings übernehmen
(Balken-Reveal ca. 1 s, Hover-Clip 0,75 s `cubic-bezier(.65,.05,0,1)`). Nur Prinzipien, keine
Inhalte, Texte oder Shader von Lando.

## Inhalt: alles aus der Live-Seite als Daten

- Je Live-Seite ein Modul in `src/inhalt/`: `leistungen.js`, `ki-im-unternehmen.js`, `methode.js`,
  `ai-engineering.js`, `ki-tool-kompass.js`, `wissen.js` (inkl. Daten aus `kapital.ts`),
  `ueber-mich.js`, `kontakt.js`, `impressum.js`, `datenschutz.js`, `navigation.js`, `site.js`.
  Wörtlich: Überschriften, Texte, Listen, Zahlen mit Quelle und Datum, CTA-Texte mit Ziel,
  Formularfelder und Einwilligungstexte, Bild- und Dateiverweise.
- Interaktives als Daten plus Regeln: Reifegrad-Check (Dimensionen, Stufen, Deckelung durch Daten und
  Regeln), Ebenenmodell, 3 Stränge, 7 Schichten mit Unterteilen, Architektur-3D (Modell-Daten),
  Chat-Texte (Begrüßung, DSGVO-Hinweis).
- Dateien nach `public/inhalt/` kopieren (Namen behalten): `frank-ki/` (Film, Überwachungs-Video,
  Poster), `zertifikate/`, `architektur/`, `cert-tuev-sued.pdf`, `frank-portrait.webp`, Checkliste-PDF
  falls als Datei vorhanden. Keine Logos (siehe oben). Größen im Bericht nennen.
- `docs/ABNAHME-INHALTE.md`: jede Inhaltseinheit der Live-Seite → Datei und Schlüssel → Zielseite und
  Platz (laut Strukturvorschlag). Markieren, was ein Backend braucht (Kontaktformular über Resend,
  Chat über Mistral, Lead-Downloads per Mail, Welle 2) und was statisch läuft. Nichts darf fehlen.

## Qualität (Bühne, Pflicht)

- Hero sichtbar < 1 s, Startseite ≤ 2 MB bis zum ersten Scrollen (Video und Ganzkörper-Szene laden
  erst kurz vor Sichtbarkeit), 0 Konsolenfehler.
- Reduced Motion: keine Bewegung, alles sofort sichtbar. Ohne WebGL2: Standbild.
- Tastatur komplett, sichtbarer Fokus. Mobil 390 × 844 eigener Ablauf, Querformat nicht sperren.
- Eigener Dev-Server: `npx vite --port 5193 --strictPort` (5191 nutzt der Hero-Agent).
- Prüfen mit Playwright (Chromium, GPU-Flags wie in
  `C:\Users\frank\Projekte\nn-ki-funnel\src\for42\werkzeug\standbilder.py`, Scrollen über
  `window.lenis.scrollTo(y,{immediate:true,force:true})`): Bildschirmfotos aller Plätze Desktop
  1440 × 900 und mobil, Übersichtsbogen `qa/start/_bogen.jpg`, dazu **ein Scroll-Video der ganzen
  Startseite** `qa/start/scroll.webm` (Frank will sehen, wie Bilder und Inhalte eingespielt werden).
  Selbst ansehen, nachbessern, ehrlich bewerten.

## Bericht (kurz, Deutsch)

Was steht, wo Bögen und Video liegen, Übertragungsgröße, offene Punkte, getroffene Annahmen.
