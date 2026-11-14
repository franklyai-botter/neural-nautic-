import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

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

export default defineConfig({
  plugins: [schraegstrich()],
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
