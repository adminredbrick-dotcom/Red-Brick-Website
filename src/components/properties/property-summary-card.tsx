import { MessageCircle } from "lucide-react";

import { publishedMoney } from "@/components/properties/listing-display";
import { Button } from "@/components/ui/button";
import { DEMO_LISTING_LABEL } from "@/content/demo-labels";
import { furnishingLabels, type PublicListing } from "@/data/contracts/listing";
import { formatDate, formatRentPcm } from "@/lib/format";
import { whatsappHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface PropertySummaryCardProps {
  listing: PublicListing;
  className?: string;
}

/** WhatsApp message pre-filled with the public listing reference only. */
export function listingEnquiryHref(listing: PublicListing): string {
  return whatsappHref(undefined, `Hello, I'm asking about listing ${listing.id}`);
}

/**
 * Sticky summary on desktop, near-the-top summary on mobile: the figures a
 * visitor compares first, plus the single enquiry route.
 */
export function PropertySummaryCard({ listing, className }: PropertySummaryCardProps) {
  const rows: { label: string; value: string }[] = [
    { label: "Deposit", value: publishedMoney(listing.pricing.deposit) },
    { label: "Holding deposit", value: publishedMoney(listing.pricing.holdingDeposit) },
    { label: "Furnishing", value: furnishingLabels[listing.availability.furnished] },
    { label: "Available from", value: formatDate(listing.availability.availableFrom) },
  ];

  return (
    <aside
      aria-labelledby="summary-heading"
      className={cn("rounded-lg bg-white p-6 shadow-soft", className)}
    >
      <h2 id="summary-heading" className="text-eyebrow text-brick">
        At a glance
      </h2>
      <p className="mt-2 text-3xl font-bold tabular-nums">
        {formatRentPcm(listing.pricing.rentPcm)}
      </p>
      <dl className="mt-4 divide-y divide-stone-light border-y border-stone-light">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="text-stone">{row.label}</dt>
            <dd className="text-right font-bold tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5">
        <Button asChild className="w-full">
          <a href={listingEnquiryHref(listing)}>
            <MessageCircle aria-hidden="true" />
            Ask about this property
          </a>
        </Button>
        <p className="mt-2 text-sm text-stone">
          Opens WhatsApp with the listing reference filled in.
        </p>
      </div>
      {listing.demoOnly ? (
        <p className="mt-4 rounded-md bg-sand/70 px-3 py-2 text-sm font-bold text-ink">
          {listing.publishing.label ?? DEMO_LISTING_LABEL}
        </p>
      ) : null}
    </aside>
  );
}
