import { RentHistoryChart } from "@/components/appraisal/rent-history-chart";
import { DemoBadge } from "@/components/properties/demo-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { business } from "@/config/business";
import { demoLabels } from "@/content/demo-labels";
import { currentStatusLabels, type AppraisalRequest, type RentalReport, type RentalReportOutcome } from "@/lib/appraisal/types";
import { formatGbp, formatUkDate } from "@/lib/format";
import { getArea } from "@/lib/listings/areas";
import { propertyTypeLabels } from "@/lib/listings/types";
import { whatsappHref } from "@/lib/whatsapp";

/** The illustrative range with assumptions, data freshness, evidence and the demonstration chart. */
export function ReportPanel({ report }: { report: RentalReport }) {
  const { request } = report;
  const areaName = request.area ? getArea(request.area)?.name : null;
  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="range-heading" className="rounded-lg bg-ink p-6 text-cream md:p-8" data-surface="dark">
        <p className="text-eyebrow text-sand">Indicative rental estimate</p>
        <h2 id="range-heading" className="mt-2 text-2xl md:text-3xl">
          Illustrative monthly range
        </h2>
        <p className="mt-4 text-4xl font-bold md:text-5xl">
          {formatGbp(report.lowPcm)} – {formatGbp(report.highPcm)}
          <span className="ml-2 text-xl font-normal text-cream/80">per month</span>
        </p>
        <p className="mt-3 text-cream/85">
          For a {request.bedrooms === 5 ? "five-or-more-bedroom" : `${request.bedrooms}-bedroom`}{" "}
          {propertyTypeLabels[request.propertyType].toLowerCase()} in{" "}
          {areaName ? `${areaName}, Peterborough` : "Peterborough"} · {currentStatusLabels[request.currentStatus].toLowerCase()}.
        </p>
        <p className="mt-4 inline-flex rounded-sm border border-sand bg-cream px-3 py-1.5 font-bold text-ink">
          {demoLabels.estimate}
        </p>
        <p className="mt-4 text-base text-cream/85">
          A rental appraisal is confirmed by us after reviewing the property, its condition and the
          current market. This range is a demonstration and is not a valuation, a guaranteed rent or a
          forecast.
        </p>
      </section>

      <section aria-labelledby="assumptions-heading" className="rounded-lg bg-white p-6 shadow-soft md:p-8">
        <h2 id="assumptions-heading" className="text-2xl">
          Assumptions behind this range
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {report.assumptions.map((a) => (
            <li key={a} className="flex gap-3">
              <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rounded-full bg-brick" />
              <span>{a}</span>
            </li>
          ))}
        </ul>
        <h3 className="mt-6 text-xl">Data freshness</h3>
        <p className="mt-2 text-stone">
          Data observed on <strong className="text-ink">{formatUkDate(report.dataFreshness.observedOn)}</strong>;
          report generated {formatUkDate(report.generatedOn)}; model version {report.modelVersion}.{" "}
          {report.dataFreshness.note}
        </p>
        <h3 className="mt-6 text-xl">Evidence used</h3>
        <ul className="mt-2 flex flex-col gap-2 text-stone">
          {report.evidence.map((e) => (
            <li key={e.label}>
              <strong className="text-ink">{e.label}</strong> — {e.source} (kind: {e.kind}; observed{" "}
              {formatUkDate(e.observedOn)}; retrieved {formatUkDate(e.retrievedOn)}).
            </li>
          ))}
        </ul>
        <p className="mt-4 text-stone">
          Comparable properties used: {report.comparableCount} · confidence: {report.confidence}. No
          crime score and no future-price forecast are shown — they will only appear when a reliable,
          sourced dataset exists and has been approved.
        </p>
      </section>

      <RentHistoryChart points={report.rentHistory} title="Demonstration rent history for this property type" />
    </div>
  );
}

/**
 * Honest non-result states: the adapter had too little evidence to publish a
 * range, or the data source was unavailable. Nothing is guessed; the visitor is
 * told why and routed to a human-confirmed appraisal.
 */
export function OutcomePanel({ outcome }: { outcome: Exclude<RentalReportOutcome, { status: "ok" }> }) {
  const insufficient = outcome.status === "insufficient-evidence";
  return (
    <div
      className="rounded-lg border-2 border-dashed border-stone-light bg-cream/60 p-6 md:p-8"
      role="status"
      data-appraisal-outcome={outcome.status}
    >
      <p className="text-eyebrow text-stone">{insufficient ? "Not enough evidence" : "Estimate unavailable"}</p>
      <h2 className="mt-2 text-2xl">{insufficient ? "We would rather not guess" : "The estimate is unavailable right now"}</h2>
      <p className="measure-body mt-3 text-ink">{outcome.reason}</p>
      {insufficient ? (
        <p className="measure-body mt-2 text-stone">
          Comparable properties found: {outcome.comparableCount}. A range is only shown when the evidence
          behind it is strong enough to be useful.
        </p>
      ) : (
        <p className="measure-body mt-2 text-stone">Please try again shortly, or ask us directly.</p>
      )}
      <p className="measure-body mt-4 text-ink">
        A verified rental appraisal does not depend on this tool: send us the property details and we
        will confirm a recommendation after reviewing the property properly.
      </p>
    </div>
  );
}

/**
 * Step 2 — "Send us the details". Collected separately from the estimate
 * step so nothing personal ever enters a URL. Form delivery is not yet
 * configured (owner-decision register), so the form is shown in its honest
 * disabled state with the WhatsApp route beside it; the pre-filled message
 * carries only the property characteristics, never the visitor's details.
 */
export function ContactStep({ request }: { request: AppraisalRequest | null }) {
  const message = request
    ? `Hello Red Brick, I'd like a verified rental appraisal for a ${request.bedrooms === 5 ? "5+" : request.bedrooms}-bedroom ${propertyTypeLabels[request.propertyType].toLowerCase()}${request.area ? ` in ${getArea(request.area)?.name}` : ""}, Peterborough.`
    : "Hello Red Brick, I'd like to ask about a verified rental appraisal.";
  const labelClass = "block text-base font-bold text-ink";
  return (
    <section aria-labelledby="contact-step-heading" className="rounded-lg bg-white p-6 shadow-soft md:p-8">
      <h2 id="contact-step-heading" className="text-2xl">
        Send us the details for a proper appraisal
      </h2>
      <p className="mt-2 text-stone">
        We confirm a recommendation after seeing the property. Message us on WhatsApp now, or use the
        form once online delivery is switched on.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Button asChild size="lg">
          <a href={whatsappHref(business.whatsapp.e164, message)}>Request a verified rental appraisal</a>
        </Button>
        <span className="text-stone">WhatsApp {business.whatsapp.displayNumber}</span>
      </div>

      <fieldset disabled className="mt-8 grid gap-5 sm:grid-cols-2" aria-describedby="contact-form-note">
        <legend className="text-eyebrow text-stone">Online form — not yet active</legend>
        <p id="contact-form-note" className="sm:col-span-2 text-base text-stone">
          These fields are shown so you can see what we will ask. They do not send anything yet:
          form delivery, spam protection and the privacy notice are being set up (nothing you type
          here is stored or transmitted).
        </p>
        <div className="sm:col-span-2">
          <label htmlFor="contact-address" className={labelClass}>Property address</label>
          <Input id="contact-address" name="address" autoComplete="off" className="mt-1.5" />
        </div>
        <div>
          <label htmlFor="contact-name" className={labelClass}>Your name</label>
          <Input id="contact-name" name="name" autoComplete="off" className="mt-1.5" />
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelClass}>Phone or email</label>
          <Input id="contact-phone" name="contact" autoComplete="off" className="mt-1.5" />
        </div>
        <div className="sm:col-span-2">
          <Button type="button" variant="outline" disabled>
            Send details (not yet active)
          </Button>
        </div>
      </fieldset>
      <p className="mt-4 text-base text-stone">{business.meetings}</p>
      <DemoBadge kind="estimate" className="mt-4" />
    </section>
  );
}
