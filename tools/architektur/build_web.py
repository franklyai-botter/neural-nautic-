#!/usr/bin/env python3
"""Baut Grafik und Raummodell der KI-Architektur für die Website.

Schreibt:
    app/api/architektur-download/grafik.generated.ts   isometrische Grafik als SVG-String,
                         nur über das Download-Formular abrufbar (nicht in public/)
    app/components/architektur3d.generated.ts          Markup der Raumansicht

und nach public/architektur/:
    model3d.js           Renderer, unverändert aus rag-referenzarchitektur
    model3d.css          Schriften + Bühnen-CSS des Renderers
    szene.json           Ebenen, Knoten, Kanten, Farben

Die Inhalte stehen in build_grafik.py (LAYERS, EDGES, PANELS). Nach jeder Änderung dort:

    python -I tools/architektur/build_web.py
"""

import json
import shutil
import sys
from pathlib import Path

TOOLS = Path(__file__).resolve().parent
sys.path.insert(0, str(TOOLS))

import build_grafik as G  # noqa: E402
import build_3d as B      # noqa: E402

ROOT = TOOLS.parent.parent
OUT = ROOT / "public" / "architektur"
DL = ROOT / "app" / "api" / "architektur-download"


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    DL.mkdir(parents=True, exist_ok=True)

    svg, w, h = G.build()
    # Die Grafik liegt bewusst NICHT in public/: Download nur über das Formular
    # (Name, E-Mail, Telefon), ausgeliefert von der API-Route.
    (DL / "grafik.generated.ts").write_text(
        "// Erzeugt von tools/architektur/build_web.py, nicht von Hand ändern.\n"
        f"const svg = {json.dumps(svg, ensure_ascii=False)};\nexport default svg;\n",
        encoding="utf-8")
    stale = OUT / "ki-architektur.svg"
    if stale.exists():
        stale.unlink()
    (ROOT / "app" / "components" / "architektur3d.generated.ts").write_text(
        "// Erzeugt von tools/architektur/build_web.py, nicht von Hand ändern.\n"
        f"export const MARKUP = {json.dumps(B.markup(), ensure_ascii=False)};\n",
        encoding="utf-8")

    shutil.copyfile(TOOLS / "model3d.js", OUT / "model3d.js")
    css = B.font_faces() + B.styles("min(86vh, 880px)", framed=True)
    (OUT / "model3d.css").write_text(css, encoding="utf-8")
    (OUT / "szene.json").write_text(json.dumps(B.scene(), ensure_ascii=False), encoding="utf-8")

    print(f"ki-architektur.svg: {w:.0f} x {h:.0f} px, {len(svg)/1024:.0f} KB")
    print(f"model3d.css: {len(css)/1024:.0f} KB · szene.json · model3d.js")


if __name__ == "__main__":
    main()
