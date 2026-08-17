import Link from "next/link";

import { AudienceActions } from "@/components/home/audience/audience-actions";
import { PosterVideo } from "@/components/home/media/poster-video";
import { STOCK_LABEL, heroMedia } from "@/content/home-media";
import { homeHero } from "@/content/home";

interface HeroProps {
  storyTargetId: string;
}

/**
 * Cinematic hero. Live semantic text and the three actions render first
 * (server HTML). The media frame is a poster (the LCP element) with a
 * play-once, never-looping video layered on for eligible desktops when a
 * derivative exists. Text contrast never depends on the frame.
 */
export function Hero({ storyTargetId }: HeroProps) {
  return (
    <section aria-labelledby="hero-heading" className="bg-cream">
      <div className="container-rb grid gap-10 pb-14 pt-10 md:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-14 lg:pb-20">
        <div>
          <p className="text-eyebrow text-brick">{homeHero.eyebrow}</p>
          <h1 id="hero-heading" className="mt-4 text-[clamp(2.5rem,2.4vw+1.5rem,4.25rem)]">
            <span className="text-brick">Property cared for.</span>{" "}
            <span className="text-ink">People looked after.</span>
          </h1>
          <p className="measure-body mt-6 text-lg text-stone md:text-xl">{homeHero.supporting}</p>
          <p className="mt-8 text-eyebrow text-ink" id="hero-prompt">
            {homeHero.prompt}
          </p>
          <AudienceActions storyTargetId={storyTargetId} className="mt-4" />
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-base" aria-label="More routes">
            {homeHero.secondary.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-bold text-brick underline underline-offset-4 hover:text-brick-deep">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <figure className="min-w-0">
          <PosterVideo
            poster={heroMedia.poster}
            posterMobile={heroMedia.posterMobile}
            sources={heroMedia.sources}
            alt={heroMedia.alt}
            width={1440}
            height={810}
            priority
            className="aspect-[4/5] sm:aspect-video shadow-soft"
          />
          <figcaption className="mt-2 text-sm text-stone">{STOCK_LABEL}.</figcaption>
        </figure>
      </div>
    </section>
  );
}
