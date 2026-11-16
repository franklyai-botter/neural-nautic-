import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { readFileSync, readdirSync } from 'node:fs';   // statischeFassung()
import { relative } from 'node:path';                  // statischeFassung()
import { createHash } from 'node:crypto';              // statischeFassung()

// Kern liegt waehrend der Entwicklung einmal zentral in ../funnel-vorlage/src/kern.
// Vor dem Deploy wird er per Skript in dieses Repo kopiert (vendored), damit jeder Funnel
// fuer sich baut. Bis dahin: Alias + dedupe, damit three/gsap/lenis aus diesem Repo kommen.
const KERN = resolve(__dirname, '../funnel-vorlage/src/kern');

// Kapitelseiten wie auf neuralnautic.de ohne Schraegstrich verlinkt (/leistungen). Vite liefert dort sonst
// die Startseite aus; Cloudflare leitet in Produktion selbst auf /leistungen/ um. Hier dasselbe lokal.
const KAPITEL = ['leistungen', 'ki-im-unternehmen', 'methode', 'ai-engineering', 'ki-tool-kompass', 'wissen', 'ueber-mich', 'kontakt', 'impressum', 'datenschutz'];
function schraegstrich() {
  const umleiten = (req, res, next) => {
    const [pfad, query] = req.url.split('?');
    if (KAPITEL.includes(pfad.slice(1))) {
      res.statusCode = 301;
      res.setHeader('Location', pfad + '/' + (query ? '?' + query : ''));
      return res.end();
    }
    next();
  };
  return { name: 'kapitel-schraegstrich', configureServer: (s) => { s.middlewares.use(umleiten); }, configurePreviewServer: (s) => { s.middlewares.use(umleiten); } };
}

// Statische Fassung ohne JavaScript (Pruefpunkt A2, Code-Review NN-CR-03). Jede Seite baut ihren Inhalt per JavaScript;
// ohne JavaScript (und fuer KI-Crawler) stand in <main id="inhalt"> nichts. tools/statisch_erzeugen.py legt den gerenderten
// Text je Route als statisch/<route>.html ab (Start: start.html), dieses Plugin setzt ihn als <div id="nn-statisch"> als
// erstes Kind in <main> ein (Dev und Build). Im <head>: die Zeile JS_KLASSE (Klasse .js, CSP-Hash haengt an genau diesem
// Text) und statisch/statisch.css. Mit JavaScript ist die Fassung unsichtbar; src/seiten/gemeinsam.js (kapitelseite)
// und src/funnel/main.js entfernen sie, bevor die Seite aufgebaut wird.
// Frische: Die erste Zeile jeder Fassung traegt den SHA-256 ueber src/inhalt/*.js. Weicht er ab oder fehlt eine
// Fassung, bricht `vite build` ab (Dev-Server: nur Warnung). NN_STATISCH_ERZEUGEN=1 (setzt das Werkzeug selbst)
// schaltet die Pruefung ab. Neu erzeugen: npm run statisch
const JS_KLASSE = "<script>document.documentElement.classList.add('js')</script>";
function statischeFassung() {
  const ORDNER = resolve(__dirname, 'statisch');
  const ROUTEN = ['start', ...KAPITEL];
  const HINWEIS = 'python -I tools/statisch_erzeugen.py ausführen';
  const erzeugen = process.env.NN_STATISCH_ERZEUGEN === '1';
  // gleiche Rechnung wie inhalt_hash() in tools/statisch_erzeugen.py: nach Name sortiert, je Datei „<name>\n<inhalt>\n“, LF
  const inhaltHash = () => {
    const h = createHash('sha256');
    const dir = resolve(__dirname, 'src/inhalt');
    for (const name of readdirSync(dir).filter((n) => n.endsWith('.js')).sort()) {
      h.update(`${name}\n`);
      h.update(readFileSync(resolve(dir, name), 'utf8').replace(/\r\n/g, '\n'));
      h.update('\n');
    }
    return h.digest('hex');
  };
  const fassung = (route) => {
    const datei = resolve(ORDNER, `${route}.html`);
    if (!existsSync(datei)) return null;
    const [kopf, ...rest] = readFileSync(datei, 'utf8').replace(/\r\n/g, '\n').split('\n');
    return { hash: kopf.match(/inhalt-sha256=([0-9a-f]{64})/)?.[1], html: rest.join('\n').trim() };
  };
  const pruefen = () => {
    const soll = inhaltHash();
    const fehlt = ROUTEN.filter((r) => !fassung(r));
    const veraltet = ROUTEN.filter((r) => fassung(r) && fassung(r).hash !== soll);
    return { soll, fehlt, veraltet };
  };
  const stil = () => readFileSync(resolve(ORDNER, 'statisch.css'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').trim();
  let build = false;
  let gewarnt = '';
  return {
    name: 'nn-statische-fassung',
    configResolved(c) { build = c.command === 'build'; },
    buildStart() {
      if (!build || erzeugen) return;
      const { fehlt, veraltet } = pruefen();
      if (fehlt.length) throw new Error(`Statische Fassung fehlt: ${HINWEIS} (${fehlt.map((r) => `statisch/${r}.html`).join(', ')})`);
      if (veraltet.length) throw new Error(`Statische Fassung veraltet: ${HINWEIS} (src/inhalt/*.js geaendert, betrifft ${veraltet.join(', ')})`);
    },
    transformIndexHtml(html, ctx) {
      const datei = relative(__dirname, ctx.filename || '').replace(/\\/g, '/');
      const route = datei === 'index.html' ? 'start' : ROUTEN.find((r) => datei === `${r}/index.html`);
      if (!route) return html;   // z. B. hero-test.html
      if (!build && !erzeugen) {
        const { soll, fehlt, veraltet } = pruefen();
        if ((fehlt.length || veraltet.length) && gewarnt !== soll) {
          gewarnt = soll;
          console.warn(`[statisch] Statische Fassung ${fehlt.length ? 'fehlt' : 'veraltet'}: ${HINWEIS} (${[...fehlt, ...veraltet].join(', ')})`);
        }
      }
      const f = fassung(route);
      // Klasse .js so frueh wie moeglich (direkt nach <meta charset>, vor den Stylesheets), die Regeln ans Ende des <head>
      const charset = /<meta charset[^>]*>/i;
      let neu = charset.test(html) ? html.replace(charset, (m) => `${m}\n  ${JS_KLASSE}`) : html.replace('</head>', () => `  ${JS_KLASSE}\n</head>`);
      neu = neu.replace('</head>', () => `  <style>${stil()}</style>\n</head>`);
      if (f) {
        const main = /<main\b[^>]*\bid="inhalt"[^>]*>/;
        if (!main.test(neu)) throw new Error(`[statisch] <main id="inhalt"> fehlt in ${datei}`);
        neu = neu.replace(main, (m) => `${m}\n<div id="nn-statisch" class="nn-statisch">\n${f.html}\n</div>`);
      }
      return neu;
    },
  };
}

export default defineConfig({
  plugins: [schraegstrich(), statischeFassung()],
  resolve: { alias: { '@kern': KERN }, dedupe: ['three', 'gsap', 'lenis'] },
  server: { port: 5191, strictPort: true, fs: { allow: [resolve(__dirname), KERN] } },
  build: {
    assetsInlineLimit: 0,
    // Startseite plus jede Kapitelseite als <name>/index.html (Live-Adressen wie neuralnautic.de)
    rollupOptions: {
      input: Object.fromEntries([
        ['start', resolve(__dirname, 'index.html')],
        ...KAPITEL
          .filter((s) => existsSync(resolve(__dirname, s, 'index.html')))
          .map((s) => [s, resolve(__dirname, s, 'index.html')]),
      ]),
    },
  },
});
