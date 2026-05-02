import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum | NeuralNautic",
  description: "Impressum von NeuralNautic – Frank Schütt, KI-Beratung für den Mittelstand.",
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

export default function Impressum() {
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
              Impressum
            </h1>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, color: "var(--fg-2)", lineHeight: 1.7 }}>
              Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)
            </p>
          </div>
        </section>

        <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 32px 100px" }}>
          <div style={block}>
            <p style={h2}>Anbieter</p>
            <p style={body}>
              NeuralNautic<br />
              Frank Schütt<br />
              Berolinastr. 21<br />
              10178 Berlin<br />
              Deutschland
            </p>
          </div>

          <div style={block}>
            <p style={h2}>Kontakt</p>
            <p style={body}>
              E-Mail:{" "}
              <a href="mailto:frankschuettai@neuralnautic.org" style={{ color: "var(--glow-cyan)", textDecoration: "none" }}>
                frankschuettai@neuralnautic.org
              </a>
              <br />
              Telefon:{" "}
              <a href="tel:+4917623846551" style={{ color: "var(--glow-cyan)", textDecoration: "none" }}>
                +49 176 23846551
              </a>
            </p>
          </div>

          <div style={block}>
            <p style={h2}>Verantwortlich für den Inhalt</p>
            <p style={body}>
              Frank Schütt<br />
              Berolinastr. 21<br />
              10178 Berlin<br />
              Deutschland
            </p>
          </div>

          <div style={block}>
            <p style={h2}>Tätigkeit</p>
            <p style={body}>
              NeuralNautic bietet Beratung, Konzeption und Umsetzung rund um den pragmatischen Einsatz von
              Künstlicher Intelligenz in Unternehmen an. Der Schwerpunkt liegt auf KI-Potenzialanalysen,
              kontrollierten Pilotprojekten, KI-Automatisierung, KI-Governance, Tool-Auswahl, Schulungen
              sowie der Einführung operativer KI-Anwendungen im Mittelstand.
            </p>
          </div>

          <div style={block}>
            <p style={h2}>Umsatzsteuer-ID</p>
            <p style={body}>
              Eine Umsatzsteuer-Identifikationsnummer wurde bislang nicht vergeben.
            </p>
          </div>

          <div style={block}>
            <p style={h2}>Verbraucherstreitbeilegung</p>
            <p style={body}>
              Ich bin nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>

          <div style={{ height: 1, background: "var(--border-1)", margin: "40px 0" }} />

          <div style={block}>
            <p style={h2}>Haftung für Inhalte</p>
            <p style={body}>
              Als Diensteanbieter bin ich für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Ich bin jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
              Tätigkeit hinweisen.
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen
              Gesetzen bleiben hiervon unberührt. Eine entsprechende Haftung ist jedoch erst ab dem Zeitpunkt
              der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden entsprechender
              Rechtsverletzungen werde ich diese Inhalte umgehend entfernen.
            </p>
          </div>

          <div style={block}>
            <p style={h2}>Haftung für Links</p>
            <p style={body}>
              Diese Website kann Links zu externen Websites Dritter enthalten, auf deren Inhalte ich keinen
              Einfluss habe. Deshalb kann ich für diese fremden Inhalte keine Gewähr übernehmen. Für die
              Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße geprüft.
              Rechtswidrige Inhalte waren zu diesem Zeitpunkt nicht erkennbar. Eine dauerhafte Kontrolle der
              verlinkten Seiten ist ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
              Bekanntwerden von Rechtsverletzungen werde ich entsprechende Links umgehend entfernen.
            </p>
          </div>

          <div style={block}>
            <p style={h2}>Urheberrecht</p>
            <p style={body}>
              Die auf dieser Website erstellten Inhalte, Texte, Konzepte, Grafiken und sonstigen Werke
              unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet.
            </p>
            <p style={{ ...body, marginTop: 12 }}>
              Die Vervielfältigung, Bearbeitung, Verbreitung oder sonstige Nutzung außerhalb der Grenzen des
              Urheberrechts bedarf der vorherigen schriftlichen Zustimmung des jeweiligen Rechteinhabers.
            </p>
          </div>

          <div style={block}>
            <p style={h2}>Marken- und Kennzeichenrechte</p>
            <p style={body}>
              Alle auf dieser Website genannten Marken, Produktnamen, Logos und Unternehmensbezeichnungen
              können geschützte Marken der jeweiligen Eigentümer sein. Die Nennung erfolgt ausschließlich
              zu Informationszwecken.
            </p>
          </div>

          <div style={{ marginTop: 48 }}>
            <Link
              href="/datenschutz"
              style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--glow-cyan)", textDecoration: "none", letterSpacing: ".08em" }}
            >
              → Datenschutzerklärung
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
