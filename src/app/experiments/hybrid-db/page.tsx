import type { Metadata } from "next";

import { HybridDbLanding } from "@/components/experiments/hybrid-db/landing";
import { experimentFacts } from "@/content/experiments/shared-copy";

/**
 * /experiments/hybrid-db — the selected round-two landing concept
 * ("One house. Two paths. Four chapters."), ~70% Option D structure and
 * ~30% Option B cinema. Never indexed (site-wide noindex plus route robots).
 */
export const metadata: Metadata = {
  title: experimentFacts.tagline,
  description: `${experimentFacts.whatWeDo}. Established in ${experimentFacts.establishedYear}.`,
  robots: { index: false, follow: false },
};

export default function HybridDbPage() {
  return <HybridDbLanding />;
}
