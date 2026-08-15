/**
 * Candidate 02 — candidate-specific copy.
 *
 * Facts, actions and locked copy are imported from shared-copy.ts and
 * approved-copy.ts and never retyped. Every other sentence here is either
 * verbatim from a handoff document (noted inline) or written for layout
 * within the confirmed facts and the brief's voice rules. The detailed
 * serviceJourney bodies are deliberately not displayed (coordinator note):
 * only the Let, Manage and Care names and headings appear.
 */

import {
  closingCopy,
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

/** Chapter labels used as section eyebrows — plain names for wayfinding. */
export const chapterLabels = {
  intro: "Who we are",
  story: "The story",
  paths: "Two paths",
  services: "What we do",
  house: "The house",
  local: experimentFacts.serviceArea,
  maintenance: "Maintenance",
  trust: "The facts",
  closing: "Talk to us",
} as const;

export const hero = {
  eyebrow: experimentFacts.eyebrow,
  heading: experimentFacts.tagline,
  supporting: experimentFacts.supporting,
  choices: [
    {
      action: experimentActions.landlord,
      /** Written: what happens next when the choice is taken. */
      next: "How we let, manage and care for a property you own.",
    },
    {
      action: experimentActions.tenant,
      next: "How we help you find a home, understand the costs and settle in.",
    },
  ],
  utilityActions: [
    experimentActions.viewProperties,
    experimentActions.appraisal,
    experimentActions.repair,
  ],
} as const;

export const intro = {
  heading: `We are ${experimentFacts.name}`,
} as const;

export const story = {
  /** design/HOMEPAGE-AND-3D-STORYBOARD.md — entry-state copy, verbatim. */
  heading: "A property has a lot of moving parts.",
  body: "We bring the important ones into one clearer journey.",
  /** The house layers named in the storyboard's model plan. */
  parts: ["Foundation", "Walls", "Rooms", "Door and windows", "Roof"],
  placeholder: {
    label: "Where the house story will live",
    body: "In this round the story is a still. Later, scrolling will bring these parts together — and the page will read just as well without it.",
  },
} as const;

export interface PathStep {
  readonly name: string;
  /** design/HOMEPAGE-AND-3D-STORYBOARD.md chapter headings, verbatim. */
  readonly line: string;
}

export const paths = {
  heading: "For landlords and for tenants",
  landlord: {
    key: "landlord",
    audience: "For landlords",
    title: landlordRouteCopy.heading,
    steps: [
      { name: "Prepare", line: "Start with a clear picture." },
      { name: "Let", line: "Present the home clearly." },
      { name: "Manage", line: "Keep the tenancy connected." },
      { name: "Care", line: "Look after what happens next." },
    ] as readonly PathStep[],
    body: landlordRouteCopy.body,
    action: experimentActions.appraisal,
  },
  tenant: {
    key: "tenant",
    audience: "For tenants",
    title: tenantRouteCopy.heading,
    steps: [
      { name: "Find", line: "Find the right next step." },
      { name: "Understand", line: "Know the home before you commit." },
      { name: "Move", line: "Make the move clearer." },
      { name: "Live", line: "Know how to reach us." },
    ] as readonly PathStep[],
    body: tenantRouteCopy.body,
    action: experimentActions.viewProperties,
  },
} as const;

export const services = {
  heading: "Let, Manage and Care",
  lede: "Three stages of one journey, in the order a landlord meets them.",
  /** Names and headings only — the detailed bodies are held back until confirmed. */
  items: serviceJourney.map(({ name, heading }) => ({ name, heading })),
  note: "What each stage includes will be published here once it is confirmed.",
} as const;

export const house = {
  /** brief/WEBSITE-CONCEPT-v1.md — "Reveal how care holds a home together." */
  heading: "How care holds a home together",
  lede: "The same four things matter in every tenancy.",
  /** The shared (no-selection) story chapters from the storyboard. */
  chapters: [
    {
      name: "Property",
      line: "The building itself, and the condition it is in.",
    },
    {
      name: "People",
      /** approved-copy.ts trust point, verbatim. */
      line: trustPoints[2].body,
    },
    {
      name: "Communication",
      line: "Everyone knows what is happening now and what happens next.",
    },
    {
      name: "Care",
      line: "Looking after the home, before and after move-in.",
    },
  ],
  finale: [
    /** Storyboard finale lines, verbatim. */
    { line: "Your property is in good hands.", action: experimentActions.landlord },
    { line: "A good property should feel easy to live in.", action: experimentActions.tenant },
  ],
} as const;

export const local = {
  heading: `Across ${experimentFacts.serviceArea}, since ${experimentFacts.establishedYear}`,
  /** approved-copy.ts trust points, verbatim. */
  body: [trustPoints[0].body, trustPoints[1].body],
  note: "Local property insight belongs in search, on property pages and in the rental report as those parts are built — not in claims we cannot yet back up.",
} as const;

export const maintenance = {
  heading: maintenanceCopy.heading,
  body: maintenanceCopy.body,
  /** Step lines from the Phase 1 maintenance page (src/app/maintenance/page.tsx). */
  steps: [
    {
      name: maintenanceSteps[0],
      line: "Tell us what has happened, where, and how urgent it feels.",
    },
    { name: maintenanceSteps[1], line: "We assess the issue and agree the right priority." },
    { name: maintenanceSteps[2], line: "The appropriate work is organised for the property." },
    { name: maintenanceSteps[3], line: "You are kept informed about what happens next." },
    { name: maintenanceSteps[4], line: "The issue is completed and checked." },
  ],
  action: experimentActions.repair,
} as const;

export const trust = {
  heading: "What you can rely on",
  ledger: [
    { term: "Name", detail: experimentFacts.name },
    { term: "Established", detail: String(experimentFacts.establishedYear) },
    { term: "Where we work", detail: `Across ${experimentFacts.serviceArea}` },
    { term: "What we do", detail: "Residential lettings and property management" },
    { term: "Contact", detail: `WhatsApp ${experimentActions.whatsapp.displayNumber}` },
    { term: "Meetings", detail: "By appointment" },
  ],
  note: "We publish only what we can stand behind. Anything still being confirmed is left out rather than filled in.",
} as const;

export const closing = {
  heading: closingCopy.heading,
  body: closingCopy.body,
  action: experimentActions.whatsapp,
  meetings: experimentFacts.meetings,
} as const;
