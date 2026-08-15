/**
 * Candidate 05 — landing-page copy.
 *
 * Facts, actions, the service journey and the maintenance steps are imported
 * from the locked experiment source and never retyped. Approved starter copy
 * is reused verbatim from src/content/approved-copy.ts. The short connective
 * lines written for this candidate stay inside the confirmed facts and the
 * tone rules in brief/BUSINESS-FACTS-AND-COPY.md; each is marked "written".
 */

import {
  closingCopy,
  companyIntroduction,
  introductionCopy,
  landlordRouteCopy,
  maintenanceCopy,
  tenantRouteCopy,
  trustPoints,
} from "@/content/approved-copy";
import {
  experimentActions,
  experimentFacts,
  maintenanceSteps,
  serviceJourney,
} from "@/content/experiments/shared-copy";

export { experimentActions, experimentFacts, maintenanceSteps, serviceJourney };

/** Beat 1 — hero. Eyebrow, heading and supporting line are approved copy. */
export const hero = {
  eyebrow: experimentFacts.eyebrow,
  heading: experimentFacts.tagline,
  supporting: experimentFacts.supporting,
  /** written */
  choicePrompt: "What would you like help with?",
  /** written — label for the quiet utility strip beneath the two choices */
  utilityLabel: "Or go straight to",
} as const;

/** Beat 2 — introduction. Both paragraphs are approved copy. */
export const introduction = {
  /** written (storyboard entry-state line) */
  eyebrow: "Who we are",
  /** design/HOMEPAGE-AND-3D-STORYBOARD.md — entry state copy direction */
  heading: "A property has a lot of moving parts.",
  paragraphs: [introductionCopy, companyIntroduction],
} as const;

/** Beat 3 — static placeholder for the scrolling house story. */
export const storyPlaceholder = {
  /** written */
  eyebrow: "The story",
  /** written */
  heading: "A home, told as a story",
  /** written */
  body: "This is where the scrolling house story will live. In a later stage the house will assemble as you scroll — Prepare, Let, Manage and Care — while everything you read stays ordinary text you can skip past.",
  /** written — visible label so the frame is obviously a placeholder */
  frameLabel: "Static preview — the scrolling story arrives in a later stage",
  chapters: ["Prepare", "Let", "Manage", "Care"],
} as const;

/** Beat 4 — landlord and tenant paths. Headings, bodies and CTAs are approved. */
export const paths = {
  /** written */
  eyebrow: "Choose your path",
  /** written */
  heading: "Two journeys, one standard of care",
  landlord: {
    label: "For landlords",
    heading: landlordRouteCopy.heading,
    body: landlordRouteCopy.body,
    /** CLAUDE.md experience rules — landlord story */
    steps: ["Prepare", "Let", "Manage", "Care"],
    action: experimentActions.appraisal,
  },
  tenant: {
    label: "For tenants",
    heading: tenantRouteCopy.heading,
    body: tenantRouteCopy.body,
    /** CLAUDE.md experience rules — tenant story */
    steps: ["Find", "Understand", "Move", "Live"],
    action: experimentActions.viewProperties,
  },
} as const;

/**
 * Beat 5 — Let, Manage and Care.
 * Names and headings come from the locked service journey; the operational
 * body lines are deliberately not displayed (coordinator clarification — those
 * details will be confirmed separately) and nothing replaces them.
 */
export const services = {
  /** written */
  eyebrow: "What we do",
  heading: "Let, Manage and Care",
  /** written */
  lead: "Three parts of one service, whichever stage your property is at.",
  items: serviceJourney.map(({ name, heading }) => ({ name, heading })),
} as const;

/**
 * Beat 6 — the house / property-care journey.
 * Chapter lines follow design/HOMEPAGE-AND-3D-STORYBOARD.md (landlord story).
 */
export const houseJourney = {
  /** written */
  eyebrow: "A home, cared for",
  /** written */
  heading: "How a property comes together",
  /** written */
  lead: "Four chapters, from the first look at a property to the ongoing attention that keeps it working as it should.",
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
  /** storyboard closing line */
  closing: "Your property is in good hands.",
  action: experimentActions.appraisal,
} as const;

/** Beat 7 — Peterborough / local knowledge. Facts only. */
export const local = {
  /** written */
  eyebrow: "Local knowledge",
  /** written from confirmed facts */
  heading: `Across ${experimentFacts.serviceArea}, since ${experimentFacts.establishedYear}`,
  /** written from confirmed facts + approved trust point wording */
  body: `We have worked across ${experimentFacts.serviceArea} since ${experimentFacts.establishedYear}. Residential lettings and property management in the city we know, rather than a promise of national coverage.`,
  /** written */
  note: "Property search and local detail belong to a later stage of the site.",
  action: experimentActions.viewProperties,
} as const;

/** Beat 8 — maintenance and property care. Heading and body are approved. */
export const maintenance = {
  /** written */
  eyebrow: "Maintenance",
  heading: maintenanceCopy.heading,
  body: maintenanceCopy.body,
  steps: maintenanceSteps,
  action: experimentActions.repair,
} as const;

/** Beat 9 — verified trust, built only from approved facts. */
export const trust = {
  /** written */
  eyebrow: "What you can rely on",
  /** written */
  heading: "Facts we can stand behind",
  points: [
    ...trustPoints,
    {
      heading: "Meetings by appointment",
      body: experimentFacts.meetings,
    },
  ],
  /** written */
  note: "We only publish details we can stand behind. Further contact and company information will appear as it is confirmed.",
} as const;

/** Beat 10 — final WhatsApp action. Heading and body are approved. */
export const closing = {
  /** written */
  eyebrow: "Get in touch",
  heading: closingCopy.heading,
  body: closingCopy.body,
  action: experimentActions.whatsapp,
  meetings: experimentFacts.meetings,
} as const;
