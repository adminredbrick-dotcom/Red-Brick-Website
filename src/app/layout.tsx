import type { Metadata } from "next";

import { inter, robotoCondensed } from "@/app/fonts";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SkipLink } from "@/components/layout/skip-link";
import { business } from "@/config/business";
import { routes } from "@/config/site";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${business.name} — ${business.tagline}`,
    template: `%s — ${business.name}`,
  },
  description: routes.home.description,
  // Pre-launch: the site must not be indexed until the domain is confirmed
  // and launch is approved (owner-decision register, AS-10).
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${robotoCondensed.variable}`}>
      <body className="flex min-h-screen flex-col">
        {/* JS-only controls (e.g. Switch story) hide for visitors without JavaScript. */}
        <noscript>
          <style>{`[data-needs-js]{display:none !important}`}</style>
        </noscript>
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
