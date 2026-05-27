'use client'

import { useEffect, useRef } from 'react'

/**
 * Animated neural network background.
 * Drifting nodes + interconnecting lines + occasional signal pulses.
 * Sits on a fixed canvas behind page content (z-0, pointer-events-none).
 */
export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    type Node   = { x: number; y: number; vx: number; vy: number; r: number; pulse: number }
    type Signal = { from: number; to: number; t: number; speed: number }

    const NODE_COUNT = 90
    const MAX_DIST   = 200

    let W = 0
    let H = 0
    let nodes:   Node[]   = []
    let signals: Signal[] = []
    let rafId = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      canvas.width  = Math.floor(W * dpr)
      canvas.height = Math.floor(H * dpr)
      canvas.style.width  = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const initNodes = () => {
      nodes = []
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.55,
          vy: (Math.random() - 0.5) * 0.55,
          r: Math.random() * 2 + 1,
          pulse: Math.random() * Math.PI * 2,
        })
      }
    }

    const spawnSignal = () => {
      if (signals.length > 22) return
      const a = Math.floor(Math.random() * nodes.length)
      const b = Math.floor(Math.random() * nodes.length)
      const dx = nodes[b].x - nodes[a].x
      const dy = nodes[b].y - nodes[a].y
      if (Math.hypot(dx, dy) < MAX_DIST) {
        signals.push({ from: a, to: b, t: 0, speed: 0.014 + Math.random() * 0.014 })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx   = nodes[i].x - nodes[j].x
          const dy   = nodes[i].y - nodes[j].y
          const dist = Math.hypot(dx, dy)
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.25
            ctx.strokeStyle = `rgba(0,200,200,${alpha})`
            ctx.lineWidth   = 0.7
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      signals = signals.filter(s => s.t <= 1)
      for (const sig of signals) {
        const a  = nodes[sig.from]
        const b  = nodes[sig.to]
        const sx = a.x + (b.x - a.x) * sig.t
        const sy = a.y + (b.y - a.y) * sig.t
        ctx.beginPath()
        ctx.arc(sx, sy, 2.8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,255,255,${0.9 * (1 - Math.abs(sig.t - 0.5) * 2)})`
        ctx.fill()
        sig.t += sig.speed
      }

      for (const n of nodes) {
        n.pulse += 0.035
        const glow = 0.5 + 0.4 * Math.sin(n.pulse)
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r + 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,220,220,${glow})`
        ctx.fill()

        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
      }

      if (Math.random() < 0.10) spawnSignal()
      rafId = requestAnimationFrame(draw)
    }

    const onResize = () => {
      resize()
      initNodes()
    }

    resize()
    initNodes()
    rafId = requestAnimationFrame(draw)
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.35, mixBlendMode: 'screen' }}
    />
  )
}
