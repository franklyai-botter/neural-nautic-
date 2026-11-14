// /ki-im-unternehmen als Daten. Quelle: neural-nautic-live @ 447000b,
// app/ki-im-unternehmen/page.tsx, app/components/ReifegradCheck.tsx, ArchitekturDownload.tsx,
// Architektur3D.tsx, architektur3d.generated.ts. Wörtlich, in der Reihenfolge der Live-Seite.
import { KI_CHECK_BUCHEN } from "./site.js";
export { EBENENMODELL } from "./ebenenmodell.js";

export const ROUTE = "/ki-im-unternehmen";

export const META = {
  title: "KI im Unternehmen: Wertschöpfung, Vorgehen, Architektur | NeuralNautic",
  alternates: { canonical: "/ki-im-unternehmen" },
  description: "Wie KI im Mittelstand messbar wirkt: die richtige Wertschöpfungsstufe, ein festes Vorgehen aus Strategie, Befähigung und Architektur und eine DSGVO-konforme KI-Architektur.",
  openGraph: { title: "KI im Unternehmen: Wertschöpfung, Vorgehen, Architektur", description: "Wie KI im Mittelstand messbar wirkt: die richtige Wertschöpfungsstufe, ein festes Vorgehen und eine DSGVO-konforme KI-Architektur.", url: "/ki-im-unternehmen" },
};

// Reihenfolge der Abschnitte auf der Live-Seite (Namen = Exporte dieser Datei).
export const REIHENFOLGE = ["KOPF", "WORAN_ES_HAENGT", "VORGEHEN", "REIFEGRAD", "WERTSCHOEPFUNG", "VORGEHENSMODELL", "ARCHITEKTUR", "UMSETZUNG"];

// 0 Antwort zuerst
export const KOPF = {
  eyebrow: "Methode · Im Unternehmen",
  h1: "Vom KI-Hype zur kontrollierten Umsetzung: mit Kurs, Crew und Schiff",
  text: "Ob sich KI für Ihr Unternehmen lohnt, entscheidet kein einzelnes Werkzeug. Es braucht einen klaren Kurs, eine Crew, die mitzieht, und ein seetüchtiges Schiff. Fehlt eines davon, bleibt es beim Experiment.",
};

// 1 Situation und Komplikation
export const WORAN_ES_HAENGT = {
  kicker: "Woran es hängt",
  titel: "Am Wissen über KI fehlt es kaum noch, am Ergebnis fast überall",
  intro: "Kurse, Videos und Sammlungen von Anweisungen (Prompts) gibt es rund um die Uhr und meist kostenlos. Viele Mitarbeitende arbeiten mit KI schon schneller. Im Betriebsergebnis kommt das bei den wenigsten an.",
  // Zwei Karten nebeneinander, die zweite (Umsetzung) ist hervorgehoben. Vor jedem Punkt steht „– “.
  vergleich: [
    { titel: "Wissen", akzent: false, punkte: ["Kurse, Bücher, Videos und Anweisungen", "jederzeit verfügbar, meist kostenlos", "Ergebnis: einzelne Mitarbeitende arbeiten schneller"] },
    { titel: "Umsetzung", akzent: true, punkte: ["ein Vorgehen, das zu Ihrem Geschäft passt", "eigene Systeme im laufenden Betrieb", "Ergebnis: messbarer Beitrag zum Unternehmensergebnis"] },
  ],
  punktVor: "– ",
  // Diagramm: Vergleich zweier Werte, Akzent auf dem Wert, um den es geht.
  diagramm: {
    titel: "Acht von zehn spüren den Nutzen von KI, aber nur sechs von hundert sehen ihn deutlich im Ergebnis",
    balken: [
      { v: 80, anzeige: "80 %", label: "berichten, dass KI ihre persönliche Produktivität verbessert hat", akzent: false },
      { v: 6, anzeige: "6 %", label: "schreiben mindestens 5 % ihres EBIT der KI zu und sehen deutlichen Nutzen", akzent: true },
    ],
    quelle: {
      teile: [
        "Quelle: McKinsey & Company, „The state of AI in 2026: On the road to ROI“, 25.08.2026. Online-Umfrage unter 1.719 Teilnehmenden in 97 Ländern, 04.05. bis 08.06.2026. ",
        { text: "mckinsey.com", href: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai", extern: true },
        ", abgerufen am 19.10.2026.",
      ],
    },
  },
};

// Unser Modell: Kurs, Crew, Schiff. Sachbegriff jeweils darunter.
// name, fach, claim, desc (Karte) und fehlt (Symptom-Tabelle „Ohne …“).
export const KCS = [
  { name: "Kurs",   fach: "Strategie",                claim: "Wohin, und was lohnt sich?",      desc: "Ziele, Engpässe und Anwendungsfälle werden nach Wirkung bewertet. Ergebnis ist ein Fahrplan, den Geschäftsführung und Fachbereiche mittragen.",
    fehlt: "Systeme ohne Nutzen: Es wird gebaut, was technisch geht, nicht was sich rechnet." },
  { name: "Crew",   fach: "Menschen und Befähigung",  claim: "Nutzung statt bloßem Wissen.",    desc: "Führungskräfte, Multiplikatoren und Teams werden so eingebunden und geschult, dass die neuen Abläufe im Alltag tatsächlich genutzt werden. Der Betriebsrat ist früh an Bord.",
    fehlt: "Systeme ohne Nutzer: Die Lösung steht, aber niemand arbeitet damit, oft aus Sorge um die eigene Rolle." },
  { name: "Schiff", fach: "KI-Architektur",           claim: "Seetüchtig statt Demo.",          desc: "Systeme, die stabil laufen, sicher sind und sich in Ihre bestehende IT einfügen, mit klarer Verantwortung für den Betrieb.",
    fehlt: "Strategie bleibt Papier: Die Ideen sind gut, aber nichts davon läuft sicher im Betrieb." },
];

// 2 Antwort: Kurs, Crew, Schiff
export const VORGEHEN = {
  id: "vorgehen",
  kicker: "Kurs · Crew · Schiff",
  titel: "KI kommt in die Umsetzung, wenn Kurs, Crew und Schiff gleichzeitig stimmen",
  intro: "Die Gründe, warum KI im Ergebnis nicht ankommt, sind fast immer dieselben: kein klarer Kurs, eine Crew, die nicht mitzieht, oder ein Schiff, das nicht seetüchtig ist. Deshalb planen wir alle drei als ein Vorhaben, nicht nacheinander.",
  // Dreieck als SVG (viewBox 0 -50 600 350), drei Eckpunkte mit Name und Sachbegriff, in der Mitte der Text.
  dreieck: {
    ariaLabel: "Dreieck aus Kurs (Strategie), Crew (Menschen und Befähigung) und Schiff (KI-Architektur)",
    viewBox: "0 -50 600 350",
    polygon: "300,40 90,210 510,210",
    punkte: [{ x: 300, y: 40, t: "Kurs", s: "Strategie" }, { x: 90, y: 210, t: "Crew", s: "Befähigung" }, { x: 510, y: 210, t: "Schiff", s: "Architektur" }],
    mitte: "ein Vorhaben",
  },
  karten: KCS,
  // Selbsttest: woran man erkennt, was fehlt. Je Zeile: „Ohne {name}“ | {fehlt}
  symptome: {
    titel: "Fehlt eines der drei, sieht man es an typischen Symptomen",
    ariaLabel: "Was fehlt und woran man es erkennt",
    zeilenkopfVor: "Ohne ",
    zeilen: KCS.map((d) => ({ kopf: `Ohne ${d.name}`, text: d.fehlt })),
  },
};

// --- Reifegrad-Check (ReifegradCheck.tsx) -------------------------------------
// Sechs Dimensionen, je 0–3. Stufe aus dem Durchschnitt, gekappt durch die schwächere der
// beiden Querschnittsdimensionen Daten und Governance. Läuft nur im Browser, nichts wird gesendet.
// key, title, quer (true = Querschnittsdimension, Etikett „TRAGFÄHIGKEIT“), levels[0..3]
const DIMENSIONEN = [
  { key: "a", title: "Strategie und Rückendeckung", levels: [
    "Keine KI-Ausrichtung, KI passiert nebenbei in der IT.",
    "Interesse und ein informeller Fürsprecher, aber keine Ziele und kein Budget.",
    "Benannter Verantwortlicher in der Geschäftsführung, Ziele, Budget und Fahrplan.",
    "KI ist Chefsache und im Kerngeschäft verankert, Investitionen werden gesteuert.",
  ] },
  { key: "b", title: "Anwendungsfälle und Nutzen", levels: [
    "Nur Gespräche, kein Anwendungsfall, vielleicht private Nutzung im Verborgenen.",
    "Ein bis zwei Experimente ohne belastbaren Nutzen.",
    "Mindestens ein Anwendungsfall im Betrieb, mit Ausgangswert und gemessenem Nutzen.",
    "Ein Portfolio priorisierter Anwendungsfälle mit laufender Erfolgsmessung.",
  ] },
  { key: "c", title: "Daten und Plattform", quer: true, levels: [
    "Datenlage unklar, keine Übersicht, Insellösungen.",
    "Grobe Übersicht für die ersten Anwendungsfälle, Daten werden von Hand zusammengeführt.",
    "Datenqualität je wichtigem Anwendungsfall dokumentiert, erste wiederverwendbare Datenbestände.",
    "Gepflegte, wiederverwendbare Daten auf einer gemeinsamen Plattform mit Überwachung.",
  ] },
  { key: "d", title: "Menschen, Befähigung und Mitbestimmung", levels: [
    "Keine Schulung, kein Einbezug des Betriebsrats, eher Sorge oder Ablehnung.",
    "Erste Schulungen, einzelne Vorreiter, Betriebsrat informell im Bild.",
    "Breite KI-Kompetenz, Schlüsselrollen besetzt, Betriebsrat früh eingebunden.",
    "KI wird selbstverständlich genutzt, eigenes Team, Rahmenvereinbarung mit dem Betriebsrat.",
  ] },
  { key: "e", title: "Regeln, Datenschutz und EU AI Act", quer: true, levels: [
    "Keine Leitplanken, unklar, welche Werkzeuge und Daten erlaubt sind.",
    "Erste Regeln zu erlaubten Werkzeugen und Daten, EU AI Act ist bekannt.",
    "Je Anwendungsfall Einstufung nach EU AI Act und Datenschutzprüfung, klare Freigaben.",
    "Formale, einheitliche Governance für das ganze Unternehmen, dokumentiert.",
  ] },
  { key: "f", title: "Betrieb und Skalierung", levels: [
    "Kein Betrieb, alles bleibt Projekt oder Einzellösung.",
    "Erste Piloten werden betreut, aber ohne festes Betriebsmodell.",
    "Feste Rollen, Überwachung und Eskalation, erste Anbindung an Kernsysteme.",
    "Unternehmensweiter Betrieb mit zentralem Team und Ansprechpartnern in den Bereichen.",
  ] },
];

// n, name, schritt (empfohlener erster Schritt)
const EINSTIEGSSTUFEN = [
  { n: 1, name: "Grundlagen",  schritt: "Ein bis drei Leuchtturm-Anwendungsfälle mit hoher Wirkung und guter Machbarkeit wählen, die Datenlage grob erfassen, einen Verantwortlichen und erste Regeln festlegen. Ziel: ein Nachweis in wenigen Wochen." },
  { n: 2, name: "Aufbau",      schritt: "Aus dem Nachweis eine Bewegung machen: Führung und Belegschaft praktisch einbinden statt mit Folien, KI-Kompetenz aufbauen, den Betriebsrat informieren, Erfolge sichtbar machen." },
  { n: 3, name: "Etabliert",   schritt: "Bewusst einen Schritt zurück in die Strategie: wenige Anwendungsfälle priorisieren, Daten aufbereiten, Einstufung nach EU AI Act mit klaren Freigaben, Betriebsmodell festlegen." },
  { n: 4, name: "Fortgeschritten", schritt: "In die Breite bringen: festes Betriebsmodell mit zentralem Team, Prozesse neu gestalten, durchgängige Erfolgsmessung, Verantwortung im eigenen Haus." },
];

// Stufe aus dem Durchschnitt (wie auf der Live-Seite).
export function stufeAus(avg) {
  if (avg <= 0.8) return 1;
  if (avg <= 1.6) return 2;
  if (avg <= 2.4) return 3;
  return 4;
}

// Auswertung wie auf der Live-Seite. werte = { a: 0..3, b: …, c: …, d: …, e: …, f: … }
export function reifegradAuswerten(werte) {
  const alle = DIMENSIONEN.every((d) => werte[d.key] !== undefined);
  const offen = DIMENSIONEN.filter((d) => werte[d.key] === undefined).length;
  const summe = DIMENSIONEN.reduce((s, d) => s + (werte[d.key] ?? 0), 0);
  const avg = Math.round((summe / DIMENSIONEN.length) * 10) / 10;
  const vorlaeufig = stufeAus(avg);
  const kappWert = Math.min(werte.c ?? 0, werte.e ?? 0);
  const kappStufe = kappWert + 1;
  const finale = Math.min(vorlaeufig, kappStufe);
  const gekappt = finale < vorlaeufig;
  return { alle, offen, avg, vorlaeufig, finale, gekappt, stufe: EINSTIEGSSTUFEN[finale - 1] };
}

export const REIFEGRAD_CHECK = {
  dimensionen: DIMENSIONEN,
  stufen: EINSTIEGSSTUFEN,
  regeln: {
    werte: [0, 1, 2, 3],
    // Durchschnitt aller sechs Dimensionen, auf eine Nachkommastelle gerundet.
    schwellen: [{ bis: 0.8, stufe: 1 }, { bis: 1.6, stufe: 2 }, { bis: 2.4, stufe: 3 }, { bis: 3, stufe: 4 }],
    // Deckelung: Die Stufe ist höchstens (kleinerer Wert aus „Daten und Plattform“ (c) und
    // „Regeln, Datenschutz und EU AI Act“ (e)) + 1.
    deckelDimensionen: ["c", "e"],
    deckel: "min(Stufe aus Durchschnitt, min(c, e) + 1)",
    // Das Ergebnis erscheint erst, wenn alle sechs Dimensionen bewertet sind.
    speicherung: "Läuft nur im Browser, nichts wird gesendet oder gespeichert.",
  },
  texte: {
    // Zähler vor jedem Titel: „1/6“ bis „6/6“
    zaehler: (i) => `${i + 1}/6`,
    querEtikett: "TRAGFÄHIGKEIT",
    offen: (n) => `Noch ${n} von 6 Dimensionen offen. Das Ergebnis erscheint hier.`,
    // Durchschnitt mit deutschem Komma, z. B. „1,7“
    ergebnisKopf: (avg) => `Ihre Einstiegsstufe · Durchschnitt ${avg.toLocaleString("de-DE")}`,
    ergebnisStufe: (stufe) => `Stufe ${stufe.n}: ${stufe.name}`,
    gekappt: (vorlaeufig, finale) => `Nach dem Durchschnitt wäre es Stufe ${vorlaeufig}. Daten oder Regeln tragen das aber noch nicht, deshalb Stufe ${finale}. Erst diese Grundlage nachziehen, dann den nächsten Schritt gehen.`,
    schrittLabel: "Empfohlener erster Schritt:",
    cta: { text: "Ergebnis gemeinsam besprechen", href: "/kontakt" },
    neu: "Neu beginnen",
    fussnote: "Grundlage: for42-Reifegrad-Diagnostik, angelehnt an etablierte Reifegradmodelle und bewusst auf sechs Dimensionen reduziert. Daten sowie Regeln und Datenschutz begrenzen die Stufe nach oben: Ohne diese Grundlage bleibt jede Skalierung im Pilotstadium. Eine Selbsteinschätzung, kein Audit. Die Stufen entsprechen der ausführlichen Checkliste mit fünfzehn Fragen weiter unten.",
  },
};

// --- Downloads gegen freiwillige Kontaktdaten (ArchitekturDownload.tsx) -------
// Dasselbe Formular für beide Unterlagen. BACKEND (Welle 2): POST an den Endpunkt, Meldung per Mail
// (Regeln in backend.js). Die Dateien liegen unter public/inhalt/downloads/.
export const DOWNLOAD_FORMULAR = {
  hinweis: "Alle Angaben sind freiwillig: Der Download startet auch, wenn Sie die Felder leer lassen. Wenn Sie uns Ihre Kontaktdaten hinterlassen, melden wir uns gern bei Fragen.",
  felder: [
    { name: "name", label: "Name (freiwillig)", type: "text", autoComplete: "name", placeholder: "Ihr Name" },
    { name: "email", label: "E-Mail (freiwillig)", type: "email", autoComplete: "email", placeholder: "ihre@email.de" },
    { name: "phone", label: "Telefon (freiwillig)", type: "tel", autoComplete: "tel", placeholder: "+49 ..." },
  ],
  // Honeypot, für Menschen unsichtbar (aria-hidden, tabIndex -1, autoComplete off).
  honeypot: { name: "website", label: "Website" },
  // Einwilligung (Ankreuzfeld „consent“). {was} = „die Grafik“ bzw. „die Checkliste“.
  einwilligung: (was) => ({
    teile: [
      `Ich willige ein, dass NeuralNautic meine Angaben verarbeitet, um mir ${was} bereitzustellen und mich dazu per E-Mail oder Telefon zu kontaktieren. Die Einwilligung kann ich jederzeit per E-Mail widerrufen. Details in der `,
      { text: "Datenschutzerklärung", href: "/datenschutz" },
      ".",
    ],
  }),
  ladeText: "Wird vorbereitet …",
  fehlerStandard: "Unbekannter Fehler. Bitte versuchen Sie es erneut.",
  fehlerVerbindung: "Verbindung fehlgeschlagen. Bitte versuchen Sie es erneut.",
  // Danke-Zustand nach dem Download (für beide Unterlagen derselbe Wortlaut).
  danke: {
    titel: "Danke, die Grafik wird heruntergeladen.",
    text: "Falls er nicht startet, senden Sie das Formular einfach erneut. Wenn Sie Fragen zur Architektur haben, melden wir uns gern.",
    knopf: "Erneut herunterladen",
  },
  // Gesendet wird als JSON: { name, email, phone, consent (true/false), website }
  anfrage: { methode: "POST", contentType: "application/json", felder: ["name", "email", "phone", "consent", "website"] },
};

export const DOWNLOAD_GRAFIK = {
  endpoint: "/api/architektur-download",
  dateiname: "NeuralNautic_KI-Architektur_7-Schichten.svg",
  datei: "/inhalt/downloads/NeuralNautic_KI-Architektur_7-Schichten.svg",
  kicker: "Zum Herunterladen",
  titel: "Das Referenzmodell als Grafik für Ihre Unterlagen",
  text: "Alle sieben Schichten mit Bausteinen, Datenfluss und Erläuterungen in einem Bild, verlustfrei skalierbar (SVG) für Präsentationen und Strategiepapiere.",
  was: "die Grafik",
  knopf: "Grafik herunterladen",
  idp: "dl",
};

export const DOWNLOAD_CHECKLISTE = {
  endpoint: "/api/checkliste-download",
  dateiname: "NeuralNautic_KI-Checkliste_Reifegrad-und-Risiko.pdf",
  datei: "/inhalt/downloads/NeuralNautic_KI-Checkliste_Reifegrad-und-Risiko.pdf",
  kicker: "Checkliste zum Herunterladen",
  titel: "Die ausführliche Checkliste für Ihre Leitungsrunde",
  text: "Fünfzehn Fragen in fünf Feldern mit Auswertung, dazu eine Tabelle, mit der Sie jedes KI-Vorhaben einer Risikoklasse nach EU AI Act zuordnen. Vier Seiten als PDF zum Ausdrucken.",
  was: "die Checkliste",
  knopf: "Checkliste herunterladen",
  idp: "cl",
};

// 3 Einstieg: Reifegrad-Check, darunter die Checkliste zum Herunterladen
export const REIFEGRAD = {
  id: "reifegrad",
  kicker: "Reifegrad-Check",
  titel: "Wo Sie heute stehen, zeigen sechs Fragen in fünf Minuten",
  intro: "Bevor wir Kurs setzen, schauen wir, wo Ihr Unternehmen steht. Bewerten Sie jede Dimension ehrlich von 0 bis 3. Das Ergebnis ist eine Einstiegsstufe mit einem empfohlenen ersten Schritt. Gespeichert oder übertragen wird dabei nichts.",
  check: REIFEGRAD_CHECK,
  checkliste: DOWNLOAD_CHECKLISTE,
};

// n, title, desc, width (Balkenbreite in %), corridor (true = im Wertschöpfungskorridor, hervorgehoben)
const STUFEN = [
  { n: "01", title: "KI-Werkzeuge nutzen",          desc: "Fertige Werkzeuge wie Chat-Assistenten, Übersetzer oder Besprechungsprotokolle. Schnell eingeführt, aber Ihre Wettbewerber nutzen dieselben.", width: 44, corridor: false },
  { n: "02", title: "KI an eigene Prozesse anbinden", desc: "KI arbeitet in Ihren Abläufen: Posteingang, Angebote, CRM, Dokumente. Hier entsteht der erste spürbare Vorsprung.", width: 58, corridor: true },
  { n: "03", title: "Eigene KI-Dienste aufbauen",  desc: "Assistenten und Agenten, zugeschnitten auf Ihr Wissen und Ihre Regeln, für Mitarbeitende oder für Ihre Kunden.", width: 72, corridor: true },
  { n: "04", title: "Eigene Daten nutzbar machen",  desc: "Vorhersagen und Auswertungen aus Ihren Unternehmensdaten, etwa zu Bedarf, Ausfällen oder Preisen.", width: 86, corridor: true },
  { n: "05", title: "Eigene KI-Verfahren entwickeln", desc: "Neue Algorithmen als geistiges Eigentum. Forschungsaufwand, für die meisten Mittelständler nicht der nächste Schritt.", width: 100, corridor: false },
];

// 4 Wertschöpfungsstufen
// OFFEN (Strukturvorschlag, „Offen bei NN“): Die Stufen gehen auf einen externen Autor zurück, der im
// Kicker genannt ist. Rechte klären, bevor sie ins neue Design gehen. Wortlaut hier unverändert.
export const WERTSCHOEPFUNG = {
  id: "wertschoepfung",
  kicker: "Wertschöpfungsstufen nach Christoph Knöll",
  titel: "Für den Mittelstand liegt der lohnende Bereich auf den Stufen zwei bis vier",
  intro: "Wo die KI ansetzt, entscheidet, wie viel vom Nutzen bei Ihnen bleibt. Je tiefer sie in Ihre Prozesse und Daten greift, desto schwerer ist der Vorsprung zu kopieren. Ganz oben ist der Einstieg leicht, ganz unten der Aufwand hoch.",
  // Nur für Screenreader sichtbar:
  srTitel: "Fünf Stufen der KI-Wertschöpfung, der Korridor liegt auf den Stufen 02 bis 04",
  stufen: STUFEN,
  hinweis: "Markiert: der Wertschöpfungskorridor. Hier bleibt der Nutzen im Unternehmen, bei vertretbarem Aufwand und überschaubarem Risiko.",
  rechteOffen: true,
};

// name, title, note (optional), result, steps[6]
const STRAENGE = [
  { name: "Kurs",    title: "KI-Strategie", result: "Fahrplan mit priorisierten Anwendungsfällen", steps: ["Ausgangslage und Unternehmensziele", "Engpässe und Probleme", "KI-Zielbild", "Anwendungsfälle in drei Horizonten", "Bewertung und Priorisierung", "Fahrplan"] },
  { name: "Crew",    title: "Wandel und Kommunikation", result: "Neue Abläufe, die im Alltag genutzt werden", steps: ["Führungskräfte einbinden", "Multiplikatoren gewinnen", "Kernbotschaft und Auftakt", "Schulung", "Erste Erfolge sichtbar machen", "Übergabe in die Linienverantwortung"] },
  { name: "Logbuch", title: "KI-Managementsystem", note: "angelehnt an ISO/IEC 42001", result: "Dokumentierte Regeln, Rollen und Nachweise", steps: ["Rollen und Verantwortlichkeiten", "KI-Richtlinie", "Risikoanalyse", "Unterweisung", "Freigabeverfahren für KI-Anwendungen", "Audit, Kennzahlen, Verbesserung"] },
];

// 5 Vorgehensmodell in drei Strängen (aufklappbar), darüber das Ebenenmodell (aktiv: "unternehmen")
export const VORGEHENSMODELL = {
  kicker: "Vorgehensmodell",
  titel: "Kurs, Crew und Logbuch laufen als drei Stränge mit festen Schritten und vorzeigbaren Ergebnissen",
  intro: "Der Kurs mündet in einen Fahrplan, die Crew in Abläufe, die genutzt werden, das Logbuch in ein dokumentiertes KI-Managementsystem. Die Stränge laufen parallel. Die Anwendungsfälle aus dem Fahrplan setzen wir danach als einzelne Projekte um, das Schiff dafür ist die Architektur weiter unten.",
  ebenenmodellAktiv: "unternehmen",
  straenge: STRAENGE,
  // Kopfzeile je Strang: {name} | {title} | {note} | „Ergebnis: {result}“; Schritte nummeriert 1 bis 6.
  ergebnisLabel: "Ergebnis: ",
};

// Sieben Schichten, von oben (7) nach unten (1). parts = Unterteile (5a/5b, 3a/3b/3c);
// bei Unterteilen lautet der Kartentitel „{Schichttitel}: {Teiltitel}“.
const SCHICHTEN = [
  { n: "7", title: "Governance und Compliance", items: "KI-Richtlinie · Rollen · Risikomanagement · Einstufung nach EU AI Act · Prüfpfad" },
  { n: "6", title: "Datenschutz und Sicherheit", items: "DSGVO · Auftragsverarbeitung · Löschkonzept · Verschlüsselung · Zugriffssteuerung" },
  { n: "5", title: "Anwendungen", items: "", parts: [
    { n: "5a", title: "Intern", items: "Assistenten · Automatisierung · Analyse · Wissen" },
    { n: "5b", title: "Für Kunden", items: "Kundenservice · Produktfunktionen · neue Angebote" },
  ] },
  { n: "4", title: "Orchestrierung und Agenten", items: "Arbeitsabläufe · Verteilung auf die Modelle · zentraler Modellzugang (LLM-Gateway) · Verwaltung der Anweisungen · Leitplanken · Protokollierung · Rechte" },
  { n: "3", title: "Modelle", items: "", parts: [
    { n: "3a", title: "Cloud-Modelle über Schnittstelle (API)", items: "mit Auftragsverarbeitung, EU-Region" },
    { n: "3b", title: "Offene Modelle", items: "im eigenen Betrieb, volle Datenkontrolle" },
    { n: "3c", title: "Spezialmodelle", items: "Vektordarstellungen (Embeddings) · Bild · Sprache" },
  ] },
  { n: "2", title: "Daten und Wissen", items: "Unternehmensdaten · Wissenssuche mit RAG · Dokumentenverarbeitung · Datenklassen · Berechtigungen" },
  { n: "1", title: "Infrastruktur und Betrieb", items: "Cloud, eigene Server oder hybrid · Bereitstellung · Überwachung · Datensicherung · Rechenzentrum in der EU" },
];

// HTML-Gerüst des drehbaren 3D-Modells (Legende, Regler, Hinweis), erzeugt von
// tools/architektur/build_web.py der Live-Seite. Der Renderer (model3d.js) erwartet genau dieses Gerüst.
const MODELL_MARKUP = "<div class=\"m3d\" tabindex=\"0\" aria-label=\"Räumliches Modell der Architektur, drehbar\">\n  <canvas id=\"model\"></canvas>\n  <div class=\"m3d-legend\">\n    <i><b style=\"background:#3FD4E0\"></b>Anwendung & Steuerung</i>\n    <i><b style=\"background:#6EA8FF\"></b>Modelle</i>\n    <i><b style=\"background:#F5C97A\"></b>Daten & Wissen</i>\n    <i><b style=\"background:#F08A7A\"></b>Pflicht & Datenschutz</i>\n    <i><b style=\"background:#9C9CA4\"></b>Betrieb</i>\n  </div>\n  <div class=\"m3d-ctl\">\n    <h2>Drehung</h2>\n    <label for=\"rot-x\">X<input type=\"range\" id=\"rot-x\" min=\"-180\" max=\"180\" step=\"1\" value=\"30\"><output id=\"out-x\">30°</output></label>\n    <label for=\"rot-y\">Y<input type=\"range\" id=\"rot-y\" min=\"-180\" max=\"180\" step=\"1\" value=\"0\"><output id=\"out-y\">0°</output></label>\n    <label for=\"rot-z\">Z<input type=\"range\" id=\"rot-z\" min=\"-180\" max=\"180\" step=\"1\" value=\"0\"><output id=\"out-z\">0°</output></label>\n    <button id=\"reset\" type=\"button\">Ansicht zurücksetzen</button>\n  </div>\n  <div class=\"m3d-hint\">Mausrad dreht &middot; linke Taste halten stellt den Blick ein</div>\n</div>";

// 6 Architektur
export const ARCHITEKTUR = {
  id: "architektur",
  kicker: "Das Schiff · KI-Architektur",
  titel: "Ein seetüchtiges Schiff hat sieben Schichten, und der Datenschutz geht durch alle",
  intro: "Wer nur ein Modell anschließt, hat eine Demo. Für den Betrieb braucht es Daten, Orchestrierung, Sicherheit und Governance, die zusammenpassen. Die Regulierung betrifft dabei nicht eine Schicht, sondern das Ganze.",
  // Zuerst das drehbare Referenzmodell, direkt darunter die volle Grafik als Download gegen Kontaktdaten.
  modell3d: {
    // Modell-Daten (7 Ebenen mit Knoten und Verbindungen): public/inhalt/architektur/szene.json
    szene: "/inhalt/architektur/szene.json",
    renderer: "/inhalt/architektur/model3d.js",
    stylesheet: "/inhalt/architektur/model3d.css",
    // Ablauf auf der Live-Seite: szene.json laden, als window.SCENE ablegen, dann model3d.js einbinden.
    // Steht das Modell in einem zugeklappten <details>, erst beim Aufklappen laden (der Renderer misst
    // die Bühne beim Start, eine verborgene Bühne hätte die Größe 0).
    markup: MODELL_MARKUP,
    legende: [
      { farbe: "#3FD4E0", text: "Anwendung & Steuerung" },
      { farbe: "#6EA8FF", text: "Modelle" },
      { farbe: "#F5C97A", text: "Daten & Wissen" },
      { farbe: "#F08A7A", text: "Pflicht & Datenschutz" },
      { farbe: "#9C9CA4", text: "Betrieb" },
    ],
    regler: { titel: "Drehung", achsen: [{ achse: "X", start: 30 }, { achse: "Y", start: 0 }, { achse: "Z", start: 0 }], min: -180, max: 180, zuruecksetzen: "Ansicht zurücksetzen" },
    hinweisImModell: "Mausrad dreht · linke Taste halten stellt den Blick ein",
    ariaLabel: "Räumliches Modell der Architektur, drehbar",
    // NN-Signatur unten im Modell: Monogramm (/logo-monogram.png, im Funnel public/brand/nn-monogramm.png) und Wortmarke.
    signatur: { logo: "/logo-monogram.png", zeile1: "NeuralNautic", zeile2: "Referenzmodell" },
    vollbild: { an: "Vollbild", aus: "Vollbild beenden" },
    bildunterschrift: "Referenzmodell NeuralNautic, Stand 29.10.2026. Mausrad dreht, gehaltene linke Maustaste stellt den Blick ein. Auf dem Handy dreht waagerechtes Wischen.",
  },
  download: DOWNLOAD_GRAFIK,
  // Aufklappbar unter dem Download:
  uebersicht: {
    summary: "Die sieben Schichten als Übersicht",
    schichten: SCHICHTEN,
    // Senkrechte Leiste neben allen Schichten:
    leiste: "DSGVO · EU AI Act · NIS2",
    text: {
      teile: ["Welche Schichten Sie selbst betreiben und welche Sie einkaufen, klären wir in der ", { text: "KI-Architektur-Beratung", href: "/leistungen" }, ". Ergebnis ist eine dokumentierte Zielarchitektur mit Kostenmodell."],
    },
  },
  // Vorschaubild der Grafik (auf der Live-Startseite genutzt, 1144 × 1880).
  vorschau: { src: "/architektur/ki-architektur-vorschau.jpg", datei: "/inhalt/architektur/ki-architektur-vorschau.jpg", alt: "KI-Architektur in sieben Schichten von Infrastruktur bis Governance", width: 1144, height: 1880 },
};

// 7 Übergang zum Engineering
export const UMSETZUNG = {
  kicker: "Umsetzung",
  h2: "Was in den Betrieb geht, wird ingenieurmäßig gebaut, nicht zusammengeklickt",
  text: "Ein Prototyp ist heute in Stunden gebaut. Ein System, das Ihre Daten verarbeitet und jeden Tag läuft, braucht Anforderungen, Tests, Sicherheitsprüfung und Verantwortung. Wie wir das machen, steht auf der Seite zu AI Engineering.",
  links: [
    { text: "AI Engineering statt Vibe Coding", href: "/ai-engineering" },
    { text: "KI-Potenzialcheck buchen", href: KI_CHECK_BUCHEN, extern: true },
  ],
};
