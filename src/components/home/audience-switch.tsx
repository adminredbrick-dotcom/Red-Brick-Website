"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { audienceHref, type Audience } from "@/components/home/audience";
import { useAudience } from "@/components/home/audience-root";
import { audienceChoices, audienceQuestion, repairUtility, switchView } from "@/content/home-copy";
import { cn } from "@/lib/utils";

/**
 * Small client islands for audience personalisation. Every control is a real
 * link or form submission first (works with no JavaScript, reloading `/` with
 * `?audience=…`); JavaScript intercepts the same controls and updates the
 * wrapper attribute in place.
 */

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Scrolls to a section and moves focus to it, respecting reduced motion. */
function goToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  target.focus({ preventScroll: true });
}

/* -------------------------------------------------------------- Switch */

interface AudienceSwitchProps {
  /** Section id the no-JS links return to (and JS keeps the reader at). */
  returnTo: string;
  className?: string;
  /** Dark-surface styling. */
  tone?: "light" | "dark";
}

/**
 * "Switch view" — Landlord · Tenant · Both. Always visible near the story and
 * near the finale so a chosen journey can change at any time. The active
 * option is marked with aria-current (server-rendered from the URL, updated
 * by the client island afterwards).
 */
export function AudienceSwitch({ returnTo, className, tone = "light" }: AudienceSwitchProps) {
  const ctx = useAudience();
  const current = ctx?.audience ?? null;

  return (
    <div
      role="group"
      aria-label={switchView.label}
      className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}
    >
      <span className={cn("text-eyebrow", tone === "dark" ? "text-sand" : "text-brick")}>
        {switchView.label}
      </span>
      <ul
        className={cn(
          "inline-flex rounded-md border-2 p-0.5",
          tone === "dark" ? "border-cream/40" : "border-stone-light bg-white",
        )}
      >
        {switchView.options.map((option) => {
          const value = option.value as Audience;
          const isCurrent = current === value;
          return (
            <li key={value}>
              <a
                href={audienceHref(value, returnTo)}
                aria-current={isCurrent ? "true" : undefined}
                onClick={(event) => {
                  if (!ctx) return;
                  event.preventDefault();
                  ctx.choose(value);
                }}
                className={cn(
                  "inline-flex min-h-10 min-w-11 items-center justify-center rounded-sm px-3.5 text-base font-bold transition-colors",
                  tone === "dark"
                    ? "text-cream [&:not([aria-current])]:hover:bg-cream/15 aria-[current=true]:bg-cream aria-[current=true]:text-ink"
                    : "text-ink [&:not([aria-current])]:hover:bg-sand aria-[current=true]:bg-ink aria-[current=true]:text-cream",
                )}
              >
                {option.label}
              </a>
            </li>
          );
        })}
      </ul>
      <span className="sr-only">{switchView.hint}</span>
    </div>
  );
}

/* ---------------------------------------------------------- Choice form */

interface AudienceChoiceFormProps {
  /** Section id to move to after choosing (the house story). */
  targetId: string;
  className?: string;
}

/**
 * The hero question with two substantial choice cards and the subordinate
 * "Already rent with us? Report a repair" utility route. A plain GET form to
 * `/` — with JavaScript the submit is intercepted and the page personalises
 * in place, then moves to the story just as the no-JS reload would.
 */
export function AudienceChoiceForm({ targetId, className }: AudienceChoiceFormProps) {
  const ctx = useAudience();
  const headingId = React.useId();

  const handleChoice = (event: React.MouseEvent<HTMLButtonElement>, value: Audience) => {
    if (!ctx) return; // no provider: let the form submit normally
    event.preventDefault();
    ctx.choose(value);
    goToSection(targetId);
  };

  return (
    <div className={className}>
      <h2 id={headingId} className="text-xl text-cream md:text-2xl">
        {audienceQuestion}
      </h2>

      <form
        method="get"
        action={`/#${targetId}`}
        aria-labelledby={headingId}
        className="mt-5 grid gap-4 sm:grid-cols-2"
      >
        {(["landlord", "tenant"] as const).map((value) => {
          const choice = audienceChoices[value];
          const labelId = `${headingId}-${value}-label`;
          const descId = `${headingId}-${value}-desc`;
          return (
            <div
              key={value}
              className={cn(
                "flex flex-col rounded-lg bg-white/6 ring-1 ring-cream/15",
                value === "landlord"
                  ? "in-data-[audience=landlord]:ring-2 in-data-[audience=landlord]:ring-cream/70"
                  : "in-data-[audience=tenant]:ring-2 in-data-[audience=tenant]:ring-cream/70",
              )}
            >
              <button
                type="submit"
                name="audience"
                value={value}
                aria-labelledby={labelId}
                aria-describedby={descId}
                onClick={(event) => handleChoice(event, value)}
                className="group flex flex-1 flex-col items-start gap-2 rounded-lg p-6 text-left transition-colors hover:bg-white/8"
              >
                <span className="text-eyebrow text-sand">{choice.eyebrow}</span>
                <span
                  id={labelId}
                  className="flex items-center gap-2 text-2xl font-bold leading-tight text-cream md:text-3xl"
                >
                  {choice.label}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-6 shrink-0 transition-transform group-hover:translate-x-1"
                  />
                </span>
                <span id={descId} className="text-base text-cream/80 md:text-lg">
                  {choice.supporting}
                </span>
                <span
                  className={cn(
                    "mt-1 hidden rounded-sm bg-cream px-2 py-0.5 text-sm font-bold text-ink",
                    value === "landlord"
                      ? "in-data-[audience=landlord]:inline-block"
                      : "in-data-[audience=tenant]:inline-block",
                  )}
                >
                  Selected view
                </span>
              </button>
              <p className="border-t border-cream/15 px-6 py-3 text-base">
                <Link
                  href={choice.directHref}
                  className="inline-flex min-h-11 items-center font-bold text-cream underline decoration-cream/50 underline-offset-4 hover:decoration-cream"
                >
                  {choice.directLabel}
                </Link>
              </p>
            </div>
          );
        })}
      </form>

      <p className="mt-5 text-base text-cream/80 md:text-lg">
        {repairUtility.prefix}{" "}
        <Link
          href={repairUtility.href}
          className="inline-flex min-h-11 items-center font-bold text-cream underline decoration-cream/50 underline-offset-4 hover:decoration-cream"
        >
          {repairUtility.label}
        </Link>
      </p>
    </div>
  );
}
