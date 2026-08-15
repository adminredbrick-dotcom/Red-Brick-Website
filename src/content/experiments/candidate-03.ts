/**
 * Candidate 03 — page copy.
 *
 * Facts, locked actions, the service journey and the maintenance steps are
 * imported from the shared experiment copy and never retyped here. Approved
 * starter copy is imported verbatim from the approved-copy module. Everything
 * else in this file is candidate-written wording that stays inside the
 * confirmed facts and the brief's tone rules (no claims, figures or promises).
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

/** Beat 1 — hero. */
export const hero = {
  heading: experimentFacts.tagline,
  /** The tagline's two sentences, so each can hold its own line. */
  headingLines: experimentFacts.tagline.split(/(?<=\.)\s+/),
  supporting: experimentFacts.supporting,
  established: `Established in ${experimentFacts.establishedYear}.`,
  question: "What would you like help with?",
  landlord: experimentActions.landlord,
  tenant: experimentActions.tenant,
  viewProperties: experimentActions.viewProperties,
  repair: experimentActions.repair,
  /** Approved eyebrow line, used here as the illustration caption. */
  caption: experimentFacts.eyebrow,
  illustrationAlt:
    "A brick house drawn as separate parts — roof, walls, windows and front door — not yet fitted together.",
} as const;

/** Beat 2 — introduction (storyboard entry line + approved copy, verbatim). */
export const intro = {
  heading: "A property has a lot of moving parts.",
  lead: "We bring the important ones into one clearer journey.",
  paragraphs: [introductionCopy, companyIntroduction],
} as const;

/** Beat 3 — the static placeholder for the future scrolling story. */
export const storyboard = {
  heading: "Where the story will live",
  body: "The finished homepage opens with a short, quiet scroll-driven film of the everyday details we look after: brick, doors, window light and cared-for rooms. Round one shows the storyboard stills in its place.",
  tag: "Placeholder — storyboard stills",
  note: "The scrolling version arrives in a later build stage. Every word on this page stays readable without it.",
  stills: [
    { key: "brick", label: "Morning light on brick" },
    { key: "door", label: "A front door" },
    { key: "window", label: "Window light" },
    { key: "room", label: "A cared-for room" },
    { key: "dusk", label: "Home at dusk" },
  ],
} as const;

/** Beat 4 — landlord and tenant paths (approved route copy, verbatim). */
export const paths = {
  heading: "Two ways in",
  lead: "Landlords and tenants come to us with different questions. Each path answers them in order.",
  landlord: {
    audience: "Landlords",
    heading: landlordRouteCopy.heading,
    body: landlordRouteCopy.body,
    steps: ["Prepare", "Let", "Manage", "Care"],
    action: experimentActions.appraisal,
    secondary: experimentActions.landlord,
  },
  tenant: {
    audience: "Tenants",
    heading: tenantRouteCopy.heading,
    body: tenantRouteCopy.body,
    steps: ["Find", "Understand", "Move", "Live"],
    action: experimentActions.viewProperties,
    secondary: experimentActions.tenant,
  },
} as const;

/**
 * Beat 5 — Let, Manage and Care. Only the approved journey names and headings
 * are shown; the operational detail in `serviceJourney.body` is being
 * confirmed separately and is deliberately not displayed.
 */
export const services = {
  heading: `${serviceJourney[0].name}, ${serviceJourney[1].name.toLowerCase()} and ${serviceJourney[2].name.toLowerCase()}`,
  lead: "Three parts of one job, in the order a property moves through them.",
  items: serviceJourney.map(({ name, heading }) => ({ name, heading })),
} as const;

/** Beat 6 — the house journey (storyboard chapter copy, verbatim). */
export const journey = {
  heading: "How a home comes together",
  lead: "Scroll, and the house settles into place chapter by chapter. If motion is turned off, the finished house is shown throughout.",
  illustrationAlt:
    "A brick house at dusk. As the chapters pass, its walls, roof, windows and door move into place and the windows light up.",
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
    action: experimentActions.appraisal,
    secondary: experimentActions.viewProperties,
  },
} as const;

/** Beat 7 — Peterborough, facts only. */
export const local = {
  heading: `${experimentFacts.serviceArea}, since ${experimentFacts.establishedYear}`,
  place: experimentFacts.serviceArea,
  year: String(experimentFacts.establishedYear),
  focus: trustPoints[1],
  body: "We work in one city rather than everywhere, and we bring practical local knowledge to every property we look after.",
  whatWeDo: experimentFacts.whatWeDo,
} as const;

/** Beat 8 — maintenance and property care (approved copy + steps, verbatim; step lines written). */
export const maintenance = {
  heading: maintenanceCopy.heading,
  body: maintenanceCopy.body,
  steps: maintenanceSteps.map((name, index) => ({
    name,
    body: [
      "Tell us what is wrong, with a photo if you can.",
      "We look at what the issue involves and how pressing it is.",
      "The work is agreed and organised.",
      "You hear what is happening and what comes next.",
      "The job is finished.",
    ][index] as string,
  })),
  action: experimentActions.repair,
} as const;

/** Beat 9 — verified trust (approved trust points, verbatim). */
export const trust = {
  heading: "What you can rely on",
  lead: "We publish only what we can confirm. These are the facts.",
  points: trustPoints,
  meetings: experimentFacts.meetings,
  tagline: experimentFacts.tagline,
} as const;

/** Beat 10 — final WhatsApp action (approved closing copy, verbatim). */
export const closing = {
  heading: closingCopy.heading,
  body: closingCopy.body,
  action: experimentActions.whatsapp,
  meetings: experimentFacts.meetings,
} as const;

/** Chapter list for the course dividers (ten beats). */
export const beatCount = 10;
