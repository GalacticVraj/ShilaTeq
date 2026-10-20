/**
 * The fictional sample yard used by the homepage register, the simulated
 * StoneX preview and the /b/[code] QR targets. Every value here is SAMPLE
 * data and must be labelled as such wherever it renders.
 *
 * Field set mirrors the documented public QR block card (06_Screens_and_Pages
 * §QR Block Card): code, variety/type, status, size, quantity, grade, finish,
 * zone-level location, age in yard. Ageing bands use the documented default
 * thresholds of 90 / 180 days (02_Features).
 */

export const SAMPLE_YARD = "Sample Yard, Kishangarh";

export type BlockStatus = "Available" | "Reserved" | "Sold";

export type SampleBlock = {
  code: string;
  stone: string;
  type: "Marble" | "Granite" | "Limestone";
  grade: string;
  size: string;
  finish: string;
  zone: string;
  ageDays: number;
  status: BlockStatus;
  /** Admin-only field (never on the public card). */
  costBasis: string;
};

export const sampleBlocks: SampleBlock[] = [
  {
    code: "KSH-B0001",
    stone: "Makrana White",
    type: "Marble",
    grade: "A",
    size: "9 × 4 × 5 ft",
    finish: "Raw block",
    zone: "Zone B",
    ageDays: 112,
    status: "Available",
    costBasis: "₹40,000",
  },
  {
    code: "KSH-B0007",
    stone: "Udaipur Green",
    type: "Marble",
    grade: "A",
    size: "8 × 4 × 4 ft",
    finish: "Raw block",
    zone: "Zone A",
    ageDays: 41,
    status: "Available",
    costBasis: "₹31,500",
  },
  {
    code: "KSH-B0012",
    stone: "Jaisalmer Yellow",
    type: "Limestone",
    grade: "B",
    size: "7 × 4 × 4 ft",
    finish: "Raw block",
    zone: "Zone C",
    ageDays: 203,
    status: "Available",
    costBasis: "₹18,200",
  },
  {
    code: "KSH-B0019",
    stone: "Lakha Red",
    type: "Granite",
    grade: "A",
    size: "9 × 5 × 4 ft",
    finish: "Raw block",
    zone: "Zone A",
    ageDays: 12,
    status: "Reserved",
    costBasis: "₹52,800",
  },
  {
    code: "KSH-B0023",
    stone: "Kota Blue",
    type: "Limestone",
    grade: "A",
    size: "8 × 4 × 3 ft",
    finish: "Raw block",
    zone: "Zone C",
    ageDays: 96,
    status: "Available",
    costBasis: "₹14,600",
  },
  {
    code: "KSH-B0031",
    stone: "Makrana Albeta",
    type: "Marble",
    grade: "B",
    size: "8 × 4 × 4 ft",
    finish: "Raw block",
    zone: "Zone B",
    ageDays: 187,
    status: "Available",
    costBasis: "₹33,900",
  },
];

export const HERO_BLOCK = sampleBlocks[0];

export type AgeBand = "fresh" | "amber" | "red";

export function ageBand(days: number): AgeBand {
  if (days >= 180) return "red";
  if (days >= 90) return "amber";
  return "fresh";
}

export function blockPath(code: string) {
  return `/b/${code.toLowerCase()}`;
}

export function findBlock(slug: string) {
  return sampleBlocks.find((b) => b.code.toLowerCase() === slug.toLowerCase());
}
