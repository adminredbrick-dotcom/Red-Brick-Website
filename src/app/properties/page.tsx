import type { Metadata } from "next";

import { EmptyState } from "@/components/properties/empty-state";
import { FilterDrawer } from "@/components/properties/filter-drawer";
import { FilterForm } from "@/components/properties/filter-form";
import { PropertyCard } from "@/components/properties/property-card";
import { ResultsToolbar } from "@/components/properties/results-toolbar";
import { StaticMap, type MapPin } from "@/components/properties/static-map";
import { PageIntro } from "@/components/shared/page-intro";
import { routes } from "@/config/site";
import { demoLabels } from "@/content/demo-labels";
import { formatRentPcm } from "@/lib/format";
import { areaDisplayName } from "@/lib/listings/areas";
import { countActiveFilters, parseFilters, type RawSearchParams } from "@/lib/listings/filters";
import { listingsRepository } from "@/lib/listings/repository";

export const metadata: Metadata = {
  title: routes.properties.title,
  description: routes.properties.description,
};

interface PropertiesPageProps {
  searchParams: Promise<RawSearchParams>;
}

/**
 * Properties search — list-first with an optional static map view. The URL
 * carries every filter (GET form), so results are server-rendered, shareable
 * and work without JavaScript. Every record shown here is a demonstration
 * listing carrying the mandatory label.
 */
export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const filters = parseFilters(await searchParams);
  const { results, total } = await listingsRepository.search(filters);
  const activeCount = countActiveFilters(filters);

  const pins: MapPin[] = results.map((listing) => ({
    id: listing.id,
    label: `${listing.title} — ${formatRentPcm(listing.pricing.rentPcm)} (${areaDisplayName(listing.location.area)}, approximate)`,
    latitude: listing.location.approximateLatitude,
    longitude: listing.location.approximateLongitude,
    href: `/properties/${listing.slug}`,
    emphasis: listing.status === "let-agreed" ? "muted" : "default",
  }));

  return (
    <>
      <PageIntro
        eyebrow="Properties"
        heading="Properties to rent in Peterborough"
        lede="A practical search: filter by area, rent, bedrooms, type and availability, browse the list, or switch to the map. Every listing on this page is a demonstration record while the live property feed is connected."
      />

      <section aria-labelledby="results-heading" className="bg-white">
        <div className="container-rb py-10 md:py-14">
          <h2 id="results-heading" className="sr-only">
            Search results
          </h2>
          <p className="mb-6 rounded-md bg-sand px-4 py-3 text-base text-ink">
            <strong>{demoLabels.listing}</strong> Every property below is fictional and exists only to
            show how the search will work. Real, approved listings replace them when the property
            feed is live.
          </p>

          <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-10">
            {/* Desktop filters */}
            <aside aria-labelledby="filters-heading" className="hidden lg:block">
              <div className="sticky top-6 rounded-lg bg-cream p-5">
                <h3 id="filters-heading" className="text-eyebrow text-brick">
                  Filters
                </h3>
                <FilterForm filters={filters} idPrefix="desktop" className="mt-4" />
              </div>
            </aside>

            <div className="min-w-0">
              {/* Mobile filters: drawer (JS) + plain form fallback (no JS) */}
              <div className="mb-5 lg:hidden">
                <FilterDrawer activeCount={activeCount}>
                  <FilterForm filters={filters} idPrefix="drawer" />
                </FilterDrawer>
                <noscript>
                  <div className="mt-4 rounded-lg bg-cream p-5">
                    <h3 className="text-eyebrow text-brick">Filters</h3>
                    <FilterForm filters={filters} idPrefix="noscript" className="mt-4" />
                  </div>
                </noscript>
              </div>

              <ResultsToolbar
                filters={filters}
                shown={results.length}
                total={total}
                activeCount={activeCount}
              />

              {results.length === 0 ? (
                <div className="mt-6">
                  <EmptyState filters={filters} />
                </div>
              ) : filters.view === "map" ? (
                <div className="mt-6 flex flex-col gap-8">
                  <StaticMap
                    pins={pins}
                    highlightArea={filters.area}
                    title="Schematic map of Peterborough showing the matching demonstration listings"
                  />
                  <div>
                    <h3 className="text-xl">Listings on this map</h3>
                    <ul className="mt-4 grid gap-6 sm:grid-cols-2" aria-label="Matching properties">
                      {results.map((listing) => (
                        <li key={listing.id}>
                          <PropertyCard listing={listing} headingLevel="h3" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <ul
                  className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                  aria-label="Matching properties"
                >
                  {results.map((listing) => (
                    <li key={listing.id}>
                      <PropertyCard listing={listing} headingLevel="h3" />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
