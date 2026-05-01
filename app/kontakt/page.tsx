"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";

const TOPICS = [
  "KI-Potenzialanalyse", "Controlled Pilot", "KI-Automatisierung",
  "KI-Governance", "KI-Schulung", "Tool-Auswahl", "Allgemeine Anfrage",
];

const input: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  fontFamily: "var(--font-inter), sans-serif", fontSize: 14,
  background: "var(--ink-current)", color: "var(--fg-1)",
  border: "1px solid var(--border-2)", borderRadius: 4,
  padding: "12px 16px", outline: "none",
};

export default function Kontakt() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <Header />
      <main>
        <section style={{ padding: "80px 32px 60px", background: "var(--ink-tide)", borderBottom: "1px solid var(--border-1)" }}>
          <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>Kontakt</span>
            <h1 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.05, color: "var(--fg-1)", margin: "20px 0 20px" }}>
              Lassen Sie uns über sinnvolle KI in Ihrem Unternehmen sprechen.
            </h1>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 16, color: "var(--fg-2)", lineHeight: 1.7, maxWidth: "52ch", margin: "0 auto" }}>
              Ob erste Orientierung, konkreter Use Case oder geplantes Pilotprojekt — ich freue mich auf Ihre Anfrage.
            </p>
          </div>
        </section>

        <div style={{ maxWidth: 680, margin: "0 auto", padding: "80px 32px" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 24 }}>✓</div>
              <h2 style={{ fontFamily: "var(--font-italiana), serif", fontSize: 40, color: "var(--fg-1)", margin: "0 0 16px" }}>Danke für Ihre Anfrage.</h2>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 16, color: "var(--fg-2)", lineHeight: 1.7 }}>
                Ich melde mich in der Regel innerhalb von 24 Stunden bei Ihnen.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 500, color: "var(--fg-3)", letterSpacing: ".1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Name *</label>
                  <input required style={input} placeholder="Ihr Name" />
                </div>
                <div>
                  <label style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 500, color: "var(--fg-3)", letterSpacing: ".1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Unternehmen *</label>
                  <input required style={input} placeholder="Ihr Unternehmen" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 500, color: "var(--fg-3)", letterSpacing: ".1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>E-Mail *</label>
                  <input required type="email" style={input} placeholder="ihre@email.de" />
                </div>
                <div>
                  <label style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 500, color: "var(--fg-3)", letterSpacing: ".1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Telefon (optional)</label>
                  <input style={input} placeholder="+49 ..." />
                </div>
              </div>

              <div>
                <label style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 500, color: "var(--fg-3)", letterSpacing: ".1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Anliegen *</label>
                <select required style={{ ...input, appearance: "none" }}>
                  <option value="">Bitte wählen …</option>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 500, color: "var(--fg-3)", letterSpacing: ".1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Nachricht *</label>
                <textarea required rows={6} style={{ ...input, resize: "vertical" }} placeholder="Beschreiben Sie kurz Ihr Anliegen oder Ihren Use Case …" />
              </div>

              <button type="submit" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 500, letterSpacing: ".08em", padding: "16px 32px", borderRadius: 4, background: "var(--glow-cyan)", color: "var(--ink-abyss)", border: "none", cursor: "pointer", alignSelf: "flex-start" }}>
                Anfrage senden →
              </button>

              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, color: "var(--fg-3)", lineHeight: 1.6, margin: 0 }}>
                Ihre Daten werden ausschließlich zur Bearbeitung Ihrer Anfrage verwendet und nicht an Dritte weitergegeben.
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
