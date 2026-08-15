import styles from "./landing.module.css";

/**
 * Original stylised British red-brick house, drawn as inline SVG in the
 * brick / deep brick / cream / sand / ink / stone palette only.
 *
 * The drawing is built from independent layer groups so the same asset can be
 * shown settled (hero), gently exploded (the static story placeholder) or
 * annotated with chapter markers (the property-care journey). Colours are read
 * from the canonical CSS tokens so the illustration follows the brand tokens.
 */

export type HouseVariant = "settled" | "exploded" | "annotated";

interface HouseIllustrationProps {
  variant?: HouseVariant;
  /** Unique prefix so <pattern> ids stay unique when the house appears more than once. */
  idPrefix: string;
  /** Accessible name; when omitted the drawing is decorative. */
  label?: string;
  className?: string;
}

const T = {
  brick: "var(--rb-brick)",
  deep: "var(--rb-brick-dark)",
  ink: "var(--rb-ink)",
  cream: "var(--rb-cream)",
  sand: "var(--rb-sand)",
  stone: "var(--rb-stone)",
  stoneLight: "var(--rb-stone-light)",
  white: "var(--rb-white)",
} as const;

function Window({ x, y, w = 60, h = 62 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x - 4} y={y + h} width={w + 8} height={7} rx={2} fill={T.sand} />
      <rect x={x} y={y} width={w} height={h} rx={3} fill={T.cream} />
      <rect x={x + 6} y={y + 6} width={w - 12} height={h - 12} rx={2} fill={T.sand} />
      <rect x={x + w / 2 - 2} y={y + 6} width={4} height={h - 12} fill={T.cream} />
      <rect x={x + 6} y={y + h / 2 - 2} width={w - 12} height={4} fill={T.cream} />
    </g>
  );
}

export function HouseIllustration({
  variant = "settled",
  idPrefix,
  label,
  className,
}: HouseIllustrationProps) {
  const patternId = `${idPrefix}-courses`;
  const glowId = `${idPrefix}-glow`;
  const isExploded = variant === "exploded";
  const isAnnotated = variant === "annotated";
  const decorative = !label;

  return (
    <svg
      viewBox="0 0 520 440"
      width={520}
      height={440}
      className={[styles.house, className ?? ""].join(" ")}
      data-variant={variant}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? "true" : undefined}
      focusable="false"
    >
      <defs>
        {/* Brick coursing: soft cream mortar lines over the brick fill. */}
        <pattern id={patternId} width="36" height="18" patternUnits="userSpaceOnUse">
          <rect width="36" height="18" fill={T.brick} />
          <rect x="0" y="0" width="36" height="1.5" fill={T.cream} opacity="0.28" />
          <rect x="17" y="0" width="1.5" height="9" fill={T.cream} opacity="0.28" />
          <rect x="0" y="9" width="36" height="1.5" fill={T.cream} opacity="0.28" />
          <rect x="35" y="9" width="1.5" height="9" fill={T.cream} opacity="0.28" />
        </pattern>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={T.white} stopOpacity="0.9" />
          <stop offset="100%" stopColor={T.white} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Warm ground glow — sits on cream, never a hard edge. */}
      <ellipse cx="260" cy="250" rx="240" ry="190" fill={`url(#${glowId})`} />

      {/* Ground plane */}
      <g className={styles.houseGround}>
        <ellipse cx="260" cy="392" rx="228" ry="20" fill={T.sand} />
        <rect x="150" y="360" width="220" height="14" rx="3" fill={T.stoneLight} />
        {/* Low garden walls with stone coping */}
        <rect x="88" y="336" width="120" height="30" rx="3" fill={T.brick} />
        <rect x="84" y="332" width="128" height="8" rx="3" fill={T.stoneLight} />
        <rect x="312" y="336" width="120" height="30" rx="3" fill={T.brick} />
        <rect x="308" y="332" width="128" height="8" rx="3" fill={T.stoneLight} />
        {/* Path to the door */}
        <rect x="236" y="336" width="48" height="26" fill={T.sand} />
      </g>

      {/* Foundation */}
      <g className={styles.houseFoundation}>
        <rect x="112" y="322" width="296" height="18" rx="2" fill={T.ink} />
      </g>

      {/* Walls */}
      <g className={styles.houseWalls}>
        <rect x="120" y="150" width="280" height="176" fill={`url(#${patternId})`} />
        {/* Corner quoins in cream for warmth and depth */}
        <rect x="120" y="150" width="8" height="176" fill={T.cream} opacity="0.35" />
        <rect x="392" y="150" width="8" height="176" fill={T.cream} opacity="0.35" />
        {/* String course between floors */}
        <rect x="120" y="244" width="280" height="4" fill={T.cream} opacity="0.5" />
      </g>

      {/* Roof and chimney */}
      <g className={styles.houseRoof}>
        <rect x="336" y="66" width="30" height="70" rx="2" fill={T.deep} />
        <rect x="332" y="60" width="38" height="10" rx="2" fill={T.stoneLight} />
        <polygon points="104,156 260,42 416,156" fill={T.ink} />
        <polygon points="128,150 260,56 392,150" fill={T.deep} />
        <rect x="104" y="150" width="312" height="8" rx="2" fill={T.cream} />
      </g>

      {/* Door and windows */}
      <g className={styles.houseOpenings}>
        <Window x={146} y={172} />
        <Window x={314} y={172} />
        <Window x={146} y={252} />
        <Window x={314} y={252} />
        {/* First-floor centre window */}
        <Window x={238} y={172} w={44} h={62} />
        {/* Front door with fanlight */}
        <rect x="232" y="252" width="56" height="70" rx="3" fill={T.deep} />
        <path d="M238 274 a22 22 0 0 1 44 0 v-6 h-44 z" fill={T.cream} />
        <rect x="240" y="286" width="16" height="30" rx="2" fill={T.brick} opacity="0.55" />
        <rect x="264" y="286" width="16" height="30" rx="2" fill={T.brick} opacity="0.55" />
        <circle cx="277" cy="300" r="2.5" fill={T.sand} />
        <rect x="228" y="322" width="64" height="6" rx="1" fill={T.stoneLight} />
        {/* Wall lantern by the door */}
        <circle cx="216" cy="266" r="14" fill={T.sand} opacity="0.55" />
        <rect x="212" y="258" width="8" height="12" rx="1.5" fill={T.ink} />
      </g>

      {/* Chapter markers — only in the annotated variant */}
      {isAnnotated ? (
        <g className={styles.houseMarkers} aria-hidden="true">
          <Marker n={1} x={92} y={318} />
          <Marker n={2} x={200} y={318} />
          <Marker n={3} x={428} y={206} />
          <Marker n={4} x={300} y={64} />
        </g>
      ) : null}

      {/* Guide lines — exploded variant only, to read as layers, not damage */}
      {isExploded ? (
        <g className={styles.houseGuides} aria-hidden="true">
          <line x1="80" y1="150" x2="440" y2="150" />
          <line x1="80" y1="322" x2="440" y2="322" />
        </g>
      ) : null}
    </svg>
  );
}

function Marker({ n, x, y }: { n: number; x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="18" fill={T.cream} stroke={T.brick} strokeWidth="3" />
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--rb-font-display)"
        fontWeight="700"
        fontSize="18"
        fill={T.brick}
      >
        {n}
      </text>
    </g>
  );
}

/** Original terrace skyline — a decorative local motif, not a map. */
export function TerraceSkyline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 720 150"
      width={720}
      height={150}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Ground */}
      <rect x="0" y="132" width="720" height="6" rx="3" fill={T.sand} />
      {/* Houses, left to right — different heights and roof pitches */}
      <g fill={T.sand}>
        <polygon points="20,132 20,72 60,40 100,72 100,132" />
        <polygon points="110,132 110,60 165,24 220,60 220,132" />
        <polygon points="230,132 230,80 270,52 310,80 310,132" />
        <polygon points="320,132 320,54 380,18 440,54 440,132" />
        <polygon points="450,132 450,76 492,44 534,76 534,132" />
        <polygon points="544,132 544,64 600,28 656,64 656,132" />
        <polygon points="666,132 666,84 700,58 700,132" />
      </g>
      {/* Chimneys */}
      <g fill={T.brick}>
        <rect x="80" y="44" width="10" height="20" rx="1" />
        <rect x="200" y="30" width="10" height="24" rx="1" />
        <rect x="420" y="26" width="10" height="24" rx="1" />
        <rect x="636" y="36" width="10" height="24" rx="1" />
      </g>
      {/* Warm windows */}
      <g fill={T.cream}>
        <rect x="36" y="86" width="14" height="18" rx="2" />
        <rect x="70" y="86" width="14" height="18" rx="2" />
        <rect x="132" y="70" width="14" height="18" rx="2" />
        <rect x="158" y="70" width="14" height="18" rx="2" />
        <rect x="184" y="70" width="14" height="18" rx="2" />
        <rect x="132" y="102" width="14" height="18" rx="2" />
        <rect x="184" y="102" width="14" height="18" rx="2" />
        <rect x="248" y="94" width="14" height="18" rx="2" />
        <rect x="278" y="94" width="14" height="18" rx="2" />
        <rect x="346" y="66" width="14" height="18" rx="2" />
        <rect x="373" y="66" width="14" height="18" rx="2" />
        <rect x="400" y="66" width="14" height="18" rx="2" />
        <rect x="346" y="100" width="14" height="18" rx="2" />
        <rect x="400" y="100" width="14" height="18" rx="2" />
        <rect x="466" y="90" width="14" height="18" rx="2" />
        <rect x="504" y="90" width="14" height="18" rx="2" />
        <rect x="562" y="76" width="14" height="18" rx="2" />
        <rect x="593" y="76" width="14" height="18" rx="2" />
        <rect x="624" y="76" width="14" height="18" rx="2" />
        <rect x="562" y="106" width="14" height="18" rx="2" />
        <rect x="624" y="106" width="14" height="18" rx="2" />
        <rect x="676" y="98" width="14" height="18" rx="2" />
      </g>
      {/* Doors */}
      <g fill={T.brick}>
        <rect x="52" y="108" width="16" height="24" rx="2" />
        <rect x="158" y="106" width="16" height="26" rx="2" />
        <rect x="262" y="110" width="16" height="22" rx="2" />
        <rect x="373" y="104" width="16" height="28" rx="2" />
        <rect x="485" y="108" width="16" height="24" rx="2" />
        <rect x="593" y="106" width="16" height="26" rx="2" />
      </g>
    </svg>
  );
}
