// /kontakt als Daten. Quelle: neural-nautic-live @ 447000b,
// app/kontakt/page.tsx, app/kontakt/layout.tsx. Wörtlich.
// BACKEND (Welle 2): Das Formular sendet per POST an /api/contact, der Versand läuft über Resend
// (Regeln und Mailtext in backend.js). Ohne Backend funktioniert das Absenden nicht.

export const ROUTE = "/kontakt";

export const META = {
  title: "Kontakt: KI-Potenzialcheck anfragen | NeuralNautic",
  alternates: { canonical: "/kontakt" },
  description: "Erste Orientierung, konkreter Anwendungsfall oder Pilotprojekt: Schreiben Sie uns. KI-Beratung für den Mittelstand in Berlin, bundesweit und im DACH-Raum.",
  openGraph: { title: "Kontakt: KI-Potenzialcheck anfragen", description: "Erste Orientierung, konkreter Anwendungsfall oder Pilotprojekt: Schreiben Sie uns.", url: "/kontakt" },
};

export const KOPF = {
  eyebrow: "Kontakt",
  h1: "Lassen Sie uns über sinnvolle KI in Ihrem Unternehmen sprechen.",
  text: "Ob erste Orientierung, konkreter Anwendungsfall oder geplantes Pilotprojekt: Wir freuen uns auf Ihre Anfrage.",
};

// Die 7 Anliegen der Auswahlliste.
export const ANLIEGEN = [
  "KI-Potenzialanalyse", "Controlled Pilot", "KI-Automatisierung",
  "KI-Governance", "KI-Schulung", "Werkzeugauswahl", "Allgemeine Anfrage",
];

export const FORMULAR = {
  endpoint: "/api/contact",
  // Gesendet wird als JSON: { name, company, email, phone, topic, message }
  anfrage: { methode: "POST", contentType: "application/json", felder: ["name", "company", "email", "phone", "topic", "message"] },
  // Reihenfolge wie auf der Live-Seite: zwei Zeilen mit je zwei Feldern, dann Anliegen, dann Nachricht.
  felder: [
    { name: "name", label: "Name *", type: "text", pflicht: true, placeholder: "Ihr Name" },
    { name: "company", label: "Unternehmen *", type: "text", pflicht: true, placeholder: "Ihr Unternehmen" },
    { name: "email", label: "E-Mail *", type: "email", pflicht: true, placeholder: "ihre@email.de" },
    { name: "phone", label: "Telefon (optional)", type: "text", pflicht: false, placeholder: "+49 ..." },
    { name: "topic", label: "Anliegen *", type: "select", pflicht: true, leerOption: "Bitte wählen …", optionen: ANLIEGEN },
    { name: "message", label: "Nachricht *", type: "textarea", zeilen: 6, pflicht: true, placeholder: "Beschreiben Sie kurz Ihr Anliegen oder Ihren Anwendungsfall …" },
  ],
  knopf: "Anfrage senden →",
  ladeText: "Wird gesendet …",
  fehlerStandard: "Unbekannter Fehler. Bitte versuchen Sie es erneut.",
  datenhinweis: "Ihre Daten werden ausschließlich zur Bearbeitung Ihrer Anfrage verwendet und nicht an Dritte weitergegeben.",
};

// Danke-Zustand nach erfolgreichem Absenden (ersetzt das Formular).
export const DANKE = {
  zeichen: "✓",
  h2: "Danke für Ihre Anfrage.",
  text: "Wir melden uns in der Regel innerhalb von 24 Stunden bei Ihnen.",
};
