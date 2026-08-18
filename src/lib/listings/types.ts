/**
 * Public-safe listing contract (data/CMS-AND-LISTING-MODELS.md → "Property
 * listing", public-safe fields only). Restricted fields — full address,
 * access notes, security information, landlord/tenant details — are NOT part
 * of this type and must never be added to it: the public page payload is
 * built from this contract alone.
 *
 * A future CMS or property-management adapter maps its records onto this
 * shape; nothing in the UI depends on where the data came from.
 */

export const propertyTypes = [
  "terraced-house",
  "semi-detached-house",
  "detached-house",
  "apartment",
  "bungalow",
] as const;
export type PropertyType = (typeof propertyTypes)[number];

export const propertyTypeLabels: Record<PropertyType, string> = {
  "terraced-house": "Terraced house",
  "semi-detached-house": "Semi-detached house",
  "detached-house": "Detached house",
  apartment: "Apartment",
  bungalow: "Bungalow",
};

export const furnishingOptions = ["furnished", "part-furnished", "unfurnished"] as const;
export type Furnishing = (typeof furnishingOptions)[number];

export const furnishingLabels: Record<Furnishing, string> = {
  furnished: "Furnished",
  "part-furnished": "Part-furnished",
  unfurnished: "Unfurnished",
};

/**
 * Publication status of a listing. "let" is a home in the managed portfolio that is
 * currently occupied — shown so visitors can see the kind of homes Red Brick lets and
 * register interest, never as available.
 */
export const listingStatuses = ["available", "coming-soon", "let-agreed", "let"] as const;
export type ListingStatus = (typeof listingStatuses)[number];

export const listingStatusLabels: Record<ListingStatus, string> = {
  available: "Available",
  "coming-soon": "Coming soon",
  "let-agreed": "Let agreed",
  let: "Currently let",
};

/**
 * A fact that is only shown to the public when it has been verified against
 * a document (EPC certificate, council-tax record, tenancy terms). `null`
 * means "not verified — do not display", never "unknown, show a guess".
 */
export interface VerifiedFact<T> {
  readonly value: T;
  /** ISO date the fact was checked against its source. */
  readonly verifiedOn: string;
  /** Short description of the source checked, e.g. "EPC register". */
  readonly source: string;
}

export interface Listing {
  /** Stable public reference, e.g. DEMO-RBL-001. */
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly description: string;
  /** True only for fictional demonstration records; portfolio records set false. */
  readonly demoOnly: boolean;
  /** Where the record came from, for the honesty line under the listing (e.g. "EPC register; agency records, 18/08/2026"). */
  readonly source: string | null;
  readonly status: ListingStatus;
  /** ISO date; null when not yet known. */
  readonly availableFrom: string | null;

  readonly location: {
    /** Key into the area registry (src/lib/listings/areas.ts). */
    readonly area: string;
    /** Outward postcode only, e.g. PE2. */
    readonly outwardPostcode: string;
    /** Approximate public coordinates — never the exact home. */
    readonly approximateLatitude: number;
    readonly approximateLongitude: number;
  };

  readonly property: {
    readonly type: PropertyType;
    /** null = not yet confirmed from a document — shown as "to be confirmed", never guessed. */
    readonly bedrooms: number | null;
    readonly bathrooms: number | null;
    readonly receptionRooms: number | null;
    readonly furnishing: Furnishing | null;
    readonly sizeSqM: number | null;
  };

  readonly pricing: {
    /** null = rent on application (not published until confirmed). */
    readonly rentPcm: number | null;
    /** Tenancy deposit — shown only when verified against tenancy terms. */
    readonly deposit: VerifiedFact<number> | null;
    readonly holdingDeposit: VerifiedFact<number> | null;
    /** null = not stated in any document (row omitted), never assumed. */
    readonly billsIncluded: boolean | null;
  };

  /** Shown only when verified (see VerifiedFact). */
  readonly councilTaxBand: VerifiedFact<string> | null;
  readonly epcRating: VerifiedFact<string> | null;

  /** Verified, public-safe features. */
  readonly features: readonly string[];

  readonly media: {
    /**
     * Demonstration listings never carry photographs: no AI or stock image
     * may be represented as a real listing. A live adapter supplies approved
     * photographs of the actual property.
     */
    readonly cover: { readonly kind: "placeholder"; readonly alt: string };
  };
}

export interface ListingSummaryCounts {
  readonly total: number;
  readonly shown: number;
}
