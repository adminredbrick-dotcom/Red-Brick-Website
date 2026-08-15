import { ExternalLink, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { business } from "@/config/business";
import { reportCopy } from "@/content/appraisal-copy";
import { DEMO_REPORT_NOTICE } from "@/content/demo-labels";
import {
  isEstimateSuppressed,
  isModuleAvailable,
  type ConfidenceLevel,
  type CrimeTrend,
  type RentalReport,
} from "@/data/contracts/rental-report";
import { formatDate, formatGbp } from "@/lib/format";
import { whatsappHref } from "@/lib/whatsapp";

import { NoticeBanner } from "./notice-banner";
import { RentTrendChart } from "./rent-trend-chart";
import { IllustrativeMarker, ReportModule } from "./report-module";
import { SourceMeta } from "./source-meta";
import { UnavailableModule } from "./unavailable-module";

interface IllustrativeReportProps {
  report: RentalReport;
  id?: string;
  formAnchor?: string;
}

const confidenceLabels: Record<ConfidenceLevel, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
  insufficient: "Insufficient",
};

const trendLabels: Record<CrimeTrend, string> = {
  rising: "Rising",
  stable: "Stable",
  falling: "Falling",
  unknown: "Not known",
};

const tableClass = "w-full min-w-[20rem] text-left text-base";
const thClass = "py-2 pr-4 font-bold";
const tdClass = "py-2 pr-4 align-top";
const rowClass = "border-b border-stone-light";

/**
 * Renders a RentalReport in the approved module order. Every disclaimer sits
 * beside the result it qualifies; unavailable modules render honestly.
 */
export function IllustrativeReport({
  report,
  id = "illustrative-report",
  formAnchor = "appraisal-form",
}: IllustrativeReportProps) {
  const {
    indicativeRent,
    rentTrend,
    completedSales,
    demand,
    licensing,
    crime,
    amenities,
    considerations,
    scenarios,
  } = report;
  const modules = reportCopy.modules;
  const suppressed = isEstimateSuppressed(report);
  const whatsapp = whatsappHref(business.whatsapp.e164, reportCopy.nextStep.whatsappMessage);

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="container-rb pb-16 md:pb-24">
      <div className="max-w-4xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-eyebrow text-brick">Sample result</p>
            <h2 id={`${id}-heading`} className="text-section mt-2">
              {reportCopy.heading}
            </h2>
          </div>
          <a
            href={`#${formAnchor}`}
            className="min-h-11 py-2 font-bold text-brick underline underline-offset-4"
          >
            {reportCopy.backToForm}
          </a>
        </div>

        {report.isDemo ? (
          <NoticeBanner className="mt-6" title="Sample report — layout only">
            <p>{DEMO_REPORT_NOTICE}</p>
            <p className="mt-2">{reportCopy.sampleNote}</p>
          </NoticeBanner>
        ) : null}

        <div className="mt-8 space-y-8">
          {/* 1. Indicative rent — range, confidence and the approved wording. */}
          <ReportModule
            id="report-rent"
            title={modules.indicativeRent}
            illustrative={report.isDemo}
          >
            {!suppressed && isModuleAvailable(indicativeRent) ? (
              <div>
                <p className="text-eyebrow text-stone">Indicative monthly range</p>
                <p className="mt-2 flex flex-wrap items-baseline gap-x-3">
                  <span className="text-section font-bold tabular-nums">
                    {formatGbp(indicativeRent.range.low)}–{formatGbp(indicativeRent.range.high)}
                  </span>
                  <span className="text-lg text-stone">per calendar month</span>
                </p>

                <div className="mt-6 rounded-md bg-cream p-5">
                  <p className="font-bold">
                    {reportCopy.indicativeRentLead(
                      `${formatGbp(indicativeRent.range.low)}–${formatGbp(indicativeRent.range.high)}`,
                    )}
                  </p>
                  <p className="measure-body mt-2">
                    {reportCopy.indicativeRentWording(
                      indicativeRent.evidenceDate
                        ? formatDate(indicativeRent.evidenceDate)
                        : "an illustrative sample date",
                    )}
                  </p>
                </div>

                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-md border border-stone-light p-4">
                    <dt className="text-sm font-bold text-stone">{reportCopy.confidenceLabel}</dt>
                    <dd className="mt-1 text-xl font-bold">
                      {confidenceLabels[indicativeRent.confidence.level]}
                    </dd>
                  </div>
                  <div className="rounded-md border border-stone-light p-4">
                    <dt className="text-sm font-bold text-stone">Evidence</dt>
                    <dd className="mt-1 text-xl font-bold">
                      {reportCopy.comparables(indicativeRent.confidence.comparableCount)}
                    </dd>
                  </div>
                </dl>
                <p className="measure-body mt-4 text-stone">
                  {indicativeRent.confidence.explanation}
                </p>
                <SourceMeta meta={indicativeRent.meta} className="mt-5" />
              </div>
            ) : (
              <UnavailableModule
                reason={
                  isModuleAvailable(indicativeRent)
                    ? "The evidence for this property is too weak to show a range. We will review it in person instead of showing a figure we cannot support."
                    : indicativeRent.reason
                }
              />
            )}
          </ReportModule>

          {/* 2. Rent trend */}
          <ReportModule
            id="report-rent-trend"
            title={modules.rentTrend}
            intro={reportCopy.rentTrendIntro}
            illustrative={report.isDemo}
          >
            {isModuleAvailable(rentTrend) ? (
              <div>
                <RentTrendChart series={rentTrend} />
                <SourceMeta meta={rentTrend.meta} className="mt-5" />
              </div>
            ) : (
              <UnavailableModule reason={rentTrend.reason} />
            )}
          </ReportModule>

          {/* 3. Completed-sale context — separate surface, explicitly not rent. */}
          <ReportModule
            id="report-completed-sales"
            title={modules.completedSales}
            intro={reportCopy.completedSalesIntro}
            surface="sand"
            illustrative={report.isDemo}
          >
            <p className="font-bold">{reportCopy.completedSalesRule}</p>
            {isModuleAvailable(completedSales) ? (
              <div className="mt-4">
                {completedSales.note !== reportCopy.completedSalesRule ? (
                  <p className="text-ink">{completedSales.note}</p>
                ) : null}
                <div
                  className="overflow-x-auto"
                  tabIndex={0}
                  role="region"
                  aria-label="Illustrative completed sales table (scrollable)"
                >
                  <table className={tableClass}>
                    <caption className="sr-only">
                      Illustrative completed sales nearby — context only, not rent
                    </caption>
                    <thead>
                      <tr className={rowClass}>
                        <th scope="col" className={thClass}>
                          Period
                        </th>
                        <th scope="col" className={thClass}>
                          Property type
                        </th>
                        <th scope="col" className={thClass}>
                          Sold price
                        </th>
                        <th scope="col" className={thClass}>
                          Approximate location
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedSales.sales.map((sale) => (
                        <tr key={`${sale.period}-${sale.priceGbp}`} className={rowClass}>
                          <td className={tdClass}>{sale.period}</td>
                          <td className={tdClass}>{sale.propertyType}</td>
                          <td className={`${tdClass} tabular-nums`}>{formatGbp(sale.priceGbp)}</td>
                          <td className={tdClass}>{sale.approximateLocation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <SourceMeta meta={completedSales.meta} className="mt-5 text-ink" />
              </div>
            ) : (
              <div className="mt-4">
                <UnavailableModule reason={completedSales.reason} />
              </div>
            )}
          </ReportModule>

          {/* 4. Rental demand context */}
          <ReportModule
            id="report-demand"
            title={modules.demand}
            intro={reportCopy.demandIntro}
            illustrative={report.isDemo && isModuleAvailable(demand)}
          >
            {isModuleAvailable(demand) ? (
              <div>
                <dl className="grid gap-4 sm:grid-cols-2">
                  {demand.indicators.map((indicator) => (
                    <div key={indicator.label} className="rounded-md border border-stone-light p-4">
                      <dt className="text-sm font-bold text-stone">{indicator.label}</dt>
                      <dd className="mt-1 text-xl font-bold">{indicator.value}</dd>
                    </div>
                  ))}
                </dl>
                <SourceMeta meta={demand.meta} className="mt-5" />
              </div>
            ) : (
              <UnavailableModule reason={demand.reason} />
            )}
          </ReportModule>

          {/* 5. Licensing */}
          <ReportModule
            id="report-licensing"
            title={modules.licensing}
            illustrative={report.isDemo}
          >
            {isModuleAvailable(licensing) ? (
              <div>
                <p className="flex flex-wrap items-center gap-3">
                  <IllustrativeMarker>Caution</IllustrativeMarker>
                  <span className="text-xl font-bold">
                    {reportCopy.licensingFlags[licensing.flag]}
                  </span>
                </p>
                <p className="measure-body mt-3">{licensing.explanation}</p>
                <p className="mt-3">
                  <a
                    href={licensing.councilUrl}
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 font-bold text-brick underline underline-offset-4"
                  >
                    {reportCopy.licensingLink}
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </a>
                </p>
                <SourceMeta meta={licensing.meta} className="mt-5" />
              </div>
            ) : (
              <UnavailableModule reason={licensing.reason} />
            )}
          </ReportModule>

          {/* 6. Neutral crime context */}
          <ReportModule
            id="report-crime"
            title={modules.crime}
            intro={reportCopy.crimeIntro}
            illustrative={report.isDemo}
          >
            {isModuleAvailable(crime) ? (
              <div>
                <div
                  className="overflow-x-auto"
                  tabIndex={0}
                  role="region"
                  aria-label="Illustrative crime categories table (scrollable)"
                >
                  <table className={tableClass}>
                    <caption className="pb-2 text-left text-sm text-stone">
                      Period: {crime.periodLabel}
                    </caption>
                    <thead>
                      <tr className={rowClass}>
                        <th scope="col" className={thClass}>
                          Category
                        </th>
                        <th scope="col" className={thClass}>
                          Recorded incidents
                        </th>
                        <th scope="col" className={thClass}>
                          Trend
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {crime.categories.map((row) => (
                        <tr key={row.category} className={rowClass}>
                          <th scope="row" className={`${tdClass} font-bold`}>
                            {row.category}
                          </th>
                          <td className={`${tdClass} tabular-nums`}>{row.count}</td>
                          <td className={tdClass}>{trendLabels[row.trend]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 rounded-md bg-cream p-4">
                  <p className="font-bold">Limitations</p>
                  <p className="measure-body mt-1">{crime.limitations}</p>
                  <p className="measure-body mt-2">{reportCopy.crimeDisclaimer}</p>
                </div>
                <SourceMeta meta={crime.meta} className="mt-5" />
              </div>
            ) : (
              <UnavailableModule reason={crime.reason} />
            )}
          </ReportModule>

          {/* 7. Amenities and transport */}
          <ReportModule
            id="report-amenities"
            title={modules.amenities}
            intro={reportCopy.amenitiesIntro}
            illustrative={report.isDemo}
          >
            {isModuleAvailable(amenities) ? (
              <div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {amenities.items.map((item) => (
                    <li key={item.name} className="rounded-md border border-stone-light p-4">
                      <p className="font-bold">{item.name}</p>
                      <p className="text-stone">{item.approximateDistance}</p>
                    </li>
                  ))}
                </ul>
                <SourceMeta meta={amenities.meta} className="mt-5" />
              </div>
            ) : (
              <UnavailableModule reason={amenities.reason} />
            )}
          </ReportModule>

          {/* 8. Strengths and practical considerations */}
          <ReportModule
            id="report-considerations"
            title={modules.considerations}
            illustrative={report.isDemo}
          >
            {considerations ? (
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-lg font-bold">{reportCopy.strengthsHeading}</h4>
                  <ul className="mt-3 list-disc space-y-2 pl-5">
                    {considerations.strengths.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold">{reportCopy.practicalHeading}</h4>
                  <ul className="mt-3 list-disc space-y-2 pl-5">
                    {considerations.practicalConsiderations.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <UnavailableModule reason="Considerations are written during our review of the property." />
            )}
          </ReportModule>

          {/* 9. Illustrative scenarios */}
          <ReportModule
            id="report-scenarios"
            title={modules.scenarios}
            intro={reportCopy.scenariosIntro}
            illustrative={report.isDemo}
          >
            {isModuleAvailable(scenarios) ? (
              <div>
                <p className="font-bold">{scenarios.label}</p>
                <div
                  className="mt-4 overflow-x-auto"
                  tabIndex={0}
                  role="region"
                  aria-label="Illustrative scenarios table (scrollable)"
                >
                  <table className={tableClass}>
                    <caption className="sr-only">
                      Illustrative low, central and high scenarios per calendar month
                    </caption>
                    <thead>
                      <tr className={rowClass}>
                        <th scope="col" className={thClass}>
                          Horizon
                        </th>
                        <th scope="col" className={thClass}>
                          Low
                        </th>
                        <th scope="col" className={thClass}>
                          Central
                        </th>
                        <th scope="col" className={thClass}>
                          High
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenarios.scenarios.map((scenario) => (
                        <tr key={scenario.horizonYears} className={rowClass}>
                          <th scope="row" className={`${tdClass} font-bold`}>
                            {scenario.horizonYears === 1 ? "One year" : "Three years"}
                          </th>
                          <td className={`${tdClass} tabular-nums`}>{formatGbp(scenario.low)}</td>
                          <td className={`${tdClass} tabular-nums`}>
                            {formatGbp(scenario.central)}
                          </td>
                          <td className={`${tdClass} tabular-nums`}>{formatGbp(scenario.high)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <h4 className="mt-5 text-lg font-bold">{reportCopy.assumptionsHeading}</h4>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  {scenarios.assumptions.map((assumption) => (
                    <li key={assumption}>{assumption}</li>
                  ))}
                </ul>
                <SourceMeta meta={scenarios.meta} className="mt-5" />
              </div>
            ) : (
              <UnavailableModule reason={scenarios.reason} />
            )}
          </ReportModule>

          {/* 10. Next step — human-confirmed appraisal. */}
          <ReportModule id="report-next-step" title={modules.nextStep} surface="dark">
            <p className="measure-body text-lg">{reportCopy.nextStep.lead}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="bg-white text-ink hover:bg-sand">
                <a href={whatsapp}>
                  <MessageCircle aria-hidden="true" />
                  {reportCopy.nextStep.cta}
                </a>
              </Button>
              <p className="text-sand">
                WhatsApp {business.whatsapp.displayNumber}. {business.meetings}
              </p>
            </div>
            <dl className="mt-6 flex flex-wrap gap-x-3 gap-y-1 border-t border-cream/20 pt-4 text-base">
              <dt className="font-bold text-sand">{reportCopy.nextStep.reviewLabel}:</dt>
              <dd>{reportCopy.humanReviewStates[report.humanReviewState]}</dd>
            </dl>
            <p className="measure-body mt-4 text-base text-sand">{report.disclaimer}</p>
          </ReportModule>
        </div>
      </div>
    </section>
  );
}
