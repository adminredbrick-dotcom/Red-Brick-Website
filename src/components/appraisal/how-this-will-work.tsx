import { howThisWillWorkCopy } from "@/content/appraisal-copy";

/**
 * Honest explanation of how the production estimate will be built.
 * Complementary content — an aside, not part of the report.
 */
export function HowThisWillWork() {
  return (
    <aside
      aria-labelledby="how-this-will-work-heading"
      className="rounded-lg border-2 border-sand bg-sand/60 p-6 md:p-8"
    >
      <p className="text-eyebrow text-brick">Behind the estimate</p>
      <h2 id="how-this-will-work-heading" className="mt-2 text-2xl">
        {howThisWillWorkCopy.heading}
      </h2>
      <div className="measure-body mt-4 space-y-4 text-ink">
        {howThisWillWorkCopy.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </aside>
  );
}
