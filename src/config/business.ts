/**
 * Single source of truth for confirmed Red Brick Lettings business facts.
 *
 * Only values in this file may be rendered as factual public content.
 * Anything not yet confirmed by the owner is typed `null` and tracked in
 * docs/OWNER-DECISIONS.md — it must never be replaced with an invented
 * value elsewhere in the codebase.
 *
 * Sources: brief/BUSINESS-FACTS-AND-COPY.md, CLAUDE.md, brand guidelines PDF.
 */

export interface BusinessConfig {
  /** Exact public name — never abbreviated, never the obsolete "Lets Move". */
  readonly name: string;
  readonly establishedYear: number;
  readonly serviceArea: string;
  readonly tagline: string;
  /** Approved one-line company description. */
  readonly description: string;
  readonly whatsapp: {
    /** UK display format shown to visitors. */
    readonly displayNumber: string;
    /** International format used to build wa.me links. */
    readonly e164: string;
  };
  /** Public meeting wording — arrangements are not yet confirmed (owner-decision register). */
  readonly meetings: string;
  readonly social: {
    readonly facebook: string;
    readonly instagram: string;
  };
  /** Unconfirmed facts — null until the owner supplies them (docs/OWNER-DECISIONS.md). */
  readonly email: string | null;
  readonly telephone: string | null;
  readonly domain: string | null;
  readonly openingHours: string | null;
  readonly address: string | null;
  readonly regulatory: {
    readonly companyName: string | null;
    readonly companyNumber: string | null;
    readonly registeredAddress: string | null;
    readonly redressScheme: string | null;
    readonly clientMoneyProtection: string | null;
    readonly depositScheme: string | null;
  };
}

export const business: BusinessConfig = {
  name: "Red Brick Lettings",
  establishedYear: 2012,
  serviceArea: "Peterborough",
  tagline: "Property cared for. People looked after.",
  description:
    "We provide residential lettings and property management across Peterborough, with clear guidance for landlords and tenants.",
  whatsapp: {
    displayNumber: "07300 856675",
    e164: "+447300856675",
  },
  meetings: "Ask us about arranging a meeting.",
  social: {
    facebook: "https://www.facebook.com/RedBrickPeterborough/",
    instagram: "https://www.instagram.com/red_brick_lettings/",
  },
  email: null,
  telephone: null,
  domain: null,
  openingHours: null,
  address: null,
  regulatory: {
    companyName: null,
    companyNumber: null,
    registeredAddress: null,
    redressScheme: null,
    clientMoneyProtection: null,
    depositScheme: null,
  },
};
