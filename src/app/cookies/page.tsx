import type { Metadata } from "next";

import { DraftBanner } from "@/components/shared/draft-banner";
import { PageIntro } from "@/components/shared/page-intro";
import { routes } from "@/config/site";

export const metadata: Metadata = {
  title: routes.cookies.title,
  description: routes.cookies.description,
};

export default function CookiesPage() {
  return (
    <>
      <DraftBanner />
      <PageIntro
        eyebrow="Legal"
        heading="Cookie policy"
        lede="This page will explain which cookies this website uses and the choices you have."
      />
      <section className="container-rb pb-16 md:pb-24">
        <div className="measure-body flex flex-col gap-4 text-stone">
          <p>
            At this stage the website sets no analytics, advertising or tracking cookies. If that
            changes, this policy and a consent mechanism will be reviewed and published first.
          </p>
        </div>
      </section>
    </>
  );
}
