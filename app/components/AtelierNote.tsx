import Image from "next/image";
import { Rule } from "./atoms";

export default function AtelierNote() {
  return (
    <section style={{
      position: "relative", padding: "140px 48px",
      background: "var(--ink-abyss)", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <Image src="/bg-neural-network.png" alt="" fill style={{ objectFit: "cover", opacity: 0.35 }} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 10%, rgba(6,20,25,.9) 80%)" }} />

      <div style={{ position: "relative", maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
        <Image src="/logo-monogram.png" alt="" width={180} height={145} style={{
          margin: "0 auto 32px", display: "block",
          filter: "drop-shadow(0 6px 22px rgba(0,0,0,.5)) drop-shadow(0 0 32px rgba(216,192,158,.15))",
        }} />
        <Rule width={40} />
        <p style={{
          fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
          fontStyle: "italic", fontWeight: 400,
          fontSize: "clamp(28px, 3.2vw, 42px)", lineHeight: 1.3,
          color: "var(--fg-1)", margin: "28px 0",
        }}>
          &ldquo;The mark is struck, not rendered — a quiet gleam caught at dusk. We keep a small log, and we make a small number of things.&rdquo;
        </p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 28 }}>
          <Rule width={24} color="var(--silver-mid)" />
          <span style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".3em", color: "var(--fg-3)" }}>From the atelier journal · N 52°</span>
        </div>
      </div>
    </section>
  );
}
