import type { Metadata } from "next";

import { DraftBanner } from "@/components/shared/draft-banner";
import { PageIntro } from "@/components/shared/page-intro";
import { routes } from "@/config/site";

export const metadata: Metadata = {
  title: routes.terms.title,
  description: routes.terms.description,
};

export default function TermsPage() {
  return (
    <>
      <DraftBanner />
      <PageIntro
        eyebrow="Legal"
        heading="Terms of use"
        lede="This page will set out the terms for using the Red Brick Lettings website."
      />
      <section className="container-rb pb-16 md:pb-24">
        <div className="measure-body flex flex-col gap-4 text-stone">
          <p>
            The terms of use will be prepared with, and reviewed by, an appropriate UK
            professional before this website launches.
          </p>
        </div>
      </section>
    </>
  );
}
