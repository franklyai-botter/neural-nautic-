import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

// Kern liegt waehrend der Entwicklung einmal zentral in ../funnel-vorlage/src/kern.
// Vor dem Deploy wird er per Skript in dieses Repo kopiert (vendored), damit jeder Funnel
// fuer sich baut. Bis dahin: Alias + dedupe, damit three/gsap/lenis aus diesem Repo kommen.
const KERN = resolve(__dirname, '../funnel-vorlage/src/kern');

export default defineConfig({
  resolve: { alias: { '@kern': KERN }, dedupe: ['three', 'gsap', 'lenis'] },
  server: { port: 5191, strictPort: true, fs: { allow: [resolve(__dirname), KERN] } },
  build: {
    assetsInlineLimit: 0,
    // Startseite plus jede Kapitelseite als <name>/index.html (Live-Adressen wie neuralnautic.de)
    rollupOptions: {
      input: Object.fromEntries([
        ['start', resolve(__dirname, 'index.html')],
        ...['leistungen', 'ki-im-unternehmen', 'methode', 'ai-engineering', 'ki-tool-kompass', 'wissen', 'ueber-mich', 'kontakt', 'impressum', 'datenschutz']
          .filter((s) => existsSync(resolve(__dirname, s, 'index.html')))
          .map((s) => [s, resolve(__dirname, s, 'index.html')]),
      ]),
    },
  },
});
