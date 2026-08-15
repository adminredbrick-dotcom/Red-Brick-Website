"use client";

import * as React from "react";

import {
  AUDIENCE_ATTRIBUTE,
  AUDIENCE_PARAM,
  AUDIENCE_STORAGE_KEY,
  audienceAnnouncement,
  parseStoredAudience,
  type Audience,
} from "@/components/home/audience";

interface AudienceContextValue {
  audience: Audience;
  /** Sets the audience, remembers it for the session and announces it. */
  choose: (next: Audience) => void;
}

const AudienceContext = React.createContext<AudienceContextValue | null>(null);

export function useAudience(): AudienceContextValue | null {
  return React.useContext(AudienceContext);
}

/* sessionStorage as an external store — read after hydration, never on the server. */
function subscribeToStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}
function readStoredAudience(): Audience | null {
  try {
    return parseStoredAudience(window.sessionStorage.getItem(AUDIENCE_STORAGE_KEY));
  } catch {
    return null; // storage unavailable (privacy modes) — the page still works
  }
}
const noStoredAudience = () => null;

interface AudienceRootProps {
  /** Value parsed from `?audience=` on the server ("none" when absent/invalid). */
  initialAudience: Audience;
  /** True when the URL carried an audience parameter (valid or not). */
  fromUrl: boolean;
  children: React.ReactNode;
}

/**
 * Homepage wrapper. Renders `data-audience` on a plain block so the
 * server-rendered sections (passed in as children) can show, hide and reorder
 * content with CSS attribute rules — which works with no JavaScript at all.
 *
 * With JavaScript it becomes the small enhancement layer:
 *  - choices update the attribute without a page load,
 *  - the choice is kept in sessionStorage (`rb-audience`) for this session
 *    only — no cookies, no persistence beyond the tab,
 *  - a stored choice is restored after hydration when the URL has no parameter,
 *  - the URL is kept in step with history.replaceState so it can be shared,
 *  - a polite live region announces the change.
 */
export function AudienceRoot({ initialAudience, fromUrl, children }: AudienceRootProps) {
  const [chosen, setChosen] = React.useState<Audience | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const stored = React.useSyncExternalStore(
    subscribeToStorage,
    readStoredAudience,
    noStoredAudience,
  );

  // Precedence: an explicit choice on this page → the URL → the session store.
  const audience: Audience = chosen ?? (fromUrl ? initialAudience : (stored ?? initialAudience));

  const choose = React.useCallback((next: Audience) => {
    setChosen(next);
    setAnnouncement(audienceAnnouncement(next));
    try {
      if (next === "none") {
        window.sessionStorage.removeItem(AUDIENCE_STORAGE_KEY);
      } else {
        window.sessionStorage.setItem(AUDIENCE_STORAGE_KEY, next);
      }
    } catch {
      // Ignore storage failures.
    }
    try {
      const url = new URL(window.location.href);
      if (next === "none") {
        url.searchParams.delete(AUDIENCE_PARAM);
      } else {
        url.searchParams.set(AUDIENCE_PARAM, next);
      }
      url.hash = "";
      window.history.replaceState(window.history.state, "", url);
    } catch {
      // Ignore history failures.
    }
  }, []);

  const value = React.useMemo(() => ({ audience, choose }), [audience, choose]);

  return (
    <AudienceContext.Provider value={value}>
      <div {...{ [AUDIENCE_ATTRIBUTE]: audience }} data-testid="home-audience-root">
        {children}
        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {announcement}
        </p>
      </div>
    </AudienceContext.Provider>
  );
}
