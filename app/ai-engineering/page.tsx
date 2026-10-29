import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "AI Engineering statt Vibe Coding: KI-Software für den Betrieb | NeuralNautic",
  alternates: { canonical: "/ai-engineering" },
  description: "Professionelles AI Engineering: Anforderungen, geprüfte Architektur, Entwicklung mit KI-Agenten unter Aufsicht, Tests und Qualitätstor. Software, die im Betrieb hält und Ihnen gehört.",
  openGraph: { title: "AI Engineering statt Vibe Coding", description: "KI-Software, die im Betrieb hält: Anforderungen, geprüfte Architektur, Entwicklung mit KI-Agenten unter Aufsicht, Tests und Qualitätstor.", url: "/ai-engineering" },
};

const kicker = { fontFamily: "var(--font-jetbrains), monospace", fontSize: 10, color: "var(--glow-cyan)", letterSpacing: ".16em", textTransform: "uppercase" as const, marginBottom: 14 };
const h2 = { fontFamily: "var(--font-cormorant), serif", fontWeight: 400, fontSize: "clamp(30px, 3.4vw, 42px)", color: "var(--fg-1)", margin: "0 0 18px", lineHeight: 1.15, maxWidth: "28ch" };
const lead = { fontFamily: "var(--font-inter), sans-serif", fontSize: 16, color: "var(--fg-2)", lineHeight: 1.7, margin: "0 0 40px", maxWidth: "62ch" };
const body = { fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.65, margin: 0 };

const VERGLEICH = [
  { dim: "Ausgangspunkt",              vibe: "Eine Idee und ein Prompt",                                  eng: "Schriftliche Anforderungen mit Abnahmekriterien und eine geprüfte Architektur" },
  { dim: "Qualität",                   vibe: "„Läuft bei mir“",                                           eng: "Automatische Tests und eine feste Prüfung vor jeder Auslieferung" },
  { dim: "Sicherheit und Datenschutz", vibe: "Schlüssel im Code, Daten gehen an beliebige Dienste",       eng: "Geheimnisse sicher verwahrt, Rechtekonzept, EU-Datenresidenz, Auftragsverarbeitung" },
  { dim: "Nachvollziehbarkeit",        vibe: "Ein langer Chatverlauf",                                    eng: "Versionsverwaltung, eine Aufgabe je Änderung, Dokumentation" },
  { dim: "Betrieb und Verantwortung",  vibe: "Niemand ist zuständig, wenn es bricht",                     eng: "Überwachung, Kostenbudget, Übergabe und eine benannte Verantwortung" },
];

// Vier Risikoklassen nach Roman Langfeld (for42), eigene Formulierung. wir = AI Engineering nötig.
const RISIKO = [
  { klasse: "Niedrig",  loesung: "Persönliche Arbeitshilfe oder Prototyp",                          wer: "Der Fachbereich selbst",                                  pruefung: "Keine Zugangsschlüssel im Code",                                  wir: false },
  { klasse: "Mittel",   loesung: "Teamlösung für wenige Nutzer, keine sensiblen Daten",             wer: "Der Fachbereich, auf einer freigegebenen Plattform",      pruefung: "Abhängigkeiten und Lizenzen, Eintrag ins Verzeichnis",            wir: false },
  { klasse: "Hoch",     loesung: "Abteilungsübergreifend oder unternehmensweit",                    wer: "Nur mit Begleitung durch IT und Engineering",             pruefung: "Zusätzlich Code- und Architekturprüfung, formelle Freigabe",       wir: true },
  { klasse: "Kritisch", loesung: "Für Kunden, geschäftskritisch oder regulatorisch relevant",       wer: "Professionelle Entwicklung, nach den Stationen unten",    pruefung: "Zusätzlich Sicherheitstest und Datenschutz-Folgenabschätzung",     wir: true },
];

const STATIONEN = [
  { n: "01", title: "Anforderungen",                  desc: "Was soll das System leisten, für wen und mit welchen Daten? Wir halten es schriftlich fest, mit Kriterien, an denen sich die Abnahme messen lässt.", result: "Anforderungsdokument" },
  { n: "02", title: "Architektur mit Prüfung",        desc: "Die Zielarchitektur wird gegen feste Kriterien geprüft: Sicherheit, Datenschutz, Kosten, Betrieb, Austauschbarkeit der Modelle. Sie wird überarbeitet, bis sie trägt.", result: "Geprüftes Architekturdokument" },
  { n: "03", title: "Plan mit Compliance-Prüfung",    desc: "Der Plan zerfällt in einzelne, prüfbare Aufgaben, jede rückverfolgbar zu einer Anforderung. Jeder Plan wird vor dem Bau gegen Datenschutz- und Sicherheitsanforderungen geprüft.", result: "Aufgabenliste mit Nachweis" },
  { n: "04", title: "Umsetzung mit KI-Agenten",       desc: "KI-Agenten planen, programmieren und testen. Jede Änderung wird einzeln versioniert und von uns geprüft. Die Agenten machen es schnell, die Verantwortung bleibt bei uns.", result: "Getesteter Code in Ihrem Repository" },
  { n: "05", title: "Qualitätstor und Übergabe",      desc: "Vor der Auslieferung prüfen wir Sicherheit, Fehlerbehandlung, Typsicherheit, Testqualität und Codestil und fragen: Was bricht im Betrieb zuerst? Erst dann geht die Lösung live.", result: "Auslieferung mit Dokumentation" },
];

const ERGEBNIS = [
  { title: "Code, der Ihnen gehört",      desc: "In Ihrem Repository, ohne Bindung an uns. Andere Entwickler können ihn weiterführen." },
  { title: "Tests, die mitlaufen",        desc: "Jede spätere Änderung wird automatisch gegen das geprüft, was heute funktioniert." },
  { title: "Dokumentation für den Betrieb", desc: "Architektur, Datenflüsse, Rollen und das Vorgehen im Störfall, verständlich für Ihre IT." },
  { title: "Transparente Kosten",         desc: "Welches Modell welche Aufgabe übernimmt und was das im Monat kostet, mit Budgetgrenzen." },
];

export default function AiEngineering() {
  return (
    <>
      <Header />
      <main>
        <section style={{ position: "relative", padding: "80px 32px 64px", overflow: "hidden", borderBottom: "1px solid var(--border-1)" }}>
          <div style={{ position: "relative", maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>AI Engineering</span>
            <h1 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(36px, 4.6vw, 64px)", lineHeight: 1.08, color: "var(--fg-1)", margin: "20px 0 22px" }}>
              Software für Ihren Betrieb entsteht durch Engineering, nicht durch Vibe Coding
            </h1>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 17, color: "var(--fg-2)", lineHeight: 1.7, maxWidth: "60ch", margin: "0 auto" }}>
              Mit KI ist ein beeindruckender Prototyp in Stunden gebaut. Ein System, dem Sie Kundendaten und Abläufe anvertrauen, braucht die Sorgfalt professioneller Softwareentwicklung. KI-Agenten schreiben den Code schneller, die Verantwortung dafür übernehmen wir.
            </p>
          </div>
        </section>

        {/* Vergleich */}
        <section className="nn-section" style={{ padding: "88px 32px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={kicker}>Der Unterschied</div>
            <h2 style={h2}>Vibe Coding ist gut für Ideen und riskant für den Betrieb</h2>
            <p style={lead}>
              Beim Vibe Coding beschreibt man der KI, was man möchte, und übernimmt, was sie liefert, ohne den Code zu prüfen. Für einen Entwurf reicht das. Was danach im Alltag läuft, braucht fünf Dinge, die ein Prototyp nicht hat.
            </p>
            <div role="table" aria-label="Vergleich Vibe Coding und AI Engineering" style={{ border: "1px solid var(--border-2)", borderRadius: 6, overflow: "hidden" }}>
              <div role="row" className="nn-vgl-row nn-vgl-head" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1.6fr", background: "var(--ink-current)" }}>
                <div role="columnheader" style={{ padding: "14px 20px" }} />
                <div role="columnheader" style={{ padding: "14px 20px", fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--fg-3)" }}>Vibe Coding</div>
                <div role="columnheader" style={{ padding: "14px 20px", fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--glow-cyan)" }}>AI Engineering</div>
              </div>
              {VERGLEICH.map(r => (
                <div role="row" key={r.dim} className="nn-vgl-row" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1.6fr", borderTop: "1px solid var(--border-1)" }}>
                  <div role="rowheader" style={{ padding: "16px 20px", fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 600, color: "var(--fg-1)" }}>{r.dim}</div>
                  <div role="cell" style={{ padding: "16px 20px", ...body, color: "var(--fg-3)" }}><span className="nn-vgl-label">Vibe Coding: </span>{r.vibe}</div>
                  <div role="cell" style={{ padding: "16px 20px", ...body, color: "var(--fg-1)", background: "rgba(63,212,224,.05)", borderLeft: "1px solid var(--border-3)" }}><span className="nn-vgl-label" style={{ color: "var(--glow-cyan)" }}>AI Engineering: </span>{r.eng}</div>
                </div>
              ))}
            </div>
            <p style={{ ...body, marginTop: 24, maxWidth: "70ch" }}>
              Wir nutzen Vibe Coding selbst, für Klickprototypen und schnelle Machbarkeitsproben, wenn eine Idee im Workshop greifbar werden soll. Was davon in den Betrieb geht, bauen wir neu und nach dem Vorgehen unten.
            </p>
          </div>
        </section>

        {/* Risikoklassen: wann Engineering nötig ist */}
        <section className="nn-section" style={{ padding: "88px 32px", borderTop: "1px solid var(--border-1)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={kicker}>Wann es Engineering braucht</div>
            <h2 style={h2}>Über den Aufwand entscheidet die Reichweite einer Lösung, nicht das Werkzeug</h2>
            <p style={lead}>
              Ein persönlicher Prototyp darf schnell entstehen. Dieselbe Technik in einer Anwendung für Kunden braucht dagegen volle Sorgfalt. Vier Fragen ordnen jede Lösung ein: Wer nutzt sie, welche Daten verarbeitet sie, was darf sie selbst auslösen, und was passiert bei einem Ausfall?
            </p>
            <div role="table" aria-label="Vier Risikoklassen für KI-gestützt entwickelte Lösungen" style={{ border: "1px solid var(--border-2)", borderRadius: 6, overflow: "hidden" }}>
              <div role="row" className="nn-vgl-row nn-vgl-head" style={{ display: "grid", gridTemplateColumns: "0.8fr 1.4fr 1.4fr 1.2fr", background: "var(--ink-current)" }}>
                {["Klasse", "Typische Lösung", "Wer baut", "Prüfung vor dem Einsatz"].map(h => (
                  <div role="columnheader" key={h} style={{ padding: "14px 18px", fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--fg-3)" }}>{h}</div>
                ))}
              </div>
              {RISIKO.map(r => (
                <div role="row" key={r.klasse} className="nn-vgl-row" style={{ display: "grid", gridTemplateColumns: "0.8fr 1.4fr 1.4fr 1.2fr", borderTop: "1px solid var(--border-1)", background: r.wir ? "rgba(63,212,224,.05)" : undefined }}>
                  <div role="rowheader" style={{ padding: "14px 18px", fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 600, color: r.wir ? "var(--glow-cyan)" : "var(--fg-1)" }}>{r.klasse}</div>
                  <div role="cell" style={{ padding: "14px 18px", ...body }}><span className="nn-vgl-label">Lösung: </span>{r.loesung}</div>
                  <div role="cell" style={{ padding: "14px 18px", ...body, color: r.wir ? "var(--fg-1)" : body.color }}><span className="nn-vgl-label">Wer baut: </span>{r.wer}</div>
                  <div role="cell" style={{ padding: "14px 18px", ...body }}><span className="nn-vgl-label">Prüfung: </span>{r.pruefung}</div>
                </div>
              ))}
            </div>
            <p style={{ ...body, marginTop: 20, maxWidth: "75ch" }}>
              Hervorgehoben sind die Klassen, für die es AI Engineering braucht und in denen wir bauen oder begleiten. Für die unteren Klassen sorgen wir dafür, dass Ihre Fachbereiche schnell und trotzdem sicher arbeiten können.
            </p>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, color: "var(--fg-3)", lineHeight: 1.6, marginTop: 14 }}>
              Risikoklassen nach Roman Langfeld (for42), Whitepaper „Governed Enterprise Vibe Coding“, Juli 2026:{" "}
              <a href="https://www.romanlangfeld.de/ressourcen/governed-enterprise-vibe-coding" target="_blank" rel="noopener">romanlangfeld.de</a>.
            </p>
          </div>
        </section>

        {/* Stationen */}
        <section className="nn-section" style={{ padding: "88px 32px", background: "var(--ink-tide)", borderTop: "1px solid var(--border-1)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={kicker}>So arbeiten wir</div>
            <h2 style={h2}>Jede Lösung durchläuft fünf Stationen, bevor sie in Ihren Betrieb geht</h2>
            <p style={lead}>Die Reihenfolge ist fest. Keine Station wird übersprungen, auch nicht unter Zeitdruck, denn genau dann entstehen die Fehler, die später am meisten kosten.</p>
            <div style={{ marginTop: 24 }}>
              {STATIONEN.map((p, i) => (
                <div key={p.n} style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 28, paddingBottom: 40, marginBottom: 40, borderBottom: i < STATIONEN.length - 1 ? "1px solid var(--border-1)" : "none", position: "relative" }}>
                  {i < STATIONEN.length - 1 && (
                    <div style={{ position: "absolute", left: 27, top: 56, bottom: -40, width: 1, background: "linear-gradient(180deg, var(--glow-cyan), transparent)" }} />
                  )}
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--ink-current)", border: "1px solid var(--border-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 12, color: "var(--glow-cyan)" }}>{p.n}</span>
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 400, fontSize: 30, color: "var(--fg-1)", margin: "6px 0 12px", lineHeight: 1.1 }}>{p.title}</h3>
                    <p style={{ ...body, fontSize: 15, lineHeight: 1.7, margin: "0 0 16px" }}>{p.desc}</p>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--ink-current)", border: "1px solid var(--border-3)", borderRadius: 4, padding: "9px 14px" }}>
                      <span style={{ color: "var(--glow-cyan)", fontSize: 12 }}>✓</span>
                      <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--fg-1)" }}>Ergebnis: {p.result}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ergebnis */}
        <section className="nn-section" style={{ padding: "88px 32px", borderTop: "1px solid var(--border-1)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={kicker}>Was Sie bekommen</div>
            <h2 style={h2}>Sie bekommen ein System, das Ihnen gehört und das andere weiterführen können</h2>
            <p style={lead}>Wir bauen nicht für die Vorführung, sondern für den Tag, an dem jemand anderes den Code übernimmt.</p>
            <div className="nn-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
              {ERGEBNIS.map(e => (
                <div key={e.title} style={{ background: "var(--ink-current)", border: "1px solid var(--border-2)", borderRadius: 6, padding: "26px 24px" }}>
                  <h3 style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 600, color: "var(--glow-cyan)", letterSpacing: ".06em", textTransform: "uppercase", margin: "0 0 10px", lineHeight: 1.4 }}>{e.title}</h3>
                  <p style={body}>{e.desc}</p>
                </div>
              ))}
            </div>
            <p style={{ ...body, marginTop: 28 }}>
              Wo die Lösung in Ihrer KI-Architektur sitzt und welche Schichten dazugehören, zeigt die Seite{" "}
              <Link href="/ki-im-unternehmen#architektur">KI im Unternehmen</Link>.
            </p>
          </div>
        </section>

        <section style={{ padding: "80px 32px", textAlign: "center", background: "var(--ink-abyss)", borderTop: "1px solid var(--border-1)" }}>
          <h2 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(28px, 4vw, 48px)", color: "var(--fg-1)", margin: "0 0 20px" }}>
            Sie haben einen Prototyp, der in den Betrieb soll?
          </h2>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 16, color: "var(--fg-2)", margin: "0 auto 32px", maxWidth: "52ch", lineHeight: 1.7 }}>
            Wir sehen ihn uns an und sagen Ihnen, was für einen sicheren Betrieb fehlt, und was es kostet, das zu ergänzen.
          </p>
          <Link href="/kontakt" style={{ display: "inline-block", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: ".08em", padding: "14px 32px", borderRadius: 4, background: "var(--glow-cyan)", color: "var(--ink-abyss)", textDecoration: "none" }}>
            Lösung anfragen
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
