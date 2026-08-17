import type { Listing } from "./types";

/**
 * DEMONSTRATION LISTINGS — every record is fictional and exists only to
 * exercise the search, filters, map and detail templates. None is a Red
 * Brick property, none is available, and every one renders with the visible
 * label from src/content/demo-labels.ts. Never add a real address, a real
 * photograph or a real person here.
 *
 * `null` in a VerifiedFact field means "not verified — not displayed", which
 * lets the templates prove they hide unverified data.
 */

const cover = (alt: string): Listing["media"] => ({ cover: { kind: "placeholder", alt } });

export const demoListings: readonly Listing[] = [
  {
    id: "DEMO-RBL-001",
    slug: "demo-two-bedroom-terrace-fletton",
    title: "Two-bedroom terraced house, Fletton",
    summary: "A fictional example of a compact two-bedroom terrace with a small rear garden.",
    description:
      "This is a demonstration record used to show how a real property page will read. Every fact here is invented for layout and testing and would be replaced only with approved information about a genuine home.",
    demoOnly: true,
    status: "available",
    availableFrom: "2026-09-07",
    location: { area: "fletton", outwardPostcode: "PE2", approximateLatitude: 52.561, approximateLongitude: -0.242 },
    property: { type: "terraced-house", bedrooms: 2, bathrooms: 1, receptionRooms: 1, furnishing: "unfurnished", sizeSqM: 68 },
    pricing: {
      rentPcm: 1100,
      deposit: { value: 1269, verifiedOn: "2026-08-01", source: "Demonstration tenancy terms" },
      holdingDeposit: { value: 253, verifiedOn: "2026-08-01", source: "Demonstration tenancy terms" },
      billsIncluded: false,
    },
    councilTaxBand: { value: "B", verifiedOn: "2026-08-01", source: "Demonstration council-tax record" },
    epcRating: { value: "C", verifiedOn: "2026-08-01", source: "Demonstration EPC register entry" },
    features: ["Enclosed rear garden", "Separate kitchen", "Gas central heating", "Double glazing"],
    media: cover("Placeholder illustration of a two-bedroom terraced house — demonstration listing, not a real property"),
  },
  {
    id: "DEMO-RBL-002",
    slug: "demo-three-bedroom-semi-werrington",
    title: "Three-bedroom semi-detached house, Werrington",
    summary: "A fictional family-home example with two reception rooms and off-road parking.",
    description:
      "A demonstration record for comparing property types and bedroom filters. The layout, costs and features are invented and carry no relation to any real Werrington home.",
    demoOnly: true,
    status: "available",
    availableFrom: "2026-09-21",
    location: { area: "werrington", outwardPostcode: "PE4", approximateLatitude: 52.611, approximateLongitude: -0.263 },
    property: { type: "semi-detached-house", bedrooms: 3, bathrooms: 1, receptionRooms: 2, furnishing: "unfurnished", sizeSqM: 92 },
    pricing: {
      rentPcm: 1350,
      deposit: { value: 1557, verifiedOn: "2026-08-01", source: "Demonstration tenancy terms" },
      holdingDeposit: { value: 311, verifiedOn: "2026-08-01", source: "Demonstration tenancy terms" },
      billsIncluded: false,
    },
    councilTaxBand: { value: "C", verifiedOn: "2026-08-01", source: "Demonstration council-tax record" },
    epcRating: null,
    features: ["Garden", "Off-road parking", "Two reception rooms", "Downstairs cloakroom"],
    media: cover("Placeholder illustration of a semi-detached house — demonstration listing, not a real property"),
  },
  {
    id: "DEMO-RBL-003",
    slug: "demo-one-bedroom-apartment-central",
    title: "One-bedroom apartment, Central Peterborough",
    summary: "A fictional city-centre apartment example, part-furnished.",
    description:
      "A demonstration record for the apartment property type. Nothing here describes a real building or a real tenancy.",
    demoOnly: true,
    status: "available",
    availableFrom: "2026-08-31",
    location: { area: "central", outwardPostcode: "PE1", approximateLatitude: 52.574, approximateLongitude: -0.245 },
    property: { type: "apartment", bedrooms: 1, bathrooms: 1, receptionRooms: 1, furnishing: "part-furnished", sizeSqM: 48 },
    pricing: {
      rentPcm: 900,
      deposit: { value: 1038, verifiedOn: "2026-08-01", source: "Demonstration tenancy terms" },
      holdingDeposit: null,
      billsIncluded: false,
    },
    councilTaxBand: null,
    epcRating: { value: "B", verifiedOn: "2026-08-01", source: "Demonstration EPC register entry" },
    features: ["Open-plan living area", "Secure entry", "Central location"],
    media: cover("Placeholder illustration of an apartment building — demonstration listing, not a real property"),
  },
  {
    id: "DEMO-RBL-004",
    slug: "demo-two-bedroom-bungalow-bretton",
    title: "Two-bedroom bungalow, Bretton",
    summary: "A fictional single-storey home example with a level garden.",
    description:
      "A demonstration record for the bungalow property type and the 'coming soon' status. Every detail is invented.",
    demoOnly: true,
    status: "coming-soon",
    availableFrom: "2026-11-02",
    location: { area: "bretton", outwardPostcode: "PE3", approximateLatitude: 52.591, approximateLongitude: -0.288 },
    property: { type: "bungalow", bedrooms: 2, bathrooms: 1, receptionRooms: 1, furnishing: "unfurnished", sizeSqM: 74 },
    pricing: { rentPcm: 1200, deposit: null, holdingDeposit: null, billsIncluded: false },
    councilTaxBand: null,
    epcRating: null,
    features: ["Level access", "Garden", "Driveway"],
    media: cover("Placeholder illustration of a bungalow — demonstration listing, not a real property"),
  },
  {
    id: "DEMO-RBL-005",
    slug: "demo-four-bedroom-detached-hampton",
    title: "Four-bedroom detached house, Hampton",
    summary: "A fictional larger family-home example with a garage.",
    description:
      "A demonstration record at the upper end of the rent range, used to test the maximum-rent filter. Invented throughout.",
    demoOnly: true,
    status: "available",
    availableFrom: "2026-10-12",
    location: { area: "hampton", outwardPostcode: "PE7", approximateLatitude: 52.536, approximateLongitude: -0.252 },
    property: { type: "detached-house", bedrooms: 4, bathrooms: 2, receptionRooms: 2, furnishing: "unfurnished", sizeSqM: 128 },
    pricing: {
      rentPcm: 1750,
      deposit: { value: 2019, verifiedOn: "2026-08-01", source: "Demonstration tenancy terms" },
      holdingDeposit: { value: 403, verifiedOn: "2026-08-01", source: "Demonstration tenancy terms" },
      billsIncluded: false,
    },
    councilTaxBand: { value: "E", verifiedOn: "2026-08-01", source: "Demonstration council-tax record" },
    epcRating: { value: "B", verifiedOn: "2026-08-01", source: "Demonstration EPC register entry" },
    features: ["Garage", "En-suite to main bedroom", "Enclosed garden", "Utility room"],
    media: cover("Placeholder illustration of a detached house — demonstration listing, not a real property"),
  },
  {
    id: "DEMO-RBL-006",
    slug: "demo-two-bedroom-apartment-woodston",
    title: "Two-bedroom apartment, Woodston",
    summary: "A fictional furnished apartment example.",
    description:
      "A demonstration record for the furnished filter and the apartment type. Invented throughout.",
    demoOnly: true,
    status: "available",
    availableFrom: "2026-09-14",
    location: { area: "woodston", outwardPostcode: "PE2", approximateLatitude: 52.564, approximateLongitude: -0.26 },
    property: { type: "apartment", bedrooms: 2, bathrooms: 1, receptionRooms: 1, furnishing: "furnished", sizeSqM: 61 },
    pricing: {
      rentPcm: 1050,
      deposit: { value: 1211, verifiedOn: "2026-08-01", source: "Demonstration tenancy terms" },
      holdingDeposit: { value: 242, verifiedOn: "2026-08-01", source: "Demonstration tenancy terms" },
      billsIncluded: false,
    },
    councilTaxBand: { value: "B", verifiedOn: "2026-08-01", source: "Demonstration council-tax record" },
    epcRating: { value: "C", verifiedOn: "2026-08-01", source: "Demonstration EPC register entry" },
    features: ["Furnished", "Allocated parking space", "Balcony"],
    media: cover("Placeholder illustration of an apartment — demonstration listing, not a real property"),
  },
  {
    id: "DEMO-RBL-007",
    slug: "demo-three-bedroom-terrace-stanground",
    title: "Three-bedroom terraced house, Stanground",
    summary: "A fictional example whose tenancy has been agreed — shown as 'let agreed'.",
    description:
      "A demonstration record for the 'let agreed' status so the templates can show a home that is no longer available without deleting it. Invented throughout.",
    demoOnly: true,
    status: "let-agreed",
    availableFrom: null,
    location: { area: "stanground", outwardPostcode: "PE2", approximateLatitude: 52.559, approximateLongitude: -0.214 },
    property: { type: "terraced-house", bedrooms: 3, bathrooms: 1, receptionRooms: 1, furnishing: "unfurnished", sizeSqM: 84 },
    pricing: { rentPcm: 1250, deposit: null, holdingDeposit: null, billsIncluded: false },
    councilTaxBand: null,
    epcRating: null,
    features: ["Garden", "Two double bedrooms", "Close to schools"],
    media: cover("Placeholder illustration of a terraced house — demonstration listing, not a real property"),
  },
  {
    id: "DEMO-RBL-008",
    slug: "demo-three-bedroom-semi-paston",
    title: "Three-bedroom semi-detached house, Paston",
    summary: "A fictional part-furnished family home example.",
    description:
      "A demonstration record used to test the area filter for PE4 alongside Werrington. Invented throughout.",
    demoOnly: true,
    status: "available",
    availableFrom: "2026-10-05",
    location: { area: "paston", outwardPostcode: "PE4", approximateLatitude: 52.604, approximateLongitude: -0.236 },
    property: { type: "semi-detached-house", bedrooms: 3, bathrooms: 2, receptionRooms: 1, furnishing: "part-furnished", sizeSqM: 90 },
    pricing: {
      rentPcm: 1300,
      deposit: { value: 1500, verifiedOn: "2026-08-01", source: "Demonstration tenancy terms" },
      holdingDeposit: { value: 300, verifiedOn: "2026-08-01", source: "Demonstration tenancy terms" },
      billsIncluded: false,
    },
    councilTaxBand: { value: "C", verifiedOn: "2026-08-01", source: "Demonstration council-tax record" },
    epcRating: { value: "D", verifiedOn: "2026-08-01", source: "Demonstration EPC register entry" },
    features: ["Garden", "Driveway", "Conservatory"],
    media: cover("Placeholder illustration of a semi-detached house — demonstration listing, not a real property"),
  },
];
