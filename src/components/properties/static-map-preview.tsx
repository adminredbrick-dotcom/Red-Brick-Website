import Link from "next/link";

import type { PublicListing } from "@/data/contracts/listing";
import { formatRentPcm } from "@/lib/format";
import { cn } from "@/lib/utils";

interface StaticMapPreviewProps {
  listings: readonly PublicListing[];
  className?: string;
  /** Currently selected listing (highlighted marker). */
  selectedId?: string | null;
  /** Where a marker links. Defaults to the listing's detail page. */
  markerHref?: (listing: PublicListing) => string;
  /** Short caption under the map. */
  caption?: string;
  /** Renders a compact version (e.g. property detail location block). */
  compact?: boolean;
}

/**
 * Static, abstract Peterborough locality plane. Not a geographic map — an
 * honest preview of the future MapTiler experience. Markers are HTML links
 * positioned by each listing's *approximate* coordinates, so every marker
 * is keyboard-reachable and its content is duplicated in the list.
 */
export function StaticMapPreview({
  listings,
  className,
  selectedId = null,
  markerHref = (listing) => `/properties/${listing.slug}`,
  caption = "Positions are approximate and illustrative — never exact addresses. The interactive Peterborough map arrives in a later stage.",
  compact = false,
}: StaticMapPreviewProps) {
  const positions = project(listings);

  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-lg border border-stone-light bg-cream",
          compact ? "aspect-[16/10]" : "aspect-[4/3] md:aspect-[16/11]",
        )}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 600 450"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <pattern id="rb-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M50 0H0V50" fill="none" stroke="#DDD5CB" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="600" height="450" fill="#F7F2EA" />
          <rect width="600" height="450" fill="url(#rb-grid)" />
          {/* Soft locality rings — abstract, not roads or boundaries. */}
          <g fill="none" stroke="#E8D7C6" strokeWidth="2">
            <ellipse cx="300" cy="225" rx="250" ry="180" />
            <ellipse cx="300" cy="225" rx="170" ry="120" />
            <ellipse cx="300" cy="225" rx="90" ry="62" />
          </g>
          <circle cx="300" cy="225" r="5" fill="#716B64" />
        </svg>

        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-2 rounded-sm bg-white/85 px-2 py-0.5 text-sm font-bold text-stone">
          Peterborough
        </span>

        <ul aria-label="Approximate property positions" className="contents">
          {listings.map((listing, index) => {
            const pos = positions[index] ?? { x: 50, y: 50 };
            const selected = selectedId === listing.id;
            return (
              <li
                key={listing.id}
                className="absolute"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -100%)" }}
              >
                <Link
                  href={markerHref(listing)}
                  aria-label={`${listing.title}, ${listing.location.publicArea}, ${formatRentPcm(listing.pricing.rentPcm)} (approximate position)`}
                  aria-current={selected ? "true" : undefined}
                  className={cn(
                    "group flex flex-col items-center rounded-md outline-offset-4",
                  )}
                >
                  <span
                    className={cn(
                      "rounded-md px-2 py-1 text-sm font-bold shadow-soft transition-colors",
                      selected ? "bg-ink text-cream" : "bg-white text-ink group-hover:bg-sand",
                    )}
                  >
                    {formatRentPcm(listing.pricing.rentPcm).replace(" pcm", "")}
                    <span className="sr-only"> per month</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "-mt-px size-3 rotate-45 rounded-[2px] shadow-soft",
                      selected ? "bg-ink" : "bg-brick",
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <figcaption className="text-sm text-stone">{caption}</figcaption>
    </figure>
  );
}

/**
 * Projects approximate lat/lon into percentage positions inside the plane
 * with generous padding. Equirectangular with latitude correction; enough
 * for an abstract preview.
 */
function project(listings: readonly PublicListing[]): { x: number; y: number }[] {
  if (listings.length === 0) return [];
  const lats = listings.map((l) => l.location.approximateLatitude);
  const lons = listings.map((l) => l.location.approximateLongitude);
  const meanLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const cos = Math.cos((meanLat * Math.PI) / 180);
  const xs = lons.map((lon) => lon * cos);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const spanX = Math.max(maxX - minX, 0.02);
  const spanY = Math.max(maxLat - minLat, 0.02);
  const span = Math.max(spanX, spanY);
  const cx = (minX + maxX) / 2;
  const cy = (minLat + maxLat) / 2;

  const PAD = 22; // percent of plane kept clear at each edge
  const usable = 100 - PAD * 2;

  const points = listings.map((_, i) => {
    const nx = ((xs[i] ?? cx) - cx) / span; // -0.5..0.5
    const ny = ((lats[i] ?? cy) - cy) / span;
    return {
      x: 50 + nx * usable,
      y: 50 - ny * usable, // north is up
    };
  });

  return separate(points);
}

/**
 * Nudges markers apart when approximate positions would overlap, so every
 * marker stays readable and clickable. Positions are illustrative anyway.
 */
function separate(points: { x: number; y: number }[]): { x: number; y: number }[] {
  const MIN_DX = 16; // percent of plane width
  const MIN_DY = 12; // percent of plane height
  const out = points.map((p) => ({ ...p }));
  for (let pass = 0; pass < 6; pass += 1) {
    let moved = false;
    for (let i = 0; i < out.length; i += 1) {
      for (let j = i + 1; j < out.length; j += 1) {
        const a = out[i];
        const b = out[j];
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        if (Math.abs(dx) < MIN_DX && Math.abs(dy) < MIN_DY) {
          const pushX = (MIN_DX - Math.abs(dx)) / 2;
          const dirX = dx >= 0 ? 1 : -1;
          a.x -= pushX * dirX;
          b.x += pushX * dirX;
          moved = true;
        }
      }
    }
    if (!moved) break;
  }
  return out.map((p) => ({
    x: Math.min(90, Math.max(10, p.x)),
    y: Math.min(90, Math.max(12, p.y)),
  }));
}
