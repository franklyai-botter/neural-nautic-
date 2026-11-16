// Bildpaar-Hero: echtes Foto zuerst, darunter das Exoskelett.
// Mausspur legt das Exo frei, im Leerlauf laeuft ein Scan-Band, drei Ansichten wechseln per Scan-Band in
// Mausrichtung, beim Scrollen (gepinnt) wird aus dem Portraet der Ganzkoerper und die Umwandlung laeuft
// vom Kopf zu den Fuessen. 1 bis 3 Figuren in einem Canvas. Alles kommt aus figuren.json.
// Schnittstelle und Markup: docs/HERO.md. Kein Import von motion.js; Lenis wird nur optional uebergeben.
import {
  istMobil, klemme, glatt, mische, bezug, rechteckKopf, bildUrl, waehleBreite, waehleSatz,
  webgl2Vorhanden, bewegungReduziert,
} from './layout.js';

const ORD = { links: -1, frontal: 0, rechts: 1 };
const FERN = 1e6;
// Scroll-Phasen (Anteil am gepinnten Weg)
// zoomBis = Ende des Zurueckzoomens, druckVon/druckBis = Aufbau der Ganzkoerperfigur, umVon/umBis = Exo-Kante
// drehVon/drehBis = Drehung der Ganzkoerperfigur durch buehne.ganzAnsichten (Scan-Band je Wechsel)
// rueckVon/rueckBis = Rueckwandlung: die Exo-Kante laeuft zurueck, am Ende steht wieder das Foto (Vorgabe: aus)
// ruheAb = ab hier gilt die Figur wieder als ruhend: Leerlauf-Scan laeuft auch am Ganzkoerper (Vorgabe: aus)
// Beides zusammen ergibt die „Bildkarte mit Mausspur“ (docs/HERO.md).
const PH_STD = { zoomBis: 0.58, druckVon: 0.22, druckBis: 0.56, umVon: 0.58, umBis: 0.94, drehVon: 0.60, drehBis: 0.93, rueckVon: 2, rueckBis: 2, ruheAb: 2 };
const glattIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function anlegen(eltern, tag, klasse) {
  const e = document.createElement(tag);
  e.className = klasse;
  eltern.appendChild(e);
  return e;
}

function srcset(pfad, name, bild) {
  return [...bild.breiten].sort((a, b) => a - b).map((w) => `${bildUrl(pfad, name, w)} ${w}w`).join(', ');
}

/**
 * @param {HTMLElement} el   <section>, wird zur gepinnten Hero-Strecke
 * @param {object} opt
 * @param {object} opt.figuren          Inhalt von figuren.json (Pflicht)
 * @param {string} [opt.satz]           Bildsatz; ?satz=a|b in der Adresse gewinnt
 * @param {object} [opt.lenis]          Lenis-Instanz (fuer den Sperrschalter mobil)
 * @param {string} [opt.pfad]           Bildordner, Vorgabe '/bilder/'
 * @param {'eigen'|'extern'} [opt.steuerung]  'extern': Fortschritt kommt ueber api.setFortschritt(p), der Abschnitt
 *                                      wird nicht selbst zur gepinnten Strecke (Hoehe 100svh, Pinnen macht die Seite)
 * @param {object} [opt.phasen]         Phasengrenzen 0..1: { zoomBis, druckVon, druckBis, umVon, umBis, drehVon, drehBis,
 *                                      rueckVon, rueckBis, ruheAb }
 * @param {string[]} [opt.ganzAnsichten] Reihenfolge der Drehung in der Ganzkoerperphase, ueberschreibt buehne.ganzAnsichten;
 *                                      Ansichten duerfen mehrfach vorkommen, z. B. ['links','frontal','rechts','frontal']
 * @param {'fenster'|'buehne'} [opt.zeigerRaum]  'buehne': Zeiger zaehlt nur ueber der Buehne (Bildkarte als eigene
 *                                      Buehne); Finger: Tippen und waagerechtes Wischen, nicht der Ansatz zum Scrollen
 * @param {{mass?:'kopf'|'breite', an?:number, aus?:number}} [opt.ansichtSchwelle]  Ansicht folgt der Maus ab `an`,
 *                                      zurueck bei `aus`, gemessen in Kopfbreiten (Vorgabe 0,85 / 0,45) oder Buehnenbreiten
 * @param {{folge:string[], takt?:number}} [opt.ansichtLeerlauf]  ohne Eingabe langsamer Wechsel durch die Ansichten
 *                                      (je `takt` Sekunden, Vorgabe 4,5); Vorgabe: aus, die Figur kehrt zur Grundansicht zurueck
 * @param {number} [opt.leerlaufVoll=3] jeder n-te Leerlauf-Zyklus ist ein voller Wechsel zum Exo; 0 = nie (nur Scan-Band)
 * @param {(p:number)=>void} [opt.onFortschritt]  Scroll-Fortschritt 0..1 der gepinnten Strecke
 * @param {(z:'mensch'|'exo')=>void} [opt.onZustand]
 * @param {(figurId:string, ansicht:string)=>void} [opt.onAnsicht]
 * @param {(modus:'gl'|'still')=>void} [opt.onBereit]
 */
export function createHero(el, opt = {}) {
  const cfg = opt.figuren;
  if (!cfg || !cfg.saetze) throw new Error('createHero: opt.figuren (figuren.json) fehlt');
  const { name: satzName, satz } = waehleSatz(cfg, opt.satz);
  const B = cfg.buehne || {};
  const pfad = opt.pfad || '/bilder/';
  const PH = { ...PH_STD, ...(B.phasen || {}), ...(opt.phasen || {}) };
  // Buesten: buehne.schnitt = 'schulter' schneidet alle Figuren an der Buehnenunterkante auf Schulterhoehe (gleiche
  // Kopfgroesse, gemeinsame Kopflinie). Dann gibt es im Hero keinen Ganzkoerper; Scrollen fuehrt zum Exo-Wechsel.
  const buesten = (opt.schnitt ?? B.schnitt) === 'schulter';
  // Groesse: Faktor auf platz.kopf, umschaltbar per ?groesse=s|m|l (Vorgabe buehne.groesse oder 'm')
  let grWunsch = null;
  try { grWunsch = new URLSearchParams(location.search).get('groesse'); } catch { /* egal */ }
  const GROESSEN = { s: 0.88, m: 1, l: 1.12, ...(B.groessen || {}) };
  const groesse = GROESSEN[grWunsch] != null ? grWunsch : (GROESSEN[opt.groesse] != null ? opt.groesse : (B.groesse || 'm'));
  const GF = GROESSEN[groesse] ?? 1;
  const extern = opt.steuerung === 'extern';
  // Bildkarte als eigene Buehne (docs/HERO.md): Zeiger nur ueber der Buehne, Schwelle je Buehnenbreite, langsamer
  // Wechsel der Ansichten im Leerlauf, kein voller Leerlauf-Wechsel. Ohne diese Optionen bleibt alles wie bisher.
  const raumBuehne = opt.zeigerRaum === 'buehne';
  const SW = { mass: 'kopf', an: 0.85, aus: 0.45, ...(opt.ansichtSchwelle || {}) };
  const AL = opt.ansichtLeerlauf?.folge?.length ? { takt: 4.5, ...opt.ansichtLeerlauf } : null;
  const VOLL = opt.leerlaufVoll ?? 3;
  let pExtern = 0;
  const aufraeumen = [];
  let tot = false;

  // ---------- Markup ----------
  el.classList.add('hero');
  el.classList.toggle('hero--extern', extern);
  el.dataset.satz = satzName;
  if (B.grund) el.style.setProperty('--hero-grund', B.grund);
  if (B.kante) el.style.setProperty('--hero-kante', B.kante);
  if (B.scrollhoehe) el.style.setProperty('--hero-scroll', B.scrollhoehe);
  const pin = el.querySelector('.hero__pin') || anlegen(el, 'div', 'hero__pin');
  const stage = pin.querySelector('.hero__buehne') || (() => { const s = document.createElement('div'); s.className = 'hero__buehne'; pin.prepend(s); return s; })();

  // Plaetze tauschen: Die Plaetze (platz, platzGanz, ebene) stehen in der Reihenfolge der Datei (links nach
  // rechts). `reihenfolge` legt fest, wer auf welchem Platz steht; `wechsel: "besuch"` laesst die Besetzung je
  // Seitenaufruf reihum wandern; ?mitte=<id> stellt zum Testen eine Person in die Mitte.
  const plaetze = satz.figuren.map((f) => ({ platz: f.platz, platzGanz: f.platzGanz, ebene: f.ebene || 0 }));
  let folge = (opt.reihenfolge || B.reihenfolge || []).filter((id) => satz.figuren.some((f) => f.id === id));
  for (const f of satz.figuren) if (!folge.includes(f.id)) folge.push(f.id);
  const drehe = (n) => { const k = ((n % folge.length) + folge.length) % folge.length; folge = folge.slice(k).concat(folge.slice(0, k)); };
  const mittePlatz = plaetze.reduce((m, p, i) => (p.ebene > plaetze[m].ebene ? i : m), Math.floor((plaetze.length - 1) / 2));
  let mitteWunsch = null;
  try { mitteWunsch = new URLSearchParams(location.search).get('mitte'); } catch { /* egal */ }
  if (mitteWunsch && folge.includes(mitteWunsch)) drehe(folge.indexOf(mitteWunsch) - mittePlatz);
  else if ((opt.wechsel || B.wechsel) === 'besuch' && folge.length > 1) {
    let n = 0;
    try {   // Merker je Seite; ohne localStorage (privater Modus) gilt einfach die Grundreihenfolge
      const key = 'hero-besuch:' + location.pathname + ':' + satzName;
      n = (parseInt(localStorage.getItem(key) || '0', 10) || 0);
      localStorage.setItem(key, String((n + 1) % folge.length));
    } catch { n = 0; }
    drehe(n);
  }
  const besetzt = folge.map((id, i) => ({ ...satz.figuren.find((f) => f.id === id), ...plaetze[i] }));
  const mitteId = besetzt[mittePlatz]?.id;

  const figs = [...besetzt].sort((a, b) => (a.ebene || 0) - (b.ebene || 0)).map((def) => {
    const basis = def.ansichten.frontal ? 'frontal' : Object.keys(def.ansichten)[0];
    // Seitenansichten im Ganzkoerper kommen aus figuren.szenen[<ganzSzene oder id>] (schreibt tools/bilder.py)
    const seiten = cfg.szenen?.[def.ganzSzene || def.id]?.ansichten || {};
    return { def, basis, ansicht: basis, ziel: basis, saetze: {}, wisch: null, ruhe: 0, nx: 0, ny: 0, kx: 0, ky: 0,
      gSeiten: seiten, gSaetze: {}, gAnsicht: 'frontal', gWisch: null, gRuhe: 0 };
  });

  // <picture> je Figur: erster Eindruck und Standbild. Steht es schon im HTML, werden nur die Werte gesetzt.
  for (const pic of stage.querySelectorAll('.hero__bild')) {
    if (!figs.some((f) => f.def.id === pic.dataset.figur)) pic.remove();
  }
  for (const f of figs) {
    const v = f.def.ansichten[f.basis], b = cfg.bilder[v.foto], a = v.anker, pd = f.def.platz.desktop, pm = f.def.platz.mobil;
    let pic = stage.querySelector(`.hero__bild[data-figur="${f.def.id}"]`);
    if (!pic) { pic = document.createElement('picture'); pic.className = 'hero__bild'; pic.dataset.figur = f.def.id; pic.appendChild(document.createElement('img')); }
    stage.appendChild(pic); // Reihenfolge = Ebene
    const st = pic.style;
    st.setProperty('--asp', (b.b / b.h).toFixed(4)); st.setProperty('--ax', a.x); st.setProperty('--ay', a.y); st.setProperty('--ab', a.b);
    st.setProperty('--xd', pd.x); st.setProperty('--yd', pd.y); st.setProperty('--kd', pd.kopf);
    st.setProperty('--xm', pm.x); st.setProperty('--ym', pm.y); st.setProperty('--km', pm.kopf);
    st.setProperty('--hof', `url("${bildUrl(pfad, v.foto, 'hof')}")`);
    const img = pic.querySelector('img');
    if (!(img.getAttribute('src') || '').includes(`/${v.foto}-`)) {
      img.sizes = '(max-width: 991px) 220vw, 110vw';
      img.srcset = srcset(pfad, v.foto, b);
      img.src = bildUrl(pfad, v.foto, Math.max(...b.breiten));
      img.width = b.b; img.height = b.h;
    }
    img.alt = f.def.alt || img.alt || '';
    f.pic = pic; f.img = img;
  }

  // Wirksamer Platz je Figur: Groessenfaktor und, bei Buesten, die gemeinsame Kopflinie. Die Kopflinie ergibt sich
  // aus der Schulterlinie: Jede Figur soll so stehen, dass die Buehnenunterkante sie `schnittTiefe` Kopfhoehen unter
  // der Schulterlinie schneidet; genommen wird die tiefste dieser Lagen (dann ragt jedes Bild unten ueber den Rand,
  // nichts wird vergroessert). Ohne Schnitt und mit Groesse m bleibt alles wie in figuren.json.
  const angepasst = buesten || GF !== 1;
  let lage = { key: '', y: null };
  function kopflinie(lay, W, H, L) {
    const key = `${Math.round(W)}x${Math.round(H)}${lay}`;
    if (lage.key === key) return lage.y;
    let y = null;
    if (buesten) {
      const tiefe = B.schnittTiefe ?? 0.25;
      y = 0;
      for (const f of figs) {
        const k = f.def.platz[lay].kopf * GF;
        for (const v of Object.values(f.def.ansichten)) {
          const a = v.anker, kh = a.kh ?? a.b * 1.45;
          const schnitt = Math.min((a.schulter ?? a.y + 0.75 * kh) + tiefe * kh, 0.90);   // nie in den Bildauslauf
          y = Math.max(y, 1 - ((schnitt - a.y) * L * k) / (a.b * H));
        }
      }
    }
    lage = { key, y };
    return y;
  }
  const platzVon = (f, lay, W, H, L) => {
    const Pl = f.def.platz[lay];
    if (!angepasst) return Pl;
    return { ...Pl, y: kopflinie(lay, W, H, L) ?? Pl.y, kopf: Pl.kopf * GF };
  };
  function legeFotos() {
    if (!angepasst) return;
    const r = stage.getBoundingClientRect();
    const W = Math.max(1, r.width), H = Math.max(1, r.height), mobil = istMobil(), lay = mobil ? 'mobil' : 'desktop', L = bezug(W, H, mobil);
    for (const f of figs) {
      const Pl = platzVon(f, lay, W, H, L), e = mobil ? 'm' : 'd';
      f.pic.style.setProperty('--y' + e, Number(Pl.y).toFixed(4)); f.pic.style.setProperty('--k' + e, Number(Pl.kopf).toFixed(4));
    }
  }
  legeFotos();
  if (angepasst) { const roF = new ResizeObserver(legeFotos); roF.observe(stage); aufraeumen.push(() => roF.disconnect()); }
  el.dataset.groesse = groesse;

  el.classList.add('hero--geordnet');   // ab jetzt stehen die Fotos auf ihren Plaetzen (siehe hero.css, data-wechsel)

  // Kennzeichnung (Art. 50 KI-VO): klein, dauerhaft sichtbar
  let ki = pin.querySelector('.hero__ki');
  if (!ki) { ki = anlegen(pin, 'p', 'hero__ki'); ki.textContent = B.ki || 'KI-generiert'; }

  const still = bewegungReduziert() || !webgl2Vorhanden() || opt.still === true;
  const Z = {
    p: 0, zeit: 0, eingabe: -1e9, zeigerDa: false, zx: 0, zy: 0, auto: true, band: null, zyklus: 0, naechst: 2.4,
    zustand: 'mensch', gesperrt: false, sichtbar: true, raf: 0, letzt: 0,
  };
  let T = {};           // Test-Uebersteuerung (api.test)
  let bu = null;        // Buehne
  let kaputt = false;   // WebGL-Kontext verloren: Standbild bis zum Neuladen
  let fertig, bereit = new Promise((ok) => { fertig = ok; });

  const api = {
    el, satz: satzName, bereit,
    /** Besetzung der Plaetze von links nach rechts und die Person in der Mitte */
    reihenfolge: folge, mitte: mitteId, groesse,
    /** alle Bilder (auch Seitenansichten und Ganzkoerper) geladen */
    komplett: Promise.resolve(false),
    get fortschritt() { return Z.p; },
    phasen: PH,
    /** Fortschritt 0..1 von aussen setzen (nur mit steuerung: 'extern'), z. B. aus einem ScrollTrigger. */
    setFortschritt(p) { pExtern = klemme(Number(p) || 0); return api; },
    /** Ansicht des Portraets von aussen festlegen ('links' | 'frontal' | 'rechts'); null gibt sie wieder der Maus. */
    setAnsicht(name) { Z.ansichtExtern = name || null; return api; },
    get zustand() { return Z.zustand; },
    get modus() { return still || kaputt ? 'still' : (bu ? 'gl' : 'laedt'); },
    /** Nur fuer Tests und Bildschirmfotos: Zustaende festhalten. test() ohne Argument gibt wieder frei. */
    test(t) { T = t || {}; Z.auto = T.auto !== false; if (!t) { Z.naechst = Z.zeit + 2; } return api; },
    stempel(ax, ay, bx, by, s) { bu?.stempel(ax, ay, bx, by, s); },
    dispose,
  };

  if (still) {
    el.classList.add('hero--still');
    // Netz als Standbild hinter den Fotos (netz.js zeichnet bei Reduced Motion genau ein Bild)
    if (B.netz) import('../netz/netz.js').then(({ createNetz }) => { if (!tot) { const n = createNetz(stage, { ...B.netz, seed: B.netz.seed ?? 7 }); stage.prepend(n.canvas); aufraeumen.push(() => n.dispose()); } });
    opt.onBereit?.('still');
    fertig('still');
    return api;
  }

  // ---------- Schalter mobil ----------
  let schalter = pin.querySelector('.hero__schalter');
  if (!schalter) {
    schalter = anlegen(pin, 'button', 'hero__schalter');
    schalter.type = 'button';
    schalter.innerHTML = '<span class="hero__schalter-a">Tippen zum Steuern</span><span class="hero__schalter-b">Zurück zum Scrollen</span>';
  }
  schalter.setAttribute('role', 'switch');
  schalter.setAttribute('aria-checked', 'false');
  schalter.setAttribute('aria-label', 'Figur per Finger steuern, Scrollen sperren');
  function sperre(an) {
    Z.gesperrt = an;
    el.classList.toggle('hero--gesperrt', an);
    schalter.setAttribute('aria-checked', String(an));
    if (an) {
      const oben = el.getBoundingClientRect().top + window.scrollY;
      if (opt.lenis) { opt.lenis.scrollTo(oben, { immediate: true, force: true }); opt.lenis.stop(); } else window.scrollTo(0, oben);
      document.documentElement.classList.add('hero-sperre');
    } else {
      opt.lenis?.start();
      document.documentElement.classList.remove('hero-sperre');
    }
  }
  const aufSchalter = () => sperre(!Z.gesperrt);
  schalter.addEventListener('click', aufSchalter);
  const aufTouch = (e) => { if (Z.gesperrt && e.cancelable) e.preventDefault(); };
  stage.addEventListener('touchmove', aufTouch, { passive: false });
  aufraeumen.push(() => { schalter.removeEventListener('click', aufSchalter); stage.removeEventListener('touchmove', aufTouch); if (Z.gesperrt) sperre(false); });

  // ---------- Zeiger ----------
  const aufZeiger = (e) => {
    if (!bu || !Z.sichtbar) return;
    const r = stage.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    let neu = e.type === 'pointerdown';
    if (raumBuehne) {
      if (x < -8 || x > r.width + 8 || y < -8 || y > r.height + 8) { if (e.pointerType === 'mouse') Z.zeigerDa = false; return; }
      if (e.pointerType !== 'mouse') {
        // Finger: Tippen (kurzes pointerup) und waagerechtes Wischen zaehlen, der Ansatz zum Scrollen nicht
        if (e.type === 'pointerdown') { Z.tipp = { x, y, t: Z.zeit, neu: true, zieht: false }; return; }
        if (!Z.tipp) return;
        if (e.type === 'pointermove' && !Z.tipp.zieht) { if (Math.abs(x - Z.tipp.x) < 8) return; Z.tipp.zieht = true; }
        neu = Z.tipp.neu; Z.tipp.neu = false;
      }
    } else if (y < -40 || y > r.height + 40) return;
    Z.zx = x; Z.zy = y; Z.zeigerDa = true; Z.eingabe = Z.zeit; Z.art = e.pointerType;
    bu.zeiger(x, y, neu);
  };
  const aufWeg = (e) => {
    if (raumBuehne && e.type === 'pointerup' && e.pointerType !== 'mouse' && Z.tipp && !Z.tipp.zieht && Z.zeit - Z.tipp.t < 0.5) aufZeiger(e);   // Tippen
    if (e.type === 'pointerup' && e.pointerType === 'mouse') return;
    Z.zeigerDa = false;
    if (raumBuehne) Z.tipp = null;
  };
  window.addEventListener('pointermove', aufZeiger, { passive: true });
  window.addEventListener('pointerdown', aufZeiger, { passive: true });
  window.addEventListener('pointerup', aufWeg, { passive: true });
  window.addEventListener('pointercancel', aufWeg, { passive: true });
  document.documentElement.addEventListener('pointerleave', aufWeg);
  aufraeumen.push(() => {
    window.removeEventListener('pointermove', aufZeiger); window.removeEventListener('pointerdown', aufZeiger);
    window.removeEventListener('pointerup', aufWeg); window.removeEventListener('pointercancel', aufWeg);
    document.documentElement.removeEventListener('pointerleave', aufWeg);
  });

  const io = new IntersectionObserver((es) => { Z.sichtbar = es[es.length - 1].isIntersecting; }, { rootMargin: '10% 0px' });
  io.observe(el);
  aufraeumen.push(() => io.disconnect());

  starte().catch((err) => {
    // Bild fehlt oder WebGL bricht ab: beim Standbild bleiben, nichts kaputt machen
    if (tot) return;
    console.warn('[hero] WebGL-Start abgebrochen, Standbild bleibt:', err?.message || err);
    el.classList.add('hero--still');
    bu?.dispose(); bu = null;
    opt.onBereit?.('still'); fertig('still');
  });

  // K-CR-02: WebGL-Kontext verloren (GPU-Neustart, Speicherdruck, mehr als 16 Kontexte): Buehne freigeben, die Fotos
  // im <picture> wieder zeigen. hero--still wird bewusst nicht gesetzt, es aendert die Hoehe des Heros.
  function verloren() {
    if (tot || !bu) return;
    console.warn('[hero] WebGL-Kontext verloren, Standbild bleibt');
    kaputt = true;
    cancelAnimationFrame(Z.raf);
    if (Z.gesperrt) sperre(false);
    bu.dispose(); bu = null;
    el.classList.remove('hero--gl');
  }

  async function starte() {
    const { Buehne } = await import('./buehne.js');
    if (tot) return;
    bu = new Buehne(stage, { grund: B.grund, kante: B.kante, netz: B.netz, signete: B.signete, bilder: cfg.bilder, pfad, onVerlust: verloren });
    const L = bezug(bu.W, bu.H, bu.mobil), lay = bu.mobil ? 'mobil' : 'desktop';
    const px = (def, platz) => ((L * platz.kopf) / def.anker.b) * (cfg.bilder[def.foto].b / cfg.bilder[def.foto].h) * bu.dpr;

    // 1) Grundansicht jeder Figur. Das Foto kommt aus dem Cache des <picture> (currentSrc).
    await Promise.all(figs.map(async (f, i) => {
      const def = f.def.ansichten[f.basis];
      await (f.img.decode?.().catch(() => {}) ?? Promise.resolve());
      const src = f.img.currentSrc && f.img.currentSrc.includes(`/${def.foto}-`) ? f.img.currentSrc : null;
      f.saetze[f.basis] = await bu.paar(def, px(def, f.def.platz[lay]), src, f.basis);
      if (tot) return;
      f.port = bu.neueFigur(10 + i * 2 + 1);
      f.port.platz('A', f.saetze[f.basis]); f.port.platz('B', f.saetze[f.basis]);
      f.port.mesh.visible = true;
      if (f.def.ganzkoerper && !buesten) { f.ganz = bu.neueFigur(10 + i * 2); }
    }));
    if (tot) return;
    schritt(0.016);
    bu.zeichne(0.016);
    el.classList.add('hero--gl');
    requestAnimationFrame(() => bu?.canvas.classList.add('ist-da'));
    Z.letzt = performance.now();
    Z.raf = requestAnimationFrame(bild);
    opt.onBereit?.('gl');
    fertig('gl');

    // 2) Rest nachladen: erst Ganzkoerper, dann die Seitenansichten
    api.komplett = (async () => {
      await Promise.all(figs.filter((f) => f.ganz).map(async (f) => {
        const def = f.def.ganzkoerper, P1 = (f.def.platzGanz || f.def.platz)[lay];
        const s = await bu.paar(def, px(def, P1) * 1.5, null, 'frontal');
        if (tot) return;
        f.ganz.platz('A', s); f.ganz.platz('B', s); f.ganzSatz = s; f.gSaetze.frontal = s;
      }));
      for (const n of ['links', 'rechts', 'frontal']) {
        await Promise.all(figs.filter((f) => f.def.ansichten[n] && !f.saetze[n]).map(async (f) => {
          const def = f.def.ansichten[n];
          const s = await bu.paar(def, px(def, f.def.platz[lay]), null, n);
          if (!tot) f.saetze[n] = s;
        }));
      }
      // zuletzt die Seitenansichten im Ganzkoerper (Drehung beim Scrollen)
      for (const n of ['links', 'rechts']) {
        await Promise.all(figs.filter((f) => f.ganz && f.gSeiten[n] && !f.gSaetze[n]).map(async (f) => {
          const def = f.gSeiten[n], P1 = (f.def.platzGanz || f.def.platz)[lay];
          const s = await bu.paar(def, px(f.def.ganzkoerper, P1) * 1.5, null, n);
          if (!tot) f.gSaetze[n] = s;
        }));
      }
      return true;
    })();
    api.komplett.catch((err) => console.warn('[hero] Nachladen unvollstaendig:', err?.message || err));
  }

  function bild(jetzt) {
    Z.raf = requestAnimationFrame(bild);
    const dt = Math.min(0.05, Math.max(0.001, (jetzt - Z.letzt) / 1000));
    Z.letzt = jetzt;
    if (!bu || !Z.sichtbar || document.hidden) return;
    bu.groesse();
    schritt(dt);
    bu.zeichne(T.zeitHalt ? 0.0001 : dt);
  }

  function schritt(dt) {
    const W = bu.W, H = bu.H, mobil = bu.mobil, L = bezug(W, H, mobil), lay = mobil ? 'mobil' : 'desktop';
    const t = (Z.zeit += dt);

    // Scroll-Fortschritt der gepinnten Strecke
    const r = el.getBoundingClientRect(), weg = r.height - H;
    let p = extern ? pExtern : (weg > 4 ? klemme(-r.top / weg) : 0);
    if (T.scroll != null) p = T.scroll;
    if (Math.abs(p - Z.p) > 1e-4) { Z.p = p; opt.onFortschritt?.(p); el.classList.toggle('hero--unterwegs', p > 0.04); }
    const zoom = glatt(klemme(p / PH.zoomBis));
    const druck = klemme((p - PH.druckVon) / (PH.druckBis - PH.druckVon));
    // Umwandlung zum Exo, optional mit Rueckwandlung (Kante laeuft denselben Weg zurueck)
    const um = klemme((p - PH.umVon) / (PH.umBis - PH.umVon)) * (1 - klemme((p - PH.rueckVon) / Math.max(1e-6, PH.rueckBis - PH.rueckVon)));
    const ruhe = p >= PH.ruheAb;          // Figur steht wieder (z. B. als Bildkarte): Leerlauf wie am Anfang
    const leer = t - Z.eingabe > 1.5;

    // Leerlauf: Scan-Band alle 4-5 s, jeder dritte Zyklus ein voller Wechsel Mensch -> Exo -> Mensch
    let oben = 1;
    for (const f of figs) { const Pl = platzVon(f, lay, W, H, L); oben = Math.min(oben, (Pl.y * H - 0.8 * Pl.kopf * L) / H); }
    oben -= 0.05; const unten = 1.04;
    if (ruhe) oben = 0.0;                 // Ganzkoerper: Band laeuft ueber die ganze Buehne
    if (!Z.band && Z.auto && leer && (p < 0.02 || ruhe) && t > Z.naechst) {
      Z.zyklus++;
      const voll = VOLL > 0 && Z.zyklus % VOLL === 0;
      Z.band = { voll, t0: t };
      Z.naechst = t + 4.2 + Math.random() * 0.8 + (voll ? 3.2 : 0);
    }
    let b0 = -9, b1 = -9, exo = 0;
    if (Z.band) {
      const s = t - Z.band.t0;
      if (!Z.band.voll) {
        const e = s / 1.5;
        if (e >= 1) Z.band = null;
        else { const pos = mische(oben - 0.06, unten + 0.06, glattIO(e)); b0 = pos - 0.045; b1 = pos + 0.045; }
      } else {
        if ((!leer || (p > 0.02 && !ruhe)) && s > 1.0 && s < 3.0) Z.band.t0 = t - 3.0; // Eingabe beendet das Halten
        const s2 = t - Z.band.t0, a = klemme(s2 / 1.0), c = klemme((s2 - 3.0) / 1.0);
        if (s2 >= 4.0) Z.band = null;
        else { b1 = a < 1 ? mische(oben, unten, glattIO(a)) : 9; b0 = c > 0 ? mische(oben, unten, glattIO(c)) : -9; exo = a * (1 - c); }
      }
    }
    if (T.band) { b0 = T.band[0]; b1 = T.band[1]; }
    bu.grundMat.uniforms.uExo.value = Math.max(exo, um);
    const zustand = (exo > 0.5 || um > 0.5 || (T.kraft || 0) > 0.5) ? 'exo' : 'mensch';
    if (zustand !== Z.zustand) { Z.zustand = zustand; opt.onZustand?.(zustand); }

    let mx = 0, my = 0;
    for (const f of figs) {
      if (!f.port) continue;
      const P0 = platzVon(f, lay, W, H, L), P1 = (f.def.platzGanz || {})[lay];
      const zz = f.ganzSatz && P1 ? zoom : 0;
      let pl = P0;
      if (zz > 0) {
        const K = Math.exp(mische(Math.log(P0.kopf), Math.log(P1.kopf), zz));
        const s = Math.abs(P1.kopf - P0.kopf) > 1e-6 ? (K - P0.kopf) / (P1.kopf - P0.kopf) : zz;
        pl = { x: mische(P0.x, P1.x, s), y: mische(P0.y, P1.y, s), kopf: K };
      }
      const kpx = pl.kopf * L;
      f.kx = pl.x * W; f.ky = pl.y * H;
      mx += f.kx / W; my += f.ky / H;

      // Ansicht: Kopf folgt der Maus, mit Hysterese
      let ziel = f.basis;
      const mehrere = Object.keys(f.def.ansichten).length > 1;
      // Finger (zeigerRaum 'buehne'): die getippte oder gewischte Ansicht bleibt 3 s stehen, auch nach dem Loslassen
      const folgt = (Z.zeigerDa || (raumBuehne && Z.art && Z.art !== 'mouse')) && t - Z.eingabe < 3.0;
      if (mehrere && folgt && p < 0.03) {
        const d = (Z.zx - f.kx) / (SW.mass === 'breite' ? W : kpx), cur = f.ziel, AN = SW.an, AUS = SW.aus;
        if (cur === 'links') ziel = d > AN ? 'rechts' : d > -AUS ? 'frontal' : 'links';
        else if (cur === 'rechts') ziel = d < -AN ? 'links' : d < AUS ? 'frontal' : 'rechts';
        else ziel = d < -AN ? 'links' : d > AN ? 'rechts' : 'frontal';
        if (!f.def.ansichten[ziel]) ziel = f.def.ansichten[cur] ? cur : f.basis;
      } else if (mehrere && AL && p < 0.03) {
        // Leerlauf: langsamer Wechsel durch die Ansichten, gezaehlt ab der letzten Eingabe (beginnt mit folge[0])
        ziel = AL.folge[Math.floor(Math.max(0, t - Math.max(0, Z.eingabe)) / AL.takt) % AL.folge.length];
        if (!f.def.ansichten[ziel]) ziel = f.basis;
      }
      if (Z.ansichtExtern && f.def.ansichten[Z.ansichtExtern]) ziel = Z.ansichtExtern;
      if (T.ansicht && f.def.ansichten[T.ansicht]) ziel = T.ansicht;
      f.ziel = ziel;
      if (f.wisch) {
        f.wisch.t += dt / 0.62;
        if (T.wischHalt != null) f.wisch.t = Math.min(f.wisch.t, T.wischHalt);
        if (f.wisch.t >= 1) {
          f.ansicht = f.wisch.nach; f.port.platz('A', f.saetze[f.ansicht]); f.wisch = null; f.ruhe = t + 0.18;
          opt.onAnsicht?.(f.def.id, f.ansicht);
        }
      } else if (ziel !== f.ansicht && f.saetze[ziel] && t > f.ruhe) {
        f.wisch = { nach: ziel, t: 0, dir: Math.sign(ORD[ziel] - ORD[f.ansicht]) || 1 };
        f.port.platz('B', f.saetze[ziel]);
      }
      const dA = f.saetze[f.ansicht].def;
      const rA = rechteckKopf(cfg.bilder[dA.foto], dA.anker, pl, W, H, L);
      let rB = null;
      if (f.wisch) {
        const dB = f.saetze[f.wisch.nach].def;
        rB = rechteckKopf(cfg.bilder[dB.foto], dB.anker, pl, W, H, L);
        const e = glattIO(klemme(f.wisch.t));
        f.port.sicht(f.kx + f.wisch.dir * (-1 + 2 * e) * 2.3 * kpx, f.wisch.dir, kpx);
      }
      f.port.rechteck(rA, rB);

      // 2,5D-Neigung zur Maus, im Leerlauf ein ruhiges Wiegen
      const aktiv = Z.zeigerDa && t - Z.eingabe < 2.5;
      const zx = aktiv ? klemme((Z.zx - f.kx) / (W * 0.45), -1, 1) : Math.sin(t * 0.35 + f.kx) * 0.3;
      const zy = aktiv ? klemme((Z.zy - f.ky) / (H * 0.45), -1, 1) : Math.sin(t * 0.27 + 1.3) * 0.2;
      const k = 1 - Math.exp(-dt * 3.2);
      f.nx += (zx - f.nx) * k; f.ny += (zy - f.ny) * k;
      const amp = T.neig ? 1 : (1 - zz);
      f.port.U.uNeig.value.set((T.neig ? T.neig[0] : f.nx) * 0.016 * amp, (T.neig ? T.neig[1] : f.ny) * 0.010 * amp);
      f.port.U.uForce.value = T.kraft || 0;

      if (f.ganz && f.ganzSatz) {
        const gF = f.def.ganzkoerper, bgF = cfg.bilder[gF.foto];
        const rF = rechteckKopf(bgF, gF.anker, pl, W, H, L);   // Frontalbild legt Groesse und Stand fest
        // Seitenansicht so legen, dass Scheitel, Sohlen und Schwerpunkt auf dem Frontalbild sitzen (kein Springen)
        const rechtG = (n) => {
          const d = f.gSaetze[n].def;
          if (n === 'frontal') return rF;
          const b = cfg.bilder[d.foto], a = d.anker, aF = gF.anker;
          const h = rF.h * (aF.unten - aF.oben) / Math.max(0.05, a.unten - a.oben), w = h * (b.b / b.h);
          return { x: rF.x + rF.w * aF.mx - w * a.mx, y: rF.y + rF.h * aF.unten - h * a.unten, w, h };
        };
        // Drehung mit dem Scrollen: Ansichten der Reihe nach, jeder Wechsel als Scan-Band
        const folge = (opt.ganzAnsichten || B.ganzAnsichten || ['links', 'frontal', 'rechts']).filter((n) => f.gSaetze[n]);
        let gz = 'frontal';
        if (folge.length > 1 && p >= PH.drehVon && PH.drehBis > PH.drehVon) {
          gz = folge[Math.min(folge.length - 1, Math.floor(klemme((p - PH.drehVon) / (PH.drehBis - PH.drehVon)) * folge.length))];
        }
        if (T.ganzAnsicht && f.gSaetze[T.ganzAnsicht]) gz = T.ganzAnsicht;
        if (f.gWisch) {
          f.gWisch.t += dt / 0.62;
          if (T.wischHalt != null) f.gWisch.t = Math.min(f.gWisch.t, T.wischHalt);
          if (f.gWisch.t >= 1) { f.gAnsicht = f.gWisch.nach; f.ganz.platz('A', f.gSaetze[f.gAnsicht]); f.gWisch = null; f.gRuhe = t + 0.1; }
        } else if (gz !== f.gAnsicht && t > f.gRuhe) {
          f.gWisch = { nach: gz, t: 0, dir: Math.sign(ORD[gz] - ORD[f.gAnsicht]) || 1 };
          f.ganz.platz('B', f.gSaetze[gz]);
        }
        const g = f.gSaetze[f.gAnsicht].def;
        const rG = rechtG(f.gAnsicht);
        let rGB = null;
        if (f.gWisch) {
          rGB = rechtG(f.gWisch.nach);
          const breit = rF.h * (gF.anker.unten - gF.anker.oben) * 0.42, e = glattIO(klemme(f.gWisch.t));
          f.ganz.sicht(f.kx + f.gWisch.dir * (-1 + 2 * e) * breit * 0.75, f.gWisch.dir, breit * 0.35);
        }
        f.ganz.rechteck(rG, rGB);
        f.ganz.U.uForce.value = T.kraft || 0;
        const fuss = rG.y + rG.h * (g.anker.unten ?? 0.95);
        if (druck <= 0) { f.ganz.mesh.visible = false; f.port.mesh.visible = true; f.port.fenster(); }
        else if (druck >= 1) { f.port.mesh.visible = false; f.ganz.mesh.visible = true; f.ganz.fenster(); }
        else {
          // Scan-Kante laeuft am Ganzkoerperbild entlang vom Scheitel zu den Sohlen (zoomt mit)
          const yl = rG.y + rG.h * mische((g.anker.oben ?? 0.08) - 0.03, (g.anker.unten ?? 0.95) + 0.04, glatt(druck));
          f.port.mesh.visible = f.ganz.mesh.visible = true;
          f.port.fenster(yl, FERN); f.ganz.fenster(-FERN, yl);
        }
        // Umwandlung: Kante vom Scheitel zu den Sohlen
        if (um <= 0) f.ganz.band(ruhe ? b0 : -9, ruhe ? b1 : -9);   // in Ruhe: Leerlauf-Scan auch am Ganzkoerper
        else if (um >= 1) f.ganz.band(-9, 9);
        else f.ganz.band(-9, mische(rG.y + rG.h * (g.anker.oben ?? 0.08) - 0.03 * H, fuss + 0.03 * H, um) / H);
        f.port.band(b0, b1);
      } else if (um > 0) {
        f.port.band(-9, um >= 1 ? 9 : mische(oben, unten, um));
      } else {
        f.port.band(b0, b1);
      }
    }
    if (figs.length) bu.grundMat.uniforms.uMitte.value.set(mx / figs.length, my / figs.length);
  }

  function dispose() {
    if (tot) return;
    tot = true;
    cancelAnimationFrame(Z.raf);
    for (const f of aufraeumen) f();
    bu?.dispose(); bu = null;
    el.classList.remove('hero--gl', 'hero--gesperrt', 'hero--unterwegs', 'hero--extern');
  }

  return api;
}
