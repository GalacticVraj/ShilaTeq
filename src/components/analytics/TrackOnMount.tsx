"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

/** Fires one analytics event on mount (e.g. the 404 page). Safe no-op without PostHog. */
export function TrackOnMount({ event }: { event: AnalyticsEvent }) {
  useEffect(() => {
    track(event);
  }, [event]);
  return null;
}
