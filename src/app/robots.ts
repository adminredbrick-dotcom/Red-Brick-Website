import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/site";

/**
 * Pre-launch: nothing is indexed (matches the `noindex` in the root layout).
 * At launch, flip `disallow` to the experiments/internal routes only and keep
 * the sitemap reference (owner-decision register, AS-10).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
