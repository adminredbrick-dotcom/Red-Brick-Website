import { formatGbp } from "@/lib/format";

export const NOT_PUBLISHED = "Not published";

/**
 * Public display value for optional listing fields. Null, empty and the
 * fixture placeholder "Demo" all render as "Not published" so a placeholder
 * can never be mistaken for a verified figure.
 */
export function publishedText(value: string | null | undefined): string {
  if (value == null) return NOT_PUBLISHED;
  const trimmed = value.trim();
  if (trimmed === "" || trimmed.toLowerCase() === "demo") return NOT_PUBLISHED;
  return trimmed;
}

export function publishedMoney(value: number | null | undefined): string {
  return value == null ? NOT_PUBLISHED : formatGbp(value);
}
