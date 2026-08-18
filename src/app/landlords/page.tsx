import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { ArticleCard } from "@/components/insights/article-parts";
import { AppraisalPreview } from "@/components/previews/appraisal-preview";
import { FaqList } from "@/components/shared/faq-list";
import { PageIntro } from "@/components/shared/page-intro";
import { PendingSection } from "@/components/shared/pending-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { business } from "@/config/business";
import { routes } from "@/config/site";
import { landlordRouteCopy } from "@/content/approved-copy";
import { guidanceReviewedOn, landlordJourney, landlordRequirements } from "@/lib/content/guidance";
import { contentRepository } from "@/lib/content/repository";
import { formatUkDate } from "@/lib/format";

export const metadata: Metadata = {
  title: routes.landlords.title,
  description: routes.landlords.description,
};

/**
 * Landlords — the problem in plain language, the Let / Manage / Care journey
 * described as process (not unconfirmed packages), the standing legal
 * requirements with official sources, the appraisal entry point, FAQ and
 * related guidance. Fees and exact service levels stay honestly pending.
 */
export default async function LandlordsPage() {
  const faqs = await contentRepository.faqs("landlords");
  const guidance = await contentRepository.articles("landlords");
  return (
    <>
      <PageIntro
        eyebrow="For landlords"
        heading={landlordRouteCopy.heading}
        lede="Letting a home involves preparation, marketing, administration, compliance and maintenance — often all at once, and each with its own deadline. We bring those parts into one clear journey so you always know where things stand."
      />

      <section aria-labelledby="journey-heading" className="bg-white">
        <div className="container-rb py-14 md:py-20">
          <h2 id="journey-heading" className="text-section">
            One clear journey
          </h2>
          <p className="measure-body mt-4 text-lg text-stone">{landlordRouteCopy.body}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {landlordJourney.map((stage, index) => (
              <Card key={stage.heading}>
                <p className="text-eyebrow text-brick">Stage {index + 1}</p>
                <CardTitle className="mt-2">{stage.heading}</CardTitle>
                <CardContent className="mt-2 p-0 text-stone">{stage.body}</CardContent>
                {stage.link ? (
                  <div className="mt-4">
                    <Link href={stage.link.href} className="font-bold text-brick underline underline-offset-4">
                      {stage.link.label}
                    </Link>
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
          <PendingSection title="Service choices and fees are being confirmed" className="mt-8">
            <p>
              Exact service levels and fees will be published once Red Brick Lettings confirms them. Until
              then, ask us and we will explain what we would do for your property. {business.meetings}
            </p>
          </PendingSection>
        </div>
      </section>

      <section aria-labelledby="appraisal-heading" className="bg-sand">
        <div className="container-rb py-14 md:py-20">
          <AppraisalPreview headingLevel="h2" headingId="appraisal-heading" />
        </div>
      </section>

      <section aria-labelledby="requirements-heading" className="container-rb py-14 md:py-20">
        <p className="text-eyebrow text-brick">Compliance</p>
        <h2 id="requirements-heading" className="text-section mt-3">
          What a rented home in England needs
        </h2>
        <p className="measure-body mt-4 text-lg text-stone">
          The standing requirements, each with its official source. Guidance, not legal advice — rules
          change, so the sources are the last word. Checked {formatUkDate(guidanceReviewedOn)}.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {landlordRequirements.map((item) => (
            <li key={item.id} className="rounded-lg bg-white p-5 shadow-soft">
              <p className="text-lg font-bold text-ink">{item.title}</p>
              <p className="mt-2 text-stone">{item.text}</p>
              <p className="mt-3 text-sm">
                <a href={item.source.href} rel="noopener noreferrer" className="font-bold text-brick underline underline-offset-4">
                  {item.source.label}
                </a>
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-stone">
          For managed properties we track certificate dates and coordinate renewals with you.
        </p>
      </section>

      {faqs ? (
        <section className="bg-white">
          <div className="container-rb py-14 md:py-20">
            <FaqList group={faqs} />
          </div>
        </section>
      ) : null}

      {guidance.length > 0 ? (
        <section aria-labelledby="landlord-guidance-heading" className="container-rb py-14 md:py-20">
          <h2 id="landlord-guidance-heading" className="text-section">
            Guidance for landlords
          </h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-label="Landlord articles">
            {guidance.map((a) => (
              <li key={a.slug}>
                <ArticleCard article={a} />
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link href="/insights?category=landlords" className="inline-flex items-center gap-1 font-bold text-brick underline underline-offset-4">
              All landlord articles
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </p>
        </section>
      ) : null}

      <section aria-labelledby="landlord-cta-heading" className="bg-ink text-cream" data-surface="dark">
        <div className="container-rb py-14 md:py-20">
          <h2 id="landlord-cta-heading" className="text-section max-w-2xl text-cream">
            What could your property rent for?
          </h2>
          <p className="measure-body mt-4 text-lg text-cream/85">
            Start with an indicative rental estimate, then let us confirm our recommendation after
            reviewing the property properly.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-ink hover:bg-sand">
              <Link href={routes.rentalAppraisal.path}>{landlordRouteCopy.cta}</Link>
            </Button>
            <WhatsAppLink variant="button" className="border-2 border-cream/60 bg-transparent text-cream hover:bg-cream/10" />
          </div>
        </div>
      </section>
    </>
  );
}
