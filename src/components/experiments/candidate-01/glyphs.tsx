/**
 * Small line glyphs drawn locally for the candidate (48 × 48, currentColor).
 * Decorative: every glyph is aria-hidden; meaning is always carried by text.
 */

export type GlyphName =
  | "clipboard"
  | "key"
  | "door"
  | "window"
  | "spanner"
  | "let"
  | "manage"
  | "care";

const PATHS: Record<GlyphName, React.ReactNode> = {
  clipboard: (
    <>
      <rect x="10" y="8" width="28" height="34" rx="3" />
      <rect x="18" y="4" width="12" height="8" rx="2" />
      <path d="M17 24l5 5 9-10" />
      <path d="M17 35h14" />
    </>
  ),
  key: (
    <>
      <circle cx="17" cy="19" r="8" />
      <path d="M23 25l17 17" />
      <path d="M33 35l4-4M37 39l4-4" />
    </>
  ),
  door: (
    <>
      <rect x="12" y="6" width="24" height="38" rx="2" />
      <path d="M8 44h32" />
      <circle cx="30" cy="26" r="1.5" fill="currentColor" />
      <path d="M18 14h12" />
    </>
  ),
  window: (
    <>
      <rect x="8" y="8" width="32" height="30" rx="2" />
      <path d="M24 8v30M8 22h32" />
      <path d="M6 42h36" />
    </>
  ),
  spanner: (
    <path d="M30 6a10 10 0 0 0-9 14L8 33a3 3 0 0 0 0 4l3 3a3 3 0 0 0 4 0l13-13a10 10 0 0 0 14-9l-6 2-4-4 2-6z" />
  ),
  let: (
    <>
      <path d="M8 22L24 9l16 13" />
      <path d="M12 20v20h24V20" />
      <path d="M21 40V29h6v11" />
    </>
  ),
  manage: (
    <>
      <rect x="8" y="10" width="32" height="30" rx="3" />
      <path d="M8 19h32M17 6v8M31 6v8" />
      <path d="M15 28h6M25 28h8M15 34h12" />
    </>
  ),
  care: (
    <>
      <path d="M8 22L24 9l16 13" />
      <path d="M12 20v20h24V20" />
      <path d="M24 34c-4-3-7-6-7-9a3.5 3.5 0 0 1 7-1 3.5 3.5 0 0 1 7 1c0 3-3 6-7 9z" />
    </>
  ),
};

export function Glyph({ name, className }: { name: GlyphName; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name]}
    </svg>
  );
}
