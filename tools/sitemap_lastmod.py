"""lastmod in public/sitemap.xml automatisch aus dem Inhalt der Seiten (Frank, 24.11.2026).

Vorher musste das Datum je Seite von Hand nachgezogen werden und blieb liegen (/leistungen stand nach einer
Aenderung am 24.11. noch auf dem 14.11.). Jetzt:

  Fingerabdruck je Seite = SHA-256 ueber statisch/<seite>.html, ohne die Kopfzeile (Erzeugungsdatum), ohne den
  ersten <header> (Seitennavigation, auf jeder Seite gleich) und ohne <footer> (Seitenabschluss, auf jeder Seite
  gleich). Eine Aenderung an Menue oder Fuss setzt also nicht alle Seiten auf heute, nur eigener Inhalt zaehlt.

  tools/sitemap_stand.json merkt sich je Adresse Fingerabdruck und Datum. Weicht der Fingerabdruck ab, wird
  lastmod = heute. Neue Adresse ohne Eintrag: Fingerabdruck wird aufgenommen, das Datum aus der Sitemap bleibt.
  Adressen, die nicht in der Sitemap stehen (/impressum, /datenschutz, noindex), werden ignoriert.

Laeuft automatisch am Ende von tools/statisch_erzeugen.py (npm run statisch). Da der Build ohne frische statische
Fassung abbricht, kann die Sitemap nicht mehr hinter dem Inhalt zuruecklaufen.

Aufruf:  python -I tools/sitemap_lastmod.py            Sitemap und Stand aktualisieren
         python -I tools/sitemap_lastmod.py --pruefen  nur pruefen, Exit 1 wenn ein Datum veraltet ist
"""
import datetime
import hashlib
import json
import re
import sys
from pathlib import Path

WURZEL = Path(__file__).resolve().parent.parent
DOMAIN = 'https://neuralnautic.de'


def fingerabdruck(html: str) -> str:
    teile = html.split('\n', 1)
    if teile[0].startswith('<!-- nn-statisch'):
        html = teile[1] if len(teile) > 1 else ''
    html = re.sub(r'<header>.*?</header>', '', html, count=1, flags=re.S)
    html = re.sub(r'<footer>.*?</footer>', '', html, flags=re.S)
    return hashlib.sha256(html.strip().encode('utf-8')).hexdigest()


def datei_zu(loc: str) -> str:
    pfad = loc[len(DOMAIN):].strip('/')
    return 'start' if pfad == '' else pfad


def aktualisieren(wurzel: Path = WURZEL, heute: str | None = None, nur_pruefen: bool = False) -> list[str]:
    """Gibt die Adressen zurueck, deren Datum veraltet war (beim Pruefen) bzw. neu gesetzt wurde."""
    heute = heute or datetime.date.today().isoformat()
    sitemap = wurzel / 'public' / 'sitemap.xml'
    stand_datei = wurzel / 'tools' / 'sitemap_stand.json'
    xml = sitemap.read_text(encoding='utf-8')
    stand = json.loads(stand_datei.read_text(encoding='utf-8')) if stand_datei.exists() else {}
    geaendert: list[str] = []

    def ersetze(m: re.Match) -> str:
        loc, alt_datum = m.group(2), m.group(4)
        datei = wurzel / 'statisch' / f'{datei_zu(loc)}.html'
        if not datei.exists():
            raise SystemExit(f'[sitemap] {loc}: statisch/{datei.name} fehlt (npm run statisch)')
        fp = fingerabdruck(datei.read_text(encoding='utf-8'))
        eintrag = stand.get(loc)
        if eintrag is None:
            stand[loc] = {'fingerabdruck': fp, 'lastmod': alt_datum}
            return m.group(0)
        if eintrag['fingerabdruck'] == fp:
            datum = eintrag['lastmod']
        else:
            datum = heute
            stand[loc] = {'fingerabdruck': fp, 'lastmod': heute}
            geaendert.append(loc)
        if datum != alt_datum and loc not in geaendert:
            geaendert.append(loc)   # Sitemap und Stand liefen auseinander (Handaenderung): Stand gilt
        return f'{m.group(1)}{loc}{m.group(3)}{datum}{m.group(5)}'

    neu = re.sub(r'(<loc>)([^<]+)(</loc>\s*<lastmod>)([^<]+)(</lastmod>)', ersetze, xml)
    if nur_pruefen:
        return geaendert
    if neu != xml:
        sitemap.write_text(neu, encoding='utf-8', newline='\n')
    stand_datei.write_text(json.dumps(dict(sorted(stand.items())), ensure_ascii=False, indent=2) + '\n',
                           encoding='utf-8', newline='\n')
    for loc in geaendert:
        print(f'[sitemap] {loc} lastmod -> {heute}', flush=True)
    if not geaendert:
        print('[sitemap] lastmod unveraendert', flush=True)
    return geaendert


if __name__ == '__main__':
    if '--pruefen' in sys.argv:
        veraltet = aktualisieren(nur_pruefen=True)
        if veraltet:
            print('[sitemap] lastmod veraltet: ' + ', '.join(veraltet) + ' (python -I tools/sitemap_lastmod.py)')
            sys.exit(1)
        print('[sitemap] lastmod aktuell')
    else:
        aktualisieren()
