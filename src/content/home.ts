import { business } from "@/config/business";
import {
  closingCopy,
  companyIntroduction,
  heroCopy,
  maintenanceCopy,
} from "@/content/approved-copy";

/**
 * Production homepage copy. Approved sentences come from approved-copy.ts and
 * business.ts verbatim. Everything marked PROTOTYPE is storyboard-v3 wording
 * awaiting the owner's copy approval (owner-decision row 45) and must not be
 * turned into a service claim.
 */

export const homeHero = {
  eyebrow: heroCopy.eyebrow, // approved
  heading: heroCopy.heading, // approved tagline
  supporting: heroCopy.supporting, // approved
  prompt: "Where would you like to start?", // PROTOTYPE
  secondary: [
    { label: "Landlords page", href: "/landlords" },
    { label: "Tenants page", href: "/tenants" },
    { label: "Request a rental appraisal", href: "/rental-appraisal" },
    { label: "Already rent with us? Report a repair.", href: "/maintenance" },
  ],
} as const;

export const homeIntro = {
  eyebrow: "Peterborough, since 2012", // fact-based
  heading: "Local, established and easy to talk to", // PROTOTYPE
  body: companyIntroduction, // approved
  facts: [`Established in ${business.establishedYear}`, `Across ${business.serviceArea}`, business.meetings],
} as const;

export const homeMaintenance = {
  eyebrow: "When something needs attention", // PROTOTYPE
  heading: maintenanceCopy.heading, // approved
  body: maintenanceCopy.body, // approved
  steps: maintenanceCopy.steps, // approved
  action: { label: "Already rent with us? Report a repair.", href: "/maintenance" },
} as const;

export const homeInsights = {
  eyebrow: "Insights", // PROTOTYPE
  heading: "Guidance for landlords, tenants and Peterborough", // PROTOTYPE
  body: "Practical articles are being prepared — plain guidance rather than sales copy. The first pieces will appear here as they are reviewed.", // PROTOTYPE, honest empty state
  categories: [
    { label: "Landlords", note: "Letting, managing and caring for a property." },
    { label: "Tenants", note: "Finding, understanding and living in a home." },
    { label: "Peterborough", note: "Local knowledge, plainly told." },
  ],
  action: { label: "Visit insights", href: "/insights" },
} as const;

export const homeClosing = {
  eyebrow: "Talk to us", // PROTOTYPE
  heading: closingCopy.heading, // approved
  body: closingCopy.body, // approved
  cta: closingCopy.cta, // approved
} as const;
