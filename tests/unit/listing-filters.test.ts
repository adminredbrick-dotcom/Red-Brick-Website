import { describe, expect, it } from "vitest";

import { demoListings } from "@/lib/listings/demo-listings";
import {
  applyFilters,
  countActiveFilters,
  emptyFilters,
  parseFilters,
  propertiesHref,
  toSearchParams,
} from "@/lib/listings/filters";

describe("parseFilters", () => {
  it("returns defaults for an empty query", () => {
    expect(parseFilters({})).toEqual(emptyFilters);
  });

  it("parses valid values and ignores unknown ones", () => {
    const f = parseFilters({
      area: "fletton",
      min: "900",
      max: "1,300",
      beds: "2",
      type: "apartment",
      availability: "now",
      view: "map",
    });
    expect(f).toEqual({
      area: "fletton",
      minRent: 900,
      maxRent: 1300,
      bedrooms: 2,
      type: "apartment",
      availability: "now",
      view: "map",
    });
    expect(
      parseFilters({ area: "nowhere", beds: "9", type: "castle", availability: "x", view: "3d" }),
    ).toEqual(emptyFilters);
  });

  it("swaps a reversed rent range instead of returning nothing", () => {
    const f = parseFilters({ min: "1500", max: "1000" });
    expect(f.minRent).toBe(1000);
    expect(f.maxRent).toBe(1500);
  });

  it("accepts URLSearchParams and array values", () => {
    expect(parseFilters(new URLSearchParams("area=werrington&beds=3")).area).toBe("werrington");
    expect(parseFilters({ beds: ["3", "1"] }).bedrooms).toBe(3);
  });
});

describe("toSearchParams / propertiesHref", () => {
  it("omits defaults and round-trips", () => {
    const f = parseFilters({ area: "hampton", max: "1800", availability: "soon", view: "map" });
    const qs = toSearchParams(f).toString();
    expect(qs).toBe("area=hampton&max=1800&availability=soon&view=map");
    expect(parseFilters(new URLSearchParams(qs))).toEqual(f);
    expect(propertiesHref(emptyFilters)).toBe("/properties");
    expect(propertiesHref({ ...emptyFilters, view: "map" })).toBe("/properties?view=map");
  });
});

describe("applyFilters", () => {
  it("filters by every dimension", () => {
    expect(applyFilters(demoListings, { ...emptyFilters, area: "fletton" }).map((l) => l.id)).toEqual([
      "DEMO-RBL-001",
    ]);
    expect(
      applyFilters(demoListings, { ...emptyFilters, maxRent: 1000 }).every((l) => (l.pricing.rentPcm ?? Infinity) <= 1000),
    ).toBe(true);
    expect(applyFilters(demoListings, { ...emptyFilters, minRent: 1700 }).map((l) => l.id)).toEqual([
      "DEMO-RBL-005",
    ]);
    expect(
      applyFilters(demoListings, { ...emptyFilters, bedrooms: 3 }).every((l) => (l.property.bedrooms ?? 0) >= 3),
    ).toBe(true);
    expect(applyFilters(demoListings, { ...emptyFilters, type: "bungalow" }).map((l) => l.id)).toEqual([
      "DEMO-RBL-004",
    ]);
    expect(
      applyFilters(demoListings, { ...emptyFilters, availability: "let-agreed" }).map((l) => l.id),
    ).toEqual(["DEMO-RBL-007"]);
    expect(applyFilters(demoListings, { ...emptyFilters, availability: "soon" }).map((l) => l.id)).toEqual([
      "DEMO-RBL-004",
    ]);
    expect(
      applyFilters(demoListings, { ...emptyFilters, availability: "now" }).every(
        (l) => l.status === "available",
      ),
    ).toBe(true);
  });

  it("returns an empty list (not an error) when nothing matches", () => {
    expect(applyFilters(demoListings, { ...emptyFilters, area: "hampton", maxRent: 500 })).toEqual([]);
  });

  it("orders available first, then coming soon, then let agreed, by rent within a group", () => {
    const ordered = applyFilters(demoListings, emptyFilters);
    const statuses = ordered.map((l) => l.status);
    const firstSoon = statuses.indexOf("coming-soon");
    const firstLet = statuses.indexOf("let-agreed");
    expect(statuses.lastIndexOf("available")).toBeLessThan(firstSoon);
    expect(firstSoon).toBeLessThan(firstLet);
    const availableRents = ordered
      .filter((l) => l.status === "available")
      .map((l) => l.pricing.rentPcm ?? 0);
    expect([...availableRents].sort((a, b) => a - b)).toEqual(availableRents);
  });

  it("counts active filters excluding the view", () => {
    expect(countActiveFilters(emptyFilters)).toBe(0);
    expect(countActiveFilters({ ...emptyFilters, view: "map" })).toBe(0);
    expect(countActiveFilters({ ...emptyFilters, area: "orton", minRent: 800, availability: "now" })).toBe(3);
  });
});
