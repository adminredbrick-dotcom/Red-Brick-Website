/**
 * Homepage media manifest — approved Pexels stock footage (register rows A1–A16
 * in docs/MEDIA-ASSET-REGISTER.md). Public Pexels IDs only; source filenames
 * never appear here. Every clip is "Illustrative stock footage" and is never
 * described as Peterborough, a Red Brick-managed home or an available property.
 *
 * `sources` is null until web derivatives exist (no encoder on the build
 * machine); the components then render the poster only. When derivatives are
 * encoded, add them here — nothing else changes.
 */

export interface VideoSources {
  /** WebM (AV1/VP9) first, then MP4 (H.264). Paths under /media/video/. */
  readonly webm?: string;
  readonly mp4: string;
}

export interface HeroMedia {
  readonly pexelsId: string;
  readonly poster: string;
  readonly posterMobile: string;
  readonly sources: VideoSources | null;
  /** Approximate trim in seconds (one uninterrupted slow move). */
  readonly trim: { readonly start: number; readonly end: number };
  readonly alt: string;
}

export interface StoryBeatMedia {
  readonly id: string;
  readonly pexelsId: string;
  readonly poster: string;
  readonly sources: VideoSources | null;
  readonly heading: string;
  readonly caption: string;
  readonly alt: string;
}

export const STOCK_LABEL = "Illustrative stock footage";

export const heroMedia: HeroMedia = {
  pexelsId: "12217554",
  poster: "/media/posters/hero-12217554.webp",
  posterMobile: "/media/posters/hero-12217554-mobile.webp",
  sources: null,
  trim: { start: 0, end: 10 },
  alt: "Aerial view of rows of red-brick terraced houses and tree-lined streets — illustrative stock footage.",
};

/** Scroll-led media story beats (storyboard v3 §3, in order). Headings are prototype copy. */
export const storyBeats: readonly StoryBeatMedia[] = [
  {
    id: "doorway",
    pexelsId: "14807040",
    poster: "/media/posters/story-14807040.webp",
    sources: null,
    heading: "Every letting starts at the front door.",
    caption: "Crossing the threshold — the moment a property becomes somebody's home.",
    alt: "A hallway leading through an open doorway into a bright room — illustrative stock footage.",
  },
  {
    id: "lounge",
    pexelsId: "14807010",
    poster: "/media/posters/story-14807010.webp",
    sources: null,
    heading: "A good home should feel easy to live in.",
    caption: "Cared-for rooms are the point of everything we do.",
    alt: "A living room with a dark sofa and a bay window — illustrative stock footage.",
  },
  {
    id: "kitchen",
    pexelsId: "14806944",
    poster: "/media/posters/story-14806944.webp",
    sources: null,
    heading: "Preparation shows in the details.",
    caption: "Getting a property ready means looking closely before anyone moves in.",
    alt: "A cream kitchen with a range cooker and open shelving — illustrative stock footage.",
  },
  {
    id: "bathroom",
    pexelsId: "14807056",
    poster: "/media/posters/story-14807056.webp",
    sources: null,
    heading: "Ready for the next tenancy.",
    caption: "The practical checks that make a home ready to let.",
    alt: "A bathroom with a roll-top bath beside a window — illustrative stock footage.",
  },
  {
    id: "bedroom",
    pexelsId: "14806975",
    poster: "/media/posters/story-14806975.webp",
    sources: null,
    heading: "Now let's follow one house through the journey.",
    caption: "From here the story turns to a single home — and to yours.",
    alt: "A bedroom in warm light with a patterned throw — illustrative stock footage.",
  },
];
