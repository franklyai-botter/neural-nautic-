// Kopf und Fuß der Live-Seite als Daten. Quelle: neural-nautic-live @ 447000b
// (app/components/Header.tsx, app/components/Footer.tsx, app/components/LinkedInButton.tsx).
import { KI_CHECK_BUCHEN, LINKEDIN_COMPANY_URL, LINKEDIN_URL, X_URL } from "./site.js";

// --- Kopf (Header.tsx) --------------------------------------------------------
export const KOPF = {
  logo: { src: "/logo-star.png", alt: "NeuralNautic", width: 48, height: 48, href: "/" },
  wortmarke: "NeuralNautic",
  cta: { text: "KI-Check buchen", href: KI_CHECK_BUCHEN, extern: true },
  burger: { oeffnen: "Menü öffnen", schliessen: "Menü schließen" },
  untermenueZeichen: "▾",
};

// Hauptmenü der Live-Seite, mit Untermenüs.
// Ganzheitlich: erst das Unternehmen, dann das einzelne Projekt, dann wie gebaut wird.
// Kaufen oder bauen: fertige Werkzeuge auswählen oder selbst entwickeln.
export const LINKS = [
  { label: "Leistungen",      href: "/leistungen" },
  { label: "Methode",         href: "/ki-im-unternehmen", children: [
    { label: "Im Unternehmen",  href: "/ki-im-unternehmen" },
    { label: "Im Projekt",      href: "/methode" },
  ] },
  { label: "KI Tool Kompass", href: "/ki-tool-kompass", children: [
    { label: "Werkzeuge auswählen", href: "/ki-tool-kompass" },
    { label: "Selbst entwickeln: AI Engineering", href: "/ai-engineering" },
  ] },
  { label: "Ausguck",         href: "/wissen" },
  { label: "Über mich",       href: "/ueber-mich" },
];

// --- Fuß (Footer.tsx) ---------------------------------------------------------
export const FUSS = {
  logo: { src: "/logo-monogram.png", alt: "NeuralNautic", width: 54, height: 54 },
  claim: "Pragmatische KI-Beratung. Für den Mittelstand gebaut. Für regulierte Branchen gehärtet.",
  ort: "Berlin · Bundesweit · DACH",
  // Auf der Live-Seite steht das laufende Jahr: „© {Jahr} · NeuralNautic · in Gründung · Frank Schütt“.
  copyright: (jahr = new Date().getFullYear()) => `© ${jahr} · NeuralNautic · in Gründung · Frank Schütt`,
  copyrightNach: " · NeuralNautic · in Gründung · Frank Schütt",
  recht: [["Impressum", "/impressum"], ["Datenschutz", "/datenschutz"]],
};

// Spalten des Footers: [Überschrift, [[Text, Ziel], …]]. Externe Ziele (http…) öffnen in neuem Tab;
// die beiden LinkedIn-Einträge tragen auf der Live-Seite das LinkedIn-Zeichen davor.
export const SPALTEN = [
  ["Leistungen", [
    ["KI-Potenzialanalyse", "/leistungen"],
    ["KI-Architektur",      "/leistungen"],
    ["Controlled Pilot",    "/leistungen"],
    ["KI-Automatisierung",  "/leistungen"],
    ["Agentic Engineering", "/ai-engineering"],
    ["KI-Governance",       "/leistungen"],
    ["KI-Schulung",         "/leistungen"],
  ]],
  ["Angebote", [
    ["KI im Unternehmen", "/ki-im-unternehmen"],
    ["KI im Projekt",  "/methode"],
    ["AI Engineering", "/ai-engineering"],
    ["KI Tool Kompass","/ki-tool-kompass"],
    ["Ausguck",        "/wissen"],
  ]],
  ["Kontakt", [
    ["Über mich",  "/ueber-mich"],
    ["Anfrage senden", "/kontakt"],
    ["LinkedIn Frank ↗", LINKEDIN_URL],
    ["LinkedIn NeuralNautic ↗", LINKEDIN_COMPANY_URL],
    ["X @FSchuettNN ↗", X_URL],
    ["FOR42.ai ↗", "https://for42.ai"],
  ]],
];

// --- LinkedIn-Knopf (LinkedInButton.tsx), auf /ueber-mich ---------------------
export const LINKEDIN_KNOPF = {
  label: "Auf LinkedIn folgen",
  href: LINKEDIN_URL,
  ariaLabel: "Auf LinkedIn folgen (öffnet LinkedIn in neuem Tab)",
  pfeil: "↗",
  // Offizielles LinkedIn-„in“-Zeichen (Form aus Simple Icons, CC0), Farbe nach LinkedIn-Markenrichtlinie.
  // Nicht umfärben oder verzerren, nur skalieren.
  farbe: "#0A66C2",
};
