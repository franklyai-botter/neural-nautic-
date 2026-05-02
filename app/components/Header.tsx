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

  return (
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
          <Image src="/logo-monogram.png" alt="NeuralNautic" width={44} height={44} style={{ objectFit: "contain" }} />
          <span style={{ fontFamily: "var(--font-italiana), serif", fontSize: 22, color: "var(--fg-1)", letterSpacing: ".04em" }}>NeuralNautic</span>
        </Link>

        <nav style={{ display: "flex", gap: 24, marginLeft: "auto", marginRight: 24 }}>
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

        <Link href="/kontakt" style={{
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
      </div>
    </header>
  );
}
