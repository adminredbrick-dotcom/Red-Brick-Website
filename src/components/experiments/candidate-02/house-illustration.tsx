import { useId } from "react";

import styles from "./house-illustration.module.css";

/**
 * Candidate 02 — the house drawn in one continuous, rounded line.
 *
 * The brand mark is a single rounded stroke describing a roof and wall; this
 * illustration extends that language into a whole house so the same object
 * can be the spine of the page. Three states share one geometry:
 *
 * - `elevation`: the finished front of the house (hero)
 * - `exploded`: roof lifted, foundation lowered, rooms visible (story stage)
 * - `cutaway`: front wall removed, a single line running through the rooms
 *   and out of the chimney — communication threading through a home
 *
 * All colours come from the brand tokens via CSS custom properties set on the
 * tone class (day on cream, night on ink). No text is drawn inside the SVG;
 * the accessible name comes from <title>.
 */

export type HouseVariant = "elevation" | "exploded" | "cutaway";
export type HouseTone = "day" | "night";

interface HouseIllustrationProps {
  variant: HouseVariant;
  tone?: HouseTone;
  /** Accessible name for the drawing. */
  title: string;
  className?: string;
}

const STROKE = 5;

export function HouseIllustration({
  variant,
  tone = "day",
  title,
  className,
}: HouseIllustrationProps) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const patternId = `house-brick-${id}`;
  const titleId = `house-title-${id}`;

  const viewBox = variant === "exploded" ? "0 0 400 360" : "0 0 400 320";
  const classes = [styles.house, styles[tone], className].filter(Boolean).join(" ");

  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-labelledby={titleId}
      className={classes}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title id={titleId}>{title}</title>
      <defs>
        {/* Stretcher bond: two courses per tile, headers offset by half a brick. */}
        <pattern id={patternId} width="28" height="14" patternUnits="userSpaceOnUse">
          <path
            d="M0 7H28M0 14H28M14 0V7M0 7V14M28 7V14"
            className={styles.mortar}
            strokeWidth="1.5"
          />
        </pattern>
      </defs>

      {variant === "elevation" ? (
        <Elevation patternId={patternId} />
      ) : variant === "exploded" ? (
        <Exploded patternId={patternId} />
      ) : (
        <Cutaway patternId={patternId} />
      )}
    </svg>
  );
}

/* ---------- shared pieces (base geometry: walls 90..310 × 140..280) ---------- */

function Roof({ y = 0 }: { y?: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      {/* Chimney sits behind the roof plane. */}
      <rect
        x="254"
        y="70"
        width="26"
        height="50"
        rx="2"
        className={styles.wall}
        strokeWidth={STROKE}
      />
      <path d="M66 146L200 52L334 146Z" className={styles.roof} strokeWidth={STROKE + 1} />
    </g>
  );
}

function Windows() {
  return (
    <g>
      <rect x="112" y="160" width="52" height="44" rx="3" className={styles.glow} strokeWidth="4" />
      <path d="M138 160V204M112 182H164" className={styles.bar} strokeWidth="3" />
      <rect x="236" y="160" width="52" height="44" rx="3" className={styles.glow} strokeWidth="4" />
      <path d="M262 160V204M236 182H288" className={styles.bar} strokeWidth="3" />
      <rect x="112" y="214" width="52" height="48" rx="3" className={styles.glow} strokeWidth="4" />
      <path d="M138 214V262M112 238H164" className={styles.bar} strokeWidth="3" />
      <rect x="236" y="214" width="52" height="48" rx="3" className={styles.glow} strokeWidth="4" />
      <path d="M262 214V262M236 238H288" className={styles.bar} strokeWidth="3" />
    </g>
  );
}

function Door({ x = 179, y = 204, height = 76 }: { x?: number; y?: number; height?: number }) {
  return (
    <g>
      <rect x={x} y={y} width="42" height={height} rx="3" className={styles.door} strokeWidth="4" />
      <circle cx={x + 34} cy={y + height / 2 + 4} r="3" className={styles.knob} />
    </g>
  );
}

function Ground() {
  return <path d="M16 280H384" className={styles.line} strokeWidth={STROKE + 1} />;
}

/* ---------- variants ---------- */

function Elevation({ patternId }: { patternId: string }) {
  return (
    <g>
      <Ground />
      <Roof />
      <rect
        x="90"
        y="140"
        width="220"
        height="140"
        rx="3"
        className={styles.wall}
        strokeWidth={STROKE}
      />
      <rect x="90" y="140" width="220" height="140" rx="3" fill={`url(#${patternId})`} />
      {/* Redraw the eaves over the wall so the roof reads as one continuous line. */}
      <path d="M66 146H334" className={styles.line} strokeWidth={STROKE + 1} />
      <Windows />
      <Door />
    </g>
  );
}

function Exploded({ patternId }: { patternId: string }) {
  return (
    <g>
      {/* Assembly axis: the parts belong on one line. */}
      <path d="M200 18V342" className={styles.axis} strokeWidth="2" strokeDasharray="2 10" />
      {/* Foundation, lowered. */}
      <rect
        x="76"
        y="308"
        width="248"
        height="16"
        rx="3"
        className={styles.slab}
        strokeWidth={STROKE}
      />
      {/* Walls with the rooms visible: floor plane and one partition. */}
      <rect
        x="90"
        y="150"
        width="220"
        height="140"
        rx="3"
        className={styles.wallOpen}
        strokeWidth={STROKE}
      />
      <rect x="90" y="150" width="220" height="140" rx="3" fill={`url(#${patternId})`} />
      <path d="M90 216H310M200 216V290" className={styles.line} strokeWidth="3" />
      {/* Door and windows, pulled slightly forward of the wall plane. */}
      <g transform="translate(0 10)">
        <rect
          x="112"
          y="160"
          width="52"
          height="40"
          rx="3"
          className={styles.glow}
          strokeWidth="4"
        />
        <rect
          x="236"
          y="160"
          width="52"
          height="40"
          rx="3"
          className={styles.glow}
          strokeWidth="4"
        />
        <rect
          x="112"
          y="228"
          width="52"
          height="42"
          rx="3"
          className={styles.glow}
          strokeWidth="4"
        />
        <Door x={236} y={222} height={58} />
      </g>
      {/* Roof, lifted clear of the walls. */}
      <Roof y={-44} />
    </g>
  );
}

function Cutaway({ patternId }: { patternId: string }) {
  return (
    <g>
      <Ground />
      <Roof />
      {/* Loft space under the roof reads as interior. */}
      <path d="M96 140L200 66L304 140Z" className={styles.loft} />
      {/* Interior with the front wall removed; the side walls keep their brick. */}
      <rect
        x="90"
        y="140"
        width="220"
        height="140"
        rx="3"
        className={styles.interior}
        strokeWidth={STROKE}
      />
      <rect x="90" y="140" width="16" height="140" className={styles.wall} strokeWidth="0" />
      <rect x="90" y="140" width="16" height="140" fill={`url(#${patternId})`} />
      <rect x="294" y="140" width="16" height="140" className={styles.wall} strokeWidth="0" />
      <rect x="294" y="140" width="16" height="140" fill={`url(#${patternId})`} />
      <rect
        x="90"
        y="140"
        width="220"
        height="140"
        rx="3"
        className={styles.line}
        strokeWidth={STROKE}
      />
      {/* Floor plane between the two storeys. */}
      <rect x="106" y="206" width="188" height="8" className={styles.slab} strokeWidth="0" />
      {/* Back-wall openings. */}
      <rect x="126" y="160" width="44" height="36" rx="3" className={styles.glow} strokeWidth="3" />
      <rect x="126" y="222" width="44" height="40" rx="3" className={styles.glow} strokeWidth="3" />
      <Door x={244} y={224} height={56} />
      {/* One continuous line: in at the door, through every room, out at the chimney. */}
      <path
        d="M30 280C90 280 100 258 134 258C168 258 184 236 200 208C216 180 236 172 256 172C280 172 272 120 267 78"
        className={styles.thread}
        strokeWidth={STROKE}
      />
    </g>
  );
}
