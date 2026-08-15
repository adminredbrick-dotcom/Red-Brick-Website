import type { Metadata } from "next";

import { Candidate01Landing } from "@/components/experiments/candidate-01/landing";

/**
 * Blind alias — Option D.
 * Renders one round-one candidate exactly as built, under a neutral title so
 * reviewers cannot see the candidate number, branch or skill. Never indexed.
 */
export const metadata: Metadata = {
  title: "Option D",
  description: "Blind landing-page option D for review.",
  robots: { index: false, follow: false },
};

export default function OptionDPage() {
  return <Candidate01Landing />;
}
