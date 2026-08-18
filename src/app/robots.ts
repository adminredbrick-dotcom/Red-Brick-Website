import type { MetadataRoute } from "next";

import { absoluteUrl, indexingEnabled } from "@/lib/seo/site";

/**
 * Pre-launch: nothing is indexed (matches the `noindex` in the root layout).
 * With NEXT_PUBLIC_SITE_INDEXING=on (launch), only experiments/internal routes are
 * disallowed and the sitemap reference stays (owner-decision register, AS-10).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: indexingEnabled()
      ? [{ userAgent: "*", allow: "/", disallow: ["/experiments/", "/api/"] }]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
