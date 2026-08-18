import { demoListings } from "./demo-listings";
import { applyFilters, type ListingFilters } from "./filters";
import { portfolioListings } from "./portfolio-listings";
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

/** In-memory repository over a fixed set of records (the portfolio dataset, or the labelled demonstration set). */
export class InMemoryListingsRepository implements ListingsRepository {
  constructor(private readonly source: readonly Listing[]) {}

  async all(): Promise<readonly Listing[]> {
    return this.source;
  }

  async search(filters: ListingFilters): Promise<{ results: Listing[]; total: number }> {
    return { results: applyFilters(this.source, filters), total: this.source.length };
  }

  async bySlug(slug: string): Promise<Listing | null> {
    return this.source.find((l) => l.slug === slug) ?? null;
  }

  /** Available homes first, then the rest in display order, up to `limit`. */
  async featured(limit = 3): Promise<Listing[]> {
    const ordered = applyFilters(this.source, { area: null, minRent: null, maxRent: null, bedrooms: null, type: null, availability: "any", view: "list" });
    return ordered.slice(0, limit);
  }
}

/** Demonstration repository — fictional, labelled records only (kept for the Phase 2 experiment pages and tests). */
export class DemoListingsRepository extends InMemoryListingsRepository {
  constructor(source: readonly Listing[] = demoListings) {
    super(source);
  }
}

/**
 * The repository the app uses: the Red Brick portfolio dataset (public-safe facts only —
 * see src/lib/listings/portfolio-listings.ts). Replace this single binding when a live
 * property-management adapter exists.
 */
export const listingsRepository: ListingsRepository = new InMemoryListingsRepository(portfolioListings);
