// /impressum als Daten. Quelle: neural-nautic-live @ 447000b, app/impressum/page.tsx.
// Rechtstext mit allen Angaben wörtlich übernommen (automatisch aus dem JSX der Live-Seite erzeugt).
// Aufbau: ABSCHNITTE = [{ titel, inhalt: [{ typ: "absatz", text, teile? } | { typ: "liste", punkte: [{ text, teile? }] }] }].
// text = reiner Wortlaut (Zeilenumbruch als \n). teile gibt es nur bei Absätzen mit Links:
// Folge aus Textstücken und { text, href, extern? }.

export const ROUTE = "/impressum";

export const META = {
  title: "Impressum | NeuralNautic",
  alternates: { canonical: "/impressum" },
  description: "Impressum von NeuralNautic, Frank Schütt, KI-Beratung für den Mittelstand.",
  robots: { index: false, follow: true },
};

// Vermerke aus dem Code der Live-Seite (dort als Kommentar, nicht sichtbar).
export const VERMERKE = [
  "Entwurf 29.10.2026, vor Livegang rechtlich prüfen lassen."
];

export const KOPF = {
  "eyebrow": "Rechtliches",
  "h1": "Impressum",
  "text": "Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)"
};

export const ABSCHNITTE = [
  {
    "titel": "Anbieter",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "NeuralNautic (in Gründung)\nFrank Schütt\nBerolinastr. 21\n10178 Berlin\nDeutschland"
      }
    ]
  },
  {
    "titel": "Kontakt",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "E-Mail: frankschuettai@neuralnautic.org\nTelefon: +49 176 23846551",
        "teile": [
          "E-Mail: ",
          {
            "text": "frankschuettai@neuralnautic.org",
            "href": "mailto:frankschuettai@neuralnautic.org"
          },
          "\nTelefon: ",
          {
            "text": "+49 176 23846551",
            "href": "tel:+4917623846551"
          }
        ]
      }
    ]
  },
  {
    "titel": "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Frank Schütt\nBerolinastr. 21\n10178 Berlin\nDeutschland"
      }
    ]
  },
  {
    "titel": "Tätigkeit",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "NeuralNautic bietet Beratung, Konzeption und Umsetzung rund um den pragmatischen Einsatz von Künstlicher Intelligenz in Unternehmen an. Der Schwerpunkt liegt auf KI-Potenzialanalysen, kontrollierten Pilotprojekten, KI-Automatisierung, KI-Governance, Tool-Auswahl, Schulungen sowie der Einführung operativer KI-Anwendungen im Mittelstand."
      }
    ]
  },
  {
    "titel": "Umsatzsteuer-ID",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Eine Umsatzsteuer-Identifikationsnummer wurde bislang nicht vergeben."
      }
    ]
  },
  {
    "titel": "Verbraucherstreitbeilegung",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Ich bin nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."
      }
    ]
  },
  {
    "titel": "Haftung für Inhalte",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Als Diensteanbieter bin ich für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Ich bin jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen."
      },
      {
        "typ": "absatz",
        "text": "Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine entsprechende Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen werde ich diese Inhalte umgehend entfernen."
      }
    ]
  },
  {
    "titel": "Haftung für Links",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Diese Website kann Links zu externen Websites Dritter enthalten, auf deren Inhalte ich keinen Einfluss habe. Deshalb kann ich für diese fremden Inhalte keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich."
      },
      {
        "typ": "absatz",
        "text": "Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße geprüft. Rechtswidrige Inhalte waren zu diesem Zeitpunkt nicht erkennbar. Eine dauerhafte Kontrolle der verlinkten Seiten ist ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werde ich entsprechende Links umgehend entfernen."
      }
    ]
  },
  {
    "titel": "Urheberrecht",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Die auf dieser Website erstellten Inhalte, Texte, Konzepte, Grafiken und sonstigen Werke unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet."
      },
      {
        "typ": "absatz",
        "text": "Die Vervielfältigung, Bearbeitung, Verbreitung oder sonstige Nutzung außerhalb der Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung des jeweiligen Rechteinhabers."
      }
    ]
  },
  {
    "titel": "Marken- und Kennzeichenrechte",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Alle auf dieser Website genannten Marken, Produktnamen, Logos und Unternehmensbezeichnungen können geschützte Marken der jeweiligen Eigentümer sein. Die Nennung erfolgt ausschließlich zu Informationszwecken."
      }
    ]
  }
];

// Link am Ende der Seite.
export const SCHLUSSLINKS = [
  {
    "text": "→ Datenschutzerklärung",
    "href": "/datenschutz"
  }
];
