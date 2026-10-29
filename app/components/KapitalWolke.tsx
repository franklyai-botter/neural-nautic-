"use client";

import { useEffect, useRef, useState } from "react";

// Ausguck-Animation (Frank 29.10.2026): Investitionen von Microsoft, Alphabet, Amazon, Meta seit
// ChatGPT als Punktwolke, ein Punkt = 1 Mrd. USD. Punkte liegen auf einer Sonnenblumen-Spirale
// (Phyllotaxis): Radius ~ Wurzel(n), damit ist die Fläche proportional zur Summe. Deshalb sind die
// Vergleichsringe flächentreu: ein Ring mit k Mrd. umschließt genau k Punkte.
// Diagrammregeln (marken-dokument/storyline-und-diagramme.md): ein Akzent (Deep Teal), Rest grau.
// Daten und Quellen: app/wissen/kapital.ts (aus Primärquellen, siehe dort).

export type Quartal = { q: string; summe: number };
export type Vergleich = { name: string; mrd: number };

const AKZENT = "13,115,119";   // Deep Teal hell #0D7377
const GRAU = "139,160,164";    // --fg-4
const MS_JE_QUARTAL = 650;

export default function KapitalWolke({ quartale, vergleiche }: { quartale: Quartal[]; vergleiche: Vergleich[] }) {
  const leinwand = useRef<HTMLCanvasElement | null>(null);
  const [stand, setStand] = useState(quartale.length);   // wie viele Quartale gezeigt (Server: alle)
  const [lauf, setLauf] = useState(0);                    // erhöht = Animation neu starten

  const kumuliert = quartale.reduce<number[]>((a, x) => [...a, (a.at(-1) ?? 0) + x.summe], []);
  const gesamt = kumuliert.at(-1) ?? 0;
  const aktuell = stand > 0 ? kumuliert[stand - 1] : 0;
  const maxQ = Math.max(...quartale.map((x) => x.summe));

  // Animation: Quartal für Quartal, sobald sichtbar; bei reduzierter Bewegung sofort Endstand
  useEffect(() => {
    const el = leinwand.current;
    if (!el) return;
    // Reduzierte Bewegung: Endstand bleiben lassen (Anfangswert von stand ist schon der Endstand)
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let i = 0;
      setStand(0);
      const weiter = () => { i += 1; setStand(i); if (i < quartale.length) timer = window.setTimeout(weiter, MS_JE_QUARTAL); };
      timer = window.setTimeout(weiter, 400);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); window.clearTimeout(timer); };
  }, [quartale.length, lauf]);

  // Zeichnen: Punkte bis zum aktuellen Stand, Vergleichsringe
  useEffect(() => {
    const c = leinwand.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = c.clientWidth;
    c.width = w * dpr; c.height = w * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, w);
    const mitte = w / 2;
    const groesster = Math.max(gesamt, ...vergleiche.map((v) => v.mrd));
    const schritt = (w / 2 - 12) / Math.sqrt(groesster);       // Abstand so, dass alles hineinpasst
    const r = Math.max(0.8, schritt * 0.36);
    const gold = Math.PI * (3 - Math.sqrt(5));
    const n = Math.round(aktuell);
    for (let k = 0; k < n; k++) {
      const rad = schritt * Math.sqrt(k + 0.5);
      const a = k * gold;
      ctx.beginPath();
      ctx.arc(mitte + rad * Math.cos(a), mitte + rad * Math.sin(a), r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${AKZENT},${k > n - 40 ? 0.95 : 0.7})`;
      ctx.fill();
    }
    ctx.setLineDash([3, 4]);
    ctx.font = "500 12px Inter, sans-serif";
    vergleiche.forEach((v, i) => {
      const rad = schritt * Math.sqrt(v.mrd);
      ctx.beginPath();
      ctx.arc(mitte, mitte, rad, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${GRAU},0.9)`;
      ctx.lineWidth = 1;
      ctx.stroke();
      const winkel = -Math.PI / 4 + i * (Math.PI / 2.2);
      const x = mitte + rad * Math.cos(winkel), y = mitte + rad * Math.sin(winkel);
      // Beschriftung auf weißer Unterlage, innerhalb der Leinwand gehalten
      const txt = `${v.name} · ${v.mrd.toLocaleString("de-DE")} Mrd.`;
      const tw = ctx.measureText(txt).width;
      const links = Math.cos(winkel) < 0;
      const tx = Math.min(w - tw - 6, Math.max(6, links ? x - 8 - tw : x + 8));
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.fillRect(tx - 5, y - 11, tw + 10, 18);
      ctx.fillStyle = "#2E4F57";
      ctx.textAlign = "left";
      ctx.fillText(txt, tx, y + 2);
    });
    ctx.setLineDash([]);
  }, [aktuell, gesamt, vergleiche]);

  const q = quartale[Math.max(0, stand - 1)];
  return (
    <figure style={{ margin: 0 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", margin: "0 0 8px" }}>
        <span style={{ fontFamily: "var(--font-display), sans-serif", fontWeight: 700, fontSize: "clamp(32px, 5vw, 52px)", color: "var(--accent)", letterSpacing: "-0.02em" }}>
          ≈ {Math.round(aktuell).toLocaleString("de-DE")} Mrd. $
        </span>
        <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--fg-3)" }}>
          kumuliert bis {q ? q.q.replace("-", " ") : "–"} · 1 Punkt = 1 Mrd. $
        </span>
      </div>
      <canvas ref={leinwand} role="img" aria-label={`Investitionen der vier Konzerne seit 2023: rund ${Math.round(gesamt)} Milliarden US-Dollar, im Vergleich zu ${vergleiche.map((v) => `${v.name} ${v.mrd} Milliarden`).join(", ")}.`}
        style={{ width: "100%", maxWidth: 560, aspectRatio: "1", display: "block", margin: "0 auto" }} />
      {/* Quartalsbalken: grau, das aktuelle Quartal im Akzent */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 90, marginTop: 16 }} aria-hidden="true">
        {quartale.map((x, i) => (
          <div key={x.q} title={`${x.q}: ${x.summe.toLocaleString("de-DE")} Mrd. $`}
            style={{ flex: 1, height: `${(x.summe / maxQ) * 100}%`, borderRadius: 2, transition: "background 200ms",
              background: i < stand ? (i === stand - 1 ? "var(--accent)" : "rgba(139,160,164,.55)") : "rgba(139,160,164,.15)" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-inter), sans-serif", fontSize: 11, color: "var(--fg-3)", marginTop: 6 }}>
        <span>{quartale[0]?.q.replace("-", " ")}</span>
        <button type="button" onClick={() => setLauf((x) => x + 1)} style={{ background: "none", border: 0, color: "var(--accent)", cursor: "pointer", fontSize: 12 }}>↻ noch einmal</button>
        <span>{quartale.at(-1)?.q.replace("-", " ")}</span>
      </div>
    </figure>
  );
}
