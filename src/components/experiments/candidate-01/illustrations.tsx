/**
 * Locally drawn inline SVG for the candidate. Flat vector, brand palette only
 * (brick, deep brick, ink, cream, sand, stone, white). No remote assets.
 *
 * `id` must be unique per instance because the brick pattern is referenced by
 * URL. All illustrations are decorative unless a `title` is supplied.
 */

const BRICK = "#a63d2f";
const BRICK_DEEP = "#70291f";
const INK = "#1d1b1a";
const CREAM = "#f7f2ea";
const SAND = "#e8d7c6";
const STONE_LIGHT = "#ddd5cb";
const WHITE = "#ffffff";

interface IllustrationProps {
  id: string;
  className?: string;
  /** Supply to expose the drawing as an image; omit for decorative use. */
  title?: string;
}

interface HouseProps extends IllustrationProps {
  /** Draw the sand pavement under the house (default). Pass false to stand it on a page surface. */
  ground?: boolean;
}

/** Running-bond brick pattern: staggered courses in deep brick on brick. */
function BrickPattern({ id }: { id: string }) {
  return (
    <pattern id={id} width="36" height="24" patternUnits="userSpaceOnUse">
      <rect width="36" height="24" fill={BRICK} />
      <path
        d="M0 12h36M18 0v12M0 12v12M36 12v12"
        stroke={BRICK_DEEP}
        strokeOpacity="0.45"
        strokeWidth="1.5"
        fill="none"
      />
    </pattern>
  );
}

function Window({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} fill={CREAM} />
      <rect x={x} y={y} width={w} height={h} fill={WHITE} stroke={INK} strokeWidth="2.5" />
      <path
        d={`M${x + w / 2} ${y}v${h}M${x} ${y + h * 0.42}h${w}`}
        stroke={INK}
        strokeWidth="2"
        fill="none"
      />
      <rect x={x - 6} y={y + h + 3} width={w + 12} height="5" fill={SAND} />
    </g>
  );
}

/**
 * The house — the object the future scrolling story is built around.
 * A plain red-brick end-of-terrace, front elevation.
 */
export function HouseIllustration({ id, className, title, ground = true }: HouseProps) {
  const patternId = `${id}-brick`;
  const titleId = `${id}-title`;
  return (
    <svg
      viewBox={ground ? "0 0 360 300" : "0 30 360 246"}
      className={className}
      role={title ? "img" : undefined}
      aria-labelledby={title ? titleId : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <defs>
        <BrickPattern id={patternId} />
      </defs>
      {/* ground */}
      {ground ? (
        <>
          <rect x="0" y="270" width="360" height="30" fill={SAND} />
          <rect x="0" y="268" width="360" height="3" fill={STONE_LIGHT} />
        </>
      ) : null}
      {/* chimney */}
      <rect x="238" y="60" width="26" height="60" fill={BRICK_DEEP} />
      <rect x="233" y="54" width="36" height="9" fill={INK} />
      {/* roof */}
      <polygon points="58,124 180,38 302,124" fill={BRICK_DEEP} />
      <rect x="54" y="120" width="252" height="8" fill={INK} />
      {/* walls */}
      <rect x="70" y="128" width="220" height="142" fill={`url(#${patternId})`} />
      {/* upstairs windows */}
      <Window x={100} y={146} w={54} h={46} />
      <Window x={206} y={146} w={54} h={46} />
      {/* bay window */}
      <rect x="186" y="200" width="88" height="8" fill={INK} />
      <Window x={194} y={212} w={72} h={44} />
      {/* door */}
      <rect x="96" y="204" width="52" height="66" fill={CREAM} />
      <rect x="100" y="208" width="44" height="62" fill={INK} />
      <rect x="100" y="208" width="44" height="12" fill={CREAM} />
      <path d="M100 220h44" stroke={INK} strokeWidth="2" />
      <rect x="106" y="230" width="14" height="30" fill={BRICK_DEEP} />
      <rect x="124" y="230" width="14" height="30" fill={BRICK_DEEP} />
      <circle cx="137" cy="246" r="2.5" fill={SAND} />
      {/* step */}
      <rect x="92" y="270" width="60" height="6" fill={STONE_LIGHT} />
      {/* no house number on purpose */}
    </svg>
  );
}

interface FacadeSpec {
  x: number;
  w: number;
  top: number;
  roof: "pitch" | "flat";
  chimney?: number;
  door: "left" | "right";
  bay?: boolean;
}

const FACADES: readonly FacadeSpec[] = [
  { x: 0, w: 120, top: 92, roof: "pitch", chimney: 96, door: "left" },
  { x: 120, w: 108, top: 104, roof: "flat", door: "right", bay: true },
  { x: 228, w: 132, top: 84, roof: "pitch", chimney: 336, door: "left", bay: true },
  { x: 360, w: 104, top: 108, roof: "flat", door: "right" },
  { x: 464, w: 124, top: 90, roof: "pitch", chimney: 478, door: "left", bay: true },
  { x: 588, w: 132, top: 100, roof: "flat", chimney: 700, door: "right" },
];

/**
 * A short terrace: the same house with its neighbours. Used for the
 * Peterborough chapter to ground the page locally without a map.
 */
export function TerraceIllustration({ id, className, title }: IllustrationProps) {
  const patternId = `${id}-brick`;
  const titleId = `${id}-title`;
  const groundY = 220;
  return (
    <svg
      viewBox="0 0 720 250"
      className={className}
      role={title ? "img" : undefined}
      aria-labelledby={title ? titleId : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      preserveAspectRatio="xMidYMax meet"
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <defs>
        <BrickPattern id={patternId} />
      </defs>
      <rect x="0" y={groundY} width="720" height="30" fill={SAND} />
      <rect x="0" y={groundY - 2} width="720" height="3" fill={STONE_LIGHT} />
      {FACADES.map((f) => {
        const wallTop = f.top + 24;
        const wallH = groundY - wallTop;
        const winW = Math.min(40, (f.w - 40) / 2);
        const doorX = f.door === "left" ? f.x + 14 : f.x + f.w - 46;
        const lowerWinX =
          f.door === "left" ? f.x + f.w - 14 - (f.bay ? 52 : winW) : f.x + 14;
        return (
          <g key={f.x}>
            {f.chimney ? (
              <rect x={f.chimney} y={f.top - 26} width="16" height="40" fill={BRICK_DEEP} />
            ) : null}
            {f.roof === "pitch" ? (
              <polygon
                points={`${f.x - 4},${wallTop} ${f.x + f.w / 2},${f.top - 30} ${f.x + f.w + 4},${wallTop}`}
                fill={BRICK_DEEP}
              />
            ) : (
              <rect x={f.x} y={f.top + 8} width={f.w} height="16" fill={BRICK_DEEP} />
            )}
            <rect x={f.x - 4} y={wallTop - 5} width={f.w + 8} height="6" fill={INK} />
            <rect x={f.x} y={wallTop} width={f.w} height={wallH} fill={`url(#${patternId})`} />
            <rect
              x={f.x + f.w - 1}
              y={wallTop}
              width="2"
              height={wallH}
              fill={BRICK_DEEP}
              opacity="0.5"
            />
            {/* upstairs windows */}
            <Window x={f.x + 14} y={wallTop + 16} w={winW} h={30} />
            <Window x={f.x + f.w - 14 - winW} y={wallTop + 16} w={winW} h={30} />
            {/* downstairs */}
            {f.bay ? (
              <>
                <rect x={lowerWinX - 8} y={groundY - 66} width="68" height="6" fill={INK} />
                <Window x={lowerWinX} y={groundY - 56} w={52} h={36} />
              </>
            ) : (
              <Window x={lowerWinX} y={groundY - 56} w={winW} h={36} />
            )}
            <rect x={doorX - 3} y={groundY - 66} width="38" height="66" fill={CREAM} />
            <rect x={doorX} y={groundY - 62} width="32" height="62" fill={INK} />
            <rect x={doorX} y={groundY - 62} width="32" height="9" fill={CREAM} />
            <circle cx={doorX + 26} cy={groundY - 30} r="2" fill={SAND} />
          </g>
        );
      })}
    </svg>
  );
}

/** Three courses of brick — the chapter marker used at the top of every beat. */
export function CourseMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 18" className={className} aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="14" height="4" fill="currentColor" />
      <rect x="17" y="0" width="14" height="4" fill="currentColor" />
      <rect x="34" y="0" width="14" height="4" fill="currentColor" />
      <rect x="0" y="7" width="6" height="4" fill="currentColor" />
      <rect x="9" y="7" width="14" height="4" fill="currentColor" />
      <rect x="26" y="7" width="14" height="4" fill="currentColor" />
      <rect x="43" y="7" width="5" height="4" fill="currentColor" />
      <rect x="0" y="14" width="14" height="4" fill="currentColor" />
      <rect x="17" y="14" width="14" height="4" fill="currentColor" />
      <rect x="34" y="14" width="14" height="4" fill="currentColor" />
    </svg>
  );
}
