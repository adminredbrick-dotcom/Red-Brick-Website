import Link from "next/link";

/** Blind option letters, always rendered in alphabetical order. */
export const OPTION_LETTERS = ["a", "b", "c", "d", "e"] as const;

/**
 * One blind option card. Deliberately identical for every option: same size,
 * same wording pattern, same styling, no description, no commentary.
 */
export function OptionCard({ letter }: { letter: string }) {
  const upper = letter.toUpperCase();
  const href = `/experiments/options/${letter.toLowerCase()}`;
  return (
    <li className="flex">
      <article
        aria-labelledby={`option-${letter}-heading`}
        className="flex min-h-44 w-full flex-col justify-between rounded-lg border border-stone-light bg-white p-6"
      >
        <div>
          <p className="text-eyebrow text-stone">Blind option</p>
          <h2 id={`option-${letter}-heading`} className="mt-2 text-2xl">
            Option {upper}
          </h2>
        </div>
        <Link
          href={href}
          className="mt-6 inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-md bg-ink px-4 font-bold text-cream hover:bg-brick-deep"
        >
          Open Option {upper}
        </Link>
      </article>
    </li>
  );
}
