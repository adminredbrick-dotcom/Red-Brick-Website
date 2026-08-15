import Link from "next/link";

import { PendingSection } from "@/components/shared/pending-section";
import { Badge } from "@/components/ui/badge";
import { insightsPreview } from "@/content/home-copy";

/** Insights: an honest "in preparation" state with the five categories. No fake articles. */
export function InsightsSection({ id }: { id: string }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-4 border-t border-stone-light bg-white"
    >
      <div className="container-rb py-14 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <div>
            <p className="text-eyebrow text-brick">Insights</p>
            <h2 id={`${id}-heading`} className="text-section mt-3">
              {insightsPreview.heading}
            </h2>
            <ul aria-label="Planned article categories" className="mt-5 flex flex-wrap gap-2">
              {insightsPreview.categories.map((category) => (
                <li key={category}>
                  <Badge variant="neutral">{category}</Badge>
                </li>
              ))}
            </ul>
          </div>

          <PendingSection title={insightsPreview.pendingTitle}>
            <p>{insightsPreview.body}</p>
            <p className="mt-3">
              <Link
                href={insightsPreview.href}
                className="inline-flex min-h-11 items-center font-bold text-brick underline underline-offset-4"
              >
                {insightsPreview.cta}
              </Link>
            </p>
          </PendingSection>
        </div>
      </div>
    </section>
  );
}
