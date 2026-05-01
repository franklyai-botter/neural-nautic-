"use client";
import { Eyebrow } from "./atoms";

const ENTRIES = [
  { id: "n-001", vol: "Vol. IV · No. 12", title: "On the brushed meridian",     excerpt: "A study of how still water catches the moon — patiently, in facets.",                 coord: "N 52°22′", mins: 8 },
  { id: "n-002", vol: "Vol. IV · No. 11", title: "A mesh, observed",             excerpt: "Notes on the lattice, and what it chooses to illuminate at dusk.",                    coord: "W 4°54′",  mins: 12 },
  { id: "n-003", vol: "Vol. IV · No. 10", title: "Instruments, forged slowly",   excerpt: "Why we struck the mark by hand, and why we will continue to do so.",                 coord: "N 48°51′", mins: 6 },
  { id: "n-004", vol: "Vol. IV · No. 09", title: "The quiet gleam",              excerpt: "On restraint — the luxury of not being loud.",                                        coord: "E 2°21′",  mins: 5 },
];

type Entry = typeof ENTRIES[0];

function LogEntry({ e, onOpen }: { e: Entry; onOpen: () => void }) {
  return (
    <article
      onClick={onOpen}
      style={{
        display: "grid", gridTemplateColumns: "140px 1fr auto", gap: 32,
        padding: "32px 0", borderBottom: "1px solid var(--border-1)",
        cursor: "pointer", transition: "all 180ms",
      }}
      onMouseEnter={ev => { const el = ev.currentTarget as HTMLElement; el.style.paddingLeft = "12px"; el.style.background = "rgba(205,206,210,.02)"; }}
      onMouseLeave={ev => { const el = ev.currentTarget as HTMLElement; el.style.paddingLeft = "0"; el.style.background = ""; }}
    >
      <div>
        <div style={{ fontFamily: "var(--font-jetbrains), JetBrains Mono, monospace", fontSize: 10, color: "var(--glow-cyan)", letterSpacing: ".08em" }}>{e.vol}</div>
        <div style={{ fontFamily: "var(--font-jetbrains), JetBrains Mono, monospace", fontSize: 10, color: "var(--fg-3)", marginTop: 6 }}>{e.coord}</div>
      </div>
      <div>
        <h3 style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif", fontStyle: "italic", fontWeight: 400, fontSize: 28, color: "var(--fg-1)", margin: "0 0 8px", lineHeight: 1.2 }}>{e.title}</h3>
        <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 14, lineHeight: 1.55, color: "var(--fg-2)", margin: 0, maxWidth: "58ch" }}>{e.excerpt}</p>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 10, color: "var(--fg-3)", letterSpacing: ".18em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{e.mins} min</span>
        <span style={{ fontFamily: "serif", color: "var(--glow-cyan)", fontSize: 18 }}>→</span>
      </div>
    </article>
  );
}

export default function JournalList({ onOpen }: { onOpen: (e: Entry) => void }) {
  return (
    <section style={{ padding: "120px 48px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 48 }}>
        <Eyebrow>✦  The Log</Eyebrow>
        <h2 style={{
          fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
          fontStyle: "italic", fontWeight: 400,
          fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 1.05,
          color: "var(--fg-1)", margin: "20px 0 0",
        }}>Notes, kept slowly.</h2>
      </div>
      <div>{ENTRIES.map(e => <LogEntry key={e.id} e={e} onOpen={() => onOpen(e)} />)}</div>
    </section>
  );
}
