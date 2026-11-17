"""Erzeugt public/og/neuralnautic-og.png (1200 x 627) aus tools/og-bild/og.html.

Logos kommen aus den Brand-Assets im Vault (nie nachgebaut, nicht ins Repo kopiert),
Schriften aus node_modules wie auf der Seite. Aufruf aus dem Repo-Ordner:

    python -I tools/og_bild.py [ziel.png]

Seit 17.11.2026: ohne „echte“ (Leitsatz wie H1 /ueber-mich), for42-Wortmarke nur einmal.
"""
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent
MARKEN = Path(r"C:\Users\frank\ObsidianVault\Ressourcen\Brand-Assets")
ERSATZ = {
    "__NN__": MARKEN / "neuralnautic" / "nn-monogramm.png",
    "__FOR42__": MARKEN / "for42" / "for42-wordmark-weiss.svg",
    "__INTER_TIGHT__": REPO / "node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2",
    "__INTER__": REPO / "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
}


def main() -> None:
    ziel = Path(sys.argv[1]) if len(sys.argv) > 1 else REPO / "public/og/neuralnautic-og.png"
    html = (REPO / "tools/og-bild/og.html").read_text(encoding="utf-8")
    for platzhalter, pfad in ERSATZ.items():
        if not pfad.exists():
            sys.exit(f"fehlt: {pfad}")
        html = html.replace(platzhalter, pfad.as_uri())
    temp = REPO / "tools/og-bild/_render.html"
    temp.write_text(html, encoding="utf-8")
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            seite = browser.new_page(viewport={"width": 1200, "height": 627}, device_scale_factor=1)
            seite.goto(temp.as_uri())
            seite.evaluate("document.fonts.ready")
            seite.wait_for_timeout(300)
            fehlend = seite.evaluate("[...document.images].filter(i => !i.naturalWidth).map(i => i.src)")
            if fehlend:
                sys.exit(f"Bild nicht geladen: {fehlend}")
            seite.screenshot(path=str(ziel), clip={"x": 0, "y": 0, "width": 1200, "height": 627})
            browser.close()
    finally:
        temp.unlink(missing_ok=True)
    print("geschrieben:", ziel)


if __name__ == "__main__":
    main()
