"use client";

import { useSyncExternalStore } from "react";

/**
 * Local, honest demo-progress persistence (phase-4/02 F10 resume; no account,
 * no cookies). Tracks the furthest step reached and the set of visited steps —
 * "visited", not "completed", because that is what's actually true.
 * Read reactively via useDemoProgress (useSyncExternalStore — no setState in
 * effects, no hydration mismatch).
 */

const KEY = "shilateq_demo_v1";

export type DemoProgress = {
  furthest: number;
  visited: number[];
  qualified: boolean;
};

const EMPTY: DemoProgress = { furthest: 0, visited: [], qualified: false };

export function readProgress(): DemoProgress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw) as Partial<DemoProgress>;
    return {
      furthest: typeof p.furthest === "number" ? p.furthest : 0,
      visited: Array.isArray(p.visited) ? p.visited.filter((n) => typeof n === "number") : [],
      qualified: Boolean(p.qualified),
    };
  } catch {
    return EMPTY;
  }
}

export function writeProgress(next: Partial<DemoProgress>): DemoProgress {
  const cur = readProgress();
  const merged: DemoProgress = { ...cur, ...next };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(merged));
  } catch {
    /* storage unavailable (private mode): resume simply won't persist */
  }
  return merged;
}

/** Mark a step visited and advance `furthest`. */
export function visitStep(n: number): DemoProgress {
  const cur = readProgress();
  const visited = cur.visited.includes(n) ? cur.visited : [...cur.visited, n];
  return writeProgress({ visited, furthest: Math.max(cur.furthest, n) });
}

// ── Reactive read via useSyncExternalStore (stable snapshot, no effect setState).
let cachedRaw: string | null = null;
let cachedVal: DemoProgress = EMPTY;

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function getSnapshot(): DemoProgress {
  const raw = window.localStorage.getItem(KEY) ?? "";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedVal = readProgress();
  }
  return cachedVal;
}

export function useDemoProgress(): DemoProgress {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}
