/**
 * Homepage copy that is not already covered verbatim by
 * src/content/approved-copy.ts or src/content/house-story.ts.
 *
 * Everything here is either (a) approved copy re-used from those modules /
 * src/config, or (b) short neutral, factual sentences within the confirmed
 * business facts. Any sentence written for Phase 2 is marked "Phase 2 copy"
 * so it can be reviewed in one place. Nothing here may claim reviews,
 * figures, response times, availability, credentials or contact details that
 * are not in src/config/business.ts.
 */

import { routes } from "@/config/site";
import {
  heroCopy,
  introductionCopy,
  landlordRouteCopy,
  tenantRouteCopy,
} from "@/content/approved-copy";

/* ---------------------------------------------------------------- Hero */

/** Master brief, "Audience promise". */
export const audienceQuestion = "What would you like help with?";

export const audienceChoices = {
  landlord: {
    eyebrow: "For landlords",
    /** Master brief wording. */
    label: "I'm a landlord",
    /** Approved landlord route heading, verbatim. */
    supporting: landlordRouteCopy.heading,
    /** Approved hero action, verbatim. */
    directLabel: heroCopy.actions.landlord,
    directHref: routes.landlords.path,
  },
  tenant: {
    eyebrow: "For tenants",
    label: "I'm looking for a home",
    supporting: tenantRouteCopy.heading,
    directLabel: heroCopy.actions.tenant,
    directHref: routes.properties.path,
  },
} as const;

/** Master brief: "Already rent with us? Report a repair" — the visible utility route. */
export const repairUtility = {
  prefix: "Already rent with us?",
  label: heroCopy.actions.repair,
  href: routes.maintenance.path,
} as const;

/** Phase 2 copy — small honesty caption on the hero media frame. */
export const heroMediaCaption = "Illustration — the property film arrives in a later stage.";

/* --------------------------------------------------------- Switch view */

export const switchView = {
  label: "Switch view",
  options: [
    { value: "landlord", label: "Landlord" },
    { value: "tenant", label: "Tenant" },
    { value: "none", label: "Both" },
  ],
  /** Phase 2 copy — helper text beside the control. */
  hint: "Both routes stay available whichever view you choose.",
} as const;

/* ---------------------------------------------------------- Trust strip */

/**
 * The approved introduction, split into heading + body for layout only.
 * The unit test guarantees `${heading} ${body}` equals introductionCopy.
 */
export const trustIntro = {
  heading: "Property management is about more than paperwork.",
  body: introductionCopy.slice("Property management is about more than paperwork.".length + 1),
} as const;

/* ---------------------------------------------------------- House story */

export const storyControls = {
  skipLabel: "Skip the story",
  /** Phase 2 copy — makes the static state honest and story-ready. */
  sequenceCaption:
    "Planned scroll sequence: the house arrives in parts and assembles chapter by chapter. Motion arrives in a later build stage; the story reads in full without it.",
  sequenceLabel: "Planned stages",
} as const;

/* ------------------------------------------------ Peterborough properties */

export const propertiesPreview = {
  heading: "Homes in Peterborough",
  /** Phase 2 copy — one honest sentence of context, no market statistics. */
  context:
    "We let and manage residential property across the city. Available homes will be listed here with clear costs, features and approximate locations once the search is live.",
  mapDisclosure: "Show map preview",
  cta: "View all properties",
} as const;

/* ---------------------------------------------------------------- Tools */

export const tools = {
  landlord: {
    eyebrow: "For landlords",
    /** Master brief tool title. */
    heading: "What could your property rent for?",
    /** Approved route description from src/config/site.ts, verbatim. */
    body: routes.rentalAppraisal.description,
    /** Phase 2 copy. */
    note: "An indicative estimate is a starting point for a conversation, not a firm figure.",
    cta: landlordRouteCopy.cta,
    href: routes.rentalAppraisal.path,
  },
  tenant: {
    eyebrow: "For tenants",
    /** Master brief tool title. */
    heading: "Understand your move-in costs",
    /** Phase 2 copy — honest pending state. */
    body: "A move-in cost calculator is being prepared. Until it is ready, the tenants page explains how renting with us works and how to reach us.",
    status: "In preparation",
    cta: "How renting with us works",
    href: routes.tenants.path,
  },
} as const;

/* ---------------------------------------------------------- Maintenance */

/** Phase 2 copy — two route cards; both lead to /maintenance. */
export const maintenanceRoutes = [
  {
    id: "tenant",
    eyebrow: "For tenants",
    heading: "I rent a Red Brick property",
    body: "Report a repair and see what happens next.",
    cta: heroCopy.actions.repair,
    href: routes.maintenance.path,
  },
  {
    id: "landlord",
    eyebrow: "For landlords",
    heading: "I own a property",
    body: "See how maintenance is coordinated and how you are kept informed.",
    cta: "How maintenance is coordinated",
    href: routes.maintenance.path,
  },
] as const;

/* ------------------------------------------------------------- Insights */

export const insightsPreview = {
  heading: "Insights and guidance",
  pendingTitle: "Articles are being prepared",
  /** Phase 1 wording, unchanged. */
  body: "Guidance for landlords and tenants, plus Peterborough property insight, will be published here.",
  /** Master brief categories. */
  categories: ["Landlords", "Tenants", "Peterborough", "Maintenance", "Property guidance"],
  cta: "About our insights",
  href: routes.insights.path,
} as const;

/* --------------------------------------------------------------- Finale */

export const finaleActions = {
  landlord: { label: landlordRouteCopy.cta, href: routes.rentalAppraisal.path },
  tenant: { label: tenantRouteCopy.cta, href: routes.properties.path },
  /** Master brief general action; the contact route title is "Talk to Red Brick". */
  none: { label: routes.contact.title, href: routes.contact.path },
} as const;
