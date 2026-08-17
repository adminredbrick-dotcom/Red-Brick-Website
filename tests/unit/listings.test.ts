import { describe, expect, it } from "vitest";

import { demoLabels } from "@/content/demo-labels";
import { areas, isAreaKey } from "@/lib/listings/areas";
import { demoListings } from "@/lib/listings/demo-listings";
import { emptyFilters } from "@/lib/listings/filters";
import { DemoListingsRepository, listingsRepository } from "@/lib/listings/repository";

describe("demonstration listings", () => {
  it("are all demo-only, unique, placeholder-only and reference known areas", () => {
    const slugs = new Set(demoListings.map((l) => l.slug));
    expect(slugs.size).toBe(demoListings.length);
    for (const l of demoListings) {
      expect(l.demoOnly).toBe(true);
      expect(l.media.cover.kind).toBe("placeholder");
      expect(l.media.cover.alt.toLowerCase()).toContain("not a real property");
      expect(isAreaKey(l.location.area)).toBe(true);
      expect(l.location.outwardPostcode).toMatch(/^PE\d$/);
      expect(l.pricing.rentPcm).toBeGreaterThan(0);
      // Never a full postcode unit or a house number.
      expect(JSON.stringify(l)).not.toMatch(/\bPE\d\s?\d[A-Z]{2}\b/);
      expect(l.title).not.toMatch(/^\d+\s/);
    }
  });

  it("verified facts carry a date and a source", () => {
    for (const l of demoListings) {
      for (const fact of [l.pricing.deposit, l.pricing.holdingDeposit, l.councilTaxBand, l.epcRating]) {
        if (fact) {
          expect(fact.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          expect(fact.source.length).toBeGreaterThan(0);
        }
      }
    }
    // The fixture deliberately includes unverified fields so templates can prove they hide them.
    expect(demoListings.some((l) => l.epcRating === null)).toBe(true);
    expect(demoListings.some((l) => l.councilTaxBand === null)).toBe(true);
  });

  it("area registry has unique keys and PE outward codes", () => {
    expect(new Set(areas.map((a) => a.key)).size).toBe(areas.length);
    for (const a of areas) expect(a.outwardPostcode).toMatch(/^PE\d$/);
  });
});

describe("DemoListingsRepository", () => {
  const repo = new DemoListingsRepository();

  it("searches, finds by slug and returns featured available listings", async () => {
    const { results, total } = await repo.search(emptyFilters);
    expect(total).toBe(demoListings.length);
    expect(results.length).toBe(total);
    const first = demoListings[0]!;
    expect(await repo.bySlug(first.slug)).toEqual(first);
    expect(await repo.bySlug("does-not-exist")).toBeNull();
    const featured = await repo.featured(3);
    expect(featured).toHaveLength(3);
    expect(featured.every((l) => l.status === "available")).toBe(true);
  });

  it("is the bound default repository", async () => {
    expect((await listingsRepository.all()).length).toBe(demoListings.length);
  });

  it("labels are the exact mandated wording", () => {
    expect(demoLabels.listing).toBe("Demonstration listing — not a real property.");
    expect(demoLabels.estimate).toBe("Illustrative estimate — not a valuation.");
  });
});
