import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

const CATEGORIES = [
  "Text- und Chat-KI", "Automatisierung", "Wissensmanagement",
  "Voicebots", "Office- und Produktivitätstools",
  "Open-Source- und lokale KI", "CRM- und Sales-Automation",
];

const CRITERIA = [
  { n: "01", q: "Welches Problem löst das Tool?",                  desc: "Startpunkt ist immer das konkrete Problem — nicht das Tool." },
  { n: "02", q: "Passt es zu bestehenden Prozessen?",              desc: "Tools müssen sich in Ihre Abläufe einfügen, nicht umgekehrt." },
  { n: "03", q: "Wie hoch sind Lizenz- und Betriebskosten?",       desc: "TCO statt nur Lizenzkosten betrachten." },
  { n: "04", q: "Welche Daten werden verarbeitet?",                desc: "Datenflüsse verstehen — vor der Einführung, nicht danach." },
  { n: "05", q: "Ist das Tool DSGVO-konform einsetzbar?",          desc: "Besonders bei Cloud-Diensten: Serverstandort, AVV, Auftragsverarbeitung." },
  { n: "06", q: "Gibt es Schnittstellen zu bestehenden Systemen?", desc: "API-Verfügbarkeit, Standardkonnektoren, Integrationaufwand." },
  { n: "07", q: "Wie hoch ist der Schulungsaufwand?",              desc: "Adoption scheitert oft an fehlender Einführung — nicht am Tool." },
  { n: "08", q: "Entsteht ein Vendor Lock-in?",                    desc: "Exportierbarkeit, Portabilität, Alternativanbieter prüfen." },
  { n: "09", q: "Ist die Lösung skalierbar?",                      desc: "Was für 5 User funktioniert, muss auch für 50 taugen." },
];

export default function KiToolKompass() {
  return (
    <>
      <Header />
      <main>
        <section style={{ padding: "80px 32px 60px", background: "var(--ink-tide)", borderBottom: "1px solid var(--border-1)" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>KI Tool Kompass</span>
            <h1 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 1.05, color: "var(--fg-1)", margin: "20px 0 20px" }}>
              Die richtigen Tools für Ihr Unternehmen
            </h1>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 17, color: "var(--fg-2)", lineHeight: 1.7, maxWidth: "56ch", margin: "0 auto" }}>
              Der KI-Markt ist unübersichtlich. Ich helfe Unternehmen, passende Tools zu bewerten, sinnvoll einzuführen und sicher zu nutzen.
            </p>
          </div>
        </section>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>
          <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 400, fontSize: 36, color: "var(--fg-1)", margin: "0 0 32px" }}>
            Tool-Kategorien
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 80 }}>
            {CATEGORIES.map((c) => (
              <span key={c} style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, padding: "9px 18px", borderRadius: 999, background: "var(--ink-current)", border: "1px solid var(--border-2)", color: "var(--fg-2)" }}>{c}</span>
            ))}
          </div>

          <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 400, fontSize: 36, color: "var(--fg-1)", margin: "0 0 40px" }}>
            9 Bewertungskriterien
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

        <section style={{ padding: "80px 32px", textAlign: "center", background: "var(--ink-abyss)", borderTop: "1px solid var(--border-1)" }}>
          <h2 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(28px, 4vw, 48px)", color: "var(--fg-1)", margin: "0 0 20px" }}>
            Tool-Auswahl professionell begleiten lassen.
          </h2>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 16, color: "var(--fg-2)", margin: "0 auto 32px", maxWidth: "48ch", lineHeight: 1.7 }}>
            Ich helfe Ihnen, die richtigen KI-Tools zu finden, zu bewerten und sicher einzuführen.
          </p>
          <Link href="/kontakt" style={{ display: "inline-block", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: ".08em", padding: "14px 32px", borderRadius: 4, background: "var(--glow-cyan)", color: "var(--ink-abyss)", textDecoration: "none" }}>
            Tool-Auswahl prüfen lassen
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
