/**
 * Candidate 04 — page copy.
 *
 * Facts, actions, the service journey and the maintenance steps are imported
 * from the locked shared copy and never retyped. Approved starter copy is
 * re-used verbatim from src/content/approved-copy.ts. The few written lines
 * below stay inside the confirmed facts and make no claims of their own.
 */

import {
  companyIntroduction,
  introductionCopy,
  landlordRouteCopy,
  tenantRouteCopy,
  maintenanceCopy,
  closingCopy,
  trustPoints,
} from "@/content/approved-copy";
import {
  experimentActions,
  experimentFacts,
  maintenanceSteps,
  serviceJourney,
} from "@/content/experiments/shared-copy";

export const c04 = {
  facts: experimentFacts,
  actions: experimentActions,
  serviceJourney,
  maintenanceSteps,

  hero: {
    dateline: experimentFacts.eyebrow, // approved eyebrow, set as a plain dateline
    heading: experimentFacts.tagline,
    lede: experimentFacts.supporting, // approved supporting line
    figureLabel: "Line drawing of a two-storey red-brick house with a front door and four windows",
  },

  intro: {
    heading: "More than paperwork.",
    body: companyIntroduction, // verbatim (brand guidelines, section 02)
    statement: introductionCopy, // verbatim (approved starter copy)
  },

  story: {
    heading: "Where the story of a home will live",
    body: "A scrolling story of one house — prepared, let, managed and cared for — arrives in a later stage. This is its place on the page. Until then, a static storyboard holds the space.",
    placeholderLabel: "Placeholder — static in this round",
    frames: [
      { title: "The street", caption: "A row of homes across Peterborough" },
      { title: "The house", caption: "One home, ready for a tenancy" },
      { title: "The window", caption: "Looking after the details" },
      { title: "The door", caption: "Somewhere to come home to" },
    ],
    figureLabel: "Four storyboard frames: a street of houses, one house, a window and a front door",
  },

  paths: {
    heading: "Two paths, equal care",
    landlord: {
      eyebrow: "For landlords",
      heading: landlordRouteCopy.heading, // verbatim
      body: landlordRouteCopy.body, // verbatim
    },
    tenant: {
      eyebrow: "For tenants",
      heading: tenantRouteCopy.heading, // verbatim
      body: tenantRouteCopy.body, // verbatim
    },
  },

  journey: {
    heading: "Let, Manage and Care",
    lede: "Our service journey has three parts. Each one is plain about what it covers.",
  },

  house: {
    heading: "One home, two journeys",
    body: "Every tenancy is one house seen from two sides. Landlords move through preparing, letting, managing and caring for the property. Tenants move through finding, understanding, moving into and living in it. We work in the middle, keeping communication clear for both.",
    landlord: { label: "Landlord journey", steps: ["Prepare", "Let", "Manage", "Care"] },
    tenant: { label: "Tenant journey", steps: ["Find", "Understand", "Move", "Live"] },
    figureLabel: "A single house drawn between the landlord journey and the tenant journey",
  },

  local: {
    heading: `${experimentFacts.serviceArea}, since ${experimentFacts.establishedYear}`,
    body: trustPoints[1].body, // "We work across the city we know, rather than promising national coverage."
    supporting: trustPoints[0].body, // "Residential lettings experience rooted in Peterborough for over a decade."
    datestoneLine1: "Red Brick",
    datestoneYear: String(experimentFacts.establishedYear),
    figureLabel: `A carved datestone set into brickwork, reading Red Brick ${experimentFacts.establishedYear}`,
  },

  maintenance: {
    heading: maintenanceCopy.heading, // verbatim
    body: maintenanceCopy.body, // verbatim
  },

  trust: {
    heading: "Facts you can check",
    lede: "Three things we can say for certain, and nothing we cannot.",
    points: trustPoints, // verbatim
  },

  closing: {
    heading: closingCopy.heading, // verbatim
    body: closingCopy.body, // verbatim
    meetings: experimentFacts.meetings,
  },
} as const;
