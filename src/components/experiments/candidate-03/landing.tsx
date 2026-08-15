import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  beatCount,
  closing,
  hero,
  intro,
  journey,
  local,
  maintenance,
  paths,
  services,
  storyboard,
  trust,
} from "@/content/experiments/candidate-03";

import { HouseIllustration } from "./house-illustration";
import { StoryboardStill } from "./storyboard-still";
import styles from "./landing.module.css";

/*
 * Direction contract — candidate 03
 *
 * THESIS: A property has a lot of moving parts, and care is what holds them
 * together. The page is one house, shown three times: held apart in the hero,
 * settling into place as the reader scrolls the journey, complete beside the
 * verified facts. It refuses the estate-agent template of photo hero, three
 * icon cards and a testimonial strip.
 * OWN-WORLD: cream ground; brick as material (the house, the course dividers,
 * the brick stack); one ink dusk chapter and a deep-brick close; sand for the
 * two held moments. Inter for reading, Roboto Condensed only for short words.
 * Rounded but restrained (8/12/16), hairline ledgers, no cards-as-structure.
 * STORY: who we are and where (five seconds), then a choice, then the journey,
 * then proof from facts, then one way to talk to us.
 * FIRST VIEWPORT: h1 tagline left at ~4.5rem, the two facts under it, two large
 * audience choices side by side, quieter View properties / repair links; the
 * exploded house on a sand panel right, captioned "Peterborough lettings,
 * since 2012" with a 2012 date stone on the wall.
 * FORM: sticky-figure scroll narrative bounded to one section; static and
 * complete without motion, JavaScript or images.
 */

const chevron = (
  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" className={styles.arrow}>
    <path
      d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Ten bricks — one more filled with each chapter. Purely visual. */
function Course({ beat }: { beat: number }) {
  return (
    <div className={styles.course} aria-hidden="true">
      {Array.from({ length: beatCount }, (_, index) => (
        <span key={index} data-filled={index < beat ? "true" : "false"} />
      ))}
    </div>
  );
}

export function CandidateThreeLanding() {
  return (
    <div className={styles.page}>
      {/* 1 — Hero */}
      <section aria-labelledby="c3-hero" className={cn(styles.hero, styles.cream)}>
        <div className={cn("container-rb", styles.heroGrid)}>
          <div>
            <Course beat={1} />
            <h1 id="c3-hero" className={styles.h1}>
              {hero.headingLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p className={styles.heroFacts}>
              {hero.supporting} <strong>{hero.established}</strong>
            </p>
            <p id="c3-hero-question" className={styles.heroQuestion}>
              {hero.question}
            </p>
            <div className={styles.choices} role="group" aria-labelledby="c3-hero-question">
              <Link
                href={hero.landlord.href}
                className={cn(styles.choice, styles.choicePrimary)}
              >
                {hero.landlord.label}
                {chevron}
              </Link>
              <Link
                href={hero.tenant.href}
                className={cn(styles.choice, styles.choiceSecondary)}
              >
                {hero.tenant.label}
                {chevron}
              </Link>
            </div>
            <ul className={styles.heroLinks}>
              <li>
                <Link href={hero.viewProperties.href} className={styles.textLink}>
                  {hero.viewProperties.label}
                </Link>
              </li>
              <li>
                <Link href={hero.repair.href} className={styles.textLink}>
                  {hero.repair.label}
                </Link>
              </li>
            </ul>
          </div>
          <figure className={styles.heroFigure}>
            <HouseIllustration
              id="c3-hero-house"
              mode="exploded"
              label={hero.illustrationAlt}
              dateStone={local.year}
            />
            <figcaption className={cn(styles.display, styles.heroCaption)}>{hero.caption}</figcaption>
          </figure>
        </div>
      </section>

      {/* 2 — Introduction */}
      <section aria-labelledby="c3-intro" className={cn(styles.section, styles.cream)}>
        <div className={cn("container-rb", styles.split)}>
          <div>
            <Course beat={2} />
            <h2 id="c3-intro" className={styles.h2}>
              {intro.heading}
            </h2>
            <p className={styles.introLead}>{intro.lead}</p>
          </div>
          <div>
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.body}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — Scrolling-story placeholder */}
      <section aria-labelledby="c3-story" className={cn(styles.section, styles.white)}>
        <div className="container-rb">
          <Course beat={3} />
          <div className={styles.storyHead}>
            <div>
              <h2 id="c3-story" className={styles.h2}>
                {storyboard.heading}
              </h2>
              <p className={cn(styles.body, "mt-4")}>{storyboard.body}</p>
            </div>
            <p className={styles.tag}>{storyboard.tag}</p>
          </div>
          <ol className={styles.reel}>
            {storyboard.stills.map((still) => (
              <li key={still.key} className={styles.frame}>
                <StoryboardStill still={still.key} id={`c3-still-${still.key}`} />
                <p className={styles.frameLabel}>{still.label}</p>
              </li>
            ))}
          </ol>
          <p className={styles.note}>{storyboard.note}</p>
        </div>
      </section>

      {/* 4 — Landlord and tenant paths */}
      <section aria-labelledby="c3-paths" className={cn(styles.section, styles.cream)}>
        <div className="container-rb">
          <Course beat={4} />
          <h2 id="c3-paths" className={styles.h2}>
            {paths.heading}
          </h2>
          <p className={styles.lead}>{paths.lead}</p>
          <div className={styles.paths}>
            {[paths.landlord, paths.tenant].map((path) => (
              <article key={path.audience} className={styles.path} aria-label={path.audience}>
                <h3 className={styles.h3}>{path.heading}</h3>
                <p className={styles.pathBody}>{path.body}</p>
                <p className={styles.stepsLabel}>
                  {path.audience === "Landlords" ? "The landlord path" : "The tenant path"}
                </p>
                <ol className={styles.steps}>
                  {path.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <div className={styles.actionRow}>
                  <Link href={path.action.href} className={styles.action}>
                    {path.action.label}
                    {chevron}
                  </Link>
                  <Link href={path.secondary.href} className={styles.textLink}>
                    {path.secondary.label}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Let, manage and care */}
      <section aria-labelledby="c3-services" className={cn(styles.section, styles.sand)}>
        <div className="container-rb">
          <Course beat={5} />
          <h2 id="c3-services" className={styles.h2}>
            {services.heading}
          </h2>
          <p className={styles.lead}>{services.lead}</p>
          <ol className={styles.ledger}>
            {services.items.map((item, index) => (
              <li key={item.name} className={styles.ledgerRow}>
                <span className={styles.stack} aria-hidden="true">
                  {Array.from({ length: index + 1 }, (_, i) => (
                    <span key={i} />
                  ))}
                </span>
                <span className={cn(styles.display, styles.word)} aria-hidden="true">
                  {item.name}
                </span>
                <h3 className={styles.h3}>{item.heading}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 — The house journey (bounded sticky figure; CSS-only motion) */}
      <section
        aria-labelledby="c3-journey"
        data-surface="dark"
        className={cn(styles.section, styles.ink, styles.journey)}
      >
        <div className="container-rb">
          <Course beat={6} />
          <h2 id="c3-journey" className={styles.h2}>
            {journey.heading}
          </h2>
          <p className={styles.lead}>{journey.lead}</p>
          <div className={styles.journeyGrid}>
            <figure className={styles.journeyFigure}>
              <HouseIllustration
                id="c3-journey-house"
                mode="journey"
                scene="dusk"
                label={journey.illustrationAlt}
                dateStone={local.year}
              />
            </figure>
            <div>
              <ol className={styles.chapters}>
                {journey.chapters.map((chapter) => (
                  <li key={chapter.name} className={styles.chapter}>
                    <h3 className={cn(styles.display, styles.chapterName)}>{chapter.name}</h3>
                    <p className={styles.chapterLine}>{chapter.heading}</p>
                    <p className={styles.chapterBody}>{chapter.body}</p>
                  </li>
                ))}
              </ol>
              <div className={styles.journeyClose}>
                <p className={styles.closeLine}>{journey.close.heading}</p>
                <p className={styles.closeSub}>{journey.close.tenantLine}</p>
                <div className={styles.actionRow}>
                  <Link href={journey.close.action.href} className={styles.action}>
                    {journey.close.action.label}
                    {chevron}
                  </Link>
                  <Link href={journey.close.secondary.href} className={styles.actionQuiet}>
                    {journey.close.secondary.label}
                    {chevron}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 — Peterborough */}
      <section aria-labelledby="c3-place" className={cn(styles.section, styles.cream)}>
        <div className={cn("container-rb", styles.placeGrid)}>
          <div className={styles.placeLead}>
            <Course beat={7} />
            <h2 id="c3-place" className={cn(styles.h2, styles.placeHeading)}>
              <span>{local.place}</span>{" "}
              <span className={styles.since}>since {local.year}</span>
            </h2>
          </div>
          <div>
            <p className={styles.placeFact}>{local.whatWeDo}.</p>
            <p className={styles.placeBody}>{local.body}</p>
            <dl className={styles.placePoint}>
              <dt>{local.focus.heading}</dt>
              <dd>{local.focus.body}</dd>
            </dl>
          </div>
        </div>
      </section>

      {/* 8 — Maintenance and property care */}
      <section aria-labelledby="c3-maintenance" className={cn(styles.section, styles.white)}>
        <div className="container-rb">
          <Course beat={8} />
          <h2 id="c3-maintenance" className={styles.h2}>
            {maintenance.heading}
          </h2>
          <p className={cn(styles.body, "mt-4")}>{maintenance.body}</p>
          <ol className={styles.track}>
            {maintenance.steps.map((step) => (
              <li key={step.name} className={styles.step}>
                <h3 className={styles.stepName}>{step.name}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </li>
            ))}
          </ol>
          <div className={styles.actionRow}>
            <Link href={maintenance.action.href} className={styles.actionQuiet}>
              {maintenance.action.label}
              {chevron}
            </Link>
          </div>
        </div>
      </section>

      {/* 9 — Verified trust */}
      <section aria-labelledby="c3-trust" className={cn(styles.section, styles.sand)}>
        <div className={cn("container-rb", styles.trustGrid)}>
          <figure className={styles.trustFigure}>
            <HouseIllustration
              id="c3-trust-house"
              mode="assembled"
              label=""
              dateStone={local.year}
            />
          </figure>
          <div>
            <Course beat={9} />
            <h2 id="c3-trust" className={styles.h2}>
              {trust.heading}
            </h2>
            <p className={styles.lead}>{trust.lead}</p>
            <dl className={styles.facts}>
              {trust.points.map((point) => (
                <div key={point.heading} className={styles.fact}>
                  <dt>{point.heading}</dt>
                  <dd>{point.body}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.trustFoot}>{trust.meetings}</p>
            <p className={styles.trustTag}>{trust.tagline}</p>
          </div>
        </div>
      </section>

      {/* 10 — Final WhatsApp action */}
      <section
        aria-labelledby="c3-closing"
        data-surface="dark"
        className={cn(styles.closing, styles.deep)}
      >
        <div className="container-rb">
          <Course beat={10} />
          <h2 id="c3-closing" className={styles.h2}>
            {closing.heading}
          </h2>
          <p className={styles.closingBody}>{closing.body}</p>
          <div className={styles.actionRow}>
            <a href={closing.action.href} className={styles.action}>
              {closing.action.label}
              {chevron}
            </a>
            <p className={styles.closingNumber}>
              WhatsApp <strong>{closing.action.displayNumber}</strong>
            </p>
          </div>
          <p className={styles.closingMeet}>{closing.meetings}</p>
        </div>
      </section>
    </div>
  );
}
