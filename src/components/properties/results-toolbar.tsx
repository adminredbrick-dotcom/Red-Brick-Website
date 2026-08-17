import Link from "next/link";
import { List, Map as MapIcon } from "lucide-react";

import { propertiesHref, type ListingFilters } from "@/lib/listings/filters";
import { cn } from "@/lib/utils";

interface ResultsToolbarProps {
  filters: ListingFilters;
  shown: number;
  total: number;
  activeCount: number;
}

/**
 * Result count, active-filter summary and the List / Map view toggle. The
 * toggle is two links (URL is the state) — no client JavaScript.
 */
export function ResultsToolbar({ filters, shown, total, activeCount }: ResultsToolbarProps) {
  const views = [
    { key: "list", label: "List", icon: List },
    { key: "map", label: "Map", icon: MapIcon },
  ] as const;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-ink" role="status">
        <span className="font-bold">
          {shown} of {total}
        </span>{" "}
        demonstration {total === 1 ? "listing" : "listings"}
        {activeCount > 0 ? (
          <>
            {" "}
            · {activeCount} filter{activeCount === 1 ? "" : "s"} applied ·{" "}
            <Link href="/properties" className="font-bold text-brick underline underline-offset-4">
              Reset
            </Link>
          </>
        ) : null}
      </p>
      <nav aria-label="Results view">
        <ul className="inline-flex overflow-hidden rounded-md border-2 border-ink">
          {views.map(({ key, label, icon: Icon }) => {
            const active = filters.view === key;
            return (
              <li key={key}>
                <Link
                  href={propertiesHref({ ...filters, view: key })}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2 px-4 font-bold",
                    active ? "bg-ink text-cream" : "bg-white text-ink hover:bg-sand",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
