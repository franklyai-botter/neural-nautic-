import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  {
    title: "Vertrieb und Marketing",
    cases: ["Lead-Qualifizierung", "Automatische Angebotserstellung", "Follow-up-E-Mails", "Content-Unterstützung", "CRM-Zusammenfassungen"],
  },
  {
    title: "Verwaltung und Backoffice",
    cases: ["Belegmanagement", "Dokumentenanalyse", "E-Mail-Klassifizierung", "Interne Wissenssuche", "Protokolle und Zusammenfassungen"],
  },
  {
    title: "Kundenservice",
    cases: ["Voicebot als intelligenter Anrufbeantworter", "FAQ-Bot", "Ticket-Vorqualifizierung", "Termin- und Rückrufmanagement", "Service-Zusammenfassungen"],
  },
  {
    title: "Management und Strategie",
    cases: ["KI-Roadmaps", "Tool-Bewertung", "Reporting-Unterstützung", "Wissensmanagement", "Risikoanalyse"],
  },
];

export default function UseCases() {
  return (
    <>
      <Header />
      <main>
        <section style={{ position: "relative", padding: "80px 32px 60px", overflow: "hidden", borderBottom: "1px solid var(--border-1)" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Image src="/bg-neural-network.png" alt="" fill style={{ objectFit: "cover", opacity: 0.35 }} />
          </div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(6,20,25,.2), rgba(6,20,25,.75) 80%)" }} />
          <div style={{ position: "relative", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>Use Cases</span>
            <h1 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 1.05, color: "var(--fg-1)", margin: "20px 0 20px" }}>
              KI-Use-Cases für echte Geschäftsprozesse
            </h1>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 17, color: "var(--fg-2)", lineHeight: 1.7, maxWidth: "56ch", margin: "0 auto" }}>
              Künstliche Intelligenz wird dann wertvoll, wenn sie konkrete Aufgaben erleichtert, Prozesse beschleunigt und Entscheidungen unterstützt.
            </p>
          </div>
        </section>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>
          {CATEGORIES.map((cat, i) => (
            <div key={cat.title} style={{ marginBottom: i < CATEGORIES.length - 1 ? 64 : 0 }}>
              <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 400, fontSize: 36, color: "var(--fg-1)", margin: "0 0 32px", paddingBottom: 20, borderBottom: "1px solid var(--border-1)" }}>
                {cat.title}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                {cat.cases.map((c) => (
                  <div key={c} style={{ background: "var(--ink-current)", border: "1px solid var(--border-2)", borderRadius: 6, padding: "20px 20px" }}>
                    <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--fg-2)", lineHeight: 1.5 }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <section style={{ padding: "80px 32px", textAlign: "center", background: "var(--ink-abyss)", borderTop: "1px solid var(--border-1)" }}>
          <h2 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(28px, 4vw, 48px)", color: "var(--fg-1)", margin: "0 0 20px" }}>
            Ihr Use Case ist nicht dabei?
          </h2>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 16, color: "var(--fg-2)", margin: "0 auto 32px", maxWidth: "48ch", lineHeight: 1.7 }}>
            Sprechen Sie mich an — ich prüfe gerne, ob und wie KI in Ihrem spezifischen Fall sinnvoll ist.
          </p>
          <Link href="/kontakt" style={{ display: "inline-block", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: ".08em", padding: "14px 32px", borderRadius: 4, background: "var(--glow-cyan)", color: "var(--ink-abyss)", textDecoration: "none" }}>
            Anfrage stellen
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
