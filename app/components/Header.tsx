"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Leistungen",      href: "/leistungen" },
  { label: "Anwendungsfälle", href: "/use-cases" },
  { label: "Methode",         href: "/methode" },
  { label: "KI Tool Kompass", href: "/ki-tool-kompass" },
  { label: "Wissen",          href: "/wissen" },
  { label: "Über mich",       href: "/ueber-mich" },
];

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
      <header style={{
        position: "sticky", top: 0, zIndex: 20,
        background: scrolled ? "rgba(10,32,40,0.88)" : "rgba(10,32,40,0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(205,206,210,.1)",
        transition: "background 320ms cubic-bezier(.22,.61,.36,1)",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 64 }}>

          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", border: 0, flexShrink: 0 }}>
            <Image src="/logo-star.png" alt="NeuralNautic" width={48} height={48} style={{ objectFit: "contain" }} />
            <span style={{ fontFamily: "var(--font-italiana), serif", fontSize: 20, color: "var(--fg-1)", letterSpacing: ".04em" }}>NeuralNautic</span>
          </Link>

          {/* Desktop nav */}
          <nav className="nn-nav-desktop" style={{ display: "flex", gap: 24, marginLeft: "auto", marginRight: 24 }}>
            {LINKS.map(({ href, label }) => (
              <Link key={href} href={href} style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 12, fontWeight: 500,
                textTransform: "uppercase", letterSpacing: "0.12em",
                color: pathname === href ? "var(--glow-cyan)" : "var(--fg-2)",
                textDecoration: "none",
                borderBottom: pathname === href ? "1px solid var(--glow-cyan)" : "1px solid transparent",
                padding: "4px 0",
                transition: "all 180ms",
                whiteSpace: "nowrap",
              }}>{label}</Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Link href="/kontakt" className="nn-nav-cta-desk" style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 12, fontWeight: 500,
            letterSpacing: "0.08em",
            padding: "9px 20px", borderRadius: 4,
            background: "var(--glow-cyan)", color: "var(--ink-abyss)",
            textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
          }}>KI-Check buchen</Link>

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
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, bottom: 0,
          background: "rgba(10,32,40,0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          zIndex: 19,
          display: "flex", flexDirection: "column",
          overflowY: "auto",
        }}>
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 16, fontWeight: 500,
              textTransform: "uppercase", letterSpacing: "0.1em",
              color: pathname === href ? "var(--glow-cyan)" : "var(--fg-1)",
              textDecoration: "none",
              padding: "18px 24px",
              borderBottom: "1px solid rgba(205,206,210,.07)",
              transition: "color 150ms",
            }}>{label}</Link>
          ))}
          <div style={{ padding: "24px" }}>
            <Link href="/kontakt" style={{
              display: "block",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 14, fontWeight: 500, letterSpacing: "0.08em",
              padding: "15px 24px", borderRadius: 4, textAlign: "center",
              background: "var(--glow-cyan)", color: "var(--ink-abyss)",
              textDecoration: "none",
            }}>KI-Check buchen</Link>
          </div>
        </div>
      )}
    </>
  );
}
