"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

import { useStory } from "@/components/home/audience/story-provider";
import { SwitchStory } from "@/components/home/audience/switch-story";
import { Button } from "@/components/ui/button";
import { houseEligibility } from "@/lib/house/eligibility";
import {
  chapterIndexFor,
  houseRenderSrc,
  houseStories,
  storyKeys,
  type HouseRenderState,
} from "@/lib/house/story";
import { cn } from "@/lib/utils";

import type { HouseSceneProps } from "./house-scene";

type SceneComponent = React.ComponentType<HouseSceneProps>;
type Mode = "static" | "loading" | "live" | "failed";

interface HouseStageProps {
  /** id of the chapter section (hero anchors point here). */
  sectionId: string;
  /** id of the heading after the chapter that "Skip the house story" moves focus to. */
  skipTargetId: string;
}

/** Catches render errors in the 3D island and hands control back to the static stage. */
class SceneBoundary extends React.Component<{ onError: () => void; children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const chapterState = (i: number): HouseRenderState =>
  (["chapter-1", "chapter-2", "chapter-3", "chapter-4", "complete"] as const)[Math.min(4, Math.max(0, i))]!;

/**
 * The bounded 3D-house chapter. Server-rendered HTML first: heading, Skip
 * story, Switch story, the complete-house still and every chapter's copy for
 * the neutral story (landlord/tenant variants are in the HTML but hidden).
 * On eligible desktops the R3F scene is imported only when the chapter
 * approaches the viewport, and the still stays visible until the first
 * successful frame. Everyone else keeps the static chapter sequence. CSS
 * sticky only — no pinning, no scroll hijack.
 */
export function HouseStage({ sectionId, skipTargetId }: HouseStageProps) {
  const { story } = useStory();
  const active = houseStories[story];
  const [mode, setMode] = React.useState<Mode>("static");
  const [Scene, setScene] = React.useState<SceneComponent | null>(null);
  const [sceneReady, setSceneReady] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [section, setSection] = React.useState<HTMLElement | null>(null);
  const [copyColumn, setCopyColumn] = React.useState<HTMLElement | null>(null);
  const copyRef = React.useCallback((el: HTMLElement | null) => setCopyColumn(el), []);
  const [eligibilityReason, setEligibilityReason] = React.useState<string>("pending");
  const sectionRef = React.useCallback((el: HTMLElement | null) => setSection(el), []);
  const failedRef = React.useRef(false);

  const fail = React.useCallback(() => {
    failedRef.current = true;
    setMode("failed");
    setScene(null);
    setSceneReady(false);
  }, []);

  // Eligibility + proximity gate: nothing 3D is fetched unless both pass.
  React.useEffect(() => {
    if (!section || failedRef.current) return;
    const eligibility = houseEligibility();
    setEligibilityReason(eligibility.reason);
    if (!eligibility.eligible) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        setMode("loading");
        import("./house-scene")
          .then((m) => {
            if (cancelled) return;
            setScene(() => m.HouseScene);
            setMode("live");
          })
          .catch(() => {
            if (!cancelled) fail();
          });
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(section);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [section, fail]);

  // Static mode: keep the progress label honest by watching which chapter is in view.
  React.useEffect(() => {
    if (!section || mode === "live") return;
    const items = Array.from(section.querySelectorAll<HTMLElement>("[data-chapter-index]:not([hidden] *)"));
    if (items.length === 0 || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) setActiveIndex(Number((best.target as HTMLElement).dataset.chapterIndex));
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-20% 0px -40% 0px" },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [section, mode, story]);

  const onProgress = React.useCallback((p: number) => setActiveIndex(chapterIndexFor(p)), []);
  const onFirstFrame = React.useCallback(() => setSceneReady(true), []);

  const live = mode === "live" && Scene !== null;
  const stageStill = houseRenderSrc(story, "complete");
  const label =
    activeIndex >= 4 ? `Chapter 4 of 4 complete — ${active.close.heading}` : `Chapter ${activeIndex + 1} of 4 — ${active.chapters[activeIndex]!.name}`;

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      aria-labelledby="house-story-heading"
      className="scroll-mt-4 bg-ink text-cream"
      data-surface="dark"
      data-house-mode={mode}
      data-house-eligibility={eligibilityReason}
      data-story-active={story}
    >
      <div className="container-rb py-16 md:py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-eyebrow text-sand">The house story</p>
            <h2 id="house-story-heading" className="text-section mt-3">
              {active.heading}
            </h2>
            <p className="measure-body mt-4 text-lg text-cream/85">{active.lead}</p>
          </div>
          <div className="flex flex-col items-start gap-4">
            <SwitchStory className="[&_.text-eyebrow]:text-sand" />
            <a
              href={`#${skipTargetId}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-cream/60 px-4 font-bold text-cream hover:bg-cream/10"
            >
              Skip the house story
              <ArrowDown className="size-5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
          {/* Stage: sticky within the chapter only (CSS), decorative canvas over a static still. */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#2a2522]">
              {/* eslint-disable-next-line @next/next/no-img-element -- static render swapped by story; no optimisation needed */}
              <img
                src={stageStill}
                alt=""
                aria-hidden="true"
                width={1200}
                height={900}
                decoding="async"
                loading="lazy"
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                  live && sceneReady ? "opacity-0" : "opacity-100",
                )}
                data-house-still
              />
              {live && Scene ? (
                <SceneBoundary onError={fail}>
                  <div className="absolute inset-0" data-house-canvas>
                    <Scene
                      story={story}
                      trigger={copyColumn}
                      onFirstFrame={onFirstFrame}
                      onProgress={onProgress}
                      onContextLost={fail}
                    />
                  </div>
                </SceneBoundary>
              ) : null}
            </div>
            <p className="mt-3 text-base text-cream/80" aria-live="polite" data-house-progress>
              {label}
            </p>
            {mode === "failed" ? (
              <p className="mt-1 text-sm text-cream/60">Showing the illustrated version of the story.</p>
            ) : null}
          </div>

          {/* Copy: every variant is in the HTML; only the chosen one is shown. Its extent drives scroll progress. */}
          <div ref={copyRef}>
            {storyKeys.map((key) => {
              const s = houseStories[key];
              const shown = key === story;
              return (
                <div key={key} data-story-variant={key} hidden={!shown}>
                  <ol className="flex flex-col gap-10 lg:gap-0">
                    {s.chapters.map((chapter, i) => (
                      <li
                        key={chapter.key}
                        data-chapter-index={i}
                        aria-current={shown && activeIndex === i ? "step" : undefined}
                        className={cn(
                          "border-l-2 pl-6 transition-colors lg:flex lg:min-h-[58vh] lg:flex-col lg:justify-center lg:py-6",
                          shown && activeIndex === i ? "border-sand" : "border-cream/25",
                        )}
                      >
                        <p className="text-eyebrow text-sand">
                          Chapter {i + 1} · {chapter.name}
                        </p>
                        <h3 className="mt-2 text-2xl md:text-3xl">{chapter.heading}</h3>
                        <p className="measure-body mt-3 text-cream/85">{chapter.body}</p>
                        {!live ? (
                          // eslint-disable-next-line @next/next/no-img-element -- static chapter render
                          <img
                            src={houseRenderSrc(key, chapterState(i))}
                            alt={`Illustration of the house at chapter ${i + 1}: ${chapter.name.toLowerCase()}`}
                            width={1200}
                            height={900}
                            loading="lazy"
                            decoding="async"
                            className="mt-4 w-full max-w-md rounded-md"
                          />
                        ) : null}
                      </li>
                    ))}
                    <li
                      data-chapter-index={4}
                      aria-current={shown && activeIndex === 4 ? "step" : undefined}
                      className={cn(
                        "border-l-2 pl-6 lg:flex lg:min-h-[40vh] lg:flex-col lg:justify-center lg:py-6",
                        shown && activeIndex === 4 ? "border-sand" : "border-cream/25",
                      )}
                    >
                      <p className="text-eyebrow text-sand">The complete house</p>
                      <h3 className="mt-2 text-2xl md:text-3xl">{s.close.heading}</h3>
                      <p className="measure-body mt-3 text-cream/85">{s.close.body}</p>
                      <div className="mt-5">
                        <Button asChild size="lg" className="bg-white text-ink hover:bg-sand">
                          <Link href={s.close.action.href}>{s.close.action.label}</Link>
                        </Button>
                      </div>
                    </li>
                  </ol>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
