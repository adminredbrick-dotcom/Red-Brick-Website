import type { Metadata } from "next";

import { PropertyFilterBar } from "@/components/properties/property-filter-bar";
import { PropertyMapPane } from "@/components/properties/property-map-pane";
import { PropertyResults } from "@/components/properties/property-results";
import { ResultsViewToggle, type ResultsView } from "@/components/properties/results-view-toggle";
import { PageIntro } from "@/components/shared/page-intro";
import { routes } from "@/config/site";
import { getListingsRepository } from "@/data/repositories/listings";
import { applyFilters, parseFilters } from "@/lib/listing-filters";
import { pluralise } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: routes.properties.title,
  description:
    "Search homes to rent across Peterborough by area, rent, bedrooms, property type and availability, with a list and map view. Demonstration examples only until real listings are published.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readString(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return typeof value === "string" ? value : null;
}

/**
 * Property search. Everything is driven by the URL (`searchParams`) so the
 * filter form, List/Map switch and map-marker selection all work with
 * JavaScript disabled. Filter param names live in src/lib/listing-filters.ts;
 * page-state params are `view` (list | map) and `selected` (listing id).
 */
export default async function PropertiesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const view: ResultsView = readString(params, "view") === "map" ? "map" : "list";
  const selectedId = readString(params, "selected");

  const repo = await getListingsRepository();
  const listings = await repo.list();
  const results = applyFilters(listings, filters);

  const resultSummary =
    results.length === 0
      ? "No properties match these filters."
      : `${pluralise(results.length, "illustrative example")} ${results.length === 1 ? "matches" : "match"}.`;

  return (
    <>
      <PageIntro
        eyebrow="Properties"
        heading="Properties to rent in Peterborough"
        lede="Search by area, rent, bedrooms, type and availability. Every home we publish here will show verified costs, features and availability — until then, the examples below only demonstrate how the search works."
      />

      <PropertyFilterBar filters={filters} view={view} resultSummary={resultSummary} />

      <div className="container-rb pb-16 pt-8 md:pb-24">
        <ResultsViewToggle view={view} filters={filters} className="mb-6 lg:hidden" />

        <div className="lg:grid lg:grid-cols-[45fr_55fr] lg:items-start lg:gap-8 xl:gap-10">
          <PropertyResults
            results={results}
            filters={filters}
            selectedId={selectedId}
            resultSummary={resultSummary}
            className={cn(view === "map" ? "hidden lg:flex" : "flex")}
          />
          {/* On small screens only the chosen view is rendered visible; the
              list is the default. On large screens both columns are shown. */}
          <PropertyMapPane
            results={results}
            filters={filters}
            selectedId={selectedId}
            resultSummary={resultSummary}
            className={cn(view === "map" ? "flex" : "hidden lg:flex")}
          />
        </div>
      </div>
    </>
  );
}
