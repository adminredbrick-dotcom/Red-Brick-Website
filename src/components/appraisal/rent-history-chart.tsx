import { DemoBadge } from "@/components/properties/demo-badge";
import { formatGbp } from "@/lib/format";
import type { RentHistoryPoint } from "@/lib/appraisal/types";

interface RentHistoryChartProps {
  points: readonly RentHistoryPoint[];
  /** Accessible title. */
  title: string;
}

/**
 * Demonstration rent-history chart: an inline-SVG band (low–high) with the
 * midpoint line, plus the same figures as a real table beneath it so nothing
 * depends on the graphic. No animation, no chart library.
 */
export function RentHistoryChart({ points, title }: RentHistoryChartProps) {
  const W = 640;
  const H = 260;
  const pad = { top: 16, right: 40, bottom: 40, left: 64 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const min = Math.min(...points.map((p) => p.low));
  const max = Math.max(...points.map((p) => p.high));
  const span = Math.max(max - min, 1);
  const yFor = (v: number) => pad.top + innerH - ((v - min) / span) * innerH;
  const xFor = (i: number) => pad.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);

  const upper = points.map((p, i) => `${xFor(i)},${yFor(p.high)}`);
  const lower = [...points].reverse().map((p, i) => `${xFor(points.length - 1 - i)},${yFor(p.low)}`);
  const band = `M${upper.join(" L")} L${lower.join(" L")} Z`;
  const mid = points.map((p, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor((p.low + p.high) / 2)}`).join(" ");

  // Four horizontal guide lines with £ labels.
  const ticks = [0, 1, 2, 3].map((t) => min + (span * t) / 3);

  return (
    <figure className="rounded-lg bg-white p-4 shadow-soft md:p-6">
      <figcaption className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xl font-bold text-ink">{title}</span>
        <DemoBadge kind="figures" />
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}. The figures are listed in the table below.`} className="mt-4 block h-auto w-full">
        {ticks.map((v) => (
          <g key={v}>
            <line x1={pad.left} x2={W - pad.right} y1={yFor(v)} y2={yFor(v)} stroke="#ddd5cb" strokeWidth="1" />
            <text x={pad.left - 8} y={yFor(v) + 4} textAnchor="end" fontFamily="Inter, Arial, sans-serif" fontSize="12" fill="#716b64">
              {formatGbp(Math.round(v))}
            </text>
          </g>
        ))}
        <path d={band} fill="#e8d7c6" opacity="0.9" />
        <path d={mid} fill="none" stroke="#a63d2f" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <g key={p.period}>
            <circle cx={xFor(i)} cy={yFor((p.low + p.high) / 2)} r="4.5" fill="#a63d2f" stroke="#ffffff" strokeWidth="2" />
            <text x={xFor(i)} y={H - 14} textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontSize="12" fill="#716b64">
              {p.period}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-base">
          <caption className="sr-only">{title} — figures</caption>
          <thead>
            <tr className="border-b border-stone-light text-sm uppercase tracking-wide text-stone">
              <th scope="col" className="py-2 pr-4 font-bold">Period</th>
              <th scope="col" className="py-2 pr-4 font-bold">Low</th>
              <th scope="col" className="py-2 pr-4 font-bold">High</th>
              <th scope="col" className="py-2 font-bold">Midpoint</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.period} className="border-b border-stone-light">
                <th scope="row" className="py-2 pr-4 font-bold text-ink">{p.period}</th>
                <td className="py-2 pr-4">{formatGbp(p.low)}</td>
                <td className="py-2 pr-4">{formatGbp(p.high)}</td>
                <td className="py-2">{formatGbp(Math.round((p.low + p.high) / 2))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
