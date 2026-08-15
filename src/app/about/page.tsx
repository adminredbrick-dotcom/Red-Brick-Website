import type { Metadata } from "next";

import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { PageIntro } from "@/components/shared/page-intro";
import { business } from "@/config/business";
import { routes } from "@/config/site";
import { companyIntroduction, trustPoints } from "@/content/approved-copy";

export const metadata: Metadata = {
  title: routes.about.title,
  description: routes.about.description,
};

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow={`Peterborough lettings, since ${business.establishedYear}`}
        heading={`About ${business.name}`}
        lede={companyIntroduction}
      />

      <section aria-labelledby="values-heading" className="bg-white">
        <div className="container-rb py-14 md:py-20">
          <h2 id="values-heading" className="text-section">
            What we stand on
          </h2>
          <dl className="mt-8 grid gap-8 md:grid-cols-3">
            {trustPoints.map((point) => (
              <div key={point.heading}>
                <dt className="text-xl font-bold">{point.heading}</dt>
                <dd className="mt-2 text-stone">{point.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-rb py-14 md:py-20">
        <h2 className="text-section max-w-2xl">Talk to us</h2>
        <p className="measure-body mt-4 text-lg text-stone">
          The quickest way to reach us is WhatsApp. {business.meetings}
        </p>
        <div className="mt-6">
          <WhatsAppLink variant="button" />
        </div>
      </section>
    </>
  );
}
