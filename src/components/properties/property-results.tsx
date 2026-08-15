import Link from "next/link";

import { IllustrativeBadge } from "@/components/properties/illustrative-badge";
import { PropertyCard } from "@/components/properties/property-card";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/site";
import { DEMO_DATA_NOTICE } from "@/content/demo-labels";
import type { PublicListing } from "@/data/contracts/listing";
import { hasActiveFilters, type ListingFilters } from "@/lib/listing-filters";
import { cn } from "@/lib/utils";

interface PropertyResultsProps {
  results: readonly PublicListing[];
  filters: ListingFilters;
  selectedId: string | null;
  resultSummary: string;
  className?: string;
}

/** Results column: demo notice, illustrative strip, count, cards or empty state. */
export function PropertyResults({
  results,
  filters,
  selectedId,
  resultSummary,
  className,
}: PropertyResultsProps) {
  const filtered = hasActiveFilters(filters);

  return (
    <section aria-labelledby="results-heading" className={cn("flex-col gap-5", className)}>
      <div className="flex flex-col gap-3">
        <h2 id="results-heading" className="text-2xl">
          Results
        </h2>
        <p className="text-base text-stone">{DEMO_DATA_NOTICE}</p>
        <IllustrativeBadge layout="block" />
        <p id="results-count" className="font-bold text-ink" aria-live="polite">
          {resultSummary}
        </p>
      </div>

      {results.length > 0 ? (
        <ul className="flex flex-col gap-6" aria-labelledby="results-count">
          {results.map((listing) => (
            <li key={listing.id}>
              <PropertyCard listing={listing} selected={selectedId === listing.id} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-stone-light bg-white/70 p-6 md:p-8">
          <h3 className="text-xl">Nothing matches these filters</h3>
          <p className="measure-body mt-3 text-stone">
            {filters.availability !== "any"
              ? "The examples on this page are demonstration records with no published availability date, so availability filters return nothing. Real listings will show a verified date."
              : "Try widening the rent range, choosing “Any” for bedrooms or property type, or checking the area spelling."}
          </p>
          <p className="measure-body mt-3 text-stone">
            To ask us about current availability, message us on WhatsApp.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {filtered ? (
              <Button asChild variant="outline">
                <Link href={routes.properties.path}>Clear filters</Link>
              </Button>
            ) : null}
            <WhatsAppLink variant="button" label="Ask us about availability" />
          </div>
        </div>
      )}
    </section>
  );
}
