import { cn } from "@/lib/utils";

/** Visible marker for demonstration figures — attention border, ink text (never colour alone). */
export function IllustrativeMarker({
  children = "Illustrative sample",
}: {
  children?: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center rounded-sm border-2 border-attention bg-white px-2.5 py-1 text-sm font-bold leading-tight text-ink">
      {children}
    </span>
  );
}

interface ReportModuleProps {
  id: string;
  title: string;
  intro?: string;
  /** Visual surface. "sand" is reserved for completed-sale context. */
  surface?: "white" | "sand" | "dark";
  /** Shows the visible "Illustrative sample" marker on demo reports. */
  illustrative?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * One module of the report: an h3-labelled section on its own surface.
 * Headings stay h3 beneath the report's h2 (no level skips).
 */
export function ReportModule({
  id,
  title,
  intro,
  surface = "white",
  illustrative = false,
  children,
  className,
}: ReportModuleProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-surface={surface === "dark" ? "dark" : undefined}
      className={cn(
        "rounded-lg p-6 md:p-8",
        surface === "white" && "bg-white text-ink shadow-soft",
        surface === "sand" && "border-2 border-sand bg-sand/60 text-ink",
        surface === "dark" && "bg-ink text-cream",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h3 id={headingId} className="text-2xl">
          {title}
        </h3>
        {illustrative ? <IllustrativeMarker /> : null}
      </div>
      {intro ? (
        <p
          className={cn(
            "measure-body mt-2",
            surface === "dark" && "text-sand",
            surface === "sand" && "text-ink",
            surface === "white" && "text-stone",
          )}
        >
          {intro}
        </p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}
