import { describe, expect, it } from "vitest";

import { DEMO_LISTING_LABEL } from "@/content/demo-labels";
import { getListingsRepository } from "@/data/repositories/listings";

const PUBLIC_KEYS = [
  "id",
  "slug",
  "demoOnly",
  "status",
  "featured",
  "title",
  "summary",
  "description",
  "location",
  "pricing",
  "availability",
  "property",
  "features",
  "materialInformation",
  "media",
  "publishing",
].sort();

const RESTRICTED_KEYS = [
  "fullAddress",
  "address",
  "postcode",
  "accessNotes",
  "entryNotes",
  "alarm",
  "keySafe",
  "keys",
  "landlord",
  "tenant",
  "internalNotes",
];

describe("demo listings repository", () => {
  it("returns the three illustrative fixtures", async () => {
    const repo = await getListingsRepository();
    const listings = await repo.list();
    expect(repo.source).toBe("demo");
    expect(listings).toHaveLength(3);
  });

  it("marks every record demoOnly with the visible illustrative label", async () => {
    const repo = await getListingsRepository();
    for (const listing of await repo.list()) {
      expect(listing.demoOnly).toBe(true);
      expect(listing.status).toBe("illustrative");
      expect(listing.publishing.label).toBe(DEMO_LISTING_LABEL);
    }
  });

  it("emits only public-safe keys and never restricted fields", async () => {
    const repo = await getListingsRepository();
    for (const listing of await repo.list()) {
      expect(Object.keys(listing).sort()).toEqual(PUBLIC_KEYS);
      const flat = JSON.stringify(listing).toLowerCase();
      for (const key of RESTRICTED_KEYS) {
        expect(Object.keys(listing)).not.toContain(key);
      }
      expect(flat).not.toContain("alarm");
      expect(flat).not.toContain("access code");
      expect(listing.location.showExactLocation).toBe(false);
    }
  });

  it("never supplies a photograph for a fixture (no stock/AI substitutes)", async () => {
    const repo = await getListingsRepository();
    for (const listing of await repo.list()) {
      expect(listing.media.coverImage).toBeNull();
      expect(listing.media.gallery).toHaveLength(0);
    }
  });

  it("resolves a listing by slug and null for unknown slugs", async () => {
    const repo = await getListingsRepository();
    const known = await repo.bySlug("illustrative-two-bedroom-fletton-home");
    expect(known?.id).toBe("DEMO-RBL-001");
    expect(await repo.bySlug("does-not-exist")).toBeNull();
  });
});
