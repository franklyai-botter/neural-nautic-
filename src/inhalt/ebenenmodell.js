// Ebenenmodell (Unternehmen / Projekt). Quelle: neural-nautic-live @ 447000b,
// app/components/EbenenModell.tsx. Steht auf /ki-im-unternehmen (aktiv: "unternehmen")
// und auf /methode (aktiv: "projekt"). Wörtlich.

// Zwei Ebenen der Methode: das Unternehmen (einmal, laufend gepflegt) und das einzelne Projekt
// (je Anwendungsfall). Die jeweils eigene Ebene ist hervorgehoben. Ein Akzent, Rest neutral.
export const EBENENMODELL = {
  titel: "Das Unternehmen gibt den Rahmen vor, jedes Projekt setzt einen Anwendungsfall daraus um",
  ebenen: [
    {
      schluessel: "unternehmen",
      kicker: "Ebene 1 · Unternehmen",
      title: "KI im Unternehmen",
      rhythm: "einmal aufgebaut, laufend gepflegt",
      href: "/ki-im-unternehmen",
      items: ["Kurs: Strategie und Fahrplan", "Crew: Wandel und Befähigung", "Logbuch: KI-Managementsystem", "Schiff: KI-Architektur"],
      steps: false,
    },
    {
      schluessel: "projekt",
      kicker: "Ebene 2 · Projekt",
      title: "KI im Projekt",
      rhythm: "je Anwendungsfall, wiederholbar",
      href: "/methode",
      items: ["Verstehen", "Zuschneiden", "Pilotieren", "Automatisieren", "Übergeben"],
      // Auf der Projekt-Ebene steht vor jedem Schritt die Nummer 01 bis 05.
      steps: true,
    },
  ],
  // Zwischen den beiden Ebenen:
  pfeile: [
    { zeichen: "↓", text: "Der Fahrplan gibt den nächsten Anwendungsfall vor" },
    { zeichen: "↑", text: "Kennzahlen und Erfahrungen fließen zurück" },
  ],
  fuss: {
    teile: ["Gebaut wird jede Lösung nach denselben Regeln: ", { text: "AI Engineering statt Vibe Coding", href: "/ai-engineering" }, "."],
  },
  regeln: {
    // Aktive Ebene: Kicker bekommt den Zusatz, der Titel ist kein Link.
    aktivZusatz: " · Sie sind hier",
    // Nicht aktive Ebene: Titel ist ein Link auf href, mit Pfeil dahinter.
    linkNach: " →",
    schrittNummer: (i) => `0${i + 1}`,
  },
};
