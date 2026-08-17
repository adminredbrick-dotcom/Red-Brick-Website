import type { PropertyType } from "@/lib/listings/types";
import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  type: PropertyType;
  /** Accessible description — always states that this is a placeholder. */
  alt: string;
  className?: string;
}

/**
 * Original inline-SVG placeholder for demonstration listings. No photograph,
 * stock image or AI image is ever shown for a fictional record (CLAUDE.md:
 * actual listing photos must be of that property). Brick / cream / ink /
 * sand palette, rounded geometry, soft daylight.
 */
export function PlaceholderImage({ type, alt, className }: PlaceholderImageProps) {
  const isFlat = type === "apartment";
  const isBungalow = type === "bungalow";
  const isDetached = type === "detached-house";

  return (
    <svg
      viewBox="0 0 320 200"
      role="img"
      aria-label={alt}
      className={cn("block h-auto w-full rounded-md bg-sand", className)}
    >
      <rect width="320" height="200" fill="#e8d7c6" />
      {/* soft sky band */}
      <rect x="0" y="0" width="320" height="120" fill="#f7f2ea" />
      {/* ground */}
      <rect x="0" y="150" width="320" height="50" fill="#ddd5cb" />
      {isFlat ? (
        <g>
          <rect x="96" y="34" width="128" height="120" rx="6" fill="#a63d2f" />
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={112 + col * 36}
                y={48 + row * 32}
                width="20"
                height="18"
                rx="2"
                fill="#f7f2ea"
              />
            )),
          )}
          <rect x="150" y="128" width="20" height="26" rx="2" fill="#1d1b1a" />
        </g>
      ) : isBungalow ? (
        <g>
          <rect x="70" y="92" width="180" height="62" rx="4" fill="#a63d2f" />
          <polygon points="60,94 160,52 260,94" fill="#70291f" />
          <rect x="92" y="108" width="28" height="24" rx="2" fill="#f7f2ea" />
          <rect x="200" y="108" width="28" height="24" rx="2" fill="#f7f2ea" />
          <rect x="149" y="116" width="22" height="38" rx="2" fill="#1d1b1a" />
        </g>
      ) : (
        <g>
          {isDetached ? null : <rect x="36" y="86" width="60" height="68" fill="#c9b8a4" />}
          <rect x={isDetached ? 100 : 96} y="72" width="128" height="82" rx="4" fill="#a63d2f" />
          <polygon
            points={isDetached ? "92,74 164,30 236,74" : "88,74 160,30 232,74"}
            fill="#70291f"
          />
          <rect x="116" y="88" width="24" height="22" rx="2" fill="#f7f2ea" />
          <rect x="176" y="88" width="24" height="22" rx="2" fill="#f7f2ea" />
          <rect x="116" y="122" width="24" height="22" rx="2" fill="#f7f2ea" />
          <rect x="176" y="118" width="20" height="36" rx="2" fill="#1d1b1a" />
          {isDetached ? null : <rect x="228" y="86" width="56" height="68" fill="#c9b8a4" />}
        </g>
      )}
      {/* light */}
      <circle cx="270" cy="34" r="14" fill="#f7f2ea" opacity="0.9" />
      <text
        x="16"
        y="188"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="11"
        fontWeight="700"
        fill="#1d1b1a"
      >
        Placeholder illustration
      </text>
    </svg>
  );
}
