"use client";
import Image from "next/image";
import { Eyebrow, Tag } from "./atoms";

const OBJECTS = [
  { id: 1, title: "Meridian 01",    kind: "Chronometer",  price: "€ 4,200", tag: "Atelier",  note: "Brushed sterling · 38mm" },
  { id: 2, title: "Tide Compass",   kind: "Instrument",   price: "€ 1,680", tag: "Limited",  note: "Cast bronze · azimuth" },
  { id: 3, title: "Abyss Journal",  kind: "Paper goods",  price: "€ 220",   tag: "In stock", note: "Deckle-edge · N4 plate" },
];

type Obj = typeof OBJECTS[0];

function ObjectCard({ o, onOpen }: { o: Obj; onOpen: () => void }) {
  return (
    <article
      onClick={onOpen}
      style={{
        background: "var(--ink-current)",
        border: "1px solid var(--border-2)",
        borderRadius: 6, overflow: "hidden", cursor: "pointer",
        transition: "all 320ms cubic-bezier(.22,.61,.36,1)",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-4px)";
        el.style.borderColor = "rgba(63,212,224,.4)";
        el.style.boxShadow = "0 16px 48px rgba(0,0,0,.5), 0 0 24px rgba(63,212,224,.1)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "";
        el.style.borderColor = "var(--border-2)";
        el.style.boxShadow = "";
      }}
    >
      <div style={{
        aspectRatio: "4/5", position: "relative",
        background: "linear-gradient(160deg, #1A4E5E 0%, #0E2B36 60%, #061419 100%)",
        borderBottom: "1px solid var(--border-1)",
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}>
        <Image src="/bg-neural-network.png" alt="" fill style={{ objectFit: "cover", opacity: 0.15 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, rgba(205,206,210,.08), transparent 60%)" }} />
        <Image src="/logo-star.png" alt="" width={96} height={96} style={{
          objectFit: "contain", opacity: 0.9, position: "relative",
          filter: "drop-shadow(0 6px 22px rgba(0,0,0,.6)) drop-shadow(0 0 30px rgba(63,212,224,.15))",
        }} />
        <div style={{ position: "absolute", top: 14, left: 14 }}>
          <Tag tone={o.tag === "Limited" ? "accent" : "neutral"}>{o.tag}</Tag>
        </div>
      </div>

      <div style={{ padding: "20px 22px" }}>
        <div style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".22em", color: "var(--fg-3)" }}>{o.kind}</div>
        <h3 style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontStyle: "italic", fontWeight: 400, fontSize: 26, color: "var(--fg-1)", margin: "6px 0 4px" }}>{o.title}</h3>
        <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 12, color: "var(--fg-3)", margin: "0 0 14px" }}>{o.note}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid var(--border-1)" }}>
          <span style={{ fontFamily: "var(--font-jetbrains), JetBrains Mono, monospace", fontSize: 12, color: "var(--fg-2)" }}>{o.price}</span>
          <span style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--glow-cyan)" }}>View →</span>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedCollection({ onOpen }: { onOpen: (o?: Obj) => void }) {
  return (
    <section style={{ padding: "120px 48px", maxWidth: 1240, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56 }}>
        <div>
          <Eyebrow>✦  Collection · MMXXVI</Eyebrow>
          <h2 style={{
            fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
            fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 1.05,
            letterSpacing: "-0.015em", color: "var(--fg-1)",
            margin: "20px 0 0", maxWidth: "16ch",
          }}>Struck by hand, calibrated under tide.</h2>
        </div>
        <button onClick={() => onOpen()} style={{
          background: "none", border: 0, cursor: "pointer",
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: 11, fontWeight: 500, letterSpacing: ".22em",
          textTransform: "uppercase", color: "var(--glow-cyan)",
        }}>The full atlas →</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {OBJECTS.map(o => <ObjectCard key={o.id} o={o} onOpen={() => onOpen(o)} />)}
      </div>
    </section>
  );
}
