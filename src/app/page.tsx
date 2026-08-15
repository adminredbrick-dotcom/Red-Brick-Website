import type { Metadata } from "next";

import { parseAudience } from "@/components/home/audience";
import { AudienceRoot } from "@/components/home/audience-root";
import { HomeFinale } from "@/components/home/home-finale";
import { HomeHero } from "@/components/home/home-hero";
import { HouseIllustrationDefs } from "@/components/home/house-illustration";
import { HouseStory } from "@/components/home/house-story";
import { InsightsSection } from "@/components/home/insights-section";
import { MaintenanceSection } from "@/components/home/maintenance-section";
import { PropertiesPreview } from "@/components/home/properties-preview";
import { ToolsSection } from "@/components/home/tools-section";
import { TrustStrip } from "@/components/home/trust-strip";
import { routes } from "@/config/site";
import { getListingsRepository } from "@/data/repositories/listings";

export const metadata: Metadata = {
  title: routes.home.title,
  description: routes.home.description,
};

/** Section ids — used for skip links, audience returns and tests. */
const SECTION = {
  story: "house-story",
  properties: "peterborough-properties",
  tools: "useful-tools",
  maintenance: "maintenance",
  insights: "insights",
  finale: "next-step",
} as const;

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Homepage — Phase 2 static vertical slice.
 *
 * Section order (approved): hero → local trust → house story → Peterborough
 * properties → useful tools → maintenance → insights → finale.
 *
 * Audience personalisation reads `?audience=landlord|tenant` on the server
 * (no JavaScript required) and is enhanced in place by a small client
 * island. Everything else is a Server Component.
 */
export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const audience = parseAudience(params.audience);
  const fromUrl = params.audience !== undefined;

  const repo = await getListingsRepository();
  const listings = await repo.list();

  return (
    <AudienceRoot initialAudience={audience} fromUrl={fromUrl}>
      {/* House parts are declared once; every illustration instance references them. */}
      <HouseIllustrationDefs />

      {/* 1 — Hero: orientation, audience choice and direct actions before any media. */}
      <HomeHero storyId={SECTION.story} />

      {/* 2 — Local trust: only the three verified points. */}
      <TrustStrip />

      {/* 3 — Static house story: the storyboard for the future scroll sequence. */}
      <HouseStory id={SECTION.story} skipToId={SECTION.properties} />

      {/* 4 — Peterborough properties preview: illustrative fixtures only. */}
      <PropertiesPreview id={SECTION.properties} listings={listings} />

      {/* 5 — Two useful tools. */}
      <ToolsSection id={SECTION.tools} />

      {/* 6 — Maintenance process. */}
      <MaintenanceSection id={SECTION.maintenance} />

      {/* 7 — Insights: honest pending state. */}
      <InsightsSection id={SECTION.insights} />

      {/* 8 — Finale: one clear, personalised next action. */}
      <HomeFinale id={SECTION.finale} />
    </AudienceRoot>
  );
}
