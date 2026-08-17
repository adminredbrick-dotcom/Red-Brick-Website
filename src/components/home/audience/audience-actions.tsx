"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useStory } from "@/components/home/audience/story-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StoryKey } from "@/lib/house/story";

interface AudienceActionsProps {
  /** id of the story chapter section the choice scrolls to. */
  storyTargetId: string;
  className?: string;
}

/**
 * The hero's three primary actions. "I'm a landlord" and "I'm looking for a
 * home" are real anchors to the story section (they work without JavaScript
 * and keep the visitor on the homepage); with JavaScript they also record the
 * choice so the story personalises. "View properties" goes straight to
 * /properties. Nothing here touches the URL, analytics or a CRM.
 */
export function AudienceActions({ storyTargetId, className }: AudienceActionsProps) {
  const { setStory } = useStory();
  const choose = (story: StoryKey) => () => setStory(story);
  const href = `#${storyTargetId}`;
  return (
    <ul className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap", className)} aria-label="Where would you like to start?">
      <li>
        <Button asChild size="lg">
          <a href={href} onClick={choose("landlord")} data-story-choice="landlord">
            I&rsquo;m a landlord
            <ArrowRight aria-hidden="true" />
          </a>
        </Button>
      </li>
      <li>
        <Button asChild size="lg" variant="secondary">
          <a href={href} onClick={choose("tenant")} data-story-choice="tenant">
            I&rsquo;m looking for a home
            <ArrowRight aria-hidden="true" />
          </a>
        </Button>
      </li>
      <li>
        <Button asChild size="lg" variant="outline">
          <Link href="/properties">View properties</Link>
        </Button>
      </li>
    </ul>
  );
}
