import type { Metadata } from "next";
import { Suspense } from "react";

import { HouseRenderHarness } from "@/components/home/house/house-render-harness";

export const metadata: Metadata = {
  title: "House render harness",
  description: "Internal: renders the 3D house at a fixed story/progress for static fallback capture.",
  robots: { index: false, follow: false },
};

/**
 * Internal harness used by scripts/house/render-chapters.mjs to capture the
 * static chapter renders (?story=neutral|landlord|tenant&progress=0..1).
 * Not linked from anywhere; noindex.
 */
export default function HouseRendersPage() {
  return (
    <main className="min-h-screen bg-cream p-4">
      <h1 className="sr-only">House render harness</h1>
      <Suspense fallback={null}>
        <HouseRenderHarness />
      </Suspense>
    </main>
  );
}
