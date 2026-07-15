"use client";

import type { PostHog } from "posthog-js";

/**
 * The closed analytics event schema (phase-4/02; M7). Only meaningful events —
 * no autocapture, no behavioural surveillance. `track` is a safe no-op when
 * PostHog isn't loaded (Gate-zero / not yet initialised), so callers never
 * need to guard.
 *
 * PostHog is loaded DYNAMICALLY by the AnalyticsProvider only when a key is
 * configured — it must never be statically imported anywhere, or its ~76KB
 * would land in every page's bundle. This module only holds the instance.
 */
export type AnalyticsEvent =
  | "homepage_cta"
  | "demo_started"
  | "demo_step"
  | "demo_completed"
  | "demo_qualified"
  | "whatsapp_click"
  | "guide_read"
  | "comparison_visit"
  | "industry_visit"
  | "pricing_visit"
  | "showroom_powered_by_visit"
  | "not_found";

let instance: PostHog | null = null;

/** Registered by the provider once PostHog is dynamically loaded and initialised. */
export function setPosthog(ph: PostHog | null) {
  instance = ph;
}

export function getPosthog(): PostHog | null {
  return instance;
}

export function track(event: AnalyticsEvent, props?: Record<string, string | number>) {
  try {
    instance?.capture(event, props);
  } catch {
    /* analytics must never break the page */
  }
}
