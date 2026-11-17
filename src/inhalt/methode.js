// /methode (KI im Projekt) als Daten. Quelle: neural-nautic-live @ 447000b, app/methode/page.tsx. Wörtlich.
import { KI_CHECK_BUCHEN } from "./site.js";
export { EBENENMODELL } from "./ebenenmodell.js";

export const ROUTE = "/methode";

export const META = {
  title: "KI im Projekt: Verstehen, Zuschneiden, Pilotieren, Automatisieren, Übergeben | NeuralNautic",
  alternates: { canonical: "/methode" },
  description: "Wie ein einzelner KI-Anwendungsfall umgesetzt wird: Prozess verstehen, Ziel und Kennzahlen festlegen, kontrolliert pilotieren, automatisieren und in den Betrieb übergeben.",
  openGraph: { title: "KI im Projekt: von der Prozessanalyse bis zur Übergabe", description: "Wie ein einzelner KI-Anwendungsfall umgesetzt wird: verstehen, zuschneiden, pilotieren, automatisieren, übergeben.", url: "/methode" },
};

export const KOPF = {
  eyebrow: "Methode · Im Projekt",
  h1: "Jedes KI-Projekt setzt einen Anwendungsfall in fünf Schritten um",
  text: "Welche Anwendungsfälle sich lohnen und in welcher Reihenfolge, steht im Fahrplan Ihres Unternehmens. Hier geht es um den einzelnen Fall: von der Prozessanalyse bis zum Regelbetrieb. Ziel ist nicht möglichst viel KI, sondern die richtige KI an der richtigen Stelle.",
};

// Direkt unter dem Kopf steht das Ebenenmodell mit hervorgehobener Projekt-Ebene.
export const EBENENMODELL_AKTIV = "projekt";

// Ebene 2 (Projekt): ein Anwendungsfall aus der Roadmap. Priorisieren über alle Fälle und
// Skalieren gehören zur Ebene 1 (Unternehmen, /ki-im-unternehmen).
export const PHASEN = [
  { n: "01", title: "Verstehen",      desc: "Am Anfang steht kein Werkzeug, sondern der Prozess, um den es geht. Wir sehen uns Abläufe, Beteiligte, Daten, Systeme und Risiken dieses Anwendungsfalls an, bevor irgendeine KI-Lösung ins Spiel kommt.", result: "Klares Bild des Prozesses heute" },
  { n: "02", title: "Zuschneiden",    desc: "Wir legen fest, was der Anwendungsfall leisten soll: Ziel, Kennzahlen, benötigte Daten, Risikoeinstufung und ab wann wir abbrechen. Welcher Fall als Nächstes drankommt, entscheidet der Fahrplan auf Unternehmensebene.", result: "Projektauftrag mit messbarem Ziel" },
  { n: "03", title: "Pilotieren",     desc: "Der Anwendungsfall wird in einem Controlled Pilot getestet: mit echten Prozessen, echten Nutzern und den vereinbarten Kennzahlen, in einem begrenzten, kontrollierten Rahmen.", result: "Messbarer Praxistest mit Entscheidung: weiter, anpassen oder stoppen" },
  { n: "04", title: "Automatisieren", desc: "Ein erfolgreicher Pilot wird zu einem stabilen Ablauf ausgebaut, auf der gemeinsamen KI-Architektur des Unternehmens und nach den Regeln des AI Engineering: getestet, dokumentiert, mit Schnittstellen zu Ihren Systemen.", result: "Produktiver KI-gestützter Arbeitsablauf" },
  { n: "05", title: "Übergeben",      desc: "Die Lösung geht über das Freigabeverfahren des Unternehmens in den Betrieb. Die Nutzer werden eingewiesen, Zuständigkeiten sind benannt, und die Kennzahlen fließen in den Fahrplan zurück.", result: "Lösung im Regelbetrieb, Erfahrungen für den nächsten Fall" },
];

export const PHASE_DARSTELLUNG = { haken: "✓", ergebnisLabel: "Ergebnis: " };

export const PRINZIPIEN = {
  h2: "Sechs Prinzipien, die unsere Arbeit leiten.",
  liste: [
  { title: "Pragmatisch",      desc: "Kein Hype, keine Spielereien. Nur was funktioniert und echten Nutzen bringt." },
  { title: "Messbar",          desc: "Jedes Projekt hat klare Ziele, Metriken und eine Entscheidungsgrundlage." },
  { title: "Sicher",           desc: "Datenschutz und Governance sind kein Nachgedanke, sondern Grundlage." },
  { title: "Verständlich",     desc: "Komplexe KI-Themen werden so erklärt, dass alle Beteiligten mitreden können." },
  { title: "Menschzentriert",  desc: "KI unterstützt Menschen, sie ersetzt sie nicht." },
  { title: "Herstellerneutral",     desc: "Wir sind an keinen Anbieter gebunden und empfehlen, was zu Ihnen passt." },
],
};

export const ABSCHLUSS = {
  h2: "Bereit, gemeinsam zu starten?",
  cta: { text: "KI-Potenzialcheck buchen", href: KI_CHECK_BUCHEN, extern: true },
};
