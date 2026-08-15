import type { Metadata } from "next";

import { CandidateTwoLanding } from "@/components/experiments/candidate-02/landing";

/**
 * Blind alias — Option A.
 * Renders one round-one candidate exactly as built, under a neutral title so
 * reviewers cannot see the candidate number, branch or skill. Never indexed.
 */
export const metadata: Metadata = {
  title: "Option A",
  description: "Blind landing-page option A for review.",
  robots: { index: false, follow: false },
};

export default function OptionAPage() {
  return <CandidateTwoLanding />;
}
