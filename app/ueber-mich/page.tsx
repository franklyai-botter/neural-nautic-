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
        <section style={{ padding: "80px 32px 60px", background: "var(--ink-tide)", borderBottom: "1px solid var(--border-1)" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 80, alignItems: "start" }}>
            <div style={{ position: "relative" }}>
              <div style={{ aspectRatio: "3/4", background: "linear-gradient(160deg, var(--ink-shoal), var(--ink-current))", borderRadius: 8, border: "1px solid var(--border-2)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0 }}>
                  <Image src="/bg-neural-network.png" alt="" fill style={{ objectFit: "cover", opacity: 0.2 }} />
                </div>
                <Image src="/logo-monogram.png" alt="Frank Schütt" width={160} height={128} style={{ objectFit: "contain", opacity: 0.8, position: "relative", filter: "drop-shadow(0 8px 32px rgba(63,212,224,.2))" }} />
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
      </main>
      <Footer />
    </>
  );
}
