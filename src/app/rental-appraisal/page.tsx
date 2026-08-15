import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { AppraisalForm } from "@/components/appraisal/appraisal-form";
import {
  hasReportRequest,
  readFormValues,
  toReportInput,
  type SearchParams,
} from "@/components/appraisal/form-params";
import { HowThisWillWork } from "@/components/appraisal/how-this-will-work";
import { IllustrativeReport } from "@/components/appraisal/illustrative-report";
import { routes } from "@/config/site";
import { appraisalFormCopy, appraisalIntroCopy } from "@/content/appraisal-copy";
import { getMarketDataRepository } from "@/data/repositories/market-data";

export const metadata: Metadata = {
  title: routes.rentalAppraisal.title,
  description: routes.rentalAppraisal.description,
};

interface RentalAppraisalPageProps {
  searchParams: Promise<SearchParams>;
}

const REPORT_ANCHOR = "illustrative-report";
const FORM_ANCHOR = "appraisal-form";

/**
 * Indicative rental estimate journey.
 *
 * Phase 2 is a static demonstration: the GET form re-renders this page and,
 * when any field or `?report=1` is present, shows ONE fixed illustrative
 * report from the demo market-data adapter. Nothing is calculated, sent or
 * stored; contact fields are never read.
 */
export default async function RentalAppraisalPage({ searchParams }: RentalAppraisalPageProps) {
  const params = await searchParams;
  const showReport = hasReportRequest(params);
  const values = readFormValues(params);

  const report = showReport
    ? await (await getMarketDataRepository()).buildReport(toReportInput(values))
    : null;

  return (
    <>
      <section className="container-rb pb-10 pt-12 md:pb-14 md:pt-20">
        <p className="text-eyebrow text-brick">{appraisalIntroCopy.eyebrow}</p>
        <h1 className="text-section mt-3 max-w-3xl">{appraisalIntroCopy.heading}</h1>
        <p className="measure-body mt-5 text-lg text-stone md:text-xl">{appraisalIntroCopy.lede}</p>
        <p className="mt-6">
          <a
            href={`${routes.rentalAppraisal.path}?report=1#${REPORT_ANCHOR}`}
            className="inline-flex min-h-11 items-center gap-2 font-bold text-brick underline underline-offset-4"
          >
            {appraisalIntroCopy.exampleLink}
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <span className="block text-base text-stone">{appraisalIntroCopy.exampleLinkHint}</span>
        </p>
      </section>

      <section aria-labelledby="appraisal-form-heading" className="container-rb pb-14 md:pb-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="min-w-0">
            <h2 id="appraisal-form-heading" className="text-2xl md:text-3xl">
              {appraisalFormCopy.heading}
            </h2>
            <p className="measure-body mt-3 text-stone">{appraisalFormCopy.intro}</p>
            <div className="mt-6">
              <AppraisalForm values={values} resultAnchor={REPORT_ANCHOR} />
            </div>
          </div>
          <div className="lg:sticky lg:top-6">
            <HowThisWillWork />
          </div>
        </div>
      </section>

      {report ? (
        <IllustrativeReport report={report} id={REPORT_ANCHOR} formAnchor={FORM_ANCHOR} />
      ) : null}
    </>
  );
}
