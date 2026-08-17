import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { MediaStory } from "@/components/home/media/media-story";
import { Button } from "@/components/ui/button";
import { business } from "@/config/business";
import { homeClosing, homeInsights, homeIntro, homeMaintenance } from "@/content/home";
import { whatsappHref } from "@/lib/whatsapp";

/** 3. Local introduction + scroll-led stock-footage story (white surface). */
export function IntroAndMediaStory() {
  return (
    <section aria-labelledby="intro-heading" className="bg-white">
      <div className="container-rb py-16 md:py-24">
        <div className="max-w-3xl">
          <p className="text-eyebrow text-brick">{homeIntro.eyebrow}</p>
          <h2 id="intro-heading" className="text-section mt-3">
            {homeIntro.heading}
          </h2>
          <p className="measure-body mt-5 text-lg text-stone">{homeIntro.body}</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Verifiable facts">
            {homeIntro.facts.map((fact) => (
              <li key={fact} className="rounded-sm bg-sand px-3 py-1.5 text-base font-bold text-ink">
                {fact}
              </li>
            ))}
          </ul>
        </div>
        <MediaStory />
      </div>
    </section>
  );
}

/** 7. Maintenance — Report → Triage → Arrange → Update → Resolve. */
export function MaintenanceSection() {
  return (
    <section aria-labelledby="maintenance-heading" className="bg-white">
      <div className="container-rb py-16 md:py-20">
        <p className="text-eyebrow text-brick">{homeMaintenance.eyebrow}</p>
        <h2 id="maintenance-heading" className="text-section mt-3 max-w-3xl">
          {homeMaintenance.heading}
        </h2>
        <p className="measure-body mt-4 text-lg text-stone">{homeMaintenance.body}</p>
        <ol className="mt-8 grid gap-3 sm:grid-cols-5" aria-label="Maintenance steps">
          {homeMaintenance.steps.map((step, i) => (
            <li key={step} className="rounded-lg bg-cream p-4">
              <p className="text-eyebrow text-stone">Step {i + 1}</p>
              <p className="mt-1 text-xl font-bold text-ink">{step}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Button asChild variant="outline" size="lg">
            <Link href={homeMaintenance.action.href}>{homeMaintenance.action.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/** 8. Insights preview — honest empty state until articles exist. */
export function InsightsSection() {
  return (
    <section aria-labelledby="insights-heading" className="bg-cream">
      <div className="container-rb py-16 md:py-20">
        <p className="text-eyebrow text-brick">{homeInsights.eyebrow}</p>
        <h2 id="insights-heading" className="text-section mt-3 max-w-3xl">
          {homeInsights.heading}
        </h2>
        <p className="measure-body mt-4 text-lg text-stone">{homeInsights.body}</p>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {homeInsights.categories.map((c) => (
            <li key={c.label} className="rounded-lg bg-white p-6 shadow-soft">
              <h3 className="text-xl">{c.label}</h3>
              <p className="mt-2 text-stone">{c.note}</p>
              <p className="mt-3 text-sm text-stone">First articles to follow.</p>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link href={homeInsights.action.href}>{homeInsights.action.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/** 9. WhatsApp conclusion — deep brick band. */
export function ClosingSection() {
  return (
    <section aria-labelledby="closing-heading" className="bg-brick-deep text-cream" data-surface="dark">
      <div className="container-rb flex flex-col items-start gap-6 py-16 md:py-20 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-eyebrow text-sand">{homeClosing.eyebrow}</p>
          <h2 id="closing-heading" className="text-section mt-3">
            {homeClosing.heading}
          </h2>
          <p className="measure-body mt-4 text-lg text-cream/85">{homeClosing.body}</p>
        </div>
        <div className="flex flex-col items-start gap-3">
          <Button asChild size="lg" className="bg-white text-ink hover:bg-sand">
            <a href={whatsappHref()}>
              <MessageCircle aria-hidden="true" />
              {homeClosing.cta}
            </a>
          </Button>
          <p className="text-cream/85">WhatsApp {business.whatsapp.displayNumber}</p>
          <p className="text-cream/70">{business.meetings}</p>
        </div>
      </div>
    </section>
  );
}
