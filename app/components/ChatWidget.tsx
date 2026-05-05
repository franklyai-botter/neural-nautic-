"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [vvHeight, setVvHeight] = useState(0);
  const [vvTop, setVvTop] = useState(0);
  const [safeAreaBottom, setSafeAreaBottom] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // visualViewport tracken — einzige zuverlässige Methode auf iOS Safari
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) {
      setVvHeight(window.innerHeight);
      return;
    }
    const update = () => {
      setVvHeight(vv.height);
      setVvTop(vv.offsetTop);
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  // safe-area-inset-bottom per CSS-Probe messen (kann nicht direkt in JS gelesen werden)
  useEffect(() => {
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:fixed;bottom:0;height:env(safe-area-inset-bottom,0px);pointer-events:none;visibility:hidden";
    document.body.appendChild(probe);
    setSafeAreaBottom(probe.offsetHeight);
    document.body.removeChild(probe);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, [messages, open]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.message || data.error || "Fehler beim Laden der Antwort." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Verbindungsfehler. Bitte versuche es erneut." }]);
    }
    setLoading(false);
  }

  // Button: rechts unten, respektiert iOS Home-Indicator
  const btnBottom = "max(20px, calc(20px + env(safe-area-inset-bottom)))";
  const btnRight = 20;
  const btnSize = 60;
  const bubbleH = 76; // Sprechblasen-Button-Höhe (inkl. Schwanz)

  // Mobile: Chat-Position über dem Button
  const btnTopFromVVBottom = bubbleH + 20 + safeAreaBottom; // 76 + 20 + safe-area
  const chatHeight = isMobile && vvHeight > 0
    ? Math.max(100, Math.min(vvHeight - btnTopFromVVBottom - 8, 480))
    : 0;
  const chatTop = isMobile && vvHeight > 0
    ? vvTop + vvHeight - btnTopFromVVBottom - 8 - chatHeight
    : 0;

  const chatWindow: React.CSSProperties = isMobile && vvHeight > 0 ? {
    position: "fixed",
    top: chatTop,
    left: 0, right: 0,
    height: chatHeight,
    zIndex: 60,
    background: "var(--ink-deep)",
    border: "1px solid rgba(63,212,224,0.18)",
    borderRadius: "20px 20px 0 0",
    boxShadow: "0 -12px 48px rgba(0,0,0,0.6)",
    display: "flex", flexDirection: "column",
    overflow: "hidden",
    fontFamily: "var(--font-inter), sans-serif",
    animation: "nn-slide-up 240ms cubic-bezier(.22,.61,.36,1) both",
  } : {
    position: "fixed",
    bottom: 116,
    right: btnRight,
    zIndex: 60,
    width: "min(380px, calc(100vw - 40px))",
    maxHeight: "calc(100vh - 140px)",
    background: "var(--ink-deep)",
    border: "1px solid rgba(63,212,224,0.2)",
    borderRadius: 16,
    boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(63,212,224,0.08)",
    display: "flex", flexDirection: "column",
    overflow: "hidden",
    fontFamily: "var(--font-inter), sans-serif",
    animation: "nn-slide-up 240ms cubic-bezier(.22,.61,.36,1) both",
  };

  return (
    <>
      {/* Toggle Button — rechts unten */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? "Chat schließen" : "Chat öffnen"}
        style={{
          position: "fixed",
          bottom: btnBottom,
          right: btnRight,
          zIndex: 61,
          width: open ? btnSize : 64,
          height: open ? btnSize : 76,
          minWidth: open ? btnSize : 64,
          minHeight: open ? btnSize : 76,
          borderRadius: open ? "50%" : 0,
          background: open ? "rgba(11,31,38,0.95)" : "transparent",
          border: open ? "1px solid rgba(63,212,224,0.22)" : "none",
          boxShadow: open ? "0 2px 16px rgba(0,0,0,0.4)" : "none",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 280ms cubic-bezier(.22,.61,.36,1), border-radius 280ms cubic-bezier(.22,.61,.36,1)",
          color: "var(--fg-2)",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
          padding: 0,
        } as React.CSSProperties}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <div style={{ position: "relative", width: 64, height: 76, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Sprechblasen-Form als SVG */}
            <svg
              style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 0 18px rgba(63,212,224,0.4)) drop-shadow(0 4px 24px rgba(0,0,0,0.55))" }}
              width="64" height="76" viewBox="0 0 64 76" fill="none"
            >
              <path
                d="M14 0H50Q64 0 64 14V50Q64 64 50 64H40L32 76L24 64H14Q0 64 0 50V14Q0 0 14 0Z"
                fill="rgba(6,20,26,0.94)"
                stroke="rgba(63,212,224,0.28)"
                strokeWidth="1.5"
              />
            </svg>
            {/* Kompassrose — leicht nach oben versetzt damit sie im Blasen-Body zentriert wirkt */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-star.png"
              alt=""
              width={36}
              height={36}
              style={{
                position: "relative",
                objectFit: "contain",
                filter: "drop-shadow(0 0 8px rgba(63,212,224,0.45))",
                marginTop: -6,
              }}
            />
          </div>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={chatWindow}>

          {/* Drag Handle (nur Mobile) */}
          {isMobile && (
            <div style={{
              display: "flex", justifyContent: "center",
              padding: "10px 0 4px",
              flexShrink: 0,
            }}>
              <div style={{
                width: 36, height: 4, borderRadius: 2,
                background: "rgba(205,206,210,0.25)",
              }} />
            </div>
          )}

          {/* Header */}
          <div style={{
            padding: isMobile ? "10px 18px 12px" : "14px 18px",
            borderBottom: "1px solid rgba(205,206,210,0.1)",
            background: "var(--ink-tide)",
            display: "flex", alignItems: "center", gap: 10,
            flexShrink: 0,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-star.png"
              alt=""
              width={48}
              height={48}
              style={{ objectFit: "contain", filter: "drop-shadow(0 0 6px rgba(63,212,224,0.5))", flexShrink: 0 }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-1)", letterSpacing: ".03em" }}>
              NeuralNautic Assistent
            </span>
            <span style={{ fontSize: 11, color: "var(--fg-4)", marginLeft: "auto" }}>
              DSGVO · EU AI Act
            </span>
          </div>

          {/* DSGVO-Hinweis */}
          {notice && (
            <div style={{
              margin: "12px 14px 0",
              padding: "10px 12px",
              background: "rgba(63,212,224,0.06)",
              border: "1px solid rgba(63,212,224,0.15)",
              borderRadius: 8,
              fontSize: 11,
              color: "var(--fg-3)",
              lineHeight: 1.5,
              flexShrink: 0,
            }}>
              Deine Fragen werden anonym verarbeitet, nicht gespeichert und nicht für KI-Training genutzt.
              Anbieter: Mistral AI (Frankreich, EU). Mehr in der{" "}
              <Link href="/datenschutz" style={{ color: "var(--glow-cyan)" }}>Datenschutzerklärung</Link>.{" "}
              <button
                onClick={() => setNotice(false)}
                style={{
                  background: "none", border: "none", color: "var(--glow-cyan)",
                  cursor: "pointer", fontSize: 11, padding: 0,
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                } as React.CSSProperties}
              >OK</button>
            </div>
          )}

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "14px",
            display: "flex", flexDirection: "column", gap: 10,
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
            minHeight: 120,
          } as React.CSSProperties}>
            {messages.length === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <p style={{ fontSize: 14, color: "var(--fg-3)", margin: 0, lineHeight: 1.6 }}>
                  Hallo! Stell mir deine Frage zu KI, DSGVO, EU AI Act oder Datensicherheit.
                </p>
                {/* Horizontale Vorschläge-Chips */}
                <div style={{ position: "relative" }}>
                  <div
                    className="nn-chips-scroll"
                    style={{
                      display: "flex",
                      gap: 8,
                      overflowX: "auto",
                      scrollbarWidth: "none",
                      paddingBottom: 2,
                      WebkitOverflowScrolling: "touch",
                    } as React.CSSProperties}
                  >
                    {[
                      "Was kostet eine KI-Beratung?",
                      "Wie läuft ein Potenzialcheck ab?",
                      "Ist das DSGVO-konform?",
                      "Welche Workflows gibt es?",
                      "Was ist der EU AI Act?",
                      "Wie sicher sind meine Daten?",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        style={{
                          flexShrink: 0,
                          background: "rgba(63,212,224,0.06)",
                          border: "1px solid rgba(63,212,224,0.18)",
                          borderRadius: 20,
                          padding: "7px 14px",
                          fontSize: 12,
                          color: "var(--fg-2)",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          fontFamily: "inherit",
                          touchAction: "manipulation",
                          WebkitTapHighlightColor: "transparent",
                          transition: "background 160ms, border-color 160ms",
                        } as React.CSSProperties}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(63,212,224,0.13)";
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(63,212,224,0.4)";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(63,212,224,0.06)";
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(63,212,224,0.18)";
                        }}
                      >{q}</button>
                    ))}
                  </div>
                  {/* Fade-Hinweis dass mehr Chips vorhanden */}
                  <div style={{
                    position: "absolute",
                    right: 0, top: 0, bottom: 2,
                    width: 36,
                    background: "linear-gradient(to right, transparent, var(--ink-deep))",
                    pointerEvents: "none",
                  }} />
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "85%",
                  padding: "10px 14px",
                  borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: m.role === "user" ? "rgba(63,212,224,0.15)" : "rgba(255,255,255,0.05)",
                  border: "1px solid",
                  borderColor: m.role === "user" ? "rgba(63,212,224,0.25)" : "rgba(205,206,210,0.08)",
                  fontSize: 14,
                  color: "var(--fg-1)",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", gap: 5, padding: "8px 14px" }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: "var(--glow-cyan)",
                    animation: `nn-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 14px",
            paddingBottom: isMobile ? "max(14px, env(safe-area-inset-bottom))" : "12px",
            borderTop: "1px solid rgba(205,206,210,0.1)",
            display: "flex", gap: 10,
            flexShrink: 0,
            background: "var(--ink-deep)",
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send(input))}
              placeholder="Deine Frage…"
              maxLength={2000}
              disabled={loading}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(205,206,210,0.15)",
                borderRadius: 10,
                padding: "11px 14px",
                fontSize: 16,
                color: "var(--fg-1)",
                outline: "none",
                fontFamily: "inherit",
                minHeight: 44,
              }}
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              style={{
                width: 44, height: 44,
                minWidth: 44, minHeight: 44,
                borderRadius: 10, flexShrink: 0,
                background: input.trim() ? "var(--glow-cyan)" : "rgba(63,212,224,0.12)",
                border: "none",
                cursor: input.trim() ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 180ms",
                color: input.trim() ? "var(--ink-abyss)" : "var(--glow-faint)",
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
                alignSelf: "flex-end",
              } as React.CSSProperties}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M16 9H2M16 9l-6-6M16 9l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes nn-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes nn-slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nn-chips-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
