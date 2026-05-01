import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";

const SERVICES = [
  {
    title: "KI-Potenzialanalyse",
    short: "Wir identifizieren, wo künstliche Intelligenz in Ihrem Unternehmen sinnvoll eingesetzt werden kann — und wo nicht.",
    long: "Viele Unternehmen starten mit KI-Tools, bevor klar ist, welches Problem eigentlich gelöst werden soll. Die KI-Potenzialanalyse schafft Orientierung. Gemeinsam betrachten wir Prozesse, Daten, Systeme, Teams und Ziele. Daraus entsteht eine priorisierte Übersicht möglicher KI-Anwendungsfälle.",
    items: ["Prozessaufnahme", "Tool- und Systemanalyse", "Identifikation relevanter KI-Use-Cases", "Aufwand-Nutzen-Bewertung", "Risiko- und Datenschutz-Ersteinschätzung", "Priorisierung nach Wirkung und Machbarkeit"],
    result: "Eine klare KI-Roadmap mit konkreten Handlungsempfehlungen.",
    cta: "Potenzialanalyse anfragen",
  },
  {
    title: "Controlled Pilot",
    short: "KI sicher testen, bevor sie breit ausgerollt wird.",
    long: "Ein Controlled Pilot ist ein kontrollierter Praxistest für einen klar definierten KI-Use-Case. Dabei arbeiten wir mit echten Prozessen, echten Nutzern und messbaren Kennzahlen — aber in einem begrenzten, sicheren Rahmen.",
    items: ["Definition des Pilotziels", "Auswahl des passenden Use Cases", "Festlegung messbarer Kennzahlen", "Aufbau der technischen Lösung", "Einbindung relevanter Mitarbeitender", "Feedback- und Optimierungsschleifen", "Entscheidungsvorlage für Skalierung"],
    result: "Eine belastbare Entscheidungsgrundlage: skalieren, anpassen oder stoppen.",
    cta: "Pilotprojekt starten",
  },
  {
    title: "KI-Automatisierung",
    short: "Wiederkehrende Aufgaben mit KI, Workflows und APIs automatisieren.",
    long: "KI entfaltet ihren größten Nutzen dort, wo sie konkrete Arbeitsabläufe unterstützt. Ich helfe beim Aufbau operativer KI-Workflows — etwa für E-Mail-Verarbeitung, Angebotserstellung, Dokumentenanalyse, Voicebots, CRM-Prozesse oder interne Wissenssysteme.",
    items: ["Automatische Angebotserstellung", "Voicebot für Anrufannahme", "E-Mail-Klassifizierung und Antwortvorschläge", "Dokumenten- und Belegverarbeitung", "CRM-Zusammenfassungen", "Lead-Vorqualifizierung", "Interne Wissensassistenten", "n8n-, Make- oder API-basierte Workflows"],
    result: "Ein produktiver KI-Workflow mit Dokumentation, Übergabe und klaren Zuständigkeiten.",
    cta: "Automatisierung prüfen",
  },
  {
    title: "KI-Governance und Sicherheit",
    short: "Klare Regeln für sicheren, nachvollziehbaren und verantwortungsvollen KI-Einsatz.",
    long: "KI braucht nicht nur Technologie, sondern auch Regeln. Ich unterstütze Unternehmen beim Aufbau verständlicher Governance-Strukturen — mit Blick auf Datenschutz, EU AI Act, Rollen, Verantwortlichkeiten, Tool-Freigaben und interne Kommunikation.",
    items: ["KI-Richtlinien", "Tool-Freigabeprozesse", "Datenschutz-Ersteinschätzung", "Risikoklassifizierung von KI-Anwendungen", "Rollen- und Rechtekonzepte", "Dokumentationsvorlagen", "Einbindung von Datenschutz, IT und Betriebsrat"],
    result: "Ein klarer Rahmen, in dem KI sicher und akzeptiert genutzt werden kann.",
    cta: "Governance besprechen",
  },
  {
    title: "KI-Schulung und Enablement",
    short: "Mitarbeitende befähigen, KI sicher und produktiv im Arbeitsalltag einzusetzen.",
    long: "Der Erfolg von KI hängt nicht nur von Tools ab, sondern von Menschen. Ich entwickle Schulungsformate für Geschäftsführung, Fachabteilungen, Vertrieb, Marketing, Verwaltung und interne AI Champions.",
    items: ["KI-Grundlagenworkshop", "Prompting für Fachabteilungen", "KI im Vertrieb", "KI im Backoffice", "KI für Führungskräfte", "Governance-Schulung", "Tool-Kompass-Workshop", "AI-Champion-Programm"],
    result: "Teams verstehen, wo KI hilft, wo Grenzen liegen und wie sie Tools sicher einsetzen.",
    cta: "Schulung anfragen",
  },
  {
    title: "KI Tool Kompass",
    short: "Bewertung und Auswahl passender KI-Tools nach Nutzen, Kosten, Datenschutz und Integrationsfähigkeit.",
    long: "Der KI-Markt ist unübersichtlich. Ich helfe Unternehmen, passende Tools zu bewerten, sinnvoll einzuführen und sicher zu nutzen — tool-agnostisch und ohne Herstellerinteressen.",
    items: ["Text- und Chat-KI", "Automatisierungstools", "Wissensmanagement", "Voicebots", "Office- und Produktivitätstools", "Open-Source- und lokale KI", "CRM- und Sales-Automation"],
    result: "Eine fundierte Tool-Entscheidung, die zu Ihren Prozessen, Ihrem Budget und Ihrer Datenschutzstrategie passt.",
    cta: "Tool-Auswahl prüfen lassen",
  },
];

export default function Leistungen() {
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
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>Leistungen</span>
            <h1 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 1.05, color: "var(--fg-1)", margin: "20px 0 20px" }}>
              KI-Leistungen für Analyse, Umsetzung und Skalierung
            </h1>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 17, color: "var(--fg-2)", lineHeight: 1.7, maxWidth: "56ch", margin: "0 auto" }}>
              Von der ersten Idee bis zum produktiven KI-Workflow: Ich unterstütze Unternehmen dabei, KI sinnvoll, sicher und wirtschaftlich einzusetzen.
            </p>
          </div>
        </section>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>
          {SERVICES.map((s, i) => (
            <div key={s.title} style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 64, padding: "64px 0", borderBottom: i < SERVICES.length - 1 ? "1px solid var(--border-1)" : "none" }}>
              <div>
                <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 10, color: "var(--glow-cyan)", letterSpacing: ".12em", marginBottom: 12 }}>0{i + 1}</div>
                <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 400, fontSize: 36, color: "var(--fg-1)", margin: "0 0 16px", lineHeight: 1.15 }}>{s.title}</h2>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, color: "var(--fg-2)", lineHeight: 1.65, margin: "0 0 28px" }}>{s.short}</p>
                <Link href="/kontakt" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: ".08em", padding: "11px 22px", borderRadius: 4, background: "var(--glow-cyan)", color: "var(--ink-abyss)", textDecoration: "none", display: "inline-block" }}>
                  {s.cta}
                </Link>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, color: "var(--fg-2)", lineHeight: 1.7, margin: "0 0 28px" }}>{s.long}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {s.items.map(item => (
                    <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color: "var(--glow-cyan)", flexShrink: 0, marginTop: 2 }}>✓</span>
                      <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-2)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ background: "var(--ink-current)", border: "1px solid var(--border-3)", borderRadius: 4, padding: "16px 20px" }}>
                  <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".16em", color: "var(--glow-cyan)" }}>Ergebnis: </span>
                  <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-1)" }}>{s.result}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section style={{ padding: "80px 32px", textAlign: "center", background: "var(--ink-abyss)", borderTop: "1px solid var(--border-1)" }}>
          <h2 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(28px, 4vw, 48px)", color: "var(--fg-1)", margin: "0 0 20px" }}>
            Bereit für den ersten Schritt?
          </h2>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 16, color: "var(--fg-2)", margin: "0 auto 32px", maxWidth: "48ch", lineHeight: 1.7 }}>
            Lassen Sie uns gemeinsam prüfen, welche Leistung zu Ihrer Situation passt.
          </p>
          <Link href="/kontakt" style={{ display: "inline-block", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: ".08em", padding: "14px 32px", borderRadius: 4, background: "var(--glow-cyan)", color: "var(--ink-abyss)", textDecoration: "none" }}>
            KI-Potenzialcheck buchen
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
