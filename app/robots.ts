import type { MetadataRoute } from "next";

// Archiv alt.neuralnautic.de (Zweig `alt`): komplett gesperrt, keine Sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
