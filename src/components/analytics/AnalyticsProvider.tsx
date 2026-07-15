"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site } from "@/config/site";
import { track, setPosthog, getPosthog } from "@/lib/analytics";

/**
 * Single analytics island (M7). PostHog is DYNAMICALLY imported only when a key
 * is configured (so its ~76KB never lands in the default bundle); autocapture
 * and session recording are OFF and DNT is respected. Events come from the
 * closed schema, derived from routes and a delegated click listener — zero page
 * components are touched. Vercel Analytics + Speed Insights are tiny and
 * self-disable off-Vercel.
 */
export function AnalyticsProvider() {
  const pathname = usePathname();
  const search = useSearchParams();
  const inited = useRef(false);

  // Init once — dynamic import keeps PostHog out of every other bundle.
  useEffect(() => {
    if (inited.current || !site.posthogKey) return;
    inited.current = true;
    let cancelled = false;
    import("posthog-js").then(({ default: posthog }) => {
      if (cancelled) return;
      posthog.init(site.posthogKey!, {
        api_host: site.posthogHost,
        autocapture: false,
        capture_pageview: false,
        disable_session_recording: true,
        respect_dnt: true,
        persistence: "localStorage",
      });
      setPosthog(posthog);
      posthog.capture("$pageview", { path: pathname });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pageview + route-derived semantic events.
  useEffect(() => {
    if (!site.posthogKey) return;
    const ph = getPosthog();
    if (ph) {
      try {
        ph.capture("$pageview", { path: pathname });
      } catch {
        /* ignore */
      }
    }
    if (pathname.startsWith("/why/vs-")) track("comparison_visit", { path: pathname });
    else if (pathname.startsWith("/guides/") && pathname !== "/guides")
      track("guide_read", { path: pathname });
    else if (pathname.startsWith("/industries/") && pathname !== "/industries")
      track("industry_visit", { path: pathname });
    else if (pathname === "/pricing") track("pricing_visit");
    else if (pathname === "/showroom-powered-by") track("showroom_powered_by_visit");
    else if (pathname === "/demo") {
      const step = search.get("step");
      if (step === "1") track("demo_started");
      else if (step === "done") track("demo_completed");
      else if (step) track("demo_step", { step });
    }
  }, [pathname, search]);

  // Delegated clicks — WhatsApp and the homepage demo CTA.
  useEffect(() => {
    if (!site.posthogKey) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (href.startsWith("https://wa.me/")) track("whatsapp_click", { path: pathname });
      else if (pathname === "/" && (href === "/demo" || href.startsWith("/demo?")))
        track("homepage_cta", { target: "demo" });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [pathname]);

  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />
    </>
  );
}
