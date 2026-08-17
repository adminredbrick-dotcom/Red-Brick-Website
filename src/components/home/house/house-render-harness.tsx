"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

import { storyKeys, type StoryKey } from "@/lib/house/story";

const HouseScene = dynamic(() => import("./house-scene").then((m) => m.HouseScene), { ssr: false });

/** Fixed-size stage that renders one story at one progress value and flags readiness for screenshots. */
export function HouseRenderHarness() {
  const params = useSearchParams();
  const storyParam = params.get("story") ?? "neutral";
  const story: StoryKey = (storyKeys as readonly string[]).includes(storyParam) ? (storyParam as StoryKey) : "neutral";
  const progress = Math.min(1, Math.max(0, Number(params.get("progress") ?? "1")));
  const width = Number(params.get("w") ?? "1200");
  const height = Number(params.get("h") ?? "900");
  const [ready, setReady] = React.useState(false);

  return (
    <div
      data-house-render
      data-ready={ready ? "true" : "false"}
      data-story={story}
      data-progress={progress}
      style={{ width, height, background: "#2a2522" }}
      className="overflow-hidden rounded-lg"
    >
      <HouseScene story={story} trigger={null} fixedProgress={progress} onFirstFrame={() => setReady(true)} />
    </div>
  );
}
