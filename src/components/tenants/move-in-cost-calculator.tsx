import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calculateMoveInCosts, moveInCostGuidance } from "@/lib/appraisal/move-in-costs";
import { formatGbp, formatUkDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface MoveInCostCalculatorProps {
  /** Raw `rent` query value (monthly rent typed by the visitor) or undefined. */
  rentParam?: string | string[];
  headingId?: string;
  className?: string;
}

/** Parse the visitor's rent: digits (and an optional decimal) between £100 and £20,000 a month. */
export function parseRentParam(value: string | string[] | undefined): { rent: number | null; invalid: boolean } {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === undefined || raw.trim() === "") return { rent: null, invalid: false };
  const n = Number(raw.replace(/[£,\s]/g, ""));
  if (!Number.isFinite(n) || n < 100 || n > 20000) return { rent: null, invalid: true };
  return { rent: Math.round(n * 100) / 100, invalid: false };
}

/**
 * Move-in cost calculator: a plain GET form (works without JavaScript, the
 * result URL is shareable) that applies England's current caps to the rent
 * the visitor enters. An explainer, never a quote — every real tenancy states
 * its own figures; wording reviewed against GOV.UK on the date shown.
 */
export function MoveInCostCalculator({ rentParam, headingId = "move-in-costs-heading", className }: MoveInCostCalculatorProps) {
  const { rent, invalid } = parseRentParam(rentParam);
  const costs = rent ? calculateMoveInCosts(rent) : null;
  return (
    <div className={cn("rounded-lg bg-white p-6 shadow-soft md:p-8", className)}>
      <p className="text-eyebrow text-brick">Move-in costs</p>
      <h2 id={headingId} className="mt-2 text-2xl md:text-3xl">
        What would you pay before the keys?
      </h2>
      <p className="measure-body mt-3 text-stone">
        Enter a monthly rent and we apply the caps that apply in England: no rent before you sign, at
        most one month in advance after signing, a deposit of at most five weeks&rsquo; rent (six where
        the annual rent is £50,000 or more) and a holding deposit of at most one week&rsquo;s rent.
      </p>
      <form method="get" action="/tenants#move-in-costs" className="mt-5 flex flex-wrap items-end gap-3" aria-label="Move-in cost calculator">
        <div className="min-w-[12rem] flex-1">
          <label htmlFor="move-in-rent" className="block text-base font-bold text-ink">
            Monthly rent (£)
          </label>
          <Input
            id="move-in-rent"
            name="rent"
            type="text"
            inputMode="decimal"
            defaultValue={rent ? String(rent) : ""}
            placeholder="e.g. 850"
            aria-invalid={invalid ? true : undefined}
            aria-describedby={invalid ? "move-in-rent-error" : "move-in-rent-hint"}
            className="mt-1.5"
          />
          <p id="move-in-rent-hint" className="mt-1 text-sm text-stone">
            Between £100 and £20,000 a month.
          </p>
          {invalid ? (
            <p id="move-in-rent-error" role="alert" className="mt-1 text-base font-bold text-error">
              Please enter a monthly rent between £100 and £20,000.
            </p>
          ) : null}
        </div>
        <Button type="submit">Show my figures</Button>
      </form>

      {costs ? (
        <div className="mt-6" data-move-in-result>
          <p className="font-bold text-ink">At {formatGbp(costs.rentPcm)} a month (about {formatGbp(costs.weeklyRent)} a week)</p>
          <dl className="mt-2 divide-y divide-stone-light">
            <div className="flex items-baseline justify-between gap-4 py-2">
              <dt className="text-stone">Rent in advance (at most one month, after signing)</dt>
              <dd className="font-bold text-ink">{formatGbp(costs.rentInAdvanceCap)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-2">
              <dt className="text-stone">Tenancy deposit (capped at {costs.depositCapWeeks} weeks&rsquo; rent)</dt>
              <dd className="font-bold text-ink">{formatGbp(costs.tenancyDepositCap)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-2">
              <dt className="text-stone">Holding deposit (capped at one week&rsquo;s rent; credited only with your agreement)</dt>
              <dd className="font-bold text-ink">{formatGbp(costs.holdingDepositCap)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-2">
              <dt className="font-bold text-ink">Illustrative total before keys (rent in advance + deposit)</dt>
              <dd className="text-xl font-bold text-ink">{formatGbp(costs.illustrativeTotal)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-sm font-bold text-ink">Illustrative — the legal maximums for that rent, not a quote.</p>
        </div>
      ) : null}

      <p className="mt-4 text-base text-stone">
        These are the legal maximums, not a quote — a real tenancy states its own figures in its written
        terms, and any holding deposit is credited only with your agreement. Wording checked against{" "}
        {moveInCostGuidance.sources.map((s, i) => (
          <span key={s.href}>
            <a href={s.href} className="font-bold text-brick underline underline-offset-4" rel="noopener noreferrer">
              {s.label}
            </a>
            {i < moveInCostGuidance.sources.length - 1 ? " and " : ""}
          </span>
        ))}{" "}
        on {formatUkDate(moveInCostGuidance.reviewedOn)}; not legal advice.
      </p>
    </div>
  );
}
