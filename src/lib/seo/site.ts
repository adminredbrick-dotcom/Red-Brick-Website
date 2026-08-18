import { business } from "@/config/business";

/**
 * Canonical site origin for absolute URLs in metadata, sitemap and JSON-LD.
 * The public domain is not confirmed yet (owner register), so this resolves
 * in order: NEXT_PUBLIC_SITE_URL → the Vercel production/deployment host →
 * localhost. Nothing here is rendered as a "fact" to visitors.
 */
export function siteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export function absoluteUrl(path: string): string {
  return `${siteOrigin()}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Organisation structured data from confirmed facts only (no address, phone, hours or credentials until supplied). */
export function organisationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: business.name,
    description: business.description,
    url: siteOrigin(),
    foundingDate: String(business.establishedYear),
    areaServed: { "@type": "City", name: business.serviceArea },
    sameAs: [business.social.facebook, business.social.instagram],
    ...(business.telephone ? { telephone: business.telephone } : {}),
    ...(business.email ? { email: business.email } : {}),
  };
}

/** Site-wide Open Graph / Twitter defaults (per-page titles come from the route metadata). */
export const socialDefaults = {
  siteName: business.name,
  locale: "en_GB",
  type: "website" as const,
  imagePath: "/opengraph-image",
};
