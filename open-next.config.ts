import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Vorgerenderte Seiten kommen aus den statischen Assets (read-only).
// Reicht, solange keine Seite ISR/revalidate nutzt. Sonst R2 noetig —
// das verlangt aber eine hinterlegte Zahlungsart im Cloudflare-Konto.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
