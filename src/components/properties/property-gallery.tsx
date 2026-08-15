import { Images } from "lucide-react";

import { PropertyPlaceholderImage } from "@/components/properties/property-placeholder-image";
import type { PublicListing } from "@/data/contracts/listing";

interface PropertyGalleryProps {
  listing: PublicListing;
}

/**
 * Gallery mosaic. No photographs exist for demonstration records, and a real
 * listing may only ever show photographs of that property — so every tile is
 * a labelled placeholder rather than a stock or generated image.
 */
export function PropertyGallery({ listing }: PropertyGalleryProps) {
  const photoCount = listing.media.gallery.length + (listing.media.coverImage ? 1 : 0);

  return (
    <section aria-label="Photographs" className="flex flex-col gap-3">
      <div className="grid gap-3 md:grid-cols-[2fr_1fr] md:grid-rows-2">
        <PropertyPlaceholderImage
          caption={listing.media.coverAlt}
          className="md:row-span-2 md:aspect-auto md:h-full md:min-h-80"
        />
        <PropertyPlaceholderImage
          caption="Illustrative placeholder — no photograph"
          className="hidden md:flex"
        />
        <PropertyPlaceholderImage
          caption="Illustrative placeholder — no photograph"
          className="hidden md:flex"
        />
      </div>
      <p className="flex items-center gap-2 text-base text-stone">
        <Images className="size-5 shrink-0" aria-hidden="true" />
        <span>
          <span className="font-bold">View all photos</span> (
          {photoCount === 0 ? "none published" : photoCount}
          ). A real listing shows photographs of that property only.
        </span>
      </p>
    </section>
  );
}
