/**
 * Mandatory honesty labels for demonstration content (CLAUDE.md: keep mock
 * data visibly labelled as illustrative). Rendered verbatim — never shorten.
 */
export const demoLabels = {
  /** Beside every fictional listing card, detail page and map pin. */
  listing: "Demonstration listing — not a real property.",
  /** Beside every rental figure the estimate tool produces. */
  estimate: "Illustrative estimate — not a valuation.",
  /** Beside demonstration charts, tables and figures. */
  figures: "Demonstration figures — not market data.",
  /** Beside the schematic map. */
  map: "Schematic map with approximate locations — not to scale.",
} as const;
