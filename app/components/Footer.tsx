import Image from "next/image";

const COLS = [
  ["Atelier",     ["The workshop", "The log", "Commissions", "Press"]],
  ["Collection",  ["Chronometers", "Instruments", "Paper goods", "Archive"]],
  ["Waypoints",   ["Contact", "Mailing list", "Charts", "Copyright"]],
] as const;

export default function Footer() {
  return (
    <footer style={{
      position: "relative", overflow: "hidden",
      background: "var(--ink-abyss)",
      padding: "96px 48px 40px",
      marginTop: 80, borderTop: "1px solid var(--border-1)",
    }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <Image src="/bg-neural-network.png" alt="" fill style={{ objectFit: "cover", opacity: 0.2 }} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(6,20,25,.3), rgba(6,20,25,.95) 80%)" }} />

      <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 72 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Image src="/logo-star.png" alt="" width={40} height={40} style={{ objectFit: "contain" }} />
              <span style={{ fontFamily: "var(--font-italiana), Italiana, serif", fontSize: 22, color: "var(--fg-1)", letterSpacing: ".04em" }}>Neural Nautic</span>
            </div>
            <p style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontStyle: "italic", fontSize: 18, color: "var(--fg-2)", lineHeight: 1.55, marginTop: 20, maxWidth: "38ch" }}>
              A small atelier, keeping a slow log. Goods and software, forged in brushed platinum.
            </p>
          </div>

          {COLS.map(([heading, items]) => (
            <div key={heading}>
              <div style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".24em", color: "var(--glow-cyan)", marginBottom: 18 }}>{heading}</div>
              {items.map(item => (
                <a key={item} href="#" style={{ display: "block", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 13, color: "var(--fg-2)", textDecoration: "none", padding: "6px 0" }}>{item}</a>
              ))}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 32, borderTop: "1px solid var(--border-1)" }}>
          <div style={{ fontFamily: "var(--font-jetbrains), JetBrains Mono, monospace", fontSize: 10, color: "var(--fg-3)", letterSpacing: ".12em" }}>© MMXXVI · Neural Nautic Atelier · Amsterdam · N 52°22′</div>
          <div style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".24em", color: "var(--fg-3)" }}>✦  A quiet gleam</div>
        </div>
      </div>
    </footer>
  );
}
