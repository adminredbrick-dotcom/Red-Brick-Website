import type { Metadata } from "next";
import Link from "next/link";

import { ComposerForm } from "@/components/forms/composer-form";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { PageIntro } from "@/components/shared/page-intro";
import { PendingSection } from "@/components/shared/pending-section";
import { business } from "@/config/business";
import { routes } from "@/config/site";
import { submitContactMessage } from "@/lib/forms/actions";
import { contactFormSpec } from "@/lib/forms/messages";

export const metadata: Metadata = {
  title: routes.contact.title,
  description: routes.contact.description,
};

/**
 * Contact — WhatsApp is the confirmed route; the message form validates on
 * the server and composes the WhatsApp message (no delivery endpoint yet).
 * Email, telephone, address and opening hours stay honestly pending until
 * confirmed (src/config/business.ts).
 */
export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        heading="Talk to Red Brick"
        lede="Whether you own a property, are looking for a home or already rent with us, tell us what you need help with."
      />

      <section className="container-rb pb-16 md:pb-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-12">
          <ComposerForm spec={contactFormSpec} action={submitContactMessage} idPrefix="contact" />

          <div className="flex flex-col gap-6">
            <div data-surface="dark" className="rounded-lg bg-ink p-8 text-cream">
              <p className="text-eyebrow text-sand">The quickest way</p>
              <h2 className="mt-3 text-2xl text-cream">WhatsApp {business.whatsapp.displayNumber}</h2>
              <p className="mt-3 text-cream/85">{business.meetings}</p>
              <div className="mt-6">
                <WhatsAppLink variant="button" className="bg-white text-ink hover:bg-sand" />
              </div>
            </div>

            <div className="rounded-lg bg-white p-8 shadow-soft">
              <h2 className="text-2xl">Quick routes</h2>
              <ul className="mt-4 flex flex-col gap-2">
                <li>
                  <Link href="/maintenance#report" className="font-bold text-brick underline underline-offset-4">
                    Report a repair
                  </Link>{" "}
                  <span className="text-stone">— for current tenants</span>
                </li>
                <li>
                  <Link href={routes.rentalAppraisal.path} className="font-bold text-brick underline underline-offset-4">
                    Request a rental appraisal
                  </Link>{" "}
                  <span className="text-stone">— for landlords</span>
                </li>
                <li>
                  <Link href="/properties?availability=now" className="font-bold text-brick underline underline-offset-4">
                    See available properties
                  </Link>{" "}
                  <span className="text-stone">— then ask about a viewing</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-8 shadow-soft">
              <h2 className="text-2xl">Find us online</h2>
              <ul className="mt-4 flex flex-col gap-2">
                <li>
                  <a href={business.social.facebook} rel="noopener noreferrer" className="font-bold text-brick underline underline-offset-4">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href={business.social.instagram} rel="noopener noreferrer" className="font-bold text-brick underline underline-offset-4">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>

            <PendingSection title="Email, telephone and opening hours to follow" headingLevel="h2">
              <p>
                A permanent email address, telephone number, address and opening hours will be published
                here once they are confirmed.
              </p>
            </PendingSection>
          </div>
        </div>
      </section>
    </>
  );
}
