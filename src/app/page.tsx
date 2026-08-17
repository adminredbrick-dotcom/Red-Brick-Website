import type { Metadata } from "next";

import { StoryProvider } from "@/components/home/audience/story-provider";
import { Hero } from "@/components/home/hero";
import { HouseStage } from "@/components/home/house/house-stage";
import { ClosingSection, InsightsSection, IntroAndMediaStory, MaintenanceSection } from "@/components/home/sections";
import { AppraisalPreview } from "@/components/previews/appraisal-preview";
import { MoveInCostPreview } from "@/components/previews/move-in-cost-preview";
import { PropertyPreview } from "@/components/previews/property-preview";
import { routes } from "@/config/site";

export const metadata: Metadata = {
  title: routes.home.title,
  description: routes.home.description,
};

const STORY_SECTION_ID = "house-story";
const AFTER_STORY_ID = "after-story";

/**
 * Production homepage — the approved D+B hybrid direction promoted to `/`
 * (storyboard v3): cinematic hero → landlord/tenant choice → local
 * introduction and scroll-led stock-footage story → personalised 3D-house
 * chapter → Phase 2 properties/map preview → appraisal and move-in-cost
 * previews → maintenance → insights → WhatsApp conclusion (footer follows).
 * `/experiments/hybrid-db` stays untouched as the reviewed prototype.
 */
export default function HomePage() {
  return (
    <StoryProvider>
      {/* 1 + 2 — Cinematic hero with the audience choice (live HTML actions first). */}
      <Hero storyTargetId={STORY_SECTION_ID} />

      {/* 3 — Local introduction and the scroll-led stock-footage story. */}
      <IntroAndMediaStory />

      {/* 4 — Personalised 3D-house chapter (bounded; static-first; skippable). */}
      <HouseStage sectionId={STORY_SECTION_ID} skipTargetId={AFTER_STORY_ID} />

      {/* 5 — Phase 2 properties / map preview. */}
      <section aria-labelledby={AFTER_STORY_ID} className="bg-white">
        <div className="container-rb py-16 md:py-20">
          <PropertyPreview headingId={AFTER_STORY_ID} />
        </div>
      </section>

      {/* 6 — Phase 2 appraisal and move-in-cost previews. */}
      <section aria-labelledby="tools-heading" className="bg-sand">
        <div className="container-rb py-16 md:py-20">
          <p className="text-eyebrow text-brick-deep">Landlord and tenant tools</p>
          <h2 id="tools-heading" className="text-section mt-3 max-w-3xl">
            What could your property rent for — and what does moving in cost?
          </h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <AppraisalPreview headingLevel="h3" />
            <MoveInCostPreview headingLevel="h3" />
          </div>
        </div>
      </section>

      {/* 7 — Maintenance. */}
      <MaintenanceSection />

      {/* 8 — Insights. */}
      <InsightsSection />

      {/* 9 — WhatsApp conclusion; the footer follows from the layout. */}
      <ClosingSection />
    </StoryProvider>
  );
}
