import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

const PHASES = [
  { n: "01", title: "Verstehen",    desc: "Am Anfang steht kein Tool, sondern das Problem. Wir analysieren Prozesse, Ziele, Daten, Systeme und Risiken — bevor irgendeine KI-Lösung ins Spiel kommt.", result: "Klares Bild der Ausgangssituation" },
  { n: "02", title: "Priorisieren", desc: "Mögliche Use Cases werden nach Nutzen, Aufwand, Risiko, Datenlage und Umsetzbarkeit bewertet. So entsteht eine fundierte Entscheidungsgrundlage statt Aktionismus.", result: "Priorisierte KI-Roadmap" },
  { n: "03", title: "Pilotieren",   desc: "Der beste Use Case wird in einem Controlled Pilot getestet — mit echten Prozessen, echten Nutzern und messbaren Kennzahlen, in einem begrenzten, sicheren Rahmen.", result: "Messbarer Praxistest" },
  { n: "04", title: "Automatisieren", desc: "Erfolgreiche Piloten werden in stabile, operative Workflows überführt. Dokumentation, Schnittstellen und klare Zuständigkeiten sorgen für nachhaltigen Betrieb.", result: "Operativer KI-Workflow" },
  { n: "05", title: "Skalieren",    desc: "Lösungen werden dokumentiert, geschult und in Governance-Strukturen eingebettet. Mitarbeitende werden befähigt, KI sicher und produktiv zu nutzen.", result: "Nachhaltige Einführung mit Governance und Schulung" },
];

const PRINCIPLES = [
  { title: "Pragmatisch",      desc: "Kein Hype, keine Spielereien. Nur was funktioniert und echten Nutzen bringt." },
  { title: "Messbar",          desc: "Jedes Projekt hat klare Ziele, Metriken und eine Entscheidungsgrundlage." },
  { title: "Sicher",           desc: "Datenschutz und Governance sind kein Nachgedanke, sondern Grundlage." },
  { title: "Verständlich",     desc: "Komplexe KI-Themen werden so erklärt, dass alle Beteiligten mitreden können." },
  { title: "Menschzentriert",  desc: "KI unterstützt Menschen — sie ersetzt sie nicht." },
  { title: "Tool-neutral",     desc: "Ich bin an keinen Anbieter gebunden und empfehle, was zu Ihnen passt." },
];

export default function Methode() {
  return (
    <>
      <Header />
      <main>
        <section style={{ padding: "80px 32px 60px", background: "var(--ink-tide)", borderBottom: "1px solid var(--border-1)" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>Methode</span>
            <h1 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 1.05, color: "var(--fg-1)", margin: "20px 0 20px" }}>
              Vom KI-Hype zur kontrollierten Umsetzung
            </h1>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 17, color: "var(--fg-2)", lineHeight: 1.7, maxWidth: "56ch", margin: "0 auto" }}>
              Ich arbeite mit einer klaren, pragmatischen Methode. Ziel ist nicht möglichst viel KI, sondern die richtige KI an der richtigen Stelle.
            </p>
          </div>
        </section>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 32px" }}>
          {PHASES.map((p, i) => (
            <div key={p.n} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 40, paddingBottom: 56, marginBottom: 56, borderBottom: i < PHASES.length - 1 ? "1px solid var(--border-1)" : "none", position: "relative" }}>
              {i < PHASES.length - 1 && (
                <div style={{ position: "absolute", left: 36, top: 56, bottom: -56, width: 1, background: "linear-gradient(180deg, var(--glow-cyan), transparent)" }} />
              )}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--ink-current)", border: "1px solid var(--border-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 12, color: "var(--glow-cyan)" }}>{p.n}</span>
                </div>
              </div>
              <div>
                <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 400, fontSize: 36, color: "var(--fg-1)", margin: "8px 0 16px", lineHeight: 1.1 }}>{p.title}</h2>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, color: "var(--fg-2)", lineHeight: 1.7, margin: "0 0 20px" }}>{p.desc}</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--ink-current)", border: "1px solid var(--border-3)", borderRadius: 4, padding: "10px 16px" }}>
                  <span style={{ color: "var(--glow-cyan)", fontSize: 12 }}>✓</span>
                  <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--fg-1)" }}>Ergebnis: {p.result}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section style={{ padding: "80px 32px", background: "var(--ink-tide)", borderTop: "1px solid var(--border-1)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 400, fontSize: 40, color: "var(--fg-1)", margin: "0 0 48px", textAlign: "center" }}>
              Sechs Prinzipien, die meine Arbeit leiten.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {PRINCIPLES.map((pr) => (
                <div key={pr.title} style={{ background: "var(--ink-current)", border: "1px solid var(--border-2)", borderRadius: 6, padding: "28px 28px" }}>
                  <h3 style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 600, color: "var(--glow-cyan)", letterSpacing: ".08em", textTransform: "uppercase", margin: "0 0 10px" }}>{pr.title}</h3>
                  <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.65, margin: 0 }}>{pr.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "80px 32px", textAlign: "center", background: "var(--ink-abyss)", borderTop: "1px solid var(--border-1)" }}>
          <h2 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(28px, 4vw, 48px)", color: "var(--fg-1)", margin: "0 0 20px" }}>
            Bereit, gemeinsam zu starten?
          </h2>
          <Link href="/kontakt" style={{ display: "inline-block", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: ".08em", padding: "14px 32px", borderRadius: 4, background: "var(--glow-cyan)", color: "var(--ink-abyss)", textDecoration: "none" }}>
            KI-Potenzialcheck buchen
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
