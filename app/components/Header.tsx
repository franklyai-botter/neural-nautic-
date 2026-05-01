"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "./atoms";

const LINKS = [
  { id: "atelier",    label: "Atelier" },
  { id: "collection", label: "Collection" },
  { id: "journal",    label: "Log" },
];

export default function Header({ current, onNav }: { current: string; onNav: (id: string) => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 20,
      background: scrolled ? "rgba(10,32,40,0.78)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(205,206,210,.1)" : "1px solid transparent",
      transition: "all 320ms cubic-bezier(.22,.61,.36,1)",
    }}>
      <div style={{
        maxWidth: 1240, margin: "0 auto",
        padding: "20px 48px",
        display: "flex", alignItems: "center", gap: 32,
      }}>
        <button onClick={() => onNav("atelier")} style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: 0, cursor: "pointer", padding: 0 }}>
          <Image src="/logo-star.png" alt="Neural Nautic" width={32} height={32} style={{ objectFit: "contain" }} />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontFamily: "var(--font-italiana), Italiana, serif", fontSize: 18, color: "var(--fg-1)", letterSpacing: ".04em" }}>Neural Nautic</span>
            <span style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 9, color: "var(--fg-3)", letterSpacing: ".28em", textTransform: "uppercase", marginTop: 2 }}>Atelier · est. MMXXV</span>
          </div>
        </button>

        <nav style={{ display: "flex", gap: 28, marginLeft: "auto" }}>
          {LINKS.map(({ id, label }) => (
            <button key={id} onClick={() => onNav(id)} style={{
              background: "none", border: 0, cursor: "pointer",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 11, fontWeight: 500,
              textTransform: "uppercase", letterSpacing: "0.22em",
              color: current === id ? "var(--glow-cyan)" : "var(--fg-2)",
              padding: "8px 0",
              borderBottom: current === id ? "1px solid var(--glow-cyan)" : "1px solid transparent",
              transition: "all 180ms",
            }}>{label}</button>
          ))}
        </nav>

        <Button variant="secondary">Sign in</Button>
      </div>
    </header>
  );
}
