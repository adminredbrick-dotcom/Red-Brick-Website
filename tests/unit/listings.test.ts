import { describe, expect, it } from "vitest";

import { demoLabels } from "@/content/demo-labels";
import { areas, isAreaKey } from "@/lib/listings/areas";
import { demoListings } from "@/lib/listings/demo-listings";
import { emptyFilters } from "@/lib/listings/filters";
import { portfolioListings } from "@/lib/listings/portfolio-listings";
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

  it("the bound default repository serves the portfolio, not the demonstration set", async () => {
    expect((await listingsRepository.all()).length).toBe(portfolioListings.length);
    expect((await listingsRepository.all()).every((l) => !l.demoOnly)).toBe(true);
  });

  it("labels are the exact mandated wording", () => {
    expect(demoLabels.listing).toBe("Demonstration listing — not a real property.");
    expect(demoLabels.estimate).toBe("Illustrative estimate — not a valuation.");
  });
});

describe("portfolio listings (public-safe)", () => {
  it("carry street + district only — never a house number, flat letter, full postcode, owner or tenant", () => {
    expect(portfolioListings.length).toBeGreaterThanOrEqual(40);
    const slugs = new Set(portfolioListings.map((l) => l.slug));
    expect(slugs.size).toBe(portfolioListings.length);
    for (const l of portfolioListings) {
      const json = JSON.stringify(l);
      expect(l.demoOnly).toBe(false);
      expect(l.media.cover.kind).toBe("placeholder");
      expect(isAreaKey(l.location.area)).toBe(true);
      expect(l.location.outwardPostcode).toMatch(/^PE\d$/);
      expect(json).not.toMatch(/PE\d\s?\d[A-Z]{2}/); // no full postcode
      expect(l.title).not.toMatch(/\d/); // no house numbers in titles
      expect(l.slug).not.toMatch(/^\d/);
      expect(json).not.toMatch(/tenant name|landlord|owner:/i);
      // Rent is only published for available homes; occupied homes never show a rent.
      if (l.status === "let") expect(l.pricing.rentPcm).toBeNull();
      // Nothing is guessed: unknown bedrooms/bathrooms stay null.
      expect(l.property.bedrooms === null || l.property.bedrooms > 0).toBe(true);
      if (l.epcRating) {
        expect(l.epcRating.value).toMatch(/^[A-G]$/);
        expect(l.epcRating.source).toContain("EPC register");
      }
    }
  });

  it("orders available homes first and features them", async () => {
    const { results } = await listingsRepository.search(emptyFilters);
    const firstLet = results.findIndex((l) => l.status === "let");
    const lastAvailable = results.map((l) => l.status).lastIndexOf("available");
    if (firstLet >= 0 && lastAvailable >= 0) expect(lastAvailable).toBeLessThan(firstLet);
    const featured = await listingsRepository.featured(3);
    expect(featured.length).toBe(3);
    expect(featured[0]!.status).toBe("available");
  });
});
