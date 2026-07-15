/**
 * The guided demo's six steps (phase-4/04 §3, GTM demo script phase-2/03 §4).
 * Order is engineered for escalating recognition; step 4 (the Hindi, offline
 * cut) is the conversion moment (phase-4/02 F1 key event). Pure data — no fs,
 * client-importable. Content is grounded in the Phase-1 knowledge base.
 *
 * `deepPath` is appended to the product demo URL when it exists (Gate-zero).
 * Until then, every "do it" degrades to an honest pending state (A-004).
 */

export type DemoStep = {
  n: number;
  key: string;
  title: string;
  /** The pain this step speaks to. */
  pain: string;
  /** What you'll do in the live demo. */
  doThis: string;
  /** The aha — what you'll see happen. */
  youllSee: string;
  actionLabel: string;
  /** Appended to the demo app URL (illustrative until product confirms routes). */
  deepPath: string;
  /** Step-specific honesty note. */
  note?: string;
};

export const demoSteps: DemoStep[] = [
  {
    n: 1,
    key: "find-the-block",
    title: "Find a block — with a typo",
    pain: "A buyer's on the phone asking for white marble, roughly nine by four. The block is somewhere in a thousand others.",
    doThis:
      "Search for “makrana whi” — misspelt, half-typed, the way you'd really type it in a hurry.",
    youllSee:
      "The block surfaces in seconds. Names forgive a spelling slip; codes are matched exactly, so KSH-B0002 can never be mistaken for KSH-B0001.",
    actionLabel: "Find a block",
    deepPath: "/find",
  },
  {
    n: 2,
    key: "scan-the-qr",
    title: "Open a block's QR identity",
    pain: "Two near-identical white blocks. Which is the premium one and which is ordinary?",
    doThis:
      "Open a block's QR card — the same card you'd get by pointing a phone camera at the label on the stone.",
    youllSee:
      "Its whole record at once: variety, grade, size, age, and status. The chalk mark and the memory are retired.",
    actionLabel: "Open a QR card",
    deepPath: "/scan",
  },
  {
    n: 3,
    key: "receive-a-po",
    title: "Receive a purchase order",
    pain: "A truckload of new blocks has arrived. Tagging them one by one is an afternoon's work.",
    doThis: "Open a purchase order and tap Receive.",
    youllSee:
      "Every line fans out into a real inventory block — QR minted, cost basis attached, ready to quote — in a single tap. That's the afternoon, done.",
    actionLabel: "Receive a PO",
    deepPath: "/purchases",
  },
  {
    n: 4,
    key: "the-cut",
    title: "Log a cut — in Hindi, offline",
    pain: "The gangsaw is in a shed with no signal, run by a cutter who reads Hindi more easily than English.",
    doThis:
      "Switch to the worker app, put it in हिंदी, and log a cut: the area consumed and the slabs produced.",
    youllSee:
      "Recovery and wastage computed for you, the wastage priced into the surviving slabs, and a remnant block created from the leftover — with the sync indicator confirming the work is safe.",
    actionLabel: "Open the cut screen",
    deepPath: "/worker/find",
    note: "Simulating a true dead zone inside a browser demo is imperfect. The screen and the maths are real; the offline behaviour is best felt on the shop floor. If the demo can't drop your connection convincingly, know that in the yard, this works with no signal at all.",
  },
  {
    n: 5,
    key: "the-gate",
    title: "Try to move an unpaid order",
    pain: "A block once left the yard on a promise, and the promise became a bad debt.",
    doThis: "Take an order that hasn't been paid for, and try to dispatch it.",
    youllSee:
      "ShilaTeq refuses — “record a confirmed payment first.” Then record a payment and watch the gate open. Your own rule, made unbreakable.",
    actionLabel: "Try the payment gate",
    deepPath: "/orders",
  },
  {
    n: 6,
    key: "the-showroom",
    title: "See the public showroom",
    pain: "Your best stone sits in row six while buyers scroll past someone else's catalog.",
    doThis: "Open the public showroom — the same page a buyer would reach from a shared link.",
    youllSee:
      "Your available stone, browsable in 3D, with prices shown or “On request” — your call, block by block. A small yard, looking world-class online.",
    actionLabel: "See the showroom",
    deepPath: "/catalog",
  },
];

export const TOTAL_STEPS = demoSteps.length;

export function getStep(n: number): DemoStep | undefined {
  return demoSteps.find((s) => s.n === n);
}
