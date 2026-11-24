"""Statische Fassung je Route erzeugen (Pruefpunkt A2, Code-Review NN-CR-03).

Die Seite baut jeden Inhalt per JavaScript aus src/inhalt/*.js; <main id="inhalt"> ist im HTML leer. Ohne JavaScript
(und fuer KI-Crawler, die kaum JavaScript ausfuehren) stand dort nichts. Dieses Werkzeug rendert jede Route einmal im
Browser und legt den Textinhalt als sauberes, semantisches HTML nach statisch/<route>.html. Das Vite-Plugin
`statischeFassung()` in vite.config.js setzt die Fassung als <div id="nn-statisch"> in <main id="inhalt"> ein;
src/seiten/gemeinsam.js und src/funnel/main.js entfernen sie beim Start wieder, bevor die Seite aufgebaut wird.

Ablauf:
  1. vite build mit NN_STATISCH_ERZEUGEN=1 (schaltet die Frischepruefung des Plugins ab)
  2. vite preview auf Port 5313
  3. je Route: Seite oeffnen (Reduced Motion: keine Zeilen- und Zeichen-Spans, Zahlen stehen sofort auf dem Endwert),
     bis zum Ende durchscrollen (alles, was erst beim Scrollen eingespielt wird, steht danach im DOM), HTML ziehen
  4. statisch/<route>.html schreiben, erste Zeile: Kommentar mit SHA-256 ueber src/inhalt/*.js und Erzeugungsdatum

Regeln: Positivliste h1–h6, p, ul/ol/li, a[href], strong/em/b/i, table…td, dl/dt/dd, blockquote, figure/figcaption,
img (nur mit alt; src/alt/width/height), header/nav/footer/section/article; alles andere wird ausgepackt (Text bleibt),
ausgepackte Bloecke mit reinem Fliesstext werden zu <p>. Entfernt: aria-hidden, hidden, script/style/canvas/svg/video/
template, Formulare, Laufband-Kopien, Zeichen-Spans (Reduced Motion), leere Elemente; Attribute ausser href/src/alt/
width/height/id. Kopf-Navigation (aus dem Menue) und Fusskarte gehoeren dazu. Genauer gefasst:
  - <br> bleibt (Anschriften im Impressum und mehrzeilige Angaben liefen sonst ineinander)
  - <img> bekommt loading="lazy": mit JavaScript laedt der Browser die Bilder der unsichtbaren Fassung dann nicht
  - per CSS ausgeblendet (display:none bei 1440 px: Hover-Rueckseiten der Karten, Mobil-Doppel) faellt weg
  - Knoepfe sind Bedienung und fallen weg, ausser in Ueberschriften (Leistungskarten der Startseite)
  - svg/canvas mit role="img" und aria-label: die Beschreibung bleibt als Absatz (wie alt bei <img>)
  - KI-Hinweise („KI-generiert“) nur an Bildern, die in der Fassung bleiben

Aufruf (aus dem Repo):  python -I tools/statisch_erzeugen.py      (npm run statisch)
  --ohne-bauen   vorhandenes dist/ verwenden (schneller beim Feinschliff)

Hash (identisch in vite.config.js → inhaltHash()): SHA-256 ueber alle src/inhalt/*.js, nach Dateiname sortiert, je
Datei „<name>\\n<inhalt>\\n“, Zeilenenden auf LF vereinheitlicht.
"""
import datetime
import hashlib
import os
import re
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

from playwright.sync_api import sync_playwright

WURZEL = Path(__file__).resolve().parent.parent
INHALT = WURZEL / 'src' / 'inhalt'
ZIEL = WURZEL / 'statisch'
VITE = WURZEL / 'node_modules' / 'vite' / 'bin' / 'vite.js'
PORT = 5313
BASIS = f'http://localhost:{PORT}'


def routen():
    """(Dateiname in statisch/, Pfad): Start plus KAPITEL aus vite.config.js (eine Liste fuer Plugin und Werkzeug)."""
    m = re.search(r'const KAPITEL = \[([^\]]*)\]', (WURZEL / 'vite.config.js').read_text(encoding='utf-8'))
    if not m:
        raise SystemExit('[statisch] KAPITEL in vite.config.js nicht gefunden')
    return [('start', '/')] + [(k, f'/{k}/') for k in re.findall(r"'([^']+)'", m.group(1))]


def inhalt_hash() -> str:
    """SHA-256 ueber src/inhalt/*.js (sortiert nach Name, je Datei Name + Inhalt, LF). Gegenstueck: vite.config.js."""
    h = hashlib.sha256()
    for datei in sorted(INHALT.glob('*.js'), key=lambda p: p.name):
        h.update(datei.name.encode('utf-8') + b'\n')
        h.update(datei.read_bytes().replace(b'\r\n', b'\n'))
        h.update(b'\n')
    return h.hexdigest()


def bauen():
    env = {**os.environ, 'NN_STATISCH_ERZEUGEN': '1'}
    print('[statisch] vite build …', flush=True)
    subprocess.run(['node', str(VITE), 'build', '--logLevel', 'warn'], cwd=WURZEL, env=env, check=True)


def vorschau_starten() -> subprocess.Popen:
    # node direkt (statt npx): ein einzelner Prozess, der sich sauber beenden laesst
    proc = subprocess.Popen(['node', str(VITE), 'preview', '--port', str(PORT), '--strictPort'], cwd=WURZEL,
                            stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    for _ in range(150):
        if proc.poll() is not None:
            raise SystemExit(f'[statisch] vite preview beendet (Port {PORT} belegt?): {proc.stderr.read().decode(errors="replace")}')
        try:
            with urllib.request.urlopen(BASIS + '/', timeout=1) as r:
                if r.status == 200:
                    return proc
        except OSError:
            time.sleep(0.2)
    proc.kill()
    raise SystemExit('[statisch] vite preview antwortet nicht')


# Bis zum Seitenende scrollen, damit IntersectionObserver und ScrollTrigger (once) alles einspielen, dann zurueck.
DURCHSCROLLEN_JS = """async () => {
  const warte = (ms) => new Promise((r) => setTimeout(r, ms));
  const schritt = Math.max(200, Math.round(innerHeight * 0.6));
  for (let y = 0; y < document.documentElement.scrollHeight; y += schritt) { window.scrollTo(0, y); await warte(70); }
  window.scrollTo(0, document.documentElement.scrollHeight);
  await warte(600);
  window.scrollTo(0, 0);
  await warte(300);
}"""

# Aus dem gerenderten DOM sauberes, semantisches HTML ziehen. Positivliste, alles andere auspacken (Text bleibt).
AUSZUG_JS = r"""() => {
  const BLOCK = new Set(['h1','h2','h3','h4','h5','h6','p','ul','ol','li','table','thead','tbody','tr','th','td','dl','dt','dd',
    'blockquote','figure','figcaption','header','nav','footer','section','article']);
  const INLINE = new Set(['a','strong','em','b','i']);
  // ganz entfernen (samt Text): Technik, Grafik, Medien, Formulare
  const WEG = new Set(['script','style','canvas','svg','video','audio','template','form','noscript','iframe','object','embed',
    'input','select','textarea','source','track','map','area','meta','link','math']);
  const text = (s) => document.createTextNode(s);
  // Element mit Blockinhalt (wird zeilenweise ausgegeben); inline nur ohne Block-Nachfahren
  function blockModus(e) { return BLOCK.has(e.localName) || [...e.querySelectorAll('*')].some((x) => BLOCK.has(x.localName)); }
  const zufallsId = /^ks-[a-z0-9]{6}$/;   // abschnitt() ohne id: zufaellige aria-labelledby-Ziele, nicht stabil

  const hatInhalt = (knoten) => knoten.some((k) => (k.nodeType === 3 ? k.data.trim() !== ''
    : k.localName === 'img' || k.textContent.trim() !== '' || !!k.querySelector?.('img')));
  // Knopf nur mit Symbol (Menue, Pause, Pfeile): Text steht allein in sr-only oder aria-hidden
  const nurSymbol = (b) => {
    const c = b.cloneNode(true);
    c.querySelectorAll('[aria-hidden="true"], .sr-only').forEach((x) => x.remove());
    return c.textContent.trim() === '';
  };
  const blockig = (n) => {
    const d = getComputedStyle(n).display;
    if (d === 'inline' || d === 'contents') return false;
    if (d.startsWith('inline') && n.textContent.trim().length <= 1) return false;   // Zeichen-Spans einer Einspielung
    return true;
  };

  // Fliesstext-Kontext (nur Phrasing erlaubt): hier entsteht beim Auspacken kein <p>
  const PHRASING = new Set(['h1','h2','h3','h4','h5','h6','p','a','strong','em','b','i']);
  // Bedienung statt Inhalt: Menue-Nummern (01, 02 …), Regler und Mausrad-Hinweis des 3D-Modells (Im Unternehmen).
  // KI-Hinweise nur dort, wo das Bild in der Fassung bleibt (siehe mitBild).
  const AUSLASSEN = new Set(document.querySelectorAll('.bs-menue__nav small, .m3d-ctl, .m3d-hint'));
  const BEHALTENE_BILDER = new Set();
  const mitBild = (n) => [...(n.parentElement?.querySelectorAll('img') || [])].some((i) => BEHALTENE_BILDER.has(i));
  // Absaetze, die beim Auspacken entstanden sind (weich): duerfen zu einer Zeile zusammengefasst werden
  const WEICH = new WeakSet();
  function absatz(knoten) {
    const p = document.createElement('p');
    WEICH.add(p);
    for (const k of knoten) { if (WEICH.has(k)) p.append(text(' '), ...k.childNodes, text(' ')); else p.append(k); }
    return p;
  }
  // Kinder nebeneinander (eine Zeile, z. B. eine Formel aus Kaesten) statt untereinander?
  function einzeilig(n) {
    const r = [...n.children].filter((c) => getComputedStyle(c).display !== 'none')
      .map((c) => c.getBoundingClientRect()).filter((b) => b.width && b.height);
    return r.length >= 2 && Math.max(...r.map((b) => b.top)) < Math.min(...r.map((b) => b.bottom));
  }

  function kopie(n, phrasing = false) {
    if (n.nodeType === 3) return [text(n.data)];
    if (n.nodeType !== 1) return [];
    const tag = n.localName;
    if (n.id === 'nn-statisch' || AUSLASSEN.has(n)) return [];
    if (n.getAttribute('aria-hidden') === 'true' || n.hasAttribute('hidden')) return [];
    if (tag === 'dialog' && !n.open) return [];
    // <br> bleibt (Anschriften im Impressum, Zeilen in Karten); ohne ihn liefen die Zeilen ineinander
    if (tag === 'br') return [document.createElement('br')];
    // per CSS ausgeblendet (gemessen bei 1440 px): Hover-Rueckseiten, Mobil-Doppel; zugeklappte <details> zaehlen nicht dazu
    if (getComputedStyle(n).display === 'none') return [];
    // Grafik mit Textalternative (role="img" + aria-label): die Beschreibung bleibt als Absatz, wie alt bei <img>
    const bildLabel = (n.getAttribute('role') === 'img' && (n.getAttribute('aria-label') || '').trim()) || '';
    if ((tag === 'svg' || tag === 'canvas') && bildLabel) return phrasing ? [text(` ${bildLabel} `)] : [Object.assign(document.createElement('p'), { textContent: bildLabel })];
    if (WEG.has(tag)) return [];
    // Knoepfe sind Bedienung (Vollbild, noch einmal, Menue); Ausnahme: Knopf in einer Ueberschrift (Leistungskarten)
    if (tag === 'button' && (nurSymbol(n) || !n.closest('h1, h2, h3, h4, h5, h6'))) return [];
    if (n.matches('.bs-ki, .hero__ki, .szene__ki') && !mitBild(n)) return [];
    if (tag === 'img') {
      const alt = (n.getAttribute('alt') || '').trim();
      const src = n.getAttribute('src') || n.getAttribute('data-src') || '';
      if (!alt || !src || /^(data|blob):/.test(src)) return [];
      const e = document.createElement('img');
      e.setAttribute('src', src);
      e.setAttribute('alt', alt);
      for (const a of ['width', 'height']) if (n.getAttribute(a)) e.setAttribute(a, n.getAttribute(a));
      // loading="lazy": mit JavaScript ist die Fassung unsichtbar, ihre Bilder werden dann nicht geladen (sonst holte der
      // Preload-Scanner jedes Bild der Seite schon beim Start). Ohne JavaScript ignoriert der Browser lazy und laedt sofort.
      e.setAttribute('loading', 'lazy');
      BEHALTENE_BILDER.add(n);
      return [e];
    }
    const innenPhrasing = phrasing || PHRASING.has(tag);
    let kinder = [...n.childNodes].flatMap((k) => kopie(k, innenPhrasing));
    // Knopfschrift mit Roll-Effekt (rollText) steht nur noch im aria-label, die Buchstabenzeilen sind aria-hidden
    const label = (n.getAttribute('aria-label') || '').trim();
    if (label && !hatInhalt(kinder) && (tag === 'a' || n.hasAttribute('data-roll'))) kinder = [text(label)];
    const behalten = BLOCK.has(tag) || (INLINE.has(tag) && (tag !== 'a' || n.hasAttribute('href')));
    const istBlockig = blockig(n);
    const rand = istBlockig ? [text(' ')] : [];
    if (!behalten) {
      // Ausgepackter Block mit reinem Fliesstext (<div>/<small>/<span> als eigene Zeile) wird zum Absatz, ausser im
      // Fliesstext (in h1–h6, p, a …). Stehen die Teile nebeneinander, wird daraus ein Absatz, sonst je Zeile einer.
      if (!istBlockig || phrasing || !hatInhalt(kinder)) return [...rand, ...kinder, ...rand];
      if (kinder.some((k) => k.nodeType === 1 && !WEICH.has(k) && blockModus(k))) return [...rand, ...kinder, ...rand];
      // nebeneinander und mit Bruchstuecken (Formel „MI + KI = Magie“): eine Zeile; ganze Saetze bleiben getrennt
      const bruchstueck = kinder.some((k) => WEICH.has(k) && k.textContent.trim().split(/\s+/).length <= 2);
      if (!kinder.some((k) => WEICH.has(k)) || (einzeilig(n) && bruchstueck)) return [absatz(kinder)];
      const out = [];
      let lauf = [];
      const leeren = () => { if (hatInhalt(lauf)) out.push(absatz(lauf)); lauf = []; };
      for (const k of kinder) { if (WEICH.has(k)) { leeren(); out.push(k); } else lauf.push(k); }
      leeren();
      return out;
    }
    const e = document.createElement(tag);
    if (n.id && !zufallsId.test(n.id)) e.id = n.id;
    if (tag === 'a') {
      let href = n.getAttribute('href');
      // interne Pfade ohne Schraegstrich am Ende (wie auf der Live-Seite): /leistungen/ -> /leistungen
      if (/^\/[^?#]+\/(?=$|[?#])/.test(href)) href = href.replace(/\/(?=$|[?#])/, '');
      if (!/^\s*javascript:/i.test(href)) e.setAttribute('href', href);
    }
    e.append(...kinder);
    return BLOCK.has(tag) ? [e] : [...rand, e, ...rand];
  }

  // leere Elemente entfernen (von innen nach aussen); Tabellenzellen bleiben, damit Spalten stimmen
  function leereWeg(e) {
    for (const k of [...e.children]) leereWeg(k);
    for (const k of [...e.children]) {
      if (k.localName === 'img' || k.localName === 'br' || k.localName === 'td' || k.localName === 'th') continue;
      if (k.textContent.trim() === '' && !k.querySelector('img')) k.remove();
    }
  }

  // Serialisieren: Blockelemente je Zeile (eingerueckt), Fliesstext innerhalb eines Blocks auf einer Zeile
  const escT = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escA = (s) => escT(s).replace(/"/g, '&quot;');
  const ATTR = ['id', 'href', 'src', 'alt', 'width', 'height', 'loading'];
  const auf = (e) => `<${e.localName}${ATTR.filter((a) => e.hasAttribute(a)).map((a) => ` ${a}="${escA(e.getAttribute(a))}"`).join('')}>`;
  const zu = (e) => `</${e.localName}>`;

  function fliesstext(knoten) {
    let out = ''; let luecke = false; let anfang = true; let offen = ''; let umbruch = false;
    // Umbruch erst vor dem naechsten Inhalt schreiben: keiner am Anfang oder Ende eines Absatzes, nie doppelt
    const schreibe = (s) => {
      if (umbruch && !anfang) out += '<br />'; else if (luecke && !anfang) out += ' ';
      umbruch = false; luecke = false; anfang = false; out += offen + s; offen = '';
    };
    const geh = (k) => {
      if (k.nodeType === 3) {
        let s = k.data.replace(/[ \t\n\r\f]+/g, ' ');
        if (s.startsWith(' ')) { luecke = true; s = s.slice(1); }
        const ende = s.endsWith(' ');
        if (ende) s = s.slice(0, -1);
        if (s) schreibe(escT(s));
        if (ende) luecke = true;
        return;
      }
      if (k.localName === 'img') { schreibe(auf(k).replace(/>$/, ' />')); return; }
      if (k.localName === 'br') { umbruch = true; return; }
      offen += auf(k);
      [...k.childNodes].forEach(geh);
      out += offen + zu(k);   // offene Luecke wandert hinter das schliessende Tag
      offen = '';
    };
    knoten.forEach(geh);
    return out;
  }

  function block(e, tiefe, zeilen) {
    const ein = '  '.repeat(tiefe);
    const kinder = [...e.childNodes];
    if (!kinder.some((k) => k.nodeType === 1 && blockModus(k))) { zeilen.push(ein + auf(e) + fliesstext(kinder) + zu(e)); return; }
    zeilen.push(ein + auf(e));
    let lauf = [];
    const leeren = () => { const s = fliesstext(lauf); if (s) zeilen.push(ein + '  ' + s); lauf = []; };
    for (const k of kinder) {
      if (k.nodeType === 1 && blockModus(k)) { leeren(); block(k, tiefe + 1, zeilen); } else lauf.push(k);
    }
    leeren();
    zeilen.push(ein + zu(e));
  }

  // Kopf: Logo-Link und CTA aus dem Seitenkopf, dazu die Navigation aus dem Menue (Eintraege und Nebenlinks)
  const wurzel = document.createElement('div');
  const kopfEl = document.querySelector('header.bs-kopf');
  const kopf = kopfEl ? kopie(kopfEl).find((k) => k.nodeType === 1) : document.createElement('header');
  const nav = document.querySelector('.bs-menue__nav');
  if (nav) kopf.append(...kopie(nav));
  document.querySelectorAll('.bs-menue__neben').forEach((a) => kopf.append(text(' '), ...kopie(a), text(' ')));
  wurzel.append(kopf);
  // Inhalt: alles in <main id="inhalt"> (ohne die alte statische Fassung)
  const main = document.getElementById('inhalt');
  for (const k of main.childNodes) wurzel.append(...kopie(k));
  // Fuss: die Fusskarte (Spalten, Recht-Links Impressum/Datenschutz, Kontakt)
  const fuss = document.querySelector('footer.bs-fuss');
  if (fuss) wurzel.append(...kopie(fuss));

  leereWeg(wurzel);
  const zeilen = [];
  const lauf = [];
  const leeren = () => { const s = fliesstext(lauf); if (s) zeilen.push(`<p>${s}</p>`); lauf.length = 0; };
  for (const k of wurzel.childNodes) {
    if (k.nodeType === 1 && blockModus(k)) { leeren(); block(k, 0, zeilen); } else lauf.push(k);
  }
  leeren();
  return zeilen.join('\n');
}"""


def seite_lesen(browser, pfad: str) -> str:
    # Reduced Motion: keine SplitText-Zeilen, keine Zeichen-Spans, Zaehler stehen auf dem Endwert, Laufbaender ohne Kopien
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, reduced_motion='reduce')
    seite = ctx.new_page()
    fehler = []
    seite.on('pageerror', lambda e: fehler.append(str(e)))
    seite.goto(BASIS + pfad, wait_until='load')
    seite.wait_for_function('window.__bereit === true', timeout=30000)
    seite.evaluate(DURCHSCROLLEN_JS)
    seite.wait_for_timeout(500)
    if seite.locator('#nn-statisch').count():
        raise SystemExit(f'[statisch] {pfad}: #nn-statisch steht nach dem Start noch im DOM (Entfernen beim Start fehlt)')
    html = seite.evaluate(AUSZUG_JS)
    ctx.close()
    if fehler:
        raise SystemExit(f'[statisch] {pfad}: Skriptfehler beim Rendern: {fehler}')
    return html


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    ohne_bauen = '--ohne-bauen' in sys.argv[1:]
    if not ohne_bauen:
        bauen()
    hash_ = inhalt_hash()
    datum = datetime.date.today().isoformat()
    ZIEL.mkdir(exist_ok=True)
    proc = vorschau_starten()
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            for name, pfad in routen():
                html = seite_lesen(browser, pfad)
                datei = ZIEL / f'{name}.html'
                # Gleicher Hash und gleicher Inhalt: Datei bleibt, wie sie ist (kein neues Datum, kein Diff ohne Grund)
                alt = datei.read_text(encoding='utf-8').split('\n', 1) if datei.exists() else ['', '']
                if f'inhalt-sha256={hash_} ' in alt[0] and alt[1] == html + '\n':
                    print(f'[statisch] {pfad:22} -> statisch/{name}.html unveraendert', flush=True)
                    continue
                kopf = f'<!-- nn-statisch inhalt-sha256={hash_} erzeugt={datum} · erzeugt von tools/statisch_erzeugen.py, nicht von Hand aendern -->'
                datei.write_text(kopf + '\n' + html + '\n', encoding='utf-8', newline='\n')
                woerter = len(html.split())
                print(f'[statisch] {pfad:22} -> statisch/{name}.html ({len(html.encode("utf-8")) // 1024} KB, ~{woerter} Woerter)', flush=True)
            browser.close()
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=10)
        except subprocess.TimeoutExpired:
            proc.kill()
    print(f'[statisch] fertig, inhalt-sha256={hash_[:12]}...')
    # lastmod der Sitemap aus dem Inhalt der Seiten (Frank 24.11.2026), siehe tools/sitemap_lastmod.py
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from sitemap_lastmod import aktualisieren
    aktualisieren()


if __name__ == '__main__':
    main()
