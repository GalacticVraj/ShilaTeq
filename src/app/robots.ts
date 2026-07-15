import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/**
 * robots directives (M6 SEO). Allow all; point at the sitemap when a real
 * domain exists (Gate-zero). Utility/app routes carry their own noindex.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(site.url ? { sitemap: `${site.url}/sitemap.xml`, host: site.url } : {}),
  };
}
