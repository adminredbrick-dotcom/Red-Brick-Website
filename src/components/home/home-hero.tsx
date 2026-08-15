import { AudienceChoiceForm } from "@/components/home/audience-switch";
import { HeroIllustration } from "@/components/home/hero-illustration";
import { heroCopy } from "@/content/approved-copy";
import { heroMediaCaption } from "@/content/home-copy";

interface HomeHeroProps {
  /** Id of the house-story section the audience choice leads to. */
  storyId: string;
}

/**
 * Cinematic, static hero. Everything that matters is HTML rendered before
 * any media: eyebrow, H1, supporting copy, the audience question and the
 * three approved actions. The media frame is poster-ready for the Phase 3
 * film and today holds an original inline illustration.
 */
export function HomeHero({ storyId }: HomeHeroProps) {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      data-surface="dark"
      className="relative overflow-hidden bg-ink text-cream"
    >
      {/* Subtle warm light, not a colour gradient. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_18%,rgb(243_217_164/0.14),transparent_58%)]"
      />

      <div className="container-rb relative py-14 md:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
          <div>
            <p className="text-eyebrow text-sand">{heroCopy.eyebrow}</p>
            <h1 id="hero-heading" className="text-hero mt-4 max-w-4xl text-cream">
              {heroCopy.heading}
            </h1>
            <p className="measure-body mt-6 text-lg text-cream/85 md:text-xl">
              {heroCopy.supporting}
            </p>

            <AudienceChoiceForm targetId={storyId} className="mt-10 lg:mt-12" />
          </div>

          <figure className="order-last flex flex-col lg:order-none lg:self-stretch">
            <div className="aspect-[16/10] w-full overflow-hidden rounded-lg ring-1 ring-cream/10 sm:aspect-[16/9] lg:aspect-auto lg:min-h-[28rem] lg:flex-1">
              <HeroIllustration />
            </div>
            <figcaption className="mt-2 text-sm text-cream/65">{heroMediaCaption}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
