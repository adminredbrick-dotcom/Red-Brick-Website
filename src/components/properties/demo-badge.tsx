import { demoLabels } from "@/content/demo-labels";
import { cn } from "@/lib/utils";

interface DemoBadgeProps {
  /** Which mandatory label to show. */
  kind?: keyof typeof demoLabels;
  className?: string;
}

/**
 * The visible honesty label for demonstration content. Always rendered as
 * real text (never colour-only, never an icon) so it survives screen
 * readers, print and reduced motion.
 */
export function DemoBadge({ kind = "listing", className }: DemoBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-sm border border-attention bg-sand px-2.5 py-1 text-sm font-bold text-ink",
        className,
      )}
    >
      <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-attention" />
      {demoLabels[kind]}
    </span>
  );
}
