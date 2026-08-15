import type { RentTrendSeries } from "@/data/contracts/rental-report";
import { formatGbp } from "@/lib/format";

interface RentTrendChartProps {
  series: RentTrendSeries;
}

const WIDTH = 320;
const HEIGHT = 120;
const PAD_X = 12;
const PAD_TOP = 18;
const PAD_BOTTOM = 18;

/**
 * Tiny inline SVG sparkline for the rent trend — progressive enhancement
 * only. The same points are always available as a table beneath it, and
 * the SVG carries a text description, so nothing depends on the graphic.
 */
export function RentTrendChart({ series }: RentTrendChartProps) {
  const points = series.points;
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const first = points[0];
  const last = points[points.length - 1];

  const step = points.length > 1 ? (WIDTH - PAD_X * 2) / (points.length - 1) : 0;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const coords = points.map((p, i) => ({
    x: PAD_X + i * step,
    y: PAD_TOP + plotHeight - ((p.value - min) / span) * plotHeight,
    point: p,
  }));
  const firstCoord = coords[0];
  const lastCoord = coords[coords.length - 1];
  const path = coords
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");

  const description =
    first && last
      ? `${series.label}: ${points.length} illustrative points from ${formatGbp(first.value)} to ${formatGbp(last.value)} per calendar month.`
      : `${series.label}: no points.`;

  return (
    <figure className="max-w-full">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={description}
        className="block h-auto w-full max-w-full"
        style={{ maxWidth: "100%" }}
      >
        <line
          x1={PAD_X}
          x2={WIDTH - PAD_X}
          y1={HEIGHT - PAD_BOTTOM}
          y2={HEIGHT - PAD_BOTTOM}
          stroke="var(--rb-stone-light)"
          strokeWidth="1"
        />
        <path
          d={path}
          fill="none"
          stroke="var(--rb-brick)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {coords.map((c) => (
          <circle
            key={c.point.period}
            cx={c.x}
            cy={c.y}
            r="4"
            fill="var(--rb-brick)"
            stroke="var(--rb-white)"
            strokeWidth="2"
          >
            <title>{`${c.point.period}: ${formatGbp(c.point.value)} pcm (illustrative)`}</title>
          </circle>
        ))}
        {first && firstCoord ? (
          <text
            x={firstCoord.x}
            y={PAD_TOP - 6}
            fontSize="11"
            fill="var(--rb-ink)"
            textAnchor="start"
            fontFamily="inherit"
          >
            {formatGbp(first.value)}
          </text>
        ) : null}
        {last && lastCoord ? (
          <text
            x={lastCoord.x}
            y={PAD_TOP - 6}
            fontSize="11"
            fill="var(--rb-ink)"
            textAnchor="end"
            fontFamily="inherit"
          >
            {formatGbp(last.value)}
          </text>
        ) : null}
      </svg>
      <figcaption className="mt-2 text-sm text-stone">
        {series.label} — illustrative sample points, not a market series.
      </figcaption>
      <details className="mt-3">
        <summary className="min-h-11 cursor-pointer py-2 font-bold text-ink">
          Show the illustrative points
        </summary>
        <div
          className="overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label="Illustrative rent trend points table (scrollable)"
        >
          <table className="mt-2 w-full min-w-[18rem] text-left text-base">
            <caption className="sr-only">Illustrative rent trend points</caption>
            <thead>
              <tr className="border-b border-stone-light">
                <th scope="col" className="py-2 pr-4 font-bold">
                  Period
                </th>
                <th scope="col" className="py-2 font-bold">
                  Sample rent (pcm)
                </th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.period} className="border-b border-stone-light">
                  <td className="py-2 pr-4">{p.period}</td>
                  <td className="py-2 tabular-nums">{formatGbp(p.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
