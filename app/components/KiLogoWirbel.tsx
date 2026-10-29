"use client";

import { useEffect, useRef } from "react";

// Über dem Einstieg der Startseite (Frank 29.10.2026, Vorlage: refero „TWOMUCH.STUDIO – floating
// museum of curiosities“): Logos der Modellanbieter in Glaskacheln wirbeln auf geneigten Bahnen um
// den NN-Stern. Stern und NN-Monogramm sind Kacheln wie alle anderen (Frank: „genauso klein“).
// Logos unverändert aus LobeHub Icons (MIT) bzw. artificialanalysis.ai; Herkunft und Markenhinweis
// in public/ki-logos/LIZENZ.txt. Stern /logo-star.png und Monogramm /logo-monogram.png sind
// byte-gleich mit Brand-Assets/neuralnautic/nn-stern-2026-10-kompass.png und nn-monogramm.png.
// Glasoptik: Klasse .nn-glas in globals.css.

const LOGOS: { datei: string; name: string }[] = [
  { datei: "/logo-monogram.png", name: "NeuralNautic" },
  { datei: "/logo-star.png", name: "NeuralNautic" },
  ...([
    ["openai.svg", "OpenAI"], ["claude-color.svg", "Anthropic Claude"], ["gemini-color.svg", "Google Gemini"],
    ["deepseek-color.svg", "DeepSeek"], ["meta-color.svg", "Meta"], ["mistral-color.svg", "Mistral AI"],
    ["xai.svg", "xAI"], ["spacexai.svg", "SpaceXAI"], ["qwen-color.svg", "Alibaba Qwen"], ["alibaba-color.svg", "Alibaba"],
    ["kimi-color.svg", "Moonshot Kimi"], ["zhipu-color.svg", "Z AI"], ["minimax-color.svg", "MiniMax"],
    ["cohere-color.svg", "Cohere"], ["nvidia-color.svg", "NVIDIA"], ["aws-color.svg", "Amazon Web Services"],
    ["microsoft-color.svg", "Microsoft"], ["ibm.svg", "IBM"], ["perplexity-color.svg", "Perplexity"],
    ["bytedance-color.svg", "ByteDance Seed"], ["baidu-color.svg", "Baidu"], ["tencent-color.svg", "Tencent"],
    ["stepfun-color.svg", "StepFun"], ["anthropic.svg", "Anthropic"], ["google-color.svg", "Google"],
    ["xiaomi.svg", "Xiaomi"], ["inclusionai.jpg", "InclusionAI"], ["longcat-color.svg", "LongCat"],
    ["ai21.svg", "AI21 Labs"], ["upstage-color.svg", "Upstage"], ["liquid.svg", "Liquid AI"],
    ["ai2-color.svg", "Allen Institute for AI"], ["lg-color.svg", "LG AI Research"], ["tii-color.svg", "TII"],
    ["nousresearch.svg", "Nous Research"], ["reka.svg", "Reka AI"], ["inception.svg", "Inception"],
    ["arcee-color.svg", "Arcee AI"], ["ifm.svg", "Institute of Foundation Models"], ["reflection.svg", "Reflection AI"],
    ["thinking-machines.svg", "Thinking Machines"], ["china-mobile.png", "China Mobile"], ["prime-intellect.svg", "Prime Intellect"],
    ["sarvam.svg", "Sarvam"], ["servicenow.svg", "ServiceNow"], ["sktelecom.svg", "SK Telecom"],
    ["korea-telecom.png", "Korea Telecom"], ["naver.webp", "Naver"], ["trillionlabs.svg", "Trillion Labs"],
    ["motif.svg", "Motif Technologies"], ["multiversecomputing.svg", "Multiverse Computing"], ["nex.svg", "Nex AGI"],
    ["openbmb.svg", "OpenBMB"], ["ai9stars.svg", "AI9Stars"], ["apodex.svg", "Apodex"], ["celeris.svg", "Celeris"],
    ["kwaikat.svg", "KwaiKAT"], ["sapiens.svg", "Sapiens"], ["deepcogito.png", "Deep Cogito"],
    ["nanbeige.png", "Nanbeige"], ["swiss-ai-initiative.png", "Swiss AI Initiative"],
  ] as const).map(([d, name]) => ({ datei: `/ki-logos/${d}`, name })),
];

// Fester Zufall je Logo, damit jede Seitenansicht gleich startet (kein Springen beim Laden).
const zufall = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const BAHNEN = LOGOS.map((_, i) => ({
  radius: 0.22 + 0.78 * zufall(i, 1),                                        // Anteil der halben Breite
  tempo: (0.00004 + 0.00011 * zufall(i, 2)) * (zufall(i, 3) < 0.35 ? -1 : 1), // rad/ms, einige gegenläufig
  phase: zufall(i, 4) * Math.PI * 2,
  hub: 6 + 14 * zufall(i, 5),                                                 // senkrechtes Wippen in px
  neigung: 0.28 + 0.16 * zufall(i, 6),                                        // flache Ellipse
}));

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
      const rand = klein ? 32 : 52;
      const halbeBreite = w / 2 - rand;
      kacheln.current.forEach((k, i) => {
        if (!k) return;
        const b = BAHNEN[i];
        const winkel = b.phase + b.tempo * t;
        const tiefe = Math.sin(winkel);                       // -1 hinten … 1 vorn
        const x = Math.cos(winkel) * halbeBreite * b.radius;
        const halbeHoehe = h / 2 - rand - b.hub;
        const y = tiefe * Math.min(halbeBreite * b.radius * b.neigung * 1.6, halbeHoehe * b.radius) + Math.sin(t * 0.0009 + b.phase) * b.hub;
        const s = 0.7 + 0.38 * (tiefe + 1) / 2;
        k.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${s.toFixed(3)})`;
        k.style.zIndex = String(Math.round((tiefe + 1) * 50));
        k.style.opacity = (0.6 + 0.4 * (tiefe + 1) / 2).toFixed(2);
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
    <div ref={buehne} role="img" aria-label={`Logos der Modellanbieter, mit denen wir arbeiten: ${LOGOS.slice(1).map(l => l.name).join(", ")}`}
      style={{ position: "relative", width: "100%", height: "clamp(340px, 44vw, 540px)", overflow: "hidden" }}>
      {/* In der Mitte Frank im Glasrahmen (Studiofoto, Kopf nicht angeschnitten), ruhend und vorn */}
      <div className="nn-glas nn-wirbel-mitte" title="Frank Schütt, NeuralNautic"
        style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 120 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Foto in fester Größe */}
        <img src="/frank-schuett-quadrat.jpeg" alt="Frank Schütt" />
      </div>
      {LOGOS.map((l, i) => (
        <div key={l.datei} ref={(n) => { kacheln.current[i] = n; }} title={l.name} className="nn-glas nn-wirbel-kachel"
          style={{ position: "absolute", left: "50%", top: "50%", opacity: 0, willChange: "transform" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Logos unverändert, keine Optimierung nötig */}
          <img src={l.datei} alt="" />
        </div>
      ))}
    </div>
  );
}
