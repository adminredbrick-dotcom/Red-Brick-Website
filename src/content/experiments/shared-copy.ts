/**
 * Locked copy for the landing-page experiment.
 *
 * Every candidate imports facts, actions and story beats from here and never
 * retypes them. Facts come from the single business configuration; routes from
 * the route registry; the WhatsApp link from the existing helper. Builders must
 * not edit this file (docs/landing-experiments/WORKTREE-RULES.md).
 */

import { business } from "@/config/business";
import { routes } from "@/config/site";
import { whatsappHref } from "@/lib/whatsapp";

/** Confirmed facts only. */
export const experimentFacts = {
  name: business.name,
  establishedYear: business.establishedYear,
  serviceArea: business.serviceArea,
  tagline: business.tagline,
  /** Approved one-line description of what we do. */
  whatWeDo: `Residential lettings and property management across ${business.serviceArea}`,
  /** Approved eyebrow. */
  eyebrow: `${business.serviceArea} lettings, since ${business.establishedYear}`,
  /** Approved supporting line (brief/BUSINESS-FACTS-AND-COPY.md). */
  supporting: business.description,
  meetings: business.meetings,
} as const;

export interface ExperimentAction {
  readonly label: string;
  readonly href: string;
}

/** Locked actions: label → route. Labels use the typographic apostrophe. */
export const experimentActions = {
  landlord: { label: "I’m a landlord", href: routes.landlords.path },
  tenant: { label: "I’m looking for a home", href: routes.properties.path },
  viewProperties: { label: "View properties", href: routes.properties.path },
  appraisal: { label: "Request a rental appraisal", href: routes.rentalAppraisal.path },
  repair: { label: "Already rent with us? Report a repair.", href: routes.maintenance.path },
  /** Final action — built from the existing configuration; the number is never retyped. */
  whatsapp: {
    label: "Message us on WhatsApp",
    href: whatsappHref(),
    displayNumber: business.whatsapp.displayNumber,
  },
} as const satisfies Record<string, ExperimentAction & Record<string, unknown>>;

/** Approved service journey (brand guidelines, section 02). */
export const serviceJourney = [
  {
    name: "Let",
    heading: "Let your property",
    body: "Preparation, marketing, tenant-find work, inventory and tenancy setup.",
  },
  {
    name: "Manage",
    heading: "Manage your tenancy",
    body: "Rent administration, communication, inspections and compliance support.",
  },
  {
    name: "Care",
    heading: "Care for your property",
    body: "Maintenance coordination and the ongoing attention that keeps a property working as it should.",
  },
] as const;

/** Approved maintenance process (no time promises). */
export const maintenanceSteps = ["Report", "Triage", "Arrange", "Update", "Resolve"] as const;

/** The ten required story beats, in order (docs/landing-experiments/BRIEF.md). */
export const storyBeats = [
  "Clear hero with landlord, tenant and property choices",
  "Short Red Brick introduction",
  "Visual scrolling-story placeholder",
  "Landlord and tenant paths",
  "Let, Manage and Care",
  "A house / property-care journey",
  "Peterborough / local knowledge",
  "Maintenance and property care",
  "Verified trust based only on approved facts",
  "Final WhatsApp action",
] as const;

/**
 * Forbidden-claim patterns checked by the shared contract against the visible
 * page text. Keep in step with the "Explicitly prohibited" list in BRIEF.md.
 */
export const forbiddenClaimPatterns: readonly { readonly reason: string; readonly pattern: RegExp }[] = [
  { reason: "testimonials or reviews", pattern: /\b(testimonials?|reviews?|rated|rating|stars?)\b/i },
  { reason: "portfolio totals", pattern: /\b\d[\d,]*\+?\s+(properties|homes|landlords|tenants|tenancies)\b/i },
  { reason: "portfolio wording", pattern: /\bportfolio\b/i },
  { reason: "response-time promise", pattern: /\b(within\s+\d+\s*(minutes?|mins?|hours?|hrs?|days?)|same[-\s]day|response times?)\b/i },
  { reason: "24/7 or emergency cover", pattern: /\b(24\s*\/\s*7|24-7|round[-\s]the[-\s]clock|emergency (cover|attendance|call[-\s]?out|line)|out[-\s]of[-\s]hours)\b/i },
  { reason: "superlative or guarantee", pattern: /\b(best|leading|cheapest|most affordable|excellent|guaranteed?|no[-\s]risk|risk[-\s]free|instant)\b/i },
  { reason: "prices, rents or figures", pattern: /£\s?\d/ },
  { reason: "market statistics or forecasts", pattern: /\b(\d+(\.\d+)?\s?%|forecast|yield|growth|crime rate|crime figures?)\b/i },
  { reason: "unverified schemes or memberships", pattern: /\b(ARLA|Propertymark|NRLA|Ombudsman|redress|Client Money Protection|CMP|deposit protection scheme|DPS|TDS|mydeposits|accredited|award(s|-winning)?)\b/i },
  { reason: "obsolete brand", pattern: /\blets\s+move\b/i },
];

/**
 * Elements that must not appear in round one (no maps, WebGL, video, canvas
 * effects or embedded third-party frames).
 */
export const forbiddenElementSelectors = ["canvas", "video", "iframe", "embed", "object"] as const;
