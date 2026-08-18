import { isAreaKey } from "./areas";
import { propertyTypes, type Listing, type PropertyType } from "./types";

/**
 * Property-search filter model. The URL is the source of truth: the page
 * parses `searchParams` into `ListingFilters`, renders the form with those
 * values, and links (reset, view toggle, pagination later) are built with
 * `toSearchParams`. Works with or without JavaScript because the filter form
 * is a plain GET form.
 */

export const availabilityOptions = ["any", "now", "soon", "let-agreed", "let"] as const;
export type AvailabilityFilter = (typeof availabilityOptions)[number];

export const availabilityLabels: Record<AvailabilityFilter, string> = {
  any: "Any availability",
  now: "Available now",
  soon: "Coming soon",
  "let-agreed": "Let agreed",
  let: "Currently let",
};

export const bedroomOptions = [1, 2, 3, 4] as const;

export const viewOptions = ["list", "map"] as const;
export type ResultsView = (typeof viewOptions)[number];

export interface ListingFilters {
  /** Area key or null for all of Peterborough. */
  readonly area: string | null;
  readonly minRent: number | null;
  readonly maxRent: number | null;
  /** Minimum bedrooms (N or more) or null. */
  readonly bedrooms: number | null;
  readonly type: PropertyType | null;
  readonly availability: AvailabilityFilter;
  readonly view: ResultsView;
}

export const emptyFilters: ListingFilters = {
  area: null,
  minRent: null,
  maxRent: null,
  bedrooms: null,
  type: null,
  availability: "any",
  view: "list",
};

/** Query-string keys — kept short and stable because they appear in shared URLs. */
export const filterParamKeys = {
  area: "area",
  minRent: "min",
  maxRent: "max",
  bedrooms: "beds",
  type: "type",
  availability: "availability",
  view: "view",
} as const;

export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseMoney(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

/** Parse raw URL search params into a validated filter object. Unknown values fall back to defaults. */
export function parseFilters(raw: RawSearchParams | URLSearchParams): ListingFilters {
  const get = (key: string): string | undefined =>
    raw instanceof URLSearchParams ? (raw.get(key) ?? undefined) : first(raw[key]);

  const areaRaw = get(filterParamKeys.area);
  const typeRaw = get(filterParamKeys.type);
  const bedsRaw = Number(get(filterParamKeys.bedrooms));
  const availabilityRaw = get(filterParamKeys.availability);
  const viewRaw = get(filterParamKeys.view);

  let minRent = parseMoney(get(filterParamKeys.minRent));
  let maxRent = parseMoney(get(filterParamKeys.maxRent));
  // A reversed range is a visitor mistake, not an error: swap rather than return nothing.
  if (minRent !== null && maxRent !== null && minRent > maxRent) {
    [minRent, maxRent] = [maxRent, minRent];
  }

  return {
    area: areaRaw && isAreaKey(areaRaw) ? areaRaw : null,
    minRent,
    maxRent,
    bedrooms: (bedroomOptions as readonly number[]).includes(bedsRaw) ? bedsRaw : null,
    type: (propertyTypes as readonly string[]).includes(typeRaw ?? "") ? (typeRaw as PropertyType) : null,
    availability: (availabilityOptions as readonly string[]).includes(availabilityRaw ?? "")
      ? (availabilityRaw as AvailabilityFilter)
      : "any",
    view: (viewOptions as readonly string[]).includes(viewRaw ?? "") ? (viewRaw as ResultsView) : "list",
  };
}

/** Serialise filters back to URLSearchParams (defaults omitted so URLs stay clean). */
export function toSearchParams(filters: Partial<ListingFilters>): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.area) params.set(filterParamKeys.area, filters.area);
  if (filters.minRent) params.set(filterParamKeys.minRent, String(filters.minRent));
  if (filters.maxRent) params.set(filterParamKeys.maxRent, String(filters.maxRent));
  if (filters.bedrooms) params.set(filterParamKeys.bedrooms, String(filters.bedrooms));
  if (filters.type) params.set(filterParamKeys.type, filters.type);
  if (filters.availability && filters.availability !== "any") {
    params.set(filterParamKeys.availability, filters.availability);
  }
  if (filters.view && filters.view !== "list") params.set(filterParamKeys.view, filters.view);
  return params;
}

/** "/properties?area=fletton&view=map" */
export function propertiesHref(filters: Partial<ListingFilters>, basePath = "/properties"): string {
  const qs = toSearchParams(filters).toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Number of non-default filters (view is presentation, not a filter). */
export function countActiveFilters(filters: ListingFilters): number {
  let n = 0;
  if (filters.area) n += 1;
  if (filters.minRent) n += 1;
  if (filters.maxRent) n += 1;
  if (filters.bedrooms) n += 1;
  if (filters.type) n += 1;
  if (filters.availability !== "any") n += 1;
  return n;
}

export function matchesFilters(listing: Listing, filters: ListingFilters): boolean {
  if (filters.area && listing.location.area !== filters.area) return false;
  // Unknown rent / bedrooms never satisfy a rent or bedroom filter (nothing is guessed).
  if (filters.minRent !== null && (listing.pricing.rentPcm === null || listing.pricing.rentPcm < filters.minRent)) return false;
  if (filters.maxRent !== null && (listing.pricing.rentPcm === null || listing.pricing.rentPcm > filters.maxRent)) return false;
  if (filters.bedrooms !== null && (listing.property.bedrooms === null || listing.property.bedrooms < filters.bedrooms)) return false;
  if (filters.type && listing.property.type !== filters.type) return false;
  switch (filters.availability) {
    case "now":
      if (listing.status !== "available") return false;
      break;
    case "soon":
      if (listing.status !== "coming-soon") return false;
      break;
    case "let-agreed":
      if (listing.status !== "let-agreed") return false;
      break;
    case "let":
      if (listing.status !== "let") return false;
      break;
    default:
      break;
  }
  return true;
}

/** Filter, then order: available first, then coming soon, then let agreed; within a group by rent ascending. */
export function applyFilters(listings: readonly Listing[], filters: ListingFilters): Listing[] {
  const rank: Record<Listing["status"], number> = { available: 0, "coming-soon": 1, "let-agreed": 2, let: 3 };
  return listings
    .filter((l) => matchesFilters(l, filters))
    .sort(
      (a, b) =>
        rank[a.status] - rank[b.status] ||
        (a.pricing.rentPcm ?? Number.POSITIVE_INFINITY) - (b.pricing.rentPcm ?? Number.POSITIVE_INFINITY) ||
        a.title.localeCompare(b.title),
    );
}
