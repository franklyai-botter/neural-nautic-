import type { Metadata, Viewport } from "next";
import { Italiana, Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import ChatWidget from "./components/ChatWidget";
import NeuralBackground from "./components/NeuralBackground";
import "./globals.css";

const italiana = Italiana({ weight: "400", subsets: ["latin"], variable: "--font-italiana" });
const cormorant = Cormorant_Garamond({ weight: ["300","400","500"], style: ["normal","italic"], subsets: ["latin"], variable: "--font-cormorant" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ weight: ["400","500"], subsets: ["latin"], variable: "--font-jetbrains" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "KI-Beratung für den Mittelstand | NeuralNautic",
  description: "Pragmatische KI-Beratung für Unternehmen: Potenzialanalyse, Controlled Pilot, KI-Automatisierung, Governance, Schulung und Tool-Auswahl.",
  keywords: "KI-Beratung Mittelstand, KI-Automatisierung, KI-Potenzialanalyse, KI-Governance, Controlled AI Pilot, KI-Schulung",
  // Google Search Console, Property https://neuralnautic.de/ — muss bleiben,
  // sonst verliert das Konto die Bestaetigung und damit den Zugriff auf die Daten.
  verification: { google: "typZi4c5OCY5dq0a-n3W-PnLEDYXUK1wwrJcNquXOQg" },
  // Vorschau beim Teilen (LinkedIn, Messenger). Ohne diese Angaben baut LinkedIn keine Link-Vorschau.
  metadataBase: new URL("https://neuralnautic.de"),
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "NeuralNautic",
    title: "NeuralNautic: Gemeinsam KI in echte Arbeitsprozesse bringen",
    description: "KI-Beratung für Kanzleien und Mittelstand: in Berlin, bundesweit und im DACH-Raum.",
    url: "/",
    images: [{ url: "/og/neuralnautic-og.png", width: 1200, height: 627, alt: "NeuralNautic: Gemeinsam KI in echte Arbeitsprozesse bringen" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${italiana.variable} ${cormorant.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <NeuralBackground />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
