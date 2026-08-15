import type { Metadata } from "next";

import { CandidateTwoLanding } from "@/components/experiments/candidate-02/landing";
import { experimentFacts } from "@/content/experiments/shared-copy";

/**
 * Landing-page experiment — candidate 02.
 * Route: /experiments/candidate-02 (docs/landing-experiments/BRIEF.md).
 * Not indexable: the site-wide noindex is kept and repeated here.
 */
export const metadata: Metadata = {
  title: "Landing experiment — candidate 02",
  description: `${experimentFacts.whatWeDo}. Established in ${experimentFacts.establishedYear}.`,
  robots: { index: false, follow: false },
};

export default function CandidateTwoPage() {
  return <CandidateTwoLanding />;
}
