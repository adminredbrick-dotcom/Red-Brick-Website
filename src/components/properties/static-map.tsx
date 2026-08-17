import { DemoBadge } from "@/components/properties/demo-badge";
import { areas } from "@/lib/listings/areas";
import { cn } from "@/lib/utils";

export interface MapPin {
  readonly id: string;
  readonly label: string;
  readonly latitude: number;
  readonly longitude: number;
  /** When set, the pin's label links to the listing. */
  readonly href?: string;
  readonly emphasis?: "default" | "muted";
}

interface StaticMapProps {
  pins: readonly MapPin[];
  /** Area key to highlight (e.g. the filtered area or the listing's area). */
  highlightArea?: string | null;
  /** Accessible title. */
  title: string;
  className?: string;
  /** Height variant. */
  size?: "default" | "compact";
}

/**
 * Static schematic map of Peterborough drawn as inline SVG — no map
 * provider, no WebGL, no tiles, no requests. Areas are labelled at their
 * approximate centres and pins are placed at approximate coordinates only.
 * This is the "optional static map view" for the landing/search phase; a
 * MapLibre map (lazy, wheel-zoom disabled, list alternative) arrives later
 * and must never render alongside the homepage 3D canvas.
 *
 * Every pin is also listed as text beneath the drawing so the information
 * never depends on the graphic.
 */
export function StaticMap({ pins, highlightArea, title, className, size = "default" }: StaticMapProps) {
  // Schematic bounds — approximate Peterborough extent.
  const bounds = { north: 52.63, south: 52.52, west: -0.32, east: -0.19 };
  const W = 600;
  const H = size === "compact" ? 360 : 440;
  /** Areas whose label sits above the circle to avoid a close neighbour below. */
  const labelAbove = new Set(["central", "werrington", "bretton", "paston"]);
  const project = (lat: number, lng: number) => ({
    x: ((lng - bounds.west) / (bounds.east - bounds.west)) * W,
    y: ((bounds.north - lat) / (bounds.north - bounds.south)) * H,
  });

  return (
    <figure className={cn("rounded-lg bg-white p-4 shadow-soft md:p-6", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${title}. ${pins.length} location${pins.length === 1 ? "" : "s"} shown at approximate positions.`}
        className="block h-auto w-full rounded-md bg-cream"
      >
        {/* River Nene — a soft schematic band, west to east through the centre. */}
        <path
          d={`M0 ${project(52.578, -0.32).y} C 150 ${project(52.565, -0.28).y}, 300 ${project(52.572, -0.24).y}, ${W} ${project(52.56, -0.19).y}`}
          fill="none"
          stroke="#ddd5cb"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Area labels at approximate centres. */}
        {areas.map((area) => {
          const p = project(area.approximateLatitude, area.approximateLongitude);
          const active = area.key === highlightArea;
          const above = labelAbove.has(area.key);
          return (
            <g key={area.key}>
              <circle cx={p.x} cy={p.y} r={active ? 22 : 16} fill={active ? "#e8d7c6" : "#f7f2ea"} stroke={active ? "#a63d2f" : "#ddd5cb"} strokeWidth={active ? 2 : 1} />
              <text
                x={p.x}
                y={above ? p.y - (active ? 28 : 22) : p.y + (active ? 36 : 30)}
                textAnchor="middle"
                fontFamily="Inter, Arial, sans-serif"
                fontSize="11"
                fontWeight={active ? 700 : 500}
                fill={active ? "#1d1b1a" : "#716b64"}
              >
                {area.name}
              </text>
            </g>
          );
        })}
        {/* Pins */}
        {pins.map((pin, i) => {
          const p = project(pin.latitude, pin.longitude);
          const muted = pin.emphasis === "muted";
          return (
            <g key={pin.id}>
              <path
                d={`M${p.x} ${p.y} m-9 -12 a9 9 0 1 1 18 0 c0 7 -9 16 -9 16 s-9 -9 -9 -16z`}
                fill={muted ? "#716b64" : "#a63d2f"}
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                fontFamily="Inter, Arial, sans-serif"
                fontSize="10"
                fontWeight="700"
                fill="#ffffff"
              >
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-3 text-sm text-stone">
        <DemoBadge kind="map" className="mb-2" />
      </figcaption>
      <ol className="mt-2 grid gap-1 text-base sm:grid-cols-2" aria-label="Locations shown on the map">
        {pins.map((pin, i) => (
          <li key={pin.id} className="flex gap-2">
            <span className="font-bold text-brick" aria-hidden="true">
              {i + 1}.
            </span>
            {pin.href ? (
              <a href={pin.href} className="underline underline-offset-4 hover:text-brick">
                {pin.label}
              </a>
            ) : (
              <span>{pin.label}</span>
            )}
          </li>
        ))}
      </ol>
    </figure>
  );
}
