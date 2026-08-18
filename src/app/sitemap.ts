import type { MetadataRoute } from "next";

import { staticPaths } from "@/config/site";
import { articleIndexable, contentRepository } from "@/lib/content/repository";
import { listingsRepository } from "@/lib/listings/repository";
import { absoluteUrl } from "@/lib/seo/site";

/**
 * Sitemap of the public routes: static pages, the portfolio property pages
 * and reviewed articles. Experiments and draft articles are excluded. The
 * site is still `noindex` pre-launch (layout metadata) — the sitemap is
 * ready for launch, not an invitation to index early.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" || path === "/properties" ? "daily" : "monthly",
    priority: path === "/" ? 1 : path === "/properties" ? 0.9 : 0.6,
  }));
  const listings = await listingsRepository.all();
  const properties: MetadataRoute.Sitemap = listings.map((l) => ({
    url: absoluteUrl(`/properties/${l.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: l.status === "available" ? 0.8 : 0.4,
  }));
  const articles = (await contentRepository.articles()).filter(articleIndexable);
  const insights: MetadataRoute.Sitemap = articles.map((a) => ({
    url: absoluteUrl(`/insights/${a.slug}`),
    lastModified: new Date(a.reviewedOn),
    changeFrequency: "monthly",
    priority: 0.5,
  }));
  return [...pages, ...properties, ...insights];
}
