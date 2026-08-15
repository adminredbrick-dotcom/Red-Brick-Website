import { describe, expect, it } from "vitest";

import {
  DEMO_REPORT_INPUT,
  demoMarketDataRepository,
  describeConfidence,
  isEstimateSuppressed,
} from "@/data/adapters/demo-rental-report";
import {
  isModuleAvailable,
  type FigureMeta,
  type RentalReport,
  type ReportModule,
} from "@/data/contracts/rental-report";
import { getMarketDataRepository } from "@/data/repositories/market-data";

const META_KEYS: readonly (keyof FigureMeta)[] = [
  "sourceName",
  "sourceUrl",
  "licence",
  "observationDate",
  "retrievalDate",
  "geography",
  "kind",
  "modelVersion",
  "quality",
  "lastReviewed",
];

/** Collects every FigureMeta in the report (available modules only). */
function collectMeta(report: RentalReport): FigureMeta[] {
  const modules: ReportModule<{ meta: FigureMeta }>[] = [
    report.indicativeRent,
    report.rentTrend,
    report.completedSales,
    report.demand,
    report.licensing,
    report.crime,
    report.amenities,
    report.scenarios,
  ];
  return modules.filter(isModuleAvailable).map((module) => module.meta);
}

describe("market data repository (demo adapter)", () => {
  it("returns the demo adapter and a report marked isDemo", async () => {
    const repo = await getMarketDataRepository();
    expect(repo.source).toBe("demo");
    const report = await repo.buildReport(DEMO_REPORT_INPUT);
    expect(report.isDemo).toBe(true);
    expect(report.status).toBe("ok");
    expect(report.humanReviewState).toBe("not-requested");
  });

  it("returns the same fixed illustrative report whatever the input", async () => {
    const a = await demoMarketDataRepository.buildReport(DEMO_REPORT_INPUT);
    const b = await demoMarketDataRepository.buildReport({
      addressOrPostcode: "PE9",
      propertyType: "apartment",
      bedrooms: 1,
      bathrooms: 1,
      condition: "needs-work",
      furnishing: "furnished",
      parking: false,
      garden: false,
    });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a.indicativeRent).toMatchObject({
      status: "available",
      range: { low: 950, high: 1100, currency: "GBP", period: "pcm" },
      confidence: { level: "medium", comparableCount: 6 },
    });
  });

  it("gives every figure the full metadata set, all illustrative with no source URL", async () => {
    const report = await demoMarketDataRepository.buildReport(DEMO_REPORT_INPUT);
    const metas = collectMeta(report);
    expect(metas.length).toBeGreaterThanOrEqual(6);
    for (const meta of metas) {
      for (const key of META_KEYS) {
        expect(meta, `meta is missing ${key}`).toHaveProperty(key);
      }
      expect(meta.kind).toBe("illustrative");
      expect(meta.sourceName).toBe("Illustrative sample data");
      expect(meta.sourceUrl).toBeNull();
      expect(["low", "unavailable"]).toContain(meta.quality);
      expect(meta.geography.length).toBeGreaterThan(0);
    }
  });

  it("includes an honest unavailable module and the neutral crime module", async () => {
    const report = await demoMarketDataRepository.buildReport(DEMO_REPORT_INPUT);
    expect(report.demand.status).toBe("unavailable");
    if (report.demand.status === "unavailable") {
      expect(report.demand.reason).toContain("No configured data source");
    }
    expect(isModuleAvailable(report.crime)).toBe(true);
    if (isModuleAvailable(report.crime)) {
      expect(report.crime.categories.length).toBeGreaterThan(1);
      for (const row of report.crime.categories) {
        expect(["rising", "stable", "falling", "unknown"]).toContain(row.trend);
        expect(Object.keys(row).sort()).toEqual(["category", "count", "trend"]);
      }
      expect(report.crime.limitations).toMatch(/approximate/i);
      expect(report.crime.limitations).toMatch(/monthly/i);
    }
  });

  it("never carries a safety label or an area score anywhere in the report JSON", async () => {
    const report = await demoMarketDataRepository.buildReport(DEMO_REPORT_INPUT);
    const json = JSON.stringify(report).toLowerCase();
    expect(json).not.toContain("score");
    expect(json).not.toContain("safe");
    expect(json).not.toContain("unsafe");
    expect(json).not.toContain("good area");
    expect(json).not.toContain("bad area");
  });

  it("keeps rent, sold-price and scenario series as distinct objects and kinds", async () => {
    const report = await demoMarketDataRepository.buildReport(DEMO_REPORT_INPUT);
    expect(report.rentTrend).not.toBe(report.completedSales);
    expect(report.rentTrend).not.toBe(report.scenarios);
    expect(report.completedSales).not.toBe(report.scenarios);
    if (
      isModuleAvailable(report.rentTrend) &&
      isModuleAvailable(report.completedSales) &&
      isModuleAvailable(report.scenarios)
    ) {
      expect(report.rentTrend.kind).toBe("rent-trend");
      expect(report.completedSales.kind).toBe("completed-sales");
      expect(report.scenarios.kind).toBe("scenarios");
      expect(report.completedSales.note).toContain("not rent");
      expect(report.scenarios.label).toContain("not forecasts");
      expect(report.scenarios.assumptions.length).toBeGreaterThan(0);
      expect(report.scenarios.scenarios.map((s) => s.horizonYears)).toEqual([1, 3]);
    }
  });

  it("carries the mandatory disclaimer and a cautious licensing flag", async () => {
    const report = await demoMarketDataRepository.buildReport(DEMO_REPORT_INPUT);
    expect(report.disclaimer).toContain("not a formal valuation");
    expect(report.disclaimer).not.toMatch(/guaranteed/i);
    if (isModuleAvailable(report.licensing)) {
      expect(report.licensing.flag).toBe("may-require-licence");
      expect(report.licensing.councilUrl).toContain("peterborough.gov.uk");
    } else {
      throw new Error("licensing module should be available in the demo report");
    }
  });
});

describe("describeConfidence", () => {
  it("explains every confidence level in plain English", () => {
    for (const level of ["low", "medium", "high", "insufficient"] as const) {
      const text = describeConfidence(level);
      expect(text.length).toBeGreaterThan(20);
      expect(text).not.toMatch(/guarantee|valuation|forecast/i);
    }
    expect(describeConfidence("insufficient")).toMatch(/not enough evidence/i);
  });
});

describe("isEstimateSuppressed", () => {
  it("suppresses weak-evidence and unavailable reports only", () => {
    expect(isEstimateSuppressed({ status: "ok" })).toBe(false);
    expect(isEstimateSuppressed({ status: "weak-evidence" })).toBe(true);
    expect(isEstimateSuppressed({ status: "unavailable" })).toBe(true);
  });
});
