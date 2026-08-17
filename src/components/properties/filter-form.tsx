import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { areas } from "@/lib/listings/areas";
import {
  availabilityLabels,
  availabilityOptions,
  bedroomOptions,
  filterParamKeys,
  type ListingFilters,
} from "@/lib/listings/filters";
import { propertyTypeLabels, propertyTypes } from "@/lib/listings/types";
import { cn } from "@/lib/utils";

interface FilterFormProps {
  filters: ListingFilters;
  /** Unique prefix so the desktop and drawer instances never share ids. */
  idPrefix: string;
  className?: string;
  /** Called after Apply on the client (drawer closes); no-op on the server. */
  formProps?: React.FormHTMLAttributes<HTMLFormElement>;
}

/**
 * The property filter form. A plain GET form: the URL is the state, it works
 * without JavaScript, and the browser back button restores previous
 * searches. Rendered once in the desktop sidebar and once inside the mobile
 * drawer (with different id prefixes).
 */
export function FilterForm({ filters, idPrefix, className, formProps }: FilterFormProps) {
  const id = (name: string) => `${idPrefix}-${name}`;
  const labelClass = "block text-base font-bold text-ink";

  return (
    <form
      method="get"
      action="/properties"
      aria-label="Filter properties"
      className={cn("flex flex-col gap-5", className)}
      {...formProps}
    >
      {/* Preserve the chosen results view across filter changes. */}
      {filters.view !== "list" ? (
        <input type="hidden" name={filterParamKeys.view} value={filters.view} />
      ) : null}

      <div>
        <label htmlFor={id("area")} className={labelClass}>
          Peterborough area
        </label>
        <Select id={id("area")} name={filterParamKeys.area} defaultValue={filters.area ?? ""} className="mt-1.5">
          <option value="">All of Peterborough</option>
          {areas.map((area) => (
            <option key={area.key} value={area.key}>
              {area.name} ({area.outwardPostcode})
            </option>
          ))}
        </Select>
      </div>

      <fieldset className="grid grid-cols-2 gap-3">
        <legend className={cn(labelClass, "mb-1.5")}>Monthly rent (£)</legend>
        <div>
          <label htmlFor={id("min")} className="block text-sm font-bold text-stone">
            Minimum
          </label>
          <Input
            id={id("min")}
            name={filterParamKeys.minRent}
            type="number"
            inputMode="numeric"
            min={0}
            step={25}
            placeholder="Any"
            defaultValue={filters.minRent ?? ""}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor={id("max")} className="block text-sm font-bold text-stone">
            Maximum
          </label>
          <Input
            id={id("max")}
            name={filterParamKeys.maxRent}
            type="number"
            inputMode="numeric"
            min={0}
            step={25}
            placeholder="Any"
            defaultValue={filters.maxRent ?? ""}
            className="mt-1"
          />
        </div>
      </fieldset>

      <div>
        <label htmlFor={id("beds")} className={labelClass}>
          Bedrooms
        </label>
        <Select id={id("beds")} name={filterParamKeys.bedrooms} defaultValue={filters.bedrooms ?? ""} className="mt-1.5">
          <option value="">Any number</option>
          {bedroomOptions.map((n) => (
            <option key={n} value={n}>
              {n}+ bedroom{n === 1 ? "" : "s"}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label htmlFor={id("type")} className={labelClass}>
          Property type
        </label>
        <Select id={id("type")} name={filterParamKeys.type} defaultValue={filters.type ?? ""} className="mt-1.5">
          <option value="">Any type</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {propertyTypeLabels[type]}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label htmlFor={id("availability")} className={labelClass}>
          Availability
        </label>
        <Select
          id={id("availability")}
          name={filterParamKeys.availability}
          defaultValue={filters.availability === "any" ? "" : filters.availability}
          className="mt-1.5"
        >
          {availabilityOptions.map((option) => (
            <option key={option} value={option === "any" ? "" : option}>
              {availabilityLabels[option]}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button type="submit">Apply filters</Button>
        <Link
          href="/properties"
          className="inline-flex min-h-11 items-center rounded-md px-3 font-bold text-brick underline underline-offset-4 hover:text-brick-deep"
        >
          Reset
        </Link>
      </div>
    </form>
  );
}
