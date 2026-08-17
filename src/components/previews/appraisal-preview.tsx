import Link from "next/link";

import { Button } from "@/components/ui/button";
import { demoLabels } from "@/content/demo-labels";
import { cn } from "@/lib/utils";

interface AppraisalPreviewProps {
  headingLevel?: "h2" | "h3";
  headingId?: string;
  className?: string;
}

/**
 * Homepage integration contract — "What could your property rent for?"
 * entry. Plain HTML, one action to /rental-appraisal, no figures (an
 * estimate only ever appears after the visitor answers the questions on
 * the appraisal page). No <section> of its own — the host owns the landmark.
 */
export function AppraisalPreview({ headingLevel = "h2", headingId = "appraisal-preview-heading", className }: AppraisalPreviewProps) {
  const Heading = headingLevel;
  return (
    <div className={cn("rounded-lg bg-white p-6 shadow-soft md:p-8", className)}>
      <p className="text-eyebrow text-brick">For landlords</p>
      <Heading id={headingId} className="mt-2 text-2xl md:text-3xl">
        What could your property rent for?
      </Heading>
      <p className="measure-body mt-3 text-stone">
        Answer four short questions for an illustrative monthly range, see the assumptions behind it
        and how fresh the data is, then ask us to confirm a recommendation after a proper review.
      </p>
      <p className="mt-3 text-base text-stone">
        {demoLabels.estimate} We never present a guaranteed rent.
      </p>
      <div className="mt-5">
        <Button asChild size="lg">
          <Link href="/rental-appraisal">Request a rental appraisal</Link>
        </Button>
      </div>
    </div>
  );
}
