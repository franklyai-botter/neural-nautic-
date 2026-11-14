# Brief: NeuralNautic-Funnel, Welle 2 – alle Kapitelseiten (14.11.2026)

Frank: „Mir fehlen die Inhalte von der großen Website, ich will alles drauf haben, über die
Verlinkungen. Ich habe die Pyramide nicht, das Dreieck nicht, den Download nicht und auch das
3D-Modell drehbar nicht.“ → Jede Seite der Live-Seite `neural-nautic-live` bekommt ihre Kapitelseite
im Funnel, **vollständig**, unter derselben Adresse, im Lando-Stil der Startseite.

## Grundlagen (lesen)

- Inhalte liegen wörtlich als Daten in `src/inhalt/*.js`, Zuordnung in `docs/ABNAHME-INHALTE.md` (jede
  Einheit → Zielseite). **Die Abnahmeliste ist die Pflicht: nichts darf fehlen.**
- Live-Seite zum Vergleich (nur lesen): `C:\Users\frank\Projekte\neural-nautic-live\app\<seite>\page.tsx`
  und `app\components\*.tsx` (z. B. `ReifegradCheck.tsx`, `EbenenModell.tsx`, `Architektur3D.tsx`,
  `ArchitekturDownload.tsx`, `NnHud.tsx`, `NnFilm.tsx`).
- Seitenvorlagen und Techniken: `C:\Users\frank\Projekte\nn-ki-funnel\docs\STRUKTUR-VORSCHLAG.md`
  Abschnitte 4 und 6 (Beweis, Mensch, Strecke, Lesen; Karten, die sich öffnen; Quer laufend; Akkordeon;
  „Weiter zum nächsten Kapitel“). Bausteine: `funnel-vorlage/docs/BAUSTEINE.md`, Hero/Szene/Netz:
  `docs/HERO.md`. Referenz für Rahmen und Stil: Startseite `index.html` + `src/funnel/main.js`.
- Marke NN: `ObsidianVault/Ressourcen/Brand-Assets/neuralnautic/BRAND.md`. Logos nur aus `public/brand/`.

## Aufbau jeder Kapitelseite

- Datei `<seite>/index.html` (z. B. `ki-im-unternehmen/index.html`), Skript `src/seiten/<seite>.js`,
  Stil `src/seiten/<seite>.css` (gemeinsames gern `src/seiten/gemeinsam.css`, nur der Agent mit Paket A
  legt es an, andere lesen).
- Rahmen wie Startseite: Kopf mit „KI-Check buchen“, Menü-Vorhang, Fußkarte, Seitenwechsel, Prefetch,
  aus den Bausteinen zusammengesetzt (Muster aus `src/funnel/main.js` lesen, nicht ändern).
  Navigation aus `src/inhalt/navigation.js`.
- Seitenkopf mit H1 und Einleitung (wörtlich), am Ende großer Querverweis zum nächsten Kapitel.
- Je Seite **eine** große Effekt-Szene (Pin/WebGL), sonst Einspielungen (Balken, Clip, Parallaxe).
- Interaktives voll funktionsfähig: Reifegrad-Check (Baustein `check`), drehbares 3D-Architekturmodell
  (Dateien `public/inhalt/architektur/model3d.js`, `model3d.css`, `szene.json` aus der Live-Seite;
  Verhalten wie `Architektur3D.tsx`, mit Maus/Finger drehbar, Regler/Legende), Dreieck-Grafik
  (Kurs/Crew/Schiff), Wertschöpfungsstufen (Pyramide/Stufen, mit Quellenangabe wie live),
  Ebenenmodell, aufklappbare Stränge, Kapital-Diagramm auf `/wissen`.
- **Downloads funktionieren:** Formular wie live (Name, E-Mail, Telefon freiwillig, Einwilligung
  Pflicht, Honeypot); nach Absenden startet der Download der Datei aus `public/inhalt/downloads/`.
  Der Versand der Lead-Mail kommt später mit dem Server-Teil; im Code als klar markierte Stelle
  vorbereiten, nichts an externe Dienste senden.
- Kontaktformular: Felder wie live, Absenden zeigt vorerst den Danke-Zustand, Versand kommt mit dem
  Server-Teil (markierte Stelle). Chat: Platzhalter-Knopf mit Hinweis, kommt mit dem Server-Teil.
- Bilder: nur Franks Bilder aus `figuren.json` bzw. `public/bilder/`, Label „KI-generiert“.

## Pakete (je ein Agent, nur eigene Dateien)

| Paket | Seiten |
|---|---|
| A | `/ki-im-unternehmen` (größte Seite: Vergleich, 80/6-Diagramm, Dreieck, Symptomtabelle, Reifegrad-Check, Wertschöpfung, Ebenenmodell, 3 Stränge, 3D-Modell, 7 Schichten, 2 Downloads), `/methode` |
| B | `/leistungen` (8 Leistungen komplett mit Ankern `#<anker>` wie auf der Startseite verlinkt), `/ai-engineering`, `/ki-tool-kompass` |
| C | `/wissen` (Ausguck, Kapital-Diagramm), `/ueber-mich` (Film, HUD-Karte, 6 Stärken, Zertifikate, Ganzkörper-Szene), `/kontakt`, `/impressum`, `/datenschutz` |

## Regeln

- Schreiben nur in den eigenen Seitenordnern und `src/seiten/<eigene>.*` (Paket A zusätzlich
  `src/seiten/gemeinsam.*`). Nicht ändern: Startseite (`index.html`, `src/funnel/**`, `src/inhalt/start.js`),
  `src/inhalt/*.js` (nur lesen), Bausteine in `funnel-vorlage` (Bedarf melden), `vite.config.js`
  (Seiten sind dort schon eingetragen), `package.json`.
- Kein npm install, keine Commits, keine verändernden Git-Befehle, nichts an externe Dienste.
- Texte wörtlich, nichts erfinden. Dev-Server läuft auf http://localhost:5193/ (Seiten unter
  `/<seite>/`).
- Qualität: 0 Konsolenfehler, Reduced Motion, Tastatur, mobil 390×844, keine Inhalte außerhalb des
  Fensters bei 1440/1920/2560. Bildschirmfotos je Seite, Abgleich gegen ABNAHME-INHALTE.md (jede
  Einheit abhaken). Bericht kurz: Seiten, Abnahme-Ergebnis, Lücken.
