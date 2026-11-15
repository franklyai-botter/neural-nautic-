// /ueber-mich als Daten. Quelle: neural-nautic-live @ 447000b,
// app/ueber-mich/page.tsx, app/components/NnFilm.tsx, NnHud.tsx, LinkedInButton.tsx. Wörtlich.
import { LINKEDIN_COMPANY_URL, LINKEDIN_URL, SITE_URL, X_URL } from "./site.js";
export { LINKEDIN_KNOPF } from "./navigation.js";

export const ROUTE = "/ueber-mich";

export const META = {
  title: "Über mich: Frank Schütt, KI-Berater | NeuralNautic",
  alternates: { canonical: "/ueber-mich" },
  description: "Frank Schütt, KI-Berater für den Mittelstand in Berlin, bundesweit und im DACH-Raum. Gemeinsam KI in Arbeitsprozesse bringen: Anwendungsfälle finden, Lösungen umsetzen, DSGVO und EU AI Act von Anfang an mitgedacht.",
  openGraph: {
    type: "profile",
    title: "Frank Schütt, KI-Berater für den Mittelstand",
    description: "Gemeinsam KI in Arbeitsprozesse bringen: Anwendungsfälle finden, Lösungen umsetzen, DSGVO und EU AI Act von Anfang an mitgedacht.",
    url: "/ueber-mich",
    images: [{ url: "/og/frank-schuett.jpg", width: 1200, height: 627, alt: "Frank Schütt" }],
  },
};

// Strukturierte Daten für Suchmaschinen und KI-Suche: dieselbe Person wie auf LinkedIn (sameAs).
// Angaben gleich halten mit dem LinkedIn-Profil. Als <script type="application/ld+json"> ausgeben,
// dabei „<“ als < maskieren. image zeigt auf das echte Porträt.
export const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/ueber-mich#frank-schuett`,
  name: "Frank Schütt",
  jobTitle: "KI-Berater für den Mittelstand",
  description: "Gemeinsam KI in Arbeitsprozesse bringen: Anwendungsfälle finden, Lösungen umsetzen, DSGVO und EU AI Act von Anfang an mitgedacht.",
  url: `${SITE_URL}/ueber-mich`,
  image: `${SITE_URL}/frank-portrait.webp`,
  sameAs: [LINKEDIN_URL, X_URL],
  worksFor: { "@type": "Organization", name: "NeuralNautic", url: SITE_URL, sameAs: [LINKEDIN_COMPANY_URL] },
  affiliation: { "@type": "Organization", name: "for42.ai", url: "https://for42.ai" },
  address: { "@type": "PostalAddress", addressLocality: "Berlin", addressCountry: "DE" },
  areaServed: ["Berlin", "Deutschland", "DACH"],
  knowsAbout: ["KI-Strategie", "KI-Einführung", "KI-Architektur", "Retrieval-Augmented Generation", "Agentic Engineering", "Prozessautomatisierung", "Datenschutz (DSGVO)", "EU AI Act", "Veränderungsmanagement"],
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "AI Strategy & Application Expert",
      credentialCategory: "Zertifikat",
      identifier: "Z-001124711",
      dateCreated: "2025-12-04",
      url: `${SITE_URL}/cert-tuev-sued.pdf`,
      recognizedBy: { "@type": "Organization", name: "TÜV SÜD Akademie" },
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "KI Applikations- und Strategieexperte",
      credentialCategory: "Zertifikat",
      dateCreated: "2025-08-04",
      recognizedBy: { "@type": "Organization", name: "Neurawork" },
    },
  ],
};

export const KOPF = {
  eyebrow: "Über mich",
  h1: "Gemeinsam KI in Arbeitsprozesse bringen.",
  text: "Mein Fokus liegt auf pragmatischer KI-Einführung für Unternehmen: verständlich, sicher, messbar und umsetzbar.",
};

// KI-Film (NnFilm.tsx): Unterlagen wirbeln zur Kugel und werden zur KI-Architektur, am Ende das
// NN-Monogramm. KI-generiert aus Franks Porträt. Art. 50 Abs. 4 AI Act: fester Hinweis „KI-generiert“.
// Stumm, Schleife, nur im Sichtbereich (ab 20 % sichtbar); bei prefers-reduced-motion nur Standbild.
export const FILM = {
  video: { src: "/frank-ki/film.mp4", datei: "/inhalt/frank-ki/film.mp4" },
  poster: { src: "/frank-ki/film.webp", datei: "/inhalt/frank-ki/film.webp" },
  seitenverhaeltnis: "16 / 9",
  ariaLabel: "KI-generierter Film: Unterlagen wirbeln zu einer Kugel und werden zu einer KI-Architektur",
  standbildAlt: "KI-generiertes Standbild: Frank Schütt in einer Kugel aus Unterlagen",
  kennzeichnung: "KI-generiert",
  regeln: { stumm: true, schleife: true, playsInline: true, preload: "metadata", sichtbarAb: 0.2, reduzierteBewegung: "nur Standbild" },
};

// Überwachungs-Karte statt Porträt (NnHud.tsx): KI-Video + Analyse-Overlay in NN-Farben (Petrol, Aqua).
// Art. 50 Abs. 4 AI Act: fester Hinweis „KI-generiert“. Video nur im Sichtbereich (ab 25 % sichtbar),
// bei prefers-reduced-motion nur Standbild. Das echte Porträt steht im Abgleich-Panel der Karte.
export const HUD = {
  ariaLabel: "KI-generiertes Video von Frank Schütt mit Analyse-Overlay",
  video: { src: "/frank-ki/ueberwachung.mp4", datei: "/inhalt/frank-ki/ueberwachung.mp4" },
  poster: { src: "/frank-ki/ueberwachung.webp", datei: "/inhalt/frank-ki/ueberwachung.webp" },
  portrait: { src: "/frank-portrait.webp", datei: "/inhalt/frank-portrait.webp" },
  // Abgleich-Panel (Frank, 15.11.2026): sein LinkedIn-Profilbild statt des alten Porträts (oranger Pullover).
  // Quelle Downloads/linkedin-profilbild-672.jpg, Ausschnitt 4:5 (20,40)–(440,565), Gesicht mittig.
  portraitAbgleich: { datei: "/inhalt/frank-linkedin.webp" },
  // Rahmen um das Gesicht, läuft mit dem Video mit:
  gesichtText: "FACE ID: MATCH",
  // Gesichtsspur im 4:5-Ausschnitt: [Sekunde, x %, y %, Rahmenbreite %]. Zwischen den Punkten wird
  // linear interpoliert; Rahmenhöhe = Breite × 0,8.
  spur: [[0, 51, 33, 13], [1.5, 59, 33, 13], [3, 51, 34, 14], [4.5, 58, 35, 15], [6.2, 59, 37, 15]],
  abgleich: {
    titel: "PROFIL ABGEGLICHEN",
    // Im Original mit geschützten Leerzeichen ausgerichtet: „ID    : NN-FS“
    daten: ["ID    : NN-FS", "STATUS: VERIFIZIERT", "MATCH : 98.6%"],
  },
  // label wird in Großbuchstaben gezeigt (KERN, METHODE, STACK, WEG)
  skills: [
  { label: "Kern", value: "KI-Architektur" },
  { label: "Methode", value: "Agentic Engineering" },
  { label: "Stack", value: "RAG-Pipelines" },
  { label: "Weg", value: "Bedarf → Workflow" },
],
  rec: "REC",
  kennzeichnung: "KI-generiert",
  // Laufende Uhr unten: „JJJJ-MM-TT HH:MM:SS“, jede Sekunde neu
  zeitFormat: "YYYY-MM-DD HH:mm:ss",
  regeln: { stumm: true, schleife: true, playsInline: true, preload: "none", sichtbarAb: 0.25, reduzierteBewegung: "nur Standbild" },
};

export const PROFIL = {
  // Unter der Karte:
  name: "Frank Schütt",
  rolle: "KI-Berater",
  ort: "Berlin · Bundesweit · DACH",
  absaetze: [
    "Ich unterstütze Unternehmen dabei, künstliche Intelligenz nicht nur zu verstehen, sondern sinnvoll in den Arbeitsalltag zu integrieren.",
    "Dabei verbinde ich KI-Verständnis, Prozessdenken, Werkzeugkenntnis und den Blick auf Veränderungsprozesse. Mein Ansatz ist pragmatisch: Erst verstehen wir das Problem, dann wählen wir die passende Lösung.",
    "Ich arbeite besonders gern an Schnittstellen zwischen Geschäftsführung, IT, Fachabteilungen, Datenschutz und operativen Teams. Denn erfolgreiche KI-Einführung ist nicht nur eine technische Aufgabe. Sie ist auch eine Frage von Akzeptanz, Verantwortung und klarer Kommunikation.",
  ],
  staerken: {
    h2: "Was mich auszeichnet",
    haken: "✓",
    liste: [
  "Verständliche Übersetzung komplexer KI-Themen",
  "Fokus auf reale Prozesse statt abstrakte Hype-Themen",
  "Erfahrung mit Werkzeugauswahl, Automatisierung und KI-gestützten Arbeitsabläufen",
  "Blick für Datenschutz, Governance und organisatorische Einführung",
  "Kombination aus Strategie, Umsetzung und Schulung",
  "Mittelstandstauglicher Beratungsstil",
],
  },
  cta: { text: "Gespräch anfragen", href: "/kontakt" },
  // Daneben der LinkedIn-Knopf (LINKEDIN_KNOPF).
};

const VIRTUALBADGE = "https://www.virtualbadge.io/certificate-validator?credential=f2d4fd9a-dccc-4363-ada5-287b0a2b5f01";

export const ZERTIFIKATE = {
  id: "zertifikate",
  eyebrow: "Externe Validierung",
  h2: "Geprüft bei TÜV SÜD. Bewährt in der Praxis.",
  text: "Zwei Nachweise auf zwei Ebenen: Strategie mit Prüfung der TÜV SÜD Akademie, Umsetzung aus der Praxis.",
  karten: [
    {
      aussteller: "TÜV SÜD AKADEMIE",
      ebene: "Strategische Kompetenz",
      titel: "AI Strategy & Application Expert",
      text: "Strategische KI-Kompetenz, online geprüft bei der TÜV SÜD Akademie.",
      inhalte: ["Strategie · Fahrpläne · Implementierung · Risikomanagement"],
      nachweis: "04.12.2025  ·  Z-001124711",
      bild: { src: "/zertifikate/tuev-sued-vorschau.webp", datei: "/inhalt/zertifikate/tuev-sued-vorschau.webp", alt: "Zertifikat TÜV SÜD Akademie – AI Strategy & Application Expert", width: 509, height: 720 },
      bildAriaLabel: "Zertifikat TÜV SÜD Akademie – AI Strategy & Application Expert ansehen",
      link: { text: "Zertifikat ansehen →", href: "/cert-tuev-sued.pdf", datei: "/inhalt/cert-tuev-sued.pdf", extern: true },
    },
    {
      aussteller: "NEURAWORK",
      ebene: "Umsetzungs-Kompetenz",
      titel: "KI Applikations- und Strategieexperte",
      text: "KI in die Praxis bringen: Prozesse, Automatisierung, Veränderung im Team.",
      // zwei Zeilen untereinander
      inhalte: ["Erworben im Programm KI Business Coaching", "KI-First-Strategie · Change Management · Prozessintegration · Automatisierung"],
      nachweis: "04.08.2025  ·  Virtualbadge verifiziert",
      bild: { src: "/zertifikate/neurawork-vorschau.webp", datei: "/inhalt/zertifikate/neurawork-vorschau.webp", alt: "Zertifikat Neurawork – KI Applikations- und Strategieexperte", width: 720, height: 556 },
      bildAriaLabel: "Zertifikat Neurawork ansehen",
      link: { text: "Zertifikat ansehen →", href: VIRTUALBADGE, extern: true },
    },
  ],
};
