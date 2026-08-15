import type { Metadata } from "next";

import { CandidateThreeLanding } from "@/components/experiments/candidate-03/landing";

/**
 * Blind alias — Option B.
 * Renders one round-one candidate exactly as built, under a neutral title so
 * reviewers cannot see the candidate number, branch or skill. Never indexed.
 */
export const metadata: Metadata = {
  title: "Option B",
  description: "Blind landing-page option B for review.",
  robots: { index: false, follow: false },
};

export default function OptionBPage() {
  return <CandidateThreeLanding />;
}
