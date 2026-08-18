import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
 * FAQ block: an accessible accordion (Radix — keyboard operable, headings
 * inside) plus FAQPage structured data. Answers are plain text from the
 * content layer; the "reviewed on" line keeps the honesty rule visible.
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
      <Accordion type="multiple" className="mt-6 rounded-lg bg-white px-6 shadow-soft">
        {group.items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>
              <p className="measure-body text-ink">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p className="mt-3 text-sm text-stone">Answers reviewed {formatUkDate(group.reviewedOn)}. Guidance, not legal advice.</p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
