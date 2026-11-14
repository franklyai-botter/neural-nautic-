// /wissen (Ausguck) als Daten. Quelle: neural-nautic-live @ 447000b,
// app/wissen/page.tsx, app/wissen/kapital.ts, app/components/KapitalWolke.tsx. Wörtlich.

export const ROUTE = "/wissen";

export const META = {
  title: "Ausguck: KI-Studien, Recht und Markt eingeordnet | NeuralNautic",
  alternates: { canonical: "/wissen" },
  description: "Studien, Recht und Markt rund um KI, je mit Kernaussage, Quelle und Bedeutung für den Mittelstand.",
  openGraph: { title: "Ausguck: KI eingeordnet für den Mittelstand", description: "Studien, Recht und Markt rund um KI, je mit Kernaussage, Quelle und Bedeutung für Unternehmen.", url: "/wissen" },
};

export const KOPF = {
  eyebrow: "Ausguck",
  h1: "Was am Horizont auftaucht, eingeordnet für den Mittelstand",
  text: "Studien, Recht und Markt rund um KI: je eine Kernaussage, die Quelle und was es für Ihr Unternehmen heißt. Kurz, belegt und ohne Hype.",
};

export const LISTE = { h2: "Aktuelle Einordnungen" };

// Ausguck: kurze, belegte Einordnungen. Jede Zahl mit Quelle; Sekundärquellen als solche gekennzeichnet.
// rubrik, stand (Datum), titel, befund, folge, quelle, link (optional), grafik: "kapital" (optional:
// unter dem Befund steht die Kapital-Wolke).
export const EINORDNUNGEN = [
  {
    rubrik: "Markt", stand: "29.10.2026", grafik: "kapital",
    titel: "Vier Konzerne haben seit ChatGPT so viel investiert wie vier Apollo-Programme",
    befund: "Microsoft, Alphabet, Amazon und Meta haben von Anfang 2023 bis Ende September 2026 rund 1.248 Mrd. US-Dollar in Sachanlagen gesteckt, vor allem in Rechenzentren und Chips. Allein im dritten Quartal 2026 waren es 202 Mrd., gut viermal so viel wie das ganze Manhattan-Projekt. Die Konzernzahlen sind nominal, die Vergleiche auf Preise von 2025 hochgerechnet.",
    folge: "An Rechenleistung wird KI in Ihrem Unternehmen kaum scheitern, sie wird reichlich vorhanden sein. Der Engpass liegt bei Ihren Daten, Ihren Abläufen und den Menschen, die damit arbeiten.",
    quelle: "Quartalsberichte (10-Q/10-K) bei der US-Börsenaufsicht SEC, Mittelabfluss für Sachanlagen ohne Leasing; Amazon Q3 2026 aus der Quartalsmitteilung vom 29.10.2026. Vergleiche: Planetary Society nach NASA-Haushaltsdaten (Apollo), Brookings (Manhattan-Projekt); hochgerechnet mit dem US-Verbraucherpreisindex. Abgerufen am 29.10.2026.",
    link: { href: "/ki-im-unternehmen", text: "Kurs, Crew, Schiff" },
  },
  {
    rubrik: "Studie", stand: "25.08.2026",
    titel: "Acht von zehn spüren den Nutzen von KI, nur sechs von hundert sehen ihn deutlich im Ergebnis",
    befund: "80 % der Befragten berichten, dass KI ihre persönliche Produktivität verbessert hat. Nur 6 % schreiben mindestens 5 % ihres Betriebsergebnisses der KI zu und sehen deutlichen Nutzen, unverändert gegenüber dem Vorjahr. Einen Beitrag zum EBIT überhaupt sehen 37 %.",
    folge: "Am Wissen über KI liegt es selten. Es fehlt meist ein klarer Kurs, eine Crew, die mitzieht, oder ein Schiff, das im Betrieb trägt.",
    quelle: "McKinsey & Company, „The state of AI in 2026: On the road to ROI“, 25.08.2026; Online-Umfrage, 1.719 Teilnehmende in 97 Ländern.",
    link: { href: "/ki-im-unternehmen", text: "Kurs, Crew, Schiff" },
  },
  {
    rubrik: "Recht", stand: "29.10.2026",
    titel: "Die EU-Staaten wollen KI-Training mit personenbezogenen Daten erleichtern",
    befund: "Beim sogenannten Digital Omnibus haben sich die Mitgliedstaaten im Ausschuss der Ständigen Vertreter am 21.10.2026 auf ihr Verhandlungsmandat geeinigt. Danach sollen Unternehmen die Entwicklung und den Betrieb von KI, also auch das Training, auf das berechtigte Interesse stützen können. Ein Widerspruchsrecht bleibt, allerdings nur das allgemeine nach Art. 21 DSGVO; das von der Kommission vorgesehene bedingungslose Widerspruchsrecht hat der Rat gestrichen. Ein fertiges Gesetz ist das nicht: Das Europäische Parlament hat seine Position noch nicht beschlossen, erst danach beginnen die Verhandlungen mit dem Rat.",
    folge: "Für die Auswahl von KI-Anbietern wird wichtiger, wofür sie Ihre Daten verwenden dürfen. Verträge zur Auftragsverarbeitung und eine Modellwahl nach Datenklasse bleiben der sichere Weg.",
    quelle: "Rat der EU, Pressemitteilung vom 21.10.2026, und Verhandlungsmandat, Ratsdokument 14756/26 vom 22.10.2026 (Art. 88 bis DSGVO-E); Europäisches Parlament, Legislative Observatory, Verfahren 2025/0360(COD); abgerufen am 29.10.2026.",
  },
  {
    rubrik: "Recht", stand: "29.10.2026",
    titel: "Der Angemessenheitsbeschluss für die USA gilt weiter, steht aber unter Druck",
    befund: "Übermittlungen an US-Unternehmen, die nach dem EU-US Data Privacy Framework zertifiziert sind, stützen sich auf einen Angemessenheitsbeschluss der EU-Kommission vom 10.07.2023. Seit einem Urteil des US Supreme Court vom 29.06.2026 kann der Präsident Mitglieder der Handelsbehörde FTC jederzeit und ohne Angabe von Gründen abberufen. Der Angemessenheitsbeschluss stützt die Aufsicht über die Unternehmen aber ausdrücklich auf eine unabhängige FTC, deren Mitglieder nur aus wichtigem Grund abberufen werden können. Der Europäische Datenschutzausschuss hat die Kommission am 31.07.2026 gebeten, die Folgen zu prüfen. Unabhängig davon ist beim Gerichtshof der EU ein Rechtsmittel gegen das Urteil des Gerichts vom 03.09.2025 anhängig, das eine Klage gegen den Beschluss abgewiesen hatte (Rs. C-703/25 P).",
    folge: "Wer KI-Dienste aus den USA nutzt, sollte einen Plan B haben: Standardvertragsklauseln mit dokumentierter Prüfung des Übermittlungsrisikos oder Verarbeitung in der EU.",
    quelle: "Durchführungsbeschluss (EU) 2023/1795 der Kommission, Erwägungsgründe 58 bis 60; US Supreme Court, Trump v. Slaughter, No. 25-332, Urteil vom 29.06.2026; Europäischer Datenschutzausschuss, Schreiben vom 31.07.2026; Gerichtshof der EU, Rs. C-703/25 P; abgerufen am 29.10.2026.",
  },
];

// Feste Texte um jede Einordnung.
export const EINORDNUNG_DARSTELLUNG = {
  // Kopfzeile: „{rubrik} · Stand {stand}“
  kopfzeile: (e) => `${e.rubrik} · Stand ${e.stand}`,
  folgeLabel: "Was heißt das für Sie? ",
  linkNach: " →",
  quelleLabel: "Quelle: ",
};

// --- app/wissen/kapital.ts ---------------------------------------------------
// Investitionsausgaben (Capex) von Microsoft, Alphabet, Amazon, Meta je Kalenderquartal, Mrd. USD nominal.
export const KAPITAL_QUARTALE = [
  { q: "2023-Q1", summe: 33.9 }, { q: "2023-Q2", summe: 33.4 }, { q: "2023-Q3", summe: 36.9 }, { q: "2023-Q4", summe: 42.9 },
  { q: "2024-Q1", summe: 44.3 }, { q: "2024-Q2", summe: 52.9 }, { q: "2024-Q3", summe: 58.9 }, { q: "2024-Q4", summe: 72.3 },
  { q: "2025-Q1", summe: 71.9 }, { q: "2025-Q2", summe: 88.2 }, { q: "2025-Q3", summe: 97.3 }, { q: "2025-Q4", summe: 118.6 },
  { q: "2026-Q1", summe: 129.8 }, { q: "2026-Q2", summe: 165.1 }, { q: "2026-Q3", summe: 201.9 },
];

// Vergleichsgrößen in 2025-USD.
export const KAPITAL_VERGLEICHE = [
  { name: "Manhattan-Projekt", mrd: 44 },
  { name: "Apollo-Programm", mrd: 309 },
];

// Quellenvermerke aus dem Code der Live-Seite (dort als Kommentar, nicht sichtbar). Wörtlich.
export const KAPITAL_QUELLENVERMERK = {
  quartale: "Investitionsausgaben (Capex) von Microsoft, Alphabet, Amazon, Meta je Kalenderquartal, Mrd. USD nominal. Primärquelle: SEC EDGAR XBRL companyfacts (10-Q/10-K), Amazon Q3 2026 aus dem Earnings Release vom 29.10.2026 (10-Q stand noch aus). Zeilen: MSFT „Additions to property and equipment“, GOOGL/AMZN „Purchases of property and equipment“ (Amazon brutto), META „Purchases of property and equipment“ (netto, zuletzt berichtet). Ohne Finanzierungsleasing. Microsoft vom Geschäftsjahr (bis 30.6.) auf Kalenderquartale umgerechnet. Abgerufen 29.10.2026; Rohdaten und Accession-Nummern im Arbeitsordner der Recherche. Stichprobe: Alphabet 9M 2026 laut SEC 131,953 = 35,7 + 44,9 + 51,4.",
  vergleiche: "Vergleichsgrößen in 2025-USD (CPI-U, BLS). Apollo: Planetary Society nach NASA-Haushaltsdaten. Interstate (≥ 305 Mrd., FHWA) weggelassen: fast gleich groß wie Apollo, die Ringe lägen übereinander. Manhattan-Projekt: Brookings (21,57 Mrd. in 1996-USD), hochgerechnet. ISS bewusst nicht dabei: nur der NASA-Anteil bis 2013 ist amtlich belegt (NASA OIG IG-14-031).",
};

// --- app/components/KapitalWolke.tsx: Texte und Regeln der Grafik ------------
// Investitionen als Punktwolke, ein Punkt = 1 Mrd. USD. Punkte liegen auf einer Sonnenblumen-Spirale
// (Phyllotaxis): Radius ~ Wurzel(n), damit ist die Fläche proportional zur Summe. Deshalb sind die
// Vergleichsringe flächentreu: ein Ring mit k Mrd. umschließt genau k Punkte.
const de = (n) => n.toLocaleString("de-DE");
const quartalText = (q) => q.replace("-", " ");
export const KAPITAL_WOLKE = {
  // Große Zahl über der Grafik: „≈ 1.248 Mrd. $“ (kumulierte Summe, gerundet)
  summeText: (mrd) => `≈ ${de(Math.round(mrd))} Mrd. $`,
  // Zeile daneben: „kumuliert bis 2026 Q3 · 1 Punkt = 1 Mrd. $“
  standText: (q) => `kumuliert bis ${q ? quartalText(q) : "–"} · 1 Punkt = 1 Mrd. $`,
  // Beschriftung der Vergleichsringe: „Apollo-Programm · 309 Mrd.“
  ringText: (v) => `${v.name} · ${de(v.mrd)} Mrd.`,
  // Hinweis je Quartalsbalken: „2026-Q3: 201,9 Mrd. $“
  balkenTitel: (x) => `${x.q}: ${de(x.summe)} Mrd. $`,
  // Unter den Balken: erstes Quartal, Knopf, letztes Quartal („2023 Q1“ … „2026 Q3“)
  achse: (quartale) => [quartalText(quartale[0].q), quartalText(quartale.at(-1).q)],
  knopf: "↻ noch einmal",
  ariaLabel: (gesamt, vergleiche) =>
    `Investitionen der vier Konzerne seit 2023: rund ${Math.round(gesamt)} Milliarden US-Dollar, im Vergleich zu ${vergleiche.map((v) => `${v.name} ${v.mrd} Milliarden`).join(", ")}.`,
  regeln: {
    msJeQuartal: 650,
    startVerzoegerungMs: 400,
    sichtbarAb: 0.35,
    // Animation Quartal für Quartal, sobald sichtbar; bei reduzierter Bewegung sofort der Endstand.
    reduzierteBewegung: "Endstand ohne Animation",
    // Ein Akzent (Deep Teal), Rest grau. Das aktuelle Quartal im Akzent.
    akzentRgb: "13,115,119",
    grauRgb: "139,160,164",
    goldenerWinkel: "Math.PI * (3 - Math.sqrt(5))",
    punktRadius: "schritt * Math.sqrt(k + 0.5), Winkel k * goldenerWinkel",
    ringRadius: "schritt * Math.sqrt(mrd)",
  },
};

// Kumulierte Summen je Quartal (wie in der Grafik gerechnet).
export const kapitalKumuliert = (quartale = KAPITAL_QUARTALE) =>
  quartale.reduce((a, x) => [...a, (a.at(-1) ?? 0) + x.summe], []);
