import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { PageIntro } from "@/components/shared/page-intro";
import { routes } from "@/config/site";
import { tenantRouteCopy } from "@/content/approved-copy";

export const metadata: Metadata = {
  title: routes.tenants.title,
  description: routes.tenants.description,
};

const tenantJourney = [
  {
    heading: "Find",
    body: "Search clearly and understand what is actually available.",
    link: { label: "View available properties", href: "/properties" },
  },
  {
    heading: "Understand",
    body: "See the important features, costs and practical information before you commit.",
    link: null,
  },
  {
    heading: "Move",
    body: "Understand the steps of the tenancy journey and what will be needed along the way.",
    link: null,
  },
  {
    heading: "Live",
    body: "Know how to reach us, how repairs are handled and what happens next.",
    link: { label: "Get maintenance help", href: "/maintenance" },
  },
] as const;

export default function TenantsPage() {
  return (
    <>
      <PageIntro
        eyebrow="For tenants"
        heading={tenantRouteCopy.heading}
        lede={tenantRouteCopy.body}
      />

      <section aria-labelledby="tenant-journey-heading" className="bg-white">
        <div className="container-rb py-14 md:py-20">
          <h2 id="tenant-journey-heading" className="text-section">
            Your journey with us
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {tenantJourney.map((stage, index) => (
              <Card key={stage.heading}>
                <p className="text-eyebrow text-brick">Step {index + 1}</p>
                <CardTitle className="mt-2">{stage.heading}</CardTitle>
                <CardContent className="mt-2 p-0 text-stone">{stage.body}</CardContent>
                {stage.link ? (
                  <div className="mt-4">
                    <Link
                      href={stage.link.href}
                      className="font-bold text-brick underline underline-offset-4"
                    >
                      {stage.link.label}
                    </Link>
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container-rb py-14 md:py-20">
        <h2 className="text-section max-w-2xl">Ready to look?</h2>
        <p className="measure-body mt-4 text-lg text-stone">
          Application details, move-in costs and common questions will be published as this
          website grows. Available homes will always be the starting point.
        </p>
        <div className="mt-6">
          <Button asChild size="lg">
            <Link href={routes.properties.path}>{tenantRouteCopy.cta}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
