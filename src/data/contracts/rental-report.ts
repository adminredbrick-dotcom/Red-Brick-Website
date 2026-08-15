/**
 * Indicative rental estimate — typed report contract.
 *
 * Every figure in a report carries the minimum metadata required by
 * data/DATA-SOURCE-PLAN.md (source, licence, observation/retrieval dates,
 * geography, factual-vs-modelled, model version, quality flag, last review).
 *
 * Design rules encoded here:
 * - Rent evidence, completed-sale context and future scenarios are SEPARATE
 *   types with distinct `kind` discriminators — they must never be merged.
 * - Every module can be honestly unavailable (`{ status: "unavailable", reason }`).
 * - Crime context is neutral categories + trend only. There is deliberately no
 *   field for a safety label, colour grade or single area score.
 * - Demographic and benefit data have no place in this model at all.
 */

import type { Furnishing, PropertyType } from "@/data/contracts/listing";

export type { Furnishing, PropertyType };

/* ------------------------------------------------------------------ */
/* Figure metadata (data/DATA-SOURCE-PLAN.md — minimum metadata per figure) */
/* ------------------------------------------------------------------ */

export type FigureKind = "factual" | "modelled" | "illustrative";
export type FigureQuality = "high" | "medium" | "low" | "unavailable";

export interface FigureMeta {
  readonly sourceName: string;
  readonly sourceUrl: string | null;
  readonly licence: string | null;
  /** ISO date the underlying observation relates to. */
  readonly observationDate: string | null;
  /** ISO date the figure was retrieved from its source. */
  readonly retrievalDate: string | null;
  /** Human-readable geography, e.g. "Peterborough (local authority)". */
  readonly geography: string;
  readonly kind: FigureKind;
  readonly modelVersion: string | null;
  readonly quality: FigureQuality;
  /** ISO date a member of staff last reviewed the figure, if ever. */
  readonly lastReviewed: string | null;
}

/* ------------------------------------------------------------------ */
/* Input                                                                */
/* ------------------------------------------------------------------ */

export type PropertyCondition = "needs-work" | "fair" | "good" | "recently-refurbished";

export const propertyConditionLabels: Record<PropertyCondition, string> = {
  "needs-work": "Needs work",
  fair: "Fair",
  good: "Good",
  "recently-refurbished": "Recently refurbished",
};

export interface RentalReportInput {
  /** Address or postcode as typed. Never echoed publicly beyond an approximate area. */
  readonly addressOrPostcode: string;
  readonly propertyType: PropertyType;
  readonly bedrooms: number;
  readonly bathrooms: number;
  readonly condition: PropertyCondition;
  readonly furnishing: Furnishing;
  readonly parking: boolean;
  readonly garden: boolean;
  /** Free-text extras such as an annexe, en suite or recent works. */
  readonly details?: string;
}

/* ------------------------------------------------------------------ */
/* Modules                                                              */
/* ------------------------------------------------------------------ */

/** First-class honest unavailable state for any module. */
export interface UnavailableModule {
  readonly status: "unavailable";
  readonly reason: string;
}

/** A module either resolves with data or is honestly unavailable. */
export type ReportModule<T> = ({ readonly status: "available" } & T) | UnavailableModule;

export interface IndicativeRange {
  readonly low: number;
  readonly high: number;
  readonly currency: "GBP";
  readonly period: "pcm";
}

export type ConfidenceLevel = "low" | "medium" | "high" | "insufficient";

export interface Confidence {
  readonly level: ConfidenceLevel;
  readonly comparableCount: number;
  readonly explanation: string;
}

export interface IndicativeRentModule {
  readonly range: IndicativeRange;
  readonly confidence: Confidence;
  /** Date the comparable evidence was drawn on (rendered in the approved wording). */
  readonly evidenceDate: string | null;
  readonly meta: FigureMeta;
}

export interface SeriesPoint {
  /** Period label, e.g. "2025 Q1" or an ISO month. */
  readonly period: string;
  readonly value: number;
}

/** Rent trend — kept separate from sold-price and scenario series. */
export interface RentTrendSeries {
  readonly kind: "rent-trend";
  readonly label: string;
  readonly unit: "GBP-pcm";
  readonly points: readonly SeriesPoint[];
  readonly meta: FigureMeta;
}

export interface CompletedSaleRow {
  /** Month or period of the completed sale. */
  readonly period: string;
  readonly propertyType: string;
  readonly priceGbp: number;
  /** Approximate location wording only — never a full address. */
  readonly approximateLocation: string;
}

/** Completed-sale context — never rent, never a property value. */
export interface CompletedSaleContext {
  readonly kind: "completed-sales";
  readonly note: string;
  readonly sales: readonly CompletedSaleRow[];
  readonly meta: FigureMeta;
}

export interface DemandIndicator {
  readonly label: string;
  readonly value: string;
}

export interface DemandContext {
  readonly kind: "demand";
  readonly indicators: readonly DemandIndicator[];
  readonly meta: FigureMeta;
}

export type LicensingStatus = "may-require-licence" | "unlikely" | "unknown";

export interface LicensingFlag {
  /** Cautious flag only — never a definitive legal determination. */
  readonly flag: LicensingStatus;
  readonly councilUrl: string;
  readonly explanation: string;
  readonly meta: FigureMeta;
}

export type CrimeTrend = "rising" | "stable" | "falling" | "unknown";

export interface CrimeCategory {
  readonly category: string;
  readonly count: number;
  readonly trend: CrimeTrend;
}

/**
 * Neutral crime context. Separate categories and a trend word only.
 * No safety label, grade or area score exists on this type — by design.
 */
export interface CrimeContext {
  readonly periodLabel: string;
  readonly categories: readonly CrimeCategory[];
  /** Data-source limitations (approximate locations, monthly data, revisions). */
  readonly limitations: string;
  readonly meta: FigureMeta;
}

export type AmenityCategory =
  | "transport"
  | "school"
  | "shop"
  | "health"
  | "green-space"
  | "other";

export interface AmenityItem {
  readonly name: string;
  readonly category: AmenityCategory;
  readonly approximateDistance: string;
}

export interface AmenitiesContext {
  readonly items: readonly AmenityItem[];
  readonly meta: FigureMeta;
}

export interface Considerations {
  readonly strengths: readonly string[];
  readonly practicalConsiderations: readonly string[];
}

export interface Scenario {
  readonly horizonYears: 1 | 3;
  readonly low: number;
  readonly central: number;
  readonly high: number;
}

/** Illustrative scenarios — never forecasts, guarantees, returns or advice. */
export interface ScenarioSet {
  readonly kind: "scenarios";
  readonly label: string;
  readonly scenarios: readonly Scenario[];
  readonly assumptions: readonly string[];
  readonly meta: FigureMeta;
}

/* ------------------------------------------------------------------ */
/* Report                                                               */
/* ------------------------------------------------------------------ */

export type ReportStatus = "ok" | "weak-evidence" | "unavailable";
export type HumanReviewState = "not-requested" | "requested" | "confirmed";

export interface RentalReport {
  readonly id: string;
  readonly status: ReportStatus;
  /** True for fixed sample reports that must never be presented as evidence. */
  readonly isDemo: boolean;
  /** ISO timestamp. */
  readonly generatedAt: string;
  /** Model/input version preserved for each report (null for sample output). */
  readonly modelVersion: string | null;
  readonly input: RentalReportInput;
  /** Public geography the report describes, e.g. "Peterborough (sample area)". */
  readonly geography: string;
  readonly indicativeRent: ReportModule<IndicativeRentModule>;
  readonly rentTrend: ReportModule<RentTrendSeries>;
  readonly completedSales: ReportModule<CompletedSaleContext>;
  readonly demand: ReportModule<DemandContext>;
  readonly licensing: ReportModule<LicensingFlag>;
  readonly crime: ReportModule<CrimeContext>;
  readonly amenities: ReportModule<AmenitiesContext>;
  readonly considerations: Considerations | null;
  readonly scenarios: ReportModule<ScenarioSet>;
  readonly disclaimer: string;
  readonly humanReviewState: HumanReviewState;
}

/* ------------------------------------------------------------------ */
/* Pure helpers                                                         */
/* ------------------------------------------------------------------ */

/** Plain-English explanation of a confidence level. */
export function describeConfidence(level: ConfidenceLevel): string {
  switch (level) {
    case "high":
      return "Several close comparables from recent months support this range.";
    case "medium":
      return "A reasonable number of comparables support this range, although some are older or differ in specification.";
    case "low":
      return "Only a few comparables were found, so treat this range as a broad guide.";
    case "insufficient":
      return "There is not enough evidence to show a range. We will review the property in person instead.";
  }
}

/**
 * True when the estimate must not be shown as a figure and staff review is
 * required instead (DATA-SOURCE-PLAN: suppress the estimate when evidence is weak).
 */
export function isEstimateSuppressed(report: Pick<RentalReport, "status">): boolean {
  return report.status === "weak-evidence" || report.status === "unavailable";
}

export function isModuleAvailable<T>(
  module: ReportModule<T>,
): module is { readonly status: "available" } & T {
  return module.status === "available";
}
