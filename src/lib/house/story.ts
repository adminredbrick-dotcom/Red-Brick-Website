/**
 * The 3D-house chapter's stories: copy (PROTOTYPE COPY — storyboard v3
 * labels, pending owner approval) and the animation beats each story plays.
 * Shared by the HTML copy column, the R3F scene, the static-render harness
 * and the tests, so the words and the motion can never drift apart.
 *
 * Chapter names are navigation and storytelling concepts. They must not
 * introduce guarantees, service claims, response times or operational detail.
 */

export type StoryKey = "neutral" | "landlord" | "tenant";
export const storyKeys: readonly StoryKey[] = ["neutral", "landlord", "tenant"];

export interface StoryChapter {
  /** Stable key used in ids and tests. */
  readonly key: string;
  /** Chapter name shown in the progress label. */
  readonly name: string;
  readonly heading: string;
  readonly body: string;
}

export interface Story {
  readonly key: StoryKey;
  /** Long label ("The landlord story"). */
  readonly label: string;
  /** Short label for the Switch story control. */
  readonly switchLabel: string;
  /** Section heading and lead for this variant. */
  readonly heading: string;
  readonly lead: string;
  readonly chapters: readonly [StoryChapter, StoryChapter, StoryChapter, StoryChapter];
  readonly close: {
    readonly heading: string;
    readonly body: string;
    readonly action: { readonly label: string; readonly href: string };
  };
}

export const houseStories: Record<StoryKey, Story> = {
  neutral: {
    key: "neutral",
    label: "The neutral story",
    switchLabel: "Neutral",
    heading: "One house, four chapters",
    lead: "A property has a lot of moving parts. We bring the important ones into one clearer journey — the same home, seen four times.",
    chapters: [
      { key: "property", name: "Property", heading: "Start with the property.", body: "The structure, the roof, the doors and windows — the things that have to be right before anything else can be." },
      { key: "people", name: "People", heading: "Then the people in it.", body: "A home is only working when the people on both sides of the tenancy know where they stand." },
      { key: "communication", name: "Communication", heading: "Keep everything connected.", body: "Clear administration and honest communication hold the rooms, the paperwork and the plans together." },
      { key: "care", name: "Care", heading: "Look after what happens next.", body: "Small things are noticed, arranged and put right so the property keeps working as it should." },
    ],
    close: {
      heading: "Property cared for. People looked after.",
      body: "Choose the story that fits you and we will show you the parts that matter most.",
      action: { label: "View properties", href: "/properties" },
    },
  },
  landlord: {
    key: "landlord",
    label: "The landlord story",
    switchLabel: "Landlord",
    heading: "One house, four chapters — for landlords",
    lead: "A property has a lot of moving parts. We bring the important ones into one clearer journey — from preparation to ongoing care.",
    chapters: [
      { key: "preparing", name: "Preparing the property", heading: "Start with a clear picture.", body: "Understand the property, its condition and the next steps before it reaches the market." },
      { key: "finding", name: "Finding a tenant", heading: "Present the home clearly.", body: "Give prospective tenants the information they need to make an informed enquiry." },
      { key: "managing", name: "Managing the tenancy", heading: "Keep the tenancy connected.", body: "Good management depends on clear administration, communication and follow-through." },
      { key: "care", name: "Continuing property care", heading: "Look after what happens next.", body: "Maintenance coordination and ongoing attention help keep a property working as it should." },
    ],
    close: {
      heading: "Your property is in good hands.",
      body: "Ask us for an indicative rental estimate — a starting point, never a valuation.",
      action: { label: "Request a rental appraisal", href: "/rental-appraisal" },
    },
  },
  tenant: {
    key: "tenant",
    label: "The tenant story",
    switchLabel: "Tenant",
    heading: "One house, four chapters — for tenants",
    lead: "A home has a lot of moving parts. We bring the important ones into one clearer journey — from finding it to living in it.",
    chapters: [
      { key: "finding", name: "Finding a suitable home", heading: "Find the right next step.", body: "Search clearly and understand what is actually available." },
      { key: "understanding", name: "Understanding the move", heading: "Know the home before you commit.", body: "See the important features, costs and practical information in one place." },
      { key: "living", name: "Living in the property", heading: "Make the move clearer.", body: "Understand the steps and what will be needed along the way." },
      { key: "help", name: "Getting maintenance help", heading: "Know how to reach us.", body: "Clear maintenance and communication routes should continue after move-in." },
    ],
    close: {
      heading: "A good property should feel easy to live in.",
      body: "Browse the homes we have listed and ask about a viewing.",
      action: { label: "View properties", href: "/properties" },
    },
  },
};

/** Static fallback renders — one image per chapter state, per story (produced by scripts/house/render-chapters.mjs). */
export const houseRenderStates = ["exploded", "chapter-1", "chapter-2", "chapter-3", "chapter-4", "complete"] as const;
export type HouseRenderState = (typeof houseRenderStates)[number];

/** Timeline progress (0–1) at which each render state is captured. */
export const houseRenderProgress: Record<HouseRenderState, number> = {
  exploded: 0,
  "chapter-1": 0.2,
  "chapter-2": 0.4,
  "chapter-3": 0.6,
  "chapter-4": 0.8,
  complete: 1,
};

export function houseRenderSrc(story: StoryKey, state: HouseRenderState): string {
  return `/media/house/${story}-${state}.jpg`;
}

/** Map timeline progress to the active chapter index (0–3) or 4 for the close. */
export function chapterIndexFor(progress: number): number {
  if (progress >= 0.8) return 4;
  return Math.min(3, Math.max(0, Math.floor(progress / 0.2)));
}
