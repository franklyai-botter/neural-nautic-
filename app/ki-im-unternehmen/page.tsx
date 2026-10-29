import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import type { Metadata } from "next";
import Architektur3D from "../components/Architektur3D";
import ArchitekturDownload from "../components/ArchitekturDownload";
import EbenenModell from "../components/EbenenModell";
export const metadata: Metadata = {
  title: "KI im Unternehmen: Wertschöpfung, Vorgehen, Architektur | NeuralNautic",
  alternates: { canonical: "/ki-im-unternehmen" },
  description: "Wie KI im Mittelstand messbar wirkt: die richtige Wertschöpfungsstufe, ein festes Vorgehen aus Strategie, Befähigung und Architektur und eine DSGVO-konforme KI-Architektur.",
  openGraph: { title: "KI im Unternehmen: Wertschöpfung, Vorgehen, Architektur", description: "Wie KI im Mittelstand messbar wirkt: die richtige Wertschöpfungsstufe, ein festes Vorgehen und eine DSGVO-konforme KI-Architektur.", url: "/ki-im-unternehmen" },
};

// Diagrammfarben laut BRAND.md, Abschnitt "Diagramme" (Website): ein Akzent in Cyan, Rest Petrol hell, Beschriftung Sand.
const ACCENT = "var(--glow-aqua)";
const MUTED = "var(--ink-shoal)";

const kicker = { fontFamily: "var(--font-jetbrains), monospace", fontSize: 10, color: "var(--glow-cyan)", letterSpacing: ".16em", textTransform: "uppercase" as const, marginBottom: 14 };
const h2 = { fontFamily: "var(--font-cormorant), serif", fontWeight: 400, fontSize: "clamp(30px, 3.4vw, 42px)", color: "var(--fg-1)", margin: "0 0 18px", lineHeight: 1.15, maxWidth: "26ch" };
const lead = { fontFamily: "var(--font-inter), sans-serif", fontSize: 16, color: "var(--fg-2)", lineHeight: 1.7, margin: "0 0 40px", maxWidth: "62ch" };
const body = { fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.65, margin: 0 };
const card = { background: "var(--ink-current)", border: "1px solid var(--border-2)", borderRadius: 6, padding: "26px 26px" };
const source = { fontFamily: "var(--font-inter), sans-serif", fontSize: 11, color: "var(--fg-3)", lineHeight: 1.6, marginTop: 18 };

const STUFEN = [
  { n: "01", title: "KI-Werkzeuge nutzen",          desc: "Fertige Tools wie Chat-Assistenten, Übersetzer oder Meeting-Protokolle. Schnell eingeführt, aber Ihre Wettbewerber nutzen dieselben.", width: 44, corridor: false },
  { n: "02", title: "KI an eigene Prozesse anbinden", desc: "KI arbeitet in Ihren Abläufen: Posteingang, Angebote, CRM, Dokumente. Hier entsteht der erste spürbare Vorsprung.", width: 58, corridor: true },
  { n: "03", title: "Eigene KI-Services aufbauen",  desc: "Assistenten und Agenten, zugeschnitten auf Ihr Wissen und Ihre Regeln, für Mitarbeitende oder für Ihre Kunden.", width: 72, corridor: true },
  { n: "04", title: "Eigene Daten nutzbar machen",  desc: "Vorhersagen und Auswertungen aus Ihren Unternehmensdaten, etwa zu Bedarf, Ausfällen oder Preisen.", width: 86, corridor: true },
  { n: "05", title: "Eigene KI-Verfahren entwickeln", desc: "Neue Algorithmen als geistiges Eigentum. Forschungsaufwand, für die meisten Mittelständler nicht der nächste Schritt.", width: 100, corridor: false },
];

const DISZIPLINEN = [
  { title: "Strategie",              claim: "Was lohnt sich, und warum?",            desc: "Ziele, Engpässe und Anwendungsfälle werden nach Wirkung bewertet. Ergebnis ist eine Roadmap, die Geschäftsführung und Fachbereiche mittragen." },
  { title: "Befähigung und Wandel",  claim: "Nutzung statt bloßem Wissen.",          desc: "Führungskräfte, Multiplikatoren und Teams werden so eingebunden und geschult, dass die neuen Abläufe im Alltag tatsächlich genutzt werden." },
  { title: "KI-Architektur",         claim: "Produktionsreif statt Demo.",           desc: "Systeme, die stabil laufen, sicher sind und sich in Ihre bestehende IT einfügen, mit klarer Verantwortung für den Betrieb." },
];

const STRAENGE = [
  { title: "KI-Strategie", steps: ["Ausgangslage und Unternehmensziele", "Engpässe und Probleme", "KI-Zielbild", "Anwendungsfälle in drei Horizonten", "Bewertung und Priorisierung", "Roadmap"] },
  { title: "Wandel und Kommunikation", steps: ["Führungskräfte einbinden", "Multiplikatoren gewinnen", "Kernbotschaft und Auftakt", "Schulung", "Erste Erfolge sichtbar machen", "Übergabe in die Linienverantwortung"] },
  { title: "KI-Managementsystem", note: "angelehnt an ISO/IEC 42001", steps: ["Rollen und Verantwortlichkeiten", "KI-Richtlinie", "Risikoanalyse", "Unterweisung", "Freigabeverfahren für KI-Anwendungen", "Audit, Kennzahlen, Verbesserung"] },
];

const SCHICHTEN: { n: string; title: string; items: string; parts?: { n: string; title: string; items: string }[] }[] = [
  { n: "7", title: "Governance und Compliance", items: "KI-Richtlinie · Rollen · Risikomanagement · Einstufung nach EU AI Act · Audit-Trail" },
  { n: "6", title: "Datenschutz und Sicherheit", items: "DSGVO · Auftragsverarbeitung · Löschkonzept · Verschlüsselung · Zugriffssteuerung" },
  { n: "5", title: "Anwendungen", items: "", parts: [
    { n: "5a", title: "Intern", items: "Assistenten · Automatisierung · Analyse · Wissen" },
    { n: "5b", title: "Für Kunden", items: "Kundenservice · Produktfunktionen · neue Angebote" },
  ] },
  { n: "4", title: "Orchestrierung und Agenten", items: "Workflows · Routing zwischen Modellen · Prompt-Verwaltung · Leitplanken · Protokollierung · Rechte" },
  { n: "3", title: "Modelle", items: "", parts: [
    { n: "3a", title: "Cloud-Modelle per API", items: "mit Auftragsverarbeitung, EU-Region" },
    { n: "3b", title: "Offene Modelle", items: "im eigenen Betrieb, volle Datenkontrolle" },
    { n: "3c", title: "Spezialmodelle", items: "Embeddings · Bild · Sprache" },
  ] },
  { n: "2", title: "Daten und Wissen", items: "Unternehmensdaten · Wissenssuche mit RAG · Dokumenten-Pipeline · Datenklassen · Berechtigungen" },
  { n: "1", title: "Infrastruktur und Betrieb", items: "Cloud, eigene Server oder hybrid · Deployment · Monitoring · Backup · Rechenzentrum in der EU" },
];

function Section({ id, kick, title, intro, alt, children }: { id?: string; kick: string; title: string; intro?: string; alt?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} className="nn-section" style={{ scrollMarginTop: 72, padding: "88px 32px", background: alt ? "var(--ink-tide)" : undefined, borderTop: "1px solid var(--border-1)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={kicker}>{kick}</div>
        <h2 style={h2}>{title}</h2>
        {intro && <p style={lead}>{intro}</p>}
        {children}
      </div>
    </section>
  );
}

function Plus({ sign }: { sign: string }) {
  return <div aria-hidden="true" className="nn-formel-sign" style={{ fontFamily: "var(--font-italiana), serif", fontSize: 56, color: "var(--fg-3)", textAlign: "center", lineHeight: 1 }}>{sign}</div>;
}

export default function KiImBetrieb() {
  return (
    <>
      <Header />
      <main>
        {/* Antwort zuerst */}
        <section style={{ position: "relative", padding: "80px 32px 64px", overflow: "hidden", borderBottom: "1px solid var(--border-1)" }}>
          <div style={{ position: "relative", maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>Methode · Im Unternehmen</span>
            <h1 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(36px, 4.6vw, 64px)", lineHeight: 1.08, color: "var(--fg-1)", margin: "20px 0 22px" }}>
              KI wirkt, wenn die richtige Stufe auf das richtige Vorgehen trifft
            </h1>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 17, color: "var(--fg-2)", lineHeight: 1.7, maxWidth: "60ch", margin: "0 auto" }}>
              Ob sich KI für Ihr Unternehmen lohnt, entscheidet kein einzelnes Tool. Es entscheiden zwei Fragen: Auf welcher Stufe der Wertschöpfung setzen Sie an? Und mit welchem Vorgehen kommt die Lösung in den laufenden Betrieb?
            </p>
          </div>
        </section>

        {/* Situation und Komplikation */}
        <Section kick="Woran es hängt" title="Am Wissen über KI fehlt es kaum noch, am Ergebnis fast überall"
          intro="Kurse, Videos und Prompt-Sammlungen gibt es rund um die Uhr und meist kostenlos. Viele Mitarbeitende arbeiten mit KI schon schneller. Im Betriebsergebnis kommt das bei den wenigsten an.">
          <div className="nn-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 48 }}>
            <div style={{ ...card, borderLeft: "3px solid var(--silver-deep)" }}>
              <h3 style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 600, color: "var(--fg-3)", letterSpacing: ".1em", textTransform: "uppercase", margin: "0 0 14px" }}>Wissen</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {["Kurse, Bücher, Videos und Prompts", "jederzeit verfügbar, meist kostenlos", "Ergebnis: einzelne Mitarbeitende arbeiten schneller"].map(t => (
                  <li key={t} style={body}>– {t}</li>
                ))}
              </ul>
            </div>
            <div style={{ ...card, border: "1px solid var(--border-3)", borderLeft: "3px solid var(--glow-cyan)" }}>
              <h3 style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 600, color: "var(--glow-cyan)", letterSpacing: ".1em", textTransform: "uppercase", margin: "0 0 14px" }}>Umsetzung</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {["ein Vorgehen, das zu Ihrem Geschäft passt", "eigene Systeme im laufenden Betrieb", "Ergebnis: messbarer Beitrag zum Unternehmensergebnis"].map(t => (
                  <li key={t} style={{ ...body, color: "var(--fg-1)" }}>– {t}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Diagramm: Vergleich zweier Werte, Akzent auf dem Wert, um den es geht */}
          <figure style={{ margin: 0 }}>
            <figcaption style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, fontWeight: 500, color: "var(--fg-1)", marginBottom: 22 }}>
              Acht von zehn spüren den Nutzen von KI, aber nur sechs von hundert sehen ihn im Ergebnis
            </figcaption>
            {[
              { v: 80, label: "berichten, dass KI ihre persönliche Produktivität verbessert hat", color: MUTED, text: "var(--fg-1)" },
              { v: 6, label: "schreiben mindestens 5 % ihres EBIT der KI zu und sehen deutlichen Nutzen", color: ACCENT, text: "var(--ink-abyss)" },
            ].map(b => (
              <div key={b.v} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ flex: 1, background: "rgba(205,206,210,.05)", borderRadius: 3, height: 34, position: "relative" }}>
                    <div style={{ width: `${b.v}%`, minWidth: 54, height: "100%", background: b.color, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 12 }}>
                      <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 14, fontWeight: 500, color: b.text }}>{b.v} %</span>
                    </div>
                  </div>
                </div>
                <div style={{ ...body, fontSize: 13, marginTop: 6 }}>{b.label}</div>
              </div>
            ))}
            <p style={source}>
              Quelle: McKinsey &amp; Company, „The state of AI in 2026: On the road to ROI“, 25.08.2026. Online-Umfrage unter 1.719 Teilnehmenden in 97 Ländern, 04.05. bis 08.06.2026.{" "}
              <a href="https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai" target="_blank" rel="noopener">mckinsey.com</a>, abgerufen am 19.10.2026.
            </p>
          </figure>
        </Section>

        {/* Antwort als Formel */}
        <Section alt kick="Die Antwort" title="Erfolg mit KI ergibt sich aus Wertschöpfung plus Vorgehen, nicht aus dem nächsten Tool"
          intro="Die Wertschöpfungsstufe legt fest, wo der Nutzen entsteht. Das Vorgehen sorgt dafür, dass er im Betrieb ankommt. Fehlt eines von beiden, bleibt es beim Experiment.">
          <div className="nn-formel" style={{ display: "grid", gridTemplateColumns: "1fr 64px 1fr 64px 1fr", alignItems: "center", gap: 8 }}>
            <a href="#wertschoepfung" style={{ ...card, display: "block", textDecoration: "none", textAlign: "center" }}>
              <div style={kicker}>Wertschöpfung</div>
              <div style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 26, color: "var(--fg-1)", lineHeight: 1.2 }}>Die richtige Stufe</div>
              <div style={{ ...body, fontSize: 13, marginTop: 8 }}>meist Stufe 02 bis 04</div>
            </a>
            <Plus sign="+" />
            <a href="#vorgehen" style={{ ...card, display: "block", textDecoration: "none", textAlign: "center" }}>
              <div style={kicker}>Vorgehen</div>
              <div style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 26, color: "var(--fg-1)", lineHeight: 1.2 }}>Strategie, Befähigung, Architektur</div>
              <div style={{ ...body, fontSize: 13, marginTop: 8 }}>gleichzeitig, nicht nacheinander</div>
            </a>
            <Plus sign="=" />
            <div style={{ ...card, textAlign: "center", border: "1px solid var(--glow-cyan)", boxShadow: "var(--glow-accent)" }}>
              <div style={kicker}>Erfolg</div>
              <div style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 26, color: "var(--fg-1)", lineHeight: 1.2 }}>Messbarer Nutzen im Betrieb</div>
              <div style={{ ...body, fontSize: 13, marginTop: 8 }}>mit Kennzahlen belegt</div>
            </div>
          </div>
        </Section>

        {/* Wertschöpfungsstufen */}
        <Section id="wertschoepfung" kick="Wertschöpfung" title="Für den Mittelstand liegt der lohnende Bereich auf den Stufen zwei bis vier"
          intro="Je tiefer KI in Ihre Prozesse und Daten greift, desto mehr vom Nutzen bleibt bei Ihnen und desto schwerer ist er zu kopieren. Ganz oben ist der Einstieg leicht, ganz unten der Aufwand hoch.">
          <figure style={{ margin: 0 }}>
            <figcaption className="sr-only">Fünf Stufen der KI-Wertschöpfung, der Korridor liegt auf den Stufen 02 bis 04</figcaption>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {STUFEN.map(s => (
                <div key={s.n} className="nn-stufe" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 32, alignItems: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{
                      width: `${s.width}%`, height: 46, borderRadius: 4,
                      background: s.corridor ? "rgba(111,239,245,.16)" : "rgba(26,78,94,.55)",
                      border: s.corridor ? `1px solid ${ACCENT}` : "1px solid var(--border-2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 13, color: s.corridor ? ACCENT : "var(--fg-3)" }}>{s.n}</span>
                    </div>
                  </div>
                  <div style={{ borderLeft: s.corridor ? `2px solid ${ACCENT}` : "2px solid var(--border-1)", paddingLeft: 18 }}>
                    <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, fontWeight: 600, color: s.corridor ? "var(--fg-1)" : "var(--fg-2)", marginBottom: 4 }}>{s.title}</div>
                    <div style={{ ...body, fontSize: 13 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ ...body, fontSize: 13, color: ACCENT, marginTop: 22 }}>
              Markiert: der Wertschöpfungskorridor. Hier bleibt der Nutzen im Unternehmen, bei vertretbarem Aufwand und überschaubarem Risiko.
            </p>
          </figure>
        </Section>

        {/* Drei Disziplinen */}
        <Section id="vorgehen" alt kick="Vorgehen" title="Strategie, Befähigung und Architektur müssen gleichzeitig laufen, sonst bleibt KI ein Pilot"
          intro="Eine Strategie ohne Architektur bleibt Papier. Eine Architektur ohne Befähigung wird nicht genutzt. Und Schulung ohne Strategie erzeugt Wissen ohne Richtung. Deshalb planen wir die drei Disziplinen als ein Vorhaben.">
          <svg viewBox="0 0 600 250" role="img" aria-label="Dreieck aus Strategie, Befähigung und Wandel sowie KI-Architektur" style={{ width: "100%", maxWidth: 560, display: "block", margin: "0 auto 40px" }}>
            <polygon points="300,40 90,210 510,210" fill="none" stroke="var(--border-3)" strokeWidth="1.5" />
            {[{ x: 300, y: 40, t: "Strategie" }, { x: 90, y: 210, t: "Befähigung" }, { x: 510, y: 210, t: "Architektur" }].map(p => (
              <g key={p.t}>
                <circle cx={p.x} cy={p.y} r="30" fill="var(--ink-abyss)" stroke="var(--glow-cyan)" strokeWidth="1.5" />
                <circle cx={p.x} cy={p.y} r="5" fill="var(--glow-cyan)" />
                <text x={p.x} y={p.y + (p.y < 100 ? -42 : 54)} textAnchor="middle" fill="var(--fg-1)" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, letterSpacing: ".08em" }}>{p.t}</text>
              </g>
            ))}
            <text x="300" y="160" textAnchor="middle" fill="var(--fg-3)" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 22, fontStyle: "italic" }}>ein Vorhaben</text>
          </svg>
          <div className="nn-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {DISZIPLINEN.map(d => (
              <div key={d.title} style={card}>
                <h3 style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 600, color: "var(--glow-cyan)", letterSpacing: ".08em", textTransform: "uppercase", margin: "0 0 8px" }}>{d.title}</h3>
                <div style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 21, color: "var(--fg-1)", margin: "0 0 12px" }}>{d.claim}</div>
                <p style={body}>{d.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Vorgehensmodell in drei Strängen */}
        <Section kick="Vorgehensmodell" title="Ein festes Vorgehen in drei Strängen macht die KI-Einführung planbar und prüfbar"
          intro="Jeder Strang hat klare Schritte und ein Ergebnis, das sich vorlegen lässt: eine Roadmap, ein eingeführter Ablauf, ein dokumentiertes Managementsystem. Die Stränge laufen parallel und greifen ineinander. Die einzelnen Anwendungsfälle aus der Roadmap setzen wir danach als Projekte um.">
          <div style={{ marginBottom: 48 }}>
            <EbenenModell aktiv="unternehmen" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            {STRAENGE.map(s => (
              <div key={s.title}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                  <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 400, fontSize: 26, color: "var(--fg-1)", margin: 0 }}>{s.title}</h3>
                  {s.note && <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 10, color: "var(--fg-3)", letterSpacing: ".1em" }}>{s.note}</span>}
                </div>
                <ol className="nn-strang" style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 0, position: "relative" }}>
                  {s.steps.map((st, i) => (
                    <li key={st} style={{ position: "relative", padding: "0 10px 0 0" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ width: 30, height: 30, flexShrink: 0, borderRadius: "50%", border: "1px solid var(--border-3)", background: "var(--ink-current)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-jetbrains), monospace", fontSize: 11, color: "var(--glow-cyan)" }}>{i + 1}</span>
                        {i < s.steps.length - 1 && <span aria-hidden="true" className="nn-strang-line" style={{ flex: 1, height: 1, background: "var(--border-3)" }} />}
                      </div>
                      <div style={{ ...body, fontSize: 13, marginTop: 10, paddingRight: 6 }}>{st}</div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Section>

        {/* Architektur */}
        <Section id="architektur" alt kick="KI-Architektur" title="Eine belastbare KI-Architektur hat sieben Schichten, und Datenschutz geht durch alle"
          intro="Wer nur ein Modell anschließt, hat eine Demo. Für den Betrieb braucht es Daten, Orchestrierung, Sicherheit und Governance, die zusammenpassen. Die Regulierung betrifft dabei nicht eine Schicht, sondern das Ganze.">
          <figure style={{ margin: "0 0 20px" }}>
            {/* Isometrisches Referenzmodell im Stil des RAG-Referenzmodells.
                Daten: tools/architektur/build_grafik.py; Vorschau in halber Auflösung,
                die volle Fassung (SVG) nur über das Download-Formular unten. */}
            <img
              src="/architektur/ki-architektur-vorschau.jpg"
              width={1144} height={1880}
              alt="Referenzmodell der KI-Architektur in sieben Schichten: Governance, Datenschutz, Anwendungen, Orchestrierung, Modelle, Daten und Wissen, Infrastruktur, mit Bausteinen und Datenfluss"
              loading="lazy"
              style={{ width: "100%", maxWidth: 900, height: "auto", display: "block", margin: "0 auto", borderRadius: 4, border: "1px solid var(--border-2)" }}
            />
            <figcaption style={{ ...body, fontSize: 12, color: "var(--fg-3)", marginTop: 10, textAlign: "center" }}>
              Referenzmodell NeuralNautic, Stand 29.10.2026. Volle Auflösung als Download unten.
            </figcaption>
          </figure>

          <details style={{ marginBottom: 16 }}>
            <summary style={{ cursor: "pointer", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: ".06em", color: "var(--glow-cyan)", marginBottom: 16 }}>
              Das Modell im Raum drehen
            </summary>
            <Architektur3D />
            <p style={{ ...body, fontSize: 12, color: "var(--fg-3)", marginTop: 10 }}>
              Mausrad dreht, gehaltene linke Maustaste stellt den Blick ein. Auf dem Handy dreht waagerechtes Wischen.
            </p>
          </details>

          <details style={{ marginBottom: 40 }}>
            <summary style={{ cursor: "pointer", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: ".06em", color: "var(--glow-cyan)", marginBottom: 16 }}>
              Die sieben Schichten als Übersicht
            </summary>
          <div>
            <div className="nn-arch" style={{ display: "grid", gridTemplateColumns: "1fr 44px", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {SCHICHTEN.map(l => (
                  <div key={l.n}>
                    {l.parts ? (
                      <div className="nn-arch-parts" style={{ display: "grid", gridTemplateColumns: `repeat(${l.parts.length}, 1fr)`, gap: 8 }}>
                        {l.parts.map(p => (
                          <div key={p.n} style={{ background: "rgba(26,78,94,.45)", border: "1px solid var(--border-2)", borderRadius: 4, padding: "12px 16px" }}>
                            <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 600, color: "var(--fg-1)" }}>
                              <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 11, color: "var(--fg-3)", marginRight: 10 }}>{p.n}</span>{l.title}: {p.title}
                            </div>
                            <div style={{ ...body, fontSize: 12, marginTop: 4 }}>{p.items}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ background: "rgba(26,78,94,.45)", border: "1px solid var(--border-2)", borderRadius: 4, padding: "12px 16px" }}>
                        <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 600, color: "var(--fg-1)" }}>
                          <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 11, color: "var(--fg-3)", marginRight: 10 }}>{l.n}</span>{l.title}
                        </div>
                        <div style={{ ...body, fontSize: 12, marginTop: 4 }}>{l.items}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="nn-arch-rail" style={{ border: `1px solid ${ACCENT}`, borderRadius: 4, background: "rgba(111,239,245,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: "var(--font-jetbrains), monospace", fontSize: 12, letterSpacing: ".18em", color: ACCENT, whiteSpace: "nowrap" }}>DSGVO · EU AI Act · NIS2</span>
              </div>
            </div>
            <p style={{ ...body, fontSize: 13, marginTop: 20 }}>
              Welche Schichten Sie selbst betreiben und welche Sie einkaufen, klären wir in der{" "}
              <Link href="/leistungen">KI-Architektur-Beratung</Link>. Ergebnis ist eine dokumentierte Zielarchitektur mit Kostenmodell.
            </p>
          </div>
          </details>

          <ArchitekturDownload />
        </Section>

        {/* Übergang zum Engineering */}
        <section className="nn-section" style={{ padding: "88px 32px", borderTop: "1px solid var(--border-1)" }}>
          <div className="nn-grid-2" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <div style={kicker}>Umsetzung</div>
              <h2 style={{ ...h2, maxWidth: "30ch" }}>Was in den Betrieb geht, wird ingenieurmäßig gebaut, nicht zusammengeklickt</h2>
              <p style={{ ...lead, margin: 0 }}>
                Ein Prototyp ist heute in Stunden gebaut. Ein System, das Ihre Daten verarbeitet und jeden Tag läuft, braucht Anforderungen, Tests, Sicherheitsprüfung und Verantwortung. Wie wir das machen, steht auf der Seite zu AI Engineering.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
              <Link href="/ai-engineering" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: ".08em", padding: "14px 28px", borderRadius: 4, background: "var(--glow-cyan)", color: "var(--ink-abyss)", textDecoration: "none" }}>
                AI Engineering statt Vibe Coding
              </Link>
              <Link href="/kontakt" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: ".08em", padding: "13px 27px", borderRadius: 4, border: "1px solid var(--border-3)", color: "var(--fg-1)", textDecoration: "none" }}>
                KI-Potenzialcheck buchen
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
