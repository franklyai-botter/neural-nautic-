// Neuronales Netz als Canvas-Hintergrund. Algorithmus und Parameter eins zu eins portiert aus
// for42-website/app/components/NeuralBackground.tsx (dort React, hier Vanilla JS):
// driftende Knoten (ein Knoten je 14.400 px², min. 28, max. 90), Linien bis MAX_DIST = 200 px mit
// lineWidth 0.7 und Alpha (1 - d/MAX_DIST) * 0.2, Knoten Radius rnd*2+1 (+0.5) mit Alpha
// 0.22 + 0.18*sin(pulse), Signale Radius 2.8 mit Alpha 0.75*(1 - |t-0.5|*2), Canvas-Deckkraft 0.75.
// Nichts daran ist neu erfunden; dazugekommen sind nur Optionen (Farbe, Flaeche, Seed, Offscreen, Takt).
//
// import { createNetz } from '@kern/netz/netz.js';
// const netz = createNetz(document.querySelector('.grund'), { farbe: '33,80,137' });   // for42 auf Weiss
// netz.dispose();

const AREA_PER_NODE = (1440 * 900) / 90;
const MIN_NODES = 28;
const MAX_NODES = 90;
const MAX_DIST = 200;

/** Farbe als "r,g,b": nimmt "33,80,137", "#215089" oder [33,80,137]. */
export function netzFarbe(f) {
  if (Array.isArray(f)) return f.join(',');
  if (typeof f === 'string' && f[0] === '#') {
    const h = f.length === 4 ? f.slice(1).split('').map((c) => c + c).join('') : f.slice(1);
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(',');
  }
  return f || '33,80,137';
}

// kleiner, schneller Zufallsgenerator (mulberry32), damit ein Seed immer dasselbe Netz ergibt
function zufall(seed) {
  if (seed == null) return Math.random;
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * @param {HTMLElement|null} ziel  Behaelter (Canvas wird absolut hineingelegt); null mit offscreen: true
 * @param {object} [opt]
 * @param {string|number[]} [opt.farbe]     "r,g,b", "#rrggbb" oder [r,g,b]. Vorgabe Steel 33,80,137
 * @param {{b:number,h:number}} [opt.flaeche]  feste Flaeche in px (Pflicht bei offscreen), sonst Groesse von ziel
 * @param {number} [opt.deckkraft]          Vorgabe 0.75 (wie das Original: Deckkraft des Canvas)
 * @param {number} [opt.dichte]             Dichtefaktor, 1 = ein Knoten je 14.400 px²
 * @param {number} [opt.seed]               geseedeter Zufall (gleiches Netz bei jedem Laden)
 * @param {boolean} [opt.offscreen]         kein DOM: liefert netz.canvas zur Nutzung als Textur
 * @param {number} [opt.aufloesung]         Pixel je Flaechen-px; Vorgabe min(devicePixelRatio, 2), offscreen 1
 * @param {'eigen'|'extern'} [opt.takt]     'extern': kein eigener requestAnimationFrame, der Aufrufer ruft netz.schritt()
 * @param {number} [opt.zIndex]
 */
export function createNetz(ziel, opt = {}) {
  const offscreen = !!opt.offscreen || !ziel;
  const farbe = netzFarbe(opt.farbe);
  const dichte = opt.dichte ?? 1;
  const rnd = zufall(opt.seed);
  const reduziert = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const deck = opt.deckkraft ?? 0.75;
  if (!offscreen) {
    canvas.setAttribute('aria-hidden', 'true');
    canvas.className = 'netz';
    Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', opacity: String(deck) });
    if (opt.zIndex != null) canvas.style.zIndex = String(opt.zIndex);
    ziel.appendChild(canvas);
  }

  let W = 0, H = 0, nodes = [], signals = [], rafId = 0, laeuft = false, sichtbar = true, tot = false;

  const nodeCount = () => Math.max(MIN_NODES, Math.min(MAX_NODES, Math.round(((W * H) / AREA_PER_NODE) * dichte)));

  function resize(b, h) {
    const dpr = opt.aufloesung ?? (offscreen ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    if (b == null) {
      if (opt.flaeche) { b = opt.flaeche.b; h = opt.flaeche.h; } else { const r = ziel.getBoundingClientRect(); b = r.width; h = r.height; }
    }
    W = Math.max(1, b); H = Math.max(1, h);
    canvas.width = Math.max(1, Math.floor(W * dpr));
    canvas.height = Math.max(1, Math.floor(H * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initNodes() {
    nodes = []; signals = [];
    const count = nodeCount();
    for (let i = 0; i < count; i++) {
      nodes.push({ x: rnd() * W, y: rnd() * H, vx: (rnd() - 0.5) * 0.55, vy: (rnd() - 0.5) * 0.55, r: rnd() * 2 + 1, pulse: rnd() * Math.PI * 2 });
    }
  }

  function spawnSignal() {
    if (signals.length > Math.max(6, Math.round(nodes.length * (22 / 90)))) return;
    const a = Math.floor(rnd() * nodes.length), b = Math.floor(rnd() * nodes.length);
    if (Math.hypot(nodes[b].x - nodes[a].x, nodes[b].y - nodes[a].y) < MAX_DIST) {
      signals.push({ from: a, to: b, t: 0, speed: 0.014 + rnd() * 0.014 });
    }
  }

  /** Ein Bild zeichnen und das Netz einen Schritt weiterbewegen (wie draw() im Original). */
  function schritt(bewegen = true) {
    // offscreen: die Canvas-Deckkraft des Originals wird in die Zeichnung gerechnet
    ctx.globalAlpha = offscreen ? deck : 1;
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (dist < MAX_DIST) {
          ctx.strokeStyle = `rgba(${farbe},${(1 - dist / MAX_DIST) * 0.2})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
        }
      }
    }
    signals = signals.filter((s) => s.t <= 1);
    for (const sig of signals) {
      const a = nodes[sig.from], b = nodes[sig.to];
      ctx.beginPath();
      ctx.arc(a.x + (b.x - a.x) * sig.t, a.y + (b.y - a.y) * sig.t, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${farbe},${0.75 * (1 - Math.abs(sig.t - 0.5) * 2)})`;
      ctx.fill();
      if (bewegen) sig.t += sig.speed;
    }
    for (const n of nodes) {
      if (bewegen) n.pulse += 0.035;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${farbe},${0.22 + 0.18 * Math.sin(n.pulse)})`;
      ctx.fill();
      if (bewegen) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }
    }
    if (bewegen && rnd() < 0.1) spawnSignal();
  }

  function draw() {
    rafId = requestAnimationFrame(draw);
    if (sichtbar && !document.hidden) schritt(true);
  }

  const api = {
    canvas,
    get breite() { return W; },
    get hoehe() { return H; },
    get knoten() { return nodes.length; },
    schritt: () => { if (!tot) schritt(!reduziert); },
    start() { if (laeuft || tot || reduziert || opt.takt === 'extern') return; laeuft = true; rafId = requestAnimationFrame(draw); },
    stop() { laeuft = false; cancelAnimationFrame(rafId); },
    /** Flaeche neu setzen (legt die Knoten neu aus, wie beim Resize im Original). */
    groesse(b, h) { resize(b, h); initNodes(); schritt(false); },
    dispose() { tot = true; api.stop(); io?.disconnect(); ro?.disconnect(); canvas.remove(); },
  };

  resize();
  initNodes();
  schritt(false); // Standbild; bei Reduced Motion bleibt es dabei

  let io = null, ro = null;
  if (!offscreen) {
    io = new IntersectionObserver((es) => { sichtbar = es[es.length - 1].isIntersecting; }); // Pause ausserhalb des Sichtfelds
    io.observe(canvas);
    let erst = true;
    ro = new ResizeObserver(() => { if (erst) { erst = false; return; } if (!opt.flaeche) api.groesse(); });
    ro.observe(ziel);
  }
  api.start();
  return api;
}
