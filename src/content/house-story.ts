/**
 * House story chapters — verbatim from design/HOMEPAGE-AND-3D-STORYBOARD.md.
 *
 * Landlord and tenant chapter headings, bodies and CTAs are the storyboard's
 * exact copy. The shared/no-selection set has only headings in the storyboard
 * (Property, People, Communication, Care); its short bodies are neutral
 * sentences within the confirmed facts and are listed in the Phase 2 report.
 *
 * `stage` maps each chapter to a static house-illustration state:
 *   0 moving parts (exploded) · 1 structure · 2 exterior · 3 interior ·
 *   4 care · 5 complete home. The future GSAP/R3F sequence follows the same
 *   chapter thresholds.
 */

import { routes } from "@/config/site";
import { landlordRouteCopy, tenantRouteCopy } from "@/content/approved-copy";

export type HouseStage = 0 | 1 | 2 | 3 | 4 | 5;

export interface StoryChapter {
  /** Short beat name, e.g. "Prepare". */
  readonly name: string;
  readonly heading: string;
  readonly body: string;
  readonly stage: HouseStage;
}

export interface StoryAction {
  readonly label: string;
  readonly href: string;
}

export interface StorySet {
  readonly id: "landlord" | "tenant" | "none";
  /** Visible label for the set, e.g. "Landlord story". */
  readonly label: string;
  readonly chapters: readonly StoryChapter[];
  /** Closing beat shown after the chapters. */
  readonly closing: {
    /** Short beat name, e.g. "Confidence". */
    readonly name: string;
    /** True when the closing beat is itself a numbered chapter (storyboard chapter 5). */
    readonly numbered: boolean;
    readonly heading: string;
    readonly body: string | null;
    readonly stage: HouseStage;
    readonly actions: readonly StoryAction[];
  };
}

/** Entry beat shared by every route (storyboard, "Entry state — the moving parts"). */
export const storyEntry = {
  heading: "A property has a lot of moving parts.",
  body: "We bring the important ones into one clearer journey.",
  stage: 0,
} as const;

export const landlordStory: StorySet = {
  id: "landlord",
  label: "Landlord story",
  chapters: [
    {
      name: "Prepare",
      heading: "Start with a clear picture.",
      body: "Understand the property, its condition and the next steps before it reaches the market.",
      stage: 1,
    },
    {
      name: "Let",
      heading: "Present the home clearly.",
      body: "Give prospective tenants the information they need to make an informed enquiry.",
      stage: 2,
    },
    {
      name: "Manage",
      heading: "Keep the tenancy connected.",
      body: "Good management depends on clear administration, communication and follow-through.",
      stage: 3,
    },
    {
      name: "Care",
      heading: "Look after what happens next.",
      body: "Maintenance coordination and ongoing attention help keep a property working as it should.",
      stage: 4,
    },
  ],
  closing: {
    name: "Confidence",
    numbered: true,
    heading: "Your property is in good hands.",
    body: null,
    stage: 5,
    actions: [{ label: landlordRouteCopy.cta, href: routes.rentalAppraisal.path }],
  },
};

export const tenantStory: StorySet = {
  id: "tenant",
  label: "Tenant story",
  chapters: [
    {
      name: "Find",
      heading: "Find the right next step.",
      body: "Search clearly and understand what is actually available.",
      stage: 1,
    },
    {
      name: "Understand",
      heading: "Know the home before you commit.",
      body: "See the important features, costs and practical information in one place.",
      stage: 2,
    },
    {
      name: "Move",
      heading: "Make the move clearer.",
      body: "Understand the steps and what will be needed along the way.",
      stage: 3,
    },
    {
      name: "Live",
      heading: "Know how to reach us.",
      body: "Clear maintenance and communication routes should continue after move-in.",
      stage: 4,
    },
  ],
  closing: {
    name: "At ease",
    numbered: true,
    heading: "A good property should feel easy to live in.",
    body: null,
    stage: 5,
    actions: [{ label: tenantRouteCopy.cta, href: routes.properties.path }],
  },
};

/** Shared / no-selection story: four neutral chapters, ending with both actions. */
export const sharedStory: StorySet = {
  id: "none",
  label: "Shared story",
  chapters: [
    {
      name: "Property",
      heading: "It starts with the building.",
      body: "Every tenancy rests on the property itself — its condition, its features and what it needs to stay in good order.",
      stage: 1,
    },
    {
      name: "People",
      heading: "Landlords and tenants, on both sides.",
      body: "Both sides of a tenancy deserve clear communication and respect. We work for a good outcome for each.",
      stage: 2,
    },
    {
      name: "Communication",
      heading: "Clear communication holds it together.",
      body: "Questions, updates and decisions are easier when everyone understands what happens next.",
      stage: 3,
    },
    {
      name: "Care",
      heading: "Care continues after move-in.",
      body: "Maintenance coordination and ongoing attention help keep a property working as it should.",
      stage: 4,
    },
  ],
  closing: {
    name: "Next step",
    numbered: false,
    heading: "Choose the journey that fits you.",
    body: "Landlord or tenant, both routes stay open — pick the one you need today.",
    stage: 5,
    actions: [
      { label: landlordRouteCopy.cta, href: routes.rentalAppraisal.path },
      { label: tenantRouteCopy.cta, href: routes.properties.path },
    ],
  },
};

export const storySets: readonly StorySet[] = [sharedStory, landlordStory, tenantStory];

/** Neutral names for the planned scroll stages (thumbnail strip). */
export const stageNames: Readonly<Record<HouseStage, string>> = {
  0: "Moving parts",
  1: "Structure",
  2: "Exterior",
  3: "Interior",
  4: "Care",
  5: "Home",
};
