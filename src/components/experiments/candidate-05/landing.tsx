import Link from "next/link";

import {
  closing,
  experimentActions,
  hero,
  houseJourney,
  introduction,
  local,
  maintenance,
  paths,
  services,
  storyPlaceholder,
  trust,
} from "@/content/experiments/candidate-05";

import { HouseIllustration, TerraceSkyline } from "./house-illustration";
import styles from "./landing.module.css";

/**
 * Candidate 05 — the ten story beats in order, each a semantic <section>
 * with its own heading. Server Component only: no client JavaScript.
 */

const cx = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(" ");

function Arrow() {
  return (
    <svg
      className={styles.arrow}
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function SectionHead({
  id,
  eyebrow,
  heading,
  lead,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  lead?: string;
}) {
  return (
    <>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <span className={styles.course} aria-hidden="true" />
      <h2 id={id} className={styles.h2}>
        {heading}
      </h2>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </>
  );
}

export function Candidate05Landing() {
  return (
    <>
      {/* 1 — Hero: who we are, where, and what to do next. */}
      <section aria-labelledby="c05-hero-heading" className={cx(styles.hero, styles.sectionCream)}>
        <div className={cx(styles.wrap, styles.heroGrid)}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{hero.eyebrow}</p>
            <h1 id="c05-hero-heading" className={styles.heroTitle}>
              {hero.heading}
            </h1>
            <p className={styles.heroSupporting}>{hero.supporting}</p>

            <p id="c05-choice-prompt" className={styles.choicePrompt}>
              {hero.choicePrompt}
            </p>
            <ul className={styles.choices} aria-labelledby="c05-choice-prompt">
              <li>
                <Link
                  href={experimentActions.landlord.href}
                  className={cx(styles.button, styles.buttonLarge)}
                >
                  {experimentActions.landlord.label}
                </Link>
              </li>
              <li>
                <Link
                  href={experimentActions.tenant.href}
                  className={cx(styles.buttonOutline, styles.buttonLarge)}
                >
                  {experimentActions.tenant.label}
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.heroArt}>
            <HouseIllustration
              idPrefix="c05-hero"
              variant="settled"
              label="Stylised illustration of a red-brick house with warm windows"
            />
          </div>
        </div>

        <div className={styles.utility}>
          <div className={cx(styles.wrap, styles.utilityInner)}>
            <p className={styles.utilityLabel}>{hero.utilityLabel}</p>
            <ul className={styles.utilityList}>
              <li>
                <Link href={experimentActions.viewProperties.href} className={styles.quietLink}>
                  {experimentActions.viewProperties.label}
                  <Arrow />
                </Link>
              </li>
              <li>
                <Link href={experimentActions.appraisal.href} className={styles.quietLink}>
                  {experimentActions.appraisal.label}
                  <Arrow />
                </Link>
              </li>
              <li>
                <Link href={experimentActions.repair.href} className={styles.quietLink}>
                  {experimentActions.repair.label}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2 — Short introduction. */}
      <section
        aria-labelledby="c05-intro-heading"
        className={cx(styles.section, styles.sectionWhite)}
      >
        <div className={cx(styles.wrap, styles.introGrid)}>
          <div>
            <SectionHead
              id="c05-intro-heading"
              eyebrow={introduction.eyebrow}
              heading={introduction.heading}
            />
          </div>
          <div className={cx(styles.stack, styles.measure)}>
            {introduction.paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.muted}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — Static placeholder for the scrolling house story. */}
      <section
        aria-labelledby="c05-story-heading"
        className={cx(styles.section, styles.sectionCream)}
      >
        <div className={styles.wrap}>
          <SectionHead
            id="c05-story-heading"
            eyebrow={storyPlaceholder.eyebrow}
            heading={storyPlaceholder.heading}
            lead={storyPlaceholder.body}
          />
          <div className={styles.storyFrame}>
            <p className={styles.storyFrameLabel}>{storyPlaceholder.frameLabel}</p>
            <div className={styles.storyStage}>
              <div className={styles.storyArt}>
                <HouseIllustration idPrefix="c05-story" variant="exploded" />
              </div>
              <ol className={styles.chapterRail} aria-label="Story chapters">
                {storyPlaceholder.chapters.map((chapter) => (
                  <li key={chapter}>{chapter}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 4 — Landlord and tenant paths. */}
      <section
        aria-labelledby="c05-paths-heading"
        className={cx(styles.section, styles.sectionTint)}
      >
        <div className={styles.wrap}>
          <SectionHead id="c05-paths-heading" eyebrow={paths.eyebrow} heading={paths.heading} />
          <div className={styles.pathGrid}>
            <article className={styles.pathCard} aria-labelledby="c05-landlord-heading">
              <p className={styles.eyebrow}>{paths.landlord.label}</p>
              <h3 id="c05-landlord-heading" className={styles.h3}>
                {paths.landlord.heading}
              </h3>
              <p>{paths.landlord.body}</p>
              <ol className={styles.pathSteps} aria-label="Landlord journey">
                {paths.landlord.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <Link href={paths.landlord.action.href} className={styles.button}>
                {paths.landlord.action.label}
              </Link>
            </article>

            <article
              className={cx(styles.pathCard, styles.pathCardTenant)}
              aria-labelledby="c05-tenant-heading"
            >
              <p className={styles.eyebrow}>{paths.tenant.label}</p>
              <h3 id="c05-tenant-heading" className={styles.h3}>
                {paths.tenant.heading}
              </h3>
              <p>{paths.tenant.body}</p>
              <ol className={styles.pathSteps} aria-label="Tenant journey">
                {paths.tenant.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <Link href={paths.tenant.action.href} className={styles.buttonOutline}>
                {paths.tenant.action.label}
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* 5 — Let, Manage and Care. */}
      <section
        aria-labelledby="c05-services-heading"
        className={cx(styles.section, styles.sectionWhite)}
      >
        <div className={styles.wrap}>
          <SectionHead
            id="c05-services-heading"
            eyebrow={services.eyebrow}
            heading={services.heading}
            lead={services.lead}
          />
          <ol className={styles.serviceGrid}>
            {services.items.map((item) => (
              <li key={item.name} className={styles.serviceItem}>
                <h3 className={styles.h3}>{item.heading}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 — The house / property-care journey. */}
      <section
        aria-labelledby="c05-journey-heading"
        className={cx(styles.section, styles.sectionCream)}
      >
        <div className={styles.wrap}>
          <SectionHead
            id="c05-journey-heading"
            eyebrow={houseJourney.eyebrow}
            heading={houseJourney.heading}
            lead={houseJourney.lead}
          />
          <div className={styles.journeyGrid}>
            <div className={styles.journeyArt}>
              <HouseIllustration idPrefix="c05-journey" variant="annotated" />
            </div>
            <div>
              <ol className={styles.chapters}>
                {houseJourney.chapters.map((chapter) => (
                  <li key={chapter.name} className={styles.chapter}>
                    <div>
                      <p className={styles.chapterName}>{chapter.name}</p>
                      <h3 className={styles.h3}>{chapter.heading}</h3>
                      <p>{chapter.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className={styles.journeyClose}>
                <p>{houseJourney.closing}</p>
                <Link href={houseJourney.action.href} className={styles.button}>
                  {houseJourney.action.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 — Peterborough / local knowledge: facts only. */}
      <section
        aria-labelledby="c05-local-heading"
        className={cx(styles.section, styles.sectionTint)}
      >
        <div className={cx(styles.wrap, styles.localGrid)}>
          <div>
            <SectionHead id="c05-local-heading" eyebrow={local.eyebrow} heading={local.heading} />
            <p className={cx(styles.measure, styles.muted)} style={{ marginTop: "1.25rem" }}>
              {local.body}
            </p>
            <ul className={styles.factRow} aria-label="Confirmed facts">
              <li>Established in 2012</li>
              <li>Across Peterborough</li>
              <li>Landlords and tenants</li>
            </ul>
            <p className={cx(styles.measure, styles.muted)} style={{ marginTop: "1.5rem" }}>
              {local.note}
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              <Link href={local.action.href} className={styles.quietLink}>
                {local.action.label}
                <Arrow />
              </Link>
            </p>
          </div>
          <TerraceSkyline className={styles.skyline} />
        </div>
      </section>

      {/* 8 — Maintenance and property care. */}
      <section
        aria-labelledby="c05-maintenance-heading"
        className={cx(styles.section, styles.sectionWhite)}
      >
        <div className={styles.wrap}>
          <SectionHead
            id="c05-maintenance-heading"
            eyebrow={maintenance.eyebrow}
            heading={maintenance.heading}
            lead={maintenance.body}
          />
          <ol className={styles.steps} aria-label="Maintenance steps">
            {maintenance.steps.map((step) => (
              <li key={step} className={styles.step}>
                {step}
              </li>
            ))}
          </ol>
          <p style={{ marginTop: "2rem" }}>
            <Link href={maintenance.action.href} className={styles.buttonOutline}>
              {maintenance.action.label}
            </Link>
          </p>
        </div>
      </section>

      {/* 9 — Verified trust from approved facts only. */}
      <section
        aria-labelledby="c05-trust-heading"
        className={cx(styles.section, styles.sectionCream)}
      >
        <div className={styles.wrap}>
          <SectionHead id="c05-trust-heading" eyebrow={trust.eyebrow} heading={trust.heading} />
          <dl className={styles.trustList}>
            {trust.points.map((point) => (
              <div key={point.heading} className={styles.trustItem}>
                <dt>{point.heading}</dt>
                <dd>{point.body}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.trustNote}>{trust.note}</p>
        </div>
      </section>

      {/* 10 — Final WhatsApp action. */}
      <section
        aria-labelledby="c05-closing-heading"
        data-surface="dark"
        className={cx(styles.closing, styles.sectionDeep)}
      >
        <div className={cx(styles.wrap, styles.closingGrid)}>
          <div>
            <SectionHead
              id="c05-closing-heading"
              eyebrow={closing.eyebrow}
              heading={closing.heading}
              lead={closing.body}
            />
          </div>
          <div className={styles.closingActions}>
            <a href={closing.action.href} className={cx(styles.buttonLight, styles.buttonLarge)}>
              {closing.action.label}
            </a>
            <p className={styles.closingNumber}>WhatsApp {closing.action.displayNumber}</p>
            <p className={styles.closingMeetings}>{closing.meetings}</p>
          </div>
        </div>
      </section>
    </>
  );
}
