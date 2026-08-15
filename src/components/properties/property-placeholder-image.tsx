import { cn } from "@/lib/utils";

interface PropertyPlaceholderImageProps {
  className?: string;
  /** Visible caption inside the tile. */
  caption?: string;
}

/**
 * Stands in wherever a listing has no approved photograph. Deliberately
 * abstract — never a stock or AI image standing in for a real home.
 */
export function PropertyPlaceholderImage({
  className,
  caption = "Illustrative placeholder — no photograph",
}: PropertyPlaceholderImageProps) {
  return (
    <div
      role="img"
      aria-label={caption}
      className={cn(
        "relative flex aspect-[4/3] w-full items-end overflow-hidden rounded-md bg-sand",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 400 300"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="400" height="300" fill="#E8D7C6" />
        <rect x="0" y="230" width="400" height="70" fill="#DDD5CB" />
        <g fill="none" stroke="#A63D2F" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.55">
          <path d="M120 200 V132 L200 72 L280 132 V200 Z" />
          <path d="M104 140 L200 66 L296 140" />
          <path d="M184 200 V158 H216 V200" />
        </g>
      </svg>
      <span className="relative m-3 rounded-sm bg-white/90 px-2.5 py-1 text-sm font-bold text-ink">
        {caption}
      </span>
    </div>
  );
}
