import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ArticleCard } from "@/components/insights/article-parts";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { PropertyPreview } from "@/components/previews/property-preview";
import { FaqList } from "@/components/shared/faq-list";
import { PageIntro } from "@/components/shared/page-intro";
import { MoveInCostCalculator } from "@/components/tenants/move-in-cost-calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { routes } from "@/config/site";
import { tenantRouteCopy } from "@/content/approved-copy";
import { tenantJourney } from "@/lib/content/guidance";
import { contentRepository } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: routes.tenants.title,
  description: routes.tenants.description,
};

interface TenantsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Tenants — find a property, understand the application and move-in
 * journey, see clear costs (the calculator applies England's caps to a rent
 * the visitor enters), common questions, and the quick route to repairs.
 */
export default async function TenantsPage({ searchParams }: TenantsPageProps) {
  const params = await searchParams;
  const faqs = await contentRepository.faqs("tenants");
  const guidance = await contentRepository.articles("tenants");
  return (
    <>
      <PageIntro eyebrow="For tenants" heading={tenantRouteCopy.heading} lede={tenantRouteCopy.body} />

      <section aria-labelledby="tenant-journey-heading" className="bg-white">
        <div className="container-rb py-14 md:py-20">
          <h2 id="tenant-journey-heading" className="text-section">
            Your journey with us
          </h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tenantJourney.map((stage, index) => (
              <li key={stage.heading}>
                <Card className="h-full">
                  <p className="text-eyebrow text-brick">Step {index + 1}</p>
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
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="tenant-properties-heading" className="bg-cream">
        <div className="container-rb py-14 md:py-20">
          <PropertyPreview headingId="tenant-properties-heading" headingLevel="h2" limit={3} />
        </div>
      </section>

      <section id="move-in-costs" aria-labelledby="move-in-costs-heading" className="scroll-mt-20 bg-sand">
        <div className="container-rb py-14 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-14">
            <MoveInCostCalculator rentParam={params.rent} />
            <div className="rounded-lg bg-white p-6 shadow-soft md:p-8">
              <p className="text-eyebrow text-brick">Applying</p>
              <h3 className="mt-2 text-2xl">What happens after a viewing</h3>
              <ol className="mt-4 flex list-decimal flex-col gap-3 pl-5 text-ink">
                <li>You tell us you would like to go ahead.</li>
                <li>We explain the application and referencing steps for that home and what documents are needed.</li>
                <li>If a holding deposit is taken it is capped at one week&rsquo;s rent, and no rent is due before you sign.</li>
                <li>Once the agreement is signed: rent in advance (at most one month), the protected deposit, inventory and keys.</li>
              </ol>
              <p className="mt-4 text-stone">
                We do not quote how long each step takes — it depends on the home and on how quickly
                references come back — but you will always know what is happening next.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="repairs-heading" className="bg-white">
        <div className="container-rb py-14 md:py-20">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-eyebrow text-brick">Already rent with us?</p>
              <h2 id="repairs-heading" className="text-section mt-3">
                Something needs attention?
              </h2>
              <p className="measure-body mt-4 text-lg text-stone">
                Report a repair and we agree the priority with you: report, triage, arrange, update,
                resolve. If it is dangerous — a smell of gas, a fire, a risk to life — call the emergency
                services first.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/maintenance#report">Report a repair</Link>
                </Button>
                <WhatsAppLink variant="button" className="border-2 border-ink bg-transparent text-ink hover:bg-sand" />
              </div>
            </div>
            <div className="rounded-lg bg-cream p-6 md:p-8">
              <p className="font-bold text-ink">Good to know</p>
              <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-ink">
                <li>Your deposit is protected in a government-approved scheme for the whole tenancy.</li>
                <li>Gas and electrical safety records for the home are yours to see — ask if you have not had copies.</li>
                <li>Report problems early: small faults are easier to fix than big ones.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {faqs ? (
        <div className="container-rb py-14 md:py-20">
          <FaqList group={faqs} />
        </div>
      ) : null}

      {guidance.length > 0 ? (
        <section aria-labelledby="tenant-guidance-heading" className="bg-white">
          <div className="container-rb py-14 md:py-20">
            <h2 id="tenant-guidance-heading" className="text-section">
              Guidance for tenants
            </h2>
            <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-label="Tenant articles">
              {guidance.map((a) => (
                <li key={a.slug}>
                  <ArticleCard article={a} />
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <Link href="/insights?category=tenants" className="inline-flex items-center gap-1 font-bold text-brick underline underline-offset-4">
                All tenant articles
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </p>
          </div>
        </section>
      ) : null}
    </>
  );
}
