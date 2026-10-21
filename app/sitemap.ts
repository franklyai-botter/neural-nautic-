import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";

// Neue Seite angelegt? Hier eintragen, sonst findet Google sie spaeter.
// lastModified = letzte inhaltliche Aenderung der Seite (git log).
const pages: { path: string; lastModified: string; priority: number }[] = [
  { path: "/", lastModified: "2026-10-21", priority: 1 },
  { path: "/leistungen", lastModified: "2026-10-20", priority: 0.9 },
  { path: "/use-cases", lastModified: "2026-10-20", priority: 0.8 },
  { path: "/methode", lastModified: "2026-10-20", priority: 0.8 },
  { path: "/ki-tool-kompass", lastModified: "2026-10-20", priority: 0.8 },
  { path: "/wissen", lastModified: "2026-10-20", priority: 0.7 },
  { path: "/ueber-mich", lastModified: "2026-10-21", priority: 0.7 },
  { path: "/kontakt", lastModified: "2026-10-20", priority: 0.6 },
  { path: "/impressum", lastModified: "2026-05-02", priority: 0.2 },
  { path: "/datenschutz", lastModified: "2026-05-02", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, lastModified, priority }) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified,
    priority,
  }));
}
