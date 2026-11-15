// Inhalt der Live-Seite neuralnautic.de als Daten. Quelle: neural-nautic-live @ 447000b
// (app/site.ts, app/layout.tsx, app/sitemap.ts, app/robots.ts, next.config.ts).
// Wörtlich übernommen, nichts umformuliert. Zuordnung: docs/ABNAHME-INHALTE.md.

// --- app/site.ts -----------------------------------------------------------
// Kanonische Adresse der Website.
export const SITE_URL = "https://neuralnautic.de";
// LinkedIn-Profil von Frank (Personal Brand).
export const LINKEDIN_URL = "https://www.linkedin.com/in/frank-schuett/";
// LinkedIn-Unternehmensseite NeuralNautic.
export const LINKEDIN_COMPANY_URL = "https://www.linkedin.com/company/neuralnautic/";
// X-Profil von Frank.
export const X_URL = "https://x.com/FSchuettNN";
// Buchungsseite KI-Potenzialcheck (Calendly, 30 Min, Google Meet). Bewusst Link statt eingebettetem
// Kalender: Daten fließen erst an Calendly, wenn jemand klickt. Jeder „… buchen“-Knopf zeigt hierher.
export const KI_CHECK_BUCHEN = "https://calendly.com/frankschuettai-neuralnautic/ki-potenzialcheck";
// Im Footer und in den strukturierten Daten verlinkt.
export const FOR42_URL = "https://for42.ai";

// --- app/layout.tsx: Standard-Metadaten (gelten, wo eine Seite nichts Eigenes setzt) ---
export const META_STANDARD = {
  lang: "de",
  title: "KI-Beratung für den Mittelstand | NeuralNautic",
  description: "Pragmatische KI-Beratung für Unternehmen: Potenzialanalyse, Controlled Pilot, KI-Automatisierung, Governance, Schulung und Werkzeugauswahl.",
  keywords: "KI-Beratung Mittelstand, KI-Beratung KMU, KI-Automatisierung, KI-Potenzialanalyse, KI-Governance, Controlled AI Pilot, KI-Schulung",
  // Verifizierungen der Live-Domain (Google Search Console, Bing Webmaster Tools).
  // Gelten für https://neuralnautic.de/. Ein Funnel auf einer Subdomain braucht eigene.
  verification: {
    google: "typZi4c5OCY5dq0a-n3W-PnLEDYXUK1wwrJcNquXOQg",
    other: { "msvalidate.01": "3C8697890156E133718E943ECB712C0E" },
  },
  metadataBase: "https://neuralnautic.de",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "NeuralNautic",
    title: "NeuralNautic: Gemeinsam KI in Arbeitsprozesse bringen",
    description: "KI-Beratung für den Mittelstand: in Berlin, bundesweit und im DACH-Raum.",
    url: "/",
    // Bild der Live-Seite: /og/neuralnautic-og.png (1200 × 627). Nicht kopiert, weil es Logos enthält
    // (NN-Monogramm, for42-Wortmarke). Für den Funnel neu aus public/brand/ erzeugen.
    images: [{ url: "/og/neuralnautic-og.png", width: 1200, height: 627, alt: "NeuralNautic: Gemeinsam KI in Arbeitsprozesse bringen" }],
  },
  twitter: { card: "summary_large_image" },
  viewport: { width: "device-width", initialScale: 1, viewportFit: "cover" },
};

// Startseite: app/page.tsx setzt nur die kanonische Adresse, Titel und Beschreibung kommen aus META_STANDARD.
export const META_START = { canonical: "/" };

// Schriften der Live-Seite (next/font/google).
export const SCHRIFTEN = [
  { name: "Inter Tight", gewichte: ["500", "600", "700"], rolle: "Überschriften", variable: "--font-display" },
  { name: "Inter", gewichte: [], rolle: "Fließtext", variable: "--font-inter" },
  { name: "JetBrains Mono", gewichte: ["400", "500"], rolle: "Kennzeichen, Nummern", variable: "--font-jetbrains" },
];

// Auf jeder Live-Seite eingebunden (app/layout.tsx): neuronaler Hintergrund (nur Grafik, kein Text)
// und das Chat-Fenster (Texte in chat.js).
export const GLOBALE_BAUTEILE = ["NeuralBackground", "ChatWidget"];

// --- app/sitemap.ts ---------------------------------------------------------
export const SITEMAP = [
  { path: "/", lastModified: "2026-10-29", priority: 1 },
  { path: "/leistungen", lastModified: "2026-10-29", priority: 0.9 },
  { path: "/methode", lastModified: "2026-10-29", priority: 0.8 },
  { path: "/ki-im-unternehmen", lastModified: "2026-10-29", priority: 0.8 },
  { path: "/ai-engineering", lastModified: "2026-10-29", priority: 0.8 },
  { path: "/ki-tool-kompass", lastModified: "2026-10-29", priority: 0.8 },
  { path: "/wissen", lastModified: "2026-10-29", priority: 0.7 },
  { path: "/ueber-mich", lastModified: "2026-10-29", priority: 0.7 },
  { path: "/kontakt", lastModified: "2026-10-29", priority: 0.6 },
  { path: "/impressum", lastModified: "2026-10-29", priority: 0.2 },
  { path: "/datenschutz", lastModified: "2026-10-29", priority: 0.2 },
];

// --- app/robots.ts ----------------------------------------------------------
export const ROBOTS = {
  rules: { userAgent: "*", allow: "/", disallow: "/api/" },
  sitemap: `${SITE_URL}/sitemap.xml`,
};

// --- next.config.ts ---------------------------------------------------------
// /use-cases ist entfallen (29.10.2026), war auf der Live-Seite indexiert: dauerhaft auf /leistungen.
export const WEITERLEITUNGEN = [{ source: "/use-cases", destination: "/leistungen", permanent: true }];

// --- Dateien: Pfad auf der Live-Seite -> Pfad im Funnel ----------------------
// Medien liegen unter public/inhalt/ (Namen behalten). Logos kommen aus public/brand/
// (byte-gleich mit den Live-Dateien, per SHA-1 geprüft am 14.11.2026) und wurden nicht kopiert.
export const DATEIEN = {
  "/frank-ki/film.mp4": "/inhalt/frank-ki/film.mp4",
  "/frank-ki/film.webp": "/inhalt/frank-ki/film.webp",
  "/frank-ki/ueberwachung.mp4": "/inhalt/frank-ki/ueberwachung.mp4",
  "/frank-ki/ueberwachung.webp": "/inhalt/frank-ki/ueberwachung.webp",
  "/frank-portrait.webp": "/inhalt/frank-portrait.webp",
  "/cert-tuev-sued.pdf": "/inhalt/cert-tuev-sued.pdf",
  "/zertifikate/tuev-sued-vorschau.webp": "/inhalt/zertifikate/tuev-sued-vorschau.webp",
  "/zertifikate/neurawork-vorschau.webp": "/inhalt/zertifikate/neurawork-vorschau.webp",
  "/architektur/ki-architektur-vorschau.jpg": "/inhalt/architektur/ki-architektur-vorschau.jpg",
  "/architektur/szene.json": "/inhalt/architektur/szene.json",
  "/architektur/model3d.js": "/inhalt/architektur/model3d.js",
  "/architektur/model3d.css": "/inhalt/architektur/model3d.css",
  "/og/frank-schuett.jpg": "/inhalt/og/frank-schuett.jpg",
  // Logos: nur aus public/brand/
  "/logo-star.png": "/brand/nn-stern-2026-10-kompass.png",
  "/logo-monogram.png": "/brand/nn-monogramm.png",
  "/partner/for42-wordmark.svg": "/brand/partner/for42-wordmark.svg",
  "/partner/springgate-logo.png": "/brand/partner/springgate-logo.png",
  "/partner/karlson-logo.png": "/brand/partner/karlson-logo.png",
};

// Hilfsfunktion: Live-Pfad in den Funnel-Pfad übersetzen (unbekannte Pfade bleiben unverändert).
export const datei = (livePfad) => DATEIEN[livePfad] ?? livePfad;
