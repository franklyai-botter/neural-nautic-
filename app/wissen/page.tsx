import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Ausguck: KI-Studien, Recht und Markt eingeordnet | NeuralNautic",
  alternates: { canonical: "/wissen" },
  description: "Studien, Recht und Markt rund um KI, je mit Kernaussage, Quelle und Bedeutung für den Mittelstand.",
  openGraph: { title: "Ausguck: KI eingeordnet für den Mittelstand", description: "Studien, Recht und Markt rund um KI, je mit Kernaussage, Quelle und Bedeutung für Unternehmen.", url: "/wissen" },
};


// Ausguck: kurze, belegte Einordnungen. Jede Zahl mit Quelle; Sekundärquellen als solche kennzeichnen.
const EINORDNUNGEN: { rubrik: string; stand: string; titel: string; befund: string; folge: string; quelle: string; link?: { href: string; text: string } }[] = [
  {
    rubrik: "Studie", stand: "25.08.2026",
    titel: "Acht von zehn spüren den Nutzen von KI, nur sechs von hundert sehen ihn deutlich im Ergebnis",
    befund: "80 % der Befragten berichten, dass KI ihre persönliche Produktivität verbessert hat. Nur 6 % schreiben mindestens 5 % ihres Betriebsergebnisses der KI zu und sehen deutlichen Nutzen, unverändert gegenüber dem Vorjahr. Einen Beitrag zum EBIT überhaupt sehen 37 %.",
    folge: "Am Wissen über KI liegt es selten. Es fehlt meist ein klarer Kurs, eine Crew, die mitzieht, oder ein Schiff, das im Betrieb trägt.",
    quelle: "McKinsey & Company, „The state of AI in 2026: On the road to ROI“, 25.08.2026; Online-Umfrage, 1.719 Teilnehmende in 97 Ländern.",
    link: { href: "/ki-im-unternehmen", text: "Kurs, Crew, Schiff" },
  },
  {
    rubrik: "Recht", stand: "29.10.2026",
    titel: "Die EU-Staaten wollen KI-Training mit personenbezogenen Daten erleichtern",
    befund: "Beim sogenannten Digital Omnibus haben sich die Mitgliedstaaten im Ausschuss der Ständigen Vertreter am 21.10.2026 auf ihr Verhandlungsmandat geeinigt. Danach sollen Unternehmen die Entwicklung und den Betrieb von KI, also auch das Training, auf das berechtigte Interesse stützen können. Ein Widerspruchsrecht bleibt, allerdings nur das allgemeine nach Art. 21 DSGVO; das von der Kommission vorgesehene bedingungslose Widerspruchsrecht hat der Rat gestrichen. Ein fertiges Gesetz ist das nicht: Das Europäische Parlament hat seine Position noch nicht beschlossen, erst danach beginnen die Verhandlungen mit dem Rat.",
    folge: "Für die Auswahl von KI-Anbietern wird wichtiger, wofür sie Ihre Daten verwenden dürfen. Verträge zur Auftragsverarbeitung und eine Modellwahl nach Datenklasse bleiben der sichere Weg.",
    quelle: "Rat der EU, Pressemitteilung vom 21.10.2026, und Verhandlungsmandat, Ratsdokument 14756/26 vom 22.10.2026 (Art. 88 bis DSGVO-E); Europäisches Parlament, Legislative Observatory, Verfahren 2025/0360(COD); abgerufen am 29.10.2026.",
  },
  {
    rubrik: "Recht", stand: "29.10.2026",
    titel: "Der Angemessenheitsbeschluss für die USA gilt weiter, steht aber unter Druck",
    befund: "Übermittlungen an US-Unternehmen, die nach dem EU-US Data Privacy Framework zertifiziert sind, stützen sich auf einen Angemessenheitsbeschluss der EU-Kommission vom 10.07.2023. Seit einem Urteil des US Supreme Court vom 29.06.2026 kann der Präsident Mitglieder der Handelsbehörde FTC jederzeit und ohne Angabe von Gründen abberufen. Der Angemessenheitsbeschluss stützt die Aufsicht über die Unternehmen aber ausdrücklich auf eine unabhängige FTC, deren Mitglieder nur aus wichtigem Grund abberufen werden können. Der Europäische Datenschutzausschuss hat die Kommission am 31.07.2026 gebeten, die Folgen zu prüfen. Unabhängig davon ist beim Gerichtshof der EU ein Rechtsmittel gegen das Urteil des Gerichts vom 03.09.2025 anhängig, das eine Klage gegen den Beschluss abgewiesen hatte (Rs. C-703/25 P).",
    folge: "Wer KI-Dienste aus den USA nutzt, sollte einen Plan B haben: Standardvertragsklauseln mit dokumentierter Prüfung des Übermittlungsrisikos oder Verarbeitung in der EU.",
    quelle: "Durchführungsbeschluss (EU) 2023/1795 der Kommission, Erwägungsgründe 58 bis 60; US Supreme Court, Trump v. Slaughter, No. 25-332, Urteil vom 29.06.2026; Europäischer Datenschutzausschuss, Schreiben vom 31.07.2026; Gerichtshof der EU, Rs. C-703/25 P; abgerufen am 29.10.2026.",
  },
];

export default function Wissen() {
  return (
    <>
      <Header />
      <main>
        <section style={{ position: "relative", padding: "80px 32px 60px", overflow: "hidden", borderBottom: "1px solid var(--border-1)" }}>
          <div style={{ position: "relative", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.24em", color: "var(--glow-cyan)" }}>Ausguck</span>
            <h1 style={{ fontFamily: "var(--font-italiana), serif", fontWeight: 400, fontSize: "clamp(36px, 4.6vw, 64px)", lineHeight: 1.08, color: "var(--fg-1)", margin: "20px 0 20px" }}>
              Was am Horizont auftaucht, eingeordnet für den Mittelstand
            </h1>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 17, color: "var(--fg-2)", lineHeight: 1.7, maxWidth: "58ch", margin: "0 auto" }}>
              Studien, Recht und Markt rund um KI: je eine Kernaussage, die Quelle und was es für Ihr Unternehmen heißt. Kurz, belegt und ohne Hype.
            </p>
          </div>
        </section>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 32px" }}>
          <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 400, fontSize: 36, color: "var(--fg-1)", margin: "0 0 32px" }}>Aktuelle Einordnungen</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {EINORDNUNGEN.map(e => (
              <article key={e.titel} style={{ background: "var(--ink-current)", border: "1px solid var(--border-2)", borderRadius: 6, padding: "26px 28px" }}>
                <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--glow-cyan)", marginBottom: 10 }}>{e.rubrik} · Stand {e.stand}</div>
                <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 400, fontSize: 28, color: "var(--fg-1)", lineHeight: 1.2, margin: "0 0 12px" }}>{e.titel}</h3>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, color: "var(--fg-2)", lineHeight: 1.7, margin: "0 0 14px" }}>{e.befund}</p>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, color: "var(--fg-1)", lineHeight: 1.7, margin: "0 0 14px" }}>
                  <b style={{ color: "var(--glow-cyan)", fontWeight: 600 }}>Was heißt das für Sie? </b>{e.folge}
                  {e.link && <> <Link href={e.link.href}>{e.link.text} →</Link></>}
                </p>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, color: "var(--fg-3)", lineHeight: 1.6, margin: 0 }}>Quelle: {e.quelle}</p>
              </article>
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
