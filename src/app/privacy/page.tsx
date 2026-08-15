import type { Metadata } from "next";

import { DraftBanner } from "@/components/shared/draft-banner";
import { PageIntro } from "@/components/shared/page-intro";
import { routes } from "@/config/site";

export const metadata: Metadata = {
  title: routes.privacy.title,
  description: routes.privacy.description,
};

export default function PrivacyPage() {
  return (
    <>
      <DraftBanner />
      <PageIntro
        eyebrow="Legal"
        heading="Privacy notice"
        lede="This page will explain how Red Brick Lettings collects, uses and protects personal information."
      />
      <section className="container-rb pb-16 md:pb-24">
        <div className="measure-body flex flex-col gap-4 text-stone">
          <p>
            The privacy notice will be prepared with, and reviewed by, an appropriate UK
            professional before this website launches. It will cover the information we collect,
            why we collect it, how long it is kept, who it is shared with and the rights you have.
          </p>
          <p>No analytics or marketing cookies are active on this website at this stage.</p>
        </div>
      </section>
    </>
  );
}
