import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Kern liegt waehrend der Entwicklung einmal zentral in ../funnel-vorlage/src/kern.
// Vor dem Deploy wird er per Skript in dieses Repo kopiert (vendored), damit jeder Funnel
// fuer sich baut. Bis dahin: Alias + dedupe, damit three/gsap/lenis aus diesem Repo kommen.
const KERN = resolve(__dirname, '../funnel-vorlage/src/kern');

export default defineConfig({
  resolve: { alias: { '@kern': KERN }, dedupe: ['three', 'gsap', 'lenis'] },
  server: { port: 5191, strictPort: true, fs: { allow: [resolve(__dirname), KERN] } },
  build: {
    assetsInlineLimit: 0,
    rollupOptions: { input: { start: resolve(__dirname, 'index.html') } },
  },
});
