import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /use-cases ist entfallen (29.10.2026), war auf der Live-Seite indexiert: dauerhaft auf /leistungen.
  async redirects() {
    return [{ source: "/use-cases", destination: "/leistungen", permanent: true }];
  },
};

export default nextConfig;

// Cloudflare-Bindings (IMAGES, ASSETS) auch in `next dev` verfuegbar machen
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
