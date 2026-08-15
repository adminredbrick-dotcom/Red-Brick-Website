import type { Furnishing, PropertyType } from "@/data/contracts/listing";
import type { PropertyCondition, RentalReportInput } from "@/data/contracts/rental-report";

/**
 * Field names for the GET appraisal form and a tolerant parser for the
 * resulting search params. Contact fields are deliberately NOT parsed —
 * the demonstration never reads, echoes or stores them.
 */

export const APPRAISAL_FIELDS = [
  "location",
  "propertyType",
  "bedrooms",
  "bathrooms",
  "condition",
  "furnishing",
  "parking",
  "garden",
  "details",
] as const;

export type AppraisalField = (typeof APPRAISAL_FIELDS)[number];

export type AppraisalFormValues = Partial<Record<AppraisalField, string>>;

export type SearchParams = Record<string, string | string[] | undefined>;

const PROPERTY_TYPES: readonly PropertyType[] = [
  "terraced-house",
  "semi-detached-house",
  "detached-house",
  "apartment",
  "bungalow",
  "maisonette",
  "room",
];

const CONDITIONS: readonly PropertyCondition[] = [
  "needs-work",
  "fair",
  "good",
  "recently-refurbished",
];

const FURNISHINGS: readonly Furnishing[] = ["unfurnished", "part-furnished", "furnished"];

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function oneOf<T extends string>(value: string | undefined, allowed: readonly T[], fallback: T): T {
  return (allowed as readonly string[]).includes(value ?? "") ? (value as T) : fallback;
}

function toCount(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (Number.isNaN(parsed) || parsed < 0 || parsed > 20) return fallback;
  return parsed;
}

/** Raw string values for re-populating the form after a GET submission. */
export function readFormValues(params: SearchParams): AppraisalFormValues {
  const values: AppraisalFormValues = {};
  for (const field of APPRAISAL_FIELDS) {
    const value = first(params[field]);
    if (typeof value === "string" && value.length > 0) {
      values[field] = value.slice(0, 500);
    }
  }
  return values;
}

/** True when the visitor asked for the report or submitted any form field. */
export function hasReportRequest(params: SearchParams): boolean {
  if (first(params.report) === "1") return true;
  return APPRAISAL_FIELDS.some((field) => {
    const value = first(params[field]);
    return typeof value === "string" && value.length > 0;
  });
}

/**
 * Coerces submitted values into a typed RentalReportInput. Anything missing
 * or malformed falls back to a neutral default — the demo adapter ignores the
 * input entirely, but a live adapter must only ever receive a valid contract.
 */
export function toReportInput(values: AppraisalFormValues): RentalReportInput {
  const input: RentalReportInput = {
    addressOrPostcode: values.location ?? "",
    propertyType: oneOf(values.propertyType, PROPERTY_TYPES, "terraced-house"),
    bedrooms: toCount(values.bedrooms, 2),
    bathrooms: toCount(values.bathrooms, 1),
    condition: oneOf(values.condition, CONDITIONS, "good"),
    furnishing: oneOf(values.furnishing, FURNISHINGS, "unfurnished"),
    parking: values.parking === "yes",
    garden: values.garden === "yes",
    ...(values.details ? { details: values.details } : {}),
  };
  return input;
}
