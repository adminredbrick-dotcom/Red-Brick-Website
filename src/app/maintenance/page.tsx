import type { Metadata } from "next";
import Link from "next/link";

import { ComposerForm } from "@/components/forms/composer-form";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { FaqList } from "@/components/shared/faq-list";
import { PageIntro } from "@/components/shared/page-intro";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { business } from "@/config/business";
import { routes } from "@/config/site";
import { maintenanceCopy } from "@/content/approved-copy";
import { contentRepository } from "@/lib/content/repository";
import { submitLandlordMaintenance, submitRepairReport } from "@/lib/forms/actions";
import { landlordMaintenanceFormSpec, repairFormSpec, urgencyOptions } from "@/lib/forms/messages";

export const metadata: Metadata = {
  title: routes.maintenance.title,
  description: routes.maintenance.description,
};

const stepDetails: Record<string, string> = {
  Report: "Tell us what has happened, where, and how urgent it feels.",
  Triage: "We assess the issue and agree the right priority.",
  Arrange: "The appropriate work is organised for the property.",
  Update: "You are kept informed about what happens next.",
  Resolve: "The issue is completed and checked.",
};

/**
 * Maintenance — the care after move-in. Urgent safety guidance first, then
 * two routes: tenants report a repair (validated form → WhatsApp message,
 * because no delivery endpoint is confirmed yet), landlords see how
 * coordination works and can raise a question the same way. The five-step
 * process and the FAQ keep every claim inside the approved copy: no
 * response times, no 24/7 promise.
 */
export default async function MaintenancePage() {
  const faqs = await contentRepository.faqs("maintenance");
  return (
    <>
      <PageIntro eyebrow="Maintenance" heading={maintenanceCopy.heading} lede={maintenanceCopy.body} />

      {/* Urgent safety guidance sits before any reporting route. */}
      <section aria-labelledby="urgent-heading" className="container-rb pb-10">
        <div className="rounded-lg border-l-4 border-attention bg-white p-6 shadow-soft md:p-8">
          <h2 id="urgent-heading" className="text-xl">
            If the situation is dangerous
          </h2>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-ink">
            <li>
              If you can smell gas, call the National Gas Emergency line on <strong>0800 111 999</strong> and
              follow their advice.
            </li>
            <li>
              If there is a fire, a risk to life or a crime in progress, call <strong>999</strong>.
            </li>
          </ul>
          <p className="mt-3 text-stone">
            Those services are the right first step for genuine emergencies. Tell us afterwards so we can
            help with what happens next at the property.
          </p>
        </div>
      </section>

      <section aria-labelledby="routes-heading" className="bg-white">
        <div className="container-rb py-14 md:py-20">
          <h2 id="routes-heading" className="text-section">
            Two clear routes
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card className="p-8">
              <p className="text-eyebrow text-brick">For tenants</p>
              <CardTitle className="mt-3 text-2xl">I live in a Red Brick property</CardTitle>
              <CardContent className="mt-3 p-0 text-stone">
                Report a repair and understand what happens next. The exact response depends on the issue
                and the arrangements for the property.
              </CardContent>
              <div className="mt-5">
                <Button asChild>
                  <Link href="#report">Report a repair</Link>
                </Button>
              </div>
            </Card>
            <Card className="p-8">
              <p className="text-eyebrow text-brick">For landlords</p>
              <CardTitle className="mt-3 text-2xl">I own a property</CardTitle>
              <CardContent className="mt-3 p-0 text-stone">
                See how maintenance is coordinated, how work is arranged and how communication works while
                it is underway.
              </CardContent>
              <div className="mt-5">
                <Button asChild variant="outline">
                  <Link href="#landlords">How coordination works</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section aria-labelledby="process-heading" className="container-rb py-14 md:py-20">
        <h2 id="process-heading" className="text-section">
          Five clear steps
        </h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-5">
          {maintenanceCopy.steps.map((step, index) => (
            <li key={step} className="rounded-lg bg-white p-5 shadow-soft">
              <p className="text-eyebrow text-brick">Step {index + 1}</p>
              <p className="mt-2 text-xl font-bold">{step}</p>
              <p className="mt-2 text-stone">{stepDetails[step]}</p>
            </li>
          ))}
        </ol>
        <p className="measure-body mt-6 text-stone">
          We do not quote fixed response times or promise round-the-clock cover — the response depends
          on the issue and the property. What you can rely on is knowing what is happening at each step.
        </p>
      </section>

      <section id="report" aria-labelledby="report-heading" className="scroll-mt-20 bg-sand">
        <div className="container-rb py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-14">
            <div>
              <p className="text-eyebrow text-brick-deep">For tenants</p>
              <h2 id="report-heading" className="text-section mt-3">
                Report a repair
              </h2>
              <p className="measure-body mt-4 text-lg text-ink/80">
                Fill in the form and we turn it into a WhatsApp message for you to send — WhatsApp{" "}
                {business.whatsapp.displayNumber} is our confirmed route while online delivery is being set
                up. Photos help: attach them in WhatsApp after you send.
              </p>
              <h3 className="mt-8 text-xl">What counts as urgent</h3>
              <ul className="mt-3 flex flex-col gap-3">
                {urgencyOptions.map((o) => {
                  const [label, detail] = o.label.split(" — ");
                  return (
                    <li key={o.value} className="rounded-md bg-white p-4 shadow-soft">
                      <p className="font-bold text-ink">{label}</p>
                      <p className="mt-1 text-ink/80">{detail}</p>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-6 text-ink/80">
                Prefer to message straight away? <WhatsAppLink variant="inline" className="text-brick-deep" />
              </p>
            </div>
            <ComposerForm spec={repairFormSpec} action={submitRepairReport} idPrefix="repair" headingLevel="h3" />
          </div>
        </div>
      </section>

      <section id="landlords" aria-labelledby="landlords-heading" className="scroll-mt-20 bg-white">
        <div className="container-rb py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-14">
            <div>
              <p className="text-eyebrow text-brick">For landlords</p>
              <h2 id="landlords-heading" className="text-section mt-3">
                How maintenance is coordinated
              </h2>
              <ul className="mt-6 flex flex-col gap-4">
                <li className="rounded-md bg-cream p-4">
                  <p className="font-bold text-ink">One route in</p>
                  <p className="mt-1 text-stone">
                    Tenants report to us. We assess the issue and agree its priority, so you are not fielding
                    calls about repairs.
                  </p>
                </li>
                <li className="rounded-md bg-cream p-4">
                  <p className="font-bold text-ink">Work arranged, not assumed</p>
                  <p className="mt-1 text-stone">
                    How approvals and costs work for your property is agreed with you when we set up
                    management, and followed every time.
                  </p>
                </li>
                <li className="rounded-md bg-cream p-4">
                  <p className="font-bold text-ink">Everyone kept informed</p>
                  <p className="mt-1 text-stone">
                    You and the tenant hear what is happening at each step, and the work is checked before
                    it is called resolved.
                  </p>
                </li>
              </ul>
              <p className="mt-6 text-stone">
                Exact service levels and fees will be published once confirmed. Ask us and we will explain
                what we would do for your property. {business.meetings}
              </p>
            </div>
            <ComposerForm
              spec={landlordMaintenanceFormSpec}
              action={submitLandlordMaintenance}
              idPrefix="landlord-maintenance"
              headingLevel="h3"
              className="bg-cream"
            />
          </div>
        </div>
      </section>

      {faqs ? (
        <div className="container-rb py-14 md:py-20">
          <FaqList group={faqs} />
        </div>
      ) : null}
    </>
  );
}
