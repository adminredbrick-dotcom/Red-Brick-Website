import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import * as copy from "@/content/experiments/candidate-01";

import { Glyph, type GlyphName } from "./glyphs";
import { CourseMark, HouseIllustration, TerraceIllustration } from "./illustrations";
import styles from "./landing.module.css";

/**
 * Candidate 01 — "Laid course by course".
 *
 * Ten story beats, each a semantic <section> with a real heading, opened by a
 * numbered chapter marker. One drawn red-brick house is the recurring object:
 * it opens the page, holds the place for the future scrolling story and stands
 * with its neighbours in the Peterborough chapter. Server-rendered; no client
 * JavaScript, CSS-only hover/focus transitions, no motion at load.
 */

const cx = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(" ");

const JOURNEY_GLYPHS: Record<string, GlyphName> = {
  Let: "let",
  Manage: "manage",
  Care: "care",
};

function ChapterHead({
  number,
  label,
  heading,
  headingId,
}: {
  number: number;
  label: string;
  heading: string;
  headingId: string;
}) {
  return (
    <div className={styles.chapterHead}>
      <p className={styles.chapterLabel}>
        <CourseMark className={styles.courseMark} />
        <span className={styles.chapterNumber} aria-hidden="true">
          {String(number).padStart(2, "0")}
        </span>
        <span>{label}</span>
      </p>
      <h2 id={headingId} className={styles.h2}>
        {heading}
      </h2>
    </div>
  );
}

export function Candidate01Landing() {
  const { hero, introduction, story, paths, journey, houseJourney, local, maintenance, trust, closing } =
    copy;
  const [tagFirst, tagSecond] = splitTagline(hero.heading);

  return (
    <div className={styles.page}>
      {/* 1 — Hero: orientation, audience choice and every direct action. */}
      <section aria-labelledby="c1-hero" className={cx(styles.hero, styles.onCream)}>
        <div className={cx(styles.container, styles.heroGrid)}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <CourseMark className={styles.courseMark} />
              <span>{hero.eyebrow}</span>
            </p>
            <h1 id="c1-hero" className={styles.h1}>
              {tagFirst}
              {tagSecond ? (
                <>
                  {" "}
                  <em>{tagSecond}</em>
                </>
              ) : null}
            </h1>
            <p className={styles.heroSupporting}>{hero.supporting}</p>

            <p className={styles.choicePrompt} id="c1-choice-prompt">
              {hero.choicePrompt}
            </p>
            <ul className={styles.choices} aria-labelledby="c1-choice-prompt">
              {hero.choices.map(({ action, note }, index) => {
                const noteId = `c1-choice-note-${index}`;
                return (
                  <li key={action.href} className={styles.tile}>
                    <Link href={action.href} className={styles.tileLink} aria-describedby={noteId}>
                      {action.label}
                      <ArrowRight className={styles.tileArrow} aria-hidden="true" />
                    </Link>
                    <p id={noteId} className={styles.tileNote}>
                      {note}
                    </p>
                  </li>
                );
              })}
            </ul>
            <ul className={styles.quickLinks} aria-label="More ways in">
              {hero.quickLinks.map((action) => (
                <li key={action.label}>
                  <Link href={action.href} className={styles.textLink}>
                    {action.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.heroArt}>
            <HouseIllustration id="c1-hero-house" className={styles.heroHouse} ground={false} />
          </div>
        </div>
        <div className={styles.heroBase} aria-hidden="true" />
      </section>

      {/* 2 — Short introduction. */}
      <section aria-labelledby="c1-intro" className={cx(styles.chapter, styles.onWhite)}>
        <div className={cx(styles.container, styles.introGrid)}>
          <ChapterHead
            number={1}
            label={introduction.chapter}
            heading={introduction.heading}
            headingId="c1-intro"
          />
          <div>
            <p className={styles.lead}>{introduction.lead}</p>
            <p className={styles.body}>{introduction.body}</p>
            <ul className={styles.introFacts} aria-label="In brief">
              {introduction.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3 — Where the scrolling house story will live (still frame in round one). */}
      <section aria-labelledby="c1-story" className={cx(styles.chapter, styles.onCream)}>
        <div className={styles.container}>
          <ChapterHead number={2} label={story.chapter} heading={story.heading} headingId="c1-story" />
          <p className={styles.body}>{story.body}</p>
          <figure className={styles.storyFigure}>
            <div className={styles.storyFrame}>
              <div className={styles.storyStage}>
                <HouseIllustration
                  id="c1-story-house"
                  className={styles.storyHouse}
                  title={story.imageTitle}
                />
              </div>
              <div className={styles.storyGround} aria-hidden="true" />
              <ol className={styles.stageTrack} aria-label="Chapters of the house story">
                {story.stages.map((stage) => (
                  <li key={stage} className={styles.stageStop}>
                    {stage}
                  </li>
                ))}
              </ol>
            </div>
            <figcaption className={styles.storyCaption}>{story.caption}</figcaption>
          </figure>
        </div>
      </section>

      {/* 4 — Landlord and tenant paths. */}
      <section aria-labelledby="c1-paths" className={cx(styles.chapter, styles.onWhite)}>
        <div className={styles.container}>
          <ChapterHead number={3} label={paths.chapter} heading={paths.heading} headingId="c1-paths" />
          <div className={styles.pathGrid}>
            {[paths.landlord, paths.tenant].map((path) => (
              <article key={path.label} className={styles.pathCard} aria-label={path.label}>
                <p className={styles.chapterLabel}>{path.label}</p>
                <h3 className={styles.h3}>{path.heading}</h3>
                <p className={styles.body}>{path.body}</p>
                <ol className={styles.stages} aria-label={`${path.label}: the journey`}>
                  {path.stages.map((stage) => (
                    <li key={stage}>{stage}</li>
                  ))}
                </ol>
                <p className={styles.pathAction}>
                  <Link href={path.action.href} className={styles.btn}>
                    {path.action.label}
                  </Link>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Let, Manage and Care (names and headings only in this round). */}
      <section aria-labelledby="c1-journey" className={cx(styles.chapter, styles.onCream)}>
        <div className={styles.container}>
          <ChapterHead
            number={4}
            label={journey.chapter}
            heading={journey.heading}
            headingId="c1-journey"
          />
          <p className={styles.body}>{journey.body}</p>
          <ol className={styles.journeyGrid}>
            {journey.items.map((item) => (
              <li key={item.name} className={styles.journeyItem}>
                <span className={styles.journeyGlyph}>
                  <Glyph name={JOURNEY_GLYPHS[item.name] ?? "let"} />
                </span>
                <span className={styles.journeyName}>{item.name}</span>
                <h3 className={styles.h3}>{item.heading}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 — The house / property-care journey. */}
      <section aria-labelledby="c1-house" className={cx(styles.chapter, styles.onWhite)}>
        <div className={styles.container}>
          <ChapterHead
            number={5}
            label={houseJourney.chapter}
            heading={houseJourney.heading}
            headingId="c1-house"
          />
          <p className={styles.body}>{houseJourney.body}</p>
          <ol className={styles.moments}>
            {houseJourney.moments.map((moment, index) => (
              <li key={moment.title} className={styles.moment}>
                <span className={styles.momentGlyph}>
                  <Glyph name={moment.glyph} />
                </span>
                <span className={styles.momentIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.h3}>{moment.title}</h3>
                <p className={styles.body}>{moment.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 7 — Peterborough: facts only. */}
      <section aria-labelledby="c1-local" className={cx(styles.chapter, styles.onSand, styles.local)}>
        <div className={cx(styles.container, styles.localGrid)}>
          <div>
            <ChapterHead number={6} label={local.chapter} heading={local.heading} headingId="c1-local" />
            <p className={styles.body}>{local.body}</p>
          </div>
          <ul className={styles.localPoints} aria-label="Facts about us">
            {local.points.map((point) => (
              <li key={point}>
                <CourseMark className={styles.courseMark} />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={cx(styles.container, styles.terrace)}>
          <TerraceIllustration
            id="c1-terrace"
            className={styles.terraceSvg}
            title={local.imageTitle}
          />
        </div>
      </section>

      {/* 8 — Maintenance and property care. */}
      <section aria-labelledby="c1-maintenance" className={cx(styles.chapter, styles.onWhite)}>
        <div className={styles.container}>
          <ChapterHead
            number={7}
            label={maintenance.chapter}
            heading={maintenance.heading}
            headingId="c1-maintenance"
          />
          <p className={styles.body}>{maintenance.body}</p>
          <ol className={styles.steps}>
            {maintenance.steps.map((step) => (
              <li key={step} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden="true" />
                <h3 className={styles.h3}>{step}</h3>
              </li>
            ))}
          </ol>
          <p className={styles.maintenanceAction}>
            <Link href={maintenance.action.href} className={cx(styles.btn, styles.btnQuiet)}>
              {maintenance.action.label}
            </Link>
          </p>
        </div>
      </section>

      {/* 9 — Verified trust: approved facts only. */}
      <section aria-labelledby="c1-trust" className={cx(styles.chapter, styles.onCream)}>
        <div className={styles.container}>
          <ChapterHead number={8} label={trust.chapter} heading={trust.heading} headingId="c1-trust" />
          <p className={styles.body}>{trust.intro}</p>
          <dl className={styles.trustList}>
            {trust.points.map((point) => (
              <div key={point.heading} className={styles.trustItem}>
                <dt>
                  <CourseMark className={styles.courseMark} />
                  <span>{point.heading}</span>
                </dt>
                <dd>{point.body}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.trustMeetings}>{trust.meetings}</p>
        </div>
      </section>

      {/* 10 — Final WhatsApp action. */}
      <section
        aria-labelledby="c1-closing"
        data-surface="dark"
        className={cx(styles.chapter, styles.onDeep, styles.closing)}
      >
        <div className={cx(styles.container, styles.closingGrid)}>
          <div>
            <ChapterHead
              number={9}
              label={closing.chapter}
              heading={closing.heading}
              headingId="c1-closing"
            />
            <p className={styles.body}>{closing.body}</p>
          </div>
          <div className={styles.closingActions}>
            <a href={closing.action.href} className={cx(styles.btn, styles.btnLight)}>
              <MessageCircle className={styles.btnIcon} aria-hidden="true" />
              {closing.action.label}
            </a>
            <p className={styles.closingNumber}>
              WhatsApp <strong>{closing.action.displayNumber}</strong>
            </p>
            <p className={styles.closingMeetings}>{closing.meetings}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Splits the tagline at the first full stop so the second sentence can carry the accent colour. */
function splitTagline(tagline: string): [string, string | null] {
  const index = tagline.indexOf(". ");
  if (index === -1) return [tagline, null];
  return [tagline.slice(0, index + 1), tagline.slice(index + 2)];
}
