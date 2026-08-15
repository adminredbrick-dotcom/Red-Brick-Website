import type { Metadata } from "next";

import { OPTION_LETTERS, OptionCard } from "@/components/experiments/gallery/option-card";

export const metadata: Metadata = {
  title: "Landing options — blind comparison",
  description: "Neutral blind comparison of five landing-page options.",
  robots: { index: false, follow: false },
};

/**
 * Neutral blind-comparison gallery. Five equal cards in alphabetical order,
 * each opening a live blind alias. No names, descriptions, rankings or
 * commentary — the reviewer forms their own view from the live pages.
 */
export default function ExperimentsGalleryPage() {
  return (
    <section className="container-rb py-12 md:py-16">
      <p className="text-eyebrow text-brick">Landing-page review</p>
      <h1 className="text-section mt-3 max-w-3xl">Five options, side by side</h1>
      <p className="measure-body mt-4 text-lg text-stone">
        Open each option and review it on its own terms, on a phone-sized window and a desktop
        window. Options are listed alphabetically, not ranked. Score with the blank scorecard;
        please do not inspect source code or file names while reviewing.
      </p>

      <ul aria-label="Blind options" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {OPTION_LETTERS.map((letter) => (
          <OptionCard key={letter} letter={letter} />
        ))}
      </ul>
    </section>
  );
}
