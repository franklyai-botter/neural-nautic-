// Shader fuer Bildpaar-Hero und Ganzkoerper-Szene.
// Koordinaten: Buehnen-Pixel, Ursprung oben links, y nach unten (wie CSS). Texturen ohne flipY.

export const NOISE = /* glsl */`
float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=0.5, s=0.0; for(int i=0;i<4;i++){ s+=a*vnoise(p); p=p*2.03+vec2(17.3,9.1); a*=0.5; } return s; }
`;

// Grundfarbe der Buehne an einer Stelle (s = Buehnen-UV, y nach unten). Hintergrund und Figuren rechnen
// damit gleich, deshalb geht der Hof eines Fotos ohne sichtbaren Rand in die Buehne ueber.
export const GRUND = /* glsl */`
vec3 grundBei(vec2 s, vec3 grund, vec2 mitte, float aspekt){
  vec2 p = vec2(s.x*aspekt, s.y);
  float r = distance(p, vec2(mitte.x*aspekt, mitte.y));
  vec3 col = grund * mix(1.34, 0.72, smoothstep(0.0, 1.0, r));
  col *= 1.0 - 0.30*smoothstep(0.55, 1.25, length((s-0.5)*vec2(1.25,1.0))*1.6);
  return col;
}
`;

export const QUAD_VERT = /* glsl */`
varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }`;

// Fluid-Mausspur (Ping-Pong). vUv.y laeuft hier wie die Buehne von oben nach unten.
export const SPUR_FRAG = /* glsl */`
precision highp float;
uniform sampler2D tPrev; uniform vec2 uA, uB; uniform float uStrength, uDecay, uAspect, uTime, uRadius;
varying vec2 vUv;
${NOISE}
void main(){
  float n1 = fbm(vUv*5.0 + uTime*0.25), n2 = fbm(vUv*5.0 + 31.7 - uTime*0.21);
  vec2 flow = vec2(n1-0.5, n2-0.5);
  float prev = texture2D(tPrev, vUv - flow*0.005).r;
  float blurred = (texture2D(tPrev, vUv+vec2(0.004,0.0)).r + texture2D(tPrev, vUv-vec2(0.004,0.0)).r
                 + texture2D(tPrev, vUv+vec2(0.0,0.004)).r + texture2D(tPrev, vUv-vec2(0.0,0.004)).r)*0.25;
  float v = mix(prev, blurred, 0.35) * uDecay;
  vec2 p = vUv, a = uA, b = uB; p.x*=uAspect; a.x*=uAspect; b.x*=uAspect;
  vec2 ab = b-a; float t = clamp(dot(p-a,ab)/max(dot(ab,ab),1e-6), 0.0, 1.0);
  float d = length(p-(a+ab*t));
  v += uStrength * exp(-d*d/(uRadius*uRadius));
  gl_FragColor = vec4(clamp(v,0.0,1.0), 0.0, 0.0, 1.0);
}`;

export const GRUND_FRAG = /* glsl */`
precision highp float;
uniform float uTime, uAspect, uNetzAn, uExo; uniform sampler2D tTrail, tNetz; uniform vec2 uMitte; uniform vec3 uGrund, uKante, uNetzFarbe;
varying vec2 vUv;
${NOISE}
${GRUND}
void main(){
  vec2 s = vec2(vUv.x, 1.0 - vUv.y);           // Buehne: y nach unten
  vec3 col = grundBei(s, uGrund, uMitte, uAspect);
  // Neuronales Netz (kern/netz/netz.js, als Canvas-Textur): nur der Alphakanal, Farbe je Marke
  if (uNetzAn > 0.5) {
    float n = texture2D(tNetz, s).a;
    col = mix(col, uNetzFarbe, clamp(n * (1.0 + 0.25*uExo), 0.0, 1.0));
  }
  float tr = texture2D(tTrail, s).r;
  col += uKante * smoothstep(0.1,0.7,tr) * 0.045;
  // feines Rauschen gegen Farbstufen im dunklen Verlauf
  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}`;

export const FIGUR_VERT = /* glsl */`
varying vec2 vS;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0);
  vS = w.xy;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

// Eine Figur = ein Rechteck mit zwei Plaetzen (A, B) fuer den Ansichtswechsel per Scan-Band.
// Je Platz: Foto, Tiefe des Fotos (R Tiefe, G Hof, B Figur), Exo, Tiefe des Exos (im Exo-Bild).
export const FIGUR_FRAG = /* glsl */`
precision highp float;
uniform sampler2D tFotoA, tTiefeA, tExoA, tExoTiefeA, tFotoB, tTiefeB, tExoB, tExoTiefeB, tTrail;
uniform sampler2D tVisierA, tVisierB, tVNetz;      // Visiermaske (R Blende, G Glanz) je Exo, Netz hinter dem Glas
uniform vec4 uVisA, uVisB;                        // Visier im Exo-Bild: Mitte x,y und Halbachsen (Bildanteile)
uniform vec3 uLichtA, uLichtB;                    // Farbe der Helmlichter aus dem Bild
uniform float uVisAnA, uVisAnB;
// Signete im Visier (z. B. Logo): eigene Ebene ueber dem Netz, nur verschoben und gleichmaessig skaliert,
// nie gedreht, nie verzerrt, nie umgefaerbt. Atlas mit drei Zellen nebeneinander.
uniform sampler2D tSig;
uniform vec4 uSig[3];                             // Lage x,y (Anteil der Visier-Halbachsen), Skalierung, Deckkraft
uniform vec2 uSigMass[3];                         // Hoehe (Anteil der Visierhoehe), Seitenverhaeltnis b/h
uniform float uSigN, uSigAnA, uSigAnB;
uniform float uSpA, uSpB;                        // 1 = Ansicht frontal: links ueber den Bildrand spiegeln (texSp)
uniform vec2 uVisMA, uVisMB;                      // Schwerpunkt der Visierflaeche im Exo-Bild
uniform vec4 uRectA, uRectB, uExoA, uExoB;       // Rechteck x,y,b,h (px) | Ausrichtung dx,dy,skala,drehung(rad)
uniform vec2 uAspA, uAspB;                       // Seitenverhaeltnis Foto, Exo
uniform vec3 uGrundFA, uGrundEA, uGrundFB, uGrundEB, uGrund, uKante;
uniform vec2 uStage, uBand, uFenster, uNeig, uMitte;
uniform float uTime, uSpur, uForce, uFade, uB, uSichtX, uSichtDir, uSichtW;
uniform vec4 uPunkt;                             // Lichtkreis: x,y (px), Radius (px), Staerke
varying vec2 vS;
${NOISE}
${GRUND}

struct Lage { vec3 col; float a; float tiefe; float fig; float kante; };

// Links ueber den Bildrand hinaus spiegelnd fortsetzen: Die Quellbilder (Portraet und Exo frontal) schneiden die linke
// Schulter am Bildrand ab, auf breiten Bildschirmen lag diese Kante mitten in der Buehne (Frank, 14.11.2026). Die Figur
// steht frontal, also wird an ihrer Achse ax gespiegelt; im Streifen [0, SPIEGEL_B] werden Original und Spiegel
// ueberblendet, damit keine Naht bleibt. Ohne Verzweigung, damit die Ableitungen fuer die Mipmaps stimmen.
// sp = 1 nur fuer Frontalansichten (15.11.2026): bei gedrehten Koepfen stimmt die Achse nicht, der Spiegel setzte
// einen halben Hinterkopf neben die Figur. Dort endet das Bild am Rand, weich ausgeblendet (RAND_W, in lage()).
const float SPIEGEL_B = 0.035;
const float RAND_W = 0.04;
vec4 texSp(sampler2D t, vec2 u, float ax, float sp){
  vec4 o = texture2D(t, clamp(u, 0.0, 1.0));
  vec4 m = texture2D(t, vec2(clamp(2.0*ax - u.x, 0.0, 1.0), clamp(u.y, 0.0, 1.0)));
  return mix(o, m, (1.0 - smoothstep(0.0, SPIEGEL_B, u.x)) * sp);
}

float exoMaske(float tiefe, float fig, out float kante){
  vec2 suv = vS / uStage;
  float n = fbm(vS*0.011 + uTime*0.12);
  float tr = texture2D(tTrail, suv).r * uSpur;
  float n2 = fbm(vS*0.035 - uTime*0.2);
  float sv = tr + (n-0.5)*0.16 + (n2-0.5)*0.05;
  float mSpur = smoothstep(0.19, 0.31, sv);
  float kSpur = (1.0 - smoothstep(0.0, 0.045, abs(sv-0.25))) * step(0.06, tr) * 0.8;
  // das Band folgt dem Relief wie ein Laserstrich
  float y = suv.y - (tiefe-0.5)*0.03*fig;
  float px = 1.0/uStage.y;
  float mBand = smoothstep(uBand.x-px, uBand.x+px, y) * (1.0 - smoothstep(uBand.y-px, uBand.y+px, y));
  float kBand = (1.0 - smoothstep(px, 3.0*px, abs(y-uBand.x))) + (1.0 - smoothstep(px, 3.0*px, abs(y-uBand.y)));
  kBand += 0.30*exp(-abs(y-uBand.y)*70.0)*step(y, uBand.y) + 0.30*exp(-abs(y-uBand.x)*70.0)*step(uBand.x, y);
  kante = max(kSpur*0.75, kBand);
  return max(max(mSpur, mBand), uForce);
}

// Ein Signet: immer abtasten (keine Ableitung in einer Verzweigung), ausserhalb des Rechtecks wirkungslos
vec3 signet(vec3 exo, vec4 g, vec2 mass, float nr, vec2 qv, vec4 vis, float aspE, vec2 tw){
  float hs = mass.x * 2.0 * vis.w * g.z;
  vec2 u = (qv - vec2(g.x * vis.z * aspE, g.y * vis.w)) / vec2(hs * mass.y, hs) + 0.5;
  float innen = step(0.0, u.x) * step(u.x, 1.0) * step(0.0, u.y) * step(u.y, 1.0) * step(nr + 0.5, uSigN);
  vec4 sg = texture2D(tSig, vec2((nr + clamp(u.x, 0.006, 0.994)) / 3.0, clamp(u.y, 0.0, 1.0)));
  // Farbe unveraendert; nur Deckkraft, Visierrand und die Glanzlichter des Glases obenauf
  return mix(exo, sg.rgb, sg.a * g.w * innen * smoothstep(0.0, 0.10, tw.r) * (1.0 - tw.g * 0.9));
}

Lage lage(sampler2D tF, sampler2D tT, sampler2D tE, sampler2D tET, vec4 rect, vec4 ex, vec2 asp, vec3 gF, vec3 gE,
          sampler2D tV, vec4 vis, vec3 licht, float visAn, vec2 visM, float sigAn, float sp){
  Lage L; L.col = vec3(0.0); L.a = 0.0; L.tiefe = 0.0; L.fig = 0.0; L.kante = 0.0;
  vec2 uv = (vS - rect.xy) / rect.zw;
  // Achse der Figur im Foto: die Exo-Achse (Visiermitte) ueber die Ausrichtung zurueckgerechnet (Drehung vernachlaessigt)
  float axF = ((visM.x - 0.5) * asp.y * ex.z + ex.x + asp.x * 0.5) / asp.x;
  // links ist bis zum gespiegelten Gegenrand Bild vorhanden, rechts und oben/unten endet es wie bisher
  if (uv.x < (2.0*axF - 1.0) * sp || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return L;
  // 2,5D: leichte Parallaxe ueber die Tiefenkarte
  float d0 = texSp(tT, uv, axF, sp).r;
  vec2 uvp = uv - uNeig * (d0 - 0.45) * vec2(1.0/asp.x, 1.0);
  uvp = vec2(min(uvp.x, 1.0), clamp(uvp.y, 0.0, 1.0));   // links nicht klemmen, dort spiegelt texSp
  vec3 tf = texSp(tT, uvp, axF, sp).rgb;
  // Exo: Aehnlichkeitsabbildung relativ zum Foto (Einheit Bildhoehe)
  vec2 p = vec2(uvp.x*asp.x, uvp.y) - vec2(asp.x*0.5, 0.5) - ex.xy;
  float c = cos(ex.w), s = sin(ex.w);
  vec2 q = vec2(c*p.x + s*p.y, -s*p.x + c*p.y) / ex.z + vec2(asp.y*0.5, 0.5);
  vec2 uvE = vec2(q.x/asp.y, q.y);
  float inE = step((2.0*visM.x - 1.0) * sp, uvE.x)*step(uvE.x, 1.0)*step(0.0, uvE.y)*step(uvE.y, 1.0);
  vec3 te = texSp(tET, uvE, visM.x, sp).rgb * inE;
  float fig = max(tf.b, te.b);
  float kante;
  float m = exoMaske(mix(tf.r, te.r, 0.5), fig, kante);
  vec3 hier = grundBei(vS / uStage, uGrund, uMitte, uStage.x / uStage.y);
  vec3 foto = texSp(tF, uvp, axF, sp).rgb + (hier - gF) * (1.0 - tf.b);
  vec3 exo = texSp(tE, uvE, visM.x, sp).rgb + (hier - gE) * (1.0 - te.b);
  if (visAn > 0.001) {
    // Netz im Visier: liegt hinter dem Glas (gewoelbt, gedaempft, zum Rand ausgeblendet), Glanzlichter bleiben obenauf
    vec2 tv = texture2D(tV, uvE).rg * inE;
    vec2 pv = (uvE - vis.xy) / vis.zw;
    float r2 = min(dot(pv, pv), 1.0);
    vec2 sv = pv * mix(0.56, 0.98, r2) - uNeig * 16.0;
    vec2 nuv = sv * 0.5 + 0.5;
    float nz = texture2D(tVNetz, nuv).a;
    // weicher Schein um Knoten und Signale (vier versetzte Abtastungen), damit sie hinter dem Glas lesbar bleiben
    float e = 0.006;
    float ng = (texture2D(tVNetz, nuv + vec2(e, 0.0)).a + texture2D(tVNetz, nuv - vec2(e, 0.0)).a
              + texture2D(tVNetz, nuv + vec2(0.0, e)).a + texture2D(tVNetz, nuv - vec2(0.0, e)).a) * 0.25;
    float blende = smoothstep(0.02, 0.9, tv.r) * (1.0 - smoothstep(0.70, 1.04, sqrt(r2)));
    exo += licht * min(nz * 4.6 + ng * 2.6, 1.0) * 0.86 * blende * (1.0 - tv.g) * visAn;
  }
  if (sigAn > 0.5) {
    vec2 tw = texture2D(tV, uvE).rg * inE;
    // Abstand zum Visier-Schwerpunkt in Bildhoehen, zurueck in Bildschirmrichtung gedreht: Signete bleiben aufrecht
    vec2 qv = (uvE - visM) * vec2(asp.y, 1.0);
    qv = vec2(c*qv.x - s*qv.y, s*qv.x + c*qv.y);
    exo = signet(exo, uSig[0], uSigMass[0], 0.0, qv, vis, asp.y, tw);
    exo = signet(exo, uSig[1], uSigMass[1], 1.0, qv, vis, asp.y, tw);
    exo = signet(exo, uSig[2], uSigMass[2], 2.0, qv, vis, asp.y, tw);
  }
  L.col = mix(foto, exo, m);
  // Rand weich: links nur ohne Spiegel, rechts immer (Seitenansichten schneiden dort die Schulter ab, 15.11.2026)
  L.a = mix(tf.g, te.g, m) * mix(smoothstep(0.0, RAND_W, uv.x), 1.0, sp) * (1.0 - smoothstep(1.0 - RAND_W, 1.0, uv.x));
  L.tiefe = mix(tf.r, te.r, m);
  L.fig = mix(tf.b, te.b, m);
  L.kante = kante * fig;
  return L;
}

void main(){
  Lage A = lage(tFotoA, tTiefeA, tExoA, tExoTiefeA, uRectA, uExoA, uAspA, uGrundFA, uGrundEA, tVisierA, uVisA, uLichtA, uVisAnA, uVisMA, uSigAnA, uSpA);
  vec3 col = A.col; float a = A.a; float fig = A.fig; float kante = A.kante;
  if (uB > 0.5) {
    Lage Bl = lage(tFotoB, tTiefeB, tExoB, tExoTiefeB, uRectB, uExoB, uAspB, uGrundFB, uGrundEB, tVisierB, uVisB, uLichtB, uVisAnB, uVisMB, uSigAnB, uSpB);
    float x = vS.x + (max(A.tiefe, Bl.tiefe) - 0.5) * uSichtW * 0.10;
    float d = (x - uSichtX) * uSichtDir;         // > 0: Band noch nicht da -> alte Ansicht
    float alt = smoothstep(-0.75, 0.75, d);
    col = mix(Bl.col, A.col, alt); a = mix(Bl.a, A.a, alt); fig = max(A.fig, Bl.fig);
    kante = mix(Bl.kante, A.kante, alt);
    float linie = 1.0 - smoothstep(1.0, 3.0, abs(d));
    float schweif = exp(d / (uSichtW*0.16)) * step(d, 0.0) * 0.30;
    kante = max(kante, (linie + schweif) * fig);
    a = max(a, linie * 0.0);
  }
  // sichtbares Fenster in y (Uebergang Portraet <-> Ganzkoerper), Kante am Fensterrand
  float fen = smoothstep(uFenster.x-0.75, uFenster.x+0.75, vS.y) * (1.0 - smoothstep(uFenster.y-0.75, uFenster.y+0.75, vS.y));
  float fk = (1.0 - smoothstep(1.0, 3.0, abs(vS.y-uFenster.y))) + 0.28*exp(-(uFenster.y-vS.y)/ (uStage.y*0.02))*step(vS.y, uFenster.y);
  kante = max(kante, fk * fig * step(-1.0e4, -abs(uFenster.y)));
  a *= fen;
  // Lichtkreis auf ein Bauteil
  if (uPunkt.w > 0.001) {
    float dp = distance(vS, uPunkt.xy) / max(uPunkt.z, 1.0);
    float innen = 1.0 - smoothstep(0.72, 1.0, dp);
    float ring = 1.0 - smoothstep(0.0, 0.035, abs(dp - 1.0));
    col *= mix(1.0, mix(0.50, 1.10, innen), uPunkt.w);
    col += uKante * (ring * 0.9 + innen * 0.05) * uPunkt.w;
    a = max(a, ring * uPunkt.w * 0.9);
  }
  col += uKante * kante * 0.9;   // Kantenfarbe unveraendert aus figuren.json (keine aufgehellte Markenfarbe)
  gl_FragColor = vec4(col, a * uFade);
}`;
