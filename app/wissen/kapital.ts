// Investitionsausgaben (Capex) von Microsoft, Alphabet, Amazon, Meta je Kalenderquartal, Mrd. USD nominal.
// Primärquelle: SEC EDGAR XBRL companyfacts (10-Q/10-K), Amazon Q3 2026 aus dem Earnings Release vom
// 29.10.2026 (10-Q stand noch aus). Zeilen: MSFT „Additions to property and equipment“, GOOGL/AMZN
// „Purchases of property and equipment“ (Amazon brutto), META „Purchases of property and equipment“
// (netto, zuletzt berichtet). Ohne Finanzierungsleasing. Microsoft vom Geschäftsjahr (bis 30.6.) auf
// Kalenderquartale umgerechnet. Abgerufen 29.10.2026; Rohdaten und Accession-Nummern im Arbeitsordner
// der Recherche. Stichprobe: Alphabet 9M 2026 laut SEC 131,953 = 35,7 + 44,9 + 51,4.

export const KAPITAL_QUARTALE = [
  { q: "2023-Q1", summe: 33.9 }, { q: "2023-Q2", summe: 33.4 }, { q: "2023-Q3", summe: 36.9 }, { q: "2023-Q4", summe: 42.9 },
  { q: "2024-Q1", summe: 44.3 }, { q: "2024-Q2", summe: 52.9 }, { q: "2024-Q3", summe: 58.9 }, { q: "2024-Q4", summe: 72.3 },
  { q: "2025-Q1", summe: 71.9 }, { q: "2025-Q2", summe: 88.2 }, { q: "2025-Q3", summe: 97.3 }, { q: "2025-Q4", summe: 118.6 },
  { q: "2026-Q1", summe: 129.8 }, { q: "2026-Q2", summe: 165.1 }, { q: "2026-Q3", summe: 201.9 },
];

// Vergleichsgrößen in 2025-USD (CPI-U, BLS). Apollo: Planetary Society nach NASA-Haushaltsdaten.
// Interstate (≥ 305 Mrd., FHWA) weggelassen: fast gleich groß wie Apollo, die Ringe lägen übereinander.
// Manhattan-Projekt: Brookings (21,57 Mrd. in 1996-USD), hochgerechnet.
// ISS bewusst nicht dabei: nur der NASA-Anteil bis 2013 ist amtlich belegt (NASA OIG IG-14-031).
export const KAPITAL_VERGLEICHE = [
  { name: "Manhattan-Projekt", mrd: 44 },
  { name: "Apollo-Programm", mrd: 309 },
];
