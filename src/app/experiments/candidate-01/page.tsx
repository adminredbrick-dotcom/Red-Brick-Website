import type { Metadata } from "next";

import { Candidate01Landing } from "@/components/experiments/candidate-01/landing";
import { experimentFacts } from "@/content/experiments/shared-copy";

/**
 * Landing-page experiment — candidate 01.
 * Route: /experiments/candidate-01. Uses the shared header and footer from the
 * root layout unchanged. Not indexed (site-wide noindex plus route-level robots).
 */
export const metadata: Metadata = {
  title: experimentFacts.tagline,
  description: `${experimentFacts.whatWeDo}. Established in ${experimentFacts.establishedYear}.`,
  robots: { index: false, follow: false },
};

export default function Candidate01Page() {
  return <Candidate01Landing />;
}
