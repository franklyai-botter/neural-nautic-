import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutz | NeuralNautic",
  description: "Datenschutzerklärung von NeuralNautic zur Verarbeitung personenbezogener Daten, Hosting, Kontaktaufnahme, Terminbuchung und Videokonferenzen.",
  robots: { index: false, follow: true },
};

const block: React.CSSProperties = { marginBottom: 40 };
const h2: React.CSSProperties = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const,
  letterSpacing: ".2em", color: "var(--glow-cyan)",
  margin: "0 0 12px",
};
const body: React.CSSProperties = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: 15, color: "var(--fg-2)", lineHeight: 1.75, margin: 0,
};
const extLink: React.CSSProperties = {
  color: "var(--glow-cyan)", textDecoration: "none", wordBreak: "break-all" as const,
};

export default function Datenschutz() {
  return (
    <>
      <Header />
      <main>
        <section style={{ position: "relative", padding: "80px 32px 60px", overflow: "hidden", borderBottom: "1px solid var(--border-1)" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Image src="/bg-neural-network.png" alt="" fill style={{ objectFit: "cover", opacity: 0.25 }} />
          </div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(6,20,25,.2), rgba(6,20,25,.80) 80%)" }} />
          <div style={{ position: "relative", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>Rechtliches</span>
            <h1 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.05, color: "var(--fg-1)", margin: "20px 0 20px" }}>
              Datenschutz&shy;erklärung
            </h1>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, color: "var(--fg-2)", lineHeight: 1.7 }}>
              Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO
            </p>
          </div>
        </section>

        <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 32px 100px" }}>

          <div style={block}>
            <p style={h2}>1. Verantwortlicher</p>
            <p style={body}>
              Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website ist:
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              NeuralNautic<br />
              Frank Schütt<br />
              Berolinastr. 21<br />
              10178 Berlin<br />
              Deutschland<br /><br />
              E-Mail:{" "}
              <a href="mailto:frankschuettai@neuralnautic.org" style={extLink}>
                frankschuettai@neuralnautic.org
              </a>
              <br />
              Telefon:{" "}
              <a href="tel:+4917623846551" style={extLink}>
                +49 176 23846551
              </a>
            </p>
          </div>

          <div style={block}>
            <p style={h2}>2. Allgemeine Hinweise zur Datenverarbeitung</p>
            <p style={body}>
              Ich nehme den Schutz personenbezogener Daten ernst. Personenbezogene Daten sind alle
              Informationen, mit denen eine natürliche Person direkt oder indirekt identifiziert werden kann,
              zum Beispiel Name, E-Mail-Adresse, Telefonnummer, IP-Adresse oder Inhaltsangaben aus einer Anfrage.
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Diese Website dient der Information über Beratungsleistungen im Bereich Künstliche Intelligenz,
              Automatisierung, KI-Governance, Tool-Auswahl und kontrollierte KI-Pilotprojekte für Unternehmen.
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Die Verarbeitung personenbezogener Daten erfolgt nur, soweit dies zur Bereitstellung der Website,
              zur Bearbeitung von Anfragen, zur Durchführung vorvertraglicher Maßnahmen oder zur Erfüllung
              rechtlicher Pflichten erforderlich ist.
            </p>
          </div>

          <div style={block}>
            <p style={h2}>3. Rechtsgrundlagen der Verarbeitung</p>
            <p style={body}>
              Die Verarbeitung personenbezogener Daten erfolgt auf Grundlage der
              Datenschutz-Grundverordnung, insbesondere:
            </p>
            <ul style={{ ...body, marginTop: 12, paddingLeft: 20 }}>
              <li style={{ marginBottom: 6 }}>Art. 6 Abs. 1 lit. a DSGVO, wenn eine Einwilligung erteilt wurde;</li>
              <li style={{ marginBottom: 6 }}>Art. 6 Abs. 1 lit. b DSGVO, wenn die Verarbeitung zur Durchführung vorvertraglicher Maßnahmen oder eines Vertrags erforderlich ist;</li>
              <li style={{ marginBottom: 6 }}>Art. 6 Abs. 1 lit. c DSGVO, wenn eine rechtliche Verpflichtung besteht;</li>
              <li>Art. 6 Abs. 1 lit. f DSGVO, wenn ein berechtigtes Interesse besteht, zum Beispiel am sicheren und stabilen Betrieb der Website.</li>
            </ul>
          </div>

          <div style={block}>
            <p style={h2}>4. Hosting und technische Bereitstellung der Website</p>
            <p style={body}>
              Diese Website wird über Vercel bereitgestellt.
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Anbieter: Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, USA
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Beim Aufruf der Website werden technisch notwendige Daten verarbeitet, damit die Website
              angezeigt und sicher betrieben werden kann. Dazu können insbesondere gehören: IP-Adresse,
              Datum und Uhrzeit des Zugriffs, aufgerufene Seite oder Datei, Referrer-URL, Browsertyp und
              Browserversion, verwendetes Betriebssystem sowie technische Logdaten.
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte
              Interesse liegt in der sicheren, stabilen und effizienten Bereitstellung der Website.
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Da Vercel ein Anbieter mit Sitz in den USA ist, kann eine Übermittlung personenbezogener
              Daten in ein Drittland nicht ausgeschlossen werden. Für solche Übermittlungen kommen geeignete
              Garantien nach DSGVO, insbesondere Standardvertragsklauseln, in Betracht.
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Weitere Informationen:{" "}
              <a href="https://vercel.com/legal/privacy-policy" style={extLink} target="_blank" rel="noopener noreferrer">
                vercel.com/legal/privacy-policy
              </a>
            </p>
          </div>

          <div style={block}>
            <p style={h2}>5. Kontaktaufnahme</p>
            <p style={body}>
              Wenn Sie mich per E-Mail, Kontaktformular oder über eine Buchungs-/Anfragefunktion kontaktieren,
              werden die von Ihnen übermittelten Angaben verarbeitet. Dazu können gehören: Name,
              E-Mail-Adresse, Telefonnummer, Unternehmen, Position oder Rolle, Inhalt der Nachricht,
              gewünschte Beratungsleistung sowie Angaben zu Prozessen, Systemen, KI-Vorhaben oder Projektzielen.
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Anfrage auf vorvertragliche
              Maßnahmen oder einen Vertrag gerichtet ist. In anderen Fällen gilt Art. 6 Abs. 1 lit. f DSGVO.
              Die Daten werden gelöscht, sobald sie für die Bearbeitung der Anfrage nicht mehr erforderlich
              sind, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
            </p>
          </div>

          <div style={block}>
            <p style={h2}>6. KI-bezogene Beratungsanfragen</p>
            <p style={body}>
              Im Rahmen einer Anfrage zu KI-Beratung, KI-Automatisierung, KI-Governance, Tool-Auswahl,
              Voicebots, Dokumentenanalyse, RAG-Systemen, CRM-Unterstützung oder Prozessautomatisierung
              können Sie freiwillig Informationen zu Ihrem Unternehmen, Ihren Prozessen, IT-Systemen oder
              Datenflüssen übermitteln.
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Bitte übermitteln Sie über die Website keine vertraulichen Geschäftsgeheimnisse, sensiblen
              personenbezogenen Daten oder produktiven Kundendaten, sofern dies nicht ausdrücklich abgestimmt
              wurde. Eine vertiefte Analyse konkreter Unternehmensdaten erfolgt nur nach gesonderter
              Vereinbarung und auf Grundlage geeigneter Datenschutz-, Vertraulichkeits- und
              Auftragsverarbeitungsvereinbarungen.
            </p>
          </div>

          <div style={block}>
            <p style={h2}>7. Terminbuchung und Erstgespräche</p>
            <p style={body}>
              Auf dieser Website kann eine Funktion zur Buchung eines KI-Potenzialchecks, Erstgesprächs oder
              Beratungstermins eingebunden sein. Für die Terminbuchung wird Calendly genutzt. Für
              Videotermine kann Google Meet eingesetzt werden.
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung zur Durchführung
              vorvertraglicher Maßnahmen erforderlich ist. Ergänzend kann Art. 6 Abs. 1 lit. f DSGVO
              einschlägig sein.
            </p>
          </div>

          <div style={block}>
            <p style={h2}>7.1 Calendly</p>
            <p style={body}>
              Anbieter: Calendly LLC, 115 E Main Street, Suite A1B, Buford, GA 30518, USA
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Wenn Sie einen Termin über Calendly buchen, werden die von Ihnen eingegebenen Daten sowie
              technische Nutzungsdaten an Calendly übermittelt und dort verarbeitet. Dazu können insbesondere
              Name, E-Mail-Adresse, Terminzeitpunkt, Zeitzone, IP-Adresse sowie weitere freiwillige Angaben
              gehören. Da Calendly ein Anbieter mit Sitz in den USA ist, kann eine Übermittlung in ein
              Drittland stattfinden. Hierfür kommen geeignete Garantien nach DSGVO in Betracht.
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Weitere Informationen:{" "}
              <a href="https://calendly.com/privacy" style={extLink} target="_blank" rel="noopener noreferrer">
                calendly.com/privacy
              </a>
            </p>
          </div>

          <div style={block}>
            <p style={h2}>7.2 Google Meet</p>
            <p style={body}>
              Anbieter: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Bei der Nutzung von Google Meet können insbesondere folgende Daten verarbeitet werden: Name
              und Kontaktdaten, Meeting-Metadaten, technische Verbindungsdaten, IP-Adresse, Audio- und
              Videodaten sowie Chatnachrichten. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1
              lit. b und lit. f DSGVO. Soweit Daten in Drittländer übertragen werden, erfolgt dies auf
              Grundlage geeigneter Garantien nach DSGVO.
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Weitere Informationen:{" "}
              <a href="https://policies.google.com/privacy" style={extLink} target="_blank" rel="noopener noreferrer">
                policies.google.com/privacy
              </a>
            </p>
          </div>

          <div style={block}>
            <p style={h2}>8. Cookies und vergleichbare Technologien</p>
            <p style={body}>
              Diese Website verwendet derzeit nur technisch notwendige Technologien, soweit dies für den
              Betrieb der Website erforderlich ist. Sollten künftig Analyse-, Marketing- oder
              Einwilligungsdienste eingesetzt werden, wird diese Datenschutzerklärung entsprechend erweitert.
              Nicht notwendige Cookies oder vergleichbare Tracking-Technologien werden nur nach vorheriger
              Einwilligung eingesetzt.
            </p>
          </div>

          <div style={block}>
            <p style={h2}>9. Webanalyse und Tracking</p>
            <p style={body}>
              Derzeit findet keine personenbezogene Webanalyse durch Dienste wie Google Analytics,
              Meta Pixel, LinkedIn Insight Tag oder vergleichbare Tracking-Technologien statt. Falls
              künftig Analyse- oder Marketingdienste eingesetzt werden, werden Besucherinnen und Besucher
              hierüber transparent informiert und, sofern erforderlich, vorab um Einwilligung gebeten.
            </p>
          </div>

          <div style={block}>
            <p style={h2}>10. Newsletter</p>
            <p style={body}>
              Derzeit wird kein Newsletter angeboten. Falls künftig ein Newsletter angeboten wird, erfolgt
              der Versand nur mit Einwilligung der betroffenen Person. Die Einwilligung kann jederzeit
              widerrufen werden.
            </p>
          </div>

          <div style={block}>
            <p style={h2}>11. Externe Links</p>
            <p style={body}>
              Diese Website kann Links zu externen Websites enthalten. Beim Anklicken externer Links
              verlassen Sie diese Website. Für die Verarbeitung personenbezogener Daten auf den verlinkten
              Websites ist der jeweilige Anbieter verantwortlich.
            </p>
          </div>

          <div style={block}>
            <p style={h2}>12. Empfänger personenbezogener Daten</p>
            <p style={body}>
              Personenbezogene Daten werden nur an Dritte weitergegeben, wenn dies zur Bereitstellung der
              Website, zur Bearbeitung von Anfragen, zur Durchführung von Verträgen, aufgrund gesetzlicher
              Pflichten oder auf Grundlage einer Einwilligung erforderlich ist.
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Mögliche Empfänger sind insbesondere: Hosting- und Infrastruktur-Anbieter, E-Mail- und
              Kommunikationsdienste, Terminbuchungs- oder Kalenderdienste, Videokonferenzdienste,
              Steuerberatung oder Rechtsberatung sowie Behörden, soweit gesetzlich vorgeschrieben.
            </p>
          </div>

          <div style={block}>
            <p style={h2}>13. Speicherdauer</p>
            <p style={body}>
              Personenbezogene Daten werden nur so lange gespeichert, wie dies für den jeweiligen Zweck
              erforderlich ist. Anfragedaten werden in der Regel gelöscht, sobald die Anfrage abschließend
              bearbeitet wurde und keine gesetzlichen Aufbewahrungspflichten bestehen. Geschäftliche
              Kommunikation, Angebotsunterlagen und steuerlich relevante Unterlagen können aufgrund
              gesetzlicher Aufbewahrungspflichten länger gespeichert werden.
            </p>
          </div>

          <div style={block}>
            <p style={h2}>14. Ihre Rechte</p>
            <p style={body}>Sie haben nach Maßgabe der DSGVO folgende Rechte:</p>
            <ul style={{ ...body, marginTop: 12, paddingLeft: 20 }}>
              <li style={{ marginBottom: 6 }}>Recht auf Auskunft über die verarbeiteten personenbezogenen Daten;</li>
              <li style={{ marginBottom: 6 }}>Recht auf Berichtigung unrichtiger Daten;</li>
              <li style={{ marginBottom: 6 }}>Recht auf Löschung;</li>
              <li style={{ marginBottom: 6 }}>Recht auf Einschränkung der Verarbeitung;</li>
              <li style={{ marginBottom: 6 }}>Recht auf Datenübertragbarkeit;</li>
              <li style={{ marginBottom: 6 }}>Recht auf Widerspruch gegen bestimmte Verarbeitungen;</li>
              <li style={{ marginBottom: 6 }}>Recht auf Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft;</li>
              <li>Recht auf Beschwerde bei einer Datenschutzaufsichtsbehörde.</li>
            </ul>
            <p style={{ ...body, marginTop: 12 }}>
              Zur Ausübung Ihrer Rechte können Sie sich jederzeit an mich wenden:{" "}
              <a href="mailto:frankschuettai@neuralnautic.org" style={extLink}>
                frankschuettai@neuralnautic.org
              </a>
            </p>
          </div>

          <div style={block}>
            <p style={h2}>15. Widerspruchsrecht nach Art. 21 DSGVO</p>
            <p style={body}>
              Wenn personenbezogene Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO verarbeitet werden,
              haben Sie das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit
              Widerspruch gegen diese Verarbeitung einzulegen.
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Im Fall eines Widerspruchs werden die betroffenen personenbezogenen Daten nicht mehr
              verarbeitet, es sei denn, es liegen zwingende schutzwürdige Gründe für die Verarbeitung vor
              oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.
            </p>
          </div>

          <div style={block}>
            <p style={h2}>16. Datensicherheit</p>
            <p style={body}>
              Ich setze technische und organisatorische Maßnahmen ein, um personenbezogene Daten gegen
              Verlust, Missbrauch, unbefugten Zugriff, Veränderung oder Offenlegung zu schützen. Die
              Website wird über eine verschlüsselte HTTPS-Verbindung bereitgestellt. Bitte beachten Sie
              dennoch, dass Datenübertragungen im Internet Sicherheitslücken aufweisen können.
            </p>
          </div>

          <div style={block}>
            <p style={h2}>17. Keine automatisierte Entscheidungsfindung</p>
            <p style={body}>
              Eine automatisierte Entscheidungsfindung im Sinne von Art. 22 DSGVO findet nicht statt.
            </p>
          </div>

          <div style={block}>
            <p style={h2}>18. Einsatz von KI-Systemen im Beratungsprozess</p>
            <p style={body}>
              Im Rahmen meiner Beratungsleistungen können KI-Tools zur Strukturierung, Analyse,
              Dokumentation oder Prozesskonzeption eingesetzt werden. Personenbezogene Daten oder
              vertrauliche Unternehmensdaten werden dabei nur verarbeitet, wenn dies für den jeweiligen
              Beratungszweck erforderlich, abgestimmt und datenschutzrechtlich zulässig ist.
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Für konkrete Kundenprojekte werden Art, Umfang und Zweck einer möglichen KI-gestützten
              Datenverarbeitung gesondert festgelegt. Soweit erforderlich, werden zusätzliche Vereinbarungen
              zur Vertraulichkeit, Auftragsverarbeitung, Datenminimierung und Löschung getroffen.
            </p>
          </div>

          <div style={block}>
            <p style={h2}>19. Aktualität dieser Datenschutzerklärung</p>
            <p style={body}>
              Diese Datenschutzerklärung ist aktuell gültig. Stand: Mai 2026.
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Ich behalte mir vor, diese Datenschutzerklärung anzupassen, wenn sich technische, rechtliche
              oder organisatorische Änderungen ergeben.
            </p>
          </div>

          <div style={{ height: 1, background: "var(--border-1)", margin: "40px 0" }} />

          <div style={{ marginTop: 48 }}>
            <Link
              href="/impressum"
              style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--glow-cyan)", textDecoration: "none", letterSpacing: ".08em" }}
            >
              → Impressum
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
