import type { Metadata } from "next";

import { CandidateThreeLanding } from "@/components/experiments/candidate-03/landing";
import { routes } from "@/config/site";

export const metadata: Metadata = {
  title: "Landing experiment — candidate 03",
  description: routes.home.description,
  // Experiment route: never indexed (site-wide noindex is preserved as well).
  robots: { index: false, follow: false },
};

export default function CandidateThreePage() {
  return <CandidateThreeLanding />;
}
