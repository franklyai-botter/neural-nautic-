import Image from "next/image";
import Link from "next/link";

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
      <div style={{ position: "absolute", inset: 0 }}>
        <Image src="/bg-neural-network.png" alt="" fill style={{ objectFit: "cover", opacity: 0.12 }} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(6,20,25,.4), rgba(6,20,25,.97) 70%)" }} />

      <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
          <div>
            <div>
              <Image src="/logo-monogram.png" alt="NeuralNautic" width={54} height={54} style={{ objectFit: "contain" }} />
            </div>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.65, marginTop: 20, maxWidth: "38ch" }}>
              Pragmatische KI-Beratung für den Mittelstand. Von der Idee zum messbaren Pilotprojekt.
            </p>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, color: "var(--fg-3)", marginTop: 12 }}>
              Berlin · Deutschland · DACH
            </p>
          </div>

          {COLS.map(([heading, items]) => (
            <div key={heading}>
              <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".24em", color: "var(--glow-cyan)", marginBottom: 16 }}>{heading}</div>
              {items.map(([label, href]) => (
                <Link key={label} href={href} style={{ display: "block", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--fg-2)", textDecoration: "none", padding: "5px 0" }}>{label}</Link>
              ))}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 28, borderTop: "1px solid var(--border-1)" }}>
          <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 10, color: "var(--fg-3)", letterSpacing: ".1em" }}>
            © {new Date().getFullYear()} · NeuralNautic · Frank Schütt
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
