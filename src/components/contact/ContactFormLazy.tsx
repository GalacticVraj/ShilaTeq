"use client";

import dynamic from "next/dynamic";

/**
 * Lazy-loads the RHF+Zod contact form off the critical path (A-013): the form
 * requires JS to function (validation + WhatsApp hand-off), so no-JS visitors
 * use the WhatsApp door instead — deferring the ~75KB form chunk costs them
 * nothing and keeps /contact's initial load at framework baseline. A shaped
 * skeleton holds the space (zero layout shift).
 */
const ContactForm = dynamic(
  () => import("@/components/contact/ContactForm").then((m) => m.ContactForm),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="rounded-paper border-line-100 bg-paper-2 shadow-desk border p-6 sm:p-8"
      >
        <div className="rounded-paper-sm bg-paper-1 h-64 animate-pulse" />
      </div>
    ),
  },
);

export function ContactFormLazy() {
  return <ContactForm />;
}
