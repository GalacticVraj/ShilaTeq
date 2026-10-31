import type { NextConfig } from "next";

/**
 * Production security headers (M7) and a Content-Security-Policy (SEC-06).
 * Everything loads from this origin except PostHog (only after consent) and
 * Vercel's analytics endpoint.
 * ponytail: script-src keeps 'unsafe-inline' because Next's per-page inline bootstrap
 * scripts and the JSON-LD blocks have no stable hash; a nonce needs a proxy and makes
 * every page dynamic. Switch to nonces if the site ever renders user-supplied content.
 */
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://*.posthog.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${posthogHost} https://*.posthog.com https://vitals.vercel-insights.com`,
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // The marketing site needs none of these powerful features.
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Two root layouts ((site) legacy, (kerf) redesign) need a global 404.
  experimental: { globalNotFound: true },
  // The ERP app links to /privacy, /terms and /refund (VITE_LEGAL_BASE_URL).
  async redirects() {
    return ["privacy", "terms", "refund"].map((slug) => ({
      source: `/${slug}`,
      destination: `/legal/${slug}`,
      permanent: false,
    }));
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
