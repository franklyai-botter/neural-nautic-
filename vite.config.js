import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

// Kern liegt waehrend der Entwicklung einmal zentral in ../funnel-vorlage/src/kern.
// Der Build nimmt immer die Kopie vendor/kern (tools/kern-holen.mjs laeuft als prebuild und
// frischt sie auf, wenn ../funnel-vorlage da ist). So baut die CI ohne Nachbarordner (NN-WR-10).
// Der Dev-Server nimmt den Kern direkt aus funnel-vorlage, damit Aenderungen dort sofort wirken.
// dedupe, damit three/gsap/lenis aus diesem Repo kommen.
const KERN_LOKAL = resolve(__dirname, '../funnel-vorlage/src/kern');
const KERN_VENDOR = resolve(__dirname, 'vendor/kern');

// Kapitelseiten wie auf neuralnautic.de ohne Schraegstrich (/leistungen). In Produktion liefert Cloudflare
// /leistungen direkt aus und leitet /leistungen/ dauerhaft dorthin um (wrangler.jsonc html_handling, Worker).
// Lokal dasselbe: /leistungen intern auf leistungen/index.html umschreiben, /leistungen/ umleiten.
const KAPITEL = ['leistungen', 'ki-im-unternehmen', 'methode', 'ai-engineering', 'ki-tool-kompass', 'wissen', 'ueber-mich', 'kontakt', 'impressum', 'datenschutz'];
function schraegstrich() {
  const umleiten = (req, res, next) => {
    const [pfad, query] = req.url.split('?');
    const q = query ? '?' + query : '';
    if (KAPITEL.includes(pfad.slice(1))) {
      req.url = pfad + '/' + q;   // intern, kein Umweg ueber den Browser
    } else if (pfad.endsWith('/') && KAPITEL.includes(pfad.slice(1, -1))) {
      res.statusCode = 308;
      res.setHeader('Location', pfad.slice(0, -1) + q);
      return res.end();
    }
    next();
  };
  return { name: 'kapitel-schraegstrich', configureServer: (s) => { s.middlewares.use(umleiten); }, configurePreviewServer: (s) => { s.middlewares.use(umleiten); } };
}

export default defineConfig(({ command }) => {
  const KERN = command === 'serve' && existsSync(KERN_LOKAL) ? KERN_LOKAL : KERN_VENDOR;
  return {
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
  };
});
