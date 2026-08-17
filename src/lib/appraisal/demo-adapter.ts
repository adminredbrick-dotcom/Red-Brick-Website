import { getArea } from "@/lib/listings/areas";
import { propertyTypeLabels, propertyTypes, type PropertyType } from "@/lib/listings/types";

import {
  currentStatusOptions,
  bedroomChoices,
  type AppraisalRequest,
  type CurrentStatus,
  type RentalReport,
  type RentalReportAdapter,
} from "./types";

/**
 * DEMONSTRATION rental-report adapter. Produces a deterministic, clearly
 * labelled illustrative range from an invented base table so the appraisal
 * journey can be designed and tested. It is not market data, not a valuation
 * and never a forecast. A licensed comparable provider and Red Brick's own
 * de-identified achieved-rent records replace this adapter later
 * (data/DATA-SOURCE-PLAN.md).
 */

const MODEL_VERSION = "demo-0.1";
/** The date the demonstration table pretends to describe. */
const DEMO_OBSERVED_ON = "2026-06-30";
const DEMO_GENERATED_ON = "2026-08-17";

/** Invented monthly base rents by property type and bedrooms (index 1–5). */
const demoBase: Record<PropertyType, readonly number[]> = {
  apartment: [0, 850, 1025, 1200, 1350, 1450],
  "terraced-house": [0, 875, 1075, 1250, 1425, 1550],
  "semi-detached-house": [0, 925, 1125, 1325, 1525, 1675],
  "detached-house": [0, 1000, 1225, 1450, 1725, 1925],
  bungalow: [0, 950, 1150, 1325, 1500, 1625],
};

/** Invented area multipliers around 1.0 — demonstration only. */
const demoAreaFactor: Record<string, number> = {
  central: 1.02,
  dogsthorpe: 0.96,
  fletton: 0.97,
  woodston: 0.99,
  stanground: 0.98,
  orton: 1.0,
  bretton: 0.98,
  longthorpe: 1.06,
  werrington: 1.03,
  paston: 0.97,
  walton: 1.0,
  hampton: 1.08,
};

/** Invented quarter-on-quarter path so the chart has a plausible-looking shape. */
const demoHistoryFactors = [0.905, 0.915, 0.93, 0.945, 0.955, 0.97, 0.985, 1.0] as const;
const demoHistoryPeriods = ["Q3 2024", "Q4 2024", "Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Q1 2026", "Q2 2026"] as const;

const roundTo5 = (n: number) => Math.round(n / 5) * 5;

export function isCurrentStatus(value: string): value is CurrentStatus {
  return (currentStatusOptions as readonly string[]).includes(value);
}

/** Parse raw form/search values into a request; returns null when required fields are missing or invalid. */
export function parseAppraisalRequest(raw: Record<string, string | string[] | undefined>): AppraisalRequest | null {
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const type = first(raw.type);
  const beds = Number(first(raw.beds));
  const status = first(raw.status);
  const area = first(raw.area);
  if (!(propertyTypes as readonly string[]).includes(type)) return null;
  if (!(bedroomChoices as readonly number[]).includes(beds)) return null;
  if (!isCurrentStatus(status)) return null;
  return {
    area: area && getArea(area) ? area : null,
    propertyType: type as PropertyType,
    bedrooms: beds,
    currentStatus: status,
  };
}

export class DemoRentalReportAdapter implements RentalReportAdapter {
  async estimate(request: AppraisalRequest): Promise<RentalReport> {
    const base = demoBase[request.propertyType][request.bedrooms] ?? 0;
    const factor = request.area ? (demoAreaFactor[request.area] ?? 1) : 1;
    const central = roundTo5(base * factor);
    const low = roundTo5(central * 0.93);
    const high = roundTo5(central * 1.07);
    const areaName = request.area ? getArea(request.area)?.name : null;

    const assumptions: string[] = [
      `Assumes a ${propertyTypeLabels[request.propertyType].toLowerCase()} with ${request.bedrooms === 5 ? "five or more" : request.bedrooms} bedroom${request.bedrooms === 1 ? "" : "s"} in ${areaName ? `${areaName}, Peterborough` : "Peterborough (no area chosen, so the city-wide table is used)"}.`,
      "Assumes an unfurnished let in good, clean condition with a valid gas safety record, EICR and EPC — condition, presentation and any furnishing move a real figure up or down.",
      "Assumes a single household on a standard assured shorthold tenancy; houses in multiple occupation, room lets and short lets are priced differently and are not covered.",
      "The range is a demonstration produced from an invented table. It is not derived from Red Brick achieved rents, portal listings or any licensed data set, and it must not be relied on.",
    ];
    if (request.currentStatus === "tenanted") {
      assumptions.push(
        "The property is currently let: any change to rent for the existing tenancy follows the tenancy terms and the statutory notice route, not this figure.",
      );
    }
    if (request.currentStatus === "buying") {
      assumptions.push(
        "The property has not been purchased: an indicative range is not investment advice and says nothing about purchase price, yield or future value.",
      );
    }

    return {
      request,
      lowPcm: low,
      highPcm: high,
      centralPcm: central,
      assumptions,
      evidence: [
        {
          label: "Demonstration base-rent table by property type and bedrooms",
          source: "Invented for the website prototype — not market data",
          kind: "demonstration",
          observedOn: DEMO_OBSERVED_ON,
          retrievedOn: DEMO_GENERATED_ON,
        },
        {
          label: "Demonstration area factor",
          source: "Invented for the website prototype",
          kind: "demonstration",
          observedOn: DEMO_OBSERVED_ON,
          retrievedOn: DEMO_GENERATED_ON,
        },
      ],
      dataFreshness: {
        observedOn: DEMO_OBSERVED_ON,
        note: "Demonstration table dated 30 June 2026. A live report will state the observation date and retrieval date of every source and will suppress the estimate when evidence is weak.",
      },
      rentHistory: demoHistoryPeriods.map((period, i) => {
        const c = roundTo5(central * (demoHistoryFactors[i] ?? 1));
        return { period, low: roundTo5(c * 0.93), high: roundTo5(c * 1.07) };
      }),
      comparableCount: 0,
      confidence: "demonstration",
      modelVersion: MODEL_VERSION,
      generatedOn: DEMO_GENERATED_ON,
    };
  }
}

export const rentalReportAdapter: RentalReportAdapter = new DemoRentalReportAdapter();
