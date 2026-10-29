// Partner & Netzwerk. Logos nur aus ObsidianVault\Ressourcen\Brand-Assets (unverändert kopiert).
// Laufband von links nach rechts. Die Partnerliste wird so oft wiederholt, dass eine Hälfte
// breiter ist als jeder Bildschirm; die zweite Hälfte ist die Kopie für die nahtlose Schleife.
type Partner = { name: string; href: string; logo: string; width: number; height: number; hellerGrund?: boolean };

const PARTNERS: Partner[] = [
  // for42 im Original aus Brand-Assets/for42/for42-wordmark.svg (Ink + Steel): seit dem hellen Look
  // (29.10.2026) steht das Band auf Weiß. Die eingefärbte for42-wordmark-nn.svg war für dunklen Grund.
  { name: "FOR42.ai", href: "https://for42.ai", logo: "/partner/for42-wordmark.svg", width: 169, height: 32 },
  // spring.gate unverändert aus Brand-Assets/springgate/springgate-logo.png (252×72, Standard laut BRAND.md).
  // Die Datei hat einen weißen, nicht transparenten Grund; BRAND.md kennt keine helle Variante.
  // Deshalb steht das Logo auf einer weißen Fläche, die diesen Grund fortsetzt — keine Umfärbung.
  { name: "spring.gate", href: "https://funnel.springgate-ai.de", logo: "/partner/springgate-logo.png", width: 140, height: 40, hellerGrund: true },
  // Karlson unverändert aus Brand-Assets/karlson/karlson-logo.png (400×400, = karlson-website public/karlson/logo.png).
  // Kein echter Alpha-Kanal, sehr blasses Schachbrett im Grund — deshalb wie spring.gate auf weißer Fläche.
  { name: "Karlson – One-Man-Band", href: "https://karlson-solo-orchester.de", logo: "/partner/karlson-logo.png", width: 52, height: 52, hellerGrund: true },
];

const PRO_HAELFTE = 8;

export default function PartnerBand() {
  const runden = Math.ceil(PRO_HAELFTE / PARTNERS.length);
  const haelfte = Array.from({ length: runden }, () => PARTNERS).flat();
  const items = [...haelfte, ...haelfte];

  return (
    <section style={{ padding: "40px 0" }}>
      <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.28em", color: "var(--glow-cyan)", marginBottom: 22, textAlign: "center" }}>
        Partner &amp; Netzwerk
      </div>
      <div className="nn-marquee">
        <div className="nn-marquee-track">
          {items.map((p, i) => {
            const kopie = i >= PARTNERS.length;
            return (
              <a key={`${p.name}-${i}`} href={p.href} target="_blank" rel="noopener" aria-label={p.name} aria-hidden={kopie || undefined} tabIndex={kopie ? -1 : undefined} style={{ display: "inline-flex", padding: "0 48px" }}>
                <span style={p.hellerGrund ? { display: "inline-flex", background: "#fff", borderRadius: 4, padding: "4px 10px" } : { display: "inline-flex" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.logo} alt={kopie ? "" : p.name} width={p.width} height={p.height} style={{ height: p.height, width: "auto" }} />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
