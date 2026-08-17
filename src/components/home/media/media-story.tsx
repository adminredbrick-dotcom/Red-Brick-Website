"use client";

import * as React from "react";

import { STOCK_LABEL, storyBeats } from "@/content/home-media";
import { cn } from "@/lib/utils";

import { PosterVideo } from "./poster-video";

/**
 * Scroll-led stock-footage story. Five beats, each a poster-first media
 * frame with HTML heading and caption. A single IntersectionObserver picks
 * the most visible beat and grants it — and only it — permission to play, so
 * at most one video plays at any time. With no derivatives encoded, every
 * beat is a poster; the copy reads fully without any media.
 */
export function MediaStory() {
  const rootRef = React.useRef<HTMLOListElement>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-beat]"));
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set((e.target as HTMLElement).dataset.beat!, e.isIntersecting ? e.intersectionRatio : 0);
        let best: string | null = null;
        let bestRatio = 0.55;
        for (const [id, r] of ratios) if (r > bestRatio) [best, bestRatio] = [id, r];
        setActiveId(best);
      },
      { threshold: [0, 0.25, 0.55, 0.75, 1] },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={rootRef} className="mt-12 flex flex-col gap-16 md:gap-24" aria-label="The story in pictures">
      {storyBeats.map((beat, i) => {
        const flip = i % 2 === 1;
        return (
          <li
            key={beat.id}
            data-beat={beat.id}
            className={cn("grid items-center gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-12", flip && "lg:[&>*:first-child]:order-2")}
          >
            <PosterVideo
              poster={beat.poster}
              sources={beat.sources}
              alt={beat.alt}
              width={1400}
              height={788}
              allowed={activeId === beat.id}
              className="aspect-video"
            />
            <div className="max-w-md">
              <p className="text-eyebrow text-brick">Beat {i + 1} of {storyBeats.length}</p>
              <h3 className="mt-2 text-2xl md:text-3xl">{beat.heading}</h3>
              <p className="mt-3 text-stone">{beat.caption}</p>
              <p className="mt-3 text-sm text-stone">{STOCK_LABEL}.</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
