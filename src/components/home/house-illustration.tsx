import type { HouseStage } from "@/content/house-story";
import { cn } from "@/lib/utils";

/**
 * Original stylised British brick house — the static, story-ready stand-in
 * for the Phase 3 R3F model. Oblique three-quarter view with a dollhouse
 * cutaway on the right-hand side, drawn in the brand palette only.
 *
 * Every storyboard layer is an independently addressable group
 * (data-part="…") so the future GSAP/R3F sequence can move the same pieces:
 *
 *   halo        soft warm light behind the finished home (stage 5 only)
 *   ground      Peterborough locality ground plane
 *   markers     a few approximate location markers on the plane
 *   foundation  foundation / base slab
 *   interior    interior floor and wall planes with room suggestion pieces
 *   connection  the simple line that connects the rooms (Manage / Move)
 *   walls       exterior brick walls (front elevation)
 *   openings    front door and windows
 *   lights      warm window and interior lights
 *   roof        roof sections, ridge and chimney
 *   care        small maintenance / care detail (gutter, hopper, downpipe)
 *
 * The parts are declared once in <HouseIllustrationDefs/> and each
 * <HouseIllustration stage/> positions them with static per-stage transforms
 * — no animation, no scripting. Stages: 0 moving parts (exploded) ·
 * 1 structure · 2 exterior · 3 interior · 4 care · 5 complete home.
 */

const P = {
  brick: "#A63D2F",
  brickDeep: "#70291F",
  ink: "#1D1B1A",
  cream: "#F7F2EA",
  sand: "#E8D7C6",
  stone: "#716B64",
  stoneLight: "#DDD5CB",
  white: "#FFFFFF",
  /** Warm window light — a light, not a palette colour. */
  glow: "#F3D9A4",
} as const;

export const HOUSE_VIEWBOX = "0 0 520 420";

export const HOUSE_PARTS = [
  "halo",
  "ground",
  "markers",
  "foundation",
  "interior",
  "connection",
  "walls",
  "openings",
  "lights",
  "roof",
  "care",
] as const;
export type HousePart = (typeof HOUSE_PARTS)[number];

interface Placement {
  readonly x: number;
  readonly y: number;
  readonly opacity: number;
}

const at = (x: number, y: number, opacity = 1): Placement => ({ x, y, opacity });
const home = at(0, 0);
const hidden = at(0, 0, 0);

/** Static arrangement of every part per stage (exploded → assembled). */
export const HOUSE_STAGES: Readonly<Record<HouseStage, Readonly<Record<HousePart, Placement>>>> = {
  0: {
    halo: hidden,
    ground: at(0, 18),
    markers: at(0, 18),
    foundation: at(0, 10),
    interior: at(38, -26),
    connection: hidden,
    walls: at(-30, -2),
    openings: at(-74, 14, 0.95),
    lights: hidden,
    roof: at(0, -66),
    care: at(58, -50),
  },
  1: {
    halo: hidden,
    ground: home,
    markers: home,
    foundation: home,
    interior: at(28, -18),
    connection: hidden,
    walls: home,
    openings: at(-48, 10, 0.95),
    lights: hidden,
    roof: at(0, -42),
    care: at(46, -38),
  },
  2: {
    halo: hidden,
    ground: home,
    markers: hidden,
    foundation: home,
    interior: at(16, -10),
    connection: hidden,
    walls: home,
    openings: home,
    lights: at(0, 0, 0.55),
    roof: at(0, -14),
    care: at(30, -20),
  },
  3: {
    halo: hidden,
    ground: home,
    markers: hidden,
    foundation: home,
    interior: home,
    connection: home,
    walls: home,
    openings: home,
    lights: at(0, 0, 0.55),
    roof: home,
    care: at(18, -12),
  },
  4: {
    halo: hidden,
    ground: home,
    markers: hidden,
    foundation: home,
    interior: home,
    connection: home,
    walls: home,
    openings: home,
    lights: home,
    roof: home,
    care: home,
  },
  5: {
    halo: home,
    ground: home,
    markers: hidden,
    foundation: home,
    interior: home,
    connection: home,
    walls: home,
    openings: home,
    lights: home,
    roof: home,
    care: home,
  },
};

/** Painting order — back to front. */
const PAINT_ORDER: readonly HousePart[] = [
  "halo",
  "ground",
  "markers",
  "foundation",
  "interior",
  "connection",
  "walls",
  "openings",
  "lights",
  "roof",
  "care",
];

const partId = (part: HousePart) => `rb-house-${part}`;

/* Geometry notes (viewBox 520×420, depth vector 72,−42):
   front face 128–348 × 206–332, gable apex (238,132);
   side/cutaway plane (348,332)(420,290)(420,164)(348,206);
   interior drawn in local coords (u along depth, −v up) under a skew matrix. */
const FRONT_FACE = "M128 332H348V206L238 132L128 206Z";
const INTERIOR_TRANSFORM = "translate(348 332) matrix(1 -0.5833 0 1 0 0)";

/**
 * Declares the house parts once per page. Render it a single time (anywhere
 * in the document) before or after the <HouseIllustration/> instances.
 */
export function HouseIllustrationDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      className="absolute size-0 overflow-hidden"
    >
      <defs>
        <radialGradient id="rb-house-halo-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={P.glow} stopOpacity="0.5" />
          <stop offset="60%" stopColor={P.glow} stopOpacity="0.16" />
          <stop offset="100%" stopColor={P.glow} stopOpacity="0" />
        </radialGradient>
        <pattern id="rb-house-brick-courses" width="24" height="24" patternUnits="userSpaceOnUse">
          <path
            d="M0 11.5H24M0 23.5H24M12 0V12M0 12V24M24 12V24"
            stroke={P.cream}
            strokeWidth="1"
            opacity="0.26"
          />
        </pattern>

        {/* halo — warm light behind the finished home */}
        <g id={partId("halo")}>
          <ellipse cx="272" cy="236" rx="236" ry="176" fill="url(#rb-house-halo-gradient)" />
        </g>

        {/* ground — locality plane */}
        <g id={partId("ground")}>
          <ellipse cx="280" cy="338" rx="232" ry="54" fill={P.sand} />
          <ellipse
            cx="280"
            cy="338"
            rx="164"
            ry="37"
            fill="none"
            stroke={P.stoneLight}
            strokeWidth="1.5"
          />
          <ellipse
            cx="280"
            cy="338"
            rx="92"
            ry="21"
            fill="none"
            stroke={P.stoneLight}
            strokeWidth="1.5"
          />
        </g>

        {/* markers — a few approximate positions, never addresses */}
        <g id={partId("markers")}>
          <circle cx="86" cy="326" r="6" fill={P.brick} />
          <circle cx="86" cy="326" r="2.2" fill={P.white} />
          <circle cx="458" cy="300" r="6" fill={P.brick} />
          <circle cx="458" cy="300" r="2.2" fill={P.white} />
          <circle cx="196" cy="380" r="6" fill={P.brick} />
          <circle cx="196" cy="380" r="2.2" fill={P.white} />
        </g>

        {/* foundation — base slab */}
        <g id={partId("foundation")}>
          <path d="M124 332H352V342H124Z" fill={P.stone} />
          <path d="M352 342L424 300V290L352 332Z" fill={P.stone} />
          <path d="M352 342L424 300V290L352 332Z" fill={P.ink} opacity="0.22" />
        </g>

        {/* interior — cutaway floor/wall planes and room suggestion pieces */}
        <g id={partId("interior")} transform={INTERIOR_TRANSFORM}>
          <rect
            x="0"
            y="-126"
            width="72"
            height="126"
            fill={P.cream}
            stroke={P.ink}
            strokeWidth="1.2"
          />
          <rect x="0" y="-126" width="72" height="126" fill={P.sand} opacity="0.35" />
          {/* floor planes */}
          <rect x="0" y="-4" width="72" height="4" fill={P.stoneLight} />
          <rect x="0" y="-68" width="72" height="5" fill={P.stoneLight} />
          {/* ground floor: seating and a kitchen counter */}
          <rect x="9" y="-18" width="26" height="14" rx="2" fill={P.stone} />
          <rect x="45" y="-26" width="21" height="22" fill={P.sand} />
          <rect x="45" y="-26" width="21" height="3" fill={P.brick} opacity="0.7" />
          {/* first floor: bed and wardrobe */}
          <rect
            x="7"
            y="-86"
            width="34"
            height="16"
            fill={P.white}
            stroke={P.stoneLight}
            strokeWidth="1"
          />
          <rect x="7" y="-86" width="22" height="16" fill={P.brick} opacity="0.85" />
          <rect x="31" y="-84" width="8" height="12" fill={P.sand} />
          <rect x="52" y="-112" width="14" height="42" fill={P.stoneLight} />
        </g>

        {/* connection — a simple line linking the rooms */}
        <g id={partId("connection")} transform={INTERIOR_TRANSFORM}>
          <polyline
            points="22,-11 22,-79 58,-79 58,-92"
            fill="none"
            stroke={P.brick}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <circle cx="22" cy="-11" r="3.2" fill={P.brick} />
          <circle cx="22" cy="-79" r="3.2" fill={P.brick} />
          <circle cx="58" cy="-92" r="3.2" fill={P.brick} />
        </g>

        {/* walls — exterior brick front elevation */}
        <g id={partId("walls")}>
          <path d={FRONT_FACE} fill={P.brick} />
          <path d={FRONT_FACE} fill="url(#rb-house-brick-courses)" />
          <path
            d="M128 332V206L238 132L348 206V332"
            fill="none"
            stroke={P.brickDeep}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>

        {/* openings — front door and windows */}
        <g id={partId("openings")}>
          {/* door */}
          <rect x="219" y="279" width="38" height="53" fill={P.cream} />
          <rect x="222" y="282" width="32" height="50" fill={P.ink} />
          <rect x="224" y="284" width="28" height="7" fill={P.stoneLight} />
          {/* ground floor windows */}
          <rect x="147" y="255" width="50" height="50" fill={P.cream} />
          <rect x="150" y="258" width="44" height="44" fill={P.stoneLight} />
          <rect x="171" y="258" width="2" height="44" fill={P.cream} />
          <rect x="279" y="255" width="50" height="50" fill={P.cream} />
          <rect x="282" y="258" width="44" height="44" fill={P.stoneLight} />
          <rect x="303" y="258" width="2" height="44" fill={P.cream} />
          {/* first floor windows */}
          <rect x="147" y="211" width="50" height="42" fill={P.cream} />
          <rect x="150" y="214" width="44" height="36" fill={P.stoneLight} />
          <rect x="171" y="214" width="2" height="36" fill={P.cream} />
          <rect x="279" y="211" width="50" height="42" fill={P.cream} />
          <rect x="282" y="214" width="44" height="36" fill={P.stoneLight} />
          <rect x="303" y="214" width="2" height="36" fill={P.cream} />
          {/* small gable window */}
          <rect x="223" y="173" width="30" height="28" fill={P.cream} />
          <rect x="226" y="176" width="24" height="22" fill={P.stoneLight} />
        </g>

        {/* lights — warm window and interior light */}
        <g id={partId("lights")}>
          <rect x="150" y="258" width="44" height="44" fill={P.glow} />
          <rect x="282" y="258" width="44" height="44" fill={P.glow} />
          <rect x="150" y="214" width="44" height="36" fill={P.glow} />
          <rect x="282" y="214" width="44" height="36" fill={P.glow} />
          <rect x="226" y="176" width="24" height="22" fill={P.glow} />
          <rect x="224" y="284" width="28" height="7" fill={P.glow} />
          <rect x="171" y="258" width="2" height="44" fill={P.cream} />
          <rect x="303" y="258" width="2" height="44" fill={P.cream} />
          <rect x="171" y="214" width="2" height="36" fill={P.cream} />
          <rect x="303" y="214" width="2" height="36" fill={P.cream} />
        </g>

        {/* roof — two slopes, ridge, fascia and chimney */}
        <g id={partId("roof")}>
          <path d="M116 214L238 124L310 82L188 172Z" fill={P.brickDeep} />
          <path d="M238 124L360 214L432 172L310 82Z" fill={P.brickDeep} />
          <path d="M238 124L360 214L432 172L310 82Z" fill={P.ink} opacity="0.2" />
          <path d="M238 124L310 82" stroke={P.ink} strokeWidth="2.5" strokeLinecap="round" />
          <path
            d="M116 214L238 124L360 214"
            fill="none"
            stroke={P.cream}
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <rect x="308" y="98" width="20" height="30" fill={P.brick} />
          <path d="M328 98L336 93V123L328 128Z" fill={P.brickDeep} />
          <path d="M305 98H331L339 93H313Z" fill={P.ink} />
          <rect x="305" y="94" width="26" height="5" fill={P.ink} />
        </g>

        {/* care — gutter, hopper and downpipe (small maintenance detail) */}
        <g id={partId("care")}>
          <path d="M358 216L432 173" stroke={P.ink} strokeWidth="3.5" strokeLinecap="round" />
          <rect x="348" y="212" width="10" height="9" rx="1.5" fill={P.ink} />
          <rect x="351" y="220" width="4" height="114" fill={P.ink} />
        </g>
      </defs>
    </svg>
  );
}

interface HouseIllustrationProps {
  stage: HouseStage;
  className?: string;
  /**
   * When provided the graphic is exposed as an image with this label;
   * otherwise it is decorative (aria-hidden) and the surrounding copy carries
   * the meaning.
   */
  label?: string;
}

/**
 * One static rendering of the house at a given stage. Requires
 * <HouseIllustrationDefs/> to be present once in the same document.
 */
export function HouseIllustration({ stage, className, label }: HouseIllustrationProps) {
  const layout = HOUSE_STAGES[stage];

  return (
    <svg
      viewBox={HOUSE_VIEWBOX}
      focusable="false"
      className={cn("block h-auto w-full max-w-full", className)}
      data-house-stage={stage}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {PAINT_ORDER.map((part) => {
        const place = layout[part];
        if (place.opacity === 0) return null;
        const moved = place.x !== 0 || place.y !== 0;
        return (
          <use
            key={part}
            href={`#${partId(part)}`}
            data-part={part}
            transform={moved ? `translate(${place.x} ${place.y})` : undefined}
            opacity={place.opacity === 1 ? undefined : place.opacity}
          />
        );
      })}
    </svg>
  );
}
