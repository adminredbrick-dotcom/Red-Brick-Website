import Link from "next/link";

import { PropertyCard } from "@/components/properties/property-card";
import { StaticMap, type MapPin } from "@/components/properties/static-map";
import { Button } from "@/components/ui/button";
import { formatRentPcm } from "@/lib/format";
import { areaDisplayName } from "@/lib/listings/areas";
import { listingsRepository, type ListingsRepository } from "@/lib/listings/repository";

interface PropertyPreviewProps {
  /** Heading level to fit the host page's outline (the hybrid homepage uses h2 sections). */
  headingLevel?: "h2" | "h3";
  /** Number of cards (default 3). */
  limit?: number;
  /** Show the static schematic map beside the cards (default true; list-first on small screens). */
  withMap?: boolean;
  /** Inject a different repository (tests, future adapters). */
  repository?: ListingsRepository;
  /** Optional id for the heading so hosts can aria-labelledby the section. */
  headingId?: string;
  className?: string;
}

/**
 * Homepage integration contract — "Available properties" preview.
 * Server component (async): renders featured portfolio cards, a
 * list-first static map, and one "View properties" action. Contains no
 * <section> of its own so the host controls the landmark, surface and
 * spacing. Never renders a live map canvas (must not coexist with the 3D
 * chapter's canvas).
 */
export async function PropertyPreview({
  headingLevel = "h2",
  limit = 3,
  withMap = true,
  repository = listingsRepository,
  headingId = "property-preview-heading",
  className,
}: PropertyPreviewProps) {
  const Heading = headingLevel;
  const CardHeading = headingLevel === "h2" ? "h3" : "h4";
  const listings = await repository.featured(limit);
  const pins: MapPin[] = listings.map((l) => ({
    id: l.id,
    label: `${l.title} — ${formatRentPcm(l.pricing.rentPcm)} (${areaDisplayName(l.location.area)}, approximate)`,
    latitude: l.location.approximateLatitude,
    longitude: l.location.approximateLongitude,
    href: `/properties/${l.slug}`,
  }));

  return (
    <div className={className}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-eyebrow text-brick">Our properties</p>
          <Heading id={headingId} tabIndex={-1} className="text-section mt-2">
            Homes to rent across Peterborough
          </Heading>
          <p className="measure-body mt-3 text-stone">
            Homes we let and manage across Peterborough — street and area only, never a house
            number. Search by area, rent, bedrooms, type and availability; list first, with a map
            when you want it.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/properties">View properties</Link>
        </Button>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" aria-label="Featured properties">
          {listings.map((listing) => (
            <li key={listing.id}>
              <PropertyCard listing={listing} headingLevel={CardHeading} />
            </li>
          ))}
        </ul>
        {withMap ? (
          <StaticMap
            size="compact"
            pins={pins}
            title="Schematic map of Peterborough showing the featured homes by approximate area"
          />
        ) : null}
      </div>
    </div>
  );
}
