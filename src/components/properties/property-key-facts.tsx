import { Armchair, Bath, BedDouble, CalendarDays, Home, Sofa } from "lucide-react";

import { furnishingLabels, propertyTypeLabels, type PublicListing } from "@/data/contracts/listing";
import { formatDate } from "@/lib/format";

interface PropertyKeyFactsProps {
  listing: PublicListing;
}

/** Key facts row: bedrooms, bathrooms, receptions, type, furnishing, availability. */
export function PropertyKeyFacts({ listing }: PropertyKeyFactsProps) {
  const facts: { label: string; value: string; Icon: typeof Home }[] = [
    { label: "Bedrooms", value: String(listing.property.bedrooms), Icon: BedDouble },
    { label: "Bathrooms", value: String(listing.property.bathrooms), Icon: Bath },
    {
      label: "Reception rooms",
      value:
        listing.property.receptionRooms === null
          ? "Not published"
          : String(listing.property.receptionRooms),
      Icon: Armchair,
    },
    { label: "Property type", value: propertyTypeLabels[listing.property.type], Icon: Home },
    { label: "Furnishing", value: furnishingLabels[listing.availability.furnished], Icon: Sofa },
    {
      label: "Available from",
      value: formatDate(listing.availability.availableFrom),
      Icon: CalendarDays,
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
      {facts.map(({ label, value, Icon }) => (
        <div key={label} className="min-w-0">
          <dt className="flex items-center gap-2 text-sm text-stone">
            <Icon className="size-4 shrink-0 text-brick" aria-hidden="true" />
            {label}
          </dt>
          <dd className="mt-0.5 break-words pl-6 font-bold text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
