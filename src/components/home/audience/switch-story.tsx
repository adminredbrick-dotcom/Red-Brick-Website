"use client";

import { useStory } from "@/components/home/audience/story-provider";
import { houseStories, storyKeys } from "@/lib/house/story";
import { cn } from "@/lib/utils";

interface SwitchStoryProps {
  /** Group label. */
  label?: string;
  className?: string;
}

/**
 * Visible "Switch story" control — a segmented set of real buttons with
 * aria-pressed. Rendered as HTML on the server; the choice itself needs
 * JavaScript, so hosts wrap it in `[data-needs-js]` (hidden when the html
 * element never receives the `js` class) — without JavaScript the complete
 * neutral story is already showing.
 */
export function SwitchStory({ label = "Switch story", className }: SwitchStoryProps) {
  const { story, setStory } = useStory();
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)} role="group" aria-label={label} data-needs-js>
      <span className="text-eyebrow text-stone">{label}</span>
      <div className="inline-flex overflow-hidden rounded-md border-2 border-ink">
        {storyKeys.map((key) => {
          const active = story === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => setStory(key)}
              className={cn(
                "min-h-11 px-4 text-base font-bold",
                active ? "bg-ink text-cream" : "bg-white text-ink hover:bg-sand",
              )}
            >
              {houseStories[key].switchLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
