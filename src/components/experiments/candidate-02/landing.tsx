import Link from "next/link";

import { companyIntroduction, introductionCopy } from "@/content/approved-copy";
import {
  chapterLabels,
  closing,
  hero,
  house,
  intro,
  local,
  maintenance,
  paths,
  services,
  story,
  trust,
} from "@/content/experiments/candidate-02";
import type { ExperimentAction } from "@/content/experiments/shared-copy";

import { HouseIllustration } from "./house-illustration";
import { StreetLine } from "./street-line";
import styles from "./landing.module.css";

/**
 * Candidate 02 — one house, drawn in one line, as the spine of the page.
 *
 * Ten beats in the brief's order, each a landmark section with a real
 * heading. Server Component; no client JavaScript. Motion is limited to
 * hover/focus transitions, which the global reduced-motion rule disables.
 */

const cx = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(" ");

/** The tagline split at its full stops for display; the words are unchanged. */
function taglineLines(tagline: string): string[] {
  return tagline.split(/(?<=\.)\s+/).filter(Boolean);
}

function ArrowGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={styles.choiceArrow}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ActionButton({
  action,
  variant = "solid",
}: {
  action: ExperimentAction;
  variant?: "solid" | "outline" | "light";
}) {
  const className = cx(
    styles.btn,
    variant === "outline" && styles.btnOutline,
    variant === "light" && styles.btnLight,
  );
  return (
    <Link href={action.href} className={className}>
      {action.label}
    </Link>
  );
}

export function CandidateTwoLanding() {
  const [taglineFirst, ...taglineRest] = taglineLines(hero.heading);

  return (
    <>
      {/* 1 — Hero: who we are, where, and the choice. Words before any drawing. */}
      <section aria-labelledby="c02-hero-heading" className={cx(styles.hero, styles.onCream)}>
        <div className={cx("container-rb", styles.heroGrid)}>
          <div>
            <p className={styles.eyebrow}>{hero.eyebrow}</p>
            <h1 id="c02-hero-heading" className={cx(styles.display, styles.h1)}>
              <span className={cx(styles.h1Line, styles.h1Property)}>{taglineFirst}</span>
              {taglineRest.map((line) => (
                <span key={line} className={styles.h1Line}>
                  {line}
                </span>
              ))}
            </h1>
            <p className={styles.heroSupporting}>{hero.supporting}</p>

            <div className={styles.choices}>
              {hero.choices.map(({ action, next }, index) => {
                const labelId = `c02-choice-${index}-label`;
                const nextId = `c02-choice-${index}-next`;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={styles.choice}
                    aria-labelledby={labelId}
                    aria-describedby={nextId}
                  >
                    <span id={labelId} className={styles.choiceLabel}>
                      {action.label}
                    </span>
                    <span id={nextId} className={styles.choiceNext}>
                      {next}
                    </span>
                    <ArrowGlyph />
                  </Link>
                );
              })}
            </div>

            <ul className={styles.utility}>
              {hero.utilityActions.map((action) => (
                <li key={action.label}>
                  <Link href={action.href} className={styles.textLink}>
                    {action.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.heroFigure}>
            <HouseIllustration
              variant="elevation"
              tone="day"
              title="A red-brick house drawn in one continuous line"
            />
          </div>
        </div>
      </section>

      {/* 2 — Short introduction: approved wording only. */}
      <section aria-labelledby="c02-intro-heading" className={cx(styles.section, styles.onCream)}>
        <div className={cx("container-rb", styles.ledgerLayout)}>
          <div>
            <p className={styles.eyebrow}>{chapterLabels.intro}</p>
            <h2 id="c02-intro-heading" className={cx(styles.display, styles.h2)}>
              {intro.heading}
            </h2>
          </div>
          <div className={styles.stack}>
            <p className={cx(styles.body, styles.lede, styles.flush)}>{companyIntroduction}</p>
            <p className={styles.bodyMuted}>{introductionCopy}</p>
          </div>
        </div>
      </section>

      {/* 3 — The story stage: a still of the house in parts, where the scroll story will live. */}
      <section
        aria-labelledby="c02-story-heading"
        data-surface="dark"
        className={cx(styles.section, styles.stage)}
      >
        <div className={cx("container-rb", styles.stageGrid)}>
          <div>
            <p className={cx(styles.eyebrow, styles.eyebrowOnDark)}>{chapterLabels.story}</p>
            <h2 id="c02-story-heading" className={cx(styles.display, styles.h2, styles.h2OnDark)}>
              {story.heading}
            </h2>
            <p className={styles.stageBody}>{story.body}</p>
            <ul className={styles.stageParts} aria-label="The parts of the house">
              {story.parts.map((part) => (
                <li key={part} className={styles.stagePart}>
                  {part}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.stageFigure}>
            <div className={styles.stageFigureArt}>
              <HouseIllustration
                variant="exploded"
                tone="night"
                title="The same house drawn in separate parts: roof lifted, walls with the rooms visible, foundation below"
              />
            </div>
            <div className={styles.stageNote}>
              <p className={cx(styles.eyebrow, styles.eyebrowOnDark)}>{story.placeholder.label}</p>
              <p className={styles.stageNoteBody}>{story.placeholder.body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 — Two paths, each drawn as a path with four stops. */}
      <section aria-labelledby="c02-paths-heading" className={cx(styles.section, styles.onCream)}>
        <div className="container-rb">
          <p className={styles.eyebrow}>{chapterLabels.paths}</p>
          <h2 id="c02-paths-heading" className={cx(styles.display, styles.h2)}>
            {paths.heading}
          </h2>

          <div className={styles.pathsGrid}>
            {[paths.landlord, paths.tenant].map((path) => {
              const titleId = `c02-path-${path.key}-title`;
              return (
                <article key={path.key} className={styles.path} aria-labelledby={titleId}>
                  <p className={styles.eyebrow}>{path.audience}</p>
                  <h3 id={titleId} className={styles.pathTitle}>
                    {path.title}
                  </h3>
                  <ol className={styles.steps}>
                    {path.steps.map((step) => (
                      <li key={step.name} className={styles.step}>
                        <span className={styles.stepName}>{step.name}</span>
                        <span className={styles.stepLine}>{step.line}</span>
                      </li>
                    ))}
                  </ol>
                  <p className={styles.pathBody}>{path.body}</p>
                  <div className={styles.pathAction}>
                    <ActionButton action={path.action} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5 — Let, Manage and Care: names and headings only. */}
      <section
        aria-labelledby="c02-services-heading"
        className={cx(styles.section, styles.onWhite)}
      >
        <div className="container-rb">
          <p className={styles.eyebrow}>{chapterLabels.services}</p>
          <h2 id="c02-services-heading" className={cx(styles.display, styles.h2)}>
            {services.heading}
          </h2>
          <p className={styles.lede}>{services.lede}</p>

          <ol className={styles.servicesGrid}>
            {services.items.map((item) => (
              <li key={item.name} className={styles.service}>
                <p className={styles.serviceName} aria-hidden="true">
                  {item.name}
                </p>
                <h3 className={styles.serviceHeading}>{item.heading}</h3>
              </li>
            ))}
          </ol>
          <p className={styles.servicesNote}>{services.note}</p>
        </div>
      </section>

      {/* 6 — The house: the finished cutaway and the four things that matter. */}
      <section aria-labelledby="c02-house-heading" className={cx(styles.section, styles.onCream)}>
        <div className="container-rb">
          <p className={styles.eyebrow}>{chapterLabels.house}</p>
          <h2 id="c02-house-heading" className={cx(styles.display, styles.h2)}>
            {house.heading}
          </h2>
          <p className={styles.lede}>{house.lede}</p>

          <div className={styles.houseGrid}>
            <div className={styles.houseFigure}>
              <HouseIllustration
                variant="cutaway"
                tone="day"
                title="The house with its front wall removed; one line runs from the door, through every room and out of the chimney"
              />
            </div>

            <div>
              <dl className={styles.chapters}>
                {house.chapters.map((chapter) => (
                  <div key={chapter.name} className={styles.chapter}>
                    <dt className={styles.chapterName}>{chapter.name}</dt>
                    <dd className={styles.chapterLine}>{chapter.line}</dd>
                  </div>
                ))}
              </dl>

              <div className={styles.finale}>
                {house.finale.map(({ line, action }) => (
                  <div key={action.label} className={styles.finaleItem}>
                    <p className={styles.finaleLine}>{line}</p>
                    <ActionButton action={action} variant="outline" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 — Peterborough: the street line, then facts only. */}
      <section
        aria-labelledby="c02-local-heading"
        className={cx(styles.section, styles.local, styles.onCream)}
      >
        <StreetLine className={styles.street} />
        <div className={cx("container-rb", styles.ledgerLayout)}>
          <div>
            <p className={styles.eyebrow}>{chapterLabels.local}</p>
            <h2 id="c02-local-heading" className={cx(styles.display, styles.h2)}>
              {local.heading}
            </h2>
          </div>
          <div className={styles.stack}>
            {local.body.map((line) => (
              <p key={line} className={cx(styles.body, styles.lede, styles.flush)}>
                {line}
              </p>
            ))}
            <p className={styles.bodyMuted}>{local.note}</p>
          </div>
        </div>
      </section>

      {/* 8 — Maintenance: the five steps as an ordered track. */}
      <section
        aria-labelledby="c02-maintenance-heading"
        className={cx(styles.section, styles.onWhite)}
      >
        <div className="container-rb">
          <p className={styles.eyebrow}>{chapterLabels.maintenance}</p>
          <h2 id="c02-maintenance-heading" className={cx(styles.display, styles.h2)}>
            {maintenance.heading}
          </h2>
          <p className={styles.lede}>{maintenance.body}</p>

          <ol className={styles.track}>
            {maintenance.steps.map((step, index) => (
              <li key={step.name} className={styles.trackStep}>
                <span className={styles.trackIndex} aria-hidden="true">
                  {index + 1}
                </span>
                <span className={styles.trackName}>{step.name}</span>
                <span className={styles.trackLine}>{step.line}</span>
              </li>
            ))}
          </ol>

          <div className={styles.trackAction}>
            <ActionButton action={maintenance.action} variant="outline" />
          </div>
        </div>
      </section>

      {/* 9 — The facts: only what is confirmed, set out as a ledger. */}
      <section aria-labelledby="c02-trust-heading" className={cx(styles.section, styles.onCream)}>
        <div className={cx("container-rb", styles.ledgerLayout)}>
          <div>
            <p className={styles.eyebrow}>{chapterLabels.trust}</p>
            <h2 id="c02-trust-heading" className={cx(styles.display, styles.h2)}>
              {trust.heading}
            </h2>
          </div>
          <div>
            <dl className={styles.ledger}>
              {trust.ledger.map((row) => (
                <div key={row.term} className={styles.ledgerRow}>
                  <dt className={styles.ledgerTerm}>{row.term}</dt>
                  <dd className={styles.ledgerDetail}>{row.detail}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.factsNote}>{trust.note}</p>
          </div>
        </div>
      </section>

      {/* 10 — Final action: WhatsApp, with the number and the appointment line. */}
      <section
        aria-labelledby="c02-closing-heading"
        data-surface="dark"
        className={cx(styles.section, styles.closing)}
      >
        <div className="container-rb">
          <p className={cx(styles.eyebrow, styles.eyebrowOnDark)}>{chapterLabels.closing}</p>
          <h2 id="c02-closing-heading" className={cx(styles.display, styles.h2, styles.h2OnDark)}>
            {closing.heading}
          </h2>
          <p className={styles.closingBody}>{closing.body}</p>
          <div className={styles.closingActions}>
            <a href={closing.action.href} className={cx(styles.btn, styles.btnLight)}>
              {closing.action.label}
            </a>
            <div className={styles.closingMeta}>
              <p>WhatsApp {closing.action.displayNumber}</p>
              <p>{closing.meetings}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
