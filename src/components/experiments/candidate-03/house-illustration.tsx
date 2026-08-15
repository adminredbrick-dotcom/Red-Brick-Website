import { cn } from "@/lib/utils";

import styles from "./house.module.css";

export type HouseMode = "exploded" | "assembled" | "journey";

interface HouseIllustrationProps {
  /** Unique id prefix (pattern ids must not collide between instances). */
  id: string;
  /** Static exploded, static assembled, or scroll-assembled inside a journey section. */
  mode: HouseMode;
  /** Accessible description; pass an empty string to mark the drawing decorative. */
  label: string;
  /** Text shown on the date stone. */
  dateStone?: string;
  /** Daylight on a sand ground, or dusk on an ink ground. */
  scene?: "day" | "dusk";
  className?: string;
}

/**
 * The Red Brick house — locally authored inline SVG in the brand palette.
 *
 * Every part is its own group so CSS can hold it apart (exploded), sit it in
 * place (assembled) or move it into place as the reader scrolls (journey).
 * Colours are CSS custom properties so the same drawing works on a sand
 * ground in daylight and on an ink ground at dusk.
 */
export function HouseIllustration({
  id,
  mode,
  label,
  dateStone,
  scene = "day",
  className,
}: HouseIllustrationProps) {
  const decorative = label === "";
  const bond = `${id}-bond`;
  const titleId = `${id}-title`;

  return (
    <svg
      viewBox="0 0 420 340"
      className={cn(styles.house, styles[mode], className)}
      data-scene={scene}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-labelledby={decorative ? undefined : titleId}
      focusable="false"
    >
      {decorative ? null : <title id={titleId}>{label}</title>}
      <defs>
        <pattern id={bond} width="44" height="22" patternUnits="userSpaceOnUse">
          <path
            d="M0 11H44 M0 22H44 M22 11V22 M0 0V11"
            fill="none"
            stroke="var(--house-mortar)"
            strokeWidth="1.5"
          />
        </pattern>
      </defs>

      {/* Ground */}
      <g className={styles.ground}>
        <path
          d="M22 302H398"
          stroke="var(--house-ground)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M60 320H160 M250 320H340"
          stroke="var(--house-ground)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.45"
        />
      </g>

      {/* Chimney sits behind the roof */}
      <g className={styles.roof}>
        <rect x="262" y="80" width="28" height="60" rx="3" fill="var(--house-wall)" />
        <rect x="257" y="74" width="38" height="9" rx="2.5" fill="var(--house-trim)" />
      </g>

      {/* Walls */}
      <g className={styles.walls}>
        <rect x="100" y="150" width="220" height="152" rx="6" fill="var(--house-wall)" />
        <rect
          x="100"
          y="150"
          width="220"
          height="152"
          rx="6"
          fill={`url(#${bond})`}
          opacity="0.9"
        />
        <rect x="176" y="296" width="68" height="8" rx="2" fill="var(--house-trim)" />
        {dateStone ? (
          <g className={styles.dateStone}>
            <rect x="189" y="176" width="42" height="24" rx="3" fill="var(--house-stone)" />
            <text
              x="210"
              y="193"
              textAnchor="middle"
              fontFamily="var(--rb-font-display)"
              fontWeight="700"
              fontSize="13"
              letterSpacing="0.06em"
              fill="var(--house-stone-text)"
            >
              {dateStone}
            </text>
          </g>
        ) : null}
      </g>

      {/* Roof */}
      <g className={styles.roof}>
        <path d="M82 158L210 50L338 158Z" fill="var(--house-roof)" />
        <path
          d="M76 160H344"
          stroke="var(--house-trim)"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </g>

      {/* Windows — left pair and right pair move apart when exploded */}
      <g className={styles.windowsLeft}>
        <Window x={118} y={170} w={52} h={46} />
        <Window x={118} y={232} w={52} h={54} />
      </g>
      <g className={styles.windowsRight}>
        <Window x={250} y={170} w={52} h={46} />
        <Window x={250} y={232} w={52} h={54} />
      </g>

      {/* Front door */}
      <g className={styles.door}>
        <path d="M186 302V240a24 24 0 0 1 48 0v62Z" fill="var(--house-door)" />
        <path
          d="M191 240a19 19 0 0 1 38 0"
          fill="none"
          stroke="var(--house-trim)"
          strokeWidth="2.5"
        />
        <path d="M210 244V296" stroke="var(--house-trim)" strokeWidth="1.5" opacity="0.5" />
        <circle cx="222" cy="272" r="3" fill="var(--house-brass)" />
      </g>

      {/* Communication line — drawn in the Manage chapter */}
      <path
        className={styles.line}
        d="M144 194C170 228 250 228 276 194 M144 258C170 230 250 230 276 258"
        fill="none"
        stroke="var(--house-line)"
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength="100"
      />
    </svg>
  );
}

function Window({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const midX = x + w / 2;
  const midY = y + h / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" className={styles.glass} />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="3"
        fill="none"
        stroke="var(--house-trim)"
        strokeWidth="3"
      />
      <path
        d={`M${midX} ${y}V${y + h} M${x} ${midY}H${x + w}`}
        stroke="var(--house-trim)"
        strokeWidth="2"
      />
    </g>
  );
}
