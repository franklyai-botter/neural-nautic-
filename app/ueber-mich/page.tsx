import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";

const STRENGTHS = [
  "Verständliche Übersetzung komplexer KI-Themen",
  "Fokus auf reale Prozesse statt abstrakte Hype-Themen",
  "Erfahrung mit Tool-Auswahl, Automatisierung und KI-Workflows",
  "Blick für Datenschutz, Governance und organisatorische Einführung",
  "Kombination aus Strategie, Umsetzung und Schulung",
  "Mittelstandstauglicher Beratungsstil",
];

export default function UeberMich() {
  return (
    <>
      <Header />
      <main>
        <section style={{ position: "relative", padding: "80px 32px 60px", overflow: "hidden", borderBottom: "1px solid var(--border-1)" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Image src="/bg-neural-network.png" alt="" fill style={{ objectFit: "cover", objectPosition: "right center", opacity: 0.35 }} />
          </div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(6,20,25,.2), rgba(6,20,25,.75) 80%)" }} />
          <div style={{ position: "relative", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>Über mich</span>
            <h1 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 1.05, color: "var(--fg-1)", margin: "20px 0 20px" }}>
              Ich bringe KI in echte Arbeitsprozesse.
            </h1>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 17, color: "var(--fg-2)", lineHeight: 1.7, maxWidth: "52ch", margin: "0 auto" }}>
              Mein Fokus liegt auf pragmatischer KI-Einführung für Unternehmen: verständlich, sicher, messbar und umsetzbar.
            </p>
          </div>
        </section>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>
          <div className="nn-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 80, alignItems: "start" }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "relative", aspectRatio: "5/4", borderRadius: 8, border: "1px solid var(--border-2)", overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
                <Image src="/frank-portrait.png" alt="Frank Schütt — Berlin, Spreeufer" fill priority sizes="(max-width: 1024px) 100vw, 460px" style={{ objectFit: "cover", objectPosition: "center" }} />
              </div>
              <div style={{ marginTop: 24 }}>
                <p style={{ fontFamily: "var(--font-italiana), serif", fontSize: 24, color: "var(--fg-1)", margin: "0 0 4px" }}>Frank Schütt</p>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--glow-cyan)", letterSpacing: ".12em", textTransform: "uppercase", margin: "0 0 4px" }}>KI-Berater</p>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--fg-3)", margin: 0 }}>Berlin · Brandenburg · Remote DACH</p>
              </div>
            </div>

            <div>
              <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 22, color: "var(--fg-1)", lineHeight: 1.55, margin: "0 0 32px" }}>
                Ich unterstütze Unternehmen dabei, künstliche Intelligenz nicht nur zu verstehen, sondern sinnvoll in den Arbeitsalltag zu integrieren.
              </p>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, color: "var(--fg-2)", lineHeight: 1.75, margin: "0 0 24px" }}>
                Dabei verbinde ich KI-Verständnis, Prozessdenken, Tool-Kompetenz und Change-Perspektive. Mein Ansatz ist pragmatisch: Erst verstehen wir das Problem, dann wählen wir die passende Lösung.
              </p>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, color: "var(--fg-2)", lineHeight: 1.75, margin: "0 0 40px" }}>
                Ich arbeite besonders gern an Schnittstellen zwischen Geschäftsführung, IT, Fachabteilungen, Datenschutz und operativen Teams. Denn erfolgreiche KI-Einführung ist nicht nur eine technische Aufgabe — sie ist auch eine Frage von Akzeptanz, Verantwortung und klarer Kommunikation.
              </p>

              <h2 style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".2em", color: "var(--glow-cyan)", margin: "0 0 20px" }}>Was mich auszeichnet</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px", display: "flex", flexDirection: "column", gap: 12 }}>
                {STRENGTHS.map((s) => (
                  <li key={s} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ color: "var(--glow-cyan)", flexShrink: 0, marginTop: 3 }}>✓</span>
                    <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, color: "var(--fg-2)", lineHeight: 1.5 }}>{s}</span>
                  </li>
                ))}
              </ul>

              <Link href="/kontakt" style={{ display: "inline-block", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: ".08em", padding: "14px 28px", borderRadius: 4, background: "var(--glow-cyan)", color: "var(--ink-abyss)", textDecoration: "none" }}>
                Gespräch anfragen
              </Link>
            </div>
          </div>
        </div>

        {/* ZERTIFIKATE */}
        <section id="zertifikate" style={{ position: "relative", padding: "80px 32px", borderTop: "1px solid var(--border-1)", background: "linear-gradient(180deg, var(--bg-1) 0%, var(--ink-deep) 100%)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>Externe Validierung</span>
              <h2 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.1, color: "var(--fg-1)", margin: "16px 0 16px" }}>
                Geprüft nach Norm. Bewährt in der Praxis.
              </h2>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, color: "var(--fg-3)", maxWidth: "52ch", margin: "0 auto", lineHeight: 1.7 }}>
                Zwei unabhängige Nachweise — einer aus der Strategie-Norm, einer aus der Mittelstandspraxis.
              </p>
            </div>

            <div className="nn-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>

              {/* TÜV SÜD */}
              <article style={{ position: "relative", background: "linear-gradient(160deg, rgba(10,32,40,0.7), rgba(14,43,54,0.45))", border: "1px solid var(--border-2)", borderRadius: 8, padding: 36, display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: "0.14em", color: "var(--fg-1)", marginBottom: 6 }}>
                  TÜV SÜD AKADEMIE
                </div>
                <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)", marginBottom: 18 }}>
                  Strategische Kompetenz
                </div>
                <h3 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: 26, lineHeight: 1.2, color: "var(--fg-1)", margin: "0 0 16px" }}>
                  AI Strategy &amp; Application Expert
                </h3>
                <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 18, color: "var(--fg-2)", lineHeight: 1.55, margin: "0 0 20px" }}>
                  „Strukturierte KI-Führung — nach Akademie-Norm geprüft."
                </p>
                <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--fg-3)", lineHeight: 1.7, margin: "0 0 28px", flexGrow: 1 }}>
                  Strategie · Roadmaps · Governance · Risikomanagement
                </div>
                <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.06em", marginBottom: 14 }}>
                  04.12.2025  ·  Z-001124711
                </div>
                <a href="/cert-tuev-sued.pdf" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.04em", color: "var(--glow-cyan)" }}>
                  Zertifikat ansehen →
                </a>
              </article>

              {/* Neurawork */}
              <article style={{ position: "relative", background: "linear-gradient(160deg, rgba(10,32,40,0.7), rgba(14,43,54,0.45))", border: "1px solid var(--border-2)", borderRadius: 8, padding: 36, display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: "0.14em", color: "var(--fg-1)", marginBottom: 6 }}>
                  NEURAWORK
                </div>
                <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)", marginBottom: 18 }}>
                  Umsetzungs-Kompetenz
                </div>
                <h3 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: 26, lineHeight: 1.2, color: "var(--fg-1)", margin: "0 0 16px" }}>
                  AI Business Coaching
                </h3>
                <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 18, color: "var(--fg-2)", lineHeight: 1.55, margin: "0 0 20px" }}>
                  „Praxis-Umsetzung im DACH-Mittelstand — partnergeprüft."
                </p>
                <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--fg-3)", lineHeight: 1.7, margin: "0 0 28px", flexGrow: 1 }}>
                  Business Cases · Workflow-Automatisierung · Skalierung · KI-Geschäftsmodelle
                </div>
                <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.06em", marginBottom: 14 }}>
                  14.01.2025 – 14.07.2026  ·  Virtualbadge verifiziert
                </div>
                <a href="https://www.virtualbadge.io/certificate-validator?credential=f2d4fd9a-dccc-4363-ada5-287b0a2b5f01" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.04em", color: "var(--glow-cyan)" }}>
                  Zertifikat ansehen →
                </a>
              </article>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
