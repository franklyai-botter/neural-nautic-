import Header from "../components/Header";
import Footer from "../components/Footer";
import type { Metadata } from "next";
import EbenenModell from "../components/EbenenModell";
import { KI_CHECK_BUCHEN } from "../site";
export const metadata: Metadata = {
  title: "KI im Projekt: Verstehen, Zuschneiden, Pilotieren, Automatisieren, Übergeben | NeuralNautic",
  alternates: { canonical: "/methode" },
  description: "Wie ein einzelner KI-Anwendungsfall umgesetzt wird: Prozess verstehen, Ziel und Kennzahlen festlegen, kontrolliert pilotieren, automatisieren und in den Betrieb übergeben.",
  openGraph: { title: "KI im Projekt: von der Prozessanalyse bis zur Übergabe", description: "Wie ein einzelner KI-Anwendungsfall umgesetzt wird: verstehen, zuschneiden, pilotieren, automatisieren, übergeben.", url: "/methode" },
};

// Ebene 2 (Projekt): ein Anwendungsfall aus der Roadmap. Priorisieren über alle Fälle und
// Skalieren gehören zur Ebene 1 (Unternehmen, /ki-im-unternehmen).
const PHASES = [
  { n: "01", title: "Verstehen",      desc: "Am Anfang steht kein Werkzeug, sondern der Prozess, um den es geht. Wir sehen uns Abläufe, Beteiligte, Daten, Systeme und Risiken dieses Anwendungsfalls an, bevor irgendeine KI-Lösung ins Spiel kommt.", result: "Klares Bild des Prozesses heute" },
  { n: "02", title: "Zuschneiden",    desc: "Wir legen fest, was der Anwendungsfall leisten soll: Ziel, Kennzahlen, benötigte Daten, Risikoeinstufung und ab wann wir abbrechen. Welcher Fall als Nächstes drankommt, entscheidet der Fahrplan auf Unternehmensebene.", result: "Projektauftrag mit messbarem Ziel" },
  { n: "03", title: "Pilotieren",     desc: "Der Anwendungsfall wird in einem Controlled Pilot getestet: mit echten Prozessen, echten Nutzern und den vereinbarten Kennzahlen, in einem begrenzten, kontrollierten Rahmen.", result: "Messbarer Praxistest mit Entscheidung: weiter, anpassen oder stoppen" },
  { n: "04", title: "Automatisieren", desc: "Ein erfolgreicher Pilot wird zu einem stabilen Ablauf ausgebaut, auf der gemeinsamen KI-Architektur des Unternehmens und nach den Regeln des AI Engineering: getestet, dokumentiert, mit Schnittstellen zu Ihren Systemen.", result: "Produktiver KI-gestützter Arbeitsablauf" },
  { n: "05", title: "Übergeben",      desc: "Die Lösung geht über das Freigabeverfahren des Unternehmens in den Betrieb. Die Nutzer werden eingewiesen, Zuständigkeiten sind benannt, und die Kennzahlen fließen in den Fahrplan zurück.", result: "Lösung im Regelbetrieb, Erfahrungen für den nächsten Fall" },
];

const PRINCIPLES = [
  { title: "Pragmatisch",      desc: "Kein Hype, keine Spielereien. Nur was funktioniert und echten Nutzen bringt." },
  { title: "Messbar",          desc: "Jedes Projekt hat klare Ziele, Metriken und eine Entscheidungsgrundlage." },
  { title: "Sicher",           desc: "Datenschutz und Governance sind kein Nachgedanke, sondern Grundlage." },
  { title: "Verständlich",     desc: "Komplexe KI-Themen werden so erklärt, dass alle Beteiligten mitreden können." },
  { title: "Menschzentriert",  desc: "KI unterstützt Menschen, sie ersetzt sie nicht." },
  { title: "Herstellerneutral",     desc: "Wir sind an keinen Anbieter gebunden und empfehlen, was zu Ihnen passt." },
];

export default function Methode() {
  return (
    <>
      <Header />
      <main>
        <section style={{ position: "relative", padding: "80px 32px 60px", overflow: "hidden", borderBottom: "1px solid var(--border-1)" }}>
          <div style={{ position: "relative", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>Methode · Im Projekt</span>
            <h1 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(36px, 4.6vw, 64px)", lineHeight: 1.08, color: "var(--fg-1)", margin: "20px 0 20px" }}>
              Jedes KI-Projekt setzt einen Anwendungsfall in fünf Schritten um
            </h1>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 17, color: "var(--fg-2)", lineHeight: 1.7, maxWidth: "58ch", margin: "0 auto" }}>
              Welche Anwendungsfälle sich lohnen und in welcher Reihenfolge, steht im Fahrplan Ihres Unternehmens. Hier geht es um den einzelnen Fall: von der Prozessanalyse bis zum Regelbetrieb. Ziel ist nicht möglichst viel KI, sondern die richtige KI an der richtigen Stelle.
            </p>
          </div>
        </section>

        <section className="nn-section" style={{ padding: "64px 32px 0" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <EbenenModell aktiv="projekt" />
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
              Sechs Prinzipien, die unsere Arbeit leiten.
            </h2>
            <div className="nn-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
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
          <a href={KI_CHECK_BUCHEN} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: ".08em", padding: "14px 32px", borderRadius: 4, background: "var(--glow-cyan)", color: "var(--ink-abyss)", textDecoration: "none" }}>
            KI-Potenzialcheck buchen
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
