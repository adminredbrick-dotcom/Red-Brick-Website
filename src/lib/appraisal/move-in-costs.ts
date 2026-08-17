/**
 * Move-in cost arithmetic for the tenant explainer, on England's current
 * rules (Tenant Fees Act 2019 caps, with the Renters' Rights Act 2025 limits
 * on rent in advance):
 *
 * - No rent may be requested or accepted before the tenancy agreement is signed.
 * - After signing and before the tenancy begins, at most one month's rent may
 *   be taken in advance.
 * - The tenancy deposit is capped at five weeks' rent where the annual rent is
 *   below £50,000, and six weeks' rent at or above it.
 * - A holding deposit is capped at one week's rent and is credited towards
 *   the first rent or the deposit only with the tenant's agreement.
 *
 * Weekly rent = annual rent ÷ 52. This is an explainer, not advice; a real
 * tenancy's figures come from its own written terms. Wording reviewed against
 * GOV.UK guidance on the review date below and tracked in the owner register.
 */

export const moveInCostGuidance = {
  /** Date the explainer wording was last checked against GOV.UK guidance (ISO). */
  reviewedOn: "2026-08-17",
  sources: [
    {
      label: "GOV.UK — Guide to the Renters' Rights Act",
      href: "https://www.gov.uk/government/publications/guide-to-the-renters-rights-act",
    },
    {
      label: "GOV.UK — Tenant Fees Act 2019 guidance",
      href: "https://www.gov.uk/government/publications/tenant-fees-act-2019-guidance",
    },
  ],
} as const;

export interface MoveInCosts {
  readonly rentPcm: number;
  readonly weeklyRent: number;
  readonly depositCapWeeks: 5 | 6;
  readonly tenancyDepositCap: number;
  readonly holdingDepositCap: number;
  /** Rent in advance — capped at one month, taken only after the agreement is signed. */
  readonly rentInAdvanceCap: number;
  /** Rent in advance + capped deposit; the holding deposit is credited only with the tenant's agreement. */
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
    rentInAdvanceCap: rentPcm,
    illustrativeTotal: round2(rentPcm + tenancyDepositCap),
  };
}
