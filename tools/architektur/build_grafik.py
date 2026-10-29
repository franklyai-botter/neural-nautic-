#!/usr/bin/env python3
"""Erzeugt die isometrische Grafik der KI-Architektur in sieben Schichten
(Seite /ki-im-unternehmen, Abschnitt Architektur).

Generator und Zeichenlogik stammen unverändert aus dem Repo rag-referenzarchitektur
(tools/build_grafik.py); hier ausgetauscht sind nur die Daten (LAYERS, EDGES, PANELS,
LEGEND) und die Texte in Kopf und Fuß. Aufruf über tools/architektur/build_web.py.
"""

import math
import sys
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent.parent.parent

# ---------------------------------------------------------------- Projektion

COS30 = math.cos(math.radians(30))


def proj(x, y, z):
    """Isometrie: +x nach rechts-unten, +z nach links-unten, +y nach oben."""
    return ((x - z) * COS30, (x + z) * 0.5 - y)


# ---------------------------------------------------------------- Palette

# Übernommen aus dem Neural-Nautic-Designsystem (neural-nautic-/app/globals.css).
# Tiefsee-Inks als Grund, Cyan als Marken-Akzent, Silber/Ivory als Schrift.

BG = "#061419"              # --ink-abyss
BG_TIDE = "#0E2B36"         # --ink-tide, für den Dunst hinter der Vitrine
INK = "#F5F5F2"             # --silver-white
INK_LABEL = "#CDCED2"       # --silver-bright, Knotenbeschriftung
INK_DIM = "#9C9CA4"         # --silver-mid
INK_FAINT = "#707078"       # --silver-deep
IVORY = "#F5F2EB"           # --ivory, nur für den Titel
LINE = "rgba(205,206,210,0.16)"   # --border-2

# Semantik über die Signalfarben des Systems, nicht über frei gewählte Töne.
BLUE = "#6EA8FF"            # wie im RAG-Referenzmodell → hier: Modelle
SAND = "#F5C97A"            # --signal-warn    → Daten & Wissen
CYAN = "#3FD4E0"            # --glow-cyan      → Anwendung & Steuerung
CORAL = "#F08A7A"           # --signal-alert   → Pflicht, Datenschutz, Governance
GREY = "#9C9CA4"            # --silver-mid     → Betrieb & Infrastruktur

F_DISPLAY = "Italiana"
F_SANS = "Inter"
F_MONO = "'JetBrains Mono'"


def font_style():
    """Hausschriften als data-URI ins SVG, damit die Grafik ohne Netz auskommt."""
    import json
    b64 = json.loads((Path(__file__).parent / "fonts_b64.json").read_text())
    faces = {"Inter": "100 900", "Italiana": "400", "JetBrains Mono": "100 800"}
    out = []
    for fam, weight in faces.items():
        out.append(
            f"@font-face{{font-family:'{fam}';font-style:normal;font-weight:{weight};"
            f"src:url(data:font/woff2;base64,{b64[fam]}) format('woff2');}}"
        )
    return "<style>" + "".join(out) + "</style>"


def shade(hex_color, factor):
    """Farbe abdunkeln (factor < 1) oder aufhellen (factor > 1)."""
    r = int(hex_color[1:3], 16)
    g = int(hex_color[3:5], 16)
    b = int(hex_color[5:7], 16)
    f = lambda v: max(0, min(255, int(v * factor)))
    return f"#{f(r):02x}{f(g):02x}{f(b):02x}"


# ---------------------------------------------------------------- Szene

BOX_W, BOX_D = 820, 470          # Grundfläche der Vitrine
CUBE = 30                        # Kantenlänge der Knotenwürfel

# Sieben Schichten von oben nach unten: Governance oben, Betrieb als Sockel.
LAYERS = [
    dict(
        key="gov", y=2620, color=CORAL,
        title="7 · GOVERNANCE", role="Compliance · Verantwortung",
        intake="Geschäftsführung / Revision",
        nodes=[
            dict(id="policy", label="KI-Richtlinie", x=130, z=90, anchor="r"),
            dict(id="raci", label="Rollen & RACI", x=430, z=110, anchor="r"),
            dict(id="risk", label="Risikomanagement", x=200, z=360, anchor="l"),
            dict(id="aiact", label="Einstufung EU AI Act", x=520, z=300, anchor="r"),
            dict(id="audit", label="Prüfpfad", x=740, z=420, anchor="r", big=True),
        ],
    ),
    dict(
        key="dsg", y=2200, color=CORAL,
        title="6 · DATENSCHUTZ", role="Sicherheit · DSGVO",
        intake="Datenschutz / IT-Sicherheit",
        nodes=[
            dict(id="avv", label="DSGVO & AVV", x=140, z=80, anchor="r"),
            dict(id="loesch", label="Löschkonzept", x=200, z=360, anchor="l"),
            dict(id="crypt", label="Verschlüsselung", x=460, z=150, anchor="r"),
            dict(id="access", label="Zugriffssteuerung", x=690, z=330, anchor="r", big=True),
        ],
    ),
    dict(
        key="app", y=1780, color=CYAN,
        title="5 · ANWENDUNGEN", role="5a intern · 5b für Kunden",
        intake="Mitarbeitende / Kunden",
        nodes=[
            dict(id="assist", label="Assistenten", x=110, z=60, anchor="r", note="5a intern"),
            dict(id="auto", label="Automatisierung", x=330, z=150, anchor="r"),
            dict(id="search", label="Wissenssuche", x=150, z=330, anchor="l"),
            dict(id="service", label="Kundenservice", x=600, z=200, anchor="r", note="5b für Kunden"),
            dict(id="product", label="Produktfunktionen", x=720, z=410, anchor="r"),
        ],
    ),
    dict(
        key="orch", y=1360, color=CYAN,
        title="4 · ORCHESTRIERUNG", role="Abläufe · Agenten",
        intake="jede Anfrage, jeder Ablauf",
        nodes=[
            dict(id="flow", label="Ablaufsteuerung", x=140, z=90, anchor="r"),
            dict(id="agent", label="Agenten-Zuweisung", x=200, z=360, anchor="l"),
            dict(id="gw", label="Modellzugang (LLM-Gateway)", x=470, z=250, anchor="r", big=True),
            dict(id="guard", label="Leitplanken", x=700, z=110, anchor="r"),
            dict(id="prompt", label="Anweisungen (Prompts)", x=760, z=300, anchor="r"),
            dict(id="log", label="Protokollierung", x=40, z=200, anchor="l"),
        ],
    ),
    dict(
        key="model", y=940, color=BLUE,
        title="3 · MODELLE", role="3a Cloud · 3b offen · 3c speziell",
        intake="Auswahl nach Aufgabe und Datenklasse",
        nodes=[
            dict(id="cloud", label="Cloud-LLM, EU-Region", x=200, z=110, anchor="r", note="3a mit AVV"),
            dict(id="open", label="Offene Modelle", x=470, z=250, anchor="r", note="3b eigener Betrieb"),
            dict(id="emb", label="Embeddings", x=150, z=380, anchor="l", note="3c"),
            dict(id="vision", label="Bild & Sprache", x=730, z=390, anchor="r", note="3c"),
        ],
    ),
    dict(
        key="data", y=520, color=SAND,
        title="2 · DATEN & WISSEN", role="Einlesen → Index → Abruf",
        intake="ERP · CRM · Dokumente · Ablagen",
        nodes=[
            dict(id="src", label="Unternehmensdaten", x=110, z=70, anchor="r"),
            dict(id="pipe", label="Dokumentenverarbeitung", x=330, z=140, anchor="r"),
            dict(id="index", label="Wissensindex (RAG)", x=540, z=260, anchor="r", big=True),
            dict(id="klass", label="Datenklassen", x=170, z=380, anchor="l"),
            dict(id="rights", label="Berechtigungen", x=760, z=420, anchor="r"),
        ],
    ),
    dict(
        key="infra", y=100, color=GREY,
        title="1 · INFRASTRUKTUR", role="Cloud · eigene Server · hybrid",
        intake="Rechenzentrum in der EU",
        nodes=[
            dict(id="rz", label="EU-Rechenzentrum", x=150, z=100, anchor="r"),
            dict(id="deploy", label="Container und Bereitstellung", x=430, z=230, anchor="r", big=True),
            dict(id="monitor", label="Überwachung", x=720, z=150, anchor="r"),
            dict(id="backup", label="Datensicherung", x=640, z=420, anchor="r"),
        ],
    ),
]

# Kanten entlang des Datenflusses: Anfrage von oben (Anwendung) über das Gateway
# zu den Modellen, Wissen von unten über den Index; Pflichten greifen quer ein.
EDGES = [
    # Daten & Wissen
    ("src", "pipe", SAND, 1), ("pipe", "index", SAND, 2),
    ("klass", "pipe", SAND, 1), ("rights", "index", SAND, 1),
    ("emb", "index", BLUE, 1),
    # Anwendungen → Orchestrierung
    ("assist", "flow", CYAN, 1), ("auto", "flow", CYAN, 1),
    ("search", "agent", CYAN, 1), ("service", "agent", CYAN, 1),
    ("product", "gw", CYAN, 1),
    ("flow", "gw", CYAN, 2), ("agent", "gw", CYAN, 2),
    ("guard", "gw", CYAN, 1), ("prompt", "gw", CYAN, 1),
    # Wissen in die Orchestrierung
    ("index", "agent", SAND, 2),
    # Gateway → Modelle: einziger Ausgang
    ("gw", "cloud", BLUE, 2), ("gw", "open", BLUE, 3), ("gw", "vision", BLUE, 1),
    # Pflichten greifen durch
    ("log", "audit", CORAL, 2),
    ("loesch", "index", CORAL, 2),
    # Betrieb trägt das Gateway
    ("deploy", "gw", GREY, 1), ("monitor", "gw", GREY, 1),
]

PANELS = [
    dict(
        title="REGULIERUNG GEHT DURCH ALLE SCHICHTEN", accent=CORAL,
        lines=[
            "DSGVO       Daten, Modelle, Anwendungen",
            "EU AI Act   Anwendungen, Orchestrierung,",
            "            Governance",
            "NIS2        Infrastruktur, Sicherheit",
        ],
        foot=("Regulierung ist keine Schicht, die man zum Schluss aufsetzt. "
              "Sie bestimmt Entscheidungen auf jeder Ebene. NIS2 nur, wo das "
              "Unternehmen betroffen ist."),
    ),
    dict(
        title="EIN AUSGANG ZU DEN MODELLEN", accent=CYAN,
        lines=[
            "→  Jede Anfrage läuft über den Modellzugang",
            "→  Verteilung nach Aufgabe und Datenklasse",
            "→  Budgets und Kosten je Anfrage sichtbar",
            "→  Modellwechsel = Einstellung, kein Umbau",
        ],
        foot="Kein Agent und keine Anwendung spricht an der Steuerung vorbei mit einem Modell.",
    ),
    dict(
        title="MODELLWAHL NACH DATENKLASSE", accent=BLUE,
        lines=[
            "3a  Cloud-Modelle per API, EU-Region, AVV",
            "3b  Offene Modelle im eigenen Betrieb",
            "3c  Spezialmodelle: Embeddings, Bild, Sprache",
        ],
        foot="Welches Modell eine Aufgabe übernimmt, entscheidet die Datenklasse, nicht die Vorliebe.",
    ),
    dict(
        title="WISSEN MIT QUELLE", accent=SAND,
        lines=[
            "→  Datenklassen schon beim Einlesen vergeben",
            "→  Wissenssuche (RAG) mit Quellenangabe",
            "→  Berechtigungen gelten auch für die KI",
            "→  Löschen wirkt bis in den Index",
        ],
        foot="Die KI sieht nur, was die fragende Person auch sehen darf.",
    ),
    dict(
        title="BETRIEB IN DER EU", accent=GREY,
        lines=[
            "Cloud, eigene Server oder hybrid",
            "Bereitstellung · Überwachung · Datensicherung",
            "Rechenzentrum in der EU als Standard",
        ],
        foot="Welche Schichten Sie selbst betreiben und welche Sie einkaufen, ist eine Entscheidung je Schicht.",
    ),
    dict(
        title="WAS SIE BEKOMMEN", accent=CYAN,
        lines=[
            "→  Dokumentierte Zielarchitektur",
            "→  Entscheidungsvorlage je Schicht",
            "→  Kostenmodell monatlich und jährlich",
            "→  Lizenzprüfung der Komponenten",
        ],
        foot="Umsetzbar durch Ihre IT oder gemeinsam mit uns.",
    ),
]

LEGEND = [
    (CYAN, "Anwendung & Steuerung"),
    (BLUE, "Modelle"),
    (SAND, "Daten & Wissen"),
    (CORAL, "Pflicht & Datenschutz"),
    (GREY, "Betrieb"),
]

# Kopf, Fuß und Signatur — im RAG-Generator fest verdrahtet, hier als Daten.
KICKER = "KI-ARCHITEKTUR — REFERENZMODELL"
TITLE_1 = "KI im Unternehmen"
TITLE_2 = "Sieben Schichten"
META = "NeuralNautic   ·   Stand 2026-10-29   ·   EU-Residenz als Standard"
FOOTER = "NeuralNautic   ·   Referenzmodell für KI im Mittelstand   ·   neuralnautic.de"
SIGNATURE = "Referenzmodell"


# ---------------------------------------------------------------- Zeichnen

class Svg:
    def __init__(self):
        self.parts = []

    def add(self, s):
        self.parts.append(s)

    def __str__(self):
        return "\n".join(self.parts)


def pts(points):
    return " ".join(f"{px:.1f},{py:.1f}" for px, py in points)


def text(x, y, s, size=14, fill=INK, family=F_SANS, weight="400",
         anchor="start", spacing=None, opacity=1):
    extra = f' letter-spacing="{spacing}"' if spacing else ""
    op = f' opacity="{opacity}"' if opacity != 1 else ""
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-family="{family}" font-size="{size}" '
            f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{extra}{op}>'
            f'{escape(s)}</text>')


def cube(svg, x, y, z, color, size=CUBE):
    """Isometrischer Würfel: Deckel hell, rechte Fläche mittel, linke dunkel."""
    a = size / 2
    top = [proj(x - a, y + a, z - a), proj(x + a, y + a, z - a),
           proj(x + a, y + a, z + a), proj(x - a, y + a, z + a)]
    right = [proj(x + a, y + a, z - a), proj(x + a, y + a, z + a),
             proj(x + a, y - a, z + a), proj(x + a, y - a, z - a)]
    left = [proj(x - a, y + a, z + a), proj(x + a, y + a, z + a),
            proj(x + a, y - a, z + a), proj(x - a, y - a, z + a)]
    cx, cy = proj(x, y, z)
    svg.add(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{size*1.5:.1f}" '
            f'fill="{color}" opacity="0.13" filter="url(#soft)"/>')
    svg.add(f'<g stroke="{shade(color,1.4)}" stroke-width="1" stroke-linejoin="round">')
    svg.add(f'<polygon points="{pts(left)}" fill="{shade(color,0.42)}" opacity="0.92"/>')
    svg.add(f'<polygon points="{pts(right)}" fill="{shade(color,0.62)}" opacity="0.92"/>')
    svg.add(f'<polygon points="{pts(top)}" fill="{shade(color,1.15)}" opacity="0.95"/>')
    svg.add('</g>')


def route(a, b):
    """Orthogonale Kabelführung zwischen zwei Knoten, über eine Zwischenhöhe."""
    x1, y1, z1 = a["x"], a["_y"], a["z"]
    x2, y2, z2 = b["x"], b["_y"], b["z"]
    if abs(y1 - y2) < 1:
        return [proj(x1, y1, z1), proj(x2, y2, z2)]
    ymid = (y1 + y2) / 2
    return [proj(x1, y1, z1), proj(x1, ymid, z1),
            proj(x2, ymid, z2), proj(x2, y2, z2)]


def build(landscape=False):
    global BOX_W, BOX_D
    if landscape:
        BOX_W, BOX_D = 1150, 330

    nodes = {}
    for layer in LAYERS:
        for n in layer["nodes"]:
            n["_y"] = layer["y"]
            n["_color"] = n.get("color", layer["color"])
            nodes[n["id"]] = n

    ys = [l["y"] for l in LAYERS]
    y_top, y_bot = max(ys) + 80, min(ys) - 45

    # Ausdehnung der Szene bestimmen
    corners = []
    for yy in (y_top, y_bot):
        for xx in (0, BOX_W):
            for zz in (0, BOX_D):
                corners.append(proj(xx, yy, zz))
    sx_min = min(p[0] for p in corners)
    sx_max = max(p[0] for p in corners)
    sy_min = min(p[1] for p in corners)
    sy_max = max(p[1] for p in corners)

    pad_l, pad_t = 520, 320          # Platz für Ebenen-Titel links und Kopf oben
    pad_r, pad_b = 650, 150          # Platz für Randtexte rechts, Legende unten
    margin = 80                      # linke Fluchtlinie für Kopf, Legende, Fußzeile
    ox = pad_l - sx_min
    oy = pad_t - sy_min
    width = (sx_max - sx_min) + pad_l + pad_r
    height = (sy_max - sy_min) + pad_t + pad_b

    svg = Svg()
    svg.add(f'<svg xmlns="http://www.w3.org/2000/svg" width="{width:.0f}" '
            f'height="{height:.0f}" viewBox="0 0 {width:.0f} {height:.0f}">')
    svg.add(font_style())
    svg.add(f'''<defs>
<filter id="soft" x="-70%" y="-70%" width="240%" height="240%">
  <feGaussianBlur stdDeviation="14"/>
</filter>
<filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
  <feGaussianBlur stdDeviation="4" result="b"/>
  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<radialGradient id="haze" cx="50%" cy="42%" r="62%">
  <stemp/>
</radialGradient>
</defs>'''.replace("<stemp/>",
                  f'<stop offset="0%" stop-color="{BG_TIDE}" stop-opacity="0.55"/>'
                  f'<stop offset="100%" stop-color="{BG}" stop-opacity="0"/>'))

    svg.add(f'<rect width="{width:.0f}" height="{height:.0f}" fill="{BG}"/>')
    svg.add(f'<rect width="{width:.0f}" height="{height:.0f}" fill="url(#haze)"/>')

    # ---- Kopf
    svg.add(text(margin, 92, KICKER,
                 size=15, fill=INK_FAINT, family=F_MONO, spacing="3.4"))
    svg.add(text(margin, 176, TITLE_1, size=76, fill=IVORY,
                 family=F_DISPLAY, weight="400"))
    svg.add(text(margin, 248, TITLE_2, size=76, fill=CYAN,
                 family=F_DISPLAY, weight="400"))
    meta = META
    svg.add(text(margin, 292, meta, size=16, fill=INK_DIM, family=F_MONO))

    svg.add(f'<g transform="translate({ox:.1f},{oy:.1f})">')

    # ---- Vitrine: Kanten des Quaders
    def edge(p1, p2, op=0.5, w=1):
        (ax, ay), (bx, by) = p1, p2
        svg.add(f'<line x1="{ax:.1f}" y1="{ay:.1f}" x2="{bx:.1f}" y2="{by:.1f}" '
                f'stroke="{LINE}" stroke-width="{w}" opacity="{op}"/>')

    for zz in (0, BOX_D):
        for xx in (0, BOX_W):
            edge(proj(xx, y_bot, zz), proj(xx, y_top, zz), 0.85)
    for yy in (y_top, y_bot):
        edge(proj(0, yy, 0), proj(BOX_W, yy, 0), 0.85)
        edge(proj(BOX_W, yy, 0), proj(BOX_W, yy, BOX_D), 0.85)
        edge(proj(BOX_W, yy, BOX_D), proj(0, yy, BOX_D), 0.85)
        edge(proj(0, yy, BOX_D), proj(0, yy, 0), 0.85)

    # ---- Ebenen-Böden
    for layer in LAYERS:
        yy = layer["y"]
        floor = [proj(0, yy, 0), proj(BOX_W, yy, 0),
                 proj(BOX_W, yy, BOX_D), proj(0, yy, BOX_D)]
        svg.add(f'<polygon points="{pts(floor)}" fill="{layer["color"]}" '
                f'opacity="0.045" stroke="{layer["color"]}" stroke-opacity="0.30" '
                f'stroke-width="1"/>')

    # ---- Kabel
    for src, dst, color, weight in EDGES:
        a, b = nodes[src], nodes[dst]
        path = route(a, b)
        d = "M " + " L ".join(f"{px:.1f} {py:.1f}" for px, py in path)
        svg.add(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{weight+1.4:.1f}" '
                f'opacity="0.16" filter="url(#glow)"/>')
        svg.add(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{weight:.1f}" '
                f'opacity="0.72" stroke-linecap="round" stroke-linejoin="round"/>')

    # ---- Würfel, hintere zuerst
    ordered = sorted(nodes.values(), key=lambda n: (n["x"] + n["z"]))
    for n in ordered:
        size = CUBE * (1.45 if n.get("big") else 1.0)
        cube(svg, n["x"], n["_y"], n["z"], n["_color"], size)

    # ---- Knoten-Labels
    for n in ordered:
        px, py = proj(n["x"], n["_y"], n["z"])
        size = CUBE * (1.45 if n.get("big") else 1.0)
        if n["anchor"] == "l":
            tx, anchor = px - size * 0.95, "end"
        else:
            tx, anchor = px + size * 0.95, "start"
        svg.add(text(tx, py + 5, n["label"], size=17, fill=INK_LABEL,
                     family=F_MONO, anchor=anchor))
        if n.get("note"):
            svg.add(text(tx, py + 26, n["note"], size=14, fill=INK_FAINT,
                         family=F_MONO, anchor=anchor))

    # ---- Ebenen-Titel links
    for layer in LAYERS:
        lx, ly = proj(0, layer["y"], BOX_D)
        svg.add(f'<line x1="{lx-26:.1f}" y1="{ly:.1f}" x2="{lx-6:.1f}" y2="{ly:.1f}" '
                f'stroke="{layer["color"]}" stroke-width="2" opacity="0.8"/>')
        svg.add(text(lx - 38, ly - 8, layer["title"], size=29, fill=INK,
                     weight="600", anchor="end", spacing="2.2"))
        svg.add(text(lx - 38, ly + 16, layer["role"], size=15, fill=layer["color"],
                     family=F_MONO, anchor="end"))
        svg.add(text(lx - 38, ly + 40, layer["intake"], size=14, fill=INK_FAINT,
                     family=F_MONO, anchor="end"))

    svg.add('</g>')

    # ---- Randtexte rechts
    panel_x = ox + sx_max + 66
    py = pad_t + 24
    for p in PANELS:
        svg.add(f'<line x1="{panel_x:.1f}" y1="{py-26:.1f}" x2="{panel_x+300:.1f}" '
                f'y2="{py-26:.1f}" stroke="{p["accent"]}" stroke-width="2" opacity="0.7"/>')
        svg.add(text(panel_x, py, p["title"], size=15, fill=p["accent"],
                     family=F_MONO, spacing="2.2"))
        py += 32
        for line in p["lines"]:
            svg.add(text(panel_x, py, line, size=15, fill=INK_DIM, family=F_MONO))
            py += 25
        py += 6
        for chunk in wrap(p["foot"], 46):
            svg.add(text(panel_x, py, chunk, size=14.5, fill=INK_FAINT))
            py += 21
        py += 58

    # ---- Legende unten
    ly = height - 96
    lx = margin
    svg.add(text(lx, ly - 26, "FARBE TRÄGT BEDEUTUNG", size=13, fill=INK_FAINT,
                 family=F_MONO, spacing="2.6"))
    for color, label in LEGEND:
        svg.add(f'<rect x="{lx:.1f}" y="{ly-9:.1f}" width="11" height="11" '
                f'fill="{color}" filter="url(#glow)"/>')
        svg.add(text(lx + 22, ly + 1, label, size=15, fill=INK_DIM, family=F_MONO))
        lx += 30 + len(label) * 9.6

    svg.add(text(margin, height - 42,
                 FOOTER,
                 size=14, fill=INK_FAINT, family=F_MONO))

    # Signatur unten rechts: das NN-Monogramm, dazu die Wortmarke in Italiana.
    mono = monogram_b64()
    mw = 104
    mx, my = width - pad_r + 200, height - 168
    svg.add(f'<image x="{mx:.0f}" y="{my:.0f}" width="{mw}" height="{mw}" '
            f'href="data:image/png;base64,{mono}" opacity="0.92"/>')
    svg.add(text(mx + mw / 2, my + mw + 30, "NeuralNautic", size=25, fill=INK_DIM,
                 family=F_DISPLAY, anchor="middle", spacing="1.4"))
    svg.add(text(mx + mw / 2, my + mw + 54, SIGNATURE, size=12.5,
                 fill=INK_FAINT, family=F_MONO, anchor="middle", spacing="1.8"))

    svg.add('</svg>')
    return str(svg), width, height


def monogram_b64(size=300):
    """NN-Monogramm der Website (public/logo-monogram.png), nur für die Einbettung
    verkleinert. Keine abgeleitete Datei im Repo, kein Umfärben."""
    import base64
    import io
    from PIL import Image
    im = Image.open(ROOT / "public" / "logo-monogram.png")
    im.thumbnail((size, size), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "PNG", optimize=True)
    return base64.b64encode(buf.getvalue()).decode()


def wrap(s, n):
    out, line = [], ""
    for word in s.split():
        if len(line) + len(word) + 1 > n:
            out.append(line)
            line = word
        else:
            line = f"{line} {word}".strip()
    if line:
        out.append(line)
    return out


if __name__ == "__main__":
    svg, w, h = build(landscape="--quer" in sys.argv)
    target = ROOT / ("grafik-quer.svg" if "--quer" in sys.argv else "grafik.svg")
    target.write_text(svg, encoding="utf-8")
    print(f"{target.name}: {w:.0f} × {h:.0f} px, {len(svg)} bytes")
