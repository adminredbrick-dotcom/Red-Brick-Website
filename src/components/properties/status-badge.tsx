import { formatUkDate } from "@/lib/format";
import { listingStatusLabels, type Listing } from "@/lib/listings/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  listing: Pick<Listing, "status" | "availableFrom">;
  className?: string;
}

/** Availability status as text (never colour alone). */
export function StatusBadge({ listing, className }: StatusBadgeProps) {
  const label = listingStatusLabels[listing.status];
  const detail =
    listing.status !== "let-agreed" && listing.status !== "let" && listing.availableFrom
      ? ` from ${formatUkDate(listing.availableFrom)}`
      : "";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-1 text-sm font-bold",
        listing.status === "available" && "bg-success/10 text-success",
        listing.status === "coming-soon" && "bg-sand text-ink",
        listing.status === "let-agreed" && "bg-stone-light text-ink",
        listing.status === "let" && "bg-cream text-ink ring-1 ring-sand",
        className,
      )}
    >
      {label}
      {detail}
    </span>
  );
}
