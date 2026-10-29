import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import WerkzeugLaufband from "../components/WerkzeugLaufband";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "KI Tool Kompass: KI-Werkzeuge richtig auswählen | NeuralNautic",
  alternates: { canonical: "/ki-tool-kompass" },
  description: "Fragen, mit denen Sie KI-Werkzeuge nach Nutzen, Kosten, Datenschutz und Integrationsfähigkeit bewerten, bevor Sie kaufen. Herstellerneutral, für den Mittelstand.",
  openGraph: { title: "KI Tool Kompass: KI-Werkzeuge richtig auswählen", description: "Fragen, mit denen Sie KI-Werkzeuge nach Nutzen, Kosten, Datenschutz und Integrationsfähigkeit bewerten, bevor Sie kaufen. Herstellerneutral, für den Mittelstand.", url: "/ki-tool-kompass" },
};


// Klassen Stand 29.10.2026 (vorher 7, ohne Agenten, Dokumente, Softwareentwicklung, Medien).
// Bewusst ohne Produktnamen: die Klassen bleiben, die Anbieter wechseln.
const CATEGORIES = [
  "Chat-Assistenten", "KI-Agenten", "Automatisierung",
  "Wissen und Unternehmenssuche", "Dokumentenverarbeitung", "Sprache und Besprechungen",
  "Büro und Produktivität", "Softwareentwicklung mit KI", "Bild, Video und Design",
  "Souveräne und lokale KI (Open Source, EU-Anbieter)", "CRM und Vertrieb",
];

const CRITERIA = [
  { n: "01", q: "Welches Problem löst das Werkzeug?",             desc: "Startpunkt ist immer das konkrete Problem, nicht das Werkzeug." },
  { n: "02", q: "Passt es zu bestehenden Prozessen?",              desc: "Werkzeuge müssen sich in Ihre Abläufe einfügen, nicht umgekehrt." },
  { n: "03", q: "Wie hoch sind Lizenz- und Betriebskosten?",       desc: "Gesamtkosten über die Laufzeit betrachten, nicht nur die Lizenz." },
  { n: "04", q: "Welche Daten werden verarbeitet?",                desc: "Datenflüsse verstehen: vor der Einführung, nicht danach." },
  // Frank 29.10.2026: im geschäftlichen Einsatz kein Training mit eigenen Daten. Bedingung, keine Abwägung.
  { n: "05", q: "Ist Training mit Ihren Daten ausgeschlossen?",    desc: "Im geschäftlichen Einsatz gilt: kein Training mit Ihren Eingaben. Vertraglich zugesichert oder im Konto abgeschaltet und vor dem ersten Einsatz geprüft." },
  { n: "06", q: "Ist das Werkzeug DSGVO-konform einsetzbar?",      desc: "Besonders bei Cloud-Diensten: Serverstandort, Drittlandübermittlung, Vertrag zur Auftragsverarbeitung." },
  { n: "07", q: "Welche Pflichten folgen aus dem EU AI Act?",      desc: "Risikoklasse des Einsatzes bestimmen, Transparenz- und Dokumentationspflichten einplanen." },
  { n: "08", q: "Gibt es Schnittstellen zu bestehenden Systemen?", desc: "Programmierschnittstellen, fertige Anbindungen, Integrationsaufwand." },
  { n: "09", q: "Wie hoch ist der Schulungsaufwand?",              desc: "Die Nutzung scheitert oft an fehlender Einführung, nicht am Werkzeug." },
  { n: "10", q: "Entsteht eine Abhängigkeit vom Anbieter?",        desc: "Daten exportierbar, Wechsel möglich, Alternativen vorhanden." },
  { n: "11", q: "Ist die Lösung skalierbar?",                      desc: "Was für 5 Nutzer funktioniert, muss auch für 50 taugen." },
];

export default function KiToolKompass() {
  return (
    <>
      <Header />
      <main>
        <section style={{ position: "relative", padding: "80px 32px 60px", overflow: "hidden", borderBottom: "1px solid var(--border-1)" }}>
          <div style={{ position: "relative", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>KI Tool Kompass</span>
            <h1 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 1.05, color: "var(--fg-1)", margin: "20px 0 20px" }}>
              Die richtigen KI-Werkzeuge für Ihr Unternehmen
            </h1>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 17, color: "var(--fg-2)", lineHeight: 1.7, maxWidth: "56ch", margin: "0 auto" }}>
              Der KI-Markt ist unübersichtlich. Gemeinsam mit Ihnen bewerten wir passende Werkzeuge, führen sie sinnvoll ein und legen fest, wie sie genutzt werden.
            </p>
          </div>
        </section>

        {/* Werkzeug-Logos in Glas (vorher auf der Startseite, Frank 29.10.2026: gehört zu den Werkzeugen) */}
        <section style={{ padding: "64px 0 24px" }}>
          <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 400, color: "var(--fg-1)", textAlign: "center", margin: "0 auto 28px", padding: "0 20px", maxWidth: 760 }}>
            KI wirkt dort, wo Ihre Daten liegen: wir binden die Werkzeuge an, die Sie schon nutzen.
          </h2>
          <WerkzeugLaufband />
          <p style={{ textAlign: "center", fontFamily: "var(--font-inter), sans-serif", fontSize: 12, color: "var(--fg-3)", margin: "16px auto 0", padding: "0 20px" }}>
            Beispiele. Die Logos gehören den jeweiligen Inhabern, eine Partnerschaft besteht nicht.
          </p>
        </section>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>
          <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 400, fontSize: 36, color: "var(--fg-1)", margin: "0 0 32px" }}>
            Werkzeugkategorien
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 80 }}>
            {CATEGORIES.map((c) => (
              <span key={c} style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, padding: "9px 18px", borderRadius: 999, background: "var(--ink-current)", border: "1px solid var(--border-2)", color: "var(--fg-2)" }}>{c}</span>
            ))}
          </div>

          <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 400, fontSize: 36, color: "var(--fg-1)", margin: "0 0 40px" }}>
            {CRITERIA.length} Bewertungskriterien
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {CRITERIA.map((c, i) => (
              <div key={c.n} style={{ display: "grid", gridTemplateColumns: "56px 1fr 1fr", gap: 32, padding: "28px 0", borderBottom: i < CRITERIA.length - 1 ? "1px solid var(--border-1)" : "none", alignItems: "start" }}>
                <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 12, color: "var(--glow-cyan)", letterSpacing: ".1em", paddingTop: 2 }}>{c.n}</span>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, fontWeight: 500, color: "var(--fg-1)", margin: 0, lineHeight: 1.5 }}>{c.q}</p>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-3)", margin: 0, lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Kaufen oder bauen: Brücke zu AI Engineering */}
        <section style={{ padding: "56px 32px", borderTop: "1px solid var(--border-1)" }}>
          <Link href="/ai-engineering" style={{ display: "block", maxWidth: 900, margin: "0 auto", background: "var(--ink-current)", border: "1px solid var(--border-3)", borderRadius: 6, padding: "28px 32px", textDecoration: "none" }}>
            <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--glow-cyan)", marginBottom: 10 }}>Kaufen oder bauen</div>
            <div style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 30, color: "var(--fg-1)", lineHeight: 1.2, marginBottom: 10 }}>Kein Werkzeug passt? Dann entwickeln wir die Lösung mit Ihnen. →</div>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.65, margin: 0 }}>
              Wie wir KI-Software für den Betrieb entwickeln, mit Anforderungen, Tests und Qualitätsprüfung statt Vibe Coding, steht auf der Seite AI Engineering.
            </p>
          </Link>
        </section>

        <section style={{ padding: "80px 32px", textAlign: "center", background: "var(--ink-abyss)", borderTop: "1px solid var(--border-1)" }}>
          <h2 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(28px, 4vw, 48px)", color: "var(--fg-1)", margin: "0 0 20px" }}>
            Werkzeugauswahl professionell begleiten lassen.
          </h2>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 16, color: "var(--fg-2)", margin: "0 auto 32px", maxWidth: "48ch", lineHeight: 1.7 }}>
            Wir helfen Ihnen, die richtigen KI-Werkzeuge zu finden, zu bewerten und sicher einzuführen.
          </p>
          <Link href="/kontakt" style={{ display: "inline-block", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: ".08em", padding: "14px 32px", borderRadius: 4, background: "var(--glow-cyan)", color: "var(--ink-abyss)", textDecoration: "none" }}>
            Werkzeugauswahl prüfen lassen
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
