import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";

const GLOSSARY = [
  { term: "Use Case",        def: "Ein konkreter Anwendungsfall, bei dem KI einen messbaren Nutzen erzeugt." },
  { term: "RAG",             def: "Retrieval-Augmented Generation. Ein KI-System, das Antworten auf Basis ausgewählter Dokumente oder Datenquellen erstellt." },
  { term: "Prompting",       def: "Die strukturierte Eingabe von Anweisungen an ein KI-System." },
  { term: "KI-Governance",   def: "Regeln, Rollen und Prozesse für sicheren und verantwortungsvollen KI-Einsatz." },
  { term: "Controlled Pilot",def: "Ein begrenzter, messbarer Praxistest für einen KI-Anwendungsfall." },
  { term: "Vendor Lock-in",  def: "Abhängigkeit von einem Anbieter, die spätere Wechsel erschwert." },
];

export default function Wissen() {
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
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>Wissen</span>
            <h1 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 1.05, color: "var(--fg-1)", margin: "20px 0 20px" }}>
              KI verständlich erklärt
            </h1>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 17, color: "var(--fg-2)", lineHeight: 1.7, maxWidth: "56ch", margin: "0 auto" }}>
              Praxisnahes Wissen zu KI, Automatisierung, Governance und Tool-Auswahl für Unternehmen.
            </p>
          </div>
        </section>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 32px" }}>
          <div style={{ marginTop: 0 }}>
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 400, fontSize: 36, color: "var(--fg-1)", margin: "0 0 40px" }}>Glossar</h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {GLOSSARY.map((g, i) => (
                <div key={g.term} style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, padding: "20px 0", borderBottom: i < GLOSSARY.length - 1 ? "1px solid var(--border-1)" : "none" }}>
                  <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 600, color: "var(--glow-cyan)" }}>{g.term}</span>
                  <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.6 }}>{g.def}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
