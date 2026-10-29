#!/usr/bin/env python3
"""Baut die räumliche Ansicht — eigenständig als modell-3d.html und als Fragment,
das build_pages.py an die Stelle des Bildes setzt.

Die Szene wird aus build_grafik.py importiert, nicht abgeschrieben: gleiche Ebenen,
gleiche Knoten, gleiche Kanten, gleiche Farbsemantik. Damit können Grafik und
Raumansicht nicht auseinanderlaufen.

Farben und Schriften leitet `theme()` aus derselben Palette ab. Dieselbe Datei
läuft deshalb unverändert im hellen for42- und im dunklen Neural-Nautic-Repo.

Aufruf:  python3 tools/build_3d.py
"""

import json
from pathlib import Path

import build_grafik as G

ROOT = Path(__file__).resolve().parent.parent
TOOLS = Path(__file__).resolve().parent

# Wortmarke der eigenständigen Seite — im anderen Repo entsprechend gesetzt.
BRAND = 'NeuralNautic'


def is_dark(hexcol):
    """Grobe Helligkeit — entscheidet, ob Konturen hell oder dunkel sein müssen."""
    h = hexcol.lstrip("#")
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return (0.299 * r + 0.587 * g + 0.114 * b) < 128


def theme():
    """Farben und Schriften für den Renderer, gezogen aus build_grafik.py.

    Nur vier Werte gibt es dort nicht, weil sie in der flachen Grafik keine
    Entsprechung haben: der Grund der Bühne, die Kontur hinter Beschriftungen,
    die Fläche des Reglerfelds und die Akzentfarbe der Regler.
    """
    dark = is_dark(G.BG)
    tint = getattr(G, "BG_TINT", None) or getattr(G, "BG_TIDE", G.BG)
    stage = (f"radial-gradient(120% 90% at 50% 8%, {tint}, {G.BG} 72%)" if dark
             else f"linear-gradient(180deg, {tint}, {G.BG} 62%)")
    return dict(
        stage=stage,
        panel=("rgba(10,32,40,.86)" if dark else "rgba(255,255,255,.88)"),
        line=G.LINE,
        ink=G.INK,
        muted=G.INK_FAINT,
        label=G.INK_LABEL,
        halo=(tint if dark else "#ffffff"),
        accent=G.CYAN,
        display=G.F_DISPLAY if "," in G.F_DISPLAY else f"{G.F_DISPLAY},sans-serif",
        sans=G.F_SANS if "," in G.F_SANS else f"{G.F_SANS},system-ui,sans-serif",
        mono=G.F_MONO if "," in G.F_MONO else f"{G.F_MONO},ui-monospace,monospace",
    )


def scene():
    """Szene als JSON — Ebenen, Knoten, Kanten, Maße, Thema."""
    layers = []
    for li, layer in enumerate(G.LAYERS):
        entry = dict(title=layer["title"], role=layer["role"], color=layer["color"],
                     y=layer["y"], nodes=[])
        for nd in layer["nodes"]:
            entry["nodes"].append(dict(
                id=nd["id"], label=nd["label"], x=nd["x"], z=nd["z"], y=layer["y"],
                color=nd.get("color", layer["color"]), big=bool(nd.get("big")), layer=li))
        layers.append(entry)

    edges = [dict(a=a, b=b, color=c, w=w) for a, b, c, w in G.EDGES]
    return dict(layers=layers, edges=edges, theme=theme(),
                box=dict(w=G.BOX_W, d=G.BOX_D),
                legend=[dict(color=c, label=t) for c, t in G.LEGEND])


def font_faces():
    b64 = json.loads((TOOLS / "fonts_b64.json").read_text())
    return "".join(
        f"@font-face{{font-family:'{f}';font-style:normal;font-weight:100 900;"
        f"src:url(data:font/woff2;base64,{b64[f]}) format('woff2');font-display:block;}}"
        for f in b64)


def styles(height, framed=True):
    """CSS der Bühne. Alles unter `.m3d`, damit es sich in eine Seite einfügt."""
    t = theme()
    frame = (f"border:1px solid {t['line']};border-radius:4px" if framed
             else "border:0;border-radius:0")
    return f"""
  .m3d{{position:relative;height:{height};overflow:hidden;background:{t['stage']};
    {frame}}}
  .m3d:focus-visible{{outline:2px solid {t['accent']};outline-offset:2px}}
  .m3d canvas{{display:block;width:100%;height:100%}}

  .m3d .m3d-legend{{position:absolute;bottom:18px;left:22px;display:flex;flex-wrap:wrap;
    gap:6px 18px;font-family:{t['mono']};font-size:11.5px;color:{t['muted']};
    pointer-events:none}}
  .m3d .m3d-legend i{{font-style:normal;display:inline-flex;align-items:center;gap:7px}}
  .m3d .m3d-legend b{{width:10px;height:10px;display:inline-block;border-radius:1px}}

  .m3d .m3d-hint{{position:absolute;right:22px;bottom:18px;font-family:{t['mono']};
    font-size:11.5px;color:{t['muted']};pointer-events:none}}

  .m3d .m3d-ctl{{position:absolute;top:18px;right:22px;width:206px;padding:14px;
    border:1px solid {t['line']};border-radius:4px;background:{t['panel']};
    -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}}
  .m3d .m3d-ctl h2{{margin:0 0 10px;font-family:{t['display']};font-size:11.5px;
    font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:{t['ink']}}}
  .m3d .m3d-ctl label{{display:grid;grid-template-columns:14px 1fr 38px;align-items:center;
    gap:8px;margin:8px 0;font-family:{t['mono']};font-size:11.5px;color:{t['muted']}}}
  .m3d .m3d-ctl output{{text-align:right;font-variant-numeric:tabular-nums}}
  .m3d .m3d-ctl input[type=range]{{width:100%;accent-color:{t['accent']};margin:0}}
  .m3d .m3d-ctl button{{margin-top:10px;width:100%;padding:7px 10px;
    border:1px solid {t['line']};border-radius:4px;background:transparent;
    color:{t['ink']};cursor:pointer;font-family:{t['display']};font-size:12px;
    font-weight:600}}
  .m3d .m3d-ctl button:hover{{border-color:{t['accent']};color:{t['accent']}}}
  @media (max-width:820px){{.m3d .m3d-ctl{{display:none}}}}
"""


def markup(hint="Mausrad dreht &middot; linke Taste halten stellt den Blick ein"):
    legend = "\n    ".join(
        f'<i><b style="background:{c}"></b>{t}</i>' for c, t in G.LEGEND)
    return f"""<div class="m3d" tabindex="0" aria-label="Räumliches Modell der Architektur, drehbar">
  <canvas id="model"></canvas>
  <div class="m3d-legend">
    {legend}
  </div>
  <div class="m3d-ctl">
    <h2>Drehung</h2>
    <label for="rot-x">X<input type="range" id="rot-x" min="-180" max="180" step="1" value="30"><output id="out-x">30°</output></label>
    <label for="rot-y">Y<input type="range" id="rot-y" min="-180" max="180" step="1" value="0"><output id="out-y">0°</output></label>
    <label for="rot-z">Z<input type="range" id="rot-z" min="-180" max="180" step="1" value="0"><output id="out-z">0°</output></label>
    <button id="reset" type="button">Ansicht zurücksetzen</button>
  </div>
  <div class="m3d-hint">{hint}</div>
</div>"""


def fragment(height="min(78vh, 760px)", framed=True):
    """Bausteine für die Einbettung in eine bestehende Seite."""
    return dict(css=styles(height, framed), html=markup(),
                js=(TOOLS / "model3d.js").read_text(encoding="utf-8"),
                scene=json.dumps(scene(), ensure_ascii=False))


PAGE_CSS = """
  *,*::before,*::after{box-sizing:border-box}
  html,body{height:100%;overflow:hidden}
  body{margin:0;font-family:__DISPLAY__;font-size:15px;line-height:1.6;
    -webkit-font-smoothing:antialiased;background:__BG__;color:__MUTED__}
  .brand{position:absolute;top:22px;left:28px;font-family:__DISPLAY__;
    font-size:19px;font-weight:700;letter-spacing:-.01em;color:__INK__;z-index:2}
  .brand span{color:__ACCENT__}
  .caption{position:absolute;top:74px;left:28px;max-width:22rem;z-index:2;
    pointer-events:none}
  .caption h1{font-family:__DISPLAY__;font-weight:700;letter-spacing:-.02em;
    font-size:clamp(24px,3.4vw,38px);line-height:1.08;color:__INK__;margin:0}
  .caption h1 em{font-style:normal;color:__ACCENT__}
  .caption p{margin:10px 0 0;font-size:14px;color:__MUTED__;max-width:30ch}
  @media (max-width:720px){.caption{top:64px;left:20px}.brand{left:20px}}
"""


def build():
    t = theme()
    css = PAGE_CSS
    for key, val in (("__DISPLAY__", t["display"]), ("__BG__", G.BG),
                     ("__INK__", t["ink"]), ("__MUTED__", t["muted"]),
                     ("__ACCENT__", t["accent"])):
        css = css.replace(key, val)

    f = fragment(height="100vh", framed=False)
    page = f"""<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="RAG-Referenzarchitektur als räumliches Modell, frei drehbar um alle drei Achsen.">
<title>AI-/RAG-Plattform — Modell im Raum</title>
<style>{font_faces()}</style>
<style>{css}{f['css']}</style>
</head>
<body>
<div class="brand">{BRAND}</div>
<div class="caption">
  <h1>AI-/RAG-Plattform<br><em>Modell im Raum</em></h1>
  <p>Das Mausrad dreht das Modell, die gehaltene linke Maustaste stellt den Blick frei ein.
     Fünf Ebenen, von der Akquise oben bis zur Inferenz in der EU unten.</p>
</div>
{f['html']}
<script>window.SCENE = {f['scene']};</script>
<script>{f['js']}</script>
</body>
</html>
"""
    (ROOT / "modell-3d.html").write_text(page, encoding="utf-8")
    print(f"modell-3d.html: {len(page)/1024:.0f} KB")



if __name__ == "__main__":
    build()
