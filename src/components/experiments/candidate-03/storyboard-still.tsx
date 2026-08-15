import styles from "./landing.module.css";

export type StillKey = "brick" | "door" | "window" | "room" | "dusk";

interface StoryboardStillProps {
  still: StillKey;
  /** Unique id prefix for pattern ids. */
  id: string;
}

/**
 * Five storyboard stills for the future scrolling story — locally drawn
 * inline SVG in the brand palette. Each still is decorative; the label
 * beside it carries the meaning.
 */
export function StoryboardStill({ still, id }: StoryboardStillProps) {
  const bond = `${id}-bond`;
  return (
    <svg viewBox="0 0 160 120" className={styles.still} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={bond} width="32" height="16" patternUnits="userSpaceOnUse">
          <path
            d="M0 8H32 M0 16H32 M16 8V16 M0 0V8"
            fill="none"
            stroke="rgb(247 242 234 / 0.32)"
            strokeWidth="1.2"
          />
        </pattern>
      </defs>
      {still === "brick" ? <Brick bond={bond} /> : null}
      {still === "door" ? <Door bond={bond} /> : null}
      {still === "window" ? <WindowLight /> : null}
      {still === "room" ? <Room /> : null}
      {still === "dusk" ? <Dusk /> : null}
    </svg>
  );
}

function Brick({ bond }: { bond: string }) {
  return (
    <>
      <rect width="160" height="120" fill="var(--rb-brick)" />
      <rect width="160" height="120" fill={`url(#${bond})`} />
      <path d="M0 120 L96 0 H160 L64 120 Z" fill="var(--rb-cream)" opacity="0.22" />
      <path d="M0 120 L38 72 H62 L14 120 Z" fill="var(--rb-cream)" opacity="0.14" />
    </>
  );
}

function Door({ bond }: { bond: string }) {
  return (
    <>
      <rect width="160" height="120" fill="var(--rb-brick)" />
      <rect width="160" height="120" fill={`url(#${bond})`} />
      <rect x="0" y="108" width="160" height="12" fill="var(--rb-stone)" />
      <rect x="52" y="102" width="56" height="7" rx="1.5" fill="var(--rb-sand)" />
      <path d="M58 104V50a22 22 0 0 1 44 0v54Z" fill="var(--rb-ink)" />
      <path d="M62 50a18 18 0 0 1 36 0" fill="none" stroke="var(--rb-cream)" strokeWidth="2.2" />
      <path d="M80 54V98" stroke="var(--rb-cream)" strokeWidth="1.2" opacity="0.5" />
      <circle cx="91" cy="78" r="2.6" fill="var(--rb-sand)" />
    </>
  );
}

function WindowLight() {
  return (
    <>
      <rect width="160" height="120" fill="var(--rb-sand)" />
      <rect x="44" y="18" width="72" height="84" rx="3" fill="var(--rb-cream)" />
      <rect
        x="44"
        y="18"
        width="72"
        height="84"
        rx="3"
        fill="none"
        stroke="var(--rb-stone)"
        strokeWidth="3"
      />
      <path d="M80 18V102 M44 60H116" stroke="var(--rb-stone)" strokeWidth="2" />
      <path d="M22 10 Q40 60 26 110 H10 V10Z" fill="var(--rb-brick)" opacity="0.85" />
      <path d="M138 10 Q120 60 134 110 H150 V10Z" fill="var(--rb-brick)" opacity="0.85" />
      <path d="M44 102 L80 20 L116 102Z" fill="var(--rb-cream)" opacity="0.5" />
    </>
  );
}

function Room() {
  return (
    <>
      <rect width="160" height="120" fill="var(--rb-cream)" />
      <rect x="0" y="92" width="160" height="28" fill="var(--rb-sand)" />
      <path d="M0 92H160" stroke="var(--rb-stone)" strokeWidth="1.5" />
      <rect x="18" y="58" width="44" height="30" rx="3" fill="var(--rb-white)" stroke="var(--rb-stone)" strokeWidth="2" />
      <path d="M26 58V88 M34 58V88 M42 58V88 M50 58V88" stroke="var(--rb-stone)" strokeWidth="1.5" />
      <rect x="92" y="62" width="48" height="8" rx="2" fill="var(--rb-brick)" />
      <path d="M100 70V92 M132 70V92" stroke="var(--rb-brick)" strokeWidth="3" strokeLinecap="round" />
      <path d="M118 62V34" stroke="var(--rb-ink)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M104 36 L118 14 L132 36Z" fill="var(--rb-brick)" />
      <circle cx="118" cy="46" r="8" fill="var(--rb-sand)" opacity="0.9" />
    </>
  );
}

function Dusk() {
  return (
    <>
      <rect width="160" height="120" fill="var(--rb-ink)" />
      <rect x="0" y="100" width="160" height="20" fill="var(--rb-stone)" opacity="0.6" />
      <rect x="40" y="52" width="80" height="50" rx="3" fill="var(--rb-brick)" />
      <path d="M34 54L80 20L126 54Z" fill="var(--rb-stone)" />
      <path d="M32 55H128" stroke="var(--rb-cream)" strokeWidth="3" strokeLinecap="round" />
      <rect x="50" y="64" width="16" height="14" rx="1.5" fill="var(--rb-sand)" />
      <rect x="94" y="64" width="16" height="14" rx="1.5" fill="var(--rb-sand)" />
      <rect x="50" y="84" width="16" height="16" rx="1.5" fill="var(--rb-sand)" />
      <path d="M72 102V84a8 8 0 0 1 16 0v18Z" fill="var(--rb-brick-dark)" />
      <circle cx="132" cy="18" r="6" fill="var(--rb-sand)" opacity="0.7" />
    </>
  );
}
