/**
 * Legal content (phase-4/04 §13; M6). Honest, plain-language DRAFTS grounded
 * in what the site and product actually do (Phase-1 facts). NOTHING here is
 * fabricated legal text: every clause that needs a lawyer's or the founder's
 * input carries an inline review marker (a blockquote), and each doc is banner-
 * flagged as a draft pending review. Rendered through the shared DocContent
 * pipeline. `updated` is the honest authoring date.
 *
 * Unfinished-section convention in bodies: a blockquote beginning "**Being finalised**".
 * Never fill one with an invented company name, address, GSTIN or registration.
 */

export type LegalDoc = {
  slug: string;
  title: string;
  description: string;
  updated: string;
  /** Count of review markers — surfaced honestly on the page. */
  reviewMarkers: number;
  body: string;
};

const AUTHORED = "2026-07-15";

const ENTITY_NOTE =
  "> **Being finalised** — The company's legal name, registered address and governing law are being finalised with our lawyer and will be added here.";

export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    description:
      "What information ShilaTeq collects, how it's used, and your choices — in plain language. A draft pending legal review.",
    updated: AUTHORED,
    reviewMarkers: 4,
    body: `${ENTITY_NOTE}

This policy explains, in plain language, what information we handle when you use this website and the ShilaTeq product, and the choices you have. We've written it to be read, not to hide behind jargon.

## Who this covers

Two different things are described here, and they collect very different amounts of information:

- **This website** (the pages you're reading) — marketing and informational.
- **The ShilaTeq product** — the software a stone yard uses to run its business.

## Information this website handles

We keep the website deliberately light. As it stands today:

- **No advertising cookies** are set.
- **Analytics only if you agree.** If analytics is switched on, a notice asks first. Only if you choose "Allow" does PostHog (an analytics service, hosted in the EU by default) receive page visits and a random ID kept in your browser. "No thanks" sends nothing. Vercel, which hosts the site, counts visits without cookies and without identifying you.
- **The demo** runs in your browser with sample data; it does not require an account or personal details.
- **When you contact us**, you choose what to send. If you use the WhatsApp option, your message and phone number go to us through WhatsApp under WhatsApp's own terms and privacy policy. If you use the contact form, it composes a message you send yourself — this site does not run a server that stores form submissions.

> **Being finalised** — The full list of service providers, with where each stores data, is being finalised and will be added here.

## Information the product handles

When a stone yard uses ShilaTeq, the yard (not us as a visitor-facing site) is the party deciding what business data goes in — stock, orders, customers, workers, payments. That data lives in a managed cloud backend and is **isolated per yard** at the database level, so one yard's data is not accessible to another. Sensitive operations run on protected server functions. Data can be exported by the yard at any time. Questions about a yard's records about you go to that yard; we help it answer.

About the people who sign in to the app (owners, office staff, workers), ShilaTeq itself records the sign-in time, IP address and device, kept for 1 year to keep accounts safe, and which screens are used, per person, kept for 13 months to improve the app.

> **Being finalised** — The agreement between each yard and ShilaTeq (how we process the yard's records, where they are stored, and for how long) is being finalised with our lawyer under India's Digital Personal Data Protection Act.

## How we use information

To reply to you, to run and improve the product for the yards that use it, and to meet legal obligations. We do not sell personal information.

## Your choices and rights

You can contact us to ask what we hold about you, to correct it, or to request deletion, subject to applicable law and any records we must keep (for example, tax invoices). We aim to reply within 30 days.

> **Being finalised** — The name and contact details of our grievance officer, and the full list of your rights and our response times, are being finalised and will be added here.

## Contact

Questions about this policy: reach us through the [contact page](/contact).

_Last updated: authoring date shown below. This is a working draft pending legal review before production use._`,
  },

  {
    slug: "terms",
    title: "Terms of Service",
    description:
      "The terms for using this website and the ShilaTeq demo — in plain language. A draft pending legal review.",
    updated: AUTHORED,
    reviewMarkers: 3,
    body: `${ENTITY_NOTE}

These terms cover your use of this website and the interactive demo. Use of the ShilaTeq product under a subscription is governed by a separate agreement.

## Using this website

You're welcome to read, explore the demo, and share our pages. Please don't misuse the site — no attempting to break, overload, or gain unauthorised access to it, and no scraping for competing commercial use.

## The demo

The demo runs on sample data and is provided so you can evaluate the product. It may change or be unavailable at times. Nothing you do in the demo affects a real yard.

## Information, not advice

Our guides and other content are general information about running a stone business — not legal, tax, financial, or professional advice. See the [disclaimer](/legal/disclaimer). Confirm anything important with a qualified professional.

## Roadmap statements

Where we describe features as "on the roadmap," we mean planned direction, not a commitment or a guarantee of timing. We try to be honest about what exists today versus what's coming.

## Intellectual property

The site's content, design, and the ShilaTeq name are ours or our licensors'. You keep anything you own.

> **Being finalised** — Clauses on liability, warranties, termination and changes to these terms are being finalised with our lawyer.

## Governing law

> **Being finalised** — The governing law and how disputes are resolved are being finalised with our lawyer.

## Contact

Questions: see the [contact page](/contact).

_Last updated: authoring date shown below. This is a working draft pending legal review before production use._`,
  },

  {
    slug: "cookies",
    title: "Cookie Policy",
    description:
      "How this website uses cookies and similar storage — honestly. A draft pending review.",
    updated: AUTHORED,
    reviewMarkers: 1,
    body: `This policy explains how this website uses cookies and similar browser storage.

## Where we stand today

This website sets **no advertising cookies**. Most of the browser storage we use is strictly functional — for example, remembering how far you got in the guided demo so you can resume, your language choice, and your answer to the analytics question. This stays on your device and is not shared.

If analytics is switched on and you choose "Allow", PostHog keeps a random visitor ID in your browser's local storage so visits can be counted. If you choose "No thanks", nothing is stored for analytics except your answer.

## If this changes

If we add any other non-essential cookies, we will update this policy first and ask before anything non-essential is set.

> **Being finalised** — A table of each storage item, its purpose, provider and lifetime is being prepared and will be added here.

## Managing storage

You can clear or block cookies and site storage in your browser settings at any time. Clearing it also clears your analytics answer, so the question appears again. Functional storage being unavailable simply means conveniences like demo-resume won't persist.

_Last updated: authoring date shown below. This is a working draft pending review before production use._`,
  },

  {
    slug: "disclaimer",
    title: "Disclaimer",
    description: "The limits of the information on this website — stated plainly.",
    updated: AUTHORED,
    reviewMarkers: 1,
    body: `We publish guides and explainers to help stone-yard owners run their businesses better. Please read them with these limits in mind.

## General information only

Everything in our guides and pages is **general information**, not professional advice. In particular:

- Our writing on **GST and compliance** is a plain-language explainer, not tax or legal advice. Rates, thresholds, and rules change and depend on your specific situation. Confirm anything you'll rely on with your accountant or a qualified professional.
- Our writing on **pricing, credit, and business practice** describes approaches and the way the product works — not a guarantee of any financial outcome.

## No guaranteed outcomes

We deliberately avoid inventing figures. Where we describe benefits, we mean the mechanism, not a promised result — the actual effect varies by yard.

## Roadmap and availability

Features described as planned or "on the roadmap" are direction, not commitments. What exists today is what the product does today.

> **Being finalised** — This disclaimer is being reviewed with our lawyer alongside the Terms of Service.

_Last updated: authoring date shown below._`,
  },

  {
    slug: "refund",
    title: "Cancellation and Refund Policy",
    description:
      "Cancelling a ShilaTeq subscription and getting money back. A draft pending review.",
    updated: "2026-10-31",
    reviewMarkers: 2,
    body: `${ENTITY_NOTE}

## Cancelling

A yard owner can cancel the subscription at any time by writing to us through the [contact page](/contact). The subscription runs to the end of the period already paid.

## Your records

Cancelling does not delete a yard's records at once. The owner can still download a full copy of them.

## Mistaken payments

A payment charged by mistake (twice, or after cancelling) is refunded in full to the original payment method.

> **Being finalised** — Refunds for a part-used period, free-trial terms, how long records stay available after cancelling, and refund timelines are being finalised and will be added here.

_Last updated: authoring date shown below. This is a working draft pending legal review before production use._`,
  },
];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs.find((d) => d.slug === slug);
}
