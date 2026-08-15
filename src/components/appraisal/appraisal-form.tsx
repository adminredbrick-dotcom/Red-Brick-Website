import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { appraisalFormCopy } from "@/content/appraisal-copy";
import { furnishingLabels, propertyTypeLabels } from "@/data/contracts/listing";
import { propertyConditionLabels } from "@/data/contracts/rental-report";
import { routes } from "@/config/site";
import { cn } from "@/lib/utils";

import type { AppraisalFormValues } from "./form-params";
import { NoticeBanner } from "./notice-banner";

interface AppraisalFormProps {
  /** Values from a previous GET submission, re-populated so the journey feels continuous. */
  values?: AppraisalFormValues;
  /** Fragment the browser should land on after submitting. */
  resultAnchor?: string;
}

const STEP_COUNT = appraisalFormCopy.steps.length;

const bedroomOptions = [
  { value: "0", label: "Studio" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6 or more" },
];

const bathroomOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4 or more" },
];

const selectClass =
  "flex min-h-12 w-full rounded-md border border-stone bg-white px-4 py-2 text-base text-ink";

function StepLegend({ index, title, hint }: { index: number; title: string; hint: string }) {
  return (
    <legend className="mb-5 max-w-prose">
      <span className="text-eyebrow block text-brick">
        Step {index + 1} of {STEP_COUNT}
      </span>
      <span className="mt-1 block text-2xl font-bold text-ink">{title}</span>
      <span className="mt-2 block text-base text-stone">{hint}</span>
    </legend>
  );
}

function YesNo({
  name,
  legend,
  value,
}: {
  name: "parking" | "garden";
  legend: string;
  value?: string;
}) {
  return (
    <fieldset>
      <legend className="text-base font-bold text-ink">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
        {(["yes", "no"] as const).map((option) => {
          const id = `${name}-${option}`;
          return (
            <div key={option} className="flex min-h-11 items-center gap-3">
              <input
                type="radio"
                id={id}
                name={name}
                value={option}
                defaultChecked={value === option}
                className="size-5 accent-brick"
              />
              <label htmlFor={id} className="text-base text-ink">
                {option === "yes" ? "Yes" : "No"}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * The stepped estimate journey as ONE plain GET form. All four steps are
 * visible, numbered fieldsets — no wizard, no JavaScript, nothing hidden.
 * Submitting reloads the page with the (fixed) illustrative report.
 */
export function AppraisalForm({
  values = {},
  resultAnchor = "illustrative-report",
}: AppraisalFormProps) {
  const [locationStep, factsStep, conditionStep, contactStep] = appraisalFormCopy.steps;
  const fieldsetClass =
    "border-t border-stone-light pt-8 first-of-type:border-t-0 first-of-type:pt-0";

  return (
    <form
      id="appraisal-form"
      method="get"
      action={`${routes.rentalAppraisal.path}#${resultAnchor}`}
      className="rounded-lg bg-white p-6 shadow-soft md:p-8"
      aria-describedby="appraisal-form-notice"
    >
      <input type="hidden" name="report" value="1" />

      <p className="text-base text-stone">{STEP_COUNT} steps, all shown on this page.</p>

      <div className="mt-6 space-y-8">
        <fieldset className={fieldsetClass}>
          <StepLegend index={0} title={locationStep?.title ?? ""} hint={locationStep?.hint ?? ""} />
          <div className="max-w-md">
            <Label htmlFor="location">Address or postcode</Label>
            <Input
              id="location"
              name="location"
              type="text"
              autoComplete="postal-code"
              placeholder="For example, PE1 or a street name"
              className="mt-2"
              defaultValue={values.location}
              maxLength={120}
            />
          </div>
        </fieldset>

        <fieldset className={fieldsetClass}>
          <StepLegend index={1} title={factsStep?.title ?? ""} hint={factsStep?.hint ?? ""} />
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2 sm:max-w-md">
              <Label htmlFor="propertyType">Property type</Label>
              <select
                id="propertyType"
                name="propertyType"
                className={cn(selectClass, "mt-2")}
                defaultValue={values.propertyType ?? ""}
              >
                <option value="">Choose a type</option>
                {Object.entries(propertyTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <select
                id="bedrooms"
                name="bedrooms"
                className={cn(selectClass, "mt-2")}
                defaultValue={values.bedrooms ?? ""}
              >
                <option value="">Choose</option>
                {bedroomOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <select
                id="bathrooms"
                name="bathrooms"
                className={cn(selectClass, "mt-2")}
                defaultValue={values.bathrooms ?? ""}
              >
                <option value="">Choose</option>
                {bathroomOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className={fieldsetClass}>
          <StepLegend
            index={2}
            title={conditionStep?.title ?? ""}
            hint={conditionStep?.hint ?? ""}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="condition">Condition</Label>
              <select
                id="condition"
                name="condition"
                className={cn(selectClass, "mt-2")}
                defaultValue={values.condition ?? ""}
              >
                <option value="">Choose</option>
                {Object.entries(propertyConditionLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="furnishing">Furnishing</Label>
              <select
                id="furnishing"
                name="furnishing"
                className={cn(selectClass, "mt-2")}
                defaultValue={values.furnishing ?? ""}
              >
                <option value="">Choose</option>
                {Object.entries(furnishingLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <YesNo name="parking" legend="Parking" value={values.parking} />
            <YesNo name="garden" legend="Garden" value={values.garden} />
            <div className="sm:col-span-2">
              <Label htmlFor="details">Optional details</Label>
              <p id="details-hint" className="mt-1 text-base text-stone">
                Anything that would affect the rent — recent works, an en suite, an annexe, white
                goods included.
              </p>
              <Textarea
                id="details"
                name="details"
                className="mt-2"
                aria-describedby="details-hint"
                defaultValue={values.details}
                maxLength={500}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className={fieldsetClass}>
          <StepLegend index={3} title={contactStep?.title ?? ""} hint={contactStep?.hint ?? ""} />
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="contactName">Your name (optional)</Label>
              <Input
                id="contactName"
                name="contactName"
                type="text"
                autoComplete="name"
                className="mt-2"
                maxLength={120}
              />
            </div>
            <div className="sm:col-span-2 flex min-h-11 items-start gap-3">
              <input
                type="checkbox"
                id="contactConsent"
                name="contactConsent"
                value="yes"
                className="mt-1 size-5 shrink-0 accent-brick"
              />
              <label htmlFor="contactConsent" className="text-base text-ink">
                I would like Red Brick Lettings to contact me by WhatsApp or telephone to confirm
                the estimate. (Optional — not yet active in this demonstration.)
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      <div className="mt-8 space-y-5">
        <NoticeBanner title={appraisalFormCopy.demoNotice.title}>
          <p id="appraisal-form-notice">{appraisalFormCopy.demoNotice.body}</p>
        </NoticeBanner>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg">
            {appraisalFormCopy.submit}
          </Button>
          <Button asChild variant="ghost">
            <a href={routes.rentalAppraisal.path}>{appraisalFormCopy.reset}</a>
          </Button>
        </div>
      </div>
    </form>
  );
}
