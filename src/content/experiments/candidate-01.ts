/**
 * Candidate-specific copy for /experiments/candidate-01.
 *
 * Facts, actions, the service journey names and the maintenance steps are
 * imported from the locked shared copy and never retyped. Approved starter
 * sentences are re-used verbatim from src/content/approved-copy.ts. Anything
 * written here for layout stays inside the confirmed facts and the brief's
 * voice, and introduces no operational or service claims of its own.
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

/** Landlord and tenant story stages (CLAUDE.md experience rules). */
export const landlordStages = ["Prepare", "Let", "Manage", "Care"] as const;
export const tenantStages = ["Find", "Understand", "Move", "Live"] as const;

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
} as const;

export const introduction = {
  chapter: "Who we are",
  heading: "A local lettings business, one house at a time",
  lead: companyIntroduction,
  body: introductionCopy,
  facts: [
    `Established in ${experimentFacts.establishedYear}`,
    `Across ${experimentFacts.serviceArea}`,
    "Landlords and tenants",
  ],
} as const;

export const story = {
  chapter: "The story",
  heading: "One house, told in four chapters",
  body: "This is where the scrolling story of a home in our care will live: the same house, seen again as it is prepared, let, managed and cared for. In this round it is a still frame.",
  stages: landlordStages,
  caption: "Still frame — the moving version arrives in a later round.",
  imageTitle: "A drawn red-brick house: the still frame where the scrolling story will live.",
} as const;

export const paths = {
  chapter: "Two paths",
  heading: "Start from where you stand",
  landlord: {
    label: "For landlords",
    heading: landlordRouteCopy.heading,
    body: landlordRouteCopy.body,
    stages: landlordStages,
    action: experimentActions.appraisal,
  },
  tenant: {
    label: "For tenants",
    heading: tenantRouteCopy.heading,
    body: tenantRouteCopy.body,
    stages: tenantStages,
    action: experimentActions.viewProperties,
  },
} as const;

/** Only the approved names and headings are shown; the detail is not displayed in this round. */
export const journey = {
  chapter: "Let, manage and care",
  heading: "Three parts of one service",
  body: "The three parts of what we do, in the order a property usually needs them.",
  items: serviceJourney.map(({ name, heading }) => ({ name, heading })),
} as const;

export const houseJourney = {
  chapter: "One house, start to finish",
  heading: "A house is cared for in moments like these",
  body: "The same property, from the day it is made ready to the day something needs fixing.",
  moments: [
    {
      title: "Made ready",
      body: "Where every tenancy begins: a home prepared for letting.",
      glyph: "clipboard",
    },
    { title: "Let", body: "New keys, clear paperwork and a proper start.", glyph: "key" },
    { title: "Moving in", body: "Everyone starts from the same page.", glyph: "door" },
    {
      title: "Living there",
      body: "The everyday of a tenancy, with someone to talk to when you need to.",
      glyph: "window",
    },
    {
      title: "Something needs attention",
      body: "Report it. We triage, arrange, update and resolve.",
      glyph: "spanner",
    },
  ],
} as const;

export const local = {
  chapter: experimentFacts.serviceArea,
  heading: `${experimentFacts.serviceArea}, since ${experimentFacts.establishedYear}`,
  body: trustPoints[1].body,
  points: [
    `Established in ${experimentFacts.establishedYear}`,
    experimentFacts.whatWeDo,
    trustPoints[2].heading,
  ],
  imageTitle: "A drawn terrace of red-brick houses.",
} as const;

export const maintenance = {
  chapter: "When something needs attention",
  heading: maintenanceCopy.heading,
  body: maintenanceCopy.body,
  steps: maintenanceSteps,
  action: experimentActions.repair,
} as const;

export const trust = {
  chapter: "Plainly stated",
  heading: "The facts, plainly",
  intro: "The things we can say plainly, because they are true.",
  points: trustPoints,
  meetings: experimentFacts.meetings,
} as const;

export const closing = {
  chapter: "Talk to us",
  heading: closingCopy.heading,
  body: closingCopy.body,
  action: experimentActions.whatsapp,
  meetings: experimentFacts.meetings,
} as const;

/** Chapter labels in page order (beats 2–10). Beat 1 is the hero. */
export const chapters = [
  introduction.chapter,
  story.chapter,
  paths.chapter,
  journey.chapter,
  houseJourney.chapter,
  local.chapter,
  maintenance.chapter,
  trust.chapter,
  closing.chapter,
] as const;
