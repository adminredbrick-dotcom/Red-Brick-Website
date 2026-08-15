import sample from "../../../data/sample-properties.json";

import type {
  Furnishing,
  ListingStatus,
  PropertyType,
  PublicListing,
} from "@/data/contracts/listing";
import { DEMO_LISTING_LABEL } from "@/content/demo-labels";
import type { ListingsRepository } from "@/data/repositories/listings";

/**
 * Demo adapter over data/sample-properties.json (fictional fixtures).
 *
 * Every record is whitelisted field-by-field into PublicListing so that no
 * restricted key can ever leak through, and every record is forced to
 * demoOnly with the visible illustrative label.
 */

type RawProperty = (typeof sample.properties)[number];

function toPublicListing(raw: RawProperty): PublicListing {
  return {
    id: raw.id,
    slug: raw.slug,
    demoOnly: true,
    status: (raw.status as ListingStatus) ?? "illustrative",
    featured: Boolean(raw.featured),
    title: raw.title,
    summary: raw.summary,
    description: raw.description,
    location: {
      publicArea: raw.location.publicArea,
      outwardPostcode: raw.location.outwardPostcode,
      approximateLatitude: raw.location.approximateLatitude,
      approximateLongitude: raw.location.approximateLongitude,
      showExactLocation: false,
    },
    pricing: {
      rentPcm: raw.pricing.rentPcm,
      deposit: raw.pricing.deposit ?? null,
      holdingDeposit: raw.pricing.holdingDeposit ?? null,
      billsIncluded: Boolean(raw.pricing.billsIncluded),
      councilTaxBand: raw.pricing.councilTaxBand ?? null,
    },
    availability: {
      availableFrom: raw.availability.availableFrom ?? null,
      furnished: raw.availability.furnished as Furnishing,
      viewingStatus: raw.availability.viewingStatus,
    },
    property: {
      type: raw.property.type as PropertyType,
      bedrooms: raw.property.bedrooms,
      bathrooms: raw.property.bathrooms,
      receptionRooms: raw.property.receptionRooms ?? null,
      sizeSqFt: raw.property.sizeSqFt ?? null,
    },
    features: [...raw.features],
    materialInformation: {
      epcRating: raw.materialInformation.epcRating ?? null,
      parkingNote: raw.materialInformation.parkingNote ?? null,
      broadbandNote: raw.materialInformation.broadbandNote ?? null,
      mobileSignalNote: raw.materialInformation.mobileSignalNote ?? null,
    },
    media: {
      // No approved photographs exist for fixtures; never substitute stock/AI.
      coverImage: null,
      coverAlt: raw.media.coverAlt,
      gallery: [],
    },
    publishing: {
      label: raw.publishing.label ?? DEMO_LISTING_LABEL,
      reviewedAt: raw.publishing.reviewedAt ?? null,
    },
  };
}

const listings: readonly PublicListing[] = sample.properties.map(toPublicListing);

export const demoListingsRepository: ListingsRepository = {
  source: "demo",
  async list() {
    return listings;
  },
  async bySlug(slug) {
    return listings.find((listing) => listing.slug === slug) ?? null;
  },
};
