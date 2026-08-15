import Link from "next/link";
import { BedDouble, Bath, MapPin } from "lucide-react";

import { IllustrativeBadge } from "@/components/properties/illustrative-badge";
import { PropertyPlaceholderImage } from "@/components/properties/property-placeholder-image";
import { furnishingLabels, propertyTypeLabels, type PublicListing } from "@/data/contracts/listing";
import { formatRentPcm, pluralise } from "@/lib/format";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  listing: PublicListing;
  className?: string;
  /** Marks the card as the currently selected result (list/map sync). */
  selected?: boolean;
  /** Heading level for the card title (defaults to h3 under a section h2). */
  headingLevel?: "h2" | "h3";
}

/**
 * Compact listing card used on the homepage preview and the search list.
 * Everything a map marker would communicate is duplicated here in HTML.
 */
export function PropertyCard({
  listing,
  className,
  selected = false,
  headingLevel = "h3",
}: PropertyCardProps) {
  const Heading = headingLevel;
  const href = `/properties/${listing.slug}`;

  return (
    <article
      id={`listing-${listing.id}`}
      data-listing-id={listing.id}
      aria-labelledby={`listing-${listing.id}-title`}
      className={cn(
        "flex flex-col overflow-hidden rounded-lg bg-white shadow-soft outline-offset-2 transition-shadow",
        selected && "outline outline-3 outline-brick",
        className,
      )}
    >
      <div className="relative">
        <PropertyPlaceholderImage className="rounded-none" />
        <div className="absolute left-3 top-3">
          <IllustrativeBadge />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-2xl font-bold">{formatRentPcm(listing.pricing.rentPcm)}</p>
          <Heading id={`listing-${listing.id}-title`} className="mt-1 text-lg">
            <Link href={href} className="rounded-sm hover:underline">
              {listing.title}
            </Link>
          </Heading>
        </div>

        <p className="flex items-center gap-1.5 text-stone">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          <span>
            {listing.location.publicArea} · {listing.location.outwardPostcode}
            <span className="sr-only"> (approximate area)</span>
          </span>
        </p>

        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-base text-ink">
          <li className="flex items-center gap-1.5">
            <BedDouble className="size-4 text-stone" aria-hidden="true" />
            {pluralise(listing.property.bedrooms, "bedroom")}
          </li>
          <li className="flex items-center gap-1.5">
            <Bath className="size-4 text-stone" aria-hidden="true" />
            {pluralise(listing.property.bathrooms, "bathroom")}
          </li>
          <li>{propertyTypeLabels[listing.property.type]}</li>
          <li>{furnishingLabels[listing.availability.furnished]}</li>
        </ul>

        <p className="text-base text-stone">{listing.summary}</p>

        <p className="mt-auto pt-2">
          <Link
            href={href}
            className="font-bold text-brick underline underline-offset-4"
            aria-label={`View details: ${listing.title}`}
          >
            View details
          </Link>
        </p>
      </div>
    </article>
  );
}
