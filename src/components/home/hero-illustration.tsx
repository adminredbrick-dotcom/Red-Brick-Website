import { cn } from "@/lib/utils";

/**
 * Original hero artwork: a close crop of a brick elevation with one warmly
 * lit window at dusk. Decorative and poster-ready — the media frame that
 * holds it is where the property film (Phase 3) will sit. No photograph, no
 * house number, no people, no possessions.
 */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className={cn("block h-full w-full", className)}
    >
      <defs>
        <pattern id="rb-hero-bricks" width="96" height="48" patternUnits="userSpaceOnUse">
          <rect width="96" height="48" fill="#70291F" />
          {/* brick tones = brand brick over deep brick at varying opacity */}
          <rect x="2" y="2" width="44" height="20" rx="1.5" fill="#A63D2F" opacity="0.5" />
          <rect x="50" y="2" width="44" height="20" rx="1.5" fill="#A63D2F" opacity="0.34" />
          <rect x="-22" y="26" width="44" height="20" rx="1.5" fill="#A63D2F" opacity="0.42" />
          <rect x="26" y="26" width="44" height="20" rx="1.5" fill="#A63D2F" opacity="0.5" />
          <rect x="74" y="26" width="44" height="20" rx="1.5" fill="#A63D2F" opacity="0.34" />
        </pattern>
        <radialGradient id="rb-hero-spill" cx="0.5" cy="0.42" r="0.6">
          <stop offset="0%" stopColor="#F3D9A4" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#F3D9A4" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#F3D9A4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rb-hero-dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1D1B1A" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#1D1B1A" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#1D1B1A" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* brick elevation */}
      <rect width="800" height="600" fill="url(#rb-hero-bricks)" />
      <rect width="800" height="600" fill="url(#rb-hero-dusk)" />

      {/* warm light spilling from the window onto the wall */}
      <rect width="800" height="600" fill="url(#rb-hero-spill)" />

      {/* stone lintel and sill */}
      <rect x="292" y="150" width="216" height="22" fill="#716B64" />
      <rect x="286" y="418" width="228" height="18" fill="#716B64" />
      <rect x="286" y="436" width="228" height="6" fill="#1D1B1A" opacity="0.35" />

      {/* window frame and warm panes */}
      <rect x="304" y="172" width="192" height="246" fill="#F7F2EA" />
      <rect x="316" y="184" width="80" height="106" fill="#F3D9A4" />
      <rect x="404" y="184" width="80" height="106" fill="#F3D9A4" />
      <rect x="316" y="300" width="80" height="106" fill="#F3D9A4" />
      <rect x="404" y="300" width="80" height="106" fill="#F3D9A4" />
      {/* a soft curtain fold at each side of the glass */}
      <rect x="316" y="184" width="22" height="222" fill="#E8D7C6" opacity="0.7" />
      <rect x="462" y="184" width="22" height="222" fill="#E8D7C6" opacity="0.7" />
      {/* light falling on the sill */}
      <rect x="286" y="418" width="228" height="18" fill="#F3D9A4" opacity="0.35" />

      {/* downpipe at the left edge — a small, real detail of a cared-for wall */}
      <rect x="92" y="0" width="14" height="600" fill="#1D1B1A" opacity="0.8" />
      <rect x="86" y="118" width="26" height="12" rx="2" fill="#1D1B1A" opacity="0.85" />
    </svg>
  );
}
