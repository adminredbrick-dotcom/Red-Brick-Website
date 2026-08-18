import Link from "next/link";

import { DemoBadge } from "@/components/properties/demo-badge";
import { PlaceholderImage } from "@/components/properties/placeholder-image";
import { StatusBadge } from "@/components/properties/status-badge";
import { formatRentPcm, pluralise } from "@/lib/format";
import { areaDisplayName } from "@/lib/listings/areas";
import { furnishingLabels, propertyTypeLabels, type Listing } from "@/lib/listings/types";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  listing: Listing;
  /** Heading level within the surrounding document outline. */
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
}

/**
 * Listing card: essentials only (Resider-inspired card discipline) —
 * image, status, title, area, rent, beds/baths/type/furnishing — plus the
 * demonstration label when (and only when) the record is fictional. The whole title is the link; the card is a
 * semantic <article>.
 */
export function PropertyCard({ listing, headingLevel = "h3", className }: PropertyCardProps) {
  const Heading = headingLevel;
  const href = `/properties/${listing.slug}`;
  const facts = [
    listing.property.bedrooms !== null ? pluralise(listing.property.bedrooms, "bedroom") : "Bedrooms to be confirmed",
    listing.property.bathrooms !== null ? pluralise(listing.property.bathrooms, "bathroom") : null,
    propertyTypeLabels[listing.property.type],
    listing.property.furnishing ? furnishingLabels[listing.property.furnishing] : null,
  ].filter(Boolean) as string[];

  return (
    <article
      className={cn("flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-soft", className)}
      aria-labelledby={`${listing.slug}-title`}
    >
      <div className="p-3 pb-0">
        <PlaceholderImage type={listing.property.type} alt={listing.media.cover.alt} />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 pt-4">
        {listing.demoOnly ? <DemoBadge className="self-start" /> : null}
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge listing={listing} />
        </div>
        <Heading id={`${listing.slug}-title`} className="text-xl leading-snug">
          <Link
            href={href}
            className="rounded-sm text-ink underline-offset-4 hover:text-brick hover:underline"
          >
            {listing.title}
          </Link>
        </Heading>
        <p className="text-stone">
          {areaDisplayName(listing.location.area)} ({listing.location.outwardPostcode})
        </p>
        <p className="text-2xl font-bold text-ink">
          {formatRentPcm(listing.pricing.rentPcm)}
        </p>
        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-base text-ink" aria-label="Key facts">
          {facts.map((fact) => (
            <li key={fact} className="after:ml-3 after:text-stone-light after:content-['·'] last:after:content-none">
              {fact}
            </li>
          ))}
        </ul>
        <p className="mt-auto pt-2">
          <Link href={href} className="font-bold text-brick underline underline-offset-4 hover:text-brick-deep">
            View details<span className="sr-only"> for {listing.title}</span>
          </Link>
        </p>
      </div>
    </article>
  );
}
