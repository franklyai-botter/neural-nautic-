"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// Über dem Einstieg der Startseite (Frank 29.10.2026, Vorlage: refero „TWOMUCH.STUDIO – floating
// museum of curiosities“): der NN-Stern in der Mitte, die Logos der Modellanbieter in Glaskacheln
// wirbeln auf geneigten Bahnen um ihn herum. Logos unverändert aus LobeHub Icons (MIT), Auswahl nach
// artificialanalysis.ai; Herkunft und Markenhinweis in public/ki-logos/LIZENZ.txt.
// Stern: /logo-star.png = Brand-Assets/neuralnautic/nn-stern-2026-10-kompass.png (byte-gleich).

const LOGOS: { datei: string; name: string }[] = [
  { datei: "openai", name: "OpenAI" }, { datei: "claude-color", name: "Anthropic Claude" },
  { datei: "gemini-color", name: "Google Gemini" }, { datei: "deepseek-color", name: "DeepSeek" },
  { datei: "meta-color", name: "Meta" }, { datei: "mistral-color", name: "Mistral AI" },
  { datei: "xai", name: "xAI" }, { datei: "qwen-color", name: "Alibaba Qwen" },
  { datei: "kimi-color", name: "Moonshot Kimi" }, { datei: "zhipu-color", name: "Z AI" },
  { datei: "minimax-color", name: "MiniMax" }, { datei: "cohere-color", name: "Cohere" },
  { datei: "nvidia-color", name: "NVIDIA" }, { datei: "aws-color", name: "Amazon Web Services" },
  { datei: "microsoft-color", name: "Microsoft" }, { datei: "ibm", name: "IBM" },
  { datei: "perplexity-color", name: "Perplexity" }, { datei: "bytedance-color", name: "ByteDance" },
  { datei: "baidu-color", name: "Baidu" }, { datei: "tencent-color", name: "Tencent" },
  { datei: "stepfun-color", name: "StepFun" }, { datei: "anthropic", name: "Anthropic" },
  { datei: "google-color", name: "Google" }, { datei: "ai21", name: "AI21 Labs" },
  { datei: "upstage-color", name: "Upstage" }, { datei: "liquid", name: "Liquid AI" },
  { datei: "ai2-color", name: "Allen Institute for AI" }, { datei: "lg-color", name: "LG AI Research" },
  { datei: "tii-color", name: "TII" }, { datei: "nousresearch", name: "Nous Research" },
  { datei: "reka", name: "Reka AI" }, { datei: "inception", name: "Inception" },
];

// Fester Zufall je Logo, damit jede Seitenansicht gleich startet (kein Springen beim Laden).
const zufall = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const BAHNEN = LOGOS.map((_, i) => ({
  radius: 0.36 + 0.64 * zufall(i, 1),                                  // Anteil der halben Breite
  tempo: (0.00006 + 0.00014 * zufall(i, 2)) * (zufall(i, 3) < 0.35 ? -1 : 1), // rad/ms, einige gegenläufig
  phase: zufall(i, 4) * Math.PI * 2,
  hub: 6 + 14 * zufall(i, 5),                                            // senkrechtes Wippen in px
  neigung: 0.28 + 0.16 * zufall(i, 6),                                   // flache Ellipse = Draufsicht von schräg
}));

const glas = {
  background: "rgba(255,255,255,0.55)",
  backdropFilter: "blur(10px) saturate(140%)",
  WebkitBackdropFilter: "blur(10px) saturate(140%)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 10px 28px rgba(6,20,25,0.10), 0 0 0 1px rgba(13,115,119,0.10), inset 0 1px 0 rgba(255,255,255,0.95)",
} as const;

export default function KiLogoWirbel() {
  const buehne = useRef<HTMLDivElement | null>(null);
  const kacheln = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = buehne.current;
    if (!el) return;
    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let sichtbar = true;
    const start = performance.now();

    const setzen = (t: number) => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const klein = w < 640;
      const halbeBreite = w / 2 - (klein ? 30 : 48);
      kacheln.current.forEach((k, i) => {
        if (!k) return;
        const b = BAHNEN[i];
        const winkel = b.phase + b.tempo * t;
        const tiefe = Math.sin(winkel);                       // -1 hinten … 1 vorn
        const x = Math.cos(winkel) * halbeBreite * b.radius;
        // Senkrechte Ausdehnung aus der Höhe der Bühne, damit sich oben und unten nichts staut
        const halbeHoehe = h / 2 - (klein ? 30 : 44) - b.hub;
        const yBegrenzt = tiefe * Math.min(halbeBreite * b.radius * b.neigung * 1.6, halbeHoehe * b.radius) + Math.sin(t * 0.0009 + b.phase) * b.hub;
        const s = 0.72 + 0.34 * (tiefe + 1) / 2;
        k.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${yBegrenzt.toFixed(1)}px) scale(${s.toFixed(3)})`;
        k.style.zIndex = String(tiefe < 0 ? 1 : 3);           // hinten liegt der Stern (z 2) davor
        k.style.opacity = (0.55 + 0.45 * (tiefe + 1) / 2).toFixed(2);
      });
    };

    const schritt = (jetzt: number) => {
      if (sichtbar) setzen(jetzt - start);
      raf = requestAnimationFrame(schritt);
    };

    const io = new IntersectionObserver(([e]) => { sichtbar = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);
    if (still) setzen(0);
    else raf = requestAnimationFrame(schritt);
    const onResize = () => setzen(performance.now() - start);
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <div ref={buehne} role="img" aria-label={`Logos der Modellanbieter, mit denen wir arbeiten: ${LOGOS.map(l => l.name).join(", ")}`}
      className="nn-wirbel" style={{ position: "relative", width: "100%", height: "clamp(280px, 38vw, 420px)", overflow: "hidden" }}>
      {/* Stern in der Mitte, auf einer Glasscheibe */}
      <div style={{ ...glas, position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 2,
        width: "clamp(104px, 13vw, 150px)", aspectRatio: "1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `${glas.boxShadow}, 0 0 60px rgba(13,115,119,0.18)` }}>
        <Image src="/logo-star.png" alt="NeuralNautic" width={96} height={96} priority style={{ width: "68%", height: "auto" }} />
      </div>
      {LOGOS.map((l, i) => (
        <div key={l.datei} ref={(n) => { kacheln.current[i] = n; }} title={l.name} className="nn-wirbel-kachel"
          style={{ ...glas, position: "absolute", left: "50%", top: "50%", width: 60, height: 60, borderRadius: 16,
            display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, willChange: "transform" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG unverändert, keine Optimierung nötig */}
          <img src={`/ki-logos/${l.datei}.svg`} alt="" width={30} height={30} style={{ width: 30, height: 30 }} />
        </div>
      ))}
    </div>
  );
}
