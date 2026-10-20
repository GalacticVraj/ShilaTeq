import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DoorsBlock } from "@/components/ui/DoorsBlock";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/home/Reveal";
import { RevealRunner } from "@/components/shared/RevealRunner";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "How your yard's data is protected",
  description:
    "ShilaTeq's security approach in plain language: per-yard isolation enforced at the database, protected server operations, role-based access — and an honest account of what we're still finishing.",
  openGraph: {
    title: "How your yard's data is protected",
    description:
      "Per-yard isolation, protected operations, and an honest account of what's in progress.",
    type: "website",
  },
};

/**
 * /security (phase-4/04 §12): documented protections only, IN-PROGRESS items
 * marked honestly, and an explicit "what we never claim" (no invented certs /
 * compliance). Grounded strictly in the Phase-1 knowledge base.
 */

const PROTECTED: Array<[string, string]> = [
  [
    "Your yard is a sealed box",
    "Every record belongs to exactly one yard, and the isolation is enforced at the database level — not just hidden on screen. The backend refuses to return one yard's data to another yard's user. Many yards share one platform; none can see another's.",
  ],
  [
    "Sensitive operations are protected",
    "The operations that move money and stock — reserving blocks, cutting, applying credit, processing returns, provisioning a worker login — run as protected server-side functions that a browser can't bypass or tamper with.",
  ],
  [
    "Least-privilege by role",
    "Workers see their own tasks, cuts, and pay — never prices, margins, customers, or another worker's data. Drivers see only their own deliveries. The public sees only the safe, available-stock details a yard chooses to publish.",
  ],
  [
    "Narrow public surfaces",
    "The showroom, a block's QR card, and delivery tracking are the only public windows, and each reads a deliberately narrow, safe set of columns — never cost, supplier, exact location, or any financial data.",
  ],
  [
    "A managed, durable backend",
    "Data lives in a managed cloud with automated durability — there are no local files to lose. Credentials are never hard-coded in the app.",
  ],
  [
    "Your data is portable",
    "Everything exports to Excel and CSV at any time. Your data is yours; there's no lock-in holding it hostage.",
  ],
];

const IN_PROGRESS: Array<[string, string]> = [
  [
    "Complete audit-trail logging",
    "An activity view exists today; automatic, tamper-evident server-side logging of every sensitive action is still being completed. We'd rather tell you it's in progress than imply a complete forensic trail exists now.",
  ],
  [
    "Isolation & permission hardening",
    "The multi-tenant model is enforced at the data layer, with several hardening passes already done and a few follow-ups tracked before large-scale rollout — including a formal third-party review.",
  ],
];

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <RevealRunner />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Security", href: "/security" },
        ]}
      />

      <header className="mt-8 max-w-2xl">
        <p className="eyebrow">Security</p>
        <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
          Your whole business lives here. Here&rsquo;s how it&rsquo;s protected.
        </h1>
        <p className="text-body-lg text-ink-700 mt-5">
          ShilaTeq holds a yard&rsquo;s entire commercial life — stock, cash, customers, staff.
          Security isn&rsquo;t a feature here; it&rsquo;s the licence to be trusted with that. This
          is a plain-language account of how we protect it, and an honest account of what
          we&rsquo;re still finishing.
        </p>
      </header>

      {/* What's protected */}
      <Reveal as="section" aria-labelledby="protected" className="reveal mt-16 max-w-2xl">
        <h2 id="protected" className="font-display text-heading-1 text-ink-900 font-medium">
          What&rsquo;s protected today
        </h2>
        <ul className="mt-6">
          {PROTECTED.map(([t, d]) => (
            <li key={t} className="border-line-100 border-b py-4 first:border-t">
              <p className="text-ink-900 font-bold">{t}</p>
              <p className="text-body text-ink-700 mt-1">{d}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* What's in progress */}
      <Reveal as="section" aria-labelledby="progress" className="reveal mt-16 max-w-2xl">
        <h2 id="progress" className="font-display text-heading-1 text-ink-900 font-medium">
          What we&rsquo;re still finishing
        </h2>
        <ul className="mt-6">
          {IN_PROGRESS.map(([t, d]) => (
            <li key={t} className="border-line-100 border-b py-4 first:border-t">
              <p className="text-ink-900 flex items-center gap-2 font-bold">
                {t}
                <Badge variant="in-progress">In progress</Badge>
              </p>
              <p className="text-body text-ink-700 mt-1">{d}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* What we never claim */}
      <Reveal as="section" aria-labelledby="never" className="reveal mt-16 max-w-2xl">
        <h2 id="never" className="font-display text-heading-1 text-ink-900 font-medium">
          What we don&rsquo;t claim
        </h2>
        <p className="text-body text-ink-700 mt-5">
          We won&rsquo;t dress up our security with badges we haven&rsquo;t earned. We make no claim
          to any formal certification or compliance audit we haven&rsquo;t actually completed, and
          we won&rsquo;t use phrases like &ldquo;bank-grade&rdquo; as decoration. When we achieve a
          certification or complete a formal review, we&rsquo;ll say so plainly here — with the
          evidence.
        </p>
      </Reveal>

      {/* Responsible disclosure */}
      <Reveal as="section" aria-labelledby="disclosure" className="reveal mt-16 max-w-2xl">
        <h2 id="disclosure" className="font-display text-heading-1 text-ink-900 font-medium">
          Found a problem? Tell us.
        </h2>
        <p className="text-body text-ink-700 mt-5">
          If you believe you&rsquo;ve found a security issue, we want to hear from you before anyone
          else does. Please report it privately and give us a reasonable chance to fix it before
          disclosing publicly — we commit to acknowledging genuine reports and keeping you updated.
        </p>
        {site.securityEmail ? (
          <p className="text-data text-ink-900 mt-4 font-mono">{site.securityEmail}</p>
        ) : (
          <p className="rounded-paper border-line-300 bg-paper-1 text-body-sm text-ink-700 mt-4 border border-dashed p-4">
            A dedicated security contact address is being set up. In the meantime, reach us through
            the{" "}
            <Link href="/contact" className="prose-link">
              contact page
            </Link>{" "}
            and mark your message as a security report.
          </p>
        )}
      </Reveal>

      {/* Doors */}
      <section
        aria-label="See it yourself"
        className="border-line-100 mt-16 max-w-2xl border-t pt-8"
      >
        <div>
          <DoorsBlock waPrefix="Mera data security ko lekar ek sawaal hai." />
        </div>
        <p className="text-body-sm text-ink-700 mt-6">
          See also our{" "}
          <Link href="/legal/privacy" className="prose-link">
            privacy policy
          </Link>{" "}
          and the full{" "}
          <Link href="/docs" className="prose-link">
            product documentation
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
