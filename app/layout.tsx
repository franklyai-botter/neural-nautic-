import type { Metadata, Viewport } from "next";
import { Inter_Tight, Inter, JetBrains_Mono } from "next/font/google";
import ChatWidget from "./components/ChatWidget";
import NeuralBackground from "./components/NeuralBackground";
import "./globals.css";

// Überschriften in Inter Tight wie for42.ai (Frank 29.10.2026). Italiana und Cormorant sind raus;
// ihre Variablen --font-italiana / --font-cormorant zeigen in globals.css auf --font-display.
const display = Inter_Tight({ weight: ["500", "600", "700"], subsets: ["latin"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ weight: ["400","500"], subsets: ["latin"], variable: "--font-jetbrains" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "KI-Beratung für den Mittelstand | NeuralNautic",
  description: "Pragmatische KI-Beratung für Unternehmen: Potenzialanalyse, Controlled Pilot, KI-Automatisierung, Governance, Schulung und Werkzeugauswahl.",
  keywords: "KI-Beratung Mittelstand, KI-Beratung KMU, KI-Automatisierung, KI-Potenzialanalyse, KI-Governance, Controlled AI Pilot, KI-Schulung",
  // Google Search Console, Property https://neuralnautic.de/ — muss bleiben,
  // sonst verliert das Konto die Bestaetigung und damit den Zugriff auf die Daten.
  // Bing Webmaster Tools (seit 21.10.2026, Microsoft-Konto von Frank): msvalidate.01 — ebenso bleiben.
  verification: {
    google: "typZi4c5OCY5dq0a-n3W-PnLEDYXUK1wwrJcNquXOQg",
    other: { "msvalidate.01": "3C8697890156E133718E943ECB712C0E" },
  },
  // Archiv alt.neuralnautic.de (Zweig `alt`, 17.11.2026): nie indexieren. metadataBase zeigt auf das
  // Archiv, damit die relativen Canonicals der Seiten nicht auf die neue neuralnautic.de zeigen.
  robots: { index: false, follow: false },
  // Vorschau beim Teilen (LinkedIn, Messenger). Ohne diese Angaben baut LinkedIn keine Link-Vorschau.
  metadataBase: new URL("https://alt.neuralnautic.de"),
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "NeuralNautic",
    title: "NeuralNautic: Gemeinsam KI in echte Arbeitsprozesse bringen",
    description: "KI-Beratung für den Mittelstand: in Berlin, bundesweit und im DACH-Raum.",
    url: "/",
    images: [{ url: "/og/neuralnautic-og.png", width: 1200, height: 627, alt: "NeuralNautic: Gemeinsam KI in echte Arbeitsprozesse bringen" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${display.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <NeuralBackground />
        <div
          role="note"
          style={{
            position: "relative", zIndex: 30, padding: "8px 16px", textAlign: "center",
            fontSize: 13, lineHeight: 1.4, background: "#0A4A4A", color: "#FFFFFF",
          }}
        >
          Archiv: alte Fassung von neuralnautic.de, Stand bis 17.11.2026 – aktuelle Seite:{" "}
          <a href="https://neuralnautic.de" style={{ color: "#00D4D4", textDecoration: "underline" }}>
            neuralnautic.de
          </a>
        </div>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
