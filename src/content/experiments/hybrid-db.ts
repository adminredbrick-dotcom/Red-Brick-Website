/**
 * Copy for /experiments/hybrid-db — "One house. Two paths. Four chapters."
 *
 * Facts, actions, the service journey names and the maintenance steps come
 * from the locked shared copy and are never retyped. Approved sentences are
 * reused verbatim from src/content/approved-copy.ts. Chapter names and any
 * lines written here are PROTOTYPE COPY: storyboard labels for review, not
 * production-approved wording or service promises
 * (docs/landing-experiments/ROUND-1-RESULTS.md, section 8).
 */

import {
  closingCopy,
  companyIntroduction,
  landlordRouteCopy,
  maintenanceCopy,
  tenantRouteCopy,
} from "@/content/approved-copy";
import {
  experimentActions,
  experimentFacts,
  maintenanceSteps,
  serviceJourney,
} from "@/content/experiments/shared-copy";

/* 1 — Hero */
export const hero = {
  eyebrow: experimentFacts.eyebrow,
  heading: experimentFacts.tagline,
  supporting: experimentFacts.supporting,
  choicePrompt: "Where would you like to start?",
  choices: [
    {
      action: experimentActions.landlord,
      note: "Let, manage and care for your property with us.",
    },
    {
      action: experimentActions.tenant,
      note: `Homes to rent across ${experimentFacts.serviceArea}.`,
    },
  ],
  quickLinks: [
    experimentActions.viewProperties,
    experimentActions.appraisal,
    experimentActions.repair,
  ],
  houseTitle: "A red-brick house, front elevation.",
} as const;

/* 2 — One house, four chapters (the sole cinematic section) */
export const story = {
  chapter: "The story",
  heading: "One house, four chapters",
  lead: "The same home, seen four times: prepared, let, managed and cared for.",
  houseTitle:
    "A red-brick house at dusk. Its walls, roof, windows and door come together and the windows light up.",
  /** Provisional chapter labels — storyboard names, not confirmed service promises. */
  chapters: [
    {
      name: "Prepare",
      heading: "Start with a clear picture.",
      body: "Understand the property, its condition and the next steps before it reaches the market.",
    },
    {
      name: "Let",
      heading: "Present the home clearly.",
      body: "Give prospective tenants the information they need to make an informed enquiry.",
    },
    {
      name: "Manage",
      heading: "Keep the tenancy connected.",
      body: "Good management depends on clear administration, communication and follow-through.",
    },
    {
      name: "Care",
      heading: "Look after what happens next.",
      body: "Maintenance coordination and ongoing attention help keep a property working as it should.",
    },
  ],
  close: {
    heading: "Your property is in good hands.",
    tenantLine: "A good property should feel easy to live in.",
  },
} as const;

/* 3 — Start from where you stand */
export const paths = {
  chapter: "Two paths",
  heading: "Start from where you stand",
  landlord: {
    label: "For landlords",
    heading: landlordRouteCopy.heading,
    body: landlordRouteCopy.body,
    services: serviceJourney.map(({ name, heading }) => ({ name, heading })),
    action: experimentActions.appraisal,
  },
  tenant: {
    label: "For tenants",
    heading: tenantRouteCopy.heading,
    body: tenantRouteCopy.body,
    action: experimentActions.viewProperties,
  },
} as const;

/* 4 — Peterborough and verified trust */
export const local = {
  chapter: experimentFacts.serviceArea,
  heading: `${experimentFacts.serviceArea}, since ${experimentFacts.establishedYear}`,
  body: companyIntroduction,
  facts: [
    `Established in ${experimentFacts.establishedYear}`,
    experimentFacts.whatWeDo,
    experimentFacts.meetings,
  ],
  terraceTitle: "A short terrace of red-brick houses.",
} as const;

/* 5 — When something needs attention */
export const maintenance = {
  chapter: "When something needs attention",
  heading: maintenanceCopy.heading,
  body: maintenanceCopy.body,
  steps: maintenanceSteps,
  action: experimentActions.repair,
} as const;

/* 6 — Final contact */
export const closing = {
  chapter: "Talk to us",
  heading: closingCopy.heading,
  body: closingCopy.body,
  action: experimentActions.whatsapp,
} as const;
