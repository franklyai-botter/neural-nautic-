# Abnahmeliste Inhalte: Live-Seite → Daten → Zielplatz

Stand 14.11.2026. Quelle: `neural-nautic-live` @ `447000b` (nur gelesen). Daten: `src/inhalt/*.js`,
Dateien: `public/inhalt/`. Zielplätze nach `nn-ki-funnel/docs/STRUKTUR-VORSCHLAG.md`, Abschnitt 4
(Plätze L1–L12, Inhaltsseiten) und Abschnitt 6 (Vorlagen Bühne, Beweis, Mensch, Strecke, Lesen).

**Jede Inhaltseinheit der 11 Live-Adressen liegt wörtlich als Daten vor. Fünf Dinge brauchen in
Welle 2 ein Backend, alles andere läuft statisch.**

Spalte **Art**: `S` statisch · `B` braucht Backend (Welle 2) · `X` externer Dienst per Link ·
`R` Regel im Browser (rechnet, sendet nichts) · `!` offener Punkt, siehe Abschnitt 14.

## 0. Prüfung

- Automatischer Abgleich (14.11.2026): Jeder sichtbare Textknoten und jedes Zeichenketten-Literal aus
  `app/**/*.tsx|ts` der Live-Seite wurde im Wortlaut in den Modulen gesucht. Für alle Seiten außer der
  Startseite: **0 fehlende Texte** (übrig bleiben nur Stilangaben und Programmcode).
- Listen, Tabellen und Metadaten sind nicht abgetippt, sondern per Skript aus dem Quelltext
  übernommen. Impressum und Datenschutz sind vollständig per Skript aus dem JSX erzeugt.
- Alle Module laden in Node ohne Fehler (`import('./src/inhalt/<datei>.js')`).
- Logos: Die auf der Live-Seite benutzten Logodateien sind byte-gleich mit `public/brand/` (SHA-1).

## 1. Was in Welle 2 ein Backend braucht

| # | Funktion | Live-Endpunkt | Dienst | Daten |
|---|---|---|---|---|
| B1 | Kontaktformular | `POST /api/contact` | Resend (`RESEND_API_KEY`) | `kontakt.js` → `FORMULAR`, `backend.js` → `KONTAKT_API`, `MAIL` |
| B2 | Download Architektur-Grafik (SVG) mit freiwilligen Kontaktdaten | `POST /api/architektur-download` | Resend | `ki-im-unternehmen.js` → `DOWNLOAD_GRAFIK`, `DOWNLOAD_FORMULAR`; `backend.js` → `LEAD`, `DOWNLOAD_API[0]` |
| B3 | Download KI-Checkliste (PDF) mit freiwilligen Kontaktdaten | `POST /api/checkliste-download` | Resend | `ki-im-unternehmen.js` → `DOWNLOAD_CHECKLISTE`, `DOWNLOAD_FORMULAR`; `backend.js` → `LEAD`, `DOWNLOAD_API[1]` |
| B4 | KI-Chat | `POST /api/chat` | Mistral AI (`MISTRAL_API_KEY`) | `chat.js` → `CHAT`; `backend.js` → `CHAT_API`, `CHAT_SYSTEM` |
| B5 | Weiterleitung `/use-cases` → `/leistungen` (dauerhaft) | Server-Regel | Cloudflare (`_redirects`) | `site.js` → `WEITERLEITUNGEN` |

Statisch bzw. ohne eigenes Backend: Reifegrad-Check (rechnet im Browser), Kapital-Wolke, 3D-Modell,
Videos, Calendly (nur Link; jeder „… buchen“-Knopf zeigt auf `KI_CHECK_BUCHEN`), Virtualbadge (Link),
alle Texte.

## 2. Auf jeder Seite (Rahmen)

| Einheit | Datei → Schlüssel | Zielplatz | Art |
|---|---|---|---|
| Kopf: Stern-Logo, Wortmarke „NeuralNautic“, Burger-Beschriftungen | `navigation.js` → `KOPF` | Kopf (alle Seiten) | S |
| Hauptmenü mit 2 Untermenüs (Leistungen, Methode ▾, KI Tool Kompass ▾, Ausguck, Über mich) | `navigation.js` → `LINKS` | Menü-Vorhang | S |
| CTA „KI-Check buchen“ → Calendly | `navigation.js` → `KOPF.cta`, `site.js` → `KI_CHECK_BUCHEN` | Kopf rechts, mobil Daumenzone | X |
| Footer: Monogramm, Claim, „Berlin · Bundesweit · DACH“ | `navigation.js` → `FUSS` | L12 / Fußkarte | S ! |
| Footer: 3 Spalten (Leistungen 7, Angebote 5, Kontakt 6 Links) | `navigation.js` → `SPALTEN` | Fußkarte | S |
| Footer: „© Jahr · NeuralNautic · in Gründung · Frank Schütt“, Impressum, Datenschutz | `navigation.js` → `FUSS.copyright`, `FUSS.recht` | Fußkarte | S |
| LinkedIn Frank, LinkedIn NeuralNautic, X, for42.ai | `site.js` → `LINKEDIN_URL`, `LINKEDIN_COMPANY_URL`, `X_URL`, `FOR42_URL` | L12 Fächer, Fußkarte | X |
| KI-Chat: Hinweisblase, Knopf, Kopfzeile, DSGVO-Hinweis, Begrüßung, Eingabe, Haftungszeile, Fehlertexte, Regeln | `chat.js` → `CHAT` | alle Seiten, unten rechts | B4 |
| Chat serverseitig: Systemanweisung, Modellliste, Grenzen, Fehlertexte | `backend.js` → `CHAT_SYSTEM`, `CHAT_API` | Worker | B4 |
| Standard-Metadaten (Titel, Beschreibung, Keywords, Open Graph, Twitter-Karte, Viewport) | `site.js` → `META_STANDARD` | `<head>` | S |
| Verifizierungen Google Search Console und Bing | `site.js` → `META_STANDARD.verification` | nur Live-Domain | S ! |
| Sitemap (11 Adressen mit Datum und Priorität), robots (`/api/` gesperrt) | `site.js` → `SITEMAP`, `ROBOTS` | unverändert; Funnel steht auf noindex | S |
| Schriften (Inter Tight, Inter, JetBrains Mono) | `site.js` → `SCHRIFTEN` | Kern | S |
| Neuronaler Hintergrund (nur Grafik, kein Text) | `site.js` → `GLOBALE_BAUTEILE` | entfällt bzw. Gestaltung der Bühne | S |
| Zuordnung Live-Pfad → Funnel-Pfad für alle Dateien | `site.js` → `DATEIEN`, `datei()` | – | S |

## 3. Startseite `/` → Vorlage Bühne (L1–L12)

Die Daten der Startseite schreibt der Agent „Bühne“ in `src/inhalt/start.js`. Hier nur die Abdeckung
(Stand der Datei am 14.11.2026, Nachmittag).

| Einheit der Live-Startseite | Datei → Schlüssel | Zielplatz | Art |
|---|---|---|---|
| Logo-Wirbel mit 61 Modellanbietern, Hinweis „anbieterneutral … keine Partnerschaft“ | `start.js` → `WIRBEL` | L3 | S |
| Foto Frank in der Mitte des Wirbels (`/frank-schuett-quadrat.jpeg`, Titel „Frank Schütt, NeuralNautic“) | nicht in `start.js` (dort steht der Hero in der Mitte) | L2/L3 | S ! |
| H1 „AI-ern Sie noch – oder profitieren Sie schon?“, McKinsey-Satz, Quelle mit Link „Einordnung im Ausguck“ | `start.js` → `EINSTIEG` | L3 | S |
| Knopf „KI-Potenzialcheck buchen“ + Beruhigungssatz | `start.js` → `EINSTIEG`, `BERUHIGUNG` | L3, L10 | X |
| Zertifikatszeile, 2 Link-Knöpfe, 2 Zertifikat-Miniaturen | `start.js` → `EINSTIEG`, `ZERTIFIKATE` | L3 | S |
| „Viele Unternehmen probieren KI aus …“ + Absatz | `start.js` → `MANIFEST` | L4 | S ! |
| Kurs, Crew, Schiff (3 Karten) + Link „Methode im Detail …“ | `start.js` → `METHODE` | L5 | S |
| 7 Schichten (Kurzform) + Vorschaubild + Link „Architektur im Detail …“ | `start.js` → `SCHICHTEN` | L5 | S |
| Drei Wege (Im Unternehmen, Im Projekt, Werkzeuge) + „Alle Leistungen im Überblick →“ | `start.js` → `WEGE` | L6, L9 | S |
| „Hinter NeuralNautic stehen geprüfte Kompetenz …“ + Absatz + Link | `start.js` → `VERTRAUEN` | L11 | S |
| Partner & Netzwerk (for42, spring.gate, Karlson) | `start.js` → `VERTRAUEN` | L11 Laufband | S |
| Abschluss „Bereit für den ersten sinnvollen KI-Schritt?“ + Satz + Knopf + Beruhigung | `start.js` → `ABSCHLUSS` | L10, L12 | X |
| (neu im Funnel) KI-Film, 8 Leistungskarten, Store-Teaser, Kanäle | `start.js` → `FILM`, `LEISTUNGEN`, `STORE`, `KANAELE` | L7, L8, L10, L12 | S |

## 4. `/leistungen` → Karten, die sich öffnen (Helm-Galerie groß)

| Einheit | Datei → Schlüssel | Zielplatz | Art |
|---|---|---|---|
| Metadaten (Titel, Beschreibung, Open Graph, kanonisch) | `leistungen.js` → `META` | `<head>` | S |
| Seitenkopf: Eyebrow, H1, Einleitung | `leistungen.js` → `KOPF` | Seitenkopf | S |
| 8 Leistungen: Titel, Kurztext, Langtext, Häkchenliste, Ergebnis, Zusatzlink (2×) | `leistungen.js` → `LEISTUNGEN` | 8 Karten; Detailfeld mit Langtext, Liste, Ergebnis. Kurzform auf L8 | S |
| Nummer 01–08, Knopf „KI-Potenzialcheck buchen“ je Leistung, Etikett „Ergebnis: “ | `leistungen.js` → `KARTE` | Karte / Detailfeld | X |
| Abschluss „Bereit für den ersten Schritt?“ + Satz + Knopf | `leistungen.js` → `ABSCHLUSS` | Callout am Seitenende | X |

## 5. `/ki-im-unternehmen` → Vorlage Beweis (On Track)

| Einheit | Datei → Schlüssel | Zielplatz | Art |
|---|---|---|---|
| Metadaten | `ki-im-unternehmen.js` → `META` | `<head>` | S |
| Seitenkopf: „Methode · Im Unternehmen“, H1, Einleitung | → `KOPF` | Seitenkopf | S |
| „Woran es hängt“: Titel, Einleitung, Vergleich Wissen / Umsetzung (je 3 Punkte) | → `WORAN_ES_HAENGT` | Einstieg | S |
| Diagramm 80 % / 6 % mit Titel, Beschriftungen, Quelle McKinsey (Datum, Umfrage, Link, Abrufdatum) | → `WORAN_ES_HAENGT.diagramm` | Riesenzahlen 80 % / 6 % | S |
| „Kurs · Crew · Schiff“: Titel, Einleitung, Dreieck (3 Ecken, Mitte „ein Vorhaben“) | → `VORGEHEN`, `VORGEHEN.dreieck` | Kapitel Vorgehen | S |
| 3 Karten Kurs / Crew / Schiff (Name, Sachbegriff, Claim, Text) | → `KCS`, `VORGEHEN.karten` | Kapitel Vorgehen | S |
| Symptomtabelle „Ohne Kurs / Crew / Schiff“ | → `VORGEHEN.symptome` | Tabelle mit Hover | S |
| Reifegrad-Check: Titel, Einleitung | → `REIFEGRAD` | Kapitel Reifegrad; Teaser im Hero-Widget (L2) | S |
| Reifegrad-Check: 6 Dimensionen mit je 4 Stufentexten, 2 davon „TRAGFÄHIGKEIT“ | → `REIFEGRAD_CHECK.dimensionen` | Kapitel Reifegrad | R |
| Reifegrad-Check: 4 Einstiegsstufen mit empfohlenem Schritt | → `REIFEGRAD_CHECK.stufen` | Ergebnisfeld | R |
| Reifegrad-Check: Schwellen, Deckelung durch Daten (c) und Regeln (e), Rechenfunktion | → `REIFEGRAD_CHECK.regeln`, `stufeAus()`, `reifegradAuswerten()` | Logik | R |
| Reifegrad-Check: Zähler, Zwischenstand, Ergebnistexte, Deckel-Hinweis, Knöpfe, Fußnote | → `REIFEGRAD_CHECK.texte` | Ergebnisfeld | R |
| Checkliste zum Herunterladen: Kicker, Titel, Text, Knopf | → `DOWNLOAD_CHECKLISTE` | Download 1; Teaser auf L10 | B3 |
| Download-Formular: Hinweis, 3 freiwillige Felder, Honeypot, Einwilligungstext, Lade- und Fehlertexte, Danke-Zustand | → `DOWNLOAD_FORMULAR` | beide Downloads | B2 B3 |
| Wertschöpfungsstufen: Kicker mit Autor, Titel, Einleitung, 5 Stufen (Breite, Korridor 02–04), Hinweis | → `WERTSCHOEPFUNG` | Kapitel Wertschöpfung | S ! |
| Vorgehensmodell: Titel, Einleitung | → `VORGEHENSMODELL` | Kapitel Vorgehensmodell | S |
| Ebenenmodell (2 Ebenen, Pfeiltexte, Fußzeile), aktiv: Unternehmen | `ebenenmodell.js` → `EBENENMODELL` | über den Strängen; Grundlage der Weiche L6 | S |
| 3 Stränge Kurs / Crew / Logbuch (Titel, Vermerk ISO/IEC 42001, Ergebnis, je 6 Schritte) | → `VORGEHENSMODELL.straenge` | Akkordeon | S |
| Architektur: Kicker, Titel, Einleitung | → `ARCHITEKTUR` | Kapitel Architektur | S |
| 3D-Modell: Szene (7 Ebenen, Knoten, Verbindungen), Renderer, Stylesheet, HTML-Gerüst, Legende, Regler, Hinweise, Vollbild, Bildunterschrift | → `ARCHITEKTUR.modell3d`; `public/inhalt/architektur/szene.json`, `model3d.js`, `model3d.css` | große Szene der Seite | S |
| Grafik zum Herunterladen: Kicker, Titel, Text, Knopf | → `DOWNLOAD_GRAFIK` | Download 2; Teaser auf L10 | B2 |
| 7 Schichten als Übersicht (mit 5a/5b und 3a/3b/3c), Leiste „DSGVO · EU AI Act · NIS2“, Satz mit Link | → `ARCHITEKTUR.uebersicht` | Akkordeon; Kurzform auf L5 | S |
| Vorschaubild der Grafik | → `ARCHITEKTUR.vorschau`; `public/inhalt/architektur/ki-architektur-vorschau.jpg` | L5 | S |
| Übergang „Umsetzung“: Titel, Text, 2 Links | → `UMSETZUNG` | Callout am Seitenende | X |

## 6. `/methode` → Vorlage Strecke (Calendar)

| Einheit | Datei → Schlüssel | Zielplatz | Art |
|---|---|---|---|
| Metadaten | `methode.js` → `META` | `<head>` | S |
| Seitenkopf: „Methode · Im Projekt“, H1, Einleitung | → `KOPF` | Seitenkopf | S |
| Ebenenmodell, aktiv: Projekt | `ebenenmodell.js` → `EBENENMODELL`, `methode.js` → `EBENENMODELL_AKTIV` | unter dem Kopf | S |
| 5 Phasen (Nummer, Titel, Text, Ergebnis) | → `PHASEN`, `PHASE_DARSTELLUNG` | Strecke mit 5 nummerierten Kurven | S |
| 6 Prinzipien + Überschrift | → `PRINZIPIEN` | Liste mit Hover | S |
| Abschluss „Bereit, gemeinsam zu starten?“ + Knopf | → `ABSCHLUSS` | Callout | X |

## 7. `/ai-engineering` → Vorlage Strecke (Calendar)

| Einheit | Datei → Schlüssel | Zielplatz | Art |
|---|---|---|---|
| Metadaten | `ai-engineering.js` → `META` | `<head>` | S |
| Seitenkopf: Eyebrow, H1, Einleitung | → `KOPF` | Seitenkopf | S |
| „Der Unterschied“: Titel, Text, Vergleichstabelle (5 Zeilen × Vibe Coding / AI Engineering), Nachsatz | → `UNTERSCHIED` | Tabelle mit Hover | S |
| „Wann es Engineering braucht“: Titel, Text, 4 Risikoklassen (4 Spalten, 2 hervorgehoben), 2 Hinweise, Satz mit Link | → `RISIKOKLASSEN` | Tabelle mit Hover | S |
| „So arbeiten wir“: Titel, Text, 5 Stationen (Nummer, Titel, Text, Ergebnis) | → `STATIONEN` | Strecke mit 5 Kurven | S |
| „Was Sie bekommen“: Titel, Text, 4 Ergebniskarten, Verweis auf die Architektur | → `ERGEBNIS` | 4 Karten | S |
| Abschluss „Sie haben einen Prototyp …?“ + Satz + „Lösung anfragen“ | → `ABSCHLUSS` | Callout → `/kontakt` | S |

## 8. `/ki-tool-kompass` → Vorlage Strecke (Calendar-Liste)

| Einheit | Datei → Schlüssel | Zielplatz | Art |
|---|---|---|---|
| Metadaten | `ki-tool-kompass.js` → `META` | `<head>` | S |
| Seitenkopf: Eyebrow, H1, Einleitung | → `KOPF` | Seitenkopf | S |
| 11 Werkzeugkategorien + Überschrift | → `KATEGORIEN` | Zeilen mit Hover | S |
| 11 Bewertungskriterien (Nummer, Frage, Erläuterung) + Überschrift | → `KRITERIEN` | Akkordeon | S |
| Teaser „Kaufen oder bauen“ → `/ai-engineering` | → `BRUECKE` | Callout | S |
| Abschluss „Werkzeugauswahl professionell begleiten lassen.“ + Satz + Knopf | → `ABSCHLUSS` | Callout → `/kontakt`; Kurzform auf L9 | S |

## 9. `/wissen` (Ausguck) → Vorlage Beweis (Kennzahlen)

| Einheit | Datei → Schlüssel | Zielplatz | Art |
|---|---|---|---|
| Metadaten | `wissen.js` → `META` | `<head>` | S |
| Seitenkopf: „Ausguck“, H1, Einleitung | → `KOPF` | Seitenkopf | S |
| Überschrift „Aktuelle Einordnungen“ | → `LISTE` | Liste | S |
| 4 Einordnungen (Rubrik, Stand, Titel, Befund, Folge, Quelle, Link) | → `EINORDNUNGEN`, `EINORDNUNG_DARSTELLUNG` | Liste mit Stand und Quelle; Markt-Zahl als Riesenzahl 1.248 Mrd. USD | S |
| Kapital-Wolke: 15 Quartale, 2 Vergleichsgrößen | → `KAPITAL_QUARTALE`, `KAPITAL_VERGLEICHE` | Saisontabelle / Grafik | S |
| Kapital-Wolke: Texte, Achse, Knopf, Aria-Text, Zeichenregeln | → `KAPITAL_WOLKE`, `kapitalKumuliert()` | Grafik | R |
| Quellenvermerke zu den Zahlen (im Live-Code als Kommentar) | → `KAPITAL_QUELLENVERMERK` | Quellenangabe | S |

## 10. `/ueber-mich` → Vorlage Mensch (Off Track)

| Einheit | Datei → Schlüssel | Zielplatz | Art |
|---|---|---|---|
| Metadaten inkl. Open-Graph-Profilbild | `ueber-mich.js` → `META`; `public/inhalt/og/frank-schuett.jpg` | `<head>` | S |
| JSON-LD Person (Name, Rolle, sameAs, 2 Zertifikate, Themen) | → `PERSON_JSON_LD` | `<head>` | S |
| Seitenkopf: „Über mich“, H1, Einleitung | → `KOPF` | Seitenkopf | S |
| KI-Film (Video, Poster, Beschreibungen, „KI-generiert“, Abspielregeln) | → `FILM`; `public/inhalt/frank-ki/film.mp4`, `film.webp` | Film oben; auch L7 der Startseite | S |
| Überwachungs-Karte: Video, Poster, Porträt, Gesichtsspur, „FACE ID: MATCH“, Abgleich-Panel, 4 Skills, REC, „KI-generiert“, Uhr | → `HUD`; `public/inhalt/frank-ki/ueberwachung.mp4`, `ueberwachung.webp`, `public/inhalt/frank-portrait.webp` | HUD-Karte | S |
| Name, Rolle, Ort | → `PROFIL` | unter der Karte | S |
| 3 Absätze „Ich unterstütze …“ | → `PROFIL.absaetze` | Einstieg | S |
| „Was mich auszeichnet“ + 6 Stärken | → `PROFIL.staerken` | 6 quer laufende Kapitel | S |
| Knopf „Gespräch anfragen“, LinkedIn-Knopf „Auf LinkedIn folgen“ | → `PROFIL.cta`, `LINKEDIN_KNOPF` | Abschluss | X |
| Zertifikate: Eyebrow, Titel, Satz | → `ZERTIFIKATE` | Kapitel Zertifikate (`#zertifikate`) | S |
| Zertifikat TÜV SÜD: Aussteller, Ebene, Titel, Text, Inhalte, Datum und Nummer, Bild, PDF | → `ZERTIFIKATE.karten[0]`; `public/inhalt/zertifikate/tuev-sued-vorschau.webp`, `public/inhalt/cert-tuev-sued.pdf` | Titel mit Lorbeer; L11 | S |
| Zertifikat Neurawork: Aussteller, Ebene, Titel, Text, Programm, Inhalte, Datum, Bild, Virtualbadge-Link | → `ZERTIFIKATE.karten[1]`; `public/inhalt/zertifikate/neurawork-vorschau.webp` | Titel mit Lorbeer; L11 | X |

## 11. `/kontakt` → Footer-Karte mit Formular

| Einheit | Datei → Schlüssel | Zielplatz | Art |
|---|---|---|---|
| Metadaten | `kontakt.js` → `META` | `<head>` | S |
| Seitenkopf: „Kontakt“, H1, Einleitung | → `KOPF` | Seitenkopf | S |
| Formular: 6 Felder mit Beschriftung, Pflicht, Platzhalter; 7 Anliegen; Knopf, Ladetext, Fehlertext, Datenhinweis | → `FORMULAR`, `ANLIEGEN` | Leuchtrand-Karte | B1 |
| Danke-Zustand | → `DANKE` | ersetzt das Formular | B1 |
| Serverseitig: Pflichtfelder, Betreff, Mailtext, Empfänger, Fehlertexte | `backend.js` → `KONTAKT_API`, `MAIL` | Worker | B1 |

## 12. `/impressum` und `/datenschutz` → Vorlage Lesen

| Einheit | Datei → Schlüssel | Zielplatz | Art |
|---|---|---|---|
| Impressum: Metadaten (noindex), Kopf, 10 Abschnitte (Anbieter, Kontakt, Verantwortlich, Tätigkeit, USt-ID, Streitbeilegung, Haftung Inhalte, Haftung Links, Urheberrecht, Marken), Link zur Datenschutzerklärung | `impressum.js` → `META`, `KOPF`, `ABSCHNITTE`, `SCHLUSSLINKS` | `/impressum` | S ! |
| Datenschutz: Metadaten (noindex), Kopf, 25 Abschnitte (1 bis 23, dazu 11.1 Calendly und 11.2 Google Meet), 2 Listen, alle Anbieterangaben und Links, Link zum Impressum | `datenschutz.js` → `META`, `KOPF`, `ABSCHNITTE`, `SCHLUSSLINKS` | `/datenschutz` | S ! |
| Vermerke aus dem Live-Code („Entwurf 29.10.2026, vor Livegang rechtlich prüfen lassen“, Prüfstand der Anbieterangaben) | `impressum.js`, `datenschutz.js` → `VERMERKE` | intern | – |

## 13. Dateien in `public/inhalt/`

| Datei | Größe | Herkunft (Live) | genutzt von |
|---|---|---|---|
| `frank-ki/film.mp4` | 3.430.090 B (3,27 MB) | `public/frank-ki/` | `/ueber-mich`, L7 |
| `frank-ki/film.webp` | 30.488 B | `public/frank-ki/` | Poster |
| `frank-ki/ueberwachung.mp4` | 1.590.706 B (1,52 MB) | `public/frank-ki/` | HUD-Karte |
| `frank-ki/ueberwachung.webp` | 107.644 B | `public/frank-ki/` | Poster HUD |
| `frank-portrait.webp` | 65.308 B | `public/` | HUD-Abgleich, JSON-LD |
| `cert-tuev-sued.pdf` | 519.077 B | `public/` | Zertifikat TÜV SÜD |
| `zertifikate/tuev-sued-vorschau.webp` | 39.512 B | `public/zertifikate/` | Zertifikate |
| `zertifikate/neurawork-vorschau.webp` | 44.430 B | `public/zertifikate/` | Zertifikate |
| `architektur/ki-architektur-vorschau.jpg` | 148.726 B | `public/architektur/` | Vorschau der Grafik |
| `architektur/szene.json` | 6.718 B | `public/architektur/` | 3D-Modell, Daten |
| `architektur/model3d.js` | 13.882 B | `public/architektur/` | 3D-Modell, Renderer |
| `architektur/model3d.css` | 122.431 B | `public/architektur/` | 3D-Modell, Stil (Schriften eingebettet) |
| `og/frank-schuett.jpg` | 82.762 B | `public/og/` | Open Graph `/ueber-mich` |
| `downloads/NeuralNautic_KI-Checkliste_Reifegrad-und-Risiko.pdf` | 1.215.469 B (1,16 MB) | `tools/checkliste/` (byte-gleich mit dem, was die Live-Route ausliefert) | Download B3 |
| `downloads/NeuralNautic_KI-Architektur_7-Schichten.svg` | 266.542 B | aus `app/api/architektur-download/grafik.generated.ts` herausgelöst (Inhalt unverändert) | Download B2 |

Summe: 15 Dateien, rund 7,7 MB. Nicht kopiert: alle Logos (`logo-star.png`, `logo-monogram.png`,
`partner/*`, Favicons – liegen byte-gleich in `public/brand/`), `og/neuralnautic-og.png` (enthält
Logos), `ki-logos/` und `frank-schuett-quadrat.jpeg` (Startseite, Bereich des Agenten „Bühne“).

## 14. Offene Punkte

1. **Wertschöpfungsstufen (`WERTSCHOEPFUNG`, `rechteOffen: true`):** Der Kicker nennt einen externen
   Autor. Wortlaut unverändert übernommen. Rechte klären, bevor die Stufen ins neue Design gehen;
   bis dahin nicht bauen oder ohne Namensnennung nicht verwenden.
2. **Downloads liegen jetzt in `public/`:** Auf der Live-Seite gibt es beide Unterlagen nur über die
   Route (das PDF liegt dort bewusst nicht in `public/`). Unter `public/inhalt/downloads/` sind sie
   direkt abrufbar. Für Welle 2 entscheiden: so lassen (die Angaben sind ohnehin freiwillig) oder die
   Dateien in den Worker verlegen.
3. **Open-Graph-Bild der Startseite fehlt:** `og/neuralnautic-og.png` enthält NN-Monogramm und
   for42-Wortmarke und wurde deshalb nicht kopiert. Für den Funnel neu aus `public/brand/` erzeugen.
4. **Rechtstexte sind laut Live-Code ein Entwurf** („vor Livegang rechtlich prüfen lassen“). Die
   Datenschutzerklärung beschreibt Hosting, Resend, Mistral, Calendly und Google Meet der Live-Seite.
   Weicht der Funnel davon ab (andere Subdomain, Funktionen ohne Backend), muss sie angepasst werden.
5. **Verifizierungen** (Google, Bing) gelten nur für `neuralnautic.de`, nicht für eine Subdomain.
6. **Footer-Claim** „Für den Mittelstand gebaut. Für regulierte Branchen gehärtet.“ steht wortgleich
   bei for42 (Hinweis aus dem Strukturvorschlag).
7. **Startseite, Abweichungen in `start.js` gegenüber der Live-Seite** (Bereich „Bühne“): Im
   Manifest-Titel ist „selten“ mit `<em>` hervorgehoben (auf der Live-Seite nicht). Das Foto
   `frank-schuett-quadrat.jpeg` aus der Wirbel-Mitte und sein Titel kommen nicht vor (dort steht
   jetzt der Hero).
8. **Anker auf `/leistungen`:** Die Live-Seite hat keine Sprungziele je Leistung. Der Platz L8 will
   auf `/leistungen#…` verlinken, die Anker müssen in Welle 2 festgelegt werden.
9. **Nicht übernommen, weil auf der Live-Seite nirgends eingebunden:** die Komponenten `Hero.tsx`,
   `FeaturedCollection.tsx`, `JournalList.tsx`, `AtelierNote.tsx`, `WerkzeugLaufband.tsx` samt
   `public/werkzeug-logos/`, außerdem `bg-neural-network.png`, `brand-key-visual.png`,
   `logo-monogram-script.png` und `partner/for42-wordmark-nn.svg`.
10. **Personen:** In den Daten-Modulen erscheint als Person Frank. Einzige weitere Namensnennung dort
    ist der Autor der Wertschöpfungsstufen (Punkt 1). **Das Checklisten-PDF selbst nennt in seinen
    Quellenangaben einen for42-Kollegen als Urheber des Readiness-Checks** (unverändert kopierte
    Datei). Vor dem Einsatz im Funnel entscheiden, ob das PDF so bleibt.
