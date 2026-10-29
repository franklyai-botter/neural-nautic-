"use client";

import { useEffect, useRef } from "react";

/**
 * Animierter Netz-Hintergrund über die ganze Seite.
 *
 * NeuralNautic, seit 29.10.2026: übernommen aus franklyai-botter/for42-website
 * (app/components/NeuralBackground.tsx, Stand 60d7bff), nur die Farbe getauscht. Grund: heller
 * Look wie for42.ai (Frank). Die frühere NN-Fassung mischte Cyan mit `screen` auf dunklem
 * Grund und wäre auf Weiß unsichtbar.
 *
 * Bewegung und Aufbau sind identisch mit der Fassung auf der
 * RAG-Vortragsauswertung (dort generiert aus `tools/neural_bg.py`) und mit dem
 * React-Original der Neural-Nautic-Website: 90 driftende Knoten,
 * Verbindungslinien bis 200 px Abstand, Signale, die zwischen nahen Knoten
 * entlanglaufen, gleiche Geschwindigkeiten und Pulsfrequenz.
 *
 * Was nicht übertragbar war, ist die Farbgebung. Auf der NN-Seite liegt ein
 * Cyan-Netz mit `mix-blend-mode: screen` auf dunklem Grund — Screen gegen Weiß
 * ergibt Weiß, das Netz wäre auf dem flach weißen DS-Grund unsichtbar.
 * Stattdessen: Steel #215089 aus dem Token-System, normal gemischt, mit
 * Alphawerten, die auf Weiß dieselbe Zurückhaltung erzeugen wie das Original
 * auf Schwarz.
 *
 * Damit das Netz sichtbar bleibt, sind die hellen Sections hintergrundlos
 * (Weiß kommt vom `body`); nur die beiden dunklen Bänder (Manifest, CTA) und
 * die Karten-Innenflächen bleiben deckend.
 */
export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reduced-Motion respektieren: dann läuft gar keine Animation an.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    type Node = { x: number; y: number; vx: number; vy: number; r: number; pulse: number };
    type Signal = { from: number; to: number; t: number; speed: number };

    // Knotenzahl über die Fläche, nicht fest. Die Vorlage fährt 90 Knoten auf
    // jedem Viewport — auf 390 px Breite ist das rund die vierfache Dichte eines
    // Desktops, das Netz wirkt dort unruhig. Referenz ist 1440x900 mit 90 Knoten
    // (= ein Knoten je 14.400 px²); dieselbe Dichte auf kleinen Viewports hält
    // auch die Zahl der Nachbarn innerhalb MAX_DIST konstant, weshalb MAX_DIST
    // unverändert bleiben kann.
    const AREA_PER_NODE = (1440 * 900) / 90;
    const MIN_NODES = 28;
    const MAX_NODES = 90;
    const MAX_DIST = 200;

    const nodeCount = () =>
      Math.max(MIN_NODES, Math.min(MAX_NODES, Math.round((W * H) / AREA_PER_NODE)));

    // NeuralNautic: Deep Teal hell #0D7377 statt for42-Steel (BRAND.md NN, Akzent auf hellem Grund).
    const STEEL = "13,115,119";

    let W = 0;
    let H = 0;
    let nodes: Node[] = [];
    let signals: Signal[] = [];
    let rafId = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initNodes = () => {
      nodes = [];
      signals = [];
      const count = nodeCount();
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.55,
          vy: (Math.random() - 0.5) * 0.55,
          r: Math.random() * 2 + 1,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    };

    const spawnSignal = () => {
      // Signal-Obergrenze mitskalieren (22 bei 90 Knoten), sonst wirkt das
      // dünnere Netz auf Mobil wieder so betriebsam wie vorher.
      if (signals.length > Math.max(6, Math.round(nodes.length * (22 / 90)))) return;
      const a = Math.floor(Math.random() * nodes.length);
      const b = Math.floor(Math.random() * nodes.length);
      const dx = nodes[b].x - nodes[a].x;
      const dy = nodes[b].y - nodes[a].y;
      if (Math.hypot(dx, dy) < MAX_DIST) {
        signals.push({ from: a, to: b, t: 0, speed: 0.014 + Math.random() * 0.014 });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Verbindungen zwischen nahen Knoten
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < MAX_DIST) {
            ctx.strokeStyle = `rgba(${STEEL},${(1 - dist / MAX_DIST) * 0.2})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Signale, die zwischen zwei Knoten entlanglaufen
      signals = signals.filter((s) => s.t <= 1);
      for (const sig of signals) {
        const a = nodes[sig.from];
        const b = nodes[sig.to];
        const sx = a.x + (b.x - a.x) * sig.t;
        const sy = a.y + (b.y - a.y) * sig.t;
        ctx.beginPath();
        ctx.arc(sx, sy, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${STEEL},${0.75 * (1 - Math.abs(sig.t - 0.5) * 2)})`;
        ctx.fill();
        sig.t += sig.speed;
      }

      // Pulsierende Knoten
      for (const n of nodes) {
        n.pulse += 0.035;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${STEEL},${0.22 + 0.18 * Math.sin(n.pulse)})`;
        ctx.fill();

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }

      if (Math.random() < 0.1) spawnSignal();
      rafId = requestAnimationFrame(draw);
    };

    const onResize = () => {
      resize();
      initNodes();
    };

    resize();
    initNodes();
    rafId = requestAnimationFrame(draw);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.75 }}
    />
  );
}
