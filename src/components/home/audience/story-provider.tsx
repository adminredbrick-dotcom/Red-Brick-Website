"use client";

import * as React from "react";

import { storyKeys, type StoryKey } from "@/lib/house/story";

/**
 * Audience choice for the homepage. Holds only the visitor's explicit
 * landlord/tenant selection for the current browser session
 * (`sessionStorage`), nothing else: no URL parameter, no cookie, no
 * persistent identifier, no analytics or CRM call. Server-rendered HTML
 * always shows the complete neutral story; the stored choice re-applies on
 * the client through useSyncExternalStore (server snapshot = neutral).
 */

const STORAGE_KEY = "rb-story";
const listeners = new Set<() => void>();
/** In-memory fallback when sessionStorage is unavailable (private mode, quota). */
let memoryStory: StoryKey = "neutral";

function isStoryKey(v: string | null): v is StoryKey {
  return v !== null && (storyKeys as readonly string[]).includes(v);
}

function readStory(): StoryKey {
  try {
    const v = window.sessionStorage.getItem(STORAGE_KEY);
    return isStoryKey(v) ? v : memoryStory;
  } catch {
    return memoryStory;
  }
}

function writeStory(next: StoryKey) {
  memoryStory = next;
  try {
    if (next === "neutral") window.sessionStorage.removeItem(STORAGE_KEY);
    else window.sessionStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* storage unavailable — memory fallback still applies for this page view */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

const getServerSnapshot = (): StoryKey => "neutral";

interface StoryContextValue {
  story: StoryKey;
  setStory: (story: StoryKey) => void;
}

const StoryContext = React.createContext<StoryContextValue>({ story: "neutral", setStory: () => {} });

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const story = React.useSyncExternalStore(subscribe, readStory, getServerSnapshot);
  const value = React.useMemo(() => ({ story, setStory: writeStory }), [story]);
  return (
    <StoryContext.Provider value={value}>
      <div data-story={story} className="contents">
        {children}
      </div>
    </StoryContext.Provider>
  );
}

export function useStory(): StoryContextValue {
  return React.useContext(StoryContext);
}

export { STORAGE_KEY as STORY_STORAGE_KEY };
