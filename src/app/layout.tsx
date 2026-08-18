import type { Metadata } from "next";

import { inter, robotoCondensed } from "@/app/fonts";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SkipLink } from "@/components/layout/skip-link";
import { business } from "@/config/business";
import { routes } from "@/config/site";
import { organisationJsonLd, siteOrigin } from "@/lib/seo/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: {
    default: `${business.name} — ${business.tagline}`,
    template: `%s — ${business.name}`,
  },
  description: routes.home.description,
  applicationName: business.name,
  // Pre-launch: the site must not be indexed until the domain is confirmed
  // and launch is approved (owner-decision register, AS-10).
  robots: { index: false, follow: false },
  // Social previews: per-page titles/descriptions come from each route's metadata;
  // the image is generated from confirmed facts (src/app/opengraph-image.tsx).
  openGraph: {
    type: "website",
    siteName: business.name,
    locale: "en_GB",
    title: `${business.name} — ${business.tagline}`,
    description: routes.home.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name} — ${business.tagline}`,
    description: routes.home.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${robotoCondensed.variable}`}>
      <body className="flex min-h-screen flex-col">
        {/* JS-only controls (e.g. Switch story) hide for visitors without JavaScript. */}
        <noscript>
          <style>{`[data-needs-js]{display:none !important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd()) }} />
        <SkipLink />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
