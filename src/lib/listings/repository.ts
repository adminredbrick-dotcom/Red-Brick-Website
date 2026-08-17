import { demoListings } from "./demo-listings";
import { applyFilters, type ListingFilters } from "./filters";
import type { Listing } from "./types";

/**
 * Repository boundary for listings. Pages and components only ever talk to
 * this interface; the demonstration implementation below is swapped for a
 * CMS or property-management adapter later without touching the UI
 * (technical/TECHNICAL-SPEC.md: typed repository/adaptor boundaries).
 */
export interface ListingsRepository {
  /** All public listings (any status). */
  all(): Promise<readonly Listing[]>;
  /** Listings matching the filters, in display order. */
  search(filters: ListingFilters): Promise<{ results: Listing[]; total: number }>;
  bySlug(slug: string): Promise<Listing | null>;
  /** A small featured set for previews (homepage integration). */
  featured(limit?: number): Promise<Listing[]>;
}

/** In-memory demonstration repository — fictional, labelled records only. */
export class DemoListingsRepository implements ListingsRepository {
  constructor(private readonly source: readonly Listing[] = demoListings) {}

  async all(): Promise<readonly Listing[]> {
    return this.source;
  }

  async search(filters: ListingFilters): Promise<{ results: Listing[]; total: number }> {
    return { results: applyFilters(this.source, filters), total: this.source.length };
  }

  async bySlug(slug: string): Promise<Listing | null> {
    return this.source.find((l) => l.slug === slug) ?? null;
  }

  async featured(limit = 3): Promise<Listing[]> {
    return this.source.filter((l) => l.status === "available").slice(0, limit);
  }
}

/**
 * The repository the app uses. Replace this single binding when a live
 * adapter exists (e.g. `new SanityListingsRepository(client)`).
 */
export const listingsRepository: ListingsRepository = new DemoListingsRepository();
