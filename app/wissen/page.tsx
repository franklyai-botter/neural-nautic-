import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";

const ARTICLES = [
  { title: "Was ist ein Controlled AI Pilot?",     excerpt: "Warum kontrollierte Praxistests der sicherste Weg zur KI-Einführung sind — und wie sie funktionieren.", mins: 6 },
  { title: "Warum KI-Prototypen oft scheitern",    excerpt: "Die häufigsten Fehler bei der KI-Einführung und wie Sie sie von Anfang an vermeiden.", mins: 8 },
  { title: "RAG einfach erklärt",                  excerpt: "Retrieval-Augmented Generation: Wie KI-Systeme auf Basis eigener Dokumente antworten.", mins: 5 },
  { title: "KI-Governance für den Mittelstand",    excerpt: "Klare Regeln für den KI-Einsatz — ohne Bürokratie, aber mit der nötigen Sorgfalt.", mins: 7 },
  { title: "Voicebots im Kundenservice",           excerpt: "Wann ein Voicebot sinnvoll ist, was er kann und was nicht — und wie die Einführung gelingt.", mins: 6 },
  { title: "KI im Vertrieb",                       excerpt: "Lead-Qualifizierung, Angebotserstellung, CRM — wo KI den Vertrieb wirklich unterstützt.", mins: 5 },
  { title: "Der KI Tool Kompass",                  excerpt: "Wie Sie KI-Tools systematisch bewerten und die richtige Wahl für Ihr Unternehmen treffen.", mins: 9 },
];

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
          <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 400, fontSize: 36, color: "var(--fg-1)", margin: "0 0 8px" }}>Artikel</h2>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-3)", margin: "0 0 40px" }}>Erscheint demnächst — tragen Sie sich für Updates ein.</p>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {ARTICLES.map((a, i) => (
              <div key={a.title} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, padding: "28px 0", borderBottom: i < ARTICLES.length - 1 ? "1px solid var(--border-1)" : "none", alignItems: "start" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 400, fontSize: 26, color: "var(--fg-1)", margin: "0 0 8px", lineHeight: 1.2 }}>{a.title}</h3>
                  <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-2)", margin: 0, lineHeight: 1.6, maxWidth: "58ch" }}>{a.excerpt}</p>
                </div>
                <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, color: "var(--fg-3)", letterSpacing: ".1em", textTransform: "uppercase" }}>{a.mins} Min.</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 80, paddingTop: 64, borderTop: "1px solid var(--border-1)" }}>
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
