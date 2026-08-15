import { trustPoints } from "@/content/approved-copy";
import { trustIntro } from "@/content/home-copy";

/**
 * Local trust: only the three verified points, no invented numbers.
 * The approved introduction leads the section.
 */
export function TrustStrip() {
  return (
    <section aria-labelledby="trust-heading" className="border-b border-stone-light bg-white">
      <div className="container-rb py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <div>
            <p className="text-eyebrow text-brick">Red Brick Lettings</p>
            <h2 id="trust-heading" className="mt-3 text-2xl md:text-3xl">
              {trustIntro.heading}
            </h2>
            <p className="measure-body mt-4 text-stone">{trustIntro.body}</p>
          </div>

          <dl className="grid gap-6 sm:grid-cols-3 lg:self-center">
            {trustPoints.map((point) => (
              <div key={point.heading} className="border-t-2 border-brick pt-4">
                <dt className="text-lg font-bold">{point.heading}</dt>
                <dd className="mt-2 text-base text-stone">{point.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
