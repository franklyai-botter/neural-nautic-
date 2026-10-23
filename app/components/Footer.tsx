import Image from "next/image";
import Link from "next/link";
import { LINKEDIN_COMPANY_URL, LINKEDIN_URL, X_URL } from "../site";
import { LinkedInMark } from "./LinkedInButton";

const COLS = [
  ["Leistungen", [
    ["KI-Potenzialanalyse", "/leistungen"],
    ["Controlled Pilot",    "/leistungen"],
    ["KI-Automatisierung",  "/leistungen"],
    ["KI-Governance",       "/leistungen"],
    ["KI-Schulung",         "/leistungen"],
  ]],
  ["Angebote", [
    ["Use Cases",      "/use-cases"],
    ["Methode",        "/methode"],
    ["KI Tool Kompass","/ki-tool-kompass"],
    ["Wissen",         "/wissen"],
  ]],
  ["Kontakt", [
    ["Über mich",  "/ueber-mich"],
    ["Anfrage senden", "/kontakt"],
    ["LinkedIn Frank ↗", LINKEDIN_URL],
    ["LinkedIn NeuralNautic ↗", LINKEDIN_COMPANY_URL],
    ["X @FSchuettNN ↗", X_URL],
    ["FOR42.ai ↗", "https://for42.ai"],
  ]],
] as [string, [string, string][]][];

export default function Footer() {
  return (
    <footer style={{
      position: "relative", overflow: "hidden",
      background: "var(--ink-abyss)",
      padding: "80px 32px 40px",
      marginTop: 80, borderTop: "1px solid var(--border-1)",
    }}>

      <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
        <div className="nn-footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
          <div>
            <div>
              <Image src="/logo-monogram.png" alt="NeuralNautic" width={54} height={54} style={{ objectFit: "contain" }} />
            </div>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.65, marginTop: 20, maxWidth: "38ch" }}>
              Pragmatische KI-Beratung. Für den Mittelstand gebaut. Für regulierte Branchen gehärtet.
            </p>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, color: "var(--fg-3)", marginTop: 12 }}>
              Berlin · Bundesweit · DACH
            </p>
          </div>

          {COLS.map(([heading, items]) => (
            <div key={heading}>
              <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".24em", color: "var(--glow-cyan)", marginBottom: 16 }}>{heading}</div>
              {items.map(([label, href]) => {
                const style = { display: "block", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--fg-2)", textDecoration: "none", padding: "5px 0" };
                if (href === LINKEDIN_URL || href === LINKEDIN_COMPANY_URL) return (
                  <a key={label} href={href} target="_blank" rel="noopener" style={{ ...style, display: "flex", alignItems: "center", gap: 8 }}>
                    <LinkedInMark size={16} />{label}
                  </a>
                );
                return href.startsWith("http")
                  ? <a key={label} href={href} target="_blank" rel="noopener" style={style}>{label}</a>
                  : <Link key={label} href={href} style={style}>{label}</Link>;
              })}
            </div>
          ))}
        </div>

        <div className="nn-footer-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 28, borderTop: "1px solid var(--border-1)" }}>
          <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 10, color: "var(--fg-3)", letterSpacing: ".1em" }}>
            © {new Date().getFullYear()} · NeuralNautic · in Gründung · Frank Schütt
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {([["Impressum", "/impressum"], ["Datenschutz", "/datenschutz"]] as [string, string][]).map(([l, href]) => (
              <Link key={l} href={href} style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, color: "var(--fg-3)", textDecoration: "none", letterSpacing: ".08em" }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
