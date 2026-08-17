import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { bedroomChoices, currentStatusLabels, currentStatusOptions, type AppraisalRequest } from "@/lib/appraisal/types";
import { areas } from "@/lib/listings/areas";
import { propertyTypeLabels, propertyTypes } from "@/lib/listings/types";

interface AppraisalFormProps {
  /** Current values (from the URL) or null for a fresh form. */
  request: AppraisalRequest | null;
  /** True when the URL carried values that did not validate. */
  invalid?: boolean;
}

/**
 * Step 1 — "About the property". A GET form: only non-personal property
 * characteristics travel in the URL (area, type, bedrooms, current status),
 * so the result is shareable and works without JavaScript. Address and
 * contact details are collected separately (see ContactStep) and never in
 * a query string.
 */
export function AppraisalForm({ request, invalid = false }: AppraisalFormProps) {
  const labelClass = "block text-base font-bold text-ink";
  return (
    <form
      method="get"
      action="/rental-appraisal#result"
      aria-labelledby="appraisal-form-heading"
      className="rounded-lg bg-white p-6 shadow-soft md:p-8"
    >
      <h2 id="appraisal-form-heading" className="text-2xl">
        About the property
      </h2>
      <p className="mt-2 text-stone">
        Four quick answers give you an illustrative range straight away. No personal details are
        needed for this step.
      </p>
      {invalid ? (
        <p role="alert" className="mt-4 rounded-md border-l-4 border-error bg-white px-4 py-3 text-ink">
          Please choose a property type, number of bedrooms and current status to see a range.
        </p>
      ) : null}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="appraisal-area" className={labelClass}>
            Peterborough area
          </label>
          <Select id="appraisal-area" name="area" defaultValue={request?.area ?? ""} className="mt-1.5">
            <option value="">Not sure / anywhere in Peterborough</option>
            {areas.map((area) => (
              <option key={area.key} value={area.key}>
                {area.name} ({area.outwardPostcode})
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="appraisal-type" className={labelClass}>
            Property type
          </label>
          <Select id="appraisal-type" name="type" defaultValue={request?.propertyType ?? ""} required className="mt-1.5">
            <option value="">Choose a type</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {propertyTypeLabels[type]}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="appraisal-beds" className={labelClass}>
            Bedrooms
          </label>
          <Select id="appraisal-beds" name="beds" defaultValue={request?.bedrooms ?? ""} required className="mt-1.5">
            <option value="">Choose</option>
            {bedroomChoices.map((n) => (
              <option key={n} value={n}>
                {n === 5 ? "5 or more" : n}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="appraisal-status" className={labelClass}>
            Current status
          </label>
          <Select id="appraisal-status" name="status" defaultValue={request?.currentStatus ?? ""} required className="mt-1.5">
            <option value="">Choose</option>
            {currentStatusOptions.map((status) => (
              <option key={status} value={status}>
                {currentStatusLabels[status]}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg">
          Show my illustrative range
        </Button>
        {request ? (
          <a href="/rental-appraisal" className="inline-flex min-h-11 items-center px-2 font-bold text-brick underline underline-offset-4">
            Start again
          </a>
        ) : null}
      </div>
    </form>
  );
}
