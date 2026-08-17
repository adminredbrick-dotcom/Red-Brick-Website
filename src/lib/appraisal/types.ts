import type { PropertyType } from "@/lib/listings/types";

/**
 * Rental-report contract (data/CMS-AND-LISTING-MODELS.md → "Rental report",
 * data/DATA-SOURCE-PLAN.md → estimate/model requirements). The public result
 * is an *indicative rental estimate*, never a valuation or a guaranteed rent.
 * Every figure carries provenance metadata; the demonstration adapter marks
 * everything `kind: "demonstration"`.
 */

export const currentStatusOptions = ["vacant", "tenanted", "owner-occupied", "buying"] as const;
export type CurrentStatus = (typeof currentStatusOptions)[number];

export const currentStatusLabels: Record<CurrentStatus, string> = {
  vacant: "Empty and ready to let",
  tenanted: "Currently let to a tenant",
  "owner-occupied": "I live in it at the moment",
  buying: "I am thinking of buying it",
};

export const bedroomChoices = [1, 2, 3, 4, 5] as const;

export interface AppraisalRequest {
  /** Area key or null when not chosen. */
  readonly area: string | null;
  readonly propertyType: PropertyType;
  /** 1–5 (5 means five or more). */
  readonly bedrooms: number;
  readonly currentStatus: CurrentStatus;
}

export type EvidenceKind = "demonstration" | "official-statistic" | "achieved-rent" | "licensed-comparable";

export interface EvidenceItem {
  readonly label: string;
  readonly source: string;
  readonly kind: EvidenceKind;
  /** ISO date the underlying data describes. */
  readonly observedOn: string;
  /** ISO date the data was retrieved/generated. */
  readonly retrievedOn: string;
}

export interface RentHistoryPoint {
  /** e.g. "Q3 2024" */
  readonly period: string;
  readonly low: number;
  readonly high: number;
}

export interface RentalReport {
  readonly request: AppraisalRequest;
  /** Monthly figures in GBP. */
  readonly lowPcm: number;
  readonly highPcm: number;
  readonly centralPcm: number;
  /** Plain-English assumptions the visitor must read alongside the range. */
  readonly assumptions: readonly string[];
  readonly evidence: readonly EvidenceItem[];
  /** How current the underlying data is, in plain English. */
  readonly dataFreshness: { readonly observedOn: string; readonly note: string };
  readonly rentHistory: readonly RentHistoryPoint[];
  readonly comparableCount: number;
  readonly confidence: "demonstration" | "low" | "medium" | "high";
  /** Model/input version recorded with every report. */
  readonly modelVersion: string;
  readonly generatedOn: string;
}

/** Adapter boundary — a licensed comparable provider or Red Brick's own achieved rents plug in here later. */
export interface RentalReportAdapter {
  estimate(request: AppraisalRequest): Promise<RentalReport>;
}
