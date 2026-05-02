"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Leistungen",     href: "/leistungen" },
  { label: "Anwendungsfälle", href: "/use-cases" },
  { label: "Methode",        href: "/methode" },
  { label: "KI Tool Kompass",href: "/ki-tool-kompass" },
  { label: "Wissen",         href: "/wissen" },
  { label: "Über mich",      href: "/ueber-mich" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", height: 64 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", border: 0, flexShrink: 0 }}>
            <Image src="/logo-star.png" alt="NeuralNautic" width={64} height={64} style={{ objectFit: "contain" }} />
            <span style={{ fontFamily: "var(--font-italiana), serif", fontSize: 22, color: "var(--fg-1)", letterSpacing: ".04em" }}>NeuralNautic</span>
          </Link>

          <nav className="header-nav" style={{ display: "flex", gap: 24, marginLeft: "auto", marginRight: 24 }}>
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

          <Link href="/kontakt" className="header-cta" style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 12, fontWeight: 500,
            letterSpacing: "0.08em",
            padding: "9px 20px",
            borderRadius: 4,
            background: "var(--glow-cyan)",
            color: "var(--ink-abyss)",
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}>KI-Check buchen</Link>

          <button
            className="header-burger"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              marginLeft: "auto",
              flexDirection: "column",
              gap: 5,
              flexShrink: 0,
            }}
          >
            <span style={{ display: "block", width: 22, height: 1.5, background: open ? "var(--glow-cyan)" : "var(--fg-1)", transition: "all 220ms", transform: open ? "translateY(6.5px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 1.5, background: "var(--glow-cyan)", transition: "all 220ms", opacity: open ? 0 : 1 }} />
            <span style={{ display: "block", width: 22, height: 1.5, background: open ? "var(--glow-cyan)" : "var(--fg-1)", transition: "all 220ms", transform: open ? "translateY(-6.5px) rotate(-45deg)" : "none" }} />
          </button>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 19,
          background: "rgba(6,20,25,0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          display: "flex",
          flexDirection: "column",
          paddingTop: 64,
          paddingBottom: 40,
          paddingLeft: 32,
          paddingRight: 32,
        }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 32 }}>
            {LINKS.map(({ href, label }) => (
              <Link key={href} href={href} style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 15, fontWeight: 500,
                textTransform: "uppercase", letterSpacing: "0.12em",
                color: pathname === href ? "var(--glow-cyan)" : "var(--fg-2)",
                textDecoration: "none",
                padding: "16px 0",
                borderBottom: "1px solid var(--border-1)",
              }}>{label}</Link>
            ))}
          </nav>
          <Link href="/kontakt" style={{
            marginTop: 32,
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 14, fontWeight: 500,
            letterSpacing: "0.08em",
            padding: "16px 28px",
            borderRadius: 4,
            background: "var(--glow-cyan)",
            color: "var(--ink-abyss)",
            textDecoration: "none",
            textAlign: "center",
          }}>KI-Check buchen</Link>
        </div>
      )}
    </>
  );
}
