import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";

const SERVICES = [
  { title: "KI-Potenzialanalyse", desc: "Identifikation sinnvoller KI-Anwendungsfälle mit Aufwand-Nutzen-Bewertung und priorisierter Roadmap." },
  { title: "Controlled Pilot",    desc: "Kontrollierter Praxistest eines KI-Use-Cases mit klaren Zielen, Metriken und Skalierungsempfehlung." },
  { title: "KI-Automatisierung",  desc: "Automatisierung wiederkehrender Prozesse mit KI, Workflows, APIs und passenden Tools." },
  { title: "KI-Governance",       desc: "Regeln, Rollen und Prozesse für sicheren, nachvollziehbaren und verantwortungsvollen KI-Einsatz." },
  { title: "KI-Schulung",         desc: "Workshops und Enablement für Führungskräfte, Fachabteilungen und AI Champions." },
  { title: "KI Tool Kompass",     desc: "Bewertung und Auswahl passender KI-Tools nach Nutzen, Kosten, Datenschutz und Integrationsfähigkeit." },
];

const USE_CASES = [
  "Automatische Angebotserstellung", "Voicebot für Anrufannahme",
  "E-Mail-Automatisierung", "Dokumentenanalyse",
  "Belegmanagement", "CRM-Unterstützung",
  "Interner Wissensbot (RAG)", "Lead-Qualifizierung",
  "KI-gestützter Kundenservice", "Schulungs- und Assistenzsysteme",
];

const TRUST = [
  "Mittelstandstaugliche Sprache",
  "Fokus auf konkrete Geschäftsprozesse",
  "Datenschutz und Governance von Anfang an",
  "Keine Tool-Abhängigkeit",
  "Messbare Pilotprojekte statt KI-Aktionismus",
  "Schulung und Befähigung der Mitarbeitenden",
];

const PAIN = [
  "Unklare Use Cases",
  "Zu viele Tools, zu wenig Orientierung",
  "Unsicherheit bei Datenschutz und Compliance",
  "Fehlende interne KI-Kompetenz",
  "Angst vor Fehlinvestitionen",
  "Keine klare Roadmap für Umsetzung und Skalierung",
];

const STEPS = [
  { n: "01", title: "Verstehen",    desc: "Prozesse, Ziele, Daten, Systeme und Risiken analysieren." },
  { n: "02", title: "Priorisieren", desc: "Sinnvolle KI-Use-Cases identifizieren und bewerten." },
  { n: "03", title: "Pilotieren",   desc: "KI kontrolliert in einem abgegrenzten Praxisprojekt testen." },
  { n: "04", title: "Skalieren",    desc: "Erfolgreiche Lösungen in stabile Prozesse und Governance überführen." },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>

        {/* HERO */}
        <section style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Image src="/bg-neural-network.png" alt="" fill style={{ objectFit: "cover" }} priority />
          </div>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 35% 50%, transparent 15%, rgba(6,20,25,.92) 70%)" }} />
          <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto", padding: "0 32px", width: "100%" }}>
            <div style={{ maxWidth: 680 }}>
              <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>✦ KI-Beratung · Mittelstand · DACH</span>
              <h1 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 1.0, letterSpacing: "-0.01em", color: "var(--fg-1)", margin: "24px 0 0" }}>
                Pragmatische KI<br />
                <em style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 400 }}>für den Mittelstand.</em>
              </h1>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 18, lineHeight: 1.65, color: "var(--fg-2)", maxWidth: "52ch", margin: "28px 0 0" }}>
                Von der Idee zum messbaren Pilotprojekt. Ich helfe Unternehmen, KI sicher, verständlich und operativ nutzbar zu machen.
              </p>
              <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 16, color: "var(--fg-3)", margin: "16px 0 36px" }}>
                Keine KI-Spielereien. Keine Buzzword-Show. Konkrete Lösungen für echte Geschäftsprozesse.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link href="/kontakt" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: ".06em", padding: "14px 28px", borderRadius: 4, background: "var(--glow-cyan)", color: "var(--ink-abyss)", textDecoration: "none" }}>
                  KI-Potenzialcheck buchen
                </Link>
                <Link href="/leistungen" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: ".06em", padding: "14px 28px", borderRadius: 4, background: "transparent", color: "var(--fg-1)", textDecoration: "none", border: "1px solid rgba(205,206,210,.35)" }}>
                  Leistungen ansehen
                </Link>
              </div>
            </div>
          </div>
          <Image src="/logo-star.png" alt="" width={72} height={72} style={{ position: "absolute", bottom: 40, right: 48, objectFit: "contain", opacity: 0.6, filter: "drop-shadow(0 0 24px rgba(63,212,224,.4))" }} />
        </section>

        {/* PROBLEM */}
        <section style={{ padding: "100px 32px", maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>Die Herausforderung</span>
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1.2, color: "var(--fg-1)", margin: "20px 0 24px" }}>
              Viele Unternehmen wollen KI nutzen — aber wissen nicht, wo sie sinnvoll starten sollen.
            </h2>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 16, lineHeight: 1.7, color: "var(--fg-2)" }}>
              Der KI-Markt ist laut, schnell und oft unübersichtlich. Neue Tools erscheinen beinahe wöchentlich, Anbieter versprechen Automatisierung auf Knopfdruck — interne Teams fragen sich, welche Lösungen wirklich sicher, wirtschaftlich und alltagstauglich sind.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {PAIN.map((p) => (
              <div key={p} style={{ background: "var(--ink-current)", border: "1px solid var(--border-2)", borderRadius: 6, padding: "24px 28px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                <span style={{ color: "var(--signal-alert)", fontSize: 18, flexShrink: 0 }}>✕</span>
                <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.5 }}>{p}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SOLUTION */}
        <section style={{ padding: "100px 32px", background: "var(--ink-tide)" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>Mein Ansatz</span>
              <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1.2, color: "var(--fg-1)", margin: "20px 0 16px" }}>
                KI-Einführung mit Struktur: analysieren, pilotieren, automatisieren, skalieren.
              </h2>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 16, color: "var(--fg-2)", maxWidth: "60ch", margin: "0 auto" }}>
                Ich begleite Unternehmen von der ersten Potenzialanalyse bis zur operativen Umsetzung — mit konkreten KI-Anwendungen, die messbare Ergebnisse liefern.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
              {STEPS.map((s, i) => (
                <div key={s.n} style={{ background: "var(--ink-current)", borderRadius: i === 0 ? "6px 0 0 6px" : i === 3 ? "0 6px 6px 0" : 0, padding: "40px 32px", position: "relative" }}>
                  <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 11, color: "var(--glow-cyan)", letterSpacing: ".12em", marginBottom: 16 }}>{s.n}</div>
                  <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 24, fontWeight: 400, color: "var(--fg-1)", margin: "0 0 12px" }}>{s.title}</h3>
                  <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                  {i < 3 && <div style={{ position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)", color: "var(--glow-cyan)", fontSize: 18, zIndex: 1 }}>›</div>}
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <Link href="/methode" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--glow-cyan)", textDecoration: "none" }}>
                Methode im Detail →
              </Link>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section style={{ padding: "100px 32px", maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56 }}>
            <div>
              <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>Leistungen</span>
              <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1.2, color: "var(--fg-1)", margin: "16px 0 0", maxWidth: "20ch" }}>
                Was ich für Ihr Unternehmen tue.
              </h2>
            </div>
            <Link href="/leistungen" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--glow-cyan)", textDecoration: "none" }}>Alle Leistungen →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {SERVICES.map((s) => (
              <div key={s.title} style={{ background: "var(--ink-current)", border: "1px solid var(--border-2)", borderRadius: 6, padding: "32px 28px" }}>
                <h3 style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, fontWeight: 600, color: "var(--fg-1)", margin: "0 0 12px", letterSpacing: ".02em" }}>{s.title}</h3>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* USE CASES */}
        <section style={{ padding: "100px 32px", background: "var(--ink-tide)" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
              <div>
                <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>Use Cases</span>
                <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1.2, color: "var(--fg-1)", margin: "16px 0 0" }}>
                  KI für echte Geschäftsprozesse.
                </h2>
              </div>
              <Link href="/use-cases" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--glow-cyan)", textDecoration: "none" }}>Alle Use Cases →</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
              {USE_CASES.map((u) => (
                <div key={u} style={{ background: "var(--ink-current)", border: "1px solid var(--border-2)", borderRadius: 6, padding: "18px 20px" }}>
                  <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--fg-2)", lineHeight: 1.4 }}>{u}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section style={{ position: "relative", padding: "100px 32px", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Image src="/bg-neural-network.png" alt="" fill style={{ objectFit: "cover", opacity: 0.18 }} />
          </div>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 20%, rgba(6,20,25,.92) 80%)" }} />
          <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto", textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>Mein Versprechen</span>
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1.2, color: "var(--fg-1)", margin: "20px auto 16px", maxWidth: "22ch" }}>
              Für Unternehmen, die KI pragmatisch statt panisch einführen wollen.
            </h2>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 16, color: "var(--fg-2)", maxWidth: "60ch", margin: "0 auto 56px", lineHeight: 1.7 }}>
              Mein Ansatz verbindet technisches Verständnis, Prozessdenken und Change-Kompetenz. Ich spreche mit Geschäftsführung, IT, Fachabteilungen, Datenschutz und Betriebsrat.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, textAlign: "left", maxWidth: 900, margin: "0 auto" }}>
              {TRUST.map((t) => (
                <div key={t} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ color: "var(--glow-cyan)", fontSize: 16, flexShrink: 0, marginTop: 2 }}>✓</span>
                  <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section style={{ padding: "100px 32px", textAlign: "center", background: "var(--ink-abyss)" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <Image src="/logo-monogram.png" alt="" width={80} height={64} style={{ objectFit: "contain", opacity: 0.7, marginBottom: 32, filter: "drop-shadow(0 0 20px rgba(63,212,224,.2))" }} />
            <h2 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.1, color: "var(--fg-1)", margin: "0 0 20px" }}>
              Bereit für den ersten sinnvollen KI-Schritt?
            </h2>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 16, color: "var(--fg-2)", lineHeight: 1.7, margin: "0 0 36px" }}>
              Lassen Sie uns gemeinsam prüfen, wo KI in Ihrem Unternehmen echten Mehrwert schafft — sicher, messbar und verständlich.
            </p>
            <Link href="/kontakt" style={{ display: "inline-block", fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 500, letterSpacing: ".08em", padding: "16px 36px", borderRadius: 4, background: "var(--glow-cyan)", color: "var(--ink-abyss)", textDecoration: "none" }}>
              KI-Potenzialcheck buchen
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
