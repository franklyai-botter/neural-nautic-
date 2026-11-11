"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * KI-Film auf /ueber-mich (11.11.2026, Frank): Unterlagen wirbeln zur Kugel und werden zur
 * KI-Architektur, am Ende das NN-Monogramm (aus Brand-Assets). KI-generiert aus Franks Porträt
 * (Gemini-Standbilder + Veo-Clips). Art. 50 Abs. 4 AI Act: fester Hinweis „KI-generiert“.
 * Stumm, Schleife, nur im Sichtbereich; bei prefers-reduced-motion nur Standbild.
 */
const MQ = "(prefers-reduced-motion: reduce)";
const abonniere = (cb: () => void) => {
  const mq = window.matchMedia(MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function NnFilm() {
  const ruhig = useSyncExternalStore(abonniere, () => window.matchMedia(MQ).matches, () => false);
  const video = useRef<HTMLVideoElement>(null);
  const [sichtbar, setSichtbar] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSichtbar(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [ruhig]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (sichtbar) v.play().catch(() => {});
    else v.pause();
  }, [sichtbar]);

  const stil = { display: "block", width: "100%", aspectRatio: "16 / 9", objectFit: "cover" as const };
  return (
    <figure style={{ position: "relative", margin: 0, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-2)", boxShadow: "var(--shadow-lg)", background: "#061419" }}>
      {ruhig ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/frank-ki/film.webp" alt="KI-generiertes Standbild: Frank Schütt in einer Kugel aus Unterlagen" style={stil} />
      ) : (
        <video ref={video} src="/frank-ki/film.mp4" poster="/frank-ki/film.webp" muted loop playsInline preload="metadata"
          aria-label="KI-generierter Film: Unterlagen wirbeln zu einer Kugel und werden zu einer KI-Architektur" style={stil} />
      )}
      <figcaption style={{ position: "absolute", left: 14, bottom: 14, background: "rgba(6,20,25,.75)", color: "#f5f2eb", fontFamily: "var(--font-inter), sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 3 }}>
        KI-generiert
      </figcaption>
    </figure>
  );
}
