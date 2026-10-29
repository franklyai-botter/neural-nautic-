"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { KI_CHECK_BUCHEN } from "../site";

type NavLink = { label: string; href: string; children?: { label: string; href: string }[] };

const LINKS: NavLink[] = [
  { label: "Leistungen",      href: "/leistungen" },
  // Ganzheitlich: erst das Unternehmen, dann das einzelne Projekt, dann wie gebaut wird.
  { label: "Methode",         href: "/ki-im-unternehmen", children: [
    { label: "Im Unternehmen",  href: "/ki-im-unternehmen" },
    { label: "Im Projekt",      href: "/methode" },
  ] },
  // Kaufen oder bauen: fertige Werkzeuge auswählen oder selbst entwickeln.
  { label: "KI Tool Kompass", href: "/ki-tool-kompass", children: [
    { label: "Werkzeuge auswählen", href: "/ki-tool-kompass" },
    { label: "Selbst entwickeln: AI Engineering", href: "/ai-engineering" },
  ] },
  { label: "Ausguck",         href: "/wissen" },
  { label: "Über mich",       href: "/ueber-mich" },
];

const isActive = (l: NavLink, pathname: string) =>
  pathname === l.href || !!l.children?.some(c => c.href === pathname);

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <header className="nn-kopf-dunkel" style={{
        position: "sticky", top: 0, zIndex: 20,
        background: scrolled ? "rgba(10,32,40,0.94)" : "rgba(10,32,40,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(205,206,210,.1)",
        transition: "background 320ms cubic-bezier(.22,.61,.36,1)",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 64 }}>

          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", border: 0, flexShrink: 0 }}>
            {/* /logo-star.png = Brand-Assets/neuralnautic/nn-stern-2026-10-kompass.png, byte-gleich (seit 27.10.2026).
                Ebenso app/icon.png; app/favicon.ico und app/apple-icon.png aus Brand-Assets/neuralnautic/abgeleitet/. */}
            <Image src="/logo-star.png" alt="NeuralNautic" width={48} height={48} style={{ objectFit: "contain" }} />
            <span style={{ fontFamily: "var(--font-italiana), serif", fontSize: 20, color: "var(--fg-1)", letterSpacing: ".04em" }}>NeuralNautic</span>
          </Link>

          {/* Desktop nav */}
          <nav className="nn-nav-desktop" style={{ display: "flex", gap: 24, marginLeft: "auto", marginRight: 24 }}>
            {LINKS.map((l) => {
              const linkStyle: React.CSSProperties = {
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 12, fontWeight: 500,
                textTransform: "uppercase", letterSpacing: "0.12em",
                color: isActive(l, pathname) ? "var(--glow-cyan)" : "var(--fg-2)",
                textDecoration: "none",
                borderBottom: isActive(l, pathname) ? "1px solid var(--glow-cyan)" : "1px solid transparent",
                padding: "4px 0",
                transition: "all 180ms",
                whiteSpace: "nowrap",
              };
              if (!l.children) return <Link key={l.href} href={l.href} style={linkStyle}>{l.label}</Link>;
              return (
                <div key={l.href} className="nn-nav-group" style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Link href={l.href} style={linkStyle} aria-haspopup="true">
                    {l.label}<span aria-hidden="true" style={{ marginLeft: 6, fontSize: 9 }}>▾</span>
                  </Link>
                  <div className="nn-nav-sub" role="menu" style={{
                    position: "absolute", top: "100%", left: -16, paddingTop: 14, minWidth: 220,
                  }}>
                    <div style={{
                      background: "rgba(10,32,40,0.97)", border: "1px solid var(--border-2)", borderRadius: 6,
                      boxShadow: "var(--shadow-lg)", padding: "8px 0",
                      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                    }}>
                      {l.children.map(c => (
                        <Link key={c.href} href={c.href} role="menuitem" style={{
                          display: "block", padding: "10px 18px",
                          fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 500,
                          textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap",
                          color: pathname === c.href ? "var(--glow-cyan)" : "var(--fg-2)", textDecoration: "none",
                        }}>{c.label}</Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <a href={KI_CHECK_BUCHEN} target="_blank" rel="noopener noreferrer" className="nn-nav-cta-desk" style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 12, fontWeight: 500,
            letterSpacing: "0.08em",
            padding: "9px 20px", borderRadius: 4,
            background: "var(--glow-cyan)", color: "var(--ink-abyss)",
            textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
          }}>KI-Check buchen</a>

          {/* Hamburger */}
          <button
            className="nn-nav-burger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
            style={{
              marginLeft: "auto", background: "none", border: "none",
              color: "var(--fg-1)", cursor: "pointer",
              padding: "8px", borderRadius: 6,
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
            } as React.CSSProperties}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                <path d="M1 1h20M1 8h20M1 15h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>

        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="nn-kopf-dunkel" style={{
          position: "fixed", top: 64, left: 0, right: 0, bottom: 0,
          background: "rgba(10,32,40,0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          zIndex: 19,
          display: "flex", flexDirection: "column",
          overflowY: "auto",
        }}>
          {LINKS.flatMap((l) => {
            if (l.children) {
              return [
                <div key={l.label} style={{
                  fontFamily: "var(--font-inter), sans-serif", fontSize: 16, fontWeight: 500,
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  color: isActive(l, pathname) ? "var(--glow-cyan)" : "var(--fg-1)",
                  padding: "18px 24px 8px",
                }}>{l.label}</div>,
                ...l.children.map(c => (
                  <Link key={c.href} href={c.href} style={{
                    fontFamily: "var(--font-inter), sans-serif", fontSize: 14, fontWeight: 500,
                    textTransform: "uppercase", letterSpacing: "0.1em",
                    color: pathname === c.href ? "var(--glow-cyan)" : "var(--fg-2)",
                    textDecoration: "none", padding: "12px 24px 12px 44px",
                    borderBottom: "1px solid rgba(205,206,210,.07)",
                  }}>{c.label}</Link>
                )),
              ];
            }
            const items = [{ label: l.label, href: l.href, sub: false }];
            return items.map(({ href, label, sub }) => (
              <Link key={href} href={href} style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: sub ? 14 : 16, fontWeight: 500,
                textTransform: "uppercase", letterSpacing: "0.1em",
                color: pathname === href ? "var(--glow-cyan)" : sub ? "var(--fg-2)" : "var(--fg-1)",
                textDecoration: "none",
                padding: sub ? "14px 24px 14px 44px" : "18px 24px",
                borderBottom: "1px solid rgba(205,206,210,.07)",
                transition: "color 150ms",
              }}>{label}</Link>
            ));
          })}
          <div style={{ padding: "24px", paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}>
            <a href={KI_CHECK_BUCHEN} target="_blank" rel="noopener noreferrer" style={{
              display: "block",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 14, fontWeight: 500, letterSpacing: "0.08em",
              padding: "15px 24px", borderRadius: 4, textAlign: "center",
              background: "var(--glow-cyan)", color: "var(--ink-abyss)",
              textDecoration: "none",
            }}>KI-Check buchen</a>
          </div>
        </div>
      )}
    </>
  );
}
