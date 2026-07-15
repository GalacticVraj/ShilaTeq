/**
 * Legal content (phase-4/04 §13; M6). Honest, plain-language DRAFTS grounded
 * in what the site and product actually do (Phase-1 facts). NOTHING here is
 * fabricated legal text: every clause that needs a lawyer's or the founder's
 * input carries an inline review marker (a blockquote), and each doc is banner-
 * flagged as a draft pending review. Rendered through the shared DocContent
 * pipeline. `updated` is the honest authoring date.
 *
 * Review-marker convention in bodies: a blockquote beginning "⚖️ **Review**".
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
  "> ⚖️ **Review** — The legal entity name, registered address, and jurisdiction below are pending and must be completed and reviewed by the company and its legal counsel before this policy is relied upon.";

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

- **No third-party advertising or tracking cookies** are set. (If we add privacy-respecting analytics in future, this policy will be updated first, and a cookie notice will appear.)
- **The demo** runs in your browser with sample data; it does not require an account or personal details.
- **When you contact us**, you choose what to send. If you use the WhatsApp option, your message and phone number go to us through WhatsApp under WhatsApp's own terms and privacy policy. If you use the contact form, it composes a message you send yourself — this site does not run a server that stores form submissions.

> ⚖️ **Review** — Confirm the above matches the deployed analytics/consent configuration at launch, and add the specific processor names and their roles once analytics and hosting are finalised.

## Information the product handles

When a stone yard uses ShilaTeq, the yard (not us as a visitor-facing site) is the party deciding what business data goes in — stock, orders, customers, workers, payments. That data lives in a managed cloud backend and is **isolated per yard** at the database level, so one yard's data is not accessible to another. Sensitive operations run on protected server functions. Data can be exported by the yard at any time.

> ⚖️ **Review** — The product privacy terms (controller/processor roles between the yard and ShilaTeq, sub-processors, storage location and retention, worker personal-data handling) require a full data-processing review under India's Digital Personal Data Protection Act and any other applicable law. Treat the paragraph above as an honest summary, not the operative terms.

## How we use information

To reply to you, to run and improve the product for the yards that use it, and to meet legal obligations. We do not sell personal information.

## Your choices and rights

You can contact us to ask what we hold about you, to correct it, or to request deletion, subject to applicable law and any records we must keep.

> ⚖️ **Review** — Enumerate the specific data-subject rights, response timelines, and the grievance/【DPDP consent-manager】mechanism required by applicable law.

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

> ⚖️ **Review** — Standard clauses that require legal drafting and review: limitation of liability, disclaimer of warranties for the informational site, indemnity, termination, and changes to terms.

## Governing law

> ⚖️ **Review** — Specify the governing law and jurisdiction (expected: India) and the dispute-resolution mechanism, to be confirmed by counsel.

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
    reviewMarkers: 2,
    body: `This policy explains how this website uses cookies and similar browser storage.

## Where we stand today

As it currently ships, this website sets **no advertising or third-party tracking cookies**. The small amount of browser storage we use is strictly functional — for example, remembering how far you got in the guided demo so you can resume, and your language choice. This stays on your device and is not shared.

## If this changes

If we add analytics or any non-essential cookies, we will update this policy first and show a consent notice where required, so you can make a choice before anything non-essential is set.

> ⚖️ **Review** — Once the analytics tooling and any embedded third-party content (e.g. maps on customer showrooms) are finalised, list each cookie/storage item, its purpose, provider, and lifetime, and confirm the consent mechanism meets applicable requirements.

## Managing storage

You can clear or block cookies and site storage in your browser settings at any time. Functional storage being unavailable simply means conveniences like demo-resume won't persist.

> ⚖️ **Review** — Confirm this reflects the deployed configuration at launch.

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

> ⚖️ **Review** — Confirm this disclaimer's scope with counsel, and align it with the limitation-of-liability clauses in the Terms of Service.

_Last updated: authoring date shown below._`,
  },
];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs.find((d) => d.slug === slug);
}
