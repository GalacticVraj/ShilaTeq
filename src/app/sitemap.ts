import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { compareRoutes } from "@/content/compare";
import { industries } from "@/content/industries";
import { guides } from "@/content/guides";
import { docsIndex } from "@/content/docs-index";
import { legalDocs } from "@/content/legal";

/**
 * Sitemap (M6 SEO). Enumerates every indexable route from the content models,
 * so new content entries appear automatically. Absolute URLs require the
 * domain (Gate-zero); until then the sitemap is generated relative and should
 * be regenerated once NEXT_PUBLIC_SITE_URL is set.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url ?? "";
  const now = new Date();

  const staticRoutes = [
    "/",
    "/product",
    "/product/inventory-qr",
    "/product/sales-gst",
    "/product/worker-app",
    "/product/showroom",
    "/demo",
    "/why",
    "/industries",
    "/pricing",
    "/resources",
    "/guides",
    "/faq",
    "/docs",
    "/about",
    "/contact",
    "/security",
    "/legal",
    "/showroom-powered-by",
  ];

  const dynamic = [
    ...compareRoutes.map((r) => `/why/${r.slug}`),
    ...industries.map((i) => `/industries/${i.slug}`),
    ...guides.map((g) => `/guides/${g.slug}`),
    ...docsIndex.map((d) => `/docs/${d.slug}`),
    ...legalDocs.map((d) => `/legal/${d.slug}`),
  ];

  return [...staticRoutes, ...dynamic].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
