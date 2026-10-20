import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { WhatsAppGlyph } from "@/components/ui/DoorsBlock";
import { ContactFormLazy } from "@/components/contact/ContactFormLazy";
import { JsonLd } from "@/components/ui/JsonLd";
import { site, waLink, waDefaultPrefill } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact — a human answers",
  description:
    "Ask us anything about running your yard on ShilaTeq. WhatsApp-first — a human answers, usually within minutes.",
  openGraph: {
    title: "Contact ShilaTeq",
    description: "A human answers — WhatsApp-first.",
    type: "website",
  },
};

/**
 * /contact (phase-4/04 §11): WhatsApp-first, with the RHF+Zod fallback form.
 * Honest degradation while the number/email are Gate-zero.
 */
export default function ContactPage() {
  const wa = waLink(waDefaultPrefill);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact ShilaTeq",
          description: "Reach ShilaTeq — WhatsApp-first; a human answers.",
        }}
      />

      <header className="mt-8 max-w-2xl">
        <p className="eyebrow">Contact</p>
        <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
          Ask us anything. A human answers.
        </h1>
        <p className="text-body-lg text-ink-700 mt-5">
          WhatsApp is the fastest way to reach us — the same channel your customers use. We reply
          during business hours, usually within minutes.
        </p>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        {/* WhatsApp-first */}
        <section aria-labelledby="wa-h">
          <h2 id="wa-h" className="font-display text-heading-1 text-ink-900 font-medium">
            On WhatsApp
          </h2>
          {wa ? (
            <div className="mt-5">
              <Button href={wa} external>
                <WhatsAppGlyph />
                WhatsApp us
              </Button>
              <p className="text-data text-ink-700 mt-3 font-mono">+{site.whatsappNumber}</p>
            </div>
          ) : (
            <div className="rounded-paper border-line-300 bg-paper-1 mt-5 border border-dashed p-5">
              <p className="text-body text-ink-900">Our WhatsApp line is being set up.</p>
              <p className="text-body-sm text-ink-700 mt-1">
                In the meantime, the demo is the fastest way to see ShilaTeq — it needs no
                conversation at all.
              </p>
            </div>
          )}
          {site.contactEmail ? (
            <p className="text-body-sm text-ink-700 mt-6">
              Prefer email?{" "}
              <a href={`mailto:${site.contactEmail}`} className="prose-link">
                {site.contactEmail}
              </a>
            </p>
          ) : null}
        </section>

        {/* Fallback form */}
        <section aria-labelledby="form-h">
          <h2 id="form-h" className="font-display text-heading-1 text-ink-900 font-medium">
            Or send a message
          </h2>
          <div className="mt-5">
            <ContactFormLazy />
          </div>
        </section>
      </div>
    </div>
  );
}
