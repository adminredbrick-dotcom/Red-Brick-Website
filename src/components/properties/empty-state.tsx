import Link from "next/link";

import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { Button } from "@/components/ui/button";
import { propertiesHref, type ListingFilters } from "@/lib/listings/filters";

interface EmptyStateProps {
  filters: ListingFilters;
}

/** Honest, actionable empty state with a reset route and a widen-search suggestion. */
export function EmptyState({ filters }: EmptyStateProps) {
  const widened = propertiesHref({ ...filters, area: null, availability: "any" });
  return (
    <div className="rounded-lg border-2 border-dashed border-stone-light bg-white/70 p-6 md:p-8">
      <h3 className="text-xl">No demonstration listings match those filters</h3>
      <p className="measure-body mt-2 text-stone">
        Try widening the rent range, choosing more bedrooms, or clearing the area and availability
        filters. Nothing is hidden: this list shows every published listing that matches.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button asChild>
          <Link href="/properties">Reset all filters</Link>
        </Button>
        {widened !== propertiesHref(filters) ? (
          <Button asChild variant="outline">
            <Link href={widened}>Search all areas and availability</Link>
          </Button>
        ) : null}
        <p className="text-stone">
          Or ask us directly: <WhatsAppLink variant="inline" />
        </p>
      </div>
    </div>
  );
}
