import type { Metadata } from "next";

import { Candidate04Landing } from "@/components/experiments/candidate-04/landing";

/**
 * Blind alias — Option E.
 * Renders one round-one candidate exactly as built, under a neutral title so
 * reviewers cannot see the candidate number, branch or skill. Never indexed.
 */
export const metadata: Metadata = {
  title: "Option E",
  description: "Blind landing-page option E for review.",
  robots: { index: false, follow: false },
};

export default function OptionEPage() {
  return <Candidate04Landing />;
}
