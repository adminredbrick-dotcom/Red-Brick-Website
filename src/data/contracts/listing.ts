/**
 * Public-safe listing contract.
 *
 * Only these fields may ever reach a public page payload. Restricted data
 * (full address where not approved, access notes, alarm/key/security details,
 * landlord/tenant information, internal notes) is deliberately absent from
 * this type — adapters must whitelist into it, never spread a source record.
 * See data/CMS-AND-LISTING-MODELS.md.
 */

export type ListingStatus = "illustrative" | "available" | "let-agreed" | "let" | "withdrawn";

export type PropertyType =
  | "terraced-house"
  | "semi-detached-house"
  | "detached-house"
  | "apartment"
  | "bungalow"
  | "maisonette"
  | "room";

export type Furnishing = "unfurnished" | "part-furnished" | "furnished";

export interface PublicListing {
  readonly id: string;
  readonly slug: string;
  /** True for fixtures that must never be presented as genuine inventory. */
  readonly demoOnly: boolean;
  readonly status: ListingStatus;
  readonly featured: boolean;
  readonly title: string;
  readonly summary: string;
  readonly description: string;
  readonly location: {
    readonly publicArea: string;
    readonly outwardPostcode: string;
    /** Approximate coordinates for public display only. */
    readonly approximateLatitude: number;
    readonly approximateLongitude: number;
    readonly showExactLocation: boolean;
  };
  readonly pricing: {
    readonly rentPcm: number;
    readonly deposit: number | null;
    readonly holdingDeposit: number | null;
    readonly billsIncluded: boolean;
    readonly councilTaxBand: string | null;
  };
  readonly availability: {
    /** ISO date or null when unknown/not applicable. */
    readonly availableFrom: string | null;
    readonly furnished: Furnishing;
    readonly viewingStatus: string;
  };
  readonly property: {
    readonly type: PropertyType;
    readonly bedrooms: number;
    readonly bathrooms: number;
    readonly receptionRooms: number | null;
    readonly sizeSqFt: number | null;
  };
  readonly features: readonly string[];
  readonly materialInformation: {
    readonly epcRating: string | null;
    readonly parkingNote: string | null;
    readonly broadbandNote: string | null;
    readonly mobileSignalNote: string | null;
  };
  readonly media: {
    /** Null when no approved photograph exists — render a labelled placeholder. */
    readonly coverImage: string | null;
    readonly coverAlt: string;
    readonly gallery: readonly { readonly src: string; readonly alt: string }[];
  };
  readonly publishing: {
    /** Visible label, e.g. "Illustrative example — not currently available". */
    readonly label: string | null;
    readonly reviewedAt: string | null;
  };
}

/** Human-readable labels for property types. */
export const propertyTypeLabels: Record<PropertyType, string> = {
  "terraced-house": "Terraced house",
  "semi-detached-house": "Semi-detached house",
  "detached-house": "Detached house",
  apartment: "Apartment",
  bungalow: "Bungalow",
  maisonette: "Maisonette",
  room: "Room",
};

export const furnishingLabels: Record<Furnishing, string> = {
  unfurnished: "Unfurnished",
  "part-furnished": "Part-furnished",
  furnished: "Furnished",
};
