import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { IllustrativeBadge } from "@/components/properties/illustrative-badge";
import { StaticMapPreview } from "@/components/properties/static-map-preview";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/site";
import type { PublicListing } from "@/data/contracts/listing";
import { buildPropertiesQuery, type ListingFilters } from "@/lib/listing-filters";
import { cn } from "@/lib/utils";

interface PropertyMapPaneProps {
  results: readonly PublicListing[];
  filters: ListingFilters;
  selectedId: string | null;
  /** Result count sentence, repeated here for the small-screen map view. */
  resultSummary: string;
  className?: string;
}

/**
 * Sticky, bounded map pane. Markers link back into the list
 * (`?…&selected=<id>#listing-<id>`) so marker → card selection works
 * without JavaScript. On small screens a "Back to list" action returns to
 * the default list view.
 */
export function PropertyMapPane({
  results,
  filters,
  selectedId,
  resultSummary,
  className,
}: PropertyMapPaneProps) {
  const listHref = `${routes.properties.path}${buildPropertiesQuery(filters, { view: "list" })}`;

  return (
    <section
      aria-labelledby="map-heading"
      className={cn("flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="map-heading" className="text-2xl">
          Map preview
        </h2>
        <Button asChild variant="outline" size="sm" className="lg:hidden">
          <Link href={listHref}>
            <ArrowLeft aria-hidden="true" />
            Back to list
          </Link>
        </Button>
      </div>

      <IllustrativeBadge layout="block" className="lg:hidden" />
      <p className="font-bold text-ink lg:hidden">{resultSummary}</p>

      <StaticMapPreview
        listings={results}
        selectedId={selectedId}
        markerHref={(listing) =>
          `${routes.properties.path}${buildPropertiesQuery(filters, { selected: listing.id })}#listing-${listing.id}`
        }
        caption={
          results.length > 0
            ? "Positions are approximate and illustrative — never exact addresses. Choose a marker to highlight that example in the list."
            : "No positions to show for the current filters."
        }
      />

      <p className="rounded-md bg-sand/60 px-4 py-3 text-sm text-ink">
        This is a static preview. The interactive Peterborough map is planned for a later stage of
        the site, with 2D and optional 3D views and marker clustering. The list is always the
        primary way to browse.
      </p>
    </section>
  );
}
