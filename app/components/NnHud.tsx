"use client";

import { Fragment, useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Überwachungs-Karte statt Porträt auf /ueber-mich (11.11.2026, Frank).
 * KI-Video (Gemini/Veo aus Franks Porträt) + Analyse-Overlay in NN-Farben (Petrol, Aqua).
 * Gleiche Technik wie die for42-Beraterkarte (for42-website/app/components/BeraterHud.tsx).
 * Art. 50 Abs. 4 AI Act: fester Hinweis „KI-generiert“. Video nur im Sichtbereich,
 * bei prefers-reduced-motion nur Standbild. Styles: .nhud-* in app/globals.css.
 */
type Spur = [number, number, number, number][];
// Gesichtsspur im 4:5-Ausschnitt, gemessen am 11.11.2026: [Sekunde, x %, y %, Rahmenbreite %]
const SPUR: Spur = [[0, 51, 33, 13], [1.5, 59, 33, 13], [3, 51, 34, 14], [4.5, 58, 35, 15], [6.2, 59, 37, 15]];
const SKILLS = [
  { label: "Kern", value: "KI-Architektur" },
  { label: "Methode", value: "Agentic Engineering" },
  { label: "Stack", value: "RAG-Pipelines" },
  { label: "Weg", value: "Bedarf → Workflow" },
];

const MQ = "(prefers-reduced-motion: reduce)";
const abonniere = (cb: () => void) => {
  const mq = window.matchMedia(MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const pad = (n: number) => String(n).padStart(2, "0");
const zeitText = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

function rahmenStil(t: number) {
  let i = SPUR.findIndex((p) => p[0] > t);
  if (i <= 0) i = i === 0 ? 1 : SPUR.length - 1;
  const [t0, x0, y0, s0] = SPUR[i - 1];
  const [t1, x1, y1, s1] = SPUR[i];
  const f = Math.min(1, Math.max(0, (t - t0) / (t1 - t0 || 1)));
  const x = x0 + (x1 - x0) * f, y = y0 + (y1 - y0) * f, s = s0 + (s1 - s0) * f;
  return { left: `${x - s / 2}%`, top: `${y - (s * 0.8) / 2}%`, width: `${s}%` };
}

export default function NnHud() {
  const wurzel = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const gesicht = useRef<HTMLDivElement>(null);
  const [sichtbar, setSichtbar] = useState(false);
  const ruhig = useSyncExternalStore(abonniere, () => window.matchMedia(MQ).matches, () => false);
  const [zeit, setZeit] = useState("");

  useEffect(() => {
    const el = wurzel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSichtbar(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v || ruhig) return;
    if (sichtbar) v.play().catch(() => {});
    else v.pause();
  }, [sichtbar, ruhig]);

  useEffect(() => {
    const v = video.current;
    const g = gesicht.current;
    if (!v || !g || ruhig || !sichtbar) return;
    let id = 0;
    const lauf = () => {
      Object.assign(g.style, rahmenStil(v.currentTime));
      id = requestAnimationFrame(lauf);
    };
    id = requestAnimationFrame(lauf);
    return () => cancelAnimationFrame(id);
  }, [sichtbar, ruhig]);

  useEffect(() => {
    const tick = () => setZeit(zeitText(new Date()));
    const t0 = setTimeout(tick, 0);
    const t = setInterval(tick, 1000);
    return () => {
      clearTimeout(t0);
      clearInterval(t);
    };
  }, []);

  return (
    <div
      ref={wurzel}
      className={`nhud${sichtbar ? " nhud--an" : ""}${ruhig ? " nhud--ruhig" : ""}`}
      role="img"
      aria-label="KI-generiertes Video von Frank Schütt mit Analyse-Overlay"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="nhud-grund" src="/frank-ki/ueberwachung.webp" alt="" />
      {!ruhig && (
        <video ref={video} className="nhud-grund" src="/frank-ki/ueberwachung.mp4" poster="/frank-ki/ueberwachung.webp"
          muted loop playsInline preload="none" aria-hidden="true" />
      )}
      <div className="nhud-ebene" aria-hidden="true">
        <div className="nhud-scan" />
        <div className="nhud-verlauf" />
        <i className="nhud-ecke nhud-ecke--ol" />
        <i className="nhud-ecke nhud-ecke--or" />
        <i className="nhud-ecke nhud-ecke--ul" />
        <i className="nhud-ecke nhud-ecke--ur" />
        <div className="nhud-rahmen" />
        <div ref={gesicht} className="nhud-gesicht" style={rahmenStil(0)}>
          <span>FACE ID: MATCH</span>
        </div>
        <div className="nhud-abgleich">
          <b>PROFIL ABGEGLICHEN</b>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/frank-portrait.webp" alt="" />
          <div className="nhud-daten">
            <div>ID&nbsp;&nbsp;&nbsp;&nbsp;: NN-FS</div>
            <div>STATUS: VERIFIZIERT</div>
            <div>MATCH : 98.6%</div>
          </div>
          <div className="nhud-balken"><i /></div>
        </div>
        {SKILLS.map((s, i) => (
          <Fragment key={s.label}>
            <div className="nhud-verb" style={{ top: `calc(${41 + i * 12.5}% + 2.4cqw)`, animationDelay: `${1.8 + i * 0.35}s` }} />
            <div className="nhud-skill" style={{ top: `${41 + i * 12.5}%`, animationDelay: `${1.95 + i * 0.35}s` }}>
              <small>{s.label.toUpperCase()}</small>
              <em>{s.value}</em>
            </div>
          </Fragment>
        ))}
        <div className="nhud-rec"><i />REC</div>
        <div className="nhud-ki">KI-generiert</div>
        <div className="nhud-zeit">{zeit}</div>
      </div>
    </div>
  );
}
