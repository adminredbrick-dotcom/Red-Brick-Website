import Link from "next/link";

import { DemoBadge } from "@/components/properties/demo-badge";
import { Button } from "@/components/ui/button";
import { calculateMoveInCosts, moveInCostGuidance } from "@/lib/appraisal/move-in-costs";
import { formatGbp, formatRentPcm, formatUkDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface MoveInCostPreviewProps {
  headingLevel?: "h2" | "h3";
  headingId?: string;
  /** Example monthly rent for the worked illustration (default £1,000). */
  exampleRentPcm?: number;
  className?: string;
}

/**
 * Homepage integration contract — tenant "Move-in costs explained" preview.
 * States England's current rules in plain English, gives a worked example on
 * a stated rent (labelled demonstration), links to GOV.UK guidance and shows
 * the wording's review date. The live calculator (visitor-entered rent)
 * arrives with the tenant tools phase. No <section> of its own — the host
 * owns the landmark.
 */
export function MoveInCostPreview({
  headingLevel = "h2",
  headingId = "move-in-cost-preview-heading",
  exampleRentPcm = 1000,
  className,
}: MoveInCostPreviewProps) {
  const Heading = headingLevel;
  const costs = calculateMoveInCosts(exampleRentPcm);
  const rules = [
    "No rent can be requested or accepted before the tenancy agreement is signed.",
    "After signing, and before the tenancy begins, at most one month's rent can be taken in advance.",
    "The tenancy deposit is capped at five weeks' rent where the annual rent is under £50,000, and six weeks' rent at or above it.",
    "A holding deposit is capped at one week's rent and is only credited towards your rent or deposit with your agreement.",
  ];
  const rows = [
    { label: "Rent in advance (at most one month, after signing)", value: formatGbp(costs.rentInAdvanceCap) },
    {
      label: `Tenancy deposit (capped at ${costs.depositCapWeeks} weeks' rent)`,
      value: formatGbp(costs.tenancyDepositCap),
    },
    {
      label: "Holding deposit (capped at one week's rent; credited only with your agreement)",
      value: formatGbp(costs.holdingDepositCap),
    },
  ];
  return (
    <div className={cn("rounded-lg bg-white p-6 shadow-soft md:p-8", className)}>
      <p className="text-eyebrow text-brick">For tenants</p>
      <Heading id={headingId} className="mt-2 text-2xl md:text-3xl">
        Move-in costs explained
      </Heading>
      <p className="measure-body mt-3 text-stone">
        Before you commit you should know what is payable up front. In England the current rules
        limit what can be asked for and when:
      </p>
      <ul className="mt-3 flex flex-col gap-2 text-ink">
        {rules.map((rule) => (
          <li key={rule} className="flex gap-3">
            <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rounded-full bg-brick" />
            <span>{rule}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-bold text-ink">Worked example at {formatRentPcm(costs.rentPcm)}</p>
      <dl className="mt-2 divide-y divide-stone-light">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 py-2">
            <dt className="text-stone">{row.label}</dt>
            <dd className="font-bold text-ink">{row.value}</dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-4 py-2">
          <dt className="font-bold text-ink">
            Illustrative total before keys (rent in advance + deposit)
          </dt>
          <dd className="text-xl font-bold text-ink">{formatGbp(costs.illustrativeTotal)}</dd>
        </div>
      </dl>
      <DemoBadge kind="figures" className="mt-4" />
      <p className="mt-4 text-base text-stone">
        Every real tenancy states its own figures in its written terms. Wording checked against{" "}
        {moveInCostGuidance.sources.map((s, i) => (
          <span key={s.href}>
            <a
              href={s.href}
              className="font-bold text-brick underline underline-offset-4"
              rel="noopener noreferrer"
            >
              {s.label}
            </a>
            {i < moveInCostGuidance.sources.length - 1 ? " and " : ""}
          </span>
        ))}{" "}
        on {formatUkDate(moveInCostGuidance.reviewedOn)}; not legal advice.
      </p>
      <div className="mt-5">
        <Button asChild variant="outline">
          <Link href="/tenants">How renting with us works</Link>
        </Button>
      </div>
    </div>
  );
}
