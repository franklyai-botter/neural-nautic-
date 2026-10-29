"use client";
import { useEffect, useRef, useState } from "react";
import { MARKUP } from "./architektur3d.generated";

// Drehbares Raummodell der KI-Architektur. Renderer und Szene kommen aus
// public/architektur/ (erzeugt von tools/architektur/build_web.py), derselbe
// Renderer wie im RAG-Referenzmodell. Steht das Modell in einem zugeklappten
// <details>, wird der Renderer erst beim Aufklappen geladen: er misst die Bühne
// beim Start, eine verborgene Bühne hätte die Größe 0.
export default function Architektur3D() {
  const ref = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [voll, setVoll] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let script: HTMLScriptElement | null = null;
    const load = () => {
      if (script || cancelled) return;
      fetch("/architektur/szene.json")
        .then(r => r.json())
        .then(scene => {
          if (cancelled || script) return;
          (window as unknown as { SCENE: unknown }).SCENE = scene;
          script = document.createElement("script");
          script.src = "/architektur/model3d.js";
          document.body.appendChild(script);
        })
        .catch(() => {});
    };
    const details = ref.current?.closest("details");
    const onToggle = () => { if (details?.open) load(); };
    if (!details || details.open) load();
    else details.addEventListener("toggle", onToggle);
    // Der Renderer misst beim Resize neu; Vollbild löst ein Resize aus.
    const onFull = () => setVoll(document.fullscreenElement === wrap.current);
    document.addEventListener("fullscreenchange", onFull);
    return () => {
      cancelled = true;
      details?.removeEventListener("toggle", onToggle);
      document.removeEventListener("fullscreenchange", onFull);
      script?.remove();
    };
  }, []);

  const umschalten = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else wrap.current?.requestFullscreen().catch(() => {});
  };

  return (
    <>
      <link rel="stylesheet" href="/architektur/model3d.css" precedence="default" />
      <div ref={wrap} className="m3d-wrap" style={{ position: "relative" }}>
        <div ref={ref} dangerouslySetInnerHTML={{ __html: MARKUP }} />
        {/* NN-Signatur wie in der statischen Grafik: Monogramm (public/logo-monogram.png, wie im Footer) und Wortmarke */}
        <div aria-hidden="true" style={{ position: "absolute", top: 18, left: 22, display: "flex", alignItems: "center", gap: 10, pointerEvents: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-monogram.png" alt="" width={40} height={40} style={{ objectFit: "contain", opacity: 0.92 }} />
          <div>
            <div style={{ fontFamily: "var(--font-italiana), serif", fontSize: 18, color: "var(--fg-2)", letterSpacing: ".04em", lineHeight: 1.1 }}>NeuralNautic</div>
            <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 9.5, color: "var(--fg-3)", letterSpacing: ".16em", textTransform: "uppercase" }}>Referenzmodell</div>
          </div>
        </div>
        <button type="button" onClick={umschalten} style={{
          position: "absolute", top: 72, left: 22, padding: "7px 12px", borderRadius: 4,
          border: "1px solid var(--border-3)", background: "rgba(6,20,25,.75)", color: "var(--fg-1)",
          fontFamily: "var(--font-inter), sans-serif", fontSize: 12, letterSpacing: ".06em", cursor: "pointer",
        }}>
          {voll ? "Vollbild beenden" : "Vollbild"}
        </button>
      </div>
    </>
  );
}
