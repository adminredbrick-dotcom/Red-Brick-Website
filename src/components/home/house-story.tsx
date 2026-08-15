import Link from "next/link";

import { showFor } from "@/components/home/audience";
import { AudienceSwitch } from "@/components/home/audience-switch";
import { HouseIllustration } from "@/components/home/house-illustration";
import { Button } from "@/components/ui/button";
import {
  stageNames,
  storyEntry,
  storySets,
  type HouseStage,
  type StorySet,
} from "@/content/house-story";
import { storyControls } from "@/content/home-copy";
import { cn } from "@/lib/utils";

interface HouseStoryProps {
  /** Section id (focus/skip target). */
  id: string;
  /** Id of the section that "Skip the story" jumps to. */
  skipToId: string;
}

const THUMBNAIL_STAGES: readonly HouseStage[] = [0, 1, 2, 3, 4];

/**
 * The static house story — the emotional centre of the homepage and the
 * storyboard for the Phase 3 scroll sequence.
 *
 * All three chapter sets (shared, landlord, tenant) are rendered on the
 * server; CSS attribute rules keyed on the wrapper's `data-audience` show one
 * set at a time. With no JavaScript and no parameter the shared story shows.
 * Desktop: sticky illustration panel (~55%) beside the chapter copy.
 * Mobile: a small illustration above each chapter, ordinary vertical copy.
 */
export function HouseStory({ id, skipToId }: HouseStoryProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      tabIndex={-1}
      className="scroll-mt-4 bg-cream"
    >
      <div className="container-rb py-14 md:py-20 lg:py-24">
        <div className="lg:grid lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] lg:gap-12 xl:gap-16">
          {/* Sticky illustration panel — desktop only, bounded to this section. */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <figure className="rounded-lg bg-white p-6 shadow-soft">
                <HouseIllustration
                  stage={5}
                  label="Illustration: a stylised brick house, fully assembled, with a warm light in every window and a cutaway showing its rooms."
                />
                <figcaption className="mt-3 text-sm text-stone">
                  {storyControls.sequenceCaption}
                </figcaption>
              </figure>

              <ol aria-label={storyControls.sequenceLabel} className="mt-4 grid grid-cols-5 gap-2">
                {THUMBNAIL_STAGES.map((stage) => (
                  <li key={stage} className="rounded-md bg-white p-1.5">
                    <HouseIllustration stage={stage} />
                    <span className="mt-1 block text-center text-xs font-bold text-stone">
                      {stage}. {stageNames[stage]}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Copy column — ordinary document content. */}
          <div>
            <p className="text-eyebrow text-brick">The house story</p>
            <h2 id={`${id}-heading`} className="text-section mt-3 max-w-2xl">
              {storyEntry.heading}
            </h2>
            <p className="measure-body mt-4 text-lg text-stone md:text-xl">{storyEntry.body}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <AudienceSwitch returnTo={id} />
              <a
                href={`#${skipToId}`}
                className="inline-flex min-h-11 items-center font-bold text-brick underline underline-offset-4"
              >
                {storyControls.skipLabel}
              </a>
            </div>

            {/* Entry state on mobile: the moving parts. */}
            <div className="mt-8 lg:hidden">
              <HouseIllustration stage={storyEntry.stage} className="mx-auto max-w-sm" />
            </div>

            {storySets.map((set) => (
              <StoryChapters key={set.id} set={set} sectionId={id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryChapters({ set, sectionId }: { set: StorySet; sectionId: string }) {
  const total = set.chapters.length + (set.closing.numbered ? 1 : 0);
  const closingIndex = set.chapters.length + 1;

  return (
    <div
      data-story={set.id}
      aria-label={set.label}
      role="group"
      className={cn("mt-6", showFor[set.id])}
    >
      {set.chapters.map((chapter, index) => (
        <article
          key={chapter.name}
          aria-labelledby={`${sectionId}-${set.id}-${index + 1}`}
          className="border-t border-stone-light py-8 lg:py-12"
        >
          <div className="mb-5 lg:hidden">
            <HouseIllustration stage={chapter.stage} className="mx-auto max-w-[15rem]" />
          </div>
          <p className="text-eyebrow text-brick">
            Chapter {index + 1} of {total} · {chapter.name}
          </p>
          <h3 id={`${sectionId}-${set.id}-${index + 1}`} className="mt-2 text-2xl md:text-3xl">
            {chapter.heading}
          </h3>
          <p className="measure-body mt-3 text-lg text-stone">{chapter.body}</p>
        </article>
      ))}

      <article
        aria-labelledby={`${sectionId}-${set.id}-closing`}
        className="border-t border-stone-light py-8 lg:py-12"
      >
        <div className="mb-5 lg:hidden">
          <HouseIllustration stage={set.closing.stage} className="mx-auto max-w-[15rem]" />
        </div>
        <p className="text-eyebrow text-brick">
          {set.closing.numbered ? `Chapter ${closingIndex} of ${total} · ` : ""}
          {set.closing.name}
        </p>
        <h3 id={`${sectionId}-${set.id}-closing`} className="mt-2 text-2xl md:text-3xl">
          {set.closing.heading}
        </h3>
        {set.closing.body ? (
          <p className="measure-body mt-3 text-lg text-stone">{set.closing.body}</p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {set.closing.actions.map((action, index) => (
            <Button
              key={action.href}
              asChild
              size="lg"
              variant={index === 0 ? "primary" : "outline"}
            >
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ))}
        </div>
      </article>
    </div>
  );
}
