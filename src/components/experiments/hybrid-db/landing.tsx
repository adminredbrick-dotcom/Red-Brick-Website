import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import * as copy from "@/content/experiments/hybrid-db";

import { CourseMark, House, Terrace } from "./illustrations";
import styles from "./landing.module.css";

/**
 * Hybrid D+B — "One house. Two paths. Four chapters."
 *
 * ~70% Option D: page structure and order, immediate hero choices, numbered
 * brick-course chapter markers, warm editorial layout, Peterborough identity,
 * mobile clarity. ~30% Option B: one recurring house, parts-to-complete
 * storytelling in a single bounded ink stage, cream-to-ink transition and a
 * warmly lit final state.
 *
 * Six sections. Server-rendered; no client JavaScript. The only motion is a
 * CSS scroll-driven settle inside the story stage on capable desktops; every
 * other reader sees the finished, lit house and the full text.
 */

const cx = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(" ");

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

export function HybridDbLanding() {
  const { hero, story, paths, local, maintenance, closing } = copy;
  const [tagFirst, tagSecond] = splitTagline(hero.heading);

  return (
    <div className={styles.page}>
      {/* 1 — Hero: orientation, both audiences and every direct route. The house is a quiet poster. */}
      <section aria-labelledby="hdb-hero" className={cx(styles.hero, styles.onCream)}>
        <div className={cx(styles.container, styles.heroGrid)}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <CourseMark className={styles.courseMark} />
              <span>{hero.eyebrow}</span>
            </p>
            <h1 id="hdb-hero" className={styles.h1}>
              {tagFirst}
              {tagSecond ? (
                <>
                  {" "}
                  <em>{tagSecond}</em>
                </>
              ) : null}
            </h1>
            <p className={styles.heroSupporting}>{hero.supporting}</p>

            <h2 className={styles.choicePrompt} id="hdb-choice-prompt">
              {hero.choicePrompt}
            </h2>
            <ul className={styles.choices} aria-labelledby="hdb-choice-prompt">
              {hero.choices.map(({ action, note }, index) => {
                const noteId = `hdb-choice-note-${index}`;
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
            <House id="hdb-hero-house" scene="day" state="complete" className={styles.heroHouse} />
          </div>
        </div>
        <div className={styles.heroBase} aria-hidden="true" />
      </section>

      {/* 2 — One house, four chapters: the sole cinematic section (cream → ink). */}
      <section
        aria-labelledby="hdb-story"
        data-surface="dark"
        className={cx(styles.story, styles.onInk)}
      >
        <div className={styles.container}>
          <ChapterHead number={1} label={story.chapter} heading={story.heading} headingId="hdb-story" />
          <p className={styles.lead}>{story.lead}</p>

          <div className={styles.storyGrid}>
            {/* Desktop: the house settles into place beside the chapters. */}
            <figure className={styles.stage}>
              <House
                id="hdb-stage-house"
                scene="dusk"
                state="complete"
                journey
                title={story.houseTitle}
              />
            </figure>

            <div>
              {/* Mobile and tablet: the parts, then the chapters, then the finished home. */}
              <div className={styles.still}>
                <House id="hdb-still-parts" scene="dusk" state="parts" />
              </div>

              <ol className={styles.chapters}>
                {story.chapters.map((chapter) => (
                  <li key={chapter.name} className={styles.storyChapter}>
                    <span className={styles.storyIndex} aria-hidden="true" />
                    <h3 className={styles.storyName}>{chapter.name}</h3>
                    <p className={styles.storyLine}>{chapter.heading}</p>
                    <p className={styles.storyBody}>{chapter.body}</p>
                  </li>
                ))}
              </ol>

              <div className={styles.still}>
                <House id="hdb-still-home" scene="dusk" state="complete" title={story.houseTitle} />
              </div>

              <div className={styles.storyClose}>
                <p className={styles.closeLine}>{story.close.heading}</p>
                <p className={styles.closeSub}>{story.close.tenantLine}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — Start from where you stand: two concise panels. */}
      <section aria-labelledby="hdb-paths" className={cx(styles.chapter, styles.onWhite)}>
        <div className={styles.container}>
          <ChapterHead number={2} label={paths.chapter} heading={paths.heading} headingId="hdb-paths" />
          <div className={styles.pathGrid}>
            <article className={styles.pathCard} aria-labelledby="hdb-path-landlord">
              <p className={styles.chapterLabel}>{paths.landlord.label}</p>
              <h3 id="hdb-path-landlord" className={styles.h3}>
                {paths.landlord.heading}
              </h3>
              <p className={styles.body}>{paths.landlord.body}</p>
              <ul className={styles.services} aria-label="Let, manage and care">
                {paths.landlord.services.map((service) => (
                  <li key={service.name}>
                    <span className={styles.serviceName}>{service.name}</span>
                    <span className={styles.serviceHeading}>{service.heading}</span>
                  </li>
                ))}
              </ul>
              <p className={styles.pathAction}>
                <Link href={paths.landlord.action.href} className={styles.btn}>
                  {paths.landlord.action.label}
                </Link>
              </p>
            </article>

            <article className={styles.pathCard} aria-labelledby="hdb-path-tenant">
              <p className={styles.chapterLabel}>{paths.tenant.label}</p>
              <h3 id="hdb-path-tenant" className={styles.h3}>
                {paths.tenant.heading}
              </h3>
              <p className={styles.body}>{paths.tenant.body}</p>
              <p className={styles.pathAction}>
                <Link href={paths.tenant.action.href} className={styles.btn}>
                  {paths.tenant.action.label}
                </Link>
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 4 — Peterborough and verified trust: facts only. */}
      <section aria-labelledby="hdb-local" className={cx(styles.chapter, styles.onSand, styles.local)}>
        <div className={cx(styles.container, styles.localGrid)}>
          <div>
            <ChapterHead number={3} label={local.chapter} heading={local.heading} headingId="hdb-local" />
            <p className={styles.body}>{local.body}</p>
          </div>
          <ul className={styles.facts} aria-label="Facts about us">
            {local.facts.map((fact) => (
              <li key={fact}>
                <CourseMark className={styles.courseMark} />
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={cx(styles.container, styles.terrace)}>
          <Terrace id="hdb-terrace" className={styles.terraceSvg} title={local.terraceTitle} />
        </div>
      </section>

      {/* 5 — When something needs attention: compact sequence, one action. */}
      <section aria-labelledby="hdb-maintenance" className={cx(styles.chapter, styles.onWhite)}>
        <div className={styles.container}>
          <ChapterHead
            number={4}
            label={maintenance.chapter}
            heading={maintenance.heading}
            headingId="hdb-maintenance"
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

      {/* 6 — Final contact: one decisive action. */}
      <section
        aria-labelledby="hdb-closing"
        data-surface="dark"
        className={cx(styles.chapter, styles.onDeep, styles.closing)}
      >
        <div className={cx(styles.container, styles.closingGrid)}>
          <div>
            <ChapterHead number={5} label={closing.chapter} heading={closing.heading} headingId="hdb-closing" />
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
          </div>
        </div>
      </section>
    </div>
  );
}

/** Splits the tagline at the first full stop so the second sentence carries the accent colour. */
function splitTagline(tagline: string): [string, string | null] {
  const index = tagline.indexOf(". ");
  if (index === -1) return [tagline, null];
  return [tagline.slice(0, index + 1), tagline.slice(index + 2)];
}
