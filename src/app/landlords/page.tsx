import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { PageIntro } from "@/components/shared/page-intro";
import { PendingSection } from "@/components/shared/pending-section";
import { routes } from "@/config/site";
import { landlordRouteCopy } from "@/content/approved-copy";

export const metadata: Metadata = {
  title: routes.landlords.title,
  description: routes.landlords.description,
};

/** Approved service architecture (brand guidelines PDF, section 02). */
const serviceJourney = [
  {
    heading: "Let your property",
    body: "Preparation, marketing, tenant-find work, inventory and tenancy setup.",
  },
  {
    heading: "Manage your tenancy",
    body: "Rent administration, communication, inspections and compliance support.",
  },
  {
    heading: "Care for your property",
    body: "Maintenance coordination and the ongoing attention that keeps a property working as it should.",
  },
] as const;

export default function LandlordsPage() {
  return (
    <>
      <PageIntro
        eyebrow="For landlords"
        heading={landlordRouteCopy.heading}
        lede="Letting a home involves preparation, marketing, administration and maintenance — often all at once. We bring those parts into one clear journey."
      />

      <section aria-labelledby="journey-heading" className="bg-white">
        <div className="container-rb py-14 md:py-20">
          <h2 id="journey-heading" className="text-section">
            One clear journey
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {serviceJourney.map((stage, index) => (
              <Card key={stage.heading}>
                <p className="text-eyebrow text-brick">Stage {index + 1}</p>
                <CardTitle className="mt-2">{stage.heading}</CardTitle>
                <CardContent className="mt-2 p-0 text-stone">{stage.body}</CardContent>
              </Card>
            ))}
          </div>
          <p className="measure-body mt-8 text-stone">{landlordRouteCopy.body}</p>
        </div>
      </section>

      <section className="container-rb py-14 md:py-20">
        <h2 className="text-section max-w-2xl">What could your property rent for?</h2>
        <p className="measure-body mt-4 text-lg text-stone">
          Start with an indicative rental estimate, then let us confirm our recommendation after
          reviewing the property properly.
        </p>
        <div className="mt-6">
          <Button asChild size="lg">
            <Link href={routes.rentalAppraisal.path}>{landlordRouteCopy.cta}</Link>
          </Button>
        </div>
        <PendingSection title="Detailed service descriptions are being confirmed" className="mt-10">
          <p>
            Exact service levels and fees will be published once Red Brick Lettings confirms them.
            We would rather leave this space honest than fill it with claims we have not verified.
          </p>
        </PendingSection>
      </section>
    </>
  );
}
