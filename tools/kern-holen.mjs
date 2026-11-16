// Kopiert den gemeinsamen Kern aus ../funnel-vorlage/src/kern nach vendor/kern (Pruefpunkt A4, NN-WR-10).
//
// Warum: Der Kern wird zentral in funnel-vorlage entwickelt. Der Build bei Cloudflare (Workers Builds)
// sieht nur dieses Repo, ohne Nachbarordner. Deshalb liegt eine Kopie im Repo und wird mitcommittet.
// Laeuft automatisch vor jedem `npm run build` (prebuild). Fehlt ../funnel-vorlage (wie in der CI),
// bleibt die vorhandene Kopie unveraendert.
//
// Nach einer Aenderung am Kern: `npm run build` (oder `npm run kern`), dann vendor/kern mitcommitten.
import { cpSync, existsSync, rmSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const quelle = resolve(wurzel, '../funnel-vorlage/src/kern');
const ziel = resolve(wurzel, 'vendor/kern');

function fingerabdruck(ordner) {
  if (!existsSync(ordner)) return null;
  const h = createHash('sha256');
  const dateien = [];
  (function lauf(d) {
    for (const n of readdirSync(d).sort()) {
      const p = join(d, n);
      if (statSync(p).isDirectory()) lauf(p); else dateien.push(p);
    }
  })(ordner);
  for (const p of dateien) h.update(relative(ordner, p).replaceAll('\\', '/')).update(readFileSync(p));
  return h.digest('hex').slice(0, 12);
}

if (!existsSync(quelle)) {
  if (!existsSync(ziel)) {
    console.error('[kern] Weder ../funnel-vorlage/src/kern noch vendor/kern vorhanden. Build nicht moeglich.');
    process.exit(1);
  }
  console.log(`[kern] ../funnel-vorlage fehlt, nutze vendor/kern (${fingerabdruck(ziel)}).`);
  process.exit(0);
}

const vorher = fingerabdruck(ziel);
const neu = fingerabdruck(quelle);
if (vorher === neu) {
  console.log(`[kern] vendor/kern ist aktuell (${neu}).`);
  process.exit(0);
}
rmSync(ziel, { recursive: true, force: true });
cpSync(quelle, ziel, { recursive: true });
console.log(`[kern] vendor/kern aktualisiert: ${vorher ?? 'leer'} -> ${neu}. Bitte mitcommitten.`);
