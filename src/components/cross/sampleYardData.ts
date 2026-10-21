/**
 * The sample yard's one fictional block, SY-B0021, shared by the interactive section and its
 * no-JS fallback. Every statement maps to StoneX behaviour verified in the product's code
 * (Phase 0 audit); codes follow StoneX's own formats (block -B0001, slab -S01, remnant -R,
 * quote QT-001, order ORD-001, dispatch -DN0001). The yard, buyer, prices and sizes are
 * fictional.
 */

export const BLOCK = "SY-B0021";

export type Capture = { device: "Phone" | "Desktop"; title: string; shows: string };
export type YardStep = {
  title: string;
  status: string;
  copy: string;
  captures: [Capture, Capture];
};

export const YARD_STEPS: YardStep[] = [
  {
    title: "Arrives. Gets its tag.",
    status: "In the yard · available",
    copy: `${BLOCK} is added from a phone: the stone, its size and grade, and its place in the yard. It takes the next code in the yard’s series and gets its own QR tag. When a worker adds it, the entry waits for the office to confirm.`,
    captures: [
      {
        device: "Phone",
        title: "Adding the block",
        shows: `StoneX’s add-stock screen with ${BLOCK}’s details and photo.`,
      },
      {
        device: "Phone",
        title: "What a scan shows",
        shows: `StoneX’s public card after someone scans ${BLOCK}’s QR tag.`,
      },
    ],
  },
  {
    title: "Cut at the saw.",
    status: "Cut · 6 slabs + 1 remnant",
    copy: "The office sends the block to a cutter, and the cut is recorded on a phone. Six slabs come off it, each carrying the block’s code and a share of its cost. This was a part cut, so the piece that is left stays on record as a block of its own.",
    captures: [
      {
        device: "Phone",
        title: "Recording the cut",
        shows: "StoneX’s cutting screen as the worker records six slabs.",
      },
      {
        device: "Desktop",
        title: "The block’s slabs",
        shows: "StoneX’s block page listing S01–S06 by bundle, with who cut them.",
      },
    ],
  },
  {
    title: "On show in the Online Showroom.",
    status: "On show · 1 enquiry",
    copy: `With the Online Showroom switched on, ${BLOCK} appears in the yard’s public catalogue. The Online Showroom is part of StoneX, built from the same stock records. The yard decides, stone by stone, whether buyers see the price. A buyer’s enquiry lands in the yard’s Leads.`,
    captures: [
      {
        device: "Phone",
        title: "The buyer’s view",
        shows: "The yard’s Online Showroom page for this stone, with and without the price.",
      },
      {
        device: "Desktop",
        title: "The enquiry arrives",
        shows: `StoneX’s Leads inbox with the buyer’s request for ${BLOCK}.`,
      },
    ],
  },
  {
    title: "Promised to a buyer.",
    status: "Reserved · S01–S04",
    copy: "The buyer accepts quote QT-018. Turning it into order ORD-014 reserves exactly S01 to S04, so no one else can sell them. A part-payment is recorded, and only then can the order move on.",
    captures: [
      {
        device: "Desktop",
        title: "Quote becomes order",
        shows: "Quotation QT-018 converted to order ORD-014.",
      },
      {
        device: "Desktop",
        title: "Reserved and part-paid",
        shows: "Order ORD-014 with S01–S04 reserved and a part-payment recorded.",
      },
    ],
  },
  {
    title: "Delivered and sold.",
    status: "Delivered · sold",
    copy: "Nothing is dispatched until a payment is recorded. Dispatch SY-DN0007 leaves with the four slabs. The buyer follows it from a link, and the driver updates it from theirs. When every slab is delivered, the order is marked sold.",
    captures: [
      {
        device: "Desktop",
        title: "The dispatch",
        shows: "Dispatch SY-DN0007 for ORD-014 in StoneX.",
      },
      {
        device: "Phone",
        title: "The buyer’s tracking link",
        shows: "StoneX’s public tracking page: packed, dispatched, in transit, delivered.",
      },
    ],
  },
];
