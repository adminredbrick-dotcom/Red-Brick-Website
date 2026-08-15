import type { RentalReport, RentalReportInput } from "@/data/contracts/rental-report";

/**
 * Typed boundary between the rental-appraisal page and market data.
 *
 * Phase 2: a demo adapter that returns one fixed illustrative report.
 * Later: a live adapter combining our de-identified achieved-rent records,
 * a licensed comparable feed, public context sources and staff review.
 * Pages never touch a source directly.
 */
export interface MarketDataRepository {
  readonly source: "demo" | "live";
  buildReport(input: RentalReportInput): Promise<RentalReport>;
}

export async function getMarketDataRepository(): Promise<MarketDataRepository> {
  // Only the demo adapter exists in Phase 2. A live adapter will be selected
  // by configuration once real sources are licensed and reviewed — never by
  // a hard-coded fixture.
  const { demoMarketDataRepository } = await import("@/data/adapters/demo-rental-report");
  return demoMarketDataRepository;
}
