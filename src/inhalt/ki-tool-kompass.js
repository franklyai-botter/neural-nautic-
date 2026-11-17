// /ki-tool-kompass als Daten. Quelle: neural-nautic-live @ 447000b, app/ki-tool-kompass/page.tsx. Wörtlich.

export const ROUTE = "/ki-tool-kompass";

export const META = {
  title: "KI Tool Kompass: KI-Werkzeuge richtig auswählen | NeuralNautic",
  alternates: { canonical: "/ki-tool-kompass" },
  description: "Fragen, mit denen Sie KI-Werkzeuge nach Nutzen, Kosten, Datenschutz und Integrationsfähigkeit bewerten, bevor Sie kaufen. Herstellerneutral, für den Mittelstand.",
  openGraph: { title: "KI Tool Kompass: KI-Werkzeuge richtig auswählen", description: "Fragen, mit denen Sie KI-Werkzeuge nach Nutzen, Kosten, Datenschutz und Integrationsfähigkeit bewerten, bevor Sie kaufen. Herstellerneutral, für den Mittelstand.", url: "/ki-tool-kompass" },
};

export const KOPF = {
  eyebrow: "KI Tool Kompass",
  h1: "Die richtigen KI-Werkzeuge für Ihr Unternehmen",
  text: "Der KI-Markt ist unübersichtlich. Gemeinsam mit Ihnen bewerten wir passende Werkzeuge, führen sie sinnvoll ein und legen fest, wie sie genutzt werden.",
};

// Klassen Stand 29.10.2026. Bewusst ohne Produktnamen: die Klassen bleiben, die Anbieter wechseln.
export const KATEGORIEN = {
  h2: "Werkzeugkategorien",
  liste: [
  "Chat-Assistenten", "KI-Agenten", "Automatisierung",
  "Wissen und Unternehmenssuche", "Dokumentenverarbeitung", "Sprache und Besprechungen",
  "Büro und Produktivität", "Softwareentwicklung mit KI", "Bild, Video und Design",
  "Souveräne und lokale KI (Open Source, EU-Anbieter)", "CRM und Vertrieb",
],
};

const KRITERIEN_LISTE = [
  { n: "01", q: "Welches Problem löst das Werkzeug?",             desc: "Startpunkt ist immer das konkrete Problem, nicht das Werkzeug." },
  { n: "02", q: "Passt es zu bestehenden Prozessen?",              desc: "Werkzeuge müssen sich in Ihre Abläufe einfügen, nicht umgekehrt." },
  { n: "03", q: "Wie hoch sind Lizenz- und Betriebskosten?",       desc: "Gesamtkosten über die Laufzeit betrachten, nicht nur die Lizenz." },
  { n: "04", q: "Welche Daten werden verarbeitet?",                desc: "Datenflüsse verstehen: vor der Einführung, nicht danach." },
  { n: "05", q: "Ist Training mit Ihren Daten ausgeschlossen?",    desc: "Im geschäftlichen Einsatz gilt: kein Training mit Ihren Eingaben. Vertraglich zugesichert oder im Konto abgeschaltet und vor dem ersten Einsatz geprüft." },
  { n: "06", q: "Ist das Werkzeug DSGVO-konform einsetzbar?",      desc: "Besonders bei Cloud-Diensten: Serverstandort, Drittlandübermittlung, Vertrag zur Auftragsverarbeitung." },
  { n: "07", q: "Welche Pflichten folgen aus dem EU AI Act?",      desc: "Risikoklasse des Einsatzes bestimmen, Transparenz- und Dokumentationspflichten einplanen." },
  { n: "08", q: "Gibt es Schnittstellen zu bestehenden Systemen?", desc: "Programmierschnittstellen, fertige Anbindungen, Integrationsaufwand." },
  { n: "09", q: "Wie hoch ist der Schulungsaufwand?",              desc: "Die Nutzung scheitert oft an fehlender Einführung, nicht am Werkzeug." },
  { n: "10", q: "Entsteht eine Abhängigkeit vom Anbieter?",        desc: "Daten exportierbar, Wechsel möglich, Alternativen vorhanden." },
  { n: "11", q: "Ist die Lösung skalierbar?",                      desc: "Was für 5 Nutzer funktioniert, muss auch für 50 taugen." },
];

export const KRITERIEN = {
  // Auf der Live-Seite wird die Zahl aus der Liste gebildet: „11 Bewertungskriterien“.
  h2: `${KRITERIEN_LISTE.length} Bewertungskriterien`,
  // n = Nummer, q = Frage, desc = Erläuterung
  liste: KRITERIEN_LISTE,
};

// Kaufen oder bauen: Brücke zu AI Engineering (die ganze Karte ist ein Link).
export const BRUECKE = {
  kicker: "Kaufen oder bauen",
  titel: "Kein Werkzeug passt? Dann entwickeln wir die Lösung mit Ihnen. →",
  text: "Wie wir KI-Software für den Betrieb entwickeln, mit Anforderungen, Tests und Qualitätsprüfung statt Vibe Coding, steht auf der Seite AI Engineering.",
  href: "/ai-engineering",
};

export const ABSCHLUSS = {
  h2: "Werkzeugauswahl professionell begleiten lassen.",
  text: "Wir helfen Ihnen, die richtigen KI-Werkzeuge zu finden, zu bewerten und sicher einzuführen.",
  cta: { text: "Werkzeugauswahl prüfen lassen", href: "/kontakt" },
};
