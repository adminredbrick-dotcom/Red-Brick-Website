import s from "./landing.module.css";

/**
 * Candidate 04 — hand-built inline SVG illustrations.
 *
 * Every shape is drawn by hand in the brick / cream / ink / sand / stone
 * palette; every fill and stroke references a module token class, never a
 * raw colour. Nothing is animated. Each figure either carries an accessible
 * label from the caller (role="img" + aria-label) or is marked decorative.
 */

interface ArtProps {
  className?: string;
  label?: string;
}

function artA11y(label?: string) {
  return label
    ? ({ role: "img", "aria-label": label } as const)
    : ({ "aria-hidden": true, focusable: false } as const);
}

/** Stretcher-bond brick pattern: two courses per tile, joints offset by half a brick. */
function BondPattern({ id, w = 48, h = 28 }: { id: string; w?: number; h?: number }) {
  const half = h / 2;
  const mid = w / 2;
  const d = `M0 ${half}H${w}M0 ${h}H${w}M${mid} 0V${half}M0 ${half}V${h}M${w} ${half}V${h}`;
  return (
    <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse">
      <path className={s.aStrokeRule} d={d} fill="none" strokeWidth="1" />
    </pattern>
  );
}

/* ---------------------------------------------------------------- hero house */

export function HeroHouse({ className, label }: ArtProps) {
  return (
    <svg viewBox="0 0 480 400" className={className} width="480" height="400" {...artA11y(label)}>
      <defs>
        <BondPattern id="c04-bond-hero" />
      </defs>

      {/* boundary walls */}
      <rect x="24" y="346" width="72" height="26" className={s.aFillSand} />
      <rect x="24" y="346" width="72" height="26" fill="url(#c04-bond-hero)" />
      <path d="M20 346H100" className={s.aStrokeInk} strokeWidth="2" fill="none" />
      <rect x="384" y="346" width="72" height="26" className={s.aFillSand} />
      <rect x="384" y="346" width="72" height="26" fill="url(#c04-bond-hero)" />
      <path d="M380 346H460" className={s.aStrokeInk} strokeWidth="2" fill="none" />

      {/* chimney (drawn before the roof so the roof covers its base) */}
      <rect x="338" y="70" width="14" height="18" className={s.aFillDeep} />
      <rect x="330" y="86" width="30" height="56" className={s.aFillBrick} />
      <path d="M326 86H364" className={s.aStrokeInk} strokeWidth="2" fill="none" />

      {/* wall */}
      <rect x="96" y="158" width="288" height="214" className={s.aFillSand} />
      <rect x="96" y="158" width="288" height="214" fill="url(#c04-bond-hero)" />
      <rect
        x="96"
        y="158"
        width="288"
        height="214"
        className={s.aStrokeInk}
        strokeWidth="1.5"
        fill="none"
      />

      {/* roof and eaves */}
      <polygon points="76,164 240,50 404,164" className={s.aFillStone} />
      <path
        d="M112 140H368M148 116H332M184 92H296M220 68H260"
        className={s.aStrokeCream}
        strokeWidth="1"
        opacity="0.45"
        fill="none"
      />
      <path d="M72 164H408" className={s.aStrokeInk} strokeWidth="2.5" fill="none" />
      <path d="M76 164L240 50L404 164" className={s.aStrokeInk} strokeWidth="1.5" fill="none" />

      {/* downpipe */}
      <path d="M102 166V372" className={s.aStrokeInk} strokeWidth="1.5" fill="none" />

      {/* upper windows */}
      <g>
        <rect x="128" y="182" width="52" height="62" className={s.aFillPaper} />
        <rect
          x="128"
          y="182"
          width="52"
          height="62"
          className={s.aStrokeInk}
          strokeWidth="1.5"
          fill="none"
        />
        <path d="M154 182V244M128 213H180" className={s.aStrokeInk} strokeWidth="1" fill="none" />
        <rect x="124" y="244" width="60" height="5" className={s.aFillRule} />
        <rect
          x="124"
          y="244"
          width="60"
          height="5"
          className={s.aStrokeInk}
          strokeWidth="1"
          fill="none"
        />
      </g>
      <g>
        <rect x="292" y="182" width="52" height="62" className={s.aFillPaper} />
        <rect
          x="292"
          y="182"
          width="52"
          height="62"
          className={s.aStrokeInk}
          strokeWidth="1.5"
          fill="none"
        />
        <path d="M318 182V244M292 213H344" className={s.aStrokeInk} strokeWidth="1" fill="none" />
        <rect x="288" y="244" width="60" height="5" className={s.aFillRule} />
        <rect
          x="288"
          y="244"
          width="60"
          height="5"
          className={s.aStrokeInk}
          strokeWidth="1"
          fill="none"
        />
      </g>

      {/* lower window */}
      <g>
        <rect x="280" y="264" width="76" height="80" className={s.aFillPaper} />
        <rect
          x="280"
          y="264"
          width="76"
          height="80"
          className={s.aStrokeInk}
          strokeWidth="1.5"
          fill="none"
        />
        <path d="M318 264V344M280 292H356" className={s.aStrokeInk} strokeWidth="1" fill="none" />
        <rect x="276" y="344" width="84" height="5" className={s.aFillRule} />
        <rect
          x="276"
          y="344"
          width="84"
          height="5"
          className={s.aStrokeInk}
          strokeWidth="1"
          fill="none"
        />
      </g>

      {/* door, fanlight and step */}
      <path d="M126 272A22 22 0 0 1 170 272Z" className={s.aFillPaper} />
      <path
        d="M126 272A22 22 0 0 1 170 272ZM148 250V272M136 255L148 272M160 255L148 272"
        className={s.aStrokeInk}
        strokeWidth="1"
        fill="none"
      />
      <rect x="126" y="272" width="44" height="92" className={s.aFillBrick} />
      <rect
        x="126"
        y="272"
        width="44"
        height="92"
        className={s.aStrokeInk}
        strokeWidth="1.5"
        fill="none"
      />
      <rect
        x="133"
        y="282"
        width="30"
        height="30"
        className={s.aStrokeDeep}
        strokeWidth="1"
        fill="none"
      />
      <rect
        x="133"
        y="322"
        width="30"
        height="34"
        className={s.aStrokeDeep}
        strokeWidth="1"
        fill="none"
      />
      <circle cx="160" cy="320" r="2.2" className={s.aFillPaper} />
      <rect x="120" y="364" width="56" height="8" className={s.aFillSand} />
      <rect
        x="120"
        y="364"
        width="56"
        height="8"
        className={s.aStrokeInk}
        strokeWidth="1"
        fill="none"
      />

      {/* ground */}
      <path d="M12 372H468" className={s.aStrokeInk} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

/* ---------------------------------------------------------- storyboard strip */

interface MiniHouseProps {
  x: number;
  y: number;
  w: number;
  h: number;
}

function MiniHouse({ x, y, w, h }: MiniHouseProps) {
  const roofH = Math.round(w * 0.36);
  const wallY = y + roofH;
  const wallH = h - roofH;
  const doorW = Math.round(w * 0.22);
  const doorH = Math.round(wallH * 0.5);
  const winW = Math.round(w * 0.24);
  const winH = Math.round(wallH * 0.28);
  const inset = Math.round(w * 0.14);
  const winY = wallY + Math.round(wallH * 0.14);
  return (
    <g>
      <rect x={x} y={wallY} width={w} height={wallH} className={s.aFillSand} />
      <polygon
        points={`${x - 3},${wallY} ${x + w / 2},${y} ${x + w + 3},${wallY}`}
        className={s.aFillStone}
      />
      <path
        d={`M${x - 5} ${wallY}H${x + w + 5}`}
        className={s.aStrokeInk}
        strokeWidth="1.5"
        fill="none"
      />
      <rect
        x={x}
        y={wallY}
        width={w}
        height={wallH}
        className={s.aStrokeInk}
        strokeWidth="1"
        fill="none"
      />
      <rect x={x + inset} y={winY} width={winW} height={winH} className={s.aFillPaper} />
      <rect
        x={x + inset}
        y={winY}
        width={winW}
        height={winH}
        className={s.aStrokeInk}
        strokeWidth="1"
        fill="none"
      />
      <rect x={x + w - inset - winW} y={winY} width={winW} height={winH} className={s.aFillPaper} />
      <rect
        x={x + w - inset - winW}
        y={winY}
        width={winW}
        height={winH}
        className={s.aStrokeInk}
        strokeWidth="1"
        fill="none"
      />
      <rect
        x={x + inset}
        y={wallY + wallH - doorH}
        width={doorW}
        height={doorH}
        className={s.aFillBrick}
      />
      <rect
        x={x + inset}
        y={wallY + wallH - doorH}
        width={doorW}
        height={doorH}
        className={s.aStrokeInk}
        strokeWidth="1"
        fill="none"
      />
    </g>
  );
}

const SOLDIER_COURSE = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;

export function StoryboardStrip({ className, label }: ArtProps) {
  const frameY = 16;
  const frameH = 176;
  const frameW = 216;
  const xs = [12, 256, 500, 744];
  return (
    <svg viewBox="0 0 972 208" className={className} width="972" height="208" {...artA11y(label)}>
      {xs.map((x) => (
        <rect
          key={x}
          x={x}
          y={frameY}
          width={frameW}
          height={frameH}
          className={s.aStrokeInk}
          strokeWidth="1"
          fill="none"
        />
      ))}

      {/* 1 — the street: three terraced fronts */}
      <g>
        <MiniHouse x={40} y={64} w={52} h={104} />
        <MiniHouse x={94} y={58} w={52} h={110} />
        <MiniHouse x={148} y={64} w={52} h={104} />
        <path d="M24 168H216" className={s.aStrokeInk} strokeWidth="1.5" fill="none" />
      </g>

      {/* 2 — the house */}
      <g>
        <MiniHouse x={302} y={44} w={124} h={124} />
        <path d="M268 168H460" className={s.aStrokeInk} strokeWidth="1.5" fill="none" />
      </g>

      {/* 3 — the window, with a soldier course above */}
      <g>
        <rect x={558} y={70} width={100} height={98} className={s.aFillPaper} />
        <rect
          x={558}
          y={70}
          width={100}
          height={98}
          className={s.aStrokeInk}
          strokeWidth="1.5"
          fill="none"
        />
        <path d="M608 70V168M558 119H658" className={s.aStrokeInk} strokeWidth="1" fill="none" />
        <rect x={552} y={168} width={112} height={6} className={s.aFillRule} />
        <rect
          x={552}
          y={168}
          width={112}
          height={6}
          className={s.aStrokeInk}
          strokeWidth="1"
          fill="none"
        />
        {SOLDIER_COURSE.map((i) => (
          <rect
            key={i}
            x={554 + i * 12}
            y={48}
            width={10}
            height={20}
            className={i % 2 === 0 ? s.aFillBrick : s.aFillSand}
          />
        ))}
        <rect
          x={554}
          y={48}
          width={108}
          height={20}
          className={s.aStrokeInk}
          strokeWidth="1"
          fill="none"
        />
      </g>

      {/* 4 — the door */}
      <g>
        <path d="M818 74A34 34 0 0 1 886 74Z" className={s.aFillPaper} />
        <path
          d="M818 74A34 34 0 0 1 886 74ZM852 40V74M834 48L852 74M870 48L852 74"
          className={s.aStrokeInk}
          strokeWidth="1"
          fill="none"
        />
        <rect x={818} y={74} width={68} height={86} className={s.aFillBrick} />
        <rect
          x={818}
          y={74}
          width={68}
          height={86}
          className={s.aStrokeInk}
          strokeWidth="1.5"
          fill="none"
        />
        <rect
          x={828}
          y={84}
          width={48}
          height={30}
          className={s.aStrokeDeep}
          strokeWidth="1"
          fill="none"
        />
        <rect
          x={828}
          y={122}
          width={48}
          height={30}
          className={s.aStrokeDeep}
          strokeWidth="1"
          fill="none"
        />
        <circle cx={872} cy={120} r={2.5} className={s.aFillPaper} />
        <rect x={810} y={160} width={84} height={8} className={s.aFillSand} />
        <rect
          x={810}
          y={160}
          width={84}
          height={8}
          className={s.aStrokeInk}
          strokeWidth="1"
          fill="none"
        />
      </g>
    </svg>
  );
}

/* --------------------------------------------------------- journey house glyph */

export function JourneyHouse({ className, label }: ArtProps) {
  return (
    <svg viewBox="0 0 200 172" className={className} width="200" height="172" {...artA11y(label)}>
      <defs>
        <BondPattern id="c04-bond-journey" w={32} h={18} />
      </defs>
      <rect x="132" y="34" width="14" height="30" className={s.aFillBrick} />
      <rect x="40" y="72" width="120" height="88" className={s.aFillSand} />
      <rect x="40" y="72" width="120" height="88" fill="url(#c04-bond-journey)" />
      <rect
        x="40"
        y="72"
        width="120"
        height="88"
        className={s.aStrokeInk}
        strokeWidth="1.5"
        fill="none"
      />
      <polygon points="30,76 100,22 170,76" className={s.aFillStone} />
      <path d="M26 76H174" className={s.aStrokeInk} strokeWidth="2" fill="none" />
      <path d="M30 76L100 22L170 76" className={s.aStrokeInk} strokeWidth="1.5" fill="none" />
      <rect x="56" y="88" width="24" height="26" className={s.aFillPaper} />
      <rect
        x="56"
        y="88"
        width="24"
        height="26"
        className={s.aStrokeInk}
        strokeWidth="1"
        fill="none"
      />
      <path d="M68 88V114M56 101H80" className={s.aStrokeInk} strokeWidth="1" fill="none" />
      <rect x="120" y="88" width="24" height="26" className={s.aFillPaper} />
      <rect
        x="120"
        y="88"
        width="24"
        height="26"
        className={s.aStrokeInk}
        strokeWidth="1"
        fill="none"
      />
      <path d="M132 88V114M120 101H144" className={s.aStrokeInk} strokeWidth="1" fill="none" />
      <path d="M88 126A12 12 0 0 1 112 126Z" className={s.aFillPaper} />
      <path d="M88 126A12 12 0 0 1 112 126Z" className={s.aStrokeInk} strokeWidth="1" fill="none" />
      <rect x="88" y="126" width="24" height="34" className={s.aFillBrick} />
      <rect
        x="88"
        y="126"
        width="24"
        height="34"
        className={s.aStrokeInk}
        strokeWidth="1"
        fill="none"
      />
      <path d="M8 160H192" className={s.aStrokeInk} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

/* --------------------------------------------------------------- datestone */

const TABLET_COURSE = Array.from({ length: 16 }, (_, i) => i);

export function Datestone({
  className,
  label,
  line1,
  year,
}: ArtProps & { line1: string; year: string }) {
  return (
    <svg viewBox="0 0 320 240" className={className} width="320" height="240" {...artA11y(label)}>
      <defs>
        <BondPattern id="c04-bond-stone" w={56} h={32} />
      </defs>
      <rect x="0" y="0" width="320" height="240" className={s.aFillSand} />
      <rect x="0" y="0" width="320" height="240" fill="url(#c04-bond-stone)" />

      {/* soldier course above the tablet */}
      {TABLET_COURSE.map((i) => (
        <rect
          key={i}
          x={64 + i * 12}
          y={44}
          width={10}
          height={20}
          className={i % 2 === 0 ? s.aFillBrick : s.aFillPaper}
        />
      ))}
      <rect
        x="64"
        y="44"
        width="192"
        height="20"
        className={s.aStrokeInk}
        strokeWidth="1"
        fill="none"
      />

      {/* stone tablet */}
      <rect x="64" y="72" width="192" height="112" rx="3" className={s.aFillPaper} />
      <rect
        x="64"
        y="72"
        width="192"
        height="112"
        rx="3"
        className={s.aStrokeInk}
        strokeWidth="1.5"
        fill="none"
      />
      <rect
        x="74"
        y="82"
        width="172"
        height="92"
        className={s.aStrokeRule}
        strokeWidth="1"
        fill="none"
      />
      <text x="160" y="112" textAnchor="middle" className={s.aTextLabel}>
        {line1}
      </text>
      <text x="160" y="164" textAnchor="middle" className={s.aTextYear}>
        {year}
      </text>

      {/* string course below */}
      <path d="M0 200H320" className={s.aStrokeInk} strokeWidth="1.5" fill="none" />
    </svg>
  );
}
