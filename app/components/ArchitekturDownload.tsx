"use client";
import Link from "next/link";
import { useState } from "react";

// Download der Architektur-Grafik gegen Name, E-Mail und Telefon.
// Server-Seite: app/api/architektur-download/route.ts

const input: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  fontFamily: "var(--font-inter), sans-serif", fontSize: 14,
  background: "var(--ink-abyss)", color: "var(--fg-1)",
  border: "1px solid var(--border-2)", borderRadius: 4,
  padding: "12px 16px", outline: "none",
};
const label: React.CSSProperties = {
  fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 500, color: "var(--fg-3)",
  letterSpacing: ".1em", textTransform: "uppercase", display: "block", marginBottom: 8,
};

export default function ArchitekturDownload() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/architektur-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          consent: fd.get("consent") === "on",
          website: fd.get("website"),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Unbekannter Fehler. Bitte versuchen Sie es erneut.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "NeuralNautic_KI-Architektur_7-Schichten.svg";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setDone(true);
    } catch {
      setError("Verbindung fehlgeschlagen. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--ink-current)", border: "1px solid var(--border-3)", borderRadius: 6, padding: "32px 32px" }}>
      <div className="nn-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 40, alignItems: "start" }}>
        <div>
          <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 10, color: "var(--glow-cyan)", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 12 }}>Download</div>
          <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 400, fontSize: 30, color: "var(--fg-1)", margin: "0 0 12px", lineHeight: 1.15 }}>
            Das Referenzmodell als Grafik für Ihre Unterlagen
          </h3>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.65, margin: 0 }}>
            Alle sieben Schichten mit Bausteinen, Datenfluss und Erläuterungen in einem Bild, verlustfrei skalierbar (SVG) für Präsentationen und Strategiepapiere.
          </p>
        </div>

        {done ? (
          <div style={{ padding: "8px 0" }}>
            <div style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 28, color: "var(--fg-1)", marginBottom: 10 }}>Danke, der Download läuft.</div>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.65, margin: 0 }}>
              Falls er nicht startet, senden Sie das Formular einfach erneut. Wenn Sie Fragen zur Architektur haben, melde ich mich gern.
            </p>
            <button type="button" onClick={() => setDone(false)} style={{ marginTop: 16, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--glow-cyan)" }}>
              Erneut herunterladen
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label htmlFor="dl-name" style={label}>Name *</label>
              <input id="dl-name" name="name" required autoComplete="name" style={input} placeholder="Ihr Name" />
            </div>
            <div className="nn-form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label htmlFor="dl-email" style={label}>E-Mail *</label>
                <input id="dl-email" name="email" type="email" required autoComplete="email" style={input} placeholder="ihre@email.de" />
              </div>
              <div>
                <label htmlFor="dl-phone" style={label}>Telefon *</label>
                <input id="dl-phone" name="phone" type="tel" required autoComplete="tel" style={input} placeholder="+49 ..." />
              </div>
            </div>
            {/* Honeypot, für Menschen unsichtbar */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
              <label htmlFor="dl-website">Website</label>
              <input id="dl-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontFamily: "var(--font-inter), sans-serif", fontSize: 12.5, color: "var(--fg-2)", lineHeight: 1.6, cursor: "pointer" }}>
              <input name="consent" type="checkbox" required style={{ marginTop: 3, accentColor: "var(--glow-cyan)", flexShrink: 0 }} />
              <span>
                Ich willige ein, dass NeuralNautic meine Angaben verarbeitet, um mir die Grafik bereitzustellen und mich dazu per E-Mail oder Telefon zu kontaktieren. Die Einwilligung kann ich jederzeit per E-Mail widerrufen. Details in der{" "}
                <Link href="/datenschutz" style={{ color: "var(--glow-cyan)" }}>Datenschutzerklärung</Link>. *
              </span>
            </label>
            {error && (
              <p role="alert" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--signal-alert)", margin: 0 }}>{error}</p>
            )}
            <button type="submit" disabled={loading} style={{ alignSelf: "flex-start", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: ".08em", padding: "13px 28px", borderRadius: 4, border: "none", background: "var(--glow-cyan)", color: "var(--ink-abyss)", cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Wird vorbereitet …" : "Grafik herunterladen"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
