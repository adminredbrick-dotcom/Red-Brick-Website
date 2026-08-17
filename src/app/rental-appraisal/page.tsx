import type { Metadata } from "next";

import { AppraisalForm } from "@/components/appraisal/appraisal-form";
import { ContactStep, ReportPanel } from "@/components/appraisal/report";
import { PageIntro } from "@/components/shared/page-intro";
import { routes } from "@/config/site";
import { parseAppraisalRequest, rentalReportAdapter } from "@/lib/appraisal/demo-adapter";
import type { RentalReport } from "@/lib/appraisal/types";

export const metadata: Metadata = {
  title: routes.rentalAppraisal.title,
  description: routes.rentalAppraisal.description,
};

interface RentalAppraisalPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * "What could your property rent for?" — a short GET form (area, type,
 * bedrooms, current status) that returns an illustrative range with its
 * assumptions, data freshness, evidence and a demonstration rent-history
 * chart. Contact details are a separate, currently inert step.
 */
export default async function RentalAppraisalPage({ searchParams }: RentalAppraisalPageProps) {
  const raw = await searchParams;
  const attempted = Object.keys(raw).length > 0;
  const request = parseAppraisalRequest(raw);
  const report: RentalReport | null = request ? await rentalReportAdapter.estimate(request) : null;

  return (
    <>
      <PageIntro
        eyebrow="Indicative rental estimate"
        heading="What could your property rent for?"
        lede="An indicative rental estimate is a starting point, not a valuation. Answer four questions for an illustrative range, then send us the details and we will confirm a recommendation after reviewing the property, its condition and the current market."
      />

      <section className="bg-white">
        <div className="container-rb grid gap-8 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-12">
          <div className="flex flex-col gap-8">
            <AppraisalForm request={request} invalid={attempted && !request} />
            <ContactStep report={report} />
          </div>
          <div id="result" className="min-w-0 scroll-mt-6">
            {report ? (
              <ReportPanel report={report} />
            ) : (
              <div className="rounded-lg border-2 border-dashed border-stone-light bg-cream/60 p-6 md:p-8">
                <p className="text-eyebrow text-stone">Your range appears here</p>
                <h2 className="mt-2 text-2xl">No range yet</h2>
                <p className="measure-body mt-3 text-stone">
                  Choose the property type, bedrooms and current status, then select “Show my
                  illustrative range”. You will see a monthly range, the assumptions behind it, how
                  fresh the data is and a demonstration rent-history chart. Every figure is labelled
                  as illustrative — it is not a valuation.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
