// Ganzkoerper-Szene: gepinnte Strecke mit einer Ganzkoerperfigur, die sich beim Scrollen dreht
// (links -> frontal -> rechts, Wechsel per Scan-Band), an Scroll-Punkten zum Exo wird (und zurueck)
// und einzelne Bauteile mit einem Lichtkreis hervorhebt. Mehrfach pro Seite einsetzbar:
// WebGL entsteht erst kurz vor der Sichtbarkeit und wird wieder freigegeben, wenn die Szene weit weg ist.
// Schnittstelle: docs/HERO.md.
import {
  klemme, glatt, mische, bezug, rechteckFigur, rechteckKopf, bildUrl, waehleBreite, webgl2Vorhanden, bewegungReduziert,
} from './layout.js';

const ORD = { links: -1, frontal: 0, rechts: 1 };
const glattIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * @param {HTMLElement} el   <section>, wird zur gepinnten Strecke (Klasse .szene)
 * @param {object} opt
 * @param {object} opt.figuren        Inhalt von figuren.json (Pflicht)
 * @param {string} [opt.szene]        Schluessel unter figuren.szenen, Vorgabe: erste Szene
 * @param {object} [opt.ablauf]       ueberschreibt figuren.szenen[..].ablauf { ansichten, exo, punkte }
 * @param {object} [opt.platz]        ueberschreibt den Platz { desktop:{x,y,hoehe}, mobil:{...} }
 * @param {number} [opt.scrollhoehe]  Laenge der Strecke in Bildschirmhoehen (Vorgabe 4)
 * @param {'portraet'} [opt.start]    'portraet': beginnt mit dem Portraet der Person (aus dem Hero-Satz) und zoomt beim
 *                                    Scrollen auf den Ganzkoerper zurueck; auch als ablauf.start
 * @param {boolean} [opt.spur]        Mausspur legt das Exo frei (Vorgabe true)
 * @param {'eigen'|'extern'} [opt.steuerung]  'extern': Fortschritt kommt ueber api.setFortschritt(p); der Abschnitt wird
 *                                    nicht zur gepinnten Strecke, die Buehne fuellt das Element (Hoehe setzt die Seite)
 * @param {(p:number)=>void} [opt.onFortschritt]
 * @param {(ansicht:string)=>void} [opt.onAnsicht]
 * @param {(z:'mensch'|'exo')=>void} [opt.onZustand]
 * @param {(punkt:object|null)=>void} [opt.onPunkt]   Bauteil im Lichtkreis (Eintrag aus ablauf.punkte)
 */
export function createSzene(el, opt = {}) {
  const cfg = opt.figuren;
  const id = opt.szene || Object.keys(cfg?.szenen || {})[0];
  const S = cfg?.szenen?.[id];
  if (!S) throw new Error(`createSzene: Szene "${id}" fehlt in figuren.json`);
  const B = cfg.buehne || {};
  const pfad = opt.pfad || '/bilder/';
  const ablauf = { ansichten: [], exo: [], punkte: [], ...(S.ablauf || {}), ...(opt.ablauf || {}) };
  const sichten = [...ablauf.ansichten].filter((a) => S.ansichten[a.ansicht]).sort((a, b) => a.bei - b.bei);
  if (!sichten.length) sichten.push({ bei: 0, ansicht: S.ansichten.frontal ? 'frontal' : Object.keys(S.ansichten)[0] });
  const exoListe = [...ablauf.exo].sort((a, b) => a.von - b.von);
  const platz = opt.platz || S.platz;
  // Bahn: Stuetzpunkte { bei, x, y?, hoehe? } - die Figur wandert beim Scrollen ueber die Buehne (weich gedaempft)
  const bahn = [...(ablauf.bahn || [])].sort((a, b) => a.bei - b.bei);
  const blick = ablauf.blick || null;   // 'bewegung' | { x: 0.8 } (Blickziel als Anteil der Buehnenbreite) | leer: ablauf.ansichten
  // Start als Portraet: Bildpaar der Person aus saetze[<ablauf.portraetSatz oder Standardsatz>], Figur mit der Id der
  // Szene (oder ablauf.portraetFigur). Phasen: zoomBis = Ende des Zurueckzoomens, druckVon/druckBis = ein Scan baut den
  // Ganzkoerper vom Scheitel zu den Sohlen auf. Danach gelten ansichten, exo, bahn und punkte wie sonst.
  const startP = (opt.start || ablauf.start) === 'portraet';
  const pFig = startP ? (cfg.saetze?.[ablauf.portraetSatz || cfg.satz]?.figuren || []).find((f) => f.id === (ablauf.portraetFigur || id)) : null;
  const pDef = pFig ? (pFig.ansichten.frontal || Object.values(pFig.ansichten)[0]) : null;
  const PZ = { zoomBis: 0.28, druckVon: 0.08, druckBis: 0.28, ...(ablauf.portraet || {}) };
  const pPlatz = (lay) => ({ y: 0.4, kopf: lay === 'mobil' ? 0.3 : 0.24, ...((ablauf.portraetPlatz || {})[lay] || {}) });
  function platzBei(p, lay) {
    const g = platz[lay];
    if (!bahn.length) return g;
    const wert = (k, n) => k[n] ?? k[lay]?.[n] ?? g[n];
    let a = bahn[0], b = bahn[bahn.length - 1];
    if (p <= a.bei) b = a; else if (p >= b.bei) a = b;
    else for (let i = 0; i < bahn.length - 1; i++) if (p >= bahn[i].bei && p <= bahn[i + 1].bei) { a = bahn[i]; b = bahn[i + 1]; break; }
    const u = b.bei > a.bei ? (p - a.bei) / (b.bei - a.bei) : 0, e = u * u * (3 - 2 * u);
    return { x: mische(wert(a, 'x'), wert(b, 'x'), e), y: mische(wert(a, 'y'), wert(b, 'y'), e), hoehe: mische(wert(a, 'hoehe'), wert(b, 'hoehe'), e) };
  }
  const extern = opt.steuerung === 'extern';
  let pExtern = 0;
  const still = bewegungReduziert() || !webgl2Vorhanden() || opt.still === true;

  el.classList.add('szene');
  el.classList.toggle('szene--extern', extern);
  el.style.setProperty('--szene-scroll', opt.scrollhoehe || ablauf.scrollhoehe || 4);
  if (opt.grund || B.grund) el.style.setProperty('--hero-grund', opt.grund || B.grund);
  const pin = el.querySelector('.szene__pin') || (() => { const d = document.createElement('div'); d.className = 'szene__pin'; el.prepend(d); return d; })();
  const stage = pin.querySelector('.szene__buehne') || (() => { const d = document.createElement('div'); d.className = 'szene__buehne'; pin.prepend(d); return d; })();
  let ki = pin.querySelector('.szene__ki');
  if (!ki) { ki = document.createElement('p'); ki.className = 'szene__ki'; ki.textContent = B.ki || 'KI-generiert'; pin.appendChild(ki); }

  // Standbild (auch waehrend WebGL laedt): Foto der ersten Ansicht, per CSS-Maske freigestellt
  const erste = pDef || S.ansichten[sichten[0].ansicht], bErste = cfg.bilder[erste.foto];   // Standbild: Portraet bzw. erste Ansicht
  const img = document.createElement('img');
  img.className = 'szene__bild';
  img.loading = 'lazy'; img.decoding = 'async';
  img.alt = S.alt || '';
  img.width = bErste.b; img.height = bErste.h;
  img.src = bildUrl(pfad, erste.foto, waehleBreite(bErste, 800));
  img.style.setProperty('--hof', `url("${bildUrl(pfad, erste.foto, 'hof')}")`);
  stage.appendChild(img);

  function messen() {
    const r = stage.getBoundingClientRect();
    const W = Math.max(1, r.width), H = Math.max(1, r.height), mobil = window.matchMedia('(max-width: 991px)').matches;
    return { W, H, mobil, L: bezug(W, H, mobil), lay: mobil ? 'mobil' : 'desktop' };
  }
  function legeBild() {
    const m = messen(), g0 = platzBei(0, m.lay), pp = pPlatz(m.lay);
    const q = pDef ? rechteckKopf(bErste, erste.anker, { x: pp.x ?? g0.x, y: pp.y, kopf: pp.kopf }, m.W, m.H, m.L)
      : rechteckFigur(bErste, erste.anker, g0, m.W, m.H, m.L);
    Object.assign(img.style, { left: q.x + 'px', top: q.y + 'px', width: q.w + 'px', height: q.h + 'px' });
  }
  legeBild();
  const ro = new ResizeObserver(legeBild);
  ro.observe(stage);

  const Z = { p: -1, zeit: 0, ansicht: sichten[0].ansicht, wisch: null, ruhe: 0, zustand: 'mensch', punkt: null, pStaerke: 0, px: 0, py: 0, pr: 1,
    nx: 0, ny: 0, zx: 0, zy: 0, zeigerDa: false, eingabe: -1e9, raf: 0, letzt: 0, sichtbar: false,
    pl: null, vx: 0, blick: sichten[0].ansicht, still: 0 };
  let T = {}, bu = null, fig = null, port = null, saetze = {}, tot = false, laedt = false, generation = 0, kaputt = false;
  // vor dem Standbild-Ausstieg deklariert: dispose() greift darauf zu, auch wenn sie nie angelegt werden
  let ioNah = null, ioFern = null, ioSicht = null, aufZeiger = null;
  let fertig; const bereit = new Promise((ok) => { fertig = ok; });

  const api = {
    el, id, bereit,
    get fortschritt() { return Math.max(0, Z.p); },
    get ansicht() { return Z.ansicht; },
    get zustand() { return Z.zustand; },
    get modus() { return still || kaputt ? 'still' : (bu ? 'gl' : 'ruht'); },
    /** Fortschritt 0..1 von aussen setzen (nur mit steuerung: 'extern'), z. B. aus einem ScrollTrigger. */
    setFortschritt(p) { pExtern = klemme(Number(p) || 0); return api; },
    test(t) { T = t || {}; return api; },
    dispose,
  };

  if (still) {
    el.classList.add('szene--still');
    fertig('still');
    return api;
  }

  aufZeiger = (e) => {
    if (!bu || !Z.sichtbar) return;
    const r = stage.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (y < -40 || y > r.height + 40) return;
    Z.zx = x; Z.zy = y; Z.zeigerDa = true; Z.eingabe = Z.zeit;
    if (opt.spur !== false) bu.zeiger(x, y, e.type === 'pointerdown');
  };
  window.addEventListener('pointermove', aufZeiger, { passive: true });
  window.addEventListener('pointerdown', aufZeiger, { passive: true });

  // nah = WebGL aufbauen, fern = wieder freigeben, sichtbar = zeichnen
  ioNah = new IntersectionObserver((es) => { if (es[es.length - 1].isIntersecting) aktiviere(); }, { rootMargin: '120% 0px' });
  ioFern = new IntersectionObserver((es) => { if (!es[es.length - 1].isIntersecting) ruhe(); }, { rootMargin: '300% 0px' });
  ioSicht = new IntersectionObserver((es) => { Z.sichtbar = es[es.length - 1].isIntersecting; }, { rootMargin: '5% 0px' });
  ioNah.observe(el); ioFern.observe(el); ioSicht.observe(el);

  function fortschritt() {
    if (T.scroll != null) return T.scroll;
    if (extern) return pExtern;
    const r = el.getBoundingClientRect(), H = pin.clientHeight || window.innerHeight, weg = r.height - H;
    return weg > 4 ? klemme(-r.top / weg) : 0;
  }
  const sichtBei = (p) => { let a = sichten[0].ansicht; for (const s of sichten) if (p >= s.bei) a = s.ansicht; return a; };

  async function aktiviere() {
    if (bu || laedt || tot || kaputt) return;
    laedt = true;
    const gen = ++generation;
    let b = null;   // Buehne bis zur Uebergabe an bu; im Fehlerfall hier freigeben
    try {
      const { Buehne } = await import('./buehne.js');
      if (tot || gen !== generation) return;
      // K-CR-02: Kontextverlust (GPU-Neustart, Speicherdruck, mehr als 16 Kontexte) -> zurueck aufs Standbild
      b = new Buehne(stage, { grund: opt.grund || B.grund, kante: opt.kante || B.kante, netz: opt.netz ?? B.netz, signete: opt.signete ?? B.signete, bilder: cfg.bilder, pfad, klasse: 'szene__canvas',
        onVerlust: () => { console.warn('[szene] WebGL-Kontext verloren, Standbild bleibt'); ruhe(); } });
      const m = messen();
      const lade = async (n) => {
        const def = S.ansichten[n], bild = cfg.bilder[def.foto];
        const q = rechteckFigur(bild, def.anker, platzBei(fortschritt(), m.lay), m.W, m.H, m.L);
        saetze[n] = await b.paar(def, q.w * b.dpr, null, n);
      };
      const start = sichtBei(fortschritt());
      await lade(start);
      const sPort = pDef ? await b.paar(pDef, rechteckKopf(cfg.bilder[pDef.foto], pDef.anker, { x: 0.5, ...pPlatz(m.lay) }, m.W, m.H, m.L).w * b.dpr, null, pFig.ansichten.frontal ? 'frontal' : null) : null;
      if (tot || gen !== generation) { b.dispose(); b = null; return; }
      bu = b; b = null;
      fig = bu.neueFigur(10);
      if (sPort) { port = bu.neueFigur(11); port.platz('A', sPort); port.platz('B', sPort); port.mesh.visible = true; }
      fig.platz('A', saetze[start]); fig.platz('B', saetze[start]);
      fig.mesh.visible = true;
      Z.ansicht = start; Z.wisch = null; Z.p = -1; Z.pl = null; Z.blick = start;
      schritt(0.016); bu.zeichne(0.016);
      el.classList.add('szene--gl');
      requestAnimationFrame(() => bu?.canvas.classList.add('ist-da'));
      Z.letzt = performance.now();
      Z.raf = requestAnimationFrame(bild);
      fertig('gl');
      for (const n of Object.keys(S.ansichten)) if (!saetze[n]) lade(n).catch((e) => console.warn('[szene] Bild fehlt:', e?.message || e));
    } catch (err) {
      b?.dispose();
      console.warn('[szene] WebGL-Start abgebrochen, Standbild bleibt:', err?.message || err);
      kaputt = true;
      el.classList.add('szene--still');
      fertig('still');
    } finally { laedt = false; }
  }

  function ruhe() {
    generation++;   // auch ein laufendes Laden verwerfen (aktiviere() prueft die Generation)
    if (!bu) return;
    cancelAnimationFrame(Z.raf);
    bu.dispose(); bu = null; fig = null; port = null; saetze = {};
    el.classList.remove('szene--gl');
  }

  function bild(jetzt) {
    Z.raf = requestAnimationFrame(bild);
    const dt = Math.min(0.05, Math.max(0.001, (jetzt - Z.letzt) / 1000));
    Z.letzt = jetzt;
    if (!bu || !Z.sichtbar || document.hidden) return;
    bu.groesse();
    schritt(dt);
    bu.zeichne(dt);
  }

  function schritt(dt) {
    const W = bu.W, H = bu.H, L = bezug(W, H, bu.mobil), lay = bu.mobil ? 'mobil' : 'desktop';
    const t = (Z.zeit += dt);
    const p = fortschritt();
    const richtung = p >= Z.p ? 1 : -1;
    if (Math.abs(p - Z.p) > 1e-4) { Z.p = p; opt.onFortschritt?.(p); }

    // Platz: Bahn-Stuetzpunkte, weich nachgefuehrt (kein Ruckeln, auch bei Spruengen von aussen)
    const soll = platzBei(p, lay);
    if (!Z.pl || T.scroll != null && T.sofort) Z.pl = { ...soll };
    const kb = 1 - Math.exp(-dt * 5.5), xVor = Z.pl.x;
    Z.pl.x += (soll.x - Z.pl.x) * kb; Z.pl.y += (soll.y - Z.pl.y) * kb; Z.pl.hoehe += (soll.hoehe - Z.pl.hoehe) * kb;
    Z.vx = (Z.pl.x - xVor) / Math.max(dt, 0.001);   // Buehnenbreiten je Sekunde
    const pl = Z.pl;

    // Ansicht: Blickziel, Bewegungsrichtung oder Scroll-Punkt. Wechsel als Scan-Band (Zeit, nicht Scroll)
    let ziel = sichtBei(p);
    if (blick === 'bewegung') {
      if (Math.abs(Z.vx) > 0.012) { Z.blick = Z.vx > 0 ? 'rechts' : 'links'; Z.still = 0; }
      else { Z.still += dt; if (Z.still > 0.7) Z.blick = 'frontal'; }
      ziel = Z.blick;
    } else if (blick && typeof blick === 'object') {
      const d = (blick.x ?? 0.5) - pl.x, an = blick.schwelle ?? 0.1, cur = Z.blick;
      Z.blick = cur === 'frontal' ? (d > an ? 'rechts' : d < -an ? 'links' : 'frontal')
        : cur === 'rechts' ? (d < an * 0.5 ? (d < -an ? 'links' : 'frontal') : 'rechts')
        : (d > -an * 0.5 ? (d > an ? 'rechts' : 'frontal') : 'links');
      ziel = Z.blick;
    }
    if (!S.ansichten[ziel]) ziel = Z.ansicht;
    if (Z.wisch) {
      Z.wisch.t += dt / 0.62;
      if (T.wischHalt != null) Z.wisch.t = Math.min(Z.wisch.t, T.wischHalt);
      if (Z.wisch.t >= 1) { Z.ansicht = Z.wisch.nach; fig.platz('A', saetze[Z.ansicht]); Z.wisch = null; Z.ruhe = t + 0.1; opt.onAnsicht?.(Z.ansicht); }
    } else if (ziel !== Z.ansicht && saetze[ziel] && t > Z.ruhe) {
      Z.wisch = { nach: ziel, t: 0, dir: Math.sign(ORD[ziel] - ORD[Z.ansicht]) || richtung };
      fig.platz('B', saetze[ziel]);
    }
    const dA = saetze[Z.ansicht].def, bA = cfg.bilder[dA.foto];
    let rA = rechteckFigur(bA, dA.anker, pl, W, H, L);
    const figH = rA.h * (dA.anker.unten - dA.anker.oben), figB = figH * 0.42;
    let rB = null;
    if (Z.wisch) {
      const dB = saetze[Z.wisch.nach].def;
      rB = rechteckFigur(cfg.bilder[dB.foto], dB.anker, pl, W, H, L);
      const e = glattIO(klemme(Z.wisch.t)), cx = pl.x * W;
      fig.sicht(cx + Z.wisch.dir * (-1 + 2 * e) * figB * 0.75, Z.wisch.dir, figB * 0.35);
    }
    // Start als Portraet: Kopf wandert vom Portraetplatz zum Kopf der Ganzkoerperfigur, das Ganzkoerperbild zoomt
    // mit (um den Kopf skaliert), ein Scan baut es vom Scheitel zu den Sohlen auf.
    if (port) {
      const z = glatt(klemme(p / PZ.zoomBis)), druck = klemme((p - PZ.druckVon) / (PZ.druckBis - PZ.druckVon));
      const a = dA.anker, PP = pPlatz(lay);
      const k1 = a.b * rA.h, x1 = rA.x + a.x * rA.w, y1 = rA.y + a.y * rA.h;
      const k0 = PP.kopf * L, x0 = (PP.x ?? pl.x) * W, y0 = PP.y * H;
      const K = Math.exp(mische(Math.log(k0), Math.log(k1), z));
      const s = Math.abs(k1 - k0) > 1e-3 ? (K - k0) / (k1 - k0) : z;
      const X = mische(x0, x1, s), Y = mische(y0, y1, s), f = K / k1;
      const um = (r) => ({ x: X + (r.x - x1) * f, y: Y + (r.y - y1) * f, w: r.w * f, h: r.h * f });
      rA = um(rA); if (rB) rB = um(rB);
      // Ist das Portraet ein Ausschnitt genau dieses Ganzkoerperbilds (bilder[..].aus, Quellart "Ausschnitt"), wird der
      // Start zur echten Kamerafahrt im selben Bild: Der Ausschnitt liegt deckungsgleich auf seinem Kasten im
      // Ganzkoerperbild und blendet beim Zurueckzoomen aus (gleiche Pixel, nur schaerfer), kein Scan, kein Kleidungswechsel.
      const kam = cfg.bilder[pDef.foto]?.aus;
      if (kam && kam.bild === dA.foto) {
        const k = kam.kasten;
        port.rechteck({ x: rA.x + k[0] * rA.w, y: rA.y + k[1] * rA.h, w: (k[2] - k[0]) * rA.w, h: (k[3] - k[1]) * rA.h }, null);
        const blende = 1 - glatt(klemme((z - 0.45) / 0.4));
        fig.mesh.visible = true; fig.fenster();
        port.mesh.visible = blende > 0.01; port.fenster();
        port.U.uFade.value = blende;
      } else {
        port.U.uFade.value = 1;
        port.rechteck(rechteckKopf(cfg.bilder[pDef.foto], pDef.anker, { x: X / W, y: Y / H, kopf: K / L }, W, H, L), null);
        if (druck <= 0) { fig.mesh.visible = false; port.mesh.visible = true; port.fenster(); }
        else if (druck >= 1) { port.mesh.visible = false; fig.mesh.visible = true; fig.fenster(); }
        else {
          const yl = rA.y + rA.h * mische(a.oben - 0.03, a.unten + 0.04, glatt(druck));
          port.mesh.visible = fig.mesh.visible = true;
          port.fenster(yl, 1e6); fig.fenster(-1e6, yl);
        }
      }
      port.U.uNeig.value.copy(fig.U.uNeig.value);
    }
    fig.rechteck(rA, rB);

    // Umwandlung: Kante vom Scheitel zu den Sohlen, an den Scroll gekoppelt
    const oben = (rA.y + rA.h * dA.anker.oben) / H - 0.03, unten = (rA.y + rA.h * dA.anker.unten) / H + 0.03;
    let stand = 0, band = null;
    for (const s of exoListe) {
      if (p >= s.bis) { stand = s.zu ? 1 : 0; continue; }
      if (p > s.von) { const k = mische(oben, unten, (p - s.von) / (s.bis - s.von)); band = s.zu ? [-9, k] : [k, 9]; stand = (p - s.von) / (s.bis - s.von) > 0.5 ? (s.zu ? 1 : 0) : (s.zu ? 0 : 1); }
      break;
    }
    if (!band) band = stand ? [-9, 9] : [-9, -9];
    if (T.band) band = T.band;
    fig.band(band[0], band[1]);
    bu.grundMat.uniforms.uExo.value = stand;
    bu.grundMat.uniforms.uMitte.value.set(pl.x, pl.y);
    const zustand = stand ? 'exo' : 'mensch';
    if (zustand !== Z.zustand) { Z.zustand = zustand; opt.onZustand?.(zustand); }

    // Bauteil im Lichtkreis. Koordinaten: Anteil am Bild der gerade gezeigten Ansicht (x, y), r = Anteil der Bildhoehe
    const pk = ablauf.punkte.find((q) => p >= q.von && p < q.bis && (!q.ansicht || q.ansicht === Z.ansicht)) || null;
    if (pk !== Z.punkt) { Z.punkt = pk; opt.onPunkt?.(pk); }
    const k = 1 - Math.exp(-dt * 7);
    if (pk) {
      const zx = rA.x + pk.x * rA.w, zy = rA.y + pk.y * rA.h, zr = (pk.r || 0.06) * rA.h;
      if (Z.pStaerke < 0.02) { Z.px = zx; Z.py = zy; Z.pr = zr; }
      Z.px += (zx - Z.px) * k; Z.py += (zy - Z.py) * k; Z.pr += (zr - Z.pr) * k;
    }
    Z.pStaerke += ((pk ? 1 : 0) - Z.pStaerke) * k;
    fig.punkt(Z.px, Z.py, Z.pr, Z.pStaerke < 0.004 ? 0 : Z.pStaerke);

    // leichte 2,5D-Neigung
    const aktiv = Z.zeigerDa && t - Z.eingabe < 2.5;
    const zx = aktiv ? klemme((Z.zx - W / 2) / (W * 0.5), -1, 1) : Math.sin(t * 0.35) * 0.3;
    const zy = aktiv ? klemme((Z.zy - H / 2) / (H * 0.5), -1, 1) : 0;
    const kk = 1 - Math.exp(-dt * 3.2);
    Z.nx += (zx - Z.nx) * kk; Z.ny += (zy - Z.ny) * kk;
    fig.U.uNeig.value.set(Z.nx * 0.006, Z.ny * 0.003);
  }

  function dispose() {
    if (tot) return;
    tot = true;
    ruhe();
    ioNah?.disconnect(); ioFern?.disconnect(); ioSicht?.disconnect(); ro.disconnect();
    if (aufZeiger) { window.removeEventListener('pointermove', aufZeiger); window.removeEventListener('pointerdown', aufZeiger); }
    img.remove();
  }

  return api;
}
