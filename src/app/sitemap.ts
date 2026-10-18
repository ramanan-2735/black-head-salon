import type { MetadataRoute } from "next";
import { config } from "@/lib/config";

/** Public marketing pages only. Demo builds publish no sitemap, since robots.ts blocks them. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (config.isDemo) return [];
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.invalid";
  return ["/", "/services", "/lookbook"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
