import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { PropertyCard } from "@/components/properties/property-card";
import { StaticMapPreview } from "@/components/properties/static-map-preview";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/site";
import { DEMO_DATA_NOTICE } from "@/content/demo-labels";
import { propertiesPreview } from "@/content/home-copy";
import type { PublicListing } from "@/data/contracts/listing";

interface PropertiesPreviewProps {
  id: string;
  listings: readonly PublicListing[];
}

/**
 * Peterborough properties preview: honest context, the demonstration notice,
 * then a practical list/map split. Desktop: cards (45%) beside the static
 * map (55%). Mobile: list first, map behind a <details> disclosure that works
 * without JavaScript. Never implies availability.
 */
export function PropertiesPreview({ id, listings }: PropertiesPreviewProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-4 bg-white">
      <div className="container-rb py-14 md:py-20 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-eyebrow text-brick">Peterborough</p>
          <h2 id={`${id}-heading`} className="text-section mt-3">
            {propertiesPreview.heading}
          </h2>
          <p className="measure-body mt-4 text-lg text-stone">{propertiesPreview.context}</p>
          <p className="mt-5 rounded-md border-l-4 border-attention bg-cream px-4 py-3 text-base font-bold text-ink">
            {DEMO_DATA_NOTICE}
          </p>
        </div>

        <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:gap-8">
          <ul
            aria-label="Illustrative example properties"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1"
          >
            {listings.map((listing) => (
              <li key={listing.id}>
                <PropertyCard listing={listing} headingLevel="h3" />
              </li>
            ))}
          </ul>

          {/* Desktop map — bounded sticky beside the list. */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <StaticMapPreview listings={listings} />
            </div>
          </div>

          {/* Mobile map disclosure — native <details>, no JavaScript needed. */}
          <details className="group/map mt-6 rounded-lg border border-stone-light bg-cream p-4 lg:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-sm font-bold text-ink [&::-webkit-details-marker]:hidden">
              {propertiesPreview.mapDisclosure}
              <ChevronDown
                aria-hidden="true"
                className="size-5 shrink-0 transition-transform group-open/map:rotate-180"
              />
            </summary>
            <div className="mt-4">
              <StaticMapPreview listings={listings} />
            </div>
          </details>
        </div>

        <div className="mt-8">
          <Button asChild size="lg" variant="outline">
            <Link href={routes.properties.path}>{propertiesPreview.cta}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
