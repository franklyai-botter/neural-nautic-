import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PartnerBand from "./components/PartnerBand";
import KiLogoWirbel from "./components/KiLogoWirbel";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { KI_CHECK_BUCHEN } from "./site";

// Kanonische Adresse je Seite, sonst waehlt Google selbst (Search Console: „Vom Nutzer angegebene kanonische URL: Keine“).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Aufbau seit 29.10.2026 (Premium-Analyse im Vault, Projekte/Neural-Nautic-Website-Premium-Analyse-2026-10-29.md):
// 1 Problem mit Zahl + eigene Methode + ein Knopf, 2 Problem, 3 Kurs/Crew/Schiff, 4 drei Wege, 5 wer dahintersteht.
// Ein Hauptweg (KI-Potenzialcheck), keine Etiketten über den Überschriften.

// Zahlen: McKinsey & Company, „The state of AI in 2026: On the road to ROI“, 25.08.2026 (geprüft, siehe /wissen).
const BERUHIGUNG = "30 Minuten per Video, kostenlos und unverbindlich. Danach wissen Sie, wo KI bei Ihnen zuerst wirkt.";

// Gleiche Inhalte wie /ki-im-unternehmen (Kurs, Crew, Schiff), hier in Kurzform.
const METHODE = [
  { name: "Kurs",   fach: "Strategie",               claim: "Wohin, und was lohnt sich?",   desc: "Ziele, Engpässe und Anwendungsfälle werden nach Wirkung bewertet. Ergebnis ist ein Fahrplan, den Geschäftsführung und Fachbereiche mittragen." },
  { name: "Crew",   fach: "Menschen und Befähigung", claim: "Nutzung statt bloßem Wissen.", desc: "Führungskräfte, Multiplikatoren und Teams werden so eingebunden und geschult, dass die neuen Abläufe im Alltag genutzt werden. Der Betriebsrat ist früh an Bord." },
  { name: "Schiff", fach: "KI-Architektur",          claim: "Seetüchtig statt Demo.",       desc: "Systeme, die stabil laufen, sicher sind und sich in Ihre bestehende IT einfügen, mit klarer Verantwortung für den Betrieb." },
];

const WEGE = [
  { titel: "Im Unternehmen", text: "Fahrplan, Befähigung und Architektur für die KI-Einführung im ganzen Betrieb, mit Reifegrad-Check als Einstieg.", href: "/ki-im-unternehmen" },
  { titel: "Im Projekt",     text: "Ein Anwendungsfall von der Potenzialanalyse über einen kontrollierten Pilot bis in den laufenden Betrieb.",      href: "/methode" },
  { titel: "Werkzeuge",      text: "Passende KI-Werkzeuge auswählen oder Lösungen selbst entwickeln lassen, nach Nutzen, Kosten und Datenschutz.",   href: "/ki-tool-kompass" },
];

const ZERTIFIKATE = [
  { src: "/zertifikate/tuev-sued-vorschau.webp", href: "/cert-tuev-sued.pdf", titel: "Zertifikat TÜV SÜD Akademie – AI Strategy & Application Expert (PDF)" },
  { src: "/zertifikate/neurawork-vorschau.webp", href: "https://www.virtualbadge.io/certificate-validator?credential=f2d4fd9a-dccc-4363-ada5-287b0a2b5f01", titel: "Zertifikat Neurawork – KI Applikations- und Strategieexperte (Virtualbadge)" },
];

// Ganze Seite hell wie bei for42.ai (Frank 29.10.2026), Werte aus globals.css. Grund durchsichtig,
// damit das neuronale Netz durchscheint.
const HELL = { grund: "transparent", schrift: "var(--fg-1)", text: "var(--fg-2)", leise: "var(--fg-3)", akzent: "var(--accent)", linie: "var(--border-2)", papier: "var(--ivory)" };

const linkKnopf: CSSProperties = { display: "inline-flex", alignItems: "center", height: 48, boxSizing: "border-box", fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: ".04em", padding: "0 16px", borderRadius: 4, border: `1px solid ${HELL.linie}`, color: HELL.text, textDecoration: "none", whiteSpace: "nowrap" };
const miniatur: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, boxSizing: "border-box", borderRadius: 4, border: `1px solid ${HELL.linie}`, background: HELL.papier, flexShrink: 0 };
const knopfHell: CSSProperties = { display: "inline-block", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: ".06em", padding: "14px 28px", borderRadius: 4, background: HELL.akzent, color: "#ffffff", textDecoration: "none" };

const knopf: CSSProperties = { display: "inline-block", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: ".06em", padding: "14px 28px", borderRadius: 4, background: "var(--glow-cyan)", color: "var(--ink-abyss)", textDecoration: "none" };
const h2: CSSProperties = { fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1.2, color: "var(--fg-1)", margin: "0 0 20px" };
const text: CSSProperties = { fontFamily: "var(--font-inter), sans-serif", fontSize: 16, lineHeight: 1.7, color: "var(--fg-2)" };

export default function Home() {
  return (
    <>
      <Header />
      <main>

        {/* 0 ÜBER DEM EINSTIEG: NN-Stern, um den die Logos der Modellanbieter wirbeln */}
        <section style={{ position: "relative", padding: "72px 0 0" }}>
          <KiLogoWirbel />
          <p style={{ textAlign: "center", fontFamily: "var(--font-inter), sans-serif", fontSize: 12, lineHeight: 1.5, color: HELL.leise, margin: "4px auto 0", maxWidth: "70ch", padding: "0 20px" }}>
            Wir arbeiten anbieterneutral mit den Modellen aller großen Hersteller. Die Logos gehören den jeweiligen Inhabern, eine Partnerschaft besteht nicht.
          </p>
        </section>

        {/* 1 ERSTER BILDSCHIRM: Problem mit Zahl, eigene Methode, ein Knopf, Beleg, echtes Foto */}
        <section style={{ position: "relative", display: "flex", alignItems: "center", overflow: "hidden", padding: "40px 0 72px", background: HELL.grund }}>
          <div className="nn-hero-inner nn-grid-2" style={{ position: "relative", maxWidth: 1240, margin: "0 auto", padding: "0 32px", width: "100%", display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(0, 1fr)", gap: 64, alignItems: "center" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(42px, 5.6vw, 80px)", lineHeight: 1.04, letterSpacing: "-0.01em", color: HELL.schrift, margin: 0 }}>
                Damit KI nicht<br />
                <em style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 400 }}>beim Ausprobieren stehen bleibt.</em>
              </h1>
              <p style={{ ...text, color: HELL.text, fontSize: 18, maxWidth: "54ch", margin: "28px 0 0" }}>
                Acht von zehn Befragten spüren den Nutzen von KI, nur sechs von hundert sehen ihn deutlich im Ergebnis.
                Mit unserer Methode <strong style={{ color: HELL.schrift, fontWeight: 600 }}>Kurs, Crew, Schiff</strong> bringen
                wir KI im Mittelstand dorthin, in Deutschland, Österreich und der Schweiz.
              </p>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, color: HELL.leise, margin: "10px 0 36px" }}>
                Zahlen: McKinsey, The state of AI in 2026, 25.08.2026 · <Link href="/wissen" style={{ color: HELL.leise }}>Einordnung im Ausguck</Link>
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <a href={KI_CHECK_BUCHEN} target="_blank" rel="noopener noreferrer" style={knopfHell}>
                  KI-Potenzialcheck buchen
                </a>
                <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, lineHeight: 1.5, color: HELL.text, maxWidth: "36ch" }}>
                  {BERUHIGUNG}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 32 }}>
                {/* Nur schmal sichtbar: dort fehlt das große Foto rechts */}
                <div className="nn-hero-foto-klein" style={{ position: "relative", width: 72, height: 90, flexShrink: 0, borderRadius: 4, overflow: "hidden", boxShadow: "0 8px 20px rgba(6,20,25,.18)" }}>
                  <Image src="/og/frank-schuett.jpg" alt="Frank Schütt" fill sizes="72px" style={{ objectFit: "cover", objectPosition: "center" }} />
                </div>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, lineHeight: 1.5, color: HELL.leise, margin: 0 }}>
                  Frank Schütt, AI Strategy &amp; Application Expert, geprüft bei der TÜV SÜD Akademie
                </p>
              </div>
              {/* Zwei Link-Knöpfe und dahinter die Zertifikate als gleich große Miniaturen (Ziele wie auf /ueber-mich) */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
                <Link href="/ki-im-unternehmen" style={linkKnopf}>So arbeiten wir: Kurs, Crew, Schiff →</Link>
                <Link href="/ueber-mich#zertifikate" style={linkKnopf}>Zertifikat Z-001124711 →</Link>
                {ZERTIFIKATE.map((z) => (
                  <a key={z.src} href={z.href} target="_blank" rel="noopener noreferrer" title={z.titel} aria-label={z.titel} style={miniatur}>
                    <Image src={z.src} alt="" width={40} height={40} style={{ width: 40, height: 40, objectFit: "contain" }} />
                  </a>
                ))}
              </div>
            </div>
            <div className="nn-hero-foto" style={{ position: "relative", aspectRatio: "4 / 5", borderRadius: 6, overflow: "hidden", boxShadow: "0 20px 50px rgba(6,20,25,.18)" }}>
              <Image src="/og/frank-schuett.jpg" alt="Frank Schütt, NeuralNautic" fill sizes="460px" style={{ objectFit: "cover", objectPosition: "center" }} />
            </div>
          </div>
        </section>

        {/* 2 PROBLEM (vorher Herausforderung und Versprechen getrennt) */}
        <section className="nn-section" style={{ padding: "100px 32px", background: "var(--ink-tide)", borderTop: "1px solid var(--border-1)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <h2 style={h2}>Viele Unternehmen probieren KI aus. Im Betriebsergebnis kommt sie selten an.</h2>
            <p style={{ ...text, margin: 0 }}>
              Der KI-Markt ist laut und unübersichtlich, neue Werkzeuge erscheinen beinahe wöchentlich. Einzelne
              Mitarbeitende arbeiten schneller, aber es fehlt ein Fahrplan, die Befähigung im Team oder eine Technik,
              die im Alltag trägt. Wir führen KI pragmatisch statt panisch ein und sprechen dabei mit Geschäftsführung,
              IT, Fachabteilungen, Datenschutz und Betriebsrat.
            </p>
          </div>
        </section>

        {/* 3 METHODE: Kurs, Crew, Schiff */}
        <section className="nn-section" style={{ padding: "100px 32px", maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ maxWidth: 760, margin: "0 auto 56px", textAlign: "center" }}>
            <h2 style={h2}>KI kommt im Betrieb an, wenn Kurs, Crew und Schiff gleichzeitig stimmen.</h2>
            <p style={{ ...text, margin: 0 }}>Fehlt eines davon, bleibt es beim Experiment. Deshalb planen wir alle drei als ein Vorhaben.</p>
          </div>
          <div className="nn-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {METHODE.map((m) => (
              <div key={m.name} style={{ background: "var(--ink-current)", border: "1px solid var(--border-2)", borderRadius: 6, padding: "36px 32px" }}>
                <h3 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: 34, color: "var(--fg-1)", margin: 0 }}>{m.name}</h3>
                <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "var(--glow-cyan)", margin: "6px 0 18px" }}>{m.fach}</div>
                <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 20, color: "var(--fg-1)", margin: "0 0 12px" }}>{m.claim}</p>
                <p style={{ ...text, fontSize: 14, lineHeight: 1.65, margin: 0 }}>{m.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/ki-im-unternehmen" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, color: "var(--glow-cyan)", textDecoration: "none" }}>
              Methode im Detail, mit Reifegrad-Check und Architektur →
            </Link>
          </div>
        </section>

        {/* 4 DREI WEGE statt acht Leistungskarten (die acht stehen auf /leistungen) */}
        <section className="nn-section" style={{ padding: "100px 32px", background: "var(--ink-tide)" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ maxWidth: 760, margin: "0 auto 56px", textAlign: "center" }}>
              <h2 style={h2}>Wir setzen dort an, wo Sie stehen: im ganzen Unternehmen, in einem Projekt oder bei den Werkzeugen.</h2>
            </div>
            <div className="nn-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {WEGE.map((w) => (
                <Link key={w.titel} href={w.href} style={{ display: "block", background: "var(--ink-current)", border: "1px solid var(--border-2)", borderRadius: 6, padding: "32px 28px", textDecoration: "none" }}>
                  <h3 style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 17, fontWeight: 600, color: "var(--fg-1)", margin: "0 0 12px" }}>{w.titel} →</h3>
                  <p style={{ ...text, fontSize: 14, lineHeight: 1.65, margin: 0 }}>{w.text}</p>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <Link href="/leistungen" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, color: "var(--glow-cyan)", textDecoration: "none" }}>
                Alle Leistungen im Überblick →
              </Link>
            </div>
          </div>
        </section>

        {/* 5 WER DAHINTERSTEHT */}
        <section className="nn-section" style={{ padding: "100px 32px", maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h2 style={h2}>Hinter NeuralNautic stehen geprüfte Kompetenz in Strategie und Umsetzung und ein Netzwerk für größere Vorhaben.</h2>
          <p style={{ ...text, margin: "0 auto 28px", maxWidth: "62ch" }}>
            Frank Schütt ist AI Strategy &amp; Application Expert, geprüft bei der TÜV SÜD Akademie, und
            KI Applikations- und Strategieexperte (Neurawork). Für Vorhaben, die mehr Hände brauchen, arbeiten wir im
            Netzwerk von for42.ai.
          </p>
          <Link href="/ueber-mich" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, fontWeight: 500, color: "var(--glow-cyan)", textDecoration: "none" }}>
            Über mich und die Zertifikate →
          </Link>
        </section>

        <PartnerBand />

        {/* ABSCHLUSS */}
        <section className="nn-section" style={{ padding: "100px 32px", textAlign: "center", background: "var(--ink-abyss)" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <Image src="/logo-monogram.png" alt="" width={80} height={64} style={{ objectFit: "contain", opacity: 0.7, marginBottom: 32, filter: "drop-shadow(0 0 20px rgba(13,115,119,.2))" }} />
            <h2 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.1, color: "var(--fg-1)", margin: "0 0 20px" }}>
              Bereit für den ersten sinnvollen KI-Schritt?
            </h2>
            <p style={{ ...text, margin: "0 0 36px" }}>
              Wir prüfen gemeinsam, wo KI in Ihrem Unternehmen messbar Wert schafft.
            </p>
            <a href={KI_CHECK_BUCHEN} target="_blank" rel="noopener noreferrer" style={{ ...knopf, fontSize: 14, padding: "16px 36px" }}>
              KI-Potenzialcheck buchen
            </a>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--fg-3)", margin: "14px 0 0" }}>
              {BERUHIGUNG}
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
