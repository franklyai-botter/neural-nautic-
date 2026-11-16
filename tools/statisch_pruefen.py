"""Pruefung der statischen Fassung (Pruefpunkt A2, NN-CR-03). Gegenstueck zu tools/statisch_erzeugen.py.

Baut die Seite (normaler `vite build`, also mit Frischepruefung), startet `vite preview` auf 5313 und prueft je Route:
  ohne JavaScript   #nn-statisch sichtbar, H1 und Fliesstext da, interne Links fuehren auf Routen/Dateien/Anker
  Abdeckung         Woerter der Fassung gegen den sichtbaren Text der gerenderten Seite (mit JavaScript, ganz
                    durchgescrollt; Laufband-Kopien und die zweite Zeile der Roll-Knoepfe nicht doppelt gezaehlt)
  mit JavaScript    #nn-statisch nach dem Start nicht im DOM, nie sichtbar gerendert (Bild fuer Bild ab Seitenbeginn),
                    keine Konsolenfehler
Bildschirmfotos ohne JavaScript nach qa/statisch/ (gitignored).

Aufruf:  python -I tools/statisch_pruefen.py [--ohne-bauen]      Exit 1, wenn eine Pruefung fehlschlaegt.
"""
import collections
import re
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

from playwright.sync_api import sync_playwright

WURZEL = Path(__file__).resolve().parent.parent
VITE = WURZEL / 'node_modules' / 'vite' / 'bin' / 'vite.js'
QA = WURZEL / 'qa' / 'statisch'
PORT = 5313
BASIS = f'http://localhost:{PORT}'
# Start plus KAPITEL aus vite.config.js (dieselbe Liste wie im Plugin und in statisch_erzeugen.py)
_kapitel = re.search(r'const KAPITEL = \[([^\]]*)\]', (WURZEL / 'vite.config.js').read_text(encoding='utf-8'))
ROUTEN = [('start', '/')] + [(k, f'/{k}/') for k in re.findall(r"'([^']+)'", _kapitel.group(1))]
PFADE = {p.rstrip('/') or '/' for _, p in ROUTEN}
MINDEST_ABDECKUNG = 0.95

# Sichtbarer Text der gerenderten Seite (innerText): Kopf, Menue-Navigation (nur wenn sichtbar), <main>, Fuss. innerText
# laesst display:none, visibility:hidden und zugeklappte <details> aus; Deckkraft 0 zaehlt mit (Text wird nur eingeblendet).
# bereinigt=true: zusaetzlich ohne das, was die Fassung vereinbarungsgemaess weglaesst (Formulare, aria-hidden, Bedienknoepfe,
# KI-Hinweise an Bildern ohne Alternativtext). Knopfschrift mit Roll-Effekt steht in der Fassung ueber aria-label.
REFERENZ_JS = r"""(bereinigt) => {
  // innerText setzt Zeichen-Spans (Roll-Knoepfe, Einspielungen) richtig zusammen; doppelte Darstellungen kurz ausblenden
  const weg = '.bs-band__in > li[aria-hidden="true"], .roll__b'
    + (bereinigt ? ', form, [aria-hidden="true"], button:not(h1 *, h2 *, h3 *, h4 *), .bs-ki, .hero__ki, .szene__ki' : '');
  const doppelt = [...document.querySelectorAll(weg)];
  const vorher = doppelt.map((e) => e.style.display);
  doppelt.forEach((e) => { e.style.display = 'none'; });
  const menue = document.querySelector('.bs-menue__nav');
  const wurzeln = [document.querySelector('header.bs-kopf'), menue && menue.checkVisibility({ visibilityProperty: true }) ? menue : null,
    document.getElementById('inhalt'), document.querySelector('footer.bs-fuss')].filter(Boolean);
  const text = wurzeln.map((w) => w.innerText).join('\n');
  doppelt.forEach((e, i) => { e.style.display = vorher[i]; });
  return text;
}"""


# Bild fuer Bild ab Seitenbeginn festhalten, ob #nn-statisch je sichtbar gerendert wurde (Aufblitzen)
BLITZ_INIT = r"""
window.__nnBlitz = { sichtbar: 0, bilder: 0, gesehen: 0, entfernt: null };
(function bild(t0) {
  const el = document.getElementById('nn-statisch');
  const b = window.__nnBlitz;
  b.bilder++;
  if (el) {
    b.gesehen++;
    const r = el.getBoundingClientRect();
    if (getComputedStyle(el).display !== 'none' && r.height > 0) b.sichtbar++;
  } else if (b.gesehen && b.entfernt === null) b.entfernt = performance.now();
  if (performance.now() < 3000) requestAnimationFrame(bild);
})();
"""


def woerter(text: str):
    text = text.replace('­', '').replace(' ', ' ')
    out = []
    for w in text.split():
        w = w.strip('.,;:!?()[]{}„“”"\'«»‚‘’…–—-·•→↗←↓↑+=/*').lower()
        if re.search(r'\w', w):
            out.append(w)
    return out


def vorschau_starten() -> subprocess.Popen:
    proc = subprocess.Popen(['node', str(VITE), 'preview', '--port', str(PORT), '--strictPort'], cwd=WURZEL,
                            stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    for _ in range(150):
        if proc.poll() is not None:
            raise SystemExit(f'vite preview beendet (Port {PORT} belegt?): {proc.stderr.read().decode(errors="replace")}')
        try:
            with urllib.request.urlopen(BASIS + '/', timeout=1):
                return proc
        except OSError:
            time.sleep(0.2)
    proc.kill()
    raise SystemExit('vite preview antwortet nicht')


def status(url: str) -> int:
    try:
        with urllib.request.urlopen(urllib.request.Request(url, method='GET'), timeout=5) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except OSError:
        return 0


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    if '--ohne-bauen' not in sys.argv[1:]:
        print('vite build (mit Frischepruefung) ...', flush=True)
        subprocess.run(['node', str(VITE), 'build', '--logLevel', 'error'], cwd=WURZEL, check=True)
    QA.mkdir(parents=True, exist_ok=True)
    fehler = []
    zeilen = []
    proc = vorschau_starten()
    try:
        with sync_playwright() as p:
            b = p.chromium.launch()
            ohne = b.new_context(viewport={'width': 1440, 'height': 900}, java_script_enabled=False)
            ohne_mobil = b.new_context(viewport={'width': 390, 'height': 844}, java_script_enabled=False)
            mit = b.new_context(viewport={'width': 1440, 'height': 900})
            mit.add_init_script(BLITZ_INIT)
            ids = {}
            fassungen = {}
            # 1) ohne JavaScript
            for name, pfad in ROUTEN:
                s = ohne.new_page()
                s.goto(BASIS + pfad, wait_until='load')
                st = s.locator('#nn-statisch')
                if not st.count() or not st.is_visible():
                    fehler.append(f'{pfad}: #nn-statisch fehlt oder ist ohne JavaScript nicht sichtbar')
                    s.close()
                    continue
                daten = s.evaluate("""() => {
                  const st = document.getElementById('nn-statisch');
                  const h1 = st.querySelector('h1');
                  // sichtbar heisst auch: nichts liegt darueber (Preloader, Kopf); Mitte der H1 nach dem Hinscrollen
                  let oben = false;
                  if (h1) {
                    h1.scrollIntoView({ block: 'center' });
                    const r = h1.getBoundingClientRect();
                    oben = st.contains(document.elementFromPoint(r.left + Math.min(20, r.width / 2), r.top + r.height / 2));
                    window.scrollTo(0, 0);
                  }
                  return {
                    text: st.innerText,
                    h1: h1 ? h1.innerText.trim() : '',
                    h1Sichtbar: !!h1 && h1.getBoundingClientRect().height > 0 && oben,
                    absaetze: [...st.querySelectorAll('p')].filter((p) => p.innerText.trim().split(/\\s+/).length >= 8).length,
                    links: [...st.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
                    ids: [...st.querySelectorAll('[id]')].map((e) => e.id),
                    rest: [...document.querySelectorAll('#inhalt > :not(#nn-statisch)')].filter((e) => e.getBoundingClientRect().height > 0).length,
                  };
                }""")
                fassungen[name] = daten
                ids[pfad.rstrip('/') or '/'] = set(daten['ids'])
                if not daten['h1'] or not daten['h1Sichtbar']:
                    fehler.append(f'{pfad}: ohne JavaScript keine sichtbare H1')
                if daten['absaetze'] < 1:
                    fehler.append(f'{pfad}: ohne JavaScript kein Fliesstext (Absatz mit >= 8 Woertern)')
                if daten['rest']:
                    fehler.append(f'{pfad}: ohne JavaScript stehen noch {daten["rest"]} andere Elemente sichtbar in <main>')
                if name in ('start', 'leistungen', 'impressum', 'datenschutz'):
                    s.screenshot(path=str(QA / f'ohne-js-{name}-1440-oben.png'))
                    s.screenshot(path=str(QA / f'ohne-js-{name}-1440-voll.png'), full_page=True)
                    m = ohne_mobil.new_page()
                    m.goto(BASIS + pfad, wait_until='load')
                    m.screenshot(path=str(QA / f'ohne-js-{name}-390-oben.png'))
                    breite = m.evaluate('document.documentElement.scrollWidth')
                    if breite > 390:
                        fehler.append(f'{pfad}: ohne JavaScript bei 390 px waagerecht scrollbar ({breite} px)')
                    m.close()
                s.close()
            # Links: interne Pfade fuehren auf Routen oder vorhandene Dateien, Anker auf vorhandene ids
            geprueft = {}
            for name, pfad in ROUTEN:
                if name not in fassungen:
                    continue
                hier = pfad.rstrip('/') or '/'
                for href in fassungen[name]['links']:
                    if href.startswith('#'):
                        ziel, anker = hier, href[1:]
                    elif href.startswith('/'):
                        ziel, _, anker = href.partition('#')
                        ziel = ziel.split('?')[0].rstrip('/') or '/'
                    else:
                        continue   # extern, mailto, tel
                    if ziel not in PFADE:
                        if ziel not in geprueft:
                            geprueft[ziel] = status(BASIS + ziel)
                        if geprueft[ziel] != 200:
                            fehler.append(f'{pfad}: Link {href} -> HTTP {geprueft[ziel]}')
                        continue
                    if anker and anker not in ids.get(ziel, set()):
                        fehler.append(f'{pfad}: Anker {href} fehlt in der Fassung von {ziel}')
            # 2) mit JavaScript: entfernt, kein Aufblitzen, keine Konsolenfehler; Referenztext fuer die Abdeckung
            for name, pfad in ROUTEN:
                s = mit.new_page()
                konsole = []
                s.on('console', lambda m, k=konsole: k.append(m.text) if m.type == 'error' else None)
                s.on('pageerror', lambda e, k=konsole: k.append(str(e)))
                # 150 ms Latenz je Anfrage: Modul und Chunks kommen spaeter, der Browser zeichnet also mehrere Bilder,
                # waehrend die Fassung noch im DOM steht (sonst waere die Aufblitz-Pruefung auf localhost fast leer)
                s.context.new_cdp_session(s).send('Network.emulateNetworkConditions', {
                    'offline': False, 'latency': 150, 'downloadThroughput': -1, 'uploadThroughput': -1})
                # Gegenprobe unabhaengig vom Timing: JavaScript an, aber kein Modul laedt (alle .js-Dateien blockiert).
                # Dann laeuft nur das Inline-Skript (Klasse .js) und die Fassung muss trotzdem unsichtbar sein.
                g = mit.new_page()
                g.route('**/*.js', lambda r: r.abort())
                g.goto(BASIS + pfad, wait_until='load')
                if g.evaluate("""() => { const e = document.getElementById('nn-statisch');
                    return !e || !document.documentElement.classList.contains('js') || getComputedStyle(e).display !== 'none'; }"""):
                    fehler.append(f'{pfad}: mit JavaScript, aber ohne Modul ist #nn-statisch nicht ausgeblendet (Klasse .js/CSS)')
                g.close()
                s.goto(BASIS + pfad, wait_until='load')
                s.wait_for_function('window.__bereit === true', timeout=30000)
                s.wait_for_timeout(400)
                blitz = s.evaluate('window.__nnBlitz')
                if s.locator('#nn-statisch').count():
                    fehler.append(f'{pfad}: #nn-statisch steht mit JavaScript noch im DOM')
                if blitz['sichtbar']:
                    fehler.append(f'{pfad}: #nn-statisch war in {blitz["sichtbar"]} Bildern sichtbar (Aufblitzen)')
                # durchscrollen, damit alles eingespielt ist, dann sichtbaren Text lesen
                s.evaluate("""async () => {
                  const w = (ms) => new Promise((r) => setTimeout(r, ms));
                  for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.6) {
                    if (window.lenis) window.lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y);
                    await w(90);
                  }
                  await w(800);
                }""")
                referenz = s.evaluate(REFERENZ_JS, False)
                referenz_b = s.evaluate(REFERENZ_JS, True)
                if konsole:
                    fehler.append(f'{pfad}: {len(konsole)} Konsolenfehler: {konsole[:3]}')
                s.close()
                if name not in fassungen:
                    continue
                fas = woerter(fassungen[name]['text'])
                ref, ref_b = woerter(referenz), woerter(referenz_b)
                # Verhaeltnis: Wortzahl Fassung / Wortzahl Seite. Abdeckung (streng): Anteil der Woerter der Seite, die in
                # der Fassung vorkommen (je Wort gezaehlt, Reihenfolge egal). Bereinigt: ohne das vereinbart Weggelassene.
                rest = collections.Counter(ref) - collections.Counter(fas)
                rest_b = collections.Counter(ref_b) - collections.Counter(fas)
                abdeckung = 1 - sum(rest.values()) / max(1, len(ref))
                abdeckung_b = 1 - sum(rest_b.values()) / max(1, len(ref_b))
                verhaeltnis = len(fas) / max(1, len(ref))
                zeilen.append((pfad, len(fas), len(ref), verhaeltnis, abdeckung, abdeckung_b, blitz,
                               rest.most_common(10), rest_b.most_common(10)))
                if abdeckung_b < MINDEST_ABDECKUNG:
                    fehler.append(f'{pfad}: bereinigte Abdeckung {abdeckung_b:.1%} < {MINDEST_ABDECKUNG:.0%}')
            b.close()
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=10)
        except subprocess.TimeoutExpired:
            proc.kill()

    print('\nVerh. = Woerter Fassung / Woerter Seite; Abd. = Anteil der Seitenwoerter, die in der Fassung stehen; bereinigt = '
          'ohne Formulare, aria-hidden, Bedienknoepfe, KI-Hinweise ohne Bild. Bilder: Frames gesamt / mit Fassung im DOM / '
          'davon Fassung sichtbar (erste 3 s)')
    print(f'{"Route":22} {"Fassung":>8} {"Seite":>7} {"Verh.":>7} {"Abd.":>7} {"bereinigt":>9}  Bilder')
    for pfad, nf, nr, v, a, ab, blitz, rest, rest_b in zeilen:
        print(f'{pfad:22} {nf:8d} {nr:7d} {v:7.1%} {a:7.1%} {ab:9.1%}  {blitz["bilder"]}/{blitz["gesehen"]}/{blitz["sichtbar"]}')
    print('\nfehlende Woerter (streng | bereinigt):')
    for pfad, nf, nr, v, a, ab, blitz, rest, rest_b in zeilen:
        print(f'  {pfad:20} ' + ', '.join(f'{w}×{n}' for w, n in rest) + '  |  '
              + (', '.join(f'{w}×{n}' for w, n in rest_b) or '-'))
    print()
    if fehler:
        print('FEHLER:')
        for f in fehler:
            print('  -', f)
        sys.exit(1)
    print('Alle Pruefungen bestanden. Bildschirmfotos ohne JavaScript:', QA)


if __name__ == '__main__':
    main()
