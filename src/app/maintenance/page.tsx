import type { Metadata } from "next";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { PageIntro } from "@/components/shared/page-intro";
import { PendingSection } from "@/components/shared/pending-section";
import { routes } from "@/config/site";
import { maintenanceCopy } from "@/content/approved-copy";

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

export default function MaintenancePage() {
  return (
    <>
      <PageIntro
        eyebrow="Maintenance"
        heading={maintenanceCopy.heading}
        lede={maintenanceCopy.body}
      />

      {/* Urgent safety guidance sits before any reporting route. */}
      <section aria-labelledby="urgent-heading" className="container-rb pb-10">
        <div className="rounded-lg border-l-4 border-attention bg-white p-6 shadow-soft md:p-8">
          <h2 id="urgent-heading" className="text-xl">
            If the situation is dangerous
          </h2>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-ink">
            <li>
              If you can smell gas, call the National Gas Emergency line on{" "}
              <strong>0800 111 999</strong> and follow their advice.
            </li>
            <li>
              If there is a fire, a risk to life or a crime in progress, call <strong>999</strong>.
            </li>
          </ul>
          <p className="mt-3 text-stone">
            Those services are the right first step for genuine emergencies. Tell us afterwards so
            we can help with what happens next at the property.
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
                Report a repair and understand what happens next. The exact response depends on
                the issue and the arrangements for the property.
              </CardContent>
            </Card>
            <Card className="p-8">
              <p className="text-eyebrow text-brick">For landlords</p>
              <CardTitle className="mt-3 text-2xl">I own a property</CardTitle>
              <CardContent className="mt-3 p-0 text-stone">
                See how maintenance is coordinated, how work is arranged and how communication
                works while it is underway.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section aria-labelledby="process-heading" className="container-rb py-14 md:py-20">
        <h2 id="process-heading" className="text-section">
          How the process works
        </h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {maintenanceCopy.steps.map((step, index) => (
            <li key={step} className="rounded-md bg-white p-5 shadow-soft">
              <span className="text-eyebrow text-brick">Step {index + 1}</span>
              <p className="mt-1 text-lg font-bold">{step}</p>
              <p className="mt-2 text-base text-stone">{stepDetails[step]}</p>
            </li>
          ))}
        </ol>

        <PendingSection title="Online repair reporting is not yet active" className="mt-10">
          <p>
            The repair-report form is part of a later build stage. Until it is ready, message us
            on WhatsApp and we will pick the issue up through the same process:{" "}
            <WhatsAppLink variant="inline" />.
          </p>
        </PendingSection>
      </section>
    </>
  );
}
