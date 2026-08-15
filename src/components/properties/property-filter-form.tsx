import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/config/site";
import { propertyTypeLabels } from "@/data/contracts/listing";
import {
  FILTER_PARAMS,
  availabilityOptions,
  bedroomOptions,
  type ListingFilters,
} from "@/lib/listing-filters";
import { cn } from "@/lib/utils";

interface PropertyFilterFormProps {
  filters: ListingFilters;
  /**
   * The form is rendered twice (mobile disclosure and desktop bar) and only one
   * copy is ever visible; the prefix keeps ids unique across the two.
   */
  idPrefix: string;
  /** Preserves the mobile map view across a filter submission. */
  view: "list" | "map";
  className?: string;
}

const selectClassName =
  "flex min-h-12 w-full rounded-md border border-stone bg-white px-4 py-2 text-base text-ink";

/**
 * Plain GET form — filtering works with JavaScript disabled because the
 * server page reads `searchParams`. Every control has a visible label.
 */
export function PropertyFilterForm({
  filters,
  idPrefix,
  view,
  className,
}: PropertyFilterFormProps) {
  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <form
      method="get"
      action={routes.properties.path}
      aria-label="Filter properties"
      className={cn("flex flex-col gap-5", className)}
    >
      {view === "map" ? <input type="hidden" name="view" value="map" /> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-12">
        <div className="flex flex-col gap-1.5 sm:col-span-2 xl:col-span-4">
          <Label htmlFor={id("area")}>Area or postcode</Label>
          <Input
            id={id("area")}
            name={FILTER_PARAMS.area}
            type="search"
            defaultValue={filters.area}
            placeholder="e.g. Werrington or PE4"
            autoComplete="off"
            maxLength={60}
          />
        </div>

        <div className="flex flex-col gap-1.5 xl:col-span-2">
          <Label htmlFor={id("minRent")}>Min rent (£ pcm)</Label>
          <Input
            id={id("minRent")}
            name={FILTER_PARAMS.minRent}
            type="number"
            inputMode="numeric"
            min={0}
            defaultValue={filters.minRent ?? ""}
            placeholder="Any"
          />
        </div>

        <div className="flex flex-col gap-1.5 xl:col-span-2">
          <Label htmlFor={id("maxRent")}>Max rent (£ pcm)</Label>
          <Input
            id={id("maxRent")}
            name={FILTER_PARAMS.maxRent}
            type="number"
            inputMode="numeric"
            min={0}
            defaultValue={filters.maxRent ?? ""}
            placeholder="Any"
          />
        </div>

        <div className="flex flex-col gap-1.5 xl:col-span-2">
          <Label htmlFor={id("bedrooms")}>Bedrooms</Label>
          <select
            id={id("bedrooms")}
            name={FILTER_PARAMS.bedrooms}
            defaultValue={filters.bedrooms === null ? "" : String(filters.bedrooms)}
            className={selectClassName}
          >
            <option value="">Any</option>
            {bedroomOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 xl:col-span-2">
          <Label htmlFor={id("type")}>Property type</Label>
          <select
            id={id("type")}
            name={FILTER_PARAMS.type}
            defaultValue={filters.type ?? ""}
            className={selectClassName}
          >
            <option value="">Any</option>
            {Object.entries(propertyTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 xl:col-span-3">
          <Label htmlFor={id("availability")}>Availability</Label>
          <select
            id={id("availability")}
            name={FILTER_PARAMS.availability}
            defaultValue={filters.availability}
            className={selectClassName}
          >
            {availabilityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 xl:col-span-3">
          <Label htmlFor={id("availableFrom")}>Move-in date</Label>
          <Input
            id={id("availableFrom")}
            name={FILTER_PARAMS.availableFrom}
            type="date"
            defaultValue={filters.availableFrom ?? ""}
            aria-describedby={id("availableFrom-hint")}
          />
          <p id={id("availableFrom-hint")} className="text-sm text-stone">
            Used with “Available from a date”. Shows homes available on or before this date.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit">Apply filters</Button>
        <Button asChild variant="outline">
          <Link href={routes.properties.path}>Clear</Link>
        </Button>
      </div>
    </form>
  );
}
