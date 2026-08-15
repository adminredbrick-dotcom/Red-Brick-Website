import { Badge } from "@/components/ui/badge";
import { DEMO_LISTING_LABEL } from "@/content/demo-labels";
import { cn } from "@/lib/utils";

interface IllustrativeBadgeProps {
  className?: string;
  /** Use "block" for a full-width strip above detail content. */
  layout?: "inline" | "block";
}

/**
 * The mandatory visible marker for demonstration listings
 * (DoD: "Illustrative example — not currently available").
 */
export function IllustrativeBadge({ className, layout = "inline" }: IllustrativeBadgeProps) {
  if (layout === "block") {
    return (
      <p
        className={cn(
          "rounded-md border-2 border-attention bg-white px-4 py-3 font-bold text-ink",
          className,
        )}
      >
        {DEMO_LISTING_LABEL}
      </p>
    );
  }
  return (
    <Badge variant="attention" className={className}>
      {DEMO_LISTING_LABEL}
    </Badge>
  );
}
