import type { Metadata } from "next";

import { AppraisalPreview } from "@/components/previews/appraisal-preview";
import { MoveInCostPreview } from "@/components/previews/move-in-cost-preview";
import { PropertyPreview } from "@/components/previews/property-preview";
import { PageIntro } from "@/components/shared/page-intro";

export const metadata: Metadata = {
  title: "Phase 2 homepage preview components",
  description: "Internal showcase of the reusable homepage preview components built in Phase 2.",
  robots: { index: false, follow: false },
};

/**
 * Internal showcase route so the three homepage integration components can
 * be reviewed and tested in isolation. The hybrid homepage itself is not
 * edited in this branch — see docs/PHASE-2-INTEGRATION.md for how it will
 * import these components later.
 */
export default function Phase2PreviewsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Internal showcase"
        heading="Phase 2 homepage preview components"
        lede="The property, appraisal and move-in-cost previews the hybrid homepage will import. Everything shown is a demonstration."
      />
      <section aria-labelledby="property-preview-heading" className="bg-white">
        <div className="container-rb py-14 md:py-20">
          <PropertyPreview />
        </div>
      </section>
      <section aria-labelledby="tools-heading" className="bg-sand">
        <div className="container-rb py-14 md:py-20">
          <h2 id="tools-heading" className="text-section">
            Landlord appraisal and tenant cost tools
          </h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <AppraisalPreview headingLevel="h3" />
            <MoveInCostPreview headingLevel="h3" />
          </div>
        </div>
      </section>
    </>
  );
}
