import type { Metadata } from "next";
import { Italiana, Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const italiana = Italiana({ weight: "400", subsets: ["latin"], variable: "--font-italiana" });
const cormorant = Cormorant_Garamond({ weight: ["300","400","500"], style: ["normal","italic"], subsets: ["latin"], variable: "--font-cormorant" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ weight: ["400","500"], subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "KI-Beratung für den Mittelstand | NeuralNautic",
  description: "Pragmatische KI-Beratung für Unternehmen: Potenzialanalyse, Controlled Pilot, KI-Automatisierung, Governance, Schulung und Tool-Auswahl.",
  keywords: "KI-Beratung Mittelstand, KI-Automatisierung, KI-Potenzialanalyse, KI-Governance, Controlled AI Pilot, KI-Schulung",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${italiana.variable} ${cormorant.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
