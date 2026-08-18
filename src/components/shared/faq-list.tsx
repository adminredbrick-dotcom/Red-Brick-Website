import { ChevronDown } from "lucide-react";

import { formatUkDate } from "@/lib/format";
import type { FaqGroup } from "@/lib/content/types";
import { cn } from "@/lib/utils";

interface FaqListProps {
  group: FaqGroup;
  headingId?: string;
  headingLevel?: "h2" | "h3";
  className?: string;
}

/**
 * FAQ block built on native <details>/<summary>: no JavaScript, keyboard and
 * screen-reader operable out of the box (Enter/Space toggles, state exposed
 * as expanded/collapsed), printable, and it keeps the page's client bundle
 * small (the phase-7 Lighthouse review found hydration cost on mobile).
 * FAQPage structured data accompanies it; the "reviewed on" line keeps the
 * honesty rule visible.
 */
export function FaqList({ group, headingId = `faq-${group.key}`, headingLevel = "h2", className }: FaqListProps) {
  const Heading = headingLevel;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: group.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  return (
    <section aria-labelledby={headingId} className={cn(className)}>
      <Heading id={headingId} className="text-section">
        {group.heading}
      </Heading>
      <div className="mt-6 divide-y divide-stone-light rounded-lg bg-white px-6 shadow-soft">
        {group.items.map((item) => (
          <details key={item.id} id={item.id} className="group py-1">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-left text-base font-bold text-ink [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronDown className="size-5 shrink-0 text-stone transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="measure-body pb-4 text-ink">{item.answer}</p>
          </details>
        ))}
      </div>
      <p className="mt-3 text-sm text-stone">Answers reviewed {formatUkDate(group.reviewedOn)}. Guidance, not legal advice.</p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
