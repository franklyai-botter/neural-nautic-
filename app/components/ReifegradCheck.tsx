"use client";
import Link from "next/link";
import { useState } from "react";

// Reifegrad-Check nach der for42-Reifegrad-Diagnostik (Phase 0 „Fundament & Kompass“,
// for42-Drive: 02_ANGEBOT_LEISTUNG/.../00-reifegrad-diagnostik.md, Stand 25.07.2026).
// Sechs Dimensionen, je 0–3. Stufe aus dem Durchschnitt, gekappt durch die schwächere der
// beiden Querschnittsdimensionen Daten und Governance. Läuft nur im Browser, nichts wird gesendet.

type Dim = { key: string; title: string; quer?: boolean; levels: [string, string, string, string] };

const DIMS: Dim[] = [
  { key: "a", title: "Strategie und Rückendeckung", levels: [
    "Keine KI-Ausrichtung, KI passiert nebenbei in der IT.",
    "Interesse und ein informeller Fürsprecher, aber keine Ziele und kein Budget.",
    "Benannter Verantwortlicher in der Geschäftsführung, Ziele, Budget und Fahrplan.",
    "KI ist Chefsache und im Kerngeschäft verankert, Investitionen werden gesteuert.",
  ] },
  { key: "b", title: "Anwendungsfälle und Nutzen", levels: [
    "Nur Gespräche, kein Anwendungsfall, vielleicht private Nutzung im Verborgenen.",
    "Ein bis zwei Experimente ohne belastbaren Nutzen.",
    "Mindestens ein Anwendungsfall im Betrieb, mit Ausgangswert und gemessenem Nutzen.",
    "Ein Portfolio priorisierter Anwendungsfälle mit laufender Erfolgsmessung.",
  ] },
  { key: "c", title: "Daten und Plattform", quer: true, levels: [
    "Datenlage unklar, keine Übersicht, Insellösungen.",
    "Grobe Übersicht für die ersten Anwendungsfälle, Daten werden von Hand zusammengeführt.",
    "Datenqualität je wichtigem Anwendungsfall dokumentiert, erste wiederverwendbare Datenbestände.",
    "Gepflegte, wiederverwendbare Daten auf einer gemeinsamen Plattform mit Überwachung.",
  ] },
  { key: "d", title: "Menschen, Befähigung und Mitbestimmung", levels: [
    "Keine Schulung, kein Einbezug des Betriebsrats, eher Sorge oder Ablehnung.",
    "Erste Schulungen, einzelne Vorreiter, Betriebsrat informell im Bild.",
    "Breite KI-Kompetenz, Schlüsselrollen besetzt, Betriebsrat früh eingebunden.",
    "KI wird selbstverständlich genutzt, eigenes Team, Rahmenvereinbarung mit dem Betriebsrat.",
  ] },
  { key: "e", title: "Regeln, Datenschutz und EU AI Act", quer: true, levels: [
    "Keine Leitplanken, unklar, welche Werkzeuge und Daten erlaubt sind.",
    "Erste Regeln zu erlaubten Werkzeugen und Daten, EU AI Act ist bekannt.",
    "Je Anwendungsfall Einstufung nach EU AI Act und Datenschutzprüfung, klare Freigaben.",
    "Formale, einheitliche Governance für das ganze Unternehmen, dokumentiert.",
  ] },
  { key: "f", title: "Betrieb und Skalierung", levels: [
    "Kein Betrieb, alles bleibt Projekt oder Einzellösung.",
    "Erste Piloten werden betreut, aber ohne festes Betriebsmodell.",
    "Feste Rollen, Überwachung und Eskalation, erste Anbindung an Kernsysteme.",
    "Unternehmensweiter Betrieb mit zentralem Team und Ansprechpartnern in den Bereichen.",
  ] },
];

const STUFEN = [
  { n: 1, name: "Anlaufen",    schritt: "Ein bis drei Leuchtturm-Anwendungsfälle mit hoher Wirkung und guter Machbarkeit wählen, die Datenlage grob erfassen, einen Verantwortlichen und erste Regeln festlegen. Ziel: ein Nachweis in wenigen Wochen." },
  { n: 2, name: "Begeistern",  schritt: "Aus dem Nachweis eine Bewegung machen: Führung und Belegschaft praktisch einbinden statt mit Folien, KI-Kompetenz aufbauen, den Betriebsrat informieren, Erfolge sichtbar machen." },
  { n: 3, name: "Ausrichten",  schritt: "Bewusst einen Schritt zurück in die Strategie: wenige Anwendungsfälle priorisieren, Daten aufbereiten, Einstufung nach EU AI Act mit klaren Freigaben, Betriebsmodell festlegen." },
  { n: 4, name: "Ausbauen",    schritt: "In die Breite bringen: festes Betriebsmodell mit zentralem Team, Prozesse neu gestalten, durchgängige Erfolgsmessung, Verantwortung im eigenen Haus." },
];

function stufeAus(avg: number) {
  if (avg <= 0.8) return 1;
  if (avg <= 1.6) return 2;
  if (avg <= 2.4) return 3;
  return 4;
}

export default function ReifegradCheck() {
  const [werte, setWerte] = useState<Record<string, number | undefined>>({});
  const alle = DIMS.every(d => werte[d.key] !== undefined);
  const summe = DIMS.reduce((s, d) => s + (werte[d.key] ?? 0), 0);
  const avg = Math.round((summe / DIMS.length) * 10) / 10;
  const vorlaeufig = stufeAus(avg);
  const kappWert = Math.min(werte.c ?? 0, werte.e ?? 0);
  const kappStufe = kappWert + 1;
  const finale = Math.min(vorlaeufig, kappStufe);
  const gekappt = finale < vorlaeufig;
  const stufe = STUFEN[finale - 1];

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {DIMS.map((d, i) => (
          <fieldset key={d.key} style={{ margin: 0, border: "1px solid var(--border-2)", borderRadius: 6, padding: "18px 20px", background: "var(--ink-current)" }}>
            <legend style={{ padding: "0 8px", fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 600, color: "var(--fg-1)" }}>
              <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 11, color: "var(--glow-cyan)", marginRight: 8 }}>{i + 1}/6</span>
              {d.title}
              {d.quer && <span style={{ marginLeft: 8, fontFamily: "var(--font-jetbrains), monospace", fontSize: 10, color: "var(--fg-3)", letterSpacing: ".08em" }}>TRAGFÄHIGKEIT</span>}
            </legend>
            <div className="nn-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {d.levels.map((txt, v) => {
                const an = werte[d.key] === v;
                return (
                  <label key={v} style={{
                    display: "flex", gap: 8, alignItems: "flex-start", cursor: "pointer",
                    border: an ? "1px solid var(--glow-cyan)" : "1px solid var(--border-1)",
                    background: an ? "rgba(63,212,224,.08)" : "var(--ink-abyss)",
                    borderRadius: 4, padding: "10px 12px",
                  }}>
                    <input type="radio" name={`rg-${d.key}`} checked={an} onChange={() => setWerte(w => ({ ...w, [d.key]: v }))}
                      style={{ marginTop: 3, accentColor: "var(--glow-cyan)", flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12.5, color: an ? "var(--fg-1)" : "var(--fg-2)", lineHeight: 1.5 }}>
                      <b style={{ fontFamily: "var(--font-jetbrains), monospace", fontWeight: 500, color: "var(--glow-cyan)", marginRight: 6 }}>{v}</b>{txt}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div aria-live="polite" style={{ marginTop: 24, border: alle ? "1px solid var(--glow-cyan)" : "1px dashed var(--border-2)", borderRadius: 6, padding: "24px 26px", background: alle ? "rgba(63,212,224,.06)" : "transparent" }}>
        {!alle ? (
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-3)", margin: 0 }}>
            Noch {DIMS.filter(d => werte[d.key] === undefined).length} von 6 Dimensionen offen. Das Ergebnis erscheint hier.
          </p>
        ) : (
          <>
            <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--glow-cyan)", marginBottom: 8 }}>
              Ihre Einstiegsstufe · Durchschnitt {avg.toLocaleString("de-DE")}
            </div>
            <div style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 34, color: "var(--fg-1)", lineHeight: 1.1, marginBottom: 12 }}>
              Stufe {stufe.n}: {stufe.name}
            </div>
            {gekappt && (
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13.5, color: "var(--signal-warn)", lineHeight: 1.6, margin: "0 0 12px" }}>
                Nach dem Durchschnitt wäre es Stufe {vorlaeufig}. Daten oder Regeln tragen das aber noch nicht, deshalb Stufe {finale}. Erst diese Grundlage nachziehen, dann den nächsten Schritt gehen.
              </p>
            )}
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14.5, color: "var(--fg-2)", lineHeight: 1.7, margin: "0 0 18px" }}>
              <b style={{ color: "var(--fg-1)" }}>Empfohlener erster Schritt:</b> {stufe.schritt}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/kontakt" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: ".08em", padding: "12px 24px", borderRadius: 4, background: "var(--glow-cyan)", color: "var(--ink-abyss)", textDecoration: "none" }}>
                Ergebnis gemeinsam besprechen
              </Link>
              <button type="button" onClick={() => setWerte({})} style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, padding: "12px 20px", borderRadius: 4, border: "1px solid var(--border-3)", background: "none", color: "var(--fg-1)", cursor: "pointer" }}>
                Neu beginnen
              </button>
            </div>
          </>
        )}
      </div>
      <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, color: "var(--fg-3)", lineHeight: 1.6, marginTop: 14 }}>
        Grundlage: for42-Reifegrad-Diagnostik, angelehnt an etablierte Reifegradmodelle und bewusst auf sechs Dimensionen reduziert. Daten sowie Regeln und Datenschutz begrenzen die Stufe nach oben: Ohne diese Grundlage bleibt jede Skalierung im Pilotstadium. Eine Selbsteinschätzung, kein Audit.
      </p>
    </div>
  );
}
