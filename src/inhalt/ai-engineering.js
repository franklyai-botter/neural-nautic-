// /ai-engineering als Daten. Quelle: neural-nautic-live @ 447000b, app/ai-engineering/page.tsx. Wörtlich.

export const ROUTE = "/ai-engineering";

export const META = {
  title: "AI Engineering statt Vibe Coding: KI-Software für den Betrieb | NeuralNautic",
  alternates: { canonical: "/ai-engineering" },
  description: "Professionelles AI Engineering: Anforderungen, geprüfte Architektur, Entwicklung mit KI-Agenten unter Aufsicht, Tests und Qualitätsprüfung. Software, die im Betrieb hält und Ihnen gehört.",
  openGraph: { title: "AI Engineering statt Vibe Coding", description: "KI-Software, die im Betrieb hält: Anforderungen, geprüfte Architektur, Entwicklung mit KI-Agenten unter Aufsicht, Tests und Qualitätsprüfung.", url: "/ai-engineering" },
};

export const KOPF = {
  eyebrow: "AI Engineering",
  h1: "Software für Ihren Betrieb entsteht durch Engineering, nicht durch Vibe Coding",
  text: "Mit KI ist ein beeindruckender Prototyp in Stunden gebaut. Ein System, dem Sie Kundendaten und Abläufe anvertrauen, braucht die Sorgfalt professioneller Softwareentwicklung. KI-Agenten schreiben den Code schneller, die Verantwortung dafür übernehmen wir.",
};

// 1 Vergleich
export const UNTERSCHIED = {
  kicker: "Der Unterschied",
  h2: "Vibe Coding ist gut für Ideen und riskant für den Betrieb",
  text: "Beim Vibe Coding beschreibt man der KI, was man möchte, und übernimmt, was sie liefert, ohne den Code zu prüfen. Für einen Entwurf reicht das. Was danach im Alltag läuft, braucht fünf Dinge, die ein Prototyp nicht hat.",
  tabelle: {
    ariaLabel: "Vergleich Vibe Coding und AI Engineering",
    spalten: ["", "Vibe Coding", "AI Engineering"],
    // Auf dem Handy steht vor jeder Zelle das Spaltenetikett.
    mobilLabels: { vibe: "Vibe Coding: ", eng: "AI Engineering: " },
    // dim = Zeilenkopf, vibe = Spalte Vibe Coding, eng = Spalte AI Engineering (hervorgehoben)
    zeilen: [
  { dim: "Ausgangspunkt",              vibe: "Eine Idee und eine Anweisung an die KI",                                  eng: "Schriftliche Anforderungen mit Abnahmekriterien und eine geprüfte Architektur" },
  { dim: "Qualität",                   vibe: "„Läuft bei mir“",                                           eng: "Automatische Tests und eine feste Prüfung vor jeder Auslieferung" },
  { dim: "Sicherheit und Datenschutz", vibe: "Schlüssel im Code, Daten gehen an beliebige Dienste",       eng: "Geheimnisse sicher verwahrt, Rechtekonzept, EU-Datenresidenz, Auftragsverarbeitung" },
  { dim: "Nachvollziehbarkeit",        vibe: "Ein langer Chatverlauf",                                    eng: "Versionsverwaltung, eine Aufgabe je Änderung, Dokumentation" },
  { dim: "Betrieb und Verantwortung",  vibe: "Niemand ist zuständig, wenn es bricht",                     eng: "Überwachung, Kostenbudget, Übergabe und eine benannte Verantwortung" },
],
  },
  nachsatz: "Wir nutzen Vibe Coding selbst, für Klickprototypen und schnelle Machbarkeitsproben, wenn eine Idee im Workshop greifbar werden soll. Was davon in den Betrieb geht, bauen wir neu und nach dem Vorgehen unten.",
};

// 2 Risikoklassen: wann Engineering nötig ist
export const RISIKOKLASSEN = {
  kicker: "Wann es Engineering braucht",
  h2: "Über den Aufwand entscheidet die Reichweite einer Lösung, nicht das Werkzeug",
  text: "Ein persönlicher Prototyp darf schnell entstehen. Dieselbe Technik in einer Anwendung für Kunden braucht dagegen volle Sorgfalt. Vier Fragen ordnen jede Lösung ein: Wer nutzt sie, welche Daten verarbeitet sie, was darf sie selbst auslösen, und was passiert bei einem Ausfall?",
  tabelle: {
    ariaLabel: "Vier Risikoklassen für KI-gestützt entwickelte Lösungen",
    spalten: ["Klasse", "Typische Lösung", "Wer baut", "Prüfung vor dem Einsatz"],
    mobilLabels: { loesung: "Lösung: ", wer: "Wer baut: ", pruefung: "Prüfung: " },
    // Vier Risikoklassen, eigene Formulierung. wir: true = AI Engineering nötig (Zeile hervorgehoben).
    zeilen: [
  { klasse: "Niedrig",  loesung: "Persönliche Arbeitshilfe oder Prototyp",                          wer: "Der Fachbereich selbst",                                  pruefung: "Keine Zugangsschlüssel im Code",                                  wir: false },
  { klasse: "Mittel",   loesung: "Teamlösung für wenige Nutzer, keine sensiblen Daten",             wer: "Der Fachbereich, auf einer freigegebenen Plattform",      pruefung: "Abhängigkeiten und Lizenzen, Eintrag ins Verzeichnis",            wir: false },
  { klasse: "Hoch",     loesung: "Abteilungsübergreifend oder unternehmensweit",                    wer: "Nur mit Begleitung durch IT und Engineering",             pruefung: "Zusätzlich Code- und Architekturprüfung, formelle Freigabe",       wir: true },
  { klasse: "Kritisch", loesung: "Für Kunden, geschäftskritisch oder regulatorisch relevant",       wer: "Professionelle Entwicklung, nach den Stationen unten",    pruefung: "Zusätzlich Sicherheitstest und Datenschutz-Folgenabschätzung",     wir: true },
],
  },
  hinweise: [
    "Hervorgehoben sind die Klassen, für die es AI Engineering braucht und in denen wir bauen oder begleiten. Für die unteren Klassen sorgen wir dafür, dass Ihre Fachbereiche schnell und trotzdem sicher arbeiten können.",
    "Angelehnt an die Empfehlungen von Microsoft für selbst gebaute Anwendungen in Fachbereichen (Power Platform: persönlich, Team, geschäftskritisch) und an den risikobasierten Ansatz des EU AI Act.",
  ],
  abschluss: {
    teile: ["Welche Klasse Ihre Lösung hat, klären wir gemeinsam. ", { text: "Sprechen Sie uns an", href: "/kontakt" }, "."],
  },
};

// 3 Stationen
export const STATIONEN = {
  kicker: "So arbeiten wir",
  h2: "Jede Lösung durchläuft fünf Stationen, bevor sie in Ihren Betrieb geht",
  text: "Die Reihenfolge ist fest. Keine Station wird übersprungen, auch nicht unter Zeitdruck, denn genau dann entstehen die Fehler, die später am meisten kosten.",
  liste: [
  { n: "01", title: "Anforderungen",                  desc: "Was soll das System leisten, für wen und mit welchen Daten? Wir halten es schriftlich fest, mit Kriterien, an denen sich die Abnahme messen lässt.", result: "Anforderungsdokument" },
  { n: "02", title: "Architektur mit Prüfung",        desc: "Die Zielarchitektur wird gegen feste Kriterien geprüft: Sicherheit, Datenschutz, Kosten, Betrieb, Austauschbarkeit der Modelle. Sie wird überarbeitet, bis sie trägt.", result: "Geprüftes Architekturdokument" },
  { n: "03", title: "Plan mit Compliance-Prüfung",    desc: "Der Plan zerfällt in einzelne, prüfbare Aufgaben, jede rückverfolgbar zu einer Anforderung. Jeder Plan wird vor dem Bau gegen Datenschutz- und Sicherheitsanforderungen geprüft.", result: "Aufgabenliste mit Nachweis" },
  { n: "04", title: "Umsetzung mit KI-Agenten",       desc: "KI-Agenten planen, programmieren und testen. Jede Änderung wird einzeln versioniert und von uns geprüft. Die Agenten machen es schnell, die Verantwortung bleibt bei uns.", result: "Getesteter Code in Ihrem Repository" },
  { n: "05", title: "Qualität und Übergabe",      desc: "Vor der Auslieferung prüfen wir Sicherheit, Fehlerbehandlung, Typsicherheit, Testqualität und Codestil und fragen: Was bricht im Betrieb zuerst? Erst dann geht die Lösung in Betrieb.", result: "Auslieferung mit Dokumentation" },
],
  darstellung: { haken: "✓", ergebnisLabel: "Ergebnis: " },
};

// 4 Ergebnis
export const ERGEBNIS = {
  kicker: "Was Sie bekommen",
  h2: "Sie bekommen ein System, das Ihnen gehört und das andere weiterführen können",
  text: "Wir bauen nicht für die Vorführung, sondern für den Tag, an dem jemand anderes den Code übernimmt.",
  karten: [
  { title: "Code, der Ihnen gehört",      desc: "In Ihrem Repository, ohne Bindung an uns. Andere Entwickler können ihn weiterführen." },
  { title: "Tests, die mitlaufen",        desc: "Jede spätere Änderung wird automatisch gegen das geprüft, was heute funktioniert." },
  { title: "Dokumentation für den Betrieb", desc: "Architektur, Datenflüsse, Rollen und das Vorgehen im Störfall, verständlich für Ihre IT." },
  { title: "Transparente Kosten",         desc: "Welches Modell welche Aufgabe übernimmt und was das im Monat kostet, mit Budgetgrenzen." },
],
  verweis: {
    teile: ["Wo die Lösung in Ihrer KI-Architektur sitzt und welche Schichten dazugehören, zeigt die Seite ", { text: "KI im Unternehmen", href: "/ki-im-unternehmen#architektur" }, "."],
  },
};

export const ABSCHLUSS = {
  h2: "Sie haben einen Prototyp, der in den Betrieb soll?",
  text: "Wir sehen ihn uns an und sagen Ihnen, was für einen sicheren Betrieb fehlt, und was es kostet, das zu ergänzen.",
  cta: { text: "Lösung anfragen", href: "/kontakt" },
};
