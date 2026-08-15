import type { Metadata } from "next";

import { Candidate04Landing } from "@/components/experiments/candidate-04/landing";
import { experimentFacts } from "@/content/experiments/shared-copy";

export const metadata: Metadata = {
  title: "Landing experiment — candidate 04",
  description: `${experimentFacts.whatWeDo}. ${experimentFacts.tagline}`,
  // Experiment route: never indexed, in addition to the site-wide noindex.
  robots: { index: false, follow: false },
};

export default function Candidate04Page() {
  return <Candidate04Landing />;
}
