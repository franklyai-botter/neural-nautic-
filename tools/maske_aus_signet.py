"""Maske fuer die Oeffnung des Ladezeichens aus dem Signet ableiten (Frank 17.11.2026).

Das Ladezeichen (Kern bausteine/preloader.css, .bs-lader.is-offen) zoomt das Signet als Loch auf. Benutzt wird dafuer
nur der Alphakanal. Der NN-Kompassstern hat eine feine geschwungene Innenlinie (S-Linie), die im Alphakanal
durchsichtig ist. Beim Aufzoomen wurde genau sie zum dunklen schraegen Balken ueber dem Gesicht im Hero.

Ableitung (das sichtbare Signet bleibt unveraendert, nur die Maske ist abgeleitet):
  1. Alphakanal der Quelle lesen, Schwelle 8 -> Silhouette.
  2. Schliessen (Dilatation, dann Erosion, Fenster 7 px bei 128 px): schmale Luecken wie die S-Linie werden zu,
     die Aussenkontur bleibt, wo sie ist.
  3. Von aussen fluten: alles, was nicht mit dem Bildrand verbunden ist, gehoert zur Figur (innere Loecher zu).
  4. Gefuellte Silhouette um 1 px schrumpfen (Erosion, Fenster 3), damit die Aussenkante die weiche Kante des
     Originals behaelt; Ergebnis-Alpha = Maximum aus Original-Alpha und dieser Flaeche.
     Farbe schwarz (fuer die Maske zaehlt nur Alpha).

Aufruf (aus dem Repo):  python -I tools/maske_aus_signet.py
  Quelle: public/brand/nn-stern-kompass-128.png (= Brand-Assets/neuralnautic/abgeleitet/nn-stern-kompass-128.png)
  Ziel:   public/brand/nn-stern-kompass-128-maske.png
"""
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

REPO = Path(__file__).resolve().parent.parent
QUELLE = REPO / 'public' / 'brand' / 'nn-stern-kompass-128.png'
ZIEL = REPO / 'public' / 'brand' / 'nn-stern-kompass-128-maske.png'
SCHWELLE = 8
FENSTER = 5   # ungerade; schliesst Luecken bis etwa FENSTER - 1 px (S-Linie ~2-3 px), fuellt die Zwickel kaum

alpha = Image.open(QUELLE).convert('RGBA').getchannel('A')
w, h = alpha.size
silhouette = alpha.point(lambda a: 255 if a > SCHWELLE else 0)
# mit Rand, damit Dilatation/Erosion und Fluten am Bildrand nichts abschneiden
rand = FENSTER + 2
gross = Image.new('L', (w + 2 * rand, h + 2 * rand), 0)
gross.paste(silhouette, (rand, rand))
zu = gross.filter(ImageFilter.MaxFilter(FENSTER)).filter(ImageFilter.MinFilter(FENSTER))
# von aussen fluten: Aussen = 128, danach ist alles ausser 128 Figur
ImageDraw.floodfill(zu, (0, 0), 128)
figur = zu.point(lambda v: 0 if v == 128 else 255).filter(ImageFilter.MinFilter(3)).crop((rand, rand, rand + w, rand + h))
maske_alpha = ImageChops.lighter(alpha, figur)
maske = Image.new('RGBA', (w, h), (0, 0, 0, 0))
maske.putalpha(maske_alpha)
maske.save(ZIEL, optimize=True)
gefuellt = sum(1 for a, b in zip(alpha.getdata(), maske_alpha.getdata()) if b > SCHWELLE >= a)
print(f'{ZIEL.relative_to(REPO)}: {w}x{h}, {gefuellt} Pixel gefuellt (S-Linie und innere Luecken)')
