import type { MarketDataRepository } from "@/data/repositories/market-data";
import {
  describeConfidence,
  isEstimateSuppressed,
  type FigureMeta,
  type RentalReport,
  type RentalReportInput,
} from "@/data/contracts/rental-report";

export { describeConfidence, isEstimateSuppressed };

/**
 * Demo adapter — returns ONE fixed illustrative report whatever the input.
 *
 * Nothing here is market evidence. Every figure is marked
 * `kind: "illustrative"` with an "Illustrative sample data" source and no
 * URL, so it can never be mistaken for a live figure. The numbers are
 * obvious placeholders chosen only to show the layout of a real report.
 *
 * At least one module (rental demand) is deliberately returned in the honest
 * `unavailable` state so that the page's unavailable rendering is exercised.
 */

const SAMPLE_META: FigureMeta = {
  sourceName: "Illustrative sample data",
  sourceUrl: null,
  licence: null,
  observationDate: null,
  retrievalDate: null,
  geography: "Peterborough (sample area)",
  kind: "illustrative",
  modelVersion: null,
  quality: "unavailable",
  lastReviewed: null,
};

/** Peterborough City Council selective-licensing guidance (data/DATA-SOURCE-PLAN.md). */
export const PETERBOROUGH_SELECTIVE_LICENSING_URL =
  "https://www.peterborough.gov.uk/residents/housing/selective-licensing/selective-licensing-overview";

/** The fixed sample property that the illustrative report describes. */
export const DEMO_REPORT_INPUT: RentalReportInput = {
  addressOrPostcode: "Sample property, Peterborough (illustrative)",
  propertyType: "semi-detached-house",
  bedrooms: 3,
  bathrooms: 1,
  condition: "good",
  furnishing: "unfurnished",
  parking: true,
  garden: true,
  details: "Sample record used to show the report format.",
};

export const DEMO_REPORT_DISCLAIMER =
  "This is an indicative rental estimate. It is not a formal valuation, a guarantee of achievable rent, or financial advice. Property condition, specification, demand, tenancy terms and legal requirements can affect the final figure. Red Brick Lettings will confirm its recommendation after reviewing the property.";

function buildDemoReport(): RentalReport {
  return {
    id: "DEMO-RBL-REPORT-001",
    status: "ok",
    isDemo: true,
    generatedAt: "2026-08-15T09:00:00.000Z",
    modelVersion: null,
    input: DEMO_REPORT_INPUT,
    geography: "Peterborough (sample area)",

    indicativeRent: {
      status: "available",
      range: { low: 950, high: 1100, currency: "GBP", period: "pcm" },
      confidence: {
        level: "medium",
        comparableCount: 6,
        explanation: `${describeConfidence("medium")} In this sample the six comparables are placeholders, not real lettings.`,
      },
      evidenceDate: null,
      meta: SAMPLE_META,
    },

    rentTrend: {
      status: "available",
      kind: "rent-trend",
      label: "Illustrative rent trend, three-bedroom homes",
      unit: "GBP-pcm",
      points: [
        { period: "Sample period 1", value: 880 },
        { period: "Sample period 2", value: 890 },
        { period: "Sample period 3", value: 905 },
        { period: "Sample period 4", value: 915 },
        { period: "Sample period 5", value: 930 },
        { period: "Sample period 6", value: 945 },
        { period: "Sample period 7", value: 960 },
        { period: "Sample period 8", value: 975 },
      ],
      meta: SAMPLE_META,
    },

    completedSales: {
      status: "available",
      kind: "completed-sales",
      note: "Sold prices are shown for context only and are not rent.",
      sales: [
        {
          period: "Sample month A",
          propertyType: "Semi-detached house",
          priceGbp: 235000,
          approximateLocation: "Same postcode district (approximate)",
        },
        {
          period: "Sample month B",
          propertyType: "Semi-detached house",
          priceGbp: 222000,
          approximateLocation: "Same postcode district (approximate)",
        },
        {
          period: "Sample month C",
          propertyType: "Terraced house",
          priceGbp: 198000,
          approximateLocation: "Neighbouring postcode district (approximate)",
        },
      ],
      meta: SAMPLE_META,
    },

    demand: {
      status: "unavailable",
      reason: "No configured data source yet. Rental demand context will appear here once a licensed source is connected and reviewed.",
    },

    licensing: {
      status: "available",
      flag: "may-require-licence",
      councilUrl: PETERBOROUGH_SELECTIVE_LICENSING_URL,
      explanation:
        "Parts of Peterborough sit within selective-licensing areas and the boundaries, exemptions and rules can change. An automated check cannot be definitive, so we confirm licensing requirements as part of a verified appraisal.",
      meta: SAMPLE_META,
    },

    crime: {
      status: "available",
      periodLabel: "Sample month (illustrative)",
      categories: [
        { category: "Anti-social behaviour", count: 12, trend: "stable" },
        { category: "Vehicle crime", count: 5, trend: "falling" },
        { category: "Burglary", count: 3, trend: "stable" },
        { category: "Criminal damage and arson", count: 4, trend: "rising" },
        { category: "Other theft", count: 6, trend: "unknown" },
      ],
      limitations:
        "Locations in this kind of data are deliberately approximate, the figures are monthly and may be revised, and the records cannot prove anything about a particular home.",
      meta: SAMPLE_META,
    },

    amenities: {
      status: "available",
      items: [
        {
          name: "Bus stop",
          category: "transport",
          approximateDistance: "About 5 minutes' walk (illustrative)",
        },
        {
          name: "Primary school",
          category: "school",
          approximateDistance: "About 10 minutes' walk (illustrative)",
        },
        {
          name: "Local shops",
          category: "shop",
          approximateDistance: "About 8 minutes' walk (illustrative)",
        },
        {
          name: "GP surgery",
          category: "health",
          approximateDistance: "About 12 minutes' walk (illustrative)",
        },
        {
          name: "Park and green space",
          category: "green-space",
          approximateDistance: "About 6 minutes' walk (illustrative)",
        },
        {
          name: "Peterborough railway station",
          category: "transport",
          approximateDistance: "About 15 minutes by bus (illustrative)",
        },
      ],
      meta: SAMPLE_META,
    },

    considerations: {
      strengths: [
        "Three bedrooms suit a range of households, from sharers to families.",
        "Off-street parking is a practical advantage for many tenants.",
        "A private garden broadens appeal, particularly for longer tenancies.",
        "Described as in good condition, so it should need only light preparation before marketing.",
      ],
      practicalConsiderations: [
        "Offered unfurnished — confirm which white goods and fittings will stay.",
        "A current gas certificate, electrical (EICR) report and EPC are needed before a tenancy starts.",
        "Check whether the address sits within a selective-licensing area before marketing.",
        "One bathroom for three bedrooms is workable but worth mentioning honestly in the listing.",
      ],
    },

    scenarios: {
      status: "available",
      kind: "scenarios",
      label: "Illustrative scenarios — not forecasts, guarantees, returns or financial advice.",
      scenarios: [
        { horizonYears: 1, low: 950, central: 1000, high: 1060 },
        { horizonYears: 3, low: 960, central: 1050, high: 1150 },
      ],
      assumptions: [
        "Each scenario starts from the illustrative central figure of £1,000 per calendar month.",
        "The property's condition, specification and tenancy terms are assumed not to change.",
        "The low, central and high paths use sample rates of change chosen only to show the format — they are not drawn from any market source.",
        "Void periods, arrears, maintenance, tax and fees are not included.",
      ],
      meta: SAMPLE_META,
    },

    disclaimer: DEMO_REPORT_DISCLAIMER,
    humanReviewState: "not-requested",
  };
}

export const demoMarketDataRepository: MarketDataRepository = {
  source: "demo",
  async buildReport(input: RentalReportInput): Promise<RentalReport> {
    // The input is intentionally ignored: this adapter never calculates.
    void input;
    return buildDemoReport();
  },
};
