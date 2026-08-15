import { describe, expect, it } from "vitest";

import type { PublicListing } from "@/data/contracts/listing";
import { getListingsRepository } from "@/data/repositories/listings";
import {
  EMPTY_FILTERS,
  applyFilters,
  buildPropertiesQuery,
  countActiveFilters,
  filtersToSearchParams,
  hasActiveFilters,
  parseFilters,
  type ListingFilters,
} from "@/lib/listing-filters";

async function fixtures(): Promise<readonly PublicListing[]> {
  const repo = await getListingsRepository();
  return repo.list();
}

/** A synthetic (never real) listing with a published availability date. */
function withAvailability(base: PublicListing, availableFrom: string | null): PublicListing {
  return {
    ...base,
    id: `${base.id}-SYNTH`,
    availability: { ...base.availability, availableFrom },
  };
}

const NOW = new Date("2026-08-15T12:00:00Z");

describe("parseFilters", () => {
  it("returns empty filters for no input", () => {
    expect(parseFilters({})).toEqual(EMPTY_FILTERS);
    expect(parseFilters(new URLSearchParams())).toEqual(EMPTY_FILTERS);
  });

  it("reads every launch filter from a record or URLSearchParams", () => {
    const expected: ListingFilters = {
      area: "Werrington",
      minRent: 900,
      maxRent: 1400,
      bedrooms: 3,
      type: "semi-detached-house",
      availability: "from",
      availableFrom: "2026-09-01",
    };
    expect(
      parseFilters({
        area: "Werrington",
        minRent: "900",
        maxRent: "1400",
        bedrooms: "3",
        type: "semi-detached-house",
        availability: "from",
        availableFrom: "2026-09-01",
      }),
    ).toEqual(expected);
    expect(
      parseFilters(
        new URLSearchParams(
          "area=Werrington&minRent=900&maxRent=1400&bedrooms=3&type=semi-detached-house&availability=from&availableFrom=2026-09-01",
        ),
      ),
    ).toEqual(expected);
  });

  it("uses the first value when a param is repeated", () => {
    expect(parseFilters({ bedrooms: ["2", "3"] }).bedrooms).toBe(2);
  });

  it("tolerates bad or hostile input by dropping the filter", () => {
    const parsed = parseFilters({
      area: "   ",
      minRent: "abc",
      maxRent: "-50",
      bedrooms: "lots",
      type: "castle",
      availability: "soon",
      availableFrom: "not-a-date",
    });
    expect(parsed).toEqual(EMPTY_FILTERS);
    expect(parseFilters({ availableFrom: "2026-02-31" }).availableFrom).toBeNull();
    expect(parseFilters({ minRent: "1e309" }).minRent).toBeNull();
    expect(parseFilters({ area: "x".repeat(500) }).area).toHaveLength(60);
  });

  it("normalises money, whitespace and bedroom aliases", () => {
    expect(parseFilters({ minRent: "£1,100" }).minRent).toBe(1100);
    expect(parseFilters({ maxRent: " 1350.00 " }).maxRent).toBe(1350);
    expect(parseFilters({ area: "  Central   Peterborough " }).area).toBe("Central Peterborough");
    expect(parseFilters({ bedrooms: "4+" }).bedrooms).toBe(4);
    expect(parseFilters({ bedrooms: "4plus" }).bedrooms).toBe(4);
    expect(parseFilters({ bedrooms: "7" }).bedrooms).toBe(4);
    expect(parseFilters({ bedrooms: "0" }).bedrooms).toBeNull();
    expect(parseFilters({ type: "Apartment" }).type).toBe("apartment");
  });

  it("infers 'from' when only a valid date is given and drops the date otherwise", () => {
    expect(parseFilters({ availableFrom: "2026-10-01" })).toMatchObject({
      availability: "from",
      availableFrom: "2026-10-01",
    });
    expect(parseFilters({ availability: "now", availableFrom: "2026-10-01" })).toMatchObject({
      availability: "now",
      availableFrom: null,
    });
  });
});

describe("applyFilters", () => {
  it("returns every fixture when nothing is set", async () => {
    const all = await fixtures();
    expect(applyFilters(all, EMPTY_FILTERS)).toHaveLength(3);
  });

  it("matches area case-insensitively against public area or outward postcode", async () => {
    const all = await fixtures();
    expect(applyFilters(all, { ...EMPTY_FILTERS, area: "werrington" }).map((l) => l.id)).toEqual([
      "DEMO-RBL-002",
    ]);
    expect(applyFilters(all, { ...EMPTY_FILTERS, area: "pe2" }).map((l) => l.id)).toEqual([
      "DEMO-RBL-001",
    ]);
    expect(applyFilters(all, { ...EMPTY_FILTERS, area: "PE 1" }).map((l) => l.id)).toEqual([
      "DEMO-RBL-003",
    ]);
    expect(applyFilters(all, { ...EMPTY_FILTERS, area: "Peterborough" })).toHaveLength(3);
    expect(applyFilters(all, { ...EMPTY_FILTERS, area: "Nowhere" })).toHaveLength(0);
  });

  it("applies inclusive rent bounds", async () => {
    const all = await fixtures();
    expect(applyFilters(all, { ...EMPTY_FILTERS, minRent: 1100 }).map((l) => l.id)).toEqual([
      "DEMO-RBL-001",
      "DEMO-RBL-002",
    ]);
    expect(applyFilters(all, { ...EMPTY_FILTERS, maxRent: 1100 }).map((l) => l.id)).toEqual([
      "DEMO-RBL-001",
      "DEMO-RBL-003",
    ]);
    expect(
      applyFilters(all, { ...EMPTY_FILTERS, minRent: 1000, maxRent: 1200 }).map((l) => l.id),
    ).toEqual(["DEMO-RBL-001"]);
    expect(applyFilters(all, { ...EMPTY_FILTERS, minRent: 2000 })).toHaveLength(0);
    // Inverted bounds simply match nothing rather than throwing.
    expect(applyFilters(all, { ...EMPTY_FILTERS, minRent: 1300, maxRent: 1000 })).toHaveLength(0);
  });

  it("matches bedrooms exactly for 1–3 and four-or-more for 4", async () => {
    const all = await fixtures();
    expect(applyFilters(all, { ...EMPTY_FILTERS, bedrooms: 3 }).map((l) => l.id)).toEqual([
      "DEMO-RBL-002",
    ]);
    expect(applyFilters(all, { ...EMPTY_FILTERS, bedrooms: 1 }).map((l) => l.id)).toEqual([
      "DEMO-RBL-003",
    ]);
    expect(applyFilters(all, { ...EMPTY_FILTERS, bedrooms: 4 })).toHaveLength(0);
    const fiveBed: PublicListing = {
      ...all[0]!,
      id: "SYNTH-5",
      property: { ...all[0]!.property, bedrooms: 5 },
    };
    expect(
      applyFilters([...all, fiveBed], { ...EMPTY_FILTERS, bedrooms: 4 }).map((l) => l.id),
    ).toEqual(["SYNTH-5"]);
  });

  it("matches property type", async () => {
    const all = await fixtures();
    expect(applyFilters(all, { ...EMPTY_FILTERS, type: "apartment" }).map((l) => l.id)).toEqual([
      "DEMO-RBL-003",
    ]);
    expect(applyFilters(all, { ...EMPTY_FILTERS, type: "bungalow" })).toHaveLength(0);
  });

  it("never treats a null availableFrom as available now or from a date", async () => {
    const all = await fixtures();
    for (const listing of all) expect(listing.availability.availableFrom).toBeNull();
    expect(applyFilters(all, { ...EMPTY_FILTERS, availability: "now" }, { now: NOW })).toHaveLength(
      0,
    );
    expect(
      applyFilters(
        all,
        { ...EMPTY_FILTERS, availability: "from", availableFrom: "2030-01-01" },
        { now: NOW },
      ),
    ).toHaveLength(0);
  });

  it("uses a published availability date for 'now' and 'from'", async () => {
    const [base] = await fixtures();
    const past = withAvailability(base!, "2026-08-01");
    const today = withAvailability(base!, "2026-08-15");
    const future = withAvailability(base!, "2026-09-10");
    const set = [past, today, future];

    const now = applyFilters(set, { ...EMPTY_FILTERS, availability: "now" }, { now: NOW });
    expect(now).toEqual([past, today]);

    const from = applyFilters(
      set,
      { ...EMPTY_FILTERS, availability: "from", availableFrom: "2026-09-01" },
      { now: NOW },
    );
    expect(from).toEqual([past, today]);

    const fromLater = applyFilters(
      set,
      { ...EMPTY_FILTERS, availability: "from", availableFrom: "2026-09-30" },
      { now: NOW },
    );
    expect(fromLater).toEqual([past, today, future]);

    // "from" with no date means "has a published availability date".
    const anyDate = applyFilters(set, { ...EMPTY_FILTERS, availability: "from" }, { now: NOW });
    expect(anyDate).toHaveLength(3);
  });

  it("combines filters with AND", async () => {
    const all = await fixtures();
    expect(
      applyFilters(all, { ...EMPTY_FILTERS, area: "Peterborough", maxRent: 1200, bedrooms: 2 }).map(
        (l) => l.id,
      ),
    ).toEqual(["DEMO-RBL-001"]);
    expect(
      applyFilters(all, { ...EMPTY_FILTERS, area: "Peterborough", maxRent: 1200, bedrooms: 3 }),
    ).toHaveLength(0);
  });
});

describe("countActiveFilters and hasActiveFilters", () => {
  it("counts each set group once, with the date inside availability", () => {
    expect(countActiveFilters(EMPTY_FILTERS)).toBe(0);
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
    expect(countActiveFilters({ ...EMPTY_FILTERS, area: "PE1", minRent: 800 })).toBe(2);
    expect(
      countActiveFilters({
        area: "PE1",
        minRent: 800,
        maxRent: 1200,
        bedrooms: 2,
        type: "apartment",
        availability: "from",
        availableFrom: "2026-09-01",
      }),
    ).toBe(6);
    expect(hasActiveFilters({ ...EMPTY_FILTERS, availability: "now" })).toBe(true);
  });
});

describe("filtersToSearchParams", () => {
  it("serialises only active filters", () => {
    expect(filtersToSearchParams(EMPTY_FILTERS).toString()).toBe("");
    expect(
      filtersToSearchParams({ ...EMPTY_FILTERS, bedrooms: 4, availability: "now" }).toString(),
    ).toBe("bedrooms=4&availability=now");
    // A date is dropped unless the mode is "from".
    expect(
      filtersToSearchParams({
        ...EMPTY_FILTERS,
        availability: "now",
        availableFrom: "2026-09-01",
      }).has("availableFrom"),
    ).toBe(false);
  });

  it("round-trips through parseFilters", () => {
    const full: ListingFilters = {
      area: "Fletton, Peterborough",
      minRent: 900,
      maxRent: 1400,
      bedrooms: 4,
      type: "terraced-house",
      availability: "from",
      availableFrom: "2026-09-01",
    };
    expect(parseFilters(filtersToSearchParams(full))).toEqual(full);
    const partial: ListingFilters = { ...EMPTY_FILTERS, area: "PE4", availability: "now" };
    expect(parseFilters(filtersToSearchParams(partial))).toEqual(partial);
    expect(parseFilters(filtersToSearchParams(EMPTY_FILTERS))).toEqual(EMPTY_FILTERS);
  });
});

describe("buildPropertiesQuery", () => {
  it("adds page-state params after the filters and returns '' when empty", () => {
    expect(buildPropertiesQuery(EMPTY_FILTERS)).toBe("");
    expect(buildPropertiesQuery(EMPTY_FILTERS, { view: "list" })).toBe("");
    expect(buildPropertiesQuery(EMPTY_FILTERS, { view: "map" })).toBe("?view=map");
    expect(
      buildPropertiesQuery({ ...EMPTY_FILTERS, bedrooms: 2 }, { selected: "DEMO-RBL-001" }),
    ).toBe("?bedrooms=2&selected=DEMO-RBL-001");
  });
});
