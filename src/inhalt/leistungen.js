// /leistungen als Daten. Quelle: neural-nautic-live @ 447000b, app/leistungen/page.tsx. Wörtlich.
import { KI_CHECK_BUCHEN } from "./site.js";

export const ROUTE = "/leistungen";

export const META = {
  title: "Leistungen: KI-Beratung für den Mittelstand | NeuralNautic",
  alternates: { canonical: "/leistungen" },
  description: "KI-Potenzialanalyse, KI-Architektur, Controlled Pilot, Automatisierung, Agentic Engineering, Governance, Schulung und Werkzeugauswahl für KMU in Berlin und DACH.",
  openGraph: { title: "Leistungen: KI-Beratung für den Mittelstand", description: "KI-Potenzialanalyse, KI-Architektur, Controlled Pilot, Automatisierung, Agentic Engineering, Governance, Schulung und Werkzeugauswahl für KMU in Berlin und DACH.", url: "/leistungen" },
};

export const KOPF = {
  eyebrow: "Leistungen",
  h1: "KI-Leistungen für Analyse, Umsetzung und Skalierung",
  text: "Von der ersten Idee bis zum produktiven KI-gestützten Arbeitsablauf: Wir unterstützen Unternehmen dabei, KI sinnvoll, sicher und wirtschaftlich einzusetzen.",
};

// Die 8 Leistungen: title, short (Kurztext), long (Langtext), items (Häkchenliste), result (Ergebnis),
// more (Zusatzlink, nur bei KI-Architektur und Agentic Engineering).
export const LEISTUNGEN = [
  {
    title: "KI-Potenzialanalyse",
    short: "Wir identifizieren, wo künstliche Intelligenz in Ihrem Unternehmen sinnvoll eingesetzt werden kann, und wo nicht.",
    long: "Viele Unternehmen starten mit KI-Werkzeugen, bevor klar ist, welches Problem eigentlich gelöst werden soll. Die KI-Potenzialanalyse schafft Orientierung. Gemeinsam betrachten wir Prozesse, Daten, Systeme, Teams und Ziele. Daraus entsteht eine priorisierte Übersicht möglicher KI-Anwendungsfälle.",
    items: ["Prozessaufnahme", "Werkzeug- und Systemanalyse", "Identifikation relevanter KI-Anwendungsfälle", "Aufwand-Nutzen-Bewertung", "Risiko- und Datenschutz-Ersteinschätzung", "Priorisierung nach Wirkung und Machbarkeit"],
    result: "Ein klarer KI-Fahrplan mit konkreten Handlungsempfehlungen.",
  },
  {
    title: "KI-Architektur",
    short: "Die technische Grundlage für KI, die sicher, bezahlbar und austauschbar bleibt.",
    long: "Wer heute KI einführt, legt Datenflüsse, Modelle, Kosten und Abhängigkeiten für Jahre fest. Gemeinsam entwerfen wir eine Architektur, die zu Ihren Daten und Systemen passt: mit EU-Datenresidenz, klarer Modellwahl je Aufgabe, einem zentralen Zugang zu den Sprachmodellen und ohne Bindung an einen einzelnen Anbieter.",
    items: ["Zielarchitektur und Datenflüsse", "EU-Datenresidenz und Wahl des Modellanbieters (z. B. Claude über AWS Bedrock EU)", "Zentraler Modellzugang (LLM-Gateway) mit Verteilung nach Aufgabe, Budgets und Kostenkontrolle", "Wissenssysteme mit RAG: Suche, Quellenangaben, Löschkonzept", "Kostenmodell monatlich und jährlich", "Lizenzprüfung der eingesetzten Komponenten", "Optionen von Cloud bis On-Premises"],
    result: "Eine dokumentierte Zielarchitektur mit Entscheidungsvorlagen, die Ihre IT umsetzen kann, oder die wir gemeinsam umsetzen.",
    more: { label: "Die sieben Schichten einer KI-Architektur", href: "/ki-im-unternehmen#architektur" },
  },
  {
    title: "Controlled Pilot",
    short: "KI sicher testen, bevor sie breit ausgerollt wird.",
    long: "Ein Controlled Pilot ist ein kontrollierter Praxistest für einen klar definierten KI-Anwendungsfall. Dabei arbeiten wir mit echten Prozessen, echten Nutzern und messbaren Kennzahlen, aber in einem begrenzten, kontrollierten Rahmen.",
    items: ["Definition des Pilotziels", "Auswahl des passenden Anwendungsfalls", "Festlegung messbarer Kennzahlen", "Aufbau der technischen Lösung", "Einbindung relevanter Mitarbeitender", "Rückmelde- und Verbesserungsschleifen", "Entscheidungsvorlage für Skalierung"],
    result: "Eine belastbare Entscheidungsgrundlage: skalieren, anpassen oder stoppen.",
  },
  {
    title: "KI-Automatisierung",
    short: "Wiederkehrende Aufgaben mit KI, Arbeitsabläufen und Schnittstellen automatisieren.",
    long: "KI entfaltet ihren größten Nutzen dort, wo sie konkrete Arbeitsabläufe unterstützt. Gemeinsam bauen wir KI-gestützte Arbeitsabläufe auf, etwa für E-Mail-Verarbeitung, Angebotserstellung, Dokumentenanalyse, Sprachassistenten am Telefon, CRM-Prozesse oder interne Wissenssysteme.",
    items: ["Automatische Angebotserstellung", "Sprachassistent für Anrufannahme", "E-Mail-Klassifizierung und Antwortvorschläge", "Dokumenten- und Belegverarbeitung", "CRM-Zusammenfassungen", "Vorqualifizierung von Anfragen", "Interne Wissensassistenten", "Abläufe mit n8n, Make oder über Schnittstellen"],
    result: "Ein produktiver KI-gestützter Arbeitsablauf mit Dokumentation, Übergabe und klaren Zuständigkeiten.",
  },
  {
    title: "Agentic Engineering",
    short: "Individuelle Software und Automatisierungen für Ihr konkretes Problem, entwickelt mit KI-Agenten.",
    long: "Standardsoftware passt oft nur zur Hälfte, klassische Individualentwicklung war bisher teuer und langsam. Mit Agentic Engineering entwickeln wir Software und Automatisierungen gemeinsam mit KI-Agenten, die planen, programmieren und testen. Gesteuert, geprüft und verantwortet von uns. So entstehen maßgeschneiderte Lösungen deutlich schneller als bisher, mit Tests, Dokumentation und Code, der Ihnen gehört.",
    items: ["Individuelle Werkzeuge und Web-Anwendungen für Ihre Abläufe", "Automatisierungen und Schnittstellen zwischen Ihren Systemen", "Entwicklung mit KI-Agenten, gesteuert und geprüft durch uns", "Automatisierte Tests und Qualitätsprüfung vor jeder Auslieferung", "Dokumentation und Übergabe: der Code gehört Ihnen", "Betrieb in Ihrer Infrastruktur oder bei einem Hosting-Anbieter in der EU", "Befähigung Ihres IT-Teams für agentische Entwicklung"],
    result: "Eine maßgeschneiderte, getestete Lösung für Ihr Problem, schneller und günstiger als klassische Individualentwicklung.",
    more: { label: "Wie wir arbeiten: AI Engineering statt Vibe Coding", href: "/ai-engineering" },
  },
  {
    title: "KI-Governance und Sicherheit",
    short: "Klare Regeln für sicheren, nachvollziehbaren und verantwortungsvollen KI-Einsatz.",
    long: "KI braucht nicht nur Technologie, sondern auch Regeln. Gemeinsam mit Ihnen bauen wir verständliche Governance-Strukturen auf, mit Blick auf Datenschutz, EU AI Act, Rollen, Verantwortlichkeiten, Freigaben von Werkzeugen und interne Kommunikation.",
    items: ["KI-Richtlinien", "Freigabeprozesse für Werkzeuge", "Datenschutz-Ersteinschätzung", "Risikoklassifizierung von KI-Anwendungen", "Rollen- und Rechtekonzepte", "Dokumentationsvorlagen", "Einbindung von Datenschutz, IT und Betriebsrat"],
    result: "Ein klarer Rahmen, in dem KI sicher und akzeptiert genutzt werden kann.",
  },
  {
    title: "KI-Schulung und Befähigung",
    short: "Mitarbeitende befähigen, KI sicher und produktiv im Arbeitsalltag einzusetzen.",
    long: "Der Erfolg von KI hängt nicht nur von Werkzeugen ab, sondern von Menschen. Wir entwickeln Schulungsformate für Geschäftsführung, Fachabteilungen, Vertrieb, Marketing, Verwaltung und interne KI-Multiplikatoren.",
    items: ["KI-Grundlagenworkshop", "KI richtig anweisen: Workshop für Fachabteilungen", "KI im Vertrieb", "KI in der Verwaltung", "KI für Führungskräfte", "Governance-Schulung", "Tool-Kompass-Workshop", "Multiplikatoren-Programm"],
    result: "Teams verstehen, wo KI hilft, wo Grenzen liegen und wie sie KI-Werkzeuge sicher einsetzen.",
  },
  {
    title: "KI Tool Kompass",
    short: "Bewertung und Auswahl passender KI-Werkzeuge nach Nutzen, Kosten, Datenschutz und Integrationsfähigkeit.",
    long: "Der KI-Markt ist unübersichtlich. Gemeinsam mit Ihnen bewerten wir passende Werkzeuge, führen sie sinnvoll ein und legen fest, wie sie genutzt werden: herstellerneutral und ohne Provisionsinteressen.",
    items: ["Text- und Chat-KI", "Automatisierungswerkzeuge", "Wissensmanagement", "Sprachassistenten", "Büro- und Produktivitätswerkzeuge", "Open-Source- und lokale KI", "CRM- und Vertriebsautomatisierung"],
    result: "Eine fundierte Werkzeugentscheidung, die zu Ihren Prozessen, Ihrem Budget und Ihrer Datenschutzstrategie passt.",
  },
];

// Wie eine Leistung auf der Live-Seite dargestellt wird.
export const KARTE = {
  // Nummer vor dem Titel: "0" + laufende Nummer ab 1, also 01 bis 08.
  nummer: (i) => `0${i + 1}`,
  cta: { text: "KI-Potenzialcheck buchen", href: KI_CHECK_BUCHEN, extern: true },
  zusatzlinkNach: " →",
  haken: "✓",
  ergebnisLabel: "Ergebnis: ",
};

export const ABSCHLUSS = {
  h2: "Bereit für den ersten Schritt?",
  text: "Lassen Sie uns gemeinsam prüfen, welche Leistung zu Ihrer Situation passt.",
  cta: { text: "KI-Potenzialcheck buchen", href: KI_CHECK_BUCHEN, extern: true },
};
