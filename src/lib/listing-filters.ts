import {
  propertyTypeLabels,
  type PropertyType,
  type PublicListing,
} from "@/data/contracts/listing";

/**
 * Pure property-search filter logic for /properties.
 *
 * Everything here is framework-free so the same rules run in the server page
 * (reading `searchParams`) and in unit tests. Parsing is deliberately tolerant:
 * bad or hostile input degrades to "no filter" rather than throwing.
 *
 * Launch filter set only (MASTER-BUILD-BRIEF § Properties): area or postcode,
 * min/max monthly rent, bedrooms, property type and availability.
 */

/** Anything that behaves like Next's awaited `searchParams` or a URLSearchParams. */
export type SearchParamsInput =
  URLSearchParams | Readonly<Record<string, string | readonly string[] | undefined>>;

/** 1–3 mean exactly that many bedrooms; 4 means four or more. */
export type BedroomsFilter = 1 | 2 | 3 | 4;

export type AvailabilityFilter = "any" | "now" | "from";

export interface ListingFilters {
  /** Free text matched against the public area or outward postcode. "" = no filter. */
  readonly area: string;
  readonly minRent: number | null;
  readonly maxRent: number | null;
  readonly bedrooms: BedroomsFilter | null;
  readonly type: PropertyType | null;
  readonly availability: AvailabilityFilter;
  /** ISO calendar date (YYYY-MM-DD). Only meaningful when availability is "from". */
  readonly availableFrom: string | null;
}

/** Query-string keys — the form field names and the URL contract for the page. */
export const FILTER_PARAMS = {
  area: "area",
  minRent: "minRent",
  maxRent: "maxRent",
  bedrooms: "bedrooms",
  type: "type",
  availability: "availability",
  availableFrom: "availableFrom",
} as const;

export const EMPTY_FILTERS: ListingFilters = {
  area: "",
  minRent: null,
  maxRent: null,
  bedrooms: null,
  type: null,
  availability: "any",
  availableFrom: null,
};

/** The largest bedroom value in the select; it means "this many or more". */
export const BEDROOMS_PLUS = 4;

export const bedroomOptions: readonly { value: string; label: string }[] = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: String(BEDROOMS_PLUS), label: `${BEDROOMS_PLUS}+` },
];

export const availabilityOptions: readonly { value: AvailabilityFilter; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "now", label: "Available now" },
  { value: "from", label: "Available from a date" },
];

const propertyTypeKeys = Object.keys(propertyTypeLabels) as PropertyType[];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

function readParam(input: SearchParamsInput, key: string): string | null {
  if (input instanceof URLSearchParams) {
    return input.get(key);
  }
  const value = input[key];
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === "string" ? first : null;
  }
  return typeof value === "string" ? value : null;
}

/** Collapses whitespace and trims; caps length so nothing silly reaches the page. */
function normaliseText(value: string | null): string {
  if (!value) return "";
  return value.replace(/\s+/g, " ").trim().slice(0, 60);
}

/** Accepts "1100", "£1,100", " 1100.00 " → 1100. Rejects negatives and nonsense. */
function parseMoney(value: string | null): number | null {
  if (value == null) return null;
  const cleaned = value.replace(/[£,\s]/g, "");
  if (cleaned === "" || !/^\d+(\.\d+)?$/.test(cleaned)) return null;
  const amount = Math.round(Number(cleaned));
  if (!Number.isFinite(amount) || amount < 0 || amount > 1_000_000) return null;
  return amount;
}

function parseBedrooms(value: string | null): BedroomsFilter | null {
  if (value == null) return null;
  const cleaned = value.trim().toLowerCase();
  if (cleaned === "") return null;
  if (cleaned === `${BEDROOMS_PLUS}+` || cleaned === `${BEDROOMS_PLUS}plus`) return BEDROOMS_PLUS;
  if (!/^\d+$/.test(cleaned)) return null;
  const n = Number(cleaned);
  if (n >= BEDROOMS_PLUS) return BEDROOMS_PLUS;
  if (n === 1 || n === 2 || n === 3) return n;
  return null;
}

function parseType(value: string | null): PropertyType | null {
  if (value == null) return null;
  const cleaned = value.trim().toLowerCase();
  return propertyTypeKeys.find((key) => key === cleaned) ?? null;
}

function parseAvailability(value: string | null): AvailabilityFilter {
  const cleaned = value?.trim().toLowerCase();
  if (cleaned === "now" || cleaned === "from") return cleaned;
  return "any";
}

function parseIsoDate(value: string | null): string | null {
  if (value == null) return null;
  const cleaned = value.trim();
  if (!ISO_DATE.test(cleaned)) return null;
  const date = new Date(`${cleaned}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  // Reject impossible dates such as 2026-02-31 that Date silently rolls over.
  return date.toISOString().slice(0, 10) === cleaned ? cleaned : null;
}

/**
 * Turns raw search params into a typed, normalised filter set. Never throws.
 * A valid date with no availability mode is treated as "available from that
 * date" so a visitor who fills the date and forgets the select still gets what
 * they meant.
 */
export function parseFilters(input: SearchParamsInput): ListingFilters {
  const availableFromRaw = parseIsoDate(readParam(input, FILTER_PARAMS.availableFrom));
  let availability = parseAvailability(readParam(input, FILTER_PARAMS.availability));
  if (availability === "any" && availableFromRaw) availability = "from";

  return {
    area: normaliseText(readParam(input, FILTER_PARAMS.area)),
    minRent: parseMoney(readParam(input, FILTER_PARAMS.minRent)),
    maxRent: parseMoney(readParam(input, FILTER_PARAMS.maxRent)),
    bedrooms: parseBedrooms(readParam(input, FILTER_PARAMS.bedrooms)),
    type: parseType(readParam(input, FILTER_PARAMS.type)),
    availability,
    availableFrom: availability === "from" ? availableFromRaw : null,
  };
}

// ---------------------------------------------------------------------------
// Applying
// ---------------------------------------------------------------------------

export interface ApplyFiltersOptions {
  /** Reference "today" for availability checks (defaults to the current date). */
  readonly now?: Date;
}

function toIsoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function matchesArea(listing: PublicListing, query: string): boolean {
  if (query === "") return true;
  const q = query.toLowerCase();
  const compact = q.replace(/\s+/g, "");
  const area = listing.location.publicArea.toLowerCase();
  const postcode = listing.location.outwardPostcode.toLowerCase();
  return (
    area.includes(q) ||
    area.replace(/\s+/g, "").includes(compact) ||
    postcode.includes(compact) ||
    postcode === compact
  );
}

function matchesBedrooms(listing: PublicListing, bedrooms: BedroomsFilter | null): boolean {
  if (bedrooms === null) return true;
  if (bedrooms === BEDROOMS_PLUS) return listing.property.bedrooms >= BEDROOMS_PLUS;
  return listing.property.bedrooms === bedrooms;
}

/**
 * Availability is judged only on a published `availableFrom` date. A null
 * date can never satisfy "Available now" or "Available from" — an unknown
 * date is not an available home. Demonstration fixtures therefore always
 * return an honest empty result for these modes.
 */
function matchesAvailability(
  listing: PublicListing,
  filters: ListingFilters,
  todayIso: string,
): boolean {
  if (filters.availability === "any") return true;
  const from = listing.availability.availableFrom;
  if (!from) return false;
  const fromDay = parseIsoDate(from.slice(0, 10));
  if (!fromDay) return false;
  if (filters.availability === "now") return fromDay <= todayIso;
  // "from": the home must be available on or before the visitor's move-in date.
  if (filters.availableFrom) return fromDay <= filters.availableFrom;
  return true;
}

export function applyFilters(
  listings: readonly PublicListing[],
  filters: ListingFilters,
  options: ApplyFiltersOptions = {},
): PublicListing[] {
  const todayIso = toIsoDay(options.now ?? new Date());
  return listings.filter((listing) => {
    if (!matchesArea(listing, filters.area)) return false;
    const rent = listing.pricing.rentPcm;
    if (filters.minRent !== null && rent < filters.minRent) return false;
    if (filters.maxRent !== null && rent > filters.maxRent) return false;
    if (!matchesBedrooms(listing, filters.bedrooms)) return false;
    if (filters.type !== null && listing.property.type !== filters.type) return false;
    return matchesAvailability(listing, filters, todayIso);
  });
}

// ---------------------------------------------------------------------------
// Describing / serialising
// ---------------------------------------------------------------------------

/** Number of filter groups the visitor has set (date counts within availability). */
export function countActiveFilters(filters: ListingFilters): number {
  let count = 0;
  if (filters.area !== "") count += 1;
  if (filters.minRent !== null) count += 1;
  if (filters.maxRent !== null) count += 1;
  if (filters.bedrooms !== null) count += 1;
  if (filters.type !== null) count += 1;
  if (filters.availability !== "any") count += 1;
  return count;
}

export function hasActiveFilters(filters: ListingFilters): boolean {
  return countActiveFilters(filters) > 0;
}

/** Only active values are serialised, so URLs stay short and shareable. */
export function filtersToSearchParams(filters: ListingFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.area !== "") params.set(FILTER_PARAMS.area, filters.area);
  if (filters.minRent !== null) params.set(FILTER_PARAMS.minRent, String(filters.minRent));
  if (filters.maxRent !== null) params.set(FILTER_PARAMS.maxRent, String(filters.maxRent));
  if (filters.bedrooms !== null) params.set(FILTER_PARAMS.bedrooms, String(filters.bedrooms));
  if (filters.type !== null) params.set(FILTER_PARAMS.type, filters.type);
  if (filters.availability !== "any") {
    params.set(FILTER_PARAMS.availability, filters.availability);
    if (filters.availability === "from" && filters.availableFrom) {
      params.set(FILTER_PARAMS.availableFrom, filters.availableFrom);
    }
  }
  return params;
}

/**
 * Builds a /properties query string from the filters plus optional page-state
 * params (view, selected). Returns "" when nothing is set.
 */
export function buildPropertiesQuery(
  filters: ListingFilters,
  extra: { view?: "list" | "map"; selected?: string | null } = {},
): string {
  const params = filtersToSearchParams(filters);
  if (extra.view === "map") params.set("view", "map");
  if (extra.selected) params.set("selected", extra.selected);
  const query = params.toString();
  return query ? `?${query}` : "";
}
