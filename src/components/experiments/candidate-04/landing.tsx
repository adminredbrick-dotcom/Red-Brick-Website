import Link from "next/link";

import { c04 } from "@/content/experiments/candidate-04";

import { Datestone, HeroHouse, JourneyHouse, StoryboardStrip } from "./illustrations";
import s from "./landing.module.css";

/**
 * Candidate 04 — landing page body.
 *
 * Ten story beats in the locked order, each a semantic <section> with a real
 * heading. Layout is a Split Studio diptych that alternates direction down the
 * page like a course of brick; the story placeholder and the maintenance steps
 * deliberately break the rhythm at full width. Server component, no client JS.
 */
/** The locked repair label, with the question kept on one line so any wrap falls after the "?". */
function RepairLabel() {
  const label = c04.actions.repair.label;
  const [question, ...rest] = label.split("? ");
  if (rest.length === 0) return <>{label}</>;
  return (
    <>
      <span className={s.noWrap}>{question}?</span> {rest.join("? ")}
    </>
  );
}

export function Candidate04Landing() {
  const { actions, hero, intro, story, paths, journey, house, local, maintenance, trust, closing } =
    c04;

  return (
    <div className={s.page}>
      <div className={s.course} aria-hidden="true" />

      {/* 1 — Hero: orientation, audience choices, direct actions */}
      <section aria-labelledby="c04-hero" className={s.hero}>
        <div className={`${s.wrap} ${s.heroGrid}`}>
          <div>
            <p className={s.dateline}>{hero.dateline}</p>
            <h1 id="c04-hero" className={s.h1}>
              <span>Property cared for.</span>
              <span>People looked after.</span>
            </h1>
            <p className={s.lede}>{hero.lede}</p>
            <div className={s.actions}>
              <Link href={actions.landlord.href} className={`${s.chip} ${s.chipPrimary}`}>
                {actions.landlord.label}
              </Link>
              <Link href={actions.tenant.href} className={s.chip}>
                {actions.tenant.label}
              </Link>
              <Link href={actions.viewProperties.href} className={s.chip}>
                {actions.viewProperties.label}
              </Link>
            </div>
            <p className={s.repairLine}>
              <Link href={actions.repair.href} className={s.textLink}>
                <RepairLabel />
              </Link>
            </p>
          </div>
          <figure className={s.heroFigure}>
            <HeroHouse className={s.heroArt} label={hero.figureLabel} />
          </figure>
        </div>
      </section>

      {/* 2 — Short Red Brick introduction */}
      <section aria-labelledby="c04-intro" className={`${s.chapter} ${s.chapterRule}`}>
        <div className={`${s.wrap} ${s.diptych}`}>
          <div className={s.prose}>
            <h2 id="c04-intro" className={s.h2}>
              {intro.heading}
            </h2>
            <p>{intro.body}</p>
          </div>
          <p className={s.statement}>{intro.statement}</p>
        </div>
      </section>

      {/* 3 — Visual scrolling-story placeholder (static in round one) */}
      <section aria-labelledby="c04-story" className={`${s.chapterTight} ${s.band}`}>
        <div className={s.wrap}>
          <div className={s.prose}>
            <h2 id="c04-story" className={s.h2}>
              {story.heading}
            </h2>
            <p>{story.body}</p>
          </div>
          <figure className={s.placeholder}>
            <p className={s.placeholderTag}>{story.placeholderLabel}</p>
            <StoryboardStrip className={s.storyArt} label={story.figureLabel} />
            <figcaption>
              <ol className={s.frames}>
                {story.frames.map((frame) => (
                  <li key={frame.title}>
                    <span className={s.frameTitle}>{frame.title}</span>
                    <span className={s.frameCaption}>{frame.caption}</span>
                  </li>
                ))}
              </ol>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 4 — Landlord and tenant paths */}
      <section aria-labelledby="c04-paths" className={s.chapter}>
        <div className={s.wrap}>
          <h2 id="c04-paths" className={s.h2}>
            {paths.heading}
          </h2>
          <div className={s.pair}>
            <article className={s.path}>
              <h3 className={`${s.h3} ${s.brickMark}`}>{paths.landlord.eyebrow}</h3>
              <p className={s.pathLead}>{paths.landlord.heading}</p>
              <div className={s.prose}>
                <p>{paths.landlord.body}</p>
              </div>
              <div className={s.pathActions}>
                <Link href={actions.appraisal.href} className={s.chip}>
                  {actions.appraisal.label}
                </Link>
                <Link href={actions.landlord.href} className={s.textLink}>
                  {actions.landlord.label}
                  <span className={s.arrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </article>
            <article className={s.path}>
              <h3 className={`${s.h3} ${s.brickMark}`}>{paths.tenant.eyebrow}</h3>
              <p className={s.pathLead}>{paths.tenant.heading}</p>
              <div className={s.prose}>
                <p>{paths.tenant.body}</p>
              </div>
              <div className={s.pathActions}>
                <Link href={actions.viewProperties.href} className={s.chip}>
                  {actions.viewProperties.label}
                </Link>
                <Link href={actions.tenant.href} className={s.textLink}>
                  {actions.tenant.label}
                  <span className={s.arrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 5 — Let, Manage and Care */}
      <section aria-labelledby="c04-journey" className={`${s.chapter} ${s.chapterRule}`}>
        <div className={`${s.wrap} ${s.diptych}`}>
          <div className={s.prose}>
            <h2 id="c04-journey" className={s.h2}>
              {journey.heading}
            </h2>
            <p>{journey.lede}</p>
          </div>
          <ol className={s.sheet}>
            {c04.serviceJourney.map((stage) => (
              <li key={stage.name}>
                <span className={s.rowName}>{stage.name}</span>
                <h3 className={s.rowHeading}>{stage.heading}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 — A house / property-care journey */}
      <section aria-labelledby="c04-house" className={`${s.chapter} ${s.chapterRule}`}>
        <div className={`${s.wrap} ${s.diptych} ${s.diptychWide}`}>
          <figure className={s.houseFig}>
            <JourneyHouse className={s.houseGlyph} label={house.figureLabel} />
            <div className={`${s.railBlock} ${s.railFirst}`}>
              <p className={s.railLabel} id="c04-rail-landlord">
                {house.landlord.label}
              </p>
              <ol className={s.rail} aria-labelledby="c04-rail-landlord">
                {house.landlord.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
            <div className={s.railBlock}>
              <p className={s.railLabel} id="c04-rail-tenant">
                {house.tenant.label}
              </p>
              <ol className={s.rail} aria-labelledby="c04-rail-tenant">
                {house.tenant.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </figure>
          <div className={`${s.prose} ${s.textR}`}>
            <h2 id="c04-house" className={s.h2}>
              {house.heading}
            </h2>
            <p>{house.body}</p>
          </div>
        </div>
      </section>

      {/* 7 — Peterborough / local knowledge (facts only) */}
      <section aria-labelledby="c04-local" className={`${s.chapter} ${s.chapterRule}`}>
        <div className={`${s.wrap} ${s.diptych}`}>
          <div className={s.prose}>
            <h2 id="c04-local" className={s.h2}>
              {local.heading}
            </h2>
            <p>{local.body}</p>
            <p className={s.muted}>{local.supporting}</p>
          </div>
          <figure className={s.figure}>
            <Datestone
              className={s.stoneArt}
              label={local.figureLabel}
              line1={local.datestoneLine1}
              year={local.datestoneYear}
            />
          </figure>
        </div>
      </section>

      {/* 8 — Maintenance and property care */}
      <section aria-labelledby="c04-maintenance" className={`${s.chapter} ${s.chapterRule}`}>
        <div className={s.wrap}>
          <div className={s.prose}>
            <h2 id="c04-maintenance" className={s.h2}>
              {maintenance.heading}
            </h2>
            <p>{maintenance.body}</p>
          </div>
          <ol className={s.steps}>
            {c04.maintenanceSteps.map((step, index) => (
              <li key={step}>
                <span className={s.stepNum}>{String(index + 1).padStart(2, "0")}</span>
                <span className={s.stepName}>{step}</span>
              </li>
            ))}
          </ol>
          <p className={s.repairLine}>
            <Link href={actions.repair.href} className={s.textLink}>
              <RepairLabel />
            </Link>
          </p>
        </div>
      </section>

      {/* 9 — Verified trust based only on approved facts */}
      <section aria-labelledby="c04-trust" className={`${s.chapter} ${s.chapterRule}`}>
        <div className={`${s.wrap} ${s.diptych}`}>
          <div className={s.prose}>
            <h2 id="c04-trust" className={s.h2}>
              {trust.heading}
            </h2>
            <p>{trust.lede}</p>
          </div>
          <dl className={s.bricks}>
            {trust.points.map((point) => (
              <div key={point.heading} className={s.brick}>
                <dt>{point.heading}</dt>
                <dd>{point.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 10 — Final WhatsApp action */}
      <section aria-labelledby="c04-closing" className={s.band}>
        <div className={`${s.course} ${s.courseOnSand}`} aria-hidden="true" />
        <div className={`${s.wrap} ${s.closing} ${s.closingGrid}`}>
          <div className={s.prose}>
            <h2 id="c04-closing" className={s.h2}>
              {closing.heading}
            </h2>
            <p>{closing.body}</p>
          </div>
          <div>
            <a href={actions.whatsapp.href} className={`${s.chip} ${s.chipPrimary}`}>
              {actions.whatsapp.label}
            </a>
            <p className={s.closingMeta}>
              <span className={s.closingNumber}>WhatsApp {actions.whatsapp.displayNumber}</span>
              <br />
              {closing.meetings}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
