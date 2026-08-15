import type { Metadata } from "next";

import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { PageIntro } from "@/components/shared/page-intro";
import { PendingSection } from "@/components/shared/pending-section";
import { routes } from "@/config/site";

export const metadata: Metadata = {
  title: routes.properties.title,
  description: routes.properties.description,
};

export default function PropertiesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Properties"
        heading="Properties to rent in Peterborough"
        lede="Clear costs, honest information and a practical way to search — with a full list view and a Peterborough map."
      />
      <section className="container-rb pb-16 md:pb-24">
        <h2 className="sr-only">Available properties</h2>
        <PendingSection title="No properties are published yet">
          <p>
            The property search — with filters, a complete list and a Peterborough map — is being
            built in a later stage of this website. Nothing shown here will ever be a fictional
            listing dressed up as a real home.
          </p>
          <p className="mt-3">
            To ask about availability now, message us on WhatsApp:{" "}
            <WhatsAppLink variant="inline" />
          </p>
        </PendingSection>
      </section>
    </>
  );
}
