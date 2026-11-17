// Buehne: gemeinsamer WebGL-Unterbau fuer Bildpaar-Hero (hero.js) und Ganzkoerper-Szene (szene.js).
// Ein Canvas, ein Hintergrund, eine Mausspur, beliebig viele Figuren-Rechtecke mit je zwei Plaetzen.
// Wird von hero.js/szene.js erst bei Bedarf per import() geladen (three steckt nur in diesem Chunk).
import {
  WebGLRenderer, Scene, OrthographicCamera, PlaneGeometry, ShaderMaterial, Mesh, TextureLoader,
  WebGLRenderTarget, Vector2, Vector3, Vector4, Color, LinearFilter, NoColorSpace, ClampToEdgeWrapping,
  DoubleSide, LinearSRGBColorSpace, CanvasTexture, LinearMipmapLinearFilter,
} from 'three';
import { QUAD_VERT, SPUR_FRAG, GRUND_FRAG, FIGUR_VERT, FIGUR_FRAG } from './shader.js';
import { bildUrl, waehleBreite } from './layout.js';
import { createNetz, netzFarbe } from '../netz/netz.js';

const rgbV = (s) => { const [r, g, b] = netzFarbe(s).split(',').map(Number); return new Vector3(r / 255, g / 255, b / 255); };
function netzTextur(canvas) {
  const t = new CanvasTexture(canvas);
  t.colorSpace = NoColorSpace; t.flipY = false; t.minFilter = LinearFilter; t.magFilter = LinearFilter; t.generateMipmaps = false;
  return t;
}

const farbe = (hex) => { const c = new Color(hex); return new Vector3(c.r, c.g, c.b); };
// Color rechnet sRGB -> linear; die Shader arbeiten direkt mit Dateiwerten, also zurueck nach sRGB
const farbeRoh = (hex) => { const c = new Color(hex).convertLinearToSRGB(); return new Vector3(c.r, c.g, c.b); };
const FERN = 1e6;

export class Buehne {
  /**
   * @param {HTMLElement} host   Behaelter fuer das Canvas (position: absolute/relative, feste Groesse)
   * @param {{grund?:string, kante?:string, linien?:boolean, pfad?:string, bilder:object, klasse?:string, onVerlust?:()=>void}} opt
   */
  constructor(host, opt) {
    this.host = host;
    this.opt = opt;
    this.bilder = opt.bilder;
    this.pfad = opt.pfad || '/bilder/';
    const r = this.renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
    r.outputColorSpace = LinearSRGBColorSpace; // keine Umrechnung, Farben bleiben wie in der Datei
    this.grund = farbeRoh(opt.grund || '#061419');
    this.kante = farbeRoh(opt.kante || '#6feff5');
    r.setClearColor(new Color().setRGB(this.grund.x, this.grund.y, this.grund.z, LinearSRGBColorSpace), 1);
    const c = this.canvas = r.domElement;
    c.className = opt.klasse || 'hero__canvas';
    c.setAttribute('aria-hidden', 'true');
    this.verloren = false;
    // Kontextverlust: nicht mehr zeichnen und den Besitzer informieren (opt.onVerlust), damit er aufs Standbild
    // zurueckfaellt. Ausserhalb des Ereignisses melden, der Besitzer gibt die Buehne dabei frei.
    this._verlust = (e) => {
      e.preventDefault();
      if (this.verloren) return;
      this.verloren = true;
      if (opt.onVerlust) setTimeout(() => opt.onVerlust(), 0);
    };
    c.addEventListener('webglcontextlost', this._verlust);

    this.loader = new TextureLoader();
    this.texturen = new Map();   // url -> Promise<Texture>
    this.W = 1; this.H = 1; this.dpr = 1; this.mobil = false;
    this.zeit = 0;

    // Mausspur (Ping-Pong)
    const rtOpt = { minFilter: LinearFilter, magFilter: LinearFilter, depthBuffer: false };
    this.rtA = new WebGLRenderTarget(256, 256, rtOpt);
    this.rtB = new WebGLRenderTarget(256, 256, rtOpt);
    this.quadCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quadGeo = new PlaneGeometry(2, 2);
    this.spurMat = new ShaderMaterial({
      vertexShader: QUAD_VERT, fragmentShader: SPUR_FRAG, depthTest: false, depthWrite: false,
      uniforms: { tPrev: { value: null }, uA: { value: new Vector2(-9, -9) }, uB: { value: new Vector2(-9, -9) },
        uStrength: { value: 0 }, uDecay: { value: 0.95 }, uAspect: { value: 1 }, uTime: { value: 0 }, uRadius: { value: 0.085 } },
    });
    this.spurSzene = new Scene();
    this.spurSzene.add(new Mesh(this.quadGeo, this.spurMat));
    this.ptr = new Vector2(-9, -9); this.ptrVor = new Vector2(-9, -9); this.ptrNeu = false;
    this.spurStark = 0;

    // Hauptszene, Kamera in Buehnen-Pixeln (y nach unten)
    this.szene = new Scene();
    this.kamera = new OrthographicCamera(0, 1, 0, 1, -10, 10);
    this.grundMat = new ShaderMaterial({
      vertexShader: QUAD_VERT, fragmentShader: GRUND_FRAG, depthTest: false, depthWrite: false,
      uniforms: { uTime: { value: 0 }, uAspect: { value: 1 }, uNetzAn: { value: 0 }, uExo: { value: 0 }, tNetz: { value: null },
        uNetzFarbe: { value: new Vector3(1, 1, 1) },
        tTrail: { value: null }, uMitte: { value: new Vector2(0.5, 0.5) }, uGrund: { value: this.grund }, uKante: { value: this.kante } },
    });
    const bg = new Mesh(this.quadGeo, this.grundMat);
    bg.frustumCulled = false; bg.renderOrder = -100;
    this.szene.add(bg);
    this.figGeo = new PlaneGeometry(1, 1);
    this.figuren = [];
    host.appendChild(c);
    // Netz im Visier: ein kleines, gemeinsames Netz (weiss, Farbe kommt je Exo-Bild im Shader), Takt der Buehne
    this.visierNetz = createNetz(null, { offscreen: true, takt: 'extern', farbe: '255,255,255', deckkraft: 1, flaeche: { b: 560, h: 560 }, dichte: 1.8, aufloesung: 1.0, seed: 42 });
    this.tVNetz = netzTextur(this.visierNetz.canvas);
    // Signete im Visier (buehne.signete in figuren.json): Atlas aus den Originaldateien, drei Zellen
    this.sig = { liste: [], tex: null, N: { value: 0 }, lage: { value: [new Vector4(), new Vector4(), new Vector4()] },
      mass: { value: [new Vector2(0.1, 1), new Vector2(0.1, 1), new Vector2(0.1, 1)] }, t: { value: null } };
    if (opt.signete?.length) this.ladeSignete(opt.signete.slice(0, 3));
    this.groesse();
  }

  groesse() {
    const r = this.host.getBoundingClientRect();
    const W = Math.max(1, Math.round(r.width)), H = Math.max(1, Math.round(r.height));
    this.mobil = window.matchMedia('(max-width: 991px)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, this.mobil ? 1.5 : 1.75);
    if (W === this.W && H === this.H && dpr === this.dpr) return false;
    this.W = W; this.H = H; this.dpr = dpr;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(W, H, false);
    Object.assign(this.kamera, { left: 0, right: W, top: 0, bottom: H });
    this.kamera.updateProjectionMatrix();
    this.grundMat.uniforms.uAspect.value = W / H;
    this.spurMat.uniforms.uAspect.value = W / H;
    this.spurMat.uniforms.uRadius.value = this.mobil ? 0.075 : 0.07;
    // Netz im Hintergrund: Flaeche = Buehne, Aufloesung hoechstens so fein wie noetig
    const n = this.opt.netz;
    if (n) {
      const aufl = Math.min(dpr, 1600 / W, 1.5);
      if (!this.netz) {
        this.netz = createNetz(null, { offscreen: true, takt: 'extern', farbe: '255,255,255', deckkraft: n.deckkraft ?? 0.75, dichte: n.dichte ?? 1, seed: n.seed ?? 7, flaeche: { b: W, h: H }, aufloesung: aufl });
        this.tNetz = netzTextur(this.netz.canvas);
        Object.assign(this.grundMat.uniforms, { tNetz: { value: this.tNetz }, uNetzAn: { value: 1 }, uNetzFarbe: { value: rgbV(n.farbe) } });
      } else {
        this.netz.groesse(W, H);
        this.tNetz.dispose(); this.tNetz = netzTextur(this.netz.canvas); this.grundMat.uniforms.tNetz.value = this.tNetz;
      }
    }
    for (const f of this.figuren) f.U.uStage.value.set(W, H);
    return true;
  }

  async ladeSignete(liste) {
    const bilder = await Promise.all(liste.map((s) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = s.datei; })));
    if (this.verloren || !this.sig) return;
    const Z = 256, cv = document.createElement('canvas');
    cv.width = Z * 3; cv.height = Z;
    const cx = cv.getContext('2d');
    cx.imageSmoothingQuality = 'high';
    const gut = [];
    bilder.forEach((im, i) => {
      if (!im) return;
      // durchsichtigen Rand der Datei abschneiden (das Signet selbst bleibt unveraendert), dann in Stufen
      // verkleinern, damit die feinen Chromkanten nicht ausfransen
      let q = document.createElement('canvas');
      q.width = im.naturalWidth; q.height = im.naturalHeight;
      let qx = q.getContext('2d', { willReadFrequently: true });
      qx.drawImage(im, 0, 0);
      const d = qx.getImageData(0, 0, q.width, q.height).data;
      let x0 = q.width, y0 = q.height, x1 = 0, y1 = 0;
      for (let y = 0; y < q.height; y += 2) for (let x = 0; x < q.width; x += 2) {
        if (d[(y * q.width + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      }
      if (x1 <= x0 || y1 <= y0) { x0 = 0; y0 = 0; x1 = q.width - 1; y1 = q.height - 1; }
      let sw = x1 - x0 + 2, sh = y1 - y0 + 2, sx = x0, sy = y0;
      while (sw > Z * 2 || sh > Z * 2) {
        const n = document.createElement('canvas');
        n.width = Math.ceil(sw / 2); n.height = Math.ceil(sh / 2);
        const nx = n.getContext('2d'); nx.imageSmoothingQuality = 'high';
        nx.drawImage(q, sx, sy, sw, sh, 0, 0, n.width, n.height);
        q = n; sx = 0; sy = 0; sw = n.width; sh = n.height;
      }
      const k = gut.length;
      cx.drawImage(q, sx, sy, sw, sh, k * Z, 0, Z, Z);   // Zelle voll gefuellt; das Seitenverhaeltnis stellt der Shader exakt wieder her
      this.sig.mass.value[k].set(liste[i].hoehe ?? 0.1, (x1 - x0 + 2) / (y1 - y0 + 2));
      gut.push(liste[i]);
    });
    this.sig.liste = gut;
    this.sig.tex = netzTextur(cv);
    this.sig.tex.generateMipmaps = true; this.sig.tex.minFilter = LinearMipmapLinearFilter; this.sig.tex.needsUpdate = true;
    this.sig.t.value = this.sig.tex;
    this.sig.N.value = gut.length;
  }

  textur(url) {
    if (!this.texturen.has(url)) {
      this.texturen.set(url, new Promise((ok, fail) => this.loader.load(url, (t) => {
        t.colorSpace = NoColorSpace; t.flipY = false;
        t.minFilter = LinearFilter; t.magFilter = LinearFilter; t.generateMipmaps = false;
        t.wrapS = t.wrapT = ClampToEdgeWrapping;
        ok(t);
      }, undefined, () => fail(new Error('Bild fehlt: ' + url)))));
    }
    return this.texturen.get(url);
  }

  /** Laedt ein Bildpaar (Foto, Exo, beide Tiefenkarten). pxBreite = gewuenschte Texturbreite des Fotos.
   *  ansicht: Name der Ansicht; nur 'frontal' wird links ueber den Bildrand gespiegelt (shader.js, texSp). */
  async paar(def, pxBreite, fotoUrl, ansicht) {
    const bf = this.bilder[def.foto], be = this.bilder[def.exo];
    const wf = waehleBreite(bf, pxBreite), we = waehleBreite(be, pxBreite * (be.b / be.h) / (bf.b / bf.h) * (def.ausrichtung?.skala || 1));
    const [foto, tiefe, exo, exoTiefe] = await Promise.all([
      this.textur(fotoUrl || bildUrl(this.pfad, def.foto, wf)), this.textur(bildUrl(this.pfad, def.foto, 'tiefe')),
      this.textur(bildUrl(this.pfad, def.exo, we)), this.textur(bildUrl(this.pfad, def.exo, 'tiefe')),
    ]);
    const a = def.ausrichtung || { dx: 0, dy: 0, skala: 1, drehung: 0 };
    const v = be.visier;
    const visier = v ? await this.textur(bildUrl(this.pfad, def.exo, 'visier')).catch(() => null) : null;
    return {
      def, foto, tiefe, exo, exoTiefe, visier, spiegel: ansicht === 'frontal' ? 1 : 0,
      vis: v ? new Vector4(v.x, v.y, v.rx, v.ry) : null, visM: v ? new Vector2(v.mx ?? v.x, v.my ?? v.y) : null, visHoehe: v ? 2 * v.ry * a.skala : 0, visBreite: v ? 2 * v.rx * (be.b / be.h) * a.skala : 0,
      licht: rgbV(be.licht || '120,200,255'),
      exoV: new Vector4(a.dx, a.dy, a.skala, (a.drehung || 0) * Math.PI / 180),
      asp: new Vector2(bf.b / bf.h, be.b / be.h),
      grundF: farbeRoh(bf.grund), grundE: farbeRoh(be.grund),
    };
  }

  neueFigur(ebene = 0) {
    const f = new Figur(this, ebene);
    this.figuren.push(f);
    this.szene.add(f.mesh);
    return f;
  }

  /** Zeiger in Buehnen-Pixeln. stark = Spur ohne Verbindung zum letzten Punkt beginnen. */
  zeiger(x, y, neuAnsetzen) {
    const u = x / this.W, v = y / this.H;
    if (this.ptrVor.x < -1 || neuAnsetzen) this.ptrVor.set(u, v);
    this.ptr.set(u, v); this.ptrNeu = true;
  }

  /** Spur direkt setzen (Tests): Strecke von a nach b mit fester Staerke. */
  stempel(ax, ay, bx, by, staerke = 0.5) {
    this.ptrVor.set(ax / this.W, ay / this.H); this.ptr.set(bx / this.W, by / this.H);
    this.ptrNeu = true; this.spurFest = staerke;
  }

  zeichne(dt) {
    if (this.verloren) return;
    this.zeit += dt;
    const t = this.zeit, r = this.renderer, sm = this.spurMat.uniforms;
    sm.tPrev.value = this.rtA.texture;
    sm.uTime.value = t;
    sm.uDecay.value = Math.exp(-dt / 0.40);
    if (this.ptrNeu) {
      const sp = this.ptr.distanceTo(this.ptrVor) / Math.max(dt, 0.008); // Buehnenbreiten pro Sekunde
      sm.uA.value.copy(this.ptrVor); sm.uB.value.copy(this.ptr);
      sm.uStrength.value = this.spurFest ?? Math.min(0.55, Math.max(0, sp - 0.10) * 0.45);
      this.spurFest = undefined;
      this.ptrVor.copy(this.ptr); this.ptrNeu = false;
    } else sm.uStrength.value = 0;
    r.setRenderTarget(this.rtB); r.render(this.spurSzene, this.quadCam); r.setRenderTarget(null);
    [this.rtA, this.rtB] = [this.rtB, this.rtA];
    // Signete: ruhige Ellipsenbahn, aufrecht; Tiefe nur ueber gleichmaessige Groesse und Deckkraft (0,85 bis 1)
    this.sig.liste.forEach((s, i) => {
      const b = s.bahn || {};
      const w = 2 * Math.PI * ((t / (b.dauer || 11)) * (b.richtung || 1) + (b.phase || 0));
      const tiefe = Math.sin(w);
      this.sig.lage.value[i].set((b.mx || 0) + (b.rx ?? 0.4) * Math.cos(w), (b.my || 0) + (b.ry ?? 0.25) * Math.sin(w), 1 + 0.13 * tiefe, 0.925 + 0.075 * tiefe);
    });
    // ein gemeinsamer Takt: beide Netze ruecken mit jedem Bild der Buehne einen Schritt weiter
    if (this.netz) { this.netz.schritt(); this.tNetz.needsUpdate = true; }
    if (this.figuren.some((f) => f.mesh.visible && (f.U.uVisAnA.value > 0 || f.U.uVisAnB.value > 0))) { this.visierNetz.schritt(); this.tVNetz.needsUpdate = true; }
    const g = this.grundMat.uniforms;
    g.tTrail.value = this.rtA.texture; g.uTime.value = t;
    for (const f of this.figuren) { f.U.tTrail.value = this.rtA.texture; f.U.uTime.value = t; }
    r.render(this.szene, this.kamera);
  }

  dispose() {
    this.canvas.removeEventListener('webglcontextlost', this._verlust);
    for (const p of this.texturen.values()) p.then((t) => t.dispose(), () => {});
    this.texturen.clear();
    for (const f of this.figuren) f.mat.dispose();
    this.figuren.length = 0;
    this.spurMat.dispose(); this.grundMat.dispose(); this.quadGeo.dispose(); this.figGeo.dispose();
    this.rtA.dispose(); this.rtB.dispose();
    this.sig.tex?.dispose(); this.sig.liste = [];
    this.netz?.dispose(); this.tNetz?.dispose(); this.visierNetz.dispose(); this.tVNetz.dispose();
    this.renderer.dispose();
    if (!this.verloren) try { this.renderer.forceContextLoss(); } catch { /* schon weg */ }
    this.canvas.remove();
  }
}

/** Ein Rechteck mit zwei Plaetzen (A = aktuelle Ansicht, B = kommende Ansicht waehrend des Scan-Wechsels). */
export class Figur {
  constructor(buehne, ebene) {
    this.b = buehne;
    const V4 = () => new Vector4(0, 0, 1, 1);
    this.U = {
      tFotoA: { value: null }, tTiefeA: { value: null }, tExoA: { value: null }, tExoTiefeA: { value: null },
      tFotoB: { value: null }, tTiefeB: { value: null }, tExoB: { value: null }, tExoTiefeB: { value: null },
      tTrail: { value: null }, tVisierA: { value: null }, tVisierB: { value: null }, tVNetz: { value: buehne.tVNetz },
      uVisA: { value: new Vector4(0.5, 0.5, 1, 1) }, uVisB: { value: new Vector4(0.5, 0.5, 1, 1) },
      tSig: buehne.sig.t, uSig: buehne.sig.lage, uSigMass: buehne.sig.mass, uSigN: buehne.sig.N, uSigAnA: { value: 0 }, uSigAnB: { value: 0 }, uSpA: { value: 0 }, uSpB: { value: 0 },
      uVisMA: { value: new Vector2(0.5, 0.5) }, uVisMB: { value: new Vector2(0.5, 0.5) },
      uLichtA: { value: new Vector3(0.5, 0.8, 1) }, uLichtB: { value: new Vector3(0.5, 0.8, 1) }, uVisAnA: { value: 0 }, uVisAnB: { value: 0 },
      uRectA: { value: V4() }, uRectB: { value: V4() }, uExoA: { value: new Vector4(0, 0, 1, 0) }, uExoB: { value: new Vector4(0, 0, 1, 0) },
      uAspA: { value: new Vector2(1, 1) }, uAspB: { value: new Vector2(1, 1) },
      uGrundFA: { value: buehne.grund }, uGrundEA: { value: buehne.grund }, uGrundFB: { value: buehne.grund }, uGrundEB: { value: buehne.grund },
      uGrund: { value: buehne.grund }, uKante: { value: buehne.kante },
      uStage: { value: new Vector2(buehne.W, buehne.H) }, uBand: { value: new Vector2(-9, -9) },
      uFenster: { value: new Vector2(-FERN, FERN) }, uNeig: { value: new Vector2(0, 0) }, uMitte: buehne.grundMat.uniforms.uMitte,
      uTime: { value: 0 }, uSpur: { value: 1 }, uForce: { value: 0 }, uFade: { value: 1 }, uB: { value: 0 },
      uSichtX: { value: 0 }, uSichtDir: { value: 1 }, uSichtW: { value: 100 }, uPunkt: { value: new Vector4(0, 0, 1, 0) },
    };
    this.mat = new ShaderMaterial({
      vertexShader: FIGUR_VERT, fragmentShader: FIGUR_FRAG, uniforms: this.U,
      transparent: true, depthTest: false, depthWrite: false, side: DoubleSide,
    });
    this.mesh = new Mesh(buehne.figGeo, this.mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = ebene;
    this.mesh.visible = false;
    this.rA = { x: 0, y: 0, w: 1, h: 1 }; this.rB = null;
  }

  /** Bildpaar auf Platz 'A' oder 'B' legen. */
  platz(k, satz) {
    const U = this.U;
    U['tFoto' + k].value = satz.foto; U['tTiefe' + k].value = satz.tiefe;
    U['tExo' + k].value = satz.exo; U['tExoTiefe' + k].value = satz.exoTiefe;
    U['uExo' + k].value = satz.exoV; U['uAsp' + k].value = satz.asp;
    U['uGrundF' + k].value = satz.grundF; U['uGrundE' + k].value = satz.grundE;
    U['tVisier' + k].value = satz.visier; U['uLicht' + k].value = satz.licht; U['uSp' + k].value = satz.spiegel || 0;
    if (satz.vis) { U['uVis' + k].value = satz.vis; U['uVisM' + k].value = satz.visM; }
    if (k === 'A') this.satzA = satz; else this.satzB = satz;
  }

  /** Rechtecke in Buehnen-Pixeln setzen; rB = null, wenn kein Wechsel laeuft. */
  rechteck(rA, rB) {
    const U = this.U, W = this.b.W, H = this.b.H;
    U.uRectA.value.set(rA.x, rA.y, rA.w, rA.h);
    // Links Platz fuer die gespiegelte Fortsetzung der Figur (shader.js, texSp): die Quellbilder schneiden die linke
    // Schulter am Bildrand ab, die Flaeche muss deshalb ueber das Foto hinausreichen (Frank, 14.11.2026)
    const LINKS = 0.15;
    let x0 = rA.x - rA.w * LINKS, y0 = rA.y, x1 = rA.x + rA.w, y1 = rA.y + rA.h;
    if (rB) {
      U.uRectB.value.set(rB.x, rB.y, rB.w, rB.h);
      x0 = Math.min(x0, rB.x - rB.w * LINKS); y0 = Math.min(y0, rB.y); x1 = Math.max(x1, rB.x + rB.w); y1 = Math.max(y1, rB.y + rB.h);
    }
    U.uB.value = rB ? 1 : 0;
    // Netz im Visier nur, wenn das Visier gross genug dargestellt wird (sonst Flimmern statt Netz)
    const an = (s, r) => (s && s.visier && s.vis ? Math.min(1, Math.max(0, (s.visBreite * r.h - 56) / 40)) : 0);
    U.uVisAnA.value = an(this.satzA, rA); U.uVisAnB.value = rB ? an(this.satzB, rB) : 0;
    // Signete nur, wenn das kleinste mindestens 18 px hoch auf dem Bildschirm steht (sonst weglassen)
    const sg = this.b.sig, klein = sg.liste.length ? Math.min(...sg.liste.map((s) => s.hoehe ?? 0.1)) * 0.87 : 0;
    const sAn = (s, r) => (klein && s && s.visier && s.vis && klein * s.visHoehe * r.h >= 18 ? 1 : 0);
    U.uSigAnA.value = sAn(this.satzA, rA); U.uSigAnB.value = rB ? sAn(this.satzB, rB) : 0;
    // etwas Rand fuer den Lichtkreis, auf die Buehne begrenzt
    x0 = Math.max(0, x0 - 40); y0 = Math.max(0, y0 - 40); x1 = Math.min(W, x1 + 40); y1 = Math.min(H, y1 + 40);
    const w = Math.max(1, x1 - x0), h = Math.max(1, y1 - y0);
    this.mesh.position.set(x0 + w / 2, y0 + h / 2, 0);
    this.mesh.scale.set(w, h, 1);
  }

  band(y0, y1) { this.U.uBand.value.set(y0, y1); }
  fenster(y0 = -FERN, y1 = FERN) { this.U.uFenster.value.set(y0, y1); }
  sicht(x, dir, kopfBreite) { this.U.uSichtX.value = x; this.U.uSichtDir.value = dir; this.U.uSichtW.value = kopfBreite; }
  punkt(x, y, r, staerke) { this.U.uPunkt.value.set(x, y, r, staerke); }
}

export { farbe };
