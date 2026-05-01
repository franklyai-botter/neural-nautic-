"use client";
import Image from "next/image";
import { Eyebrow, Button } from "./atoms";

export default function Hero({ onNav }: { onNav: (id: string) => void }) {
  return (
    <section style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <Image src="/bg-neural-network.png" alt="" fill style={{ objectFit: "cover" }} priority />
      </div>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 30% 50%, transparent 20%, rgba(6,20,25,.88) 75%)",
      }} />

      <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto", padding: "0 48px", width: "100%" }}>
        <div style={{ maxWidth: 720 }}>
          <Eyebrow>✦  Atelier · Collection MMXXVI</Eyebrow>
          <h1 style={{
            fontFamily: "var(--font-italiana), Italiana, serif",
            fontWeight: 400,
            fontSize: "clamp(64px, 9vw, 120px)",
            lineHeight: 0.98, letterSpacing: "-0.015em",
            color: "var(--fg-1)", margin: "28px 0 0",
          }}>
            Instruments of<br />
            <em style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontWeight: 400 }}>quiet</em> intelligence.
          </h1>

          <p style={{
            fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
            fontSize: 22, lineHeight: 1.55,
            color: "var(--fg-2)", maxWidth: "48ch",
            margin: "32px 0 40px",
            fontStyle: "italic", fontWeight: 400,
          }}>
            A small atelier of goods and software — forged in brushed platinum, navigated by a luminous mesh.
          </p>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Button variant="primary" icon="→" onClick={() => onNav("collection")}>Enter the collection</Button>
            <Button variant="ghost" icon="→" onClick={() => onNav("journal")}>Read the log</Button>
          </div>
        </div>
      </div>

      <Image src="/logo-star.png" alt="" width={64} height={64} style={{
        position: "absolute", bottom: 36, right: 48,
        objectFit: "contain", opacity: 0.7,
        filter: "drop-shadow(0 4px 18px rgba(63,212,224,.45))",
      }} />

      <div style={{
        position: "absolute", bottom: 44, left: 48,
        fontFamily: "var(--font-jetbrains), JetBrains Mono, monospace",
        fontSize: 11, color: "var(--fg-3)", letterSpacing: ".12em",
        display: "flex", gap: 20,
      }}>
        <span>N 52°22′03″</span>
        <span style={{ color: "var(--glow-faint)" }}>·</span>
        <span>E 4°53′48″</span>
        <span style={{ color: "var(--glow-faint)" }}>·</span>
        <span>Meridian</span>
      </div>
    </section>
  );
}
