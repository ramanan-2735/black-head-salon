import type { MetadataRoute } from "next";
import { config } from "@/lib/config";

/** Demo builds are kept out of search engines. Production blocks only the owner and API paths. */
export default function robots(): MetadataRoute.Robots {
  if (config.isDemo) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/ui", "/book/"] },
  };
}
