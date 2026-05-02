import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";

const GLOSSARY = [
  { term: "Use Case",             def: "Ein konkreter Anwendungsfall, bei dem KI einen messbaren Nutzen erzeugt." },
  { term: "RAG",                  def: "Retrieval-Augmented Generation. Ein KI-System, das Antworten auf Basis ausgewählter Dokumente oder Datenquellen erstellt." },
  { term: "Prompting",            def: "Die strukturierte Eingabe von Anweisungen an ein KI-System, um gezielt nützliche Ergebnisse zu erhalten." },
  { term: "KI-Governance",        def: "Regeln, Rollen und Prozesse für sicheren und verantwortungsvollen KI-Einsatz im Unternehmen." },
  { term: "Controlled Pilot",     def: "Ein begrenzter, messbarer Praxistest für einen KI-Anwendungsfall — mit klarem Ziel, Zeitrahmen und Erfolgskriterien." },
  { term: "Vendor Lock-in",       def: "Abhängigkeit von einem Anbieter, die spätere Wechsel technisch oder wirtschaftlich erschwert." },
  { term: "LLM",                  def: "Large Language Model. Ein KI-Modell, das auf großen Textmengen trainiert wurde und natürliche Sprache versteht und erzeugt — z. B. GPT-4, Claude oder Gemini." },
  { term: "GPT",                  def: "Generative Pre-trained Transformer. Die Architektur hinter vielen modernen Sprachmodellen wie ChatGPT." },
  { term: "Token",                def: "Die kleinste Verarbeitungseinheit eines Sprachmodells — grob ein Wort oder Wortteil. Bestimmt Kosten und Kontextgröße." },
  { term: "Kontextfenster",       def: "Die Menge an Text, die ein KI-Modell in einem Durchgang lesen und verarbeiten kann. Je größer, desto mehr Dokumente passen hinein." },
  { term: "Embedding",            def: "Eine numerische Darstellung von Text, mit der KI-Systeme Bedeutung und Ähnlichkeit von Inhalten erkennen können." },
  { term: "Vektordatenbank",      def: "Eine Datenbank, die Embeddings speichert und schnelle Ähnlichkeitssuchen ermöglicht — Grundlage vieler RAG-Systeme." },
  { term: "Fine-Tuning",          def: "Das Nachtrainieren eines Basismodells auf eigenen Daten, um es für einen spezifischen Zweck zu spezialisieren." },
  { term: "Halluzination",        def: "Wenn ein KI-Modell falsche oder erfundene Informationen mit hoher Überzeugung ausgibt. Wichtiger Risikofaktor im Unternehmenseinsatz." },
  { term: "AI Agent",             def: "Ein KI-System, das selbstständig Aufgaben plant, Werkzeuge nutzt und mehrere Schritte ausführt — ohne ständige menschliche Eingabe." },
  { term: "Automation",           def: "Automatisierung wiederkehrender Aufgaben durch Software oder KI, um manuelle Arbeit zu reduzieren und Prozesse zu beschleunigen." },
  { term: "Prompt Engineering",   def: "Die systematische Entwicklung und Optimierung von Eingaben an KI-Modelle, um konsistent hochwertige Ergebnisse zu erzielen." },
  { term: "Zero-Shot",            def: "Eine KI löst eine Aufgabe ohne vorherige Beispiele — nur durch die Beschreibung im Prompt." },
  { term: "Few-Shot",             def: "Eine KI erhält wenige Beispiele im Prompt und überträgt das Muster auf neue Aufgaben." },
  { term: "Chain of Thought",     def: "Eine Prompting-Technik, bei der das Modell Zwischenschritte explizit durchdenkt — verbessert Genauigkeit bei komplexen Aufgaben." },
  { term: "API",                  def: "Application Programming Interface. Eine Schnittstelle, über die Software-Systeme miteinander kommunizieren — z. B. um ein KI-Modell in eine eigene Anwendung einzubinden." },
  { term: "Multimodal",           def: "KI-Systeme, die mehrere Eingabetypen verarbeiten können — z. B. Text, Bilder, Audio oder Dokumente in einem Modell." },
  { term: "Inferenz",             def: "Der Vorgang, bei dem ein trainiertes KI-Modell eine Anfrage verarbeitet und eine Antwort generiert." },
  { term: "Latenz",               def: "Die Zeit, die ein KI-System benötigt, um auf eine Anfrage zu antworten. Relevant für Echtzeit-Anwendungen wie Chatbots oder Voicebots." },
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
