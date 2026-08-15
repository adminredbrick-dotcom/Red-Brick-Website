/**
 * Approved starter copy — verbatim from brief/BUSINESS-FACTS-AND-COPY.md
 * (plus the approved company introduction from the brand guidelines PDF).
 *
 * Do not add sentences here that have not been supplied or approved.
 * New page copy written for layout purposes must stay within the confirmed
 * facts in src/config/business.ts and the tone rules in the brief.
 */

export const heroCopy = {
  eyebrow: "Peterborough lettings, since 2012",
  heading: "Property cared for. People looked after.",
  supporting:
    "We provide residential lettings and property management across Peterborough, with clear guidance for landlords and tenants.",
  actions: {
    landlord: "Let or manage my property",
    tenant: "Find a home",
    repair: "Report a repair",
  },
} as const;

export const introductionCopy =
  "Property management is about more than paperwork. It is about keeping communication clear, looking after the home and helping everyone understand what happens next. That is the standard we are building every part of Red Brick around.";

export const landlordRouteCopy = {
  heading: "Confidence from preparation to ongoing care",
  body: "We help landlords bring the important parts of letting and management into one clear journey—from getting the property ready to coordinating the work that keeps it cared for.",
  cta: "Request a rental appraisal",
} as const;

export const tenantRouteCopy = {
  heading: "A clearer way to find and live in a home",
  body: "We want tenants to understand the property, the costs and the next steps before they commit—and to know how to reach us when something needs attention.",
  cta: "View available properties",
} as const;

export const maintenanceCopy = {
  heading: "Care should not disappear after move-in",
  body: "Our maintenance journey is designed around five clear steps: report, triage, arrange, update and resolve. The exact response depends on the issue and the arrangements for the property.",
  cta: "Get maintenance help",
  steps: ["Report", "Triage", "Arrange", "Update", "Resolve"],
} as const;

export const closingCopy = {
  heading: "Tell us what you need help with",
  body: "Whether you own a property, are looking for a home or already rent with us, we will help you find the right next step.",
  cta: "Message us on WhatsApp",
} as const;

/** Approved company introduction (brand guidelines PDF, section 02). */
export const companyIntroduction =
  "Established in 2012, Red Brick Lettings provides residential lettings and property management across Peterborough. We help landlords care for residential property and support tenants throughout their tenancy, combining practical local knowledge with clear, approachable service.";

/** The three verified trust points (master brief, homepage section 2). */
export const trustPoints = [
  {
    heading: "Established in 2012",
    body: "Residential lettings experience rooted in Peterborough for over a decade.",
  },
  {
    heading: "Focused on Peterborough",
    body: "We work across the city we know, rather than promising national coverage.",
  },
  {
    heading: "Support for landlords and tenants",
    body: "Both sides of a tenancy deserve clear communication and respect.",
  },
] as const;
