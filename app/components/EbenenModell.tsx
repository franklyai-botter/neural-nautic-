import Link from "next/link";

// Zwei Ebenen der Methode: das Unternehmen (einmal, laufend gepflegt) und das
// einzelne Projekt (je Anwendungsfall). Auf /ki-im-unternehmen und /methode,
// die jeweils eigene Ebene hervorgehoben. Ein Akzent, Rest neutral (BRAND.md, Diagramme).

const UNTERNEHMEN = ["Strategie und Roadmap", "Wandel und Befähigung", "KI-Managementsystem", "KI-Architektur"];
const PROJEKT = ["Verstehen", "Zuschneiden", "Pilotieren", "Automatisieren", "Übergeben"];

function Ebene({ aktiv, kicker, title, rhythm, href, items, steps }: {
  aktiv: boolean; kicker: string; title: string; rhythm: string; href: string; items: string[]; steps?: boolean;
}) {
  return (
    <div style={{
      background: aktiv ? "rgba(63,212,224,.07)" : "var(--ink-current)",
      border: aktiv ? "1px solid var(--glow-cyan)" : "1px solid var(--border-2)",
      borderRadius: 6, padding: "22px 24px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: aktiv ? "var(--glow-cyan)" : "var(--fg-3)", marginBottom: 6 }}>
            {kicker}{aktiv ? " · Sie sind hier" : ""}
          </div>
          <div style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 26, color: "var(--fg-1)", lineHeight: 1.15 }}>
            {aktiv ? title : <Link href={href} style={{ color: "var(--fg-1)" }}>{title} →</Link>}
          </div>
        </div>
        <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, color: "var(--fg-3)" }}>{rhythm}</div>
      </div>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {items.map((t, i) => (
          <li key={t} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: aktiv ? "var(--fg-1)" : "var(--fg-2)",
            border: "1px solid var(--border-2)", borderRadius: 4, padding: "7px 12px", background: "var(--ink-abyss)",
          }}>
            {steps && <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 10, color: aktiv ? "var(--glow-cyan)" : "var(--fg-3)" }}>0{i + 1}</span>}
            {t}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function EbenenModell({ aktiv }: { aktiv: "unternehmen" | "projekt" }) {
  const pfeil = { fontFamily: "var(--font-inter), sans-serif", fontSize: 12, color: "var(--fg-3)", display: "flex", alignItems: "center", gap: 8 } as const;
  return (
    <figure style={{ margin: 0 }}>
      <figcaption style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, fontWeight: 500, color: "var(--fg-1)", marginBottom: 18 }}>
        Das Unternehmen gibt den Rahmen vor, jedes Projekt setzt einen Anwendungsfall daraus um
      </figcaption>
      <Ebene aktiv={aktiv === "unternehmen"} kicker="Ebene 1 · Unternehmen" title="KI im Unternehmen"
        rhythm="einmal aufgebaut, laufend gepflegt" href="/ki-im-unternehmen" items={UNTERNEHMEN} />
      <div className="nn-ebenen-pfeile" style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "12px 24px", flexWrap: "wrap" }}>
        <span style={pfeil}><span aria-hidden="true" style={{ color: "var(--glow-cyan)", fontSize: 16 }}>↓</span>Roadmap gibt den nächsten Anwendungsfall vor</span>
        <span style={pfeil}>Kennzahlen und Erfahrungen fließen zurück<span aria-hidden="true" style={{ color: "var(--glow-cyan)", fontSize: 16 }}>↑</span></span>
      </div>
      <Ebene aktiv={aktiv === "projekt"} kicker="Ebene 2 · Projekt" title="KI im Projekt"
        rhythm="je Anwendungsfall, wiederholbar" href="/methode" items={PROJEKT} steps />
      <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, color: "var(--fg-3)", margin: "12px 0 0" }}>
        Gebaut wird jede Lösung nach denselben Regeln: <Link href="/ai-engineering">AI Engineering statt Vibe Coding</Link>.
      </p>
    </figure>
  );
}
