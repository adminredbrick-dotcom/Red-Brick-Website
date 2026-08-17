import { describe, expect, it } from "vitest";

import {
  DemoRentalReportAdapter,
  parseAppraisalRequest,
  rentalReportAdapter,
} from "@/lib/appraisal/demo-adapter";
import { calculateMoveInCosts } from "@/lib/appraisal/move-in-costs";

describe("parseAppraisalRequest", () => {
  it("requires type, bedrooms and status; area is optional", () => {
    expect(parseAppraisalRequest({})).toBeNull();
    expect(parseAppraisalRequest({ type: "apartment", beds: "2" })).toBeNull();
    expect(parseAppraisalRequest({ type: "castle", beds: "2", status: "vacant" })).toBeNull();
    expect(parseAppraisalRequest({ type: "apartment", beds: "7", status: "vacant" })).toBeNull();
    expect(parseAppraisalRequest({ type: "apartment", beds: "2", status: "vacant" })).toEqual({
      area: null,
      propertyType: "apartment",
      bedrooms: 2,
      currentStatus: "vacant",
    });
    expect(
      parseAppraisalRequest({ area: "hampton", type: "detached-house", beds: "4", status: "tenanted" })
        ?.area,
    ).toBe("hampton");
    expect(
      parseAppraisalRequest({ area: "atlantis", type: "detached-house", beds: "4", status: "tenanted" })
        ?.area,
    ).toBeNull();
  });
});

describe("DemoRentalReportAdapter", () => {
  const adapter = new DemoRentalReportAdapter();

  it("returns a deterministic, labelled demonstration range with provenance", async () => {
    const req = { area: "fletton", propertyType: "terraced-house", bedrooms: 2, currentStatus: "vacant" } as const;
    const a = await adapter.estimate(req);
    const b = await adapter.estimate(req);
    expect(a).toEqual(b);
    expect(a.lowPcm).toBeLessThan(a.centralPcm);
    expect(a.centralPcm).toBeLessThan(a.highPcm);
    expect(a.lowPcm % 5).toBe(0);
    expect(a.highPcm % 5).toBe(0);
    expect(a.confidence).toBe("demonstration");
    expect(a.comparableCount).toBe(0);
    expect(a.evidence.every((e) => e.kind === "demonstration")).toBe(true);
    expect(
      a.evidence.every(
        (e) => /^\d{4}-\d{2}-\d{2}$/.test(e.observedOn) && /^\d{4}-\d{2}-\d{2}$/.test(e.retrievedOn),
      ),
    ).toBe(true);
    expect(a.dataFreshness.observedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(a.modelVersion).toMatch(/^demo-/);
    expect(a.rentHistory).toHaveLength(8);
    expect(a.assumptions.some((s) => /demonstration/i.test(s))).toBe(true);
    // No crime score, forecast or guarantee language anywhere in the report.
    const text = JSON.stringify(a).toLowerCase();
    expect(text).not.toMatch(/crime|forecast|guarantee/);
  });

  it("scales with bedrooms and area and adds status assumptions", async () => {
    const one = await adapter.estimate({ area: null, propertyType: "apartment", bedrooms: 1, currentStatus: "vacant" });
    const two = await adapter.estimate({ area: null, propertyType: "apartment", bedrooms: 2, currentStatus: "vacant" });
    expect(two.centralPcm).toBeGreaterThan(one.centralPcm);
    const hampton = await adapter.estimate({ area: "hampton", propertyType: "apartment", bedrooms: 2, currentStatus: "tenanted" });
    expect(hampton.centralPcm).toBeGreaterThan(two.centralPcm);
    expect(hampton.assumptions.some((s) => /currently let/i.test(s))).toBe(true);
    const buying = await adapter.estimate({ area: null, propertyType: "apartment", bedrooms: 2, currentStatus: "buying" });
    expect(buying.assumptions.some((s) => /not investment advice/i.test(s))).toBe(true);
  });

  it("is the bound default adapter", async () => {
    const r = await rentalReportAdapter.estimate({ area: null, propertyType: "bungalow", bedrooms: 2, currentStatus: "owner-occupied" });
    expect(r.request.propertyType).toBe("bungalow");
  });
});

describe("calculateMoveInCosts", () => {
  it("applies the five-week cap below £50,000 a year and six weeks at or above", () => {
    const c = calculateMoveInCosts(1000);
    expect(c.weeklyRent).toBeCloseTo(230.77, 2);
    expect(c.depositCapWeeks).toBe(5);
    expect(c.tenancyDepositCap).toBeCloseTo(1153.85, 2);
    expect(c.holdingDepositCap).toBeCloseTo(230.77, 2);
    expect(c.illustrativeTotal).toBeCloseTo(2153.85, 2);
    expect(calculateMoveInCosts(4200).depositCapWeeks).toBe(6);
    expect(() => calculateMoveInCosts(0)).toThrow(RangeError);
  });
});
