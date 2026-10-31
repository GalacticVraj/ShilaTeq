"use client";

import { useEffect, useRef, useState } from "react";
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
 *
 * INDIA-11: PostHog loads only after the visitor agrees in the notice below (the choice is
 * kept in localStorage). Vercel Analytics is cookieless and aggregate, so it needs no notice.
 */
const CONSENT_KEY = "shilateq.analytics-consent";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const search = useSearchParams();
  const inited = useRef(false);
  // null until read on the client: "yes" | "no" | "" (not asked yet)
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    let v = "";
    try {
      v = localStorage.getItem(CONSENT_KEY) || "";
    } catch {
      /* storage blocked: ask every visit */
    }
    setConsent(v);
  }, []);

  const choose = (v: "yes" | "no") => {
    try {
      localStorage.setItem(CONSENT_KEY, v);
    } catch {
      /* ignore */
    }
    setConsent(v);
  };

  // Init once, after consent — dynamic import keeps PostHog out of every other bundle.
  useEffect(() => {
    if (inited.current || !site.posthogKey || consent !== "yes") return;
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
  }, [consent]);

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
      {site.posthogKey && consent === "" ? (
        <div
          role="region"
          aria-label="Analytics choice"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-lg border border-black/10 bg-white p-4 text-sm text-neutral-800 shadow-lg"
        >
          <p>
            May we count page visits with PostHog analytics to improve this site? It stores an ID in
            your browser. Nothing is sent unless you agree.{" "}
            <a href="/legal/privacy" className="underline">
              Privacy
            </a>
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => choose("yes")}
              className="rounded-md bg-neutral-900 px-4 py-2 text-white"
            >
              Allow
            </button>
            <button
              type="button"
              onClick={() => choose("no")}
              className="rounded-md border border-neutral-300 px-4 py-2"
            >
              No thanks
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
