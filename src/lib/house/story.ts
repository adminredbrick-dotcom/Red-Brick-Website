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

/** Chapters per story (every story has the same number so the timeline, stills and copy line up). */
export const CHAPTER_COUNT = 6;

export interface Story {
  readonly key: StoryKey;
  /** Long label ("The landlord story"). */
  readonly label: string;
  /** Short label for the Switch story control. */
  readonly switchLabel: string;
  /** Section heading and lead for this variant. */
  readonly heading: string;
  readonly lead: string;
  readonly chapters: readonly StoryChapter[];
  readonly close: {
    readonly heading: string;
    readonly body: string;
    readonly action: { readonly label: string; readonly href: string };
  };
}

/**
 * The shared visual story (see src/lib/house/animation.ts): 1 the To Let board goes up and the
 * agent arrives · 2 applicants arrive and are met at the path; the door opens · 3 inside — the
 * roof lifts and the front opens like a dollhouse · 4 room by room, lights following · 5 upstairs
 * lights, the house closes with the people inside · 6 the agent leaves, the board comes down,
 * the roof is checked, dusk. Each audience reads its own words over the same pictures.
 */
export const houseStories: Record<StoryKey, Story> = {
  neutral: {
    key: "neutral",
    label: "The neutral story",
    switchLabel: "Neutral",
    heading: "One house, one viewing — six chapters",
    lead: "A property has a lot of moving parts. Follow one home from the board going up to the lights coming on — the same house, seen six times.",
    chapters: [
      { key: "market", name: "On the market", heading: "It starts with a property.", body: "A home is prepared, put in front of the people who are looking for it, and the board goes up." },
      { key: "meeting", name: "The meeting", heading: "Then the people.", body: "An enquiry becomes a conversation, and a conversation becomes a visit — met at the door, in person." },
      { key: "inside", name: "Through the door", heading: "See it properly.", body: "Walking through the front door, room by room, is still the best way to understand a home." },
      { key: "rooms", name: "Room by room", heading: "Every room, plainly.", body: "The living space, the kitchen, the boiler and the details that make it work — shown, not sold." },
      { key: "home", name: "Making it home", heading: "Keep everything connected.", body: "Clear administration and honest communication hold the rooms, the paperwork and the plans together." },
      { key: "care", name: "Looked after", heading: "Care that continues.", body: "Small things are noticed, arranged and put right so the property keeps working as it should." },
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
    heading: "One house, one let — six chapters for landlords",
    lead: "A property has a lot of moving parts. Follow your home from the board going up to a tenancy that is looked after — the same house, seen six times.",
    chapters: [
      { key: "market", name: "Coming to market", heading: "Your property, presented clearly.", body: "We prepare the listing and put the board up so the right people see the home with the facts they need." },
      { key: "applicants", name: "Meeting applicants", heading: "Enquiries become viewings.", body: "We answer the enquiries, arrange visits and meet applicants at the property in person." },
      { key: "viewing", name: "The viewing", heading: "Shown properly.", body: "The home is opened up and walked through room by room, so nobody is left guessing." },
      { key: "rooms", name: "Room by room", heading: "The practical details too.", body: "Kitchen, living space, boiler and heating — applicants see how the home works, not just how it looks." },
      { key: "tenancy", name: "The tenancy begins", heading: "A clear start.", body: "Agreement, deposit and move-in are arranged and explained, so the tenancy starts on a firm footing." },
      { key: "care", name: "Ongoing care", heading: "Looked after, month after month.", body: "Rent, inspections and maintenance coordination continue while the property is let." },
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
    heading: "One house, one move — six chapters for tenants",
    lead: "A home has a lot of moving parts. Follow one from the advert to the lights coming on — the same house, seen six times.",
    chapters: [
      { key: "spotting", name: "Spotting the home", heading: "You see it advertised.", body: "A home appears on the market with the important facts up front — rent, deposit, what is included." },
      { key: "contact", name: "Getting in touch", heading: "You get in touch; we arrange a viewing.", body: "We meet you at the property — no scripts, just an honest look round." },
      { key: "inside", name: "Through the door", heading: "Step inside.", body: "The front door opens and the home is shown as it is, room by room." },
      { key: "rooms", name: "Room by room", heading: "See how it works.", body: "Living space, kitchen, storage, heating — the practical things you would want to check." },
      { key: "yours", name: "Making it yours", heading: "From viewing to move-in.", body: "The application, the agreement and the costs, explained clearly before you commit." },
      { key: "settled", name: "Settled in", heading: "Help when you need it.", body: "Once you have moved in, maintenance and communication routes stay open." },
    ],
    close: {
      heading: "A good property should feel easy to live in.",
      body: "Browse the homes we have listed and ask about a viewing.",
      action: { label: "View properties", href: "/properties" },
    },
  },
};

/** Static fallback renders — one image per chapter state, per story (produced by scripts/house/render-chapters.mjs). */
export const houseRenderStates = ["start", "chapter-1", "chapter-2", "chapter-3", "chapter-4", "chapter-5", "chapter-6", "complete"] as const;
export type HouseRenderState = (typeof houseRenderStates)[number];

/** Number of equal timeline segments: one per chapter plus the close. */
const SEGMENTS = CHAPTER_COUNT + 1;

/** Timeline progress (0–1) at which each render state is captured (the end of each chapter). */
export const houseRenderProgress: Record<HouseRenderState, number> = Object.fromEntries(
  houseRenderStates.map((state, i) => [state, state === "complete" ? 1 : i / SEGMENTS]),
) as Record<HouseRenderState, number>;

export function houseRenderSrc(story: StoryKey, state: HouseRenderState): string {
  return `/media/house/${story}-${state}.jpg`;
}

/** Render state that best represents chapter index i (0-based); CHAPTER_COUNT → "complete". */
export function chapterRenderState(i: number): HouseRenderState {
  const idx = Math.min(CHAPTER_COUNT, Math.max(0, i));
  return idx >= CHAPTER_COUNT ? "complete" : houseRenderStates[idx + 1]!;
}

/** Map timeline progress to the active chapter index (0–CHAPTER_COUNT-1) or CHAPTER_COUNT for the close. */
export function chapterIndexFor(progress: number): number {
  if (progress >= CHAPTER_COUNT / SEGMENTS) return CHAPTER_COUNT;
  return Math.min(CHAPTER_COUNT - 1, Math.max(0, Math.floor(progress * SEGMENTS)));
}
