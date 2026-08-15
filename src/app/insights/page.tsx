import type { Metadata } from "next";

import { PageIntro } from "@/components/shared/page-intro";
import { PendingSection } from "@/components/shared/pending-section";
import { routes } from "@/config/site";

export const metadata: Metadata = {
  title: routes.insights.title,
  description: routes.insights.description,
};

const categories = [
  "Landlords",
  "Tenants",
  "Peterborough",
  "Maintenance",
  "Property Guidance",
] as const;

export default function InsightsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Insights"
        heading="Insights and guidance"
        lede="Practical, carefully sourced articles for landlords and tenants, with a clear reviewed date on every piece."
      />
      <section className="container-rb pb-16 md:pb-24">
        <h2 className="sr-only">Articles</h2>
        <ul className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <li
              key={category}
              className="rounded-md bg-sand px-4 py-2 font-bold text-ink"
            >
              {category}
            </li>
          ))}
        </ul>
        <PendingSection title="Articles are being prepared" className="mt-8">
          <p>
            Articles will be written, fact-checked and published through the content editor in a
            later build stage. Each will carry its published and reviewed dates and, where
            relevant, its sources.
          </p>
        </PendingSection>
      </section>
    </>
  );
}
