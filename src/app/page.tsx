import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { PendingSection } from "@/components/shared/pending-section";
import { business } from "@/config/business";
import { routes } from "@/config/site";
import { whatsappHref } from "@/lib/whatsapp";
import {
  closingCopy,
  heroCopy,
  introductionCopy,
  landlordRouteCopy,
  maintenanceCopy,
  tenantRouteCopy,
  trustPoints,
} from "@/content/approved-copy";

export const metadata: Metadata = {
  title: routes.home.title,
  description: routes.home.description,
};

export default function HomePage() {
  return (
    <>
      {/* 1 — Hero: orientation and audience actions before any media or JS. */}
      <section className="bg-cream">
        <div className="container-rb py-16 md:py-24 lg:py-28">
          <p className="text-eyebrow text-brick">{heroCopy.eyebrow}</p>
          <h1 className="text-hero mt-4 max-w-4xl">{heroCopy.heading}</h1>
          <p className="measure-body mt-6 text-lg text-stone md:text-xl">{heroCopy.supporting}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button asChild size="lg">
              <Link href={routes.landlords.path}>{heroCopy.actions.landlord}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={routes.properties.path}>{heroCopy.actions.tenant}</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href={routes.maintenance.path}>{heroCopy.actions.repair}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2 — Local trust: only the three verified points. */}
      <section aria-labelledby="trust-heading" className="border-y border-stone-light bg-white">
        <div className="container-rb py-12 md:py-16">
          <h2 id="trust-heading" className="sr-only">
            About Red Brick Lettings
          </h2>
          <dl className="grid gap-8 md:grid-cols-3">
            {trustPoints.map((point) => (
              <div key={point.heading}>
                <dt className="text-xl font-bold">{point.heading}</dt>
                <dd className="mt-2 text-stone">{point.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 3 — Introduction; the role-based house story arrives in Phases 2–3. */}
      <section aria-labelledby="intro-heading" className="bg-cream">
        <div className="container-rb py-14 md:py-20">
          <h2 id="intro-heading" className="text-section max-w-2xl">
            A home has a lot of moving parts.
          </h2>
          <p className="measure-body mt-5 text-lg text-stone">{introductionCopy}</p>
        </div>
      </section>

      {/* 4 — Audience routes. */}
      <section aria-labelledby="routes-heading" className="bg-cream">
        <div className="container-rb pb-14 md:pb-20">
          <h2 id="routes-heading" className="sr-only">
            For landlords and tenants
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-8">
              <p className="text-eyebrow text-brick">For landlords</p>
              <CardTitle className="mt-3 text-2xl">{landlordRouteCopy.heading}</CardTitle>
              <CardContent className="mt-3 p-0 text-stone">{landlordRouteCopy.body}</CardContent>
              <div className="mt-6">
                <Button asChild>
                  <Link href={routes.rentalAppraisal.path}>{landlordRouteCopy.cta}</Link>
                </Button>
              </div>
            </Card>
            <Card className="p-8">
              <p className="text-eyebrow text-brick">For tenants</p>
              <CardTitle className="mt-3 text-2xl">{tenantRouteCopy.heading}</CardTitle>
              <CardContent className="mt-3 p-0 text-stone">{tenantRouteCopy.body}</CardContent>
              <div className="mt-6">
                <Button asChild variant="secondary">
                  <Link href={routes.properties.path}>{tenantRouteCopy.cta}</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 5 — Peterborough properties: honest pending state until search ships. */}
      <section aria-labelledby="properties-heading" className="bg-cream">
        <div className="container-rb pb-14 md:pb-20">
          <h2 id="properties-heading" className="text-section">
            Homes in Peterborough
          </h2>
          <PendingSection title="Property search is being prepared" className="mt-6">
            <p>
              The list and map search for available homes is part of a later build stage. Until it
              is ready, message us on WhatsApp to ask about availability.
            </p>
            <p className="mt-3">
              <WhatsAppLink variant="inline" />
            </p>
          </PendingSection>
        </div>
      </section>

      {/* 6 — Maintenance process. */}
      <section aria-labelledby="maintenance-heading" className="bg-white">
        <div className="container-rb py-14 md:py-20">
          <h2 id="maintenance-heading" className="text-section max-w-2xl">
            {maintenanceCopy.heading}
          </h2>
          <p className="measure-body mt-5 text-lg text-stone">{maintenanceCopy.body}</p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {maintenanceCopy.steps.map((step, index) => (
              <li key={step} className="rounded-md bg-cream p-5">
                <span className="text-eyebrow text-brick">Step {index + 1}</span>
                <p className="mt-1 text-lg font-bold">{step}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href={routes.maintenance.path}>{maintenanceCopy.cta}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 7 — Insights preview: honest pending state. */}
      <section aria-labelledby="insights-heading" className="bg-cream">
        <div className="container-rb py-14 md:py-20">
          <h2 id="insights-heading" className="text-section">
            Insights and guidance
          </h2>
          <PendingSection title="Articles are being prepared" className="mt-6">
            <p>
              Guidance for landlords and tenants, plus Peterborough property insight, will be
              published here.
            </p>
            <p className="mt-3">
              <Link href={routes.insights.path} className="font-bold text-brick underline underline-offset-4">
                About our insights
              </Link>
            </p>
          </PendingSection>
        </div>
      </section>

      {/* 8 — Closing action. */}
      <section aria-labelledby="closing-heading" data-surface="dark" className="bg-brick-deep text-cream">
        <div className="container-rb py-14 md:py-20">
          <h2 id="closing-heading" className="text-section max-w-2xl text-cream">
            {closingCopy.heading}
          </h2>
          <p className="measure-body mt-4 text-lg text-cream/85">{closingCopy.body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="bg-white text-ink hover:bg-sand">
              <a href={whatsappHref()}>{closingCopy.cta}</a>
            </Button>
            <p className="text-cream/80">WhatsApp {business.whatsapp.displayNumber}</p>
          </div>
        </div>
      </section>
    </>
  );
}
