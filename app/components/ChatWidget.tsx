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
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Track keyboard height via visualViewport (iOS + Android)
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => {
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKeyboardOffset(offset);
    };
    vv.addEventListener("resize", onResize);
    vv.addEventListener("scroll", onResize);
    return () => {
      vv.removeEventListener("resize", onResize);
      vv.removeEventListener("scroll", onResize);
    };
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
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

  const chatWindow: React.CSSProperties = isMobile ? {
    position: "fixed",
    bottom: keyboardOffset + 80,
    left: 0, right: 0,
    zIndex: 60,
    maxHeight: "70dvh",
    background: "var(--ink-deep)",
    border: "1px solid rgba(63,212,224,0.2)",
    borderRadius: "16px 16px 0 0",
    boxShadow: "0 -8px 40px rgba(0,0,0,0.55)",
    display: "flex", flexDirection: "column",
    overflow: "hidden",
    fontFamily: "var(--font-inter), sans-serif",
  } : {
    position: "fixed",
    bottom: 92, left: 28,
    zIndex: 60,
    width: "min(380px, calc(100vw - 40px))",
    background: "var(--ink-deep)",
    border: "1px solid rgba(63,212,224,0.2)",
    borderRadius: 12,
    boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(63,212,224,0.08)",
    display: "flex", flexDirection: "column",
    overflow: "hidden",
    fontFamily: "var(--font-inter), sans-serif",
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? "Chat schließen" : "Chat öffnen"}
        style={{
          position: "fixed",
          bottom: 28,
          left: 28,
          zIndex: 60,
          width: 52, height: 52,
          minWidth: 52, minHeight: 52,
          borderRadius: "50%",
          background: open ? "var(--ink-shoal)" : "var(--glow-cyan)",
          border: "1px solid rgba(205,206,210,0.15)",
          boxShadow: open ? "none" : "0 0 24px rgba(63,212,224,0.45), 0 4px 16px rgba(0,0,0,0.4)",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 280ms cubic-bezier(.22,.61,.36,1)",
          color: open ? "var(--fg-2)" : "var(--ink-abyss)",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        } as React.CSSProperties}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M17 12a2 2 0 01-2 2H5l-3 3V5a2 2 0 012-2h11a2 2 0 012 2v7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={chatWindow}>

          {/* Header */}
          <div style={{
            padding: "14px 18px",
            borderBottom: "1px solid rgba(205,206,210,0.1)",
            background: "var(--ink-tide)",
            display: "flex", alignItems: "center", gap: 10,
            flexShrink: 0,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "var(--glow-cyan)",
              boxShadow: "0 0 6px var(--glow-cyan)",
            }} />
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
                  touchAction: "manipulation", WebkitTapHighlightColor: "transparent",
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
              <p style={{ fontSize: 13, color: "var(--fg-3)", margin: 0 }}>
                Hallo! Ich bin der Assistent von NeuralNautic. Stell mir deine Frage — zu KI, DSGVO, EU AI Act oder Datensicherheit.
              </p>
            )}

            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "85%",
                  padding: "9px 13px",
                  borderRadius: m.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                  background: m.role === "user" ? "rgba(63,212,224,0.15)" : "rgba(255,255,255,0.05)",
                  border: "1px solid",
                  borderColor: m.role === "user" ? "rgba(63,212,224,0.25)" : "rgba(205,206,210,0.08)",
                  fontSize: 13,
                  color: "var(--fg-1)",
                  lineHeight: 1.55,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", gap: 4, padding: "6px 12px" }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 6, height: 6, borderRadius: "50%",
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
            padding: "10px 14px",
            paddingBottom: isMobile ? "max(10px, env(safe-area-inset-bottom))" : "10px",
            borderTop: "1px solid rgba(205,206,210,0.1)",
            display: "flex", gap: 8,
            flexShrink: 0,
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
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(205,206,210,0.12)",
                borderRadius: 8,
                padding: "9px 12px",
                fontSize: 16, // 16px verhindert iOS Auto-Zoom
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
                borderRadius: 8, flexShrink: 0,
                background: input.trim() ? "var(--glow-cyan)" : "rgba(63,212,224,0.15)",
                border: "none",
                cursor: input.trim() ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 180ms",
                color: input.trim() ? "var(--ink-abyss)" : "var(--glow-faint)",
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
              } as React.CSSProperties}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 8H2M14 8l-5-5M14 8l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes nn-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </>
  );
}
