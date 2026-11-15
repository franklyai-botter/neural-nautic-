// /datenschutz als Daten. Quelle: neural-nautic-live @ 447000b, app/datenschutz/page.tsx.
// Rechtstext mit allen Angaben wörtlich übernommen (automatisch aus dem JSX der Live-Seite erzeugt).
// Aufbau: ABSCHNITTE = [{ titel, inhalt: [{ typ: "absatz", text, teile? } | { typ: "liste", punkte: [{ text, teile? }] }] }].
// text = reiner Wortlaut (Zeilenumbruch als \n). teile gibt es nur bei Absätzen mit Links:
// Folge aus Textstücken und { text, href, extern? }.

export const ROUTE = "/datenschutz";

export const META = {
  title: "Datenschutz | NeuralNautic",
  alternates: { canonical: "/datenschutz" },
  description: "Datenschutzerklärung von NeuralNautic zur Verarbeitung personenbezogener Daten, Hosting, Kontaktaufnahme, Downloads, E-Mail-Versand, KI-Chat, Terminbuchung und Videokonferenzen.",
  robots: { index: false, follow: true },
};

// Vermerke aus dem Code der Live-Seite (dort als Kommentar, nicht sichtbar).
export const VERMERKE = [
  "Entwurf 29.10.2026, vor Livegang rechtlich prüfen lassen.",
  "Anbieterangaben geprüft am 29.10.2026 an Primärquellen:",
  "- Resend: resend.com/legal/privacy-policy (Stand 27.08.2026), resend.com/legal/dpa (Stand 31.12.2025, Abschn. 6.2 SCC, 11.1 DPF)",
  "- Cloudflare: cloudflare.com/cloudflare-customer-dpa/ (Version 6.4 ab 03.04.2026, Vertragspartei Cloudflare, Inc.)",
  "- Mistral AI: legal.mistral.ai/terms/data-processing-addendum/ (Anschrift, Training mit Opt-out)"
];

export const KOPF = {
  "eyebrow": "Rechtliches",
  "h1": "Datenschutz­erklärung",
  "text": "Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO"
};

export const ABSCHNITTE = [
  {
    "titel": "1. Verantwortlicher",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website ist:"
      },
      {
        "typ": "absatz",
        "text": "NeuralNautic (in Gründung)\nFrank Schütt\nBerolinastr. 21\n10178 Berlin\nDeutschland\n\nE-Mail: frankschuettai@neuralnautic.org\nTelefon: +49 176 23846551",
        "teile": [
          "NeuralNautic (in Gründung)\nFrank Schütt\nBerolinastr. 21\n10178 Berlin\nDeutschland\n\nE-Mail: ",
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
    "titel": "2. Allgemeine Hinweise zur Datenverarbeitung",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Ich nehme den Schutz personenbezogener Daten ernst. Personenbezogene Daten sind alle Informationen, mit denen eine natürliche Person direkt oder indirekt identifiziert werden kann, zum Beispiel Name, E-Mail-Adresse, Telefonnummer, IP-Adresse oder Inhaltsangaben aus einer Anfrage."
      },
      {
        "typ": "absatz",
        "text": "Diese Website dient der Information über Beratungsleistungen im Bereich Künstliche Intelligenz, Automatisierung, KI-Governance, Tool-Auswahl und kontrollierte KI-Pilotprojekte für Unternehmen."
      },
      {
        "typ": "absatz",
        "text": "Die Verarbeitung personenbezogener Daten erfolgt nur, soweit dies zur Bereitstellung der Website, zur Bearbeitung von Anfragen, zur Durchführung vorvertraglicher Maßnahmen oder zur Erfüllung rechtlicher Pflichten erforderlich ist."
      }
    ]
  },
  {
    "titel": "3. Rechtsgrundlagen der Verarbeitung",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Die Verarbeitung personenbezogener Daten erfolgt auf Grundlage der Datenschutz-Grundverordnung, insbesondere:"
      },
      {
        "typ": "liste",
        "punkte": [
          {
            "text": "Art. 6 Abs. 1 lit. a DSGVO, wenn eine Einwilligung erteilt wurde;"
          },
          {
            "text": "Art. 6 Abs. 1 lit. b DSGVO, wenn die Verarbeitung zur Durchführung vorvertraglicher Maßnahmen oder eines Vertrags erforderlich ist;"
          },
          {
            "text": "Art. 6 Abs. 1 lit. c DSGVO, wenn eine rechtliche Verpflichtung besteht;"
          },
          {
            "text": "Art. 6 Abs. 1 lit. f DSGVO, wenn ein berechtigtes Interesse besteht, zum Beispiel am sicheren und stabilen Betrieb der Website."
          }
        ]
      }
    ]
  },
  {
    "titel": "4. Hosting und technische Bereitstellung der Website",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Diese Website wird über Cloudflare bereitgestellt (Cloudflare Workers)."
      },
      {
        "typ": "absatz",
        "text": "Anbieter: Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA"
      },
      {
        "typ": "absatz",
        "text": "Beim Aufruf der Website werden technisch notwendige Daten verarbeitet, damit die Website angezeigt und sicher betrieben werden kann. Dazu können insbesondere gehören: IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite oder Datei, Referrer-URL, Browsertyp und Browserversion, verwendetes Betriebssystem sowie technische Logdaten."
      },
      {
        "typ": "absatz",
        "text": "Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse liegt in der sicheren, stabilen und effizienten Bereitstellung der Website."
      },
      {
        "typ": "absatz",
        "text": "Bei der Auslieferung der Inhalte und für die Protokolldaten, die uns als Betreiber im Cloudflare-Konto zur Verfügung stehen, ist Cloudflare Auftragsverarbeiter auf Grundlage des Cloudflare Customer Data Processing Addendum. Diese Protokolle (Workers Logs) nutzen wir zur Fehlersuche und zum sicheren Betrieb; sie werden nach höchstens sieben Tagen automatisch gelöscht. Verbindungsdaten wie die IP-Adresse verarbeitet Cloudflare nach eigener Datenschutzerklärung zusätzlich als eigener Verantwortlicher, etwa für Betrieb und Sicherheit des Netzes; eine feste Speicherfrist nennt Cloudflare dafür nicht."
      },
      {
        "typ": "absatz",
        "text": "Eine Übermittlung in die USA ist möglich. Cloudflare ist unter dem EU-US Data Privacy Framework zertifiziert; zusätzlich gelten die Standardvertragsklauseln der EU-Kommission."
      },
      {
        "typ": "absatz",
        "text": "Weitere Informationen: cloudflare.com/privacypolicy",
        "teile": [
          "Weitere Informationen: ",
          {
            "text": "cloudflare.com/privacypolicy",
            "href": "https://www.cloudflare.com/privacypolicy/",
            "extern": true
          }
        ]
      }
    ]
  },
  {
    "titel": "5. Kontaktaufnahme",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Wenn Sie mich per E-Mail, Kontaktformular oder über eine Buchungs-/Anfragefunktion kontaktieren, werden die von Ihnen übermittelten Angaben verarbeitet. Dazu können gehören: Name, E-Mail-Adresse, Telefonnummer, Unternehmen, Position oder Rolle, Inhalt der Nachricht, gewünschte Beratungsleistung sowie Angaben zu Prozessen, Systemen, KI-Vorhaben oder Projektzielen."
      },
      {
        "typ": "absatz",
        "text": "Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Anfrage auf vorvertragliche Maßnahmen oder einen Vertrag gerichtet ist. In anderen Fällen gilt Art. 6 Abs. 1 lit. f DSGVO. Die Daten werden gelöscht, sobald sie für die Bearbeitung der Anfrage nicht mehr erforderlich sind, sofern keine gesetzlichen Aufbewahrungspflichten bestehen."
      },
      {
        "typ": "absatz",
        "text": "Die Angaben aus dem Kontaktformular werden nicht auf dieser Website gespeichert, sondern per E-Mail an mich übermittelt. Für den Versand nutze ich den Dienst Resend (siehe Abschnitt 7)."
      }
    ]
  },
  {
    "titel": "6. Downloads von Unterlagen",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Auf dieser Website können Sie Unterlagen herunterladen, derzeit eine Checkliste zu KI-Reifegrad und Risiko (PDF) und eine Grafik zur KI-Architektur. Der Download ist ohne Angabe von Daten möglich."
      },
      {
        "typ": "absatz",
        "text": "Freiwillig können Sie Name, E-Mail-Adresse und Telefonnummer angeben. Wenn Sie Angaben machen, verarbeite ich diese, um Ihnen die Unterlage bereitzustellen und Sie zu der Unterlage per E-Mail oder Telefon zu kontaktieren. Dazu werden Ihre Angaben zusammen mit der Bezeichnung der Unterlage, dem Zeitpunkt der Einwilligung und der Seite, auf der Sie die Unterlage angefordert haben, per E-Mail an mich übermittelt. Für den Versand nutze ich den Dienst Resend (siehe Abschnitt 7). Auf der Website selbst werden die Angaben nicht gespeichert."
      },
      {
        "typ": "absatz",
        "text": "Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Sie können die Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, eine E-Mail an frankschuettai@neuralnautic.org  genügt. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt unberührt.",
        "teile": [
          "Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Sie können die Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, eine E-Mail an ",
          {
            "text": "frankschuettai@neuralnautic.org",
            "href": "mailto:frankschuettai@neuralnautic.org"
          },
          "  genügt. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt unberührt."
        ]
      },
      {
        "typ": "absatz",
        "text": "Ich speichere die Angaben bis zu Ihrem Widerruf oder bis der Zweck entfällt, längstens 24 Monate nach dem letzten Kontakt."
      }
    ]
  },
  {
    "titel": "7. E-Mail-Versand über Resend",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Anfragen aus dem Kontaktformular und freiwillige Angaben bei Downloads werden über den E-Mail-Dienst Resend an mich versandt."
      },
      {
        "typ": "absatz",
        "text": "Anbieter: Plus Five Five, Inc. (Resend), 2261 Market Street #5039, San Francisco, CA 94114, USA"
      },
      {
        "typ": "absatz",
        "text": "Resend verarbeitet dabei den Inhalt der Nachricht und die darin enthaltenen Angaben in meinem Auftrag. Grundlage ist das Data Processing Addendum von Resend. Resend verarbeitet Daten hauptsächlich in den USA. Die Übermittlung in die USA stützt sich auf die Zertifizierung von Resend unter dem EU-US Data Privacy Framework; zusätzlich sieht das Data Processing Addendum die Standardvertragsklauseln der EU-Kommission vor."
      },
      {
        "typ": "absatz",
        "text": "Weitere Informationen: resend.com/legal/privacy-policy",
        "teile": [
          "Weitere Informationen: ",
          {
            "text": "resend.com/legal/privacy-policy",
            "href": "https://resend.com/legal/privacy-policy",
            "extern": true
          }
        ]
      }
    ]
  },
  {
    "titel": "8. KI-Chat",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Auf dieser Website steht ein Chat zur Verfügung, der Fragen rund um Künstliche Intelligenz beantwortet. Ihre Eingaben und der bisherige Gesprächsverlauf der aktuellen Sitzung werden dazu über meinen Server an den Sprachmodell-Dienst von Mistral AI übermittelt, der die Antwort erzeugt. Ich speichere die Chatverläufe nicht."
      },
      {
        "typ": "absatz",
        "text": "Anbieter: Mistral AI, 15 rue des Halles, 75001 Paris, Frankreich"
      },
      {
        "typ": "absatz",
        "text": "Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse liegt darin, Ihnen auf Ihre Frage hin eine Antwort bereitzustellen. Mistral AI kann Eingaben nach eigenen Bedingungen für einen begrenzten Zeitraum speichern. Die Nutzung der Eingaben zum Training der Modelle von Mistral AI ist in meinem Konto abgeschaltet. Bitte geben Sie im Chat keine personenbezogenen oder vertraulichen Daten ein."
      },
      {
        "typ": "absatz",
        "text": "Weitere Informationen: legal.mistral.ai/terms/privacy-policy",
        "teile": [
          "Weitere Informationen: ",
          {
            "text": "legal.mistral.ai/terms/privacy-policy",
            "href": "https://legal.mistral.ai/terms/privacy-policy",
            "extern": true
          }
        ]
      }
    ]
  },
  {
    "titel": "9. Reifegrad-Check",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Der Reifegrad-Check auf dieser Website wird vollständig in Ihrem Browser ausgewertet. Ihre Antworten werden weder an mich noch an Dritte übertragen und nicht gespeichert."
      }
    ]
  },
  {
    "titel": "10. KI-bezogene Beratungsanfragen",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Im Rahmen einer Anfrage zu KI-Beratung, KI-Automatisierung, KI-Governance, Tool-Auswahl, Voicebots, Dokumentenanalyse, RAG-Systemen, CRM-Unterstützung oder Prozessautomatisierung können Sie freiwillig Informationen zu Ihrem Unternehmen, Ihren Prozessen, IT-Systemen oder Datenflüssen übermitteln."
      },
      {
        "typ": "absatz",
        "text": "Bitte übermitteln Sie über die Website keine vertraulichen Geschäftsgeheimnisse, sensiblen personenbezogenen Daten oder produktiven Kundendaten, sofern dies nicht ausdrücklich abgestimmt wurde. Eine vertiefte Analyse konkreter Unternehmensdaten erfolgt nur nach gesonderter Vereinbarung und auf Grundlage geeigneter Datenschutz-, Vertraulichkeits- und Auftragsverarbeitungsvereinbarungen."
      }
    ]
  },
  {
    "titel": "11. Terminbuchung und Erstgespräche",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Über die Schaltfläche „KI-Potenzialcheck buchen“ können Sie einen KI-Potenzialcheck buchen. Für die Terminbuchung wird Calendly genutzt. Der Kalender ist nicht in diese Website eingebettet: Sie werden per Link zur Buchungsseite von Calendly weitergeleitet, und erst dann werden Daten an Calendly übermittelt. Für Videotermine wird Google Meet eingesetzt."
      },
      {
        "typ": "absatz",
        "text": "Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. Ergänzend kann Art. 6 Abs. 1 lit. f DSGVO einschlägig sein."
      }
    ]
  },
  {
    "titel": "11.1 Calendly",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Anbieter: Calendly LLC, 115 E Main Street, Suite A1B, Buford, GA 30518, USA"
      },
      {
        "typ": "absatz",
        "text": "Wenn Sie einen Termin über Calendly buchen, werden die von Ihnen eingegebenen Daten sowie technische Nutzungsdaten an Calendly übermittelt und dort verarbeitet. Dazu können insbesondere Name, E-Mail-Adresse, Terminzeitpunkt, Zeitzone, IP-Adresse sowie weitere freiwillige Angaben gehören. Calendly verarbeitet diese Daten in meinem Auftrag. Grundlage ist das Data Processing Addendum von Calendly. Calendly hat seinen Sitz in den USA. Die Übermittlung in die USA stützt sich auf die Zertifizierung von Calendly unter dem EU-US Data Privacy Framework; zusätzlich sieht das Data Processing Addendum die Standardvertragsklauseln der EU-Kommission vor."
      },
      {
        "typ": "absatz",
        "text": "Weitere Informationen: calendly.com/privacy",
        "teile": [
          "Weitere Informationen: ",
          {
            "text": "calendly.com/privacy",
            "href": "https://calendly.com/privacy",
            "extern": true
          }
        ]
      }
    ]
  },
  {
    "titel": "11.2 Google Meet",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Anbieter: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland"
      },
      {
        "typ": "absatz",
        "text": "Bei der Nutzung von Google Meet können insbesondere folgende Daten verarbeitet werden: Name und Kontaktdaten, Meeting-Metadaten, technische Verbindungsdaten, IP-Adresse, Audio- und Videodaten sowie Chatnachrichten. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b und lit. f DSGVO. Soweit Daten in Drittländer übertragen werden, erfolgt dies auf Grundlage geeigneter Garantien nach DSGVO."
      },
      {
        "typ": "absatz",
        "text": "Weitere Informationen: policies.google.com/privacy",
        "teile": [
          "Weitere Informationen: ",
          {
            "text": "policies.google.com/privacy",
            "href": "https://policies.google.com/privacy",
            "extern": true
          }
        ]
      }
    ]
  },
  {
    "titel": "12. Cookies und vergleichbare Technologien",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Diese Website verwendet derzeit nur technisch notwendige Technologien, soweit dies für den Betrieb der Website erforderlich ist. Sollten künftig Analyse-, Marketing- oder Einwilligungsdienste eingesetzt werden, wird diese Datenschutzerklärung entsprechend erweitert. Nicht notwendige Cookies oder vergleichbare Tracking-Technologien werden nur nach vorheriger Einwilligung eingesetzt."
      },
      {
        "typ": "absatz",
        "text": "Der KI-Chat legt im Sitzungsspeicher Ihres Browsers (sessionStorage) einen Eintrag ab, der vermerkt, dass der Hinweis zum Chat bereits angezeigt wurde. Der Eintrag enthält keine personenbezogenen Daten und wird beim Schließen des Browserfensters gelöscht."
      }
    ]
  },
  {
    "titel": "13. Webanalyse und Tracking",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Derzeit findet keine personenbezogene Webanalyse durch Dienste wie Google Analytics, Meta Pixel, LinkedIn Insight Tag oder vergleichbare Tracking-Technologien statt. Falls künftig Analyse- oder Marketingdienste eingesetzt werden, werden Besucherinnen und Besucher hierüber transparent informiert und, sofern erforderlich, vorab um Einwilligung gebeten."
      }
    ]
  },
  {
    "titel": "14. Newsletter",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Derzeit wird kein Newsletter angeboten. Falls künftig ein Newsletter angeboten wird, erfolgt der Versand nur mit Einwilligung der betroffenen Person. Die Einwilligung kann jederzeit widerrufen werden."
      }
    ]
  },
  {
    "titel": "15. Externe Links",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Diese Website kann Links zu externen Websites enthalten. Beim Anklicken externer Links verlassen Sie diese Website. Für die Verarbeitung personenbezogener Daten auf den verlinkten Websites ist der jeweilige Anbieter verantwortlich."
      }
    ]
  },
  {
    "titel": "16. Empfänger personenbezogener Daten",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Personenbezogene Daten werden nur an Dritte weitergegeben, wenn dies zur Bereitstellung der Website, zur Bearbeitung von Anfragen, zur Durchführung von Verträgen, aufgrund gesetzlicher Pflichten oder auf Grundlage einer Einwilligung erforderlich ist."
      },
      {
        "typ": "absatz",
        "text": "Mögliche Empfänger sind insbesondere: Hosting- und Infrastruktur-Anbieter, E-Mail- und Kommunikationsdienste, Terminbuchungs- oder Kalenderdienste, Videokonferenzdienste, Steuerberatung oder Rechtsberatung sowie Behörden, soweit gesetzlich vorgeschrieben."
      },
      {
        "typ": "absatz",
        "text": "Für diese Website sind das derzeit Cloudflare (Hosting, Abschnitt 4), Resend (E-Mail-Versand, Abschnitt 7) und Mistral AI (KI-Chat, Abschnitt 8)."
      }
    ]
  },
  {
    "titel": "17. Speicherdauer",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Personenbezogene Daten werden nur so lange gespeichert, wie dies für den jeweiligen Zweck erforderlich ist. Anfragedaten werden in der Regel gelöscht, sobald die Anfrage abschließend bearbeitet wurde und keine gesetzlichen Aufbewahrungspflichten bestehen. Geschäftliche Kommunikation, Angebotsunterlagen und steuerlich relevante Unterlagen können aufgrund gesetzlicher Aufbewahrungspflichten länger gespeichert werden. Für freiwillige Angaben bei Downloads gilt die Frist aus Abschnitt 6."
      }
    ]
  },
  {
    "titel": "18. Ihre Rechte",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Sie haben nach Maßgabe der DSGVO folgende Rechte:"
      },
      {
        "typ": "liste",
        "punkte": [
          {
            "text": "Recht auf Auskunft über die verarbeiteten personenbezogenen Daten;"
          },
          {
            "text": "Recht auf Berichtigung unrichtiger Daten;"
          },
          {
            "text": "Recht auf Löschung;"
          },
          {
            "text": "Recht auf Einschränkung der Verarbeitung;"
          },
          {
            "text": "Recht auf Datenübertragbarkeit;"
          },
          {
            "text": "Recht auf Widerspruch gegen bestimmte Verarbeitungen;"
          },
          {
            "text": "Recht auf Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft;"
          },
          {
            "text": "Recht auf Beschwerde bei einer Datenschutzaufsichtsbehörde."
          }
        ]
      },
      {
        "typ": "absatz",
        "text": "Zur Ausübung Ihrer Rechte können Sie sich jederzeit an mich wenden: frankschuettai@neuralnautic.org",
        "teile": [
          "Zur Ausübung Ihrer Rechte können Sie sich jederzeit an mich wenden: ",
          {
            "text": "frankschuettai@neuralnautic.org",
            "href": "mailto:frankschuettai@neuralnautic.org"
          }
        ]
      }
    ]
  },
  {
    "titel": "19. Widerspruchsrecht nach Art. 21 DSGVO",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Wenn personenbezogene Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO verarbeitet werden, haben Sie das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit Widerspruch gegen diese Verarbeitung einzulegen."
      },
      {
        "typ": "absatz",
        "text": "Im Fall eines Widerspruchs werden die betroffenen personenbezogenen Daten nicht mehr verarbeitet, es sei denn, es liegen zwingende schutzwürdige Gründe für die Verarbeitung vor oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen."
      }
    ]
  },
  {
    "titel": "20. Datensicherheit",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Ich setze technische und organisatorische Maßnahmen ein, um personenbezogene Daten gegen Verlust, Missbrauch, unbefugten Zugriff, Veränderung oder Offenlegung zu schützen. Die Website wird über eine verschlüsselte HTTPS-Verbindung bereitgestellt. Bitte beachten Sie dennoch, dass Datenübertragungen im Internet Sicherheitslücken aufweisen können."
      }
    ]
  },
  {
    "titel": "21. Keine automatisierte Entscheidungsfindung",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Eine automatisierte Entscheidungsfindung im Sinne von Art. 22 DSGVO findet nicht statt."
      }
    ]
  },
  {
    "titel": "22. Einsatz von KI-Systemen im Beratungsprozess",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Im Rahmen meiner Beratungsleistungen können KI-Tools zur Strukturierung, Analyse, Dokumentation oder Prozesskonzeption eingesetzt werden. Personenbezogene Daten oder vertrauliche Unternehmensdaten werden dabei nur verarbeitet, wenn dies für den jeweiligen Beratungszweck erforderlich, abgestimmt und datenschutzrechtlich zulässig ist."
      },
      {
        "typ": "absatz",
        "text": "Für konkrete Kundenprojekte werden Art, Umfang und Zweck einer möglichen KI-gestützten Datenverarbeitung gesondert festgelegt. Soweit erforderlich, werden zusätzliche Vereinbarungen zur Vertraulichkeit, Auftragsverarbeitung, Datenminimierung und Löschung getroffen."
      }
    ]
  },
  {
    "titel": "23. Aktualität dieser Datenschutzerklärung",
    "inhalt": [
      {
        "typ": "absatz",
        "text": "Diese Datenschutzerklärung ist aktuell gültig. Stand: 29.10.2026."
      },
      {
        "typ": "absatz",
        "text": "Ich behalte mir vor, diese Datenschutzerklärung anzupassen, wenn sich technische, rechtliche oder organisatorische Änderungen ergeben."
      }
    ]
  }
];

// Link am Ende der Seite.
export const SCHLUSSLINKS = [
  {
    "text": "→ Impressum",
    "href": "/impressum"
  }
];
