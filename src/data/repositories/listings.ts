import type { PublicListing } from "@/data/contracts/listing";

/**
 * Typed boundary between pages and the listing source.
 * Phase 2: demo JSON adapter. Phase 6: Sanity adapter. Later: PMS feed.
 */
export interface ListingsRepository {
  readonly source: "demo" | "sanity" | "pms";
  list(): Promise<readonly PublicListing[]>;
  bySlug(slug: string): Promise<PublicListing | null>;
}

export async function getListingsRepository(): Promise<ListingsRepository> {
  // Only the demo adapter exists in Phase 2. Selecting a real adapter later
  // will depend on configuration, never on a hard-coded fixture.
  const { demoListingsRepository } = await import("@/data/adapters/demo-listings");
  return demoListingsRepository;
}
