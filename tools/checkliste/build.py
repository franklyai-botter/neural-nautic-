"""Baut die NeuralNautic-KI-Checkliste: HTML -> PDF (Edge headless) -> Kopf/Fuss stempeln -> Abnahme.

Aufruf:  python build.py
Ergebnis: checkliste.pdf (Pruefling fuer check.py) und
          NeuralNautic_KI-Checkliste_Reifegrad-und-Risiko.pdf (Auslieferung, identische Kopie).
"""
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path

HIER = Path(__file__).resolve().parent
HTML = HIER / "checkliste.html"
PDF = HIER / "checkliste.pdf"
ROH = HIER / "checkliste_roh.pdf"
ZIEL = HIER / "NeuralNautic_KI-Checkliste_Reifegrad-und-Risiko.pdf"
SKILL = Path.home() / ".claude" / "skills" / "marken-dokument"
LOGO = Path(r"C:\Users\frank\ObsidianVault\Ressourcen\Brand-Assets\neuralnautic\nn-monogramm.png")
EDGE = Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe")


def main() -> int:
    # Eigenes Profil, sonst reicht Edge den Auftrag an eine laufende Instanz weiter und kehrt sofort zurück.
    profil = tempfile.mkdtemp(prefix="edge-checkliste-")
    subprocess.run([str(EDGE), "--headless", "--disable-gpu", "--no-pdf-header-footer",
                    f"--user-data-dir={profil}", f"--print-to-pdf={ROH}", HTML.as_uri()],
                   check=True, timeout=120)
    for _ in range(60):
        if ROH.is_file() and ROH.stat().st_size > 0:
            break
        time.sleep(1)
    subprocess.run([sys.executable, str(SKILL / "stamp_pdf.py"), str(ROH),
                    "--logo", str(LOGO), "--titel", "KI-Checkliste Reifegrad und Risiko",
                    "--fuss", "NeuralNautic · Checkliste für den Mittelstand · Stand Oktober 2026",
                    "--ab-seite", "2", "--out", str(PDF)], check=True)
    ROH.unlink(missing_ok=True)
    # stamp_pdf.py bettet das Logo je Seite neu ein; Dubletten zusammenlegen, damit der Download klein bleibt.
    import pymupdf
    doc = pymupdf.open(str(PDF))
    doc.set_metadata({"title": "KI-Checkliste Reifegrad und Risiko", "author": "Frank Schütt, NeuralNautic",
                      "subject": "Selbsteinschätzung KI-Reifegrad und Risikoklasse je Vorhaben"})
    doc.save(str(ZIEL), garbage=4, deflate=True, deflate_images=True)
    doc.close()
    shutil.copyfile(ZIEL, PDF)
    return subprocess.run([sys.executable, str(SKILL / "check.py"), str(HTML)]).returncode


if __name__ == "__main__":
    raise SystemExit(main())
