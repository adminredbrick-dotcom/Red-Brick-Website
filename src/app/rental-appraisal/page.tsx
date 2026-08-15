import type { Metadata } from "next";

import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { PageIntro } from "@/components/shared/page-intro";
import { PendingSection } from "@/components/shared/pending-section";
import { routes } from "@/config/site";

export const metadata: Metadata = {
  title: routes.rentalAppraisal.title,
  description: routes.rentalAppraisal.description,
};

export default function RentalAppraisalPage() {
  return (
    <>
      <PageIntro
        eyebrow="Indicative rental estimate"
        heading="What could your property rent for?"
        lede="An indicative rental estimate is a starting point, not a valuation. We confirm our recommendation after reviewing the property, its condition and the current market."
      />
      <section className="container-rb pb-16 md:pb-24">
        <h2 className="sr-only">Request an estimate</h2>
        <PendingSection title="The online estimate tool is being prepared">
          <p>
            A short form will let you describe your property and receive an indicative monthly
            range with honest evidence and context — never a guaranteed figure.
          </p>
          <p className="mt-3">
            Until it is ready, request a rental appraisal directly and we will arrange it with
            you: <WhatsAppLink variant="inline" />. Meetings are available by appointment.
          </p>
        </PendingSection>
      </section>
    </>
  );
}
