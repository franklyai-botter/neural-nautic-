"use client";
import { useEffect, useRef } from "react";
import { MARKUP } from "./architektur3d.generated";

// Drehbares Raummodell der KI-Architektur. Renderer und Szene kommen aus
// public/architektur/ (erzeugt von tools/architektur/build_web.py), derselbe
// Renderer wie im RAG-Referenzmodell. Steht das Modell in einem zugeklappten
// <details>, wird der Renderer erst beim Aufklappen geladen: er misst die Bühne
// beim Start, eine verborgene Bühne hätte die Größe 0.
export default function Architektur3D() {
  const ref = useRef<HTMLDivElement>(null);

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
    return () => {
      cancelled = true;
      details?.removeEventListener("toggle", onToggle);
      script?.remove();
    };
  }, []);

  return (
    <>
      <link rel="stylesheet" href="/architektur/model3d.css" precedence="default" />
      <div ref={ref} dangerouslySetInnerHTML={{ __html: MARKUP }} />
    </>
  );
}
