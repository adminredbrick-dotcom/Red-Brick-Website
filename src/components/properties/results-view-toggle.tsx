import Link from "next/link";
import { List, Map as MapIcon } from "lucide-react";

import { routes } from "@/config/site";
import { buildPropertiesQuery, type ListingFilters } from "@/lib/listing-filters";
import { cn } from "@/lib/utils";

export type ResultsView = "list" | "map";

interface ResultsViewToggleProps {
  view: ResultsView;
  filters: ListingFilters;
  className?: string;
}

/**
 * Segmented List / Map control for small screens. Two ordinary links driven
 * by the `view` search param, so it works without JavaScript; the list is
 * the default and is always reachable.
 */
export function ResultsViewToggle({ view, filters, className }: ResultsViewToggleProps) {
  const options: { value: ResultsView; label: string; Icon: typeof List }[] = [
    { value: "list", label: "List", Icon: List },
    { value: "map", label: "Map", Icon: MapIcon },
  ];

  return (
    <div
      role="group"
      aria-label="Results view"
      className={cn("inline-flex rounded-md bg-white p-1 shadow-soft", className)}
    >
      {options.map(({ value, label, Icon }) => {
        const current = value === view;
        return (
          <Link
            key={value}
            href={`${routes.properties.path}${buildPropertiesQuery(filters, { view: value })}`}
            aria-current={current ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 min-w-24 items-center justify-center gap-2 rounded-sm px-4 font-bold transition-colors",
              current ? "bg-ink text-cream" : "text-ink hover:bg-sand",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}
