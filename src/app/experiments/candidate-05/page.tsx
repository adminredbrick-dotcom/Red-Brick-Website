import type { Metadata } from "next";

import { Candidate05Landing } from "@/components/experiments/candidate-05/landing";
import { experimentFacts } from "@/content/experiments/shared-copy";

export const metadata: Metadata = {
  title: "Landing experiment — candidate 05",
  description: `${experimentFacts.whatWeDo}. Landing-page experiment, candidate 05.`,
  // Experiment route: never indexed, in addition to the site-wide noindex.
  robots: { index: false, follow: false },
};

export default function Candidate05Page() {
  return <Candidate05Landing />;
}
