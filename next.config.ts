import type { NextConfig } from "next";

/**
 * Production security headers (M7). The strong, non-breaking headers are
 * enforced here. A strict Content-Security-Policy is provided as a documented
 * recommendation in FINAL_TECHNICAL_AUDIT.md instead of enforced blindly —
 * it must be tested against the real analytics domains and a nonce strategy
 * for the inline bootstrap script before enabling, and a broken CSP is worse
 * than a documented one.
 */
const securityHeaders = [
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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
