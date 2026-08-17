"use client";

import * as React from "react";

import type { VideoSources } from "@/content/home-media";
import { cn } from "@/lib/utils";

import { useVideoEligibility } from "./use-video-eligibility";

export interface PosterVideoProps {
  poster: string;
  /** Optional narrower poster for portrait/mobile crops (used via <picture>). */
  posterMobile?: string;
  sources: VideoSources | null;
  alt: string;
  /** Intrinsic size of the poster for layout stability. */
  width: number;
  height: number;
  /** Fetch priority for the poster (hero = high; it is the LCP element). */
  priority?: boolean;
  /**
   * External permission to play (the story controller allows one beat at a
   * time). Defaults to true for the hero.
   */
  allowed?: boolean;
  /** Called when the video element starts/finishes so a controller can pause siblings. */
  onPlaying?: () => void;
  className?: string;
  imgClassName?: string;
}

/**
 * Poster-first media element. The <img> is server-rendered and is the LCP
 * candidate; a <video> is created only on the client, only when the visitor
 * is eligible (desktop, no reduced motion, no Save-Data) and only when
 * derivatives exist. It is muted, plays once, holds its final frame and never
 * loops. No controls, no autoplay dependency for content.
 */
export function PosterVideo({
  poster,
  posterMobile,
  sources,
  alt,
  width,
  height,
  priority = false,
  allowed = true,
  onPlaying,
  className,
  imgClassName,
}: PosterVideoProps) {
  const eligible = useVideoEligibility();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [ended, setEnded] = React.useState(false);
  const [canPlay, setCanPlay] = React.useState(false);
  const useVideo = eligible && sources !== null;

  // Play once when allowed and ready; pause when permission is withdrawn.
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v || !useVideo) return;
    if (allowed && canPlay && !ended) {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else if (!allowed && !v.paused) {
      v.pause();
    }
  }, [allowed, canPlay, ended, useVideo]);

  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-sand", className)} data-media-state={useVideo ? (ended ? "held" : "video") : "poster"}>
      <picture>
        {posterMobile ? <source media="(max-width: 47.99rem)" srcSet={posterMobile} /> : null}
        <img
          src={poster}
          alt={alt}
          width={width}
          height={height}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className={cn("block h-full w-full object-cover", imgClassName)}
        />
      </picture>
      {useVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          preload="none"
          poster={poster}
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => setCanPlay(true)}
          onPlaying={onPlaying}
          onEnded={() => setEnded(true)}
        >
          {sources.webm ? <source src={sources.webm} type="video/webm" /> : null}
          <source src={sources.mp4} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
