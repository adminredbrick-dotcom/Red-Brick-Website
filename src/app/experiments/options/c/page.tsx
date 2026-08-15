import type { Metadata } from "next";

import { Candidate05Landing } from "@/components/experiments/candidate-05/landing";

/**
 * Blind alias — Option C.
 * Renders one round-one candidate exactly as built, under a neutral title so
 * reviewers cannot see the candidate number, branch or skill. Never indexed.
 */
export const metadata: Metadata = {
  title: "Option C",
  description: "Blind landing-page option C for review.",
  robots: { index: false, follow: false },
};

export default function OptionCPage() {
  return <Candidate05Landing />;
}
