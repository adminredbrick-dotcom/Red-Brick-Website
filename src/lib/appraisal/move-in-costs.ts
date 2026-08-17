/**
 * Move-in cost arithmetic for the tenant explainer. Statutory basis in
 * England (Tenant Fees Act 2019): the tenancy deposit is capped at five
 * weeks' rent where the annual rent is below £50,000 (six weeks at or above
 * it), and a holding deposit is capped at one week's rent. Weekly rent is
 * annual rent ÷ 52. This is an explainer, not advice; a real tenancy's
 * figures come from its own terms.
 */

export interface MoveInCosts {
  readonly rentPcm: number;
  readonly weeklyRent: number;
  readonly depositCapWeeks: 5 | 6;
  readonly tenancyDepositCap: number;
  readonly holdingDepositCap: number;
  /** First month's rent in advance (the illustrative assumption). */
  readonly firstMonthRent: number;
  /** Rent in advance + capped deposit — the holding deposit is normally credited against these. */
  readonly illustrativeTotal: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculateMoveInCosts(rentPcm: number): MoveInCosts {
  if (!Number.isFinite(rentPcm) || rentPcm <= 0) {
    throw new RangeError("rentPcm must be a positive number");
  }
  const annual = rentPcm * 12;
  const weeklyRent = round2(annual / 52);
  const depositCapWeeks: 5 | 6 = annual < 50_000 ? 5 : 6;
  const tenancyDepositCap = round2(weeklyRent * depositCapWeeks);
  const holdingDepositCap = weeklyRent;
  return {
    rentPcm,
    weeklyRent,
    depositCapWeeks,
    tenancyDepositCap,
    holdingDepositCap,
    firstMonthRent: rentPcm,
    illustrativeTotal: round2(rentPcm + tenancyDepositCap),
  };
}
