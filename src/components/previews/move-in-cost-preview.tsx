import Link from "next/link";

import { DemoBadge } from "@/components/properties/demo-badge";
import { Button } from "@/components/ui/button";
import { calculateMoveInCosts } from "@/lib/appraisal/move-in-costs";
import { formatGbp, formatRentPcm } from "@/lib/format";
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
 * A worked example on a stated rent, labelled as a demonstration; the live
 * calculator (visitor-entered rent) arrives with the tenants tools phase.
 * No <section> of its own — the host owns the landmark.
 */
export function MoveInCostPreview({
  headingLevel = "h2",
  headingId = "move-in-cost-preview-heading",
  exampleRentPcm = 1000,
  className,
}: MoveInCostPreviewProps) {
  const Heading = headingLevel;
  const costs = calculateMoveInCosts(exampleRentPcm);
  const rows = [
    { label: "First month's rent in advance", value: formatGbp(costs.firstMonthRent) },
    {
      label: `Tenancy deposit (capped at ${costs.depositCapWeeks} weeks' rent)`,
      value: formatGbp(costs.tenancyDepositCap),
    },
    { label: "Holding deposit (capped at one week's rent, usually credited back)", value: formatGbp(costs.holdingDepositCap) },
  ];
  return (
    <div className={cn("rounded-lg bg-white p-6 shadow-soft md:p-8", className)}>
      <p className="text-eyebrow text-brick">For tenants</p>
      <Heading id={headingId} className="mt-2 text-2xl md:text-3xl">
        Move-in costs explained
      </Heading>
      <p className="measure-body mt-3 text-stone">
        Before you commit you should know what is payable up front. In England the Tenant Fees Act
        2019 caps the tenancy deposit and the holding deposit and limits what else can be charged;
        every real tenancy states its own figures in the tenancy terms.
      </p>
      <p className="mt-4 font-bold text-ink">Worked example at {formatRentPcm(costs.rentPcm)}</p>
      <dl className="mt-2 divide-y divide-stone-light">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 py-2">
            <dt className="text-stone">{row.label}</dt>
            <dd className="font-bold text-ink">{row.value}</dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-4 py-2">
          <dt className="font-bold text-ink">Illustrative total before keys (rent + deposit)</dt>
          <dd className="text-xl font-bold text-ink">{formatGbp(costs.illustrativeTotal)}</dd>
        </div>
      </dl>
      <DemoBadge kind="figures" className="mt-4" />
      <div className="mt-5">
        <Button asChild variant="outline">
          <Link href="/tenants">How renting with us works</Link>
        </Button>
      </div>
    </div>
  );
}
