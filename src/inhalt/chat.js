// KI-Chat (auf jeder Live-Seite unten rechts) als Daten. Quelle: neural-nautic-live @ 447000b,
// app/components/ChatWidget.tsx. Wörtlich.
// BACKEND (Welle 2): Antworten kommen von /api/chat (Mistral AI). Regeln, Modellliste und
// Systemanweisung stehen in backend.js. Ohne Backend bleibt nur die Oberfläche.

export const CHAT = {
  endpoint: "/api/chat",
  // Gesendet wird als JSON: { messages: [{ role: "user" | "assistant", content }] }
  anfrage: { methode: "POST", contentType: "application/json" },

  // Hinweisblase über dem Knopf beim ersten Besuch.
  tipp: {
    text: "Fragen zu KI? Ich helfe.",
    schliessenZeichen: "×",
    schliessenAria: "Hinweis schliessen",
    regeln: {
      // Am Desktop nach 3 Sekunden. Auf dem Handy (Breite < 640) erst nach dem ersten Scrollen (> 300 px),
      // sonst verdeckt die Blase die Knöpfe im ersten Bildschirm.
      desktopNachMs: 3000,
      mobilNachScrollPx: 300,
      mobilBreiteUnter: 640,
      // Nur einmal je Sitzung: sessionStorage „nn-chat-tip-seen“ = „1“. Nicht, wenn der Chat offen ist.
      sessionStorageKey: "nn-chat-tip-seen",
    },
  },

  // Knopf: Sprechblase aus hellem Milchglas mit der Kompassrose (/logo-star.png,
  // im Funnel public/brand/nn-stern-2026-10-kompass.png).
  knopf: {
    logo: "/logo-star.png",
    ariaOeffnen: "Chat öffnen",
    ariaSchliessen: "Chat schließen",
    // Auf dem Handy etwa halb so groß, sonst verdeckt der Knopf Inhalte im ersten Bildschirm.
    groesse: { desktop: { breite: 88, hoehe: 104, logo: 58 }, mobil: { breite: 62, hoehe: 74, logo: 40 } },
  },

  kopf: {
    logo: "/logo-star.png",
    titel: "NeuralNautic KI-Assistent",   // Frank 17.11.2026 (Art. 50 KI-VO: KI erkennbar), vorher „NeuralNautic Assistent“
    etikett: "DSGVO · EU AI Act",
  },

  // DSGVO-Hinweis oben im Fenster, mit „OK“ wegklickbar.
  hinweis: {
    teile: [
      // Frank 17.11.2026: an die Datenschutzerklärung (Abschnitt 8) angeglichen. Vorher „Wir speichern Ihre Fragen nicht,
      // und sie werden nicht zum Training von KI-Modellen genutzt. … Anbieter: Mistral AI (Frankreich, EU).“ (zu absolut, „Wir“)
      "Ich speichere Ihre Fragen nicht. Zur Antwort gehen sie an Mistral AI (Frankreich, EU), das sie nach eigenen Bedingungen begrenzt speichern kann; zum Training werden sie nicht genutzt. Bitte geben Sie keine personenbezogenen Daten ein. Mehr in der ",
      { text: "Datenschutzerklärung", href: "/datenschutz" },
      ".",
    ],
    knopf: "OK",
  },

  // Begrüßung, solange noch keine Nachricht da ist.
  begruessung: "Guten Tag! Stellen Sie Ihre Frage zu KI, DSGVO, EU AI Act oder Datensicherheit.",

  eingabe: { placeholder: "Ihre Frage…", maxLength: 2000 },

  // Fußzeile im Fenster.
  haftung: "Keine Rechtsberatung. Antworten sind unverbindliche Empfehlungen ohne Gewähr.",

  fehler: {
    antwortFehlt: "Fehler beim Laden der Antwort.",
    verbindung: "Verbindungsfehler. Bitte versuchen Sie es erneut.",   // vorher Du-Form
  },

  regeln: {
    // Enter sendet, Umschalt+Enter nicht. Leere Eingaben und Eingaben während des Ladens werden nicht gesendet.
    // Antwort = data.message, sonst data.error, sonst fehler.antwortFehlt.
    // Während des Ladens drei pulsierende Punkte.
    // Der Verlauf lebt nur im Fenster (kein Speichern); beim Neuladen ist er weg.
    mobilBreiteUnter: 640,
    // Live: auf dem Handy als Blatt von unten, Höhe höchstens 480 px. Neubau seit 17.11.2026 (Frank: „es deckt sich
    // ständig irgendwas ab“): unter 640 px Vollbild über dem sichtbaren Bereich (visualViewport, über der Tastatur),
    // Seite gesperrt, Schließen oben. Am Desktop Fenster über dem Knopf, Breite min(380px, 100vw − 40px).
    desktopBreite: "min(380px, calc(100vw - 40px))",
    // Wie CHAT_API in backend.js: der Server nimmt die letzten 20 Nachrichten, je höchstens 2000 Zeichen.
    // Der Client schickt deshalb nicht mehr (Neubau, live schickt den ganzen Verlauf).
    maxVerlauf: 20,
    // Neubau: Ohne Antwort nach 60 s gilt die Anfrage als gescheitert (fehler.verbindung). Live wartet unbegrenzt.
    zeitlimitMs: 60000,
  },

  // Neubau, nicht live: Namen und Ansagen für Screenreader (live fehlen sie). Sichtbar wird davon nichts.
  barrierefrei: {
    eingabe: "Ihre Frage an den NeuralNautic KI-Assistenten",
    senden: "Frage senden",
    verlauf: "Gesprächsverlauf",
    ich: "Sie:",
    assistent: "Assistent:",
    laedt: "Antwort wird geladen …",
    neuerTab: "(öffnet in neuem Tab)",
  },
};
