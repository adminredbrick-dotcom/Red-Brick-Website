import { cn } from "@/lib/utils";

interface PendingSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  /**
   * Heading level for the placeholder title. Defaults to h3 because these
   * panels normally sit beneath a section's h2; pass "h2" when the panel is
   * a top-level sibling within the page.
   */
  headingLevel?: "h2" | "h3";
}

/**
 * Honest "in preparation" state. Visibly a placeholder — never styled to
 * look like live content (CLAUDE.md: honest unavailable states only).
 */
export function PendingSection({
  title,
  children,
  className,
  headingLevel = "h3",
}: PendingSectionProps) {
  const Heading = headingLevel;
  return (
    <div
      className={cn(
        "rounded-lg border-2 border-dashed border-stone-light bg-white/60 p-6 md:p-8",
        className,
      )}
    >
      <p className="text-eyebrow text-stone">In preparation</p>
      <Heading className="mt-2 text-xl">{title}</Heading>
      <div className="measure-body mt-3 text-stone">{children}</div>
    </div>
  );
}
