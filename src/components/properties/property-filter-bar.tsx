import { ChevronDown, SlidersHorizontal } from "lucide-react";

import { PropertyFilterForm } from "@/components/properties/property-filter-form";
import { countActiveFilters, type ListingFilters } from "@/lib/listing-filters";

interface PropertyFilterBarProps {
  filters: ListingFilters;
  view: "list" | "map";
  /** Sentence such as "3 illustrative examples match". */
  resultSummary: string;
}

/**
 * Filters live in a native <details> disclosure on small screens (works with
 * JavaScript disabled) and inline on large screens. Only one copy is visible
 * at any width; ids are prefixed so the two never collide.
 */
export function PropertyFilterBar({ filters, view, resultSummary }: PropertyFilterBarProps) {
  const active = countActiveFilters(filters);
  const summaryLabel = active > 0 ? `Filters (${active} active)` : "Filters";

  return (
    <section aria-labelledby="filters-heading" className="container-rb">
      <h2 id="filters-heading" className="sr-only">
        Filter properties
      </h2>

      {/* Small screens: disclosure, closed by default so results stay near the top. */}
      <details className="group rounded-lg bg-white shadow-soft lg:hidden">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-5 py-3 font-bold text-ink [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="size-5 text-brick" aria-hidden="true" />
            {summaryLabel}
          </span>
          <ChevronDown
            className="size-5 shrink-0 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="border-t border-stone-light px-5 pb-6 pt-5">
          <PropertyFilterForm filters={filters} idPrefix="mf" view={view} />
          <p className="mt-4 text-base text-stone" aria-live="polite">
            {resultSummary}
          </p>
        </div>
      </details>

      {/* Large screens: inline bar. */}
      <div className="hidden rounded-lg bg-white p-6 shadow-soft lg:block">
        <PropertyFilterForm filters={filters} idPrefix="df" view={view} />
      </div>
    </section>
  );
}
