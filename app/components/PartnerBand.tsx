// Partner & Netzwerk. Logos nur aus ObsidianVault\Ressourcen\Brand-Assets (unverändert kopiert).
// Ab MARQUEE_AB Partnern läuft das Band als Ticker, darunter steht es still — ein einzelnes
// Logo, das endlos an sich selbst vorbeiläuft, sähe nach Platzhalter aus.
const PARTNERS = [
  // for42: auf dunklem Grund einfarbig weiß (BRAND.md), daher der Filter.
  { name: "FOR42.ai", href: "https://for42.ai", logo: "/partner/for42-wordmark.svg", width: 160, height: 35, invert: true },
];

const MARQUEE_AB = 3;

export default function PartnerBand() {
  const marquee = PARTNERS.length >= MARQUEE_AB;
  const items = marquee ? [...PARTNERS, ...PARTNERS] : PARTNERS;

  return (
    <section style={{ background: "var(--ink-tide)", padding: "40px 32px", borderTop: "1px solid var(--border-1)", borderBottom: "1px solid var(--border-1)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.28em", color: "var(--glow-cyan)", marginBottom: 22 }}>
          Partner &amp; Netzwerk
        </div>
        <div className={marquee ? "nn-marquee" : undefined} style={{ overflow: "hidden" }}>
          <div className={marquee ? "nn-marquee-track" : undefined} style={{ display: "flex", alignItems: "center", justifyContent: marquee ? "flex-start" : "center", gap: 64, width: marquee ? "max-content" : "auto" }}>
            {items.map((p, i) => (
              <a key={`${p.name}-${i}`} href={p.href} target="_blank" rel="noopener" aria-label={p.name} aria-hidden={i >= PARTNERS.length || undefined} tabIndex={i >= PARTNERS.length ? -1 : undefined} style={{ display: "inline-flex", opacity: 0.85 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.logo} alt={p.name} width={p.width} height={p.height} style={{ height: p.height, width: "auto", filter: p.invert ? "brightness(0) invert(1)" : undefined }} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
