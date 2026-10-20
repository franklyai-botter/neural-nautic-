import type { Metadata } from "next";

// /kontakt ist eine Client-Komponente ("use client"), Metadaten deshalb hier im Layout.
export const metadata: Metadata = {
  title: "Kontakt: KI-Potenzialcheck anfragen | NeuralNautic",
  description: "Erste Orientierung, konkreter Anwendungsfall oder Pilotprojekt: Schreiben Sie uns. KI-Beratung für den Mittelstand in Berlin, bundesweit und im DACH-Raum.",
  openGraph: { title: "Kontakt: KI-Potenzialcheck anfragen", description: "Erste Orientierung, konkreter Anwendungsfall oder Pilotprojekt: Schreiben Sie uns.", url: "/kontakt" },
};

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return children;
}
