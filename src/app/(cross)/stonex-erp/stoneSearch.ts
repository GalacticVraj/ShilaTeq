// StoneX's own search, for the product page's live demo. parseQuery, wordScore and
// makeMatcher are StoneX's src/utils/inventorySearch.js line for line (typed); the
// stock is its fictional demo yard (src/contexts/MockDataContext.jsx, "Demo Stone
// Yard"), without suppliers or customer names. Whatever this page finds, StoneX
// finds on the same stock.

const num = (v: unknown) => Number(v) || 0;
const lc = (v: unknown) => String(v ?? "").toLowerCase().trim();

// Levenshtein distance (small inputs), for light typo tolerance.
function lev(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 0; i < a.length; i++) {
    const cur = [i + 1];
    for (let j = 0; j < b.length; j++) {
      cur[j + 1] = Math.min(prev[j + 1] + 1, cur[j] + 1, prev[j] + (a[i] === b[j] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

export const STATUS_WORDS = {
  available: "available for sale in stock",
  reserved: "reserved on order booked",
  processing: "processing on order",
  sold: "sold",
  cut: "cut into slabs",
  at_saw: "at the saw cutting",
} as const;
export type Status = keyof typeof STATUS_WORDS;

const zoneKey = (z: unknown) => lc(z).replace(/^zone\s*/, "");

export type Parsed = {
  words: string[];
  size: [number, number] | null;
  thicknessIn: number | null;
  min: number | null;
  max: number | null;
  kind: "slab" | "block" | null;
  zone: string | null;
  grade: string | null;
};

export function parseQuery(query = ""): Parsed {
  let q = ` ${lc(query)} `;
  const p: Parsed = { words: [], size: null, thicknessIn: null, min: null, max: null, kind: null, zone: null, grade: null };
  q = q.replace(/(?:^|\s)zone\s+([a-z0-9]{1,3})(?=\s)/g, (_, z) => { p.zone = z; return " "; });
  q = q.replace(/(?:^|\s)grade\s+([abc])(?=\s)/g, (_, g) => { p.grade = g; return " "; });
  q = q.replace(/(\d+(?:\.\d+)?)\s*(?:'|ft)?\s*(?:x|×|\*|by)\s*(\d+(?:\.\d+)?)\s*(?:'|ft|feet)?/g, (_, a, b) => { p.size = [Number(a), Number(b)]; return " "; });
  q = q.replace(/(\d+(?:\.\d+)?)\s*mm\b/g, (_, a) => { p.thicknessIn = Number(a) / 25.4; return " "; });
  q = q.replace(/(?:^|\s)(?:3\/4|¾)\s*(?:"|in|inch)?(?=\s)/g, () => { p.thicknessIn = 0.75; return " "; });
  q = q.replace(/(?:under|below|less than|upto|up to|<)\s*(?:rs\.?|₹)?\s*(\d+)/g, (_, a) => { p.max = Number(a); return " "; });
  q = q.replace(/(?:above|over|more than|>)\s*(?:rs\.?|₹)?\s*(\d+)/g, (_, a) => { p.min = Number(a); return " "; });
  q = q.replace(/(?:rs\.?|₹)?\s*(\d+)\s*(?:-|to)\s*(?:rs\.?|₹)?\s*(\d+)(?!\s*(?:x|×|mm))/g, (_, a, b) => { p.min = Number(a); p.max = Number(b); return " "; });
  q = q.replace(/(?:^|\s)(slabs?|blocks?|lots?)(?=\s)/g, (_, k: string) => { p.kind = k.startsWith("slab") || k.startsWith("lot") ? "slab" : "block"; return " "; });
  // a lone letter ("a") matches nearly everything — only a zone or a grade can use one
  p.words = q.split(/\s+/).filter((w) => w && (w.length > 1 || /\d/.test(w)) && !["the", "of", "with", "and", "in", "per", "sq", "ft", "rs", "₹"].includes(w));
  return p;
}

/** Does this word appear in the text — as it is, or (a name word) with one typo? 0 = no. */
function wordScore(w: string, hay: string, tokens: string[], strong: string) {
  if (hay.includes(w)) return strong.includes(w) ? 3 : 1;
  // typo tolerance for NAME words only — never codes (digits)
  if (w.length >= 4 && !/\d/.test(w) && tokens.some((t) => Math.abs(t.length - w.length) <= 1 && lev(t, w) <= 1)) return 0.5;
  return 0;
}

type Row = { kind: string; text: string; strong: string; zone: string; grade: string; length: number; width: number; thicknessIn: number; rate: number | null };

function makeMatcher(query: string) {
  const p = parseQuery(query);
  if (!p.words.length && !p.size && p.thicknessIn == null && p.min == null && p.max == null && !p.kind && !p.zone && !p.grade) return null;
  return (row: Row) => {
    if (p.kind && row.kind && row.kind !== p.kind) return 0;
    if (p.zone && zoneKey(row.zone) !== p.zone) return 0;
    if (p.grade && lc(row.grade) !== p.grade) return 0;
    let bonus = 0;
    if (p.size) {
      const L = num(row.length), W = num(row.width), [a, b] = p.size;
      const off = Math.min(Math.abs(L - a) + Math.abs(W - b), Math.abs(L - b) + Math.abs(W - a));
      if (!(off <= 0.6 && ((Math.abs(L - a) <= 0.3 && Math.abs(W - b) <= 0.3) || (Math.abs(L - b) <= 0.3 && Math.abs(W - a) <= 0.3)))) return 0;
      bonus += 2 - off; // the closest size first
    }
    if (p.thicknessIn != null && !(Math.abs(num(row.thicknessIn) - p.thicknessIn) < 0.04)) return 0;
    if (p.min != null && !(num(row.rate) >= p.min)) return 0;
    if (p.max != null && !(row.rate != null && num(row.rate) > 0 && num(row.rate) <= p.max)) return 0;
    const hay = lc(row.text);
    const strong = lc(row.strong);
    const tokens = hay.split(/[\s·,/()-]+/).filter(Boolean);
    let score = 1 + bonus;
    for (const w of p.words) {
      const s = wordScore(w, hay, tokens, strong);
      if (!s) return 0;
      score += s;
    }
    return score;
  };
}

// ---- The demo yard ----
export type Stone = {
  code: string; variety: string; type: string; c1: string; c2: string | null; vein: string;
  finish: string; grade: string; origin: string; zone: string;
  l: number; w: number; t: number; rate: number | null; status: Status;
};
const S = (code: string, variety: string, type: string, c1: string, c2: string | null, vein: string, finish: string,
  grade: string, origin: string, zone: string, l: number, w: number, t: number, rate: number | null, status: Status): Stone =>
  ({ code, variety, type, c1, c2, vein, finish, grade, origin, zone, l, w, t, rate, status });

export const STOCK: Stone[] = [
  S("KSH-B0001", "Italian Statuario", "Marble", "White", null, "Heavy", "Polished", "A", "Imported", "Zone A", 10.5, 5.2, 1.5, 850, "available"),
  S("KSH-B0002", "Makrana White", "Marble", "White", null, "Light", "Polished", "B", "Indian", "Zone B", 9, 4.5, 1.5, 220, "available"),
  S("KSH-B0003", "Black Galaxy", "Granite", "Black", null, "None", "Polished", "A", "Indian", "Zone C", 8, 4, 1.8, 320, "available"),
  S("KSH-B0004", "Kota Blue", "Limestone", "Grey", null, "None", "Honed", "A", "Indian", "Zone B", 7.5, 3.5, 1.2, 110, "available"),
  S("KSH-B0005", "Jodhpur Pink", "Sandstone", "Beige", null, "Light", "Natural", "A", "Indian", "Zone D", 8.5, 4, 1.5, 95, "at_saw"),
  S("KSH-B0006", "Emperador Dark", "Marble", "Brown", null, "Heavy", "Polished", "A", "Imported", "Zone A", 11, 5, 1.8, 1200, "reserved"),
  S("KSH-B0007", "Tiger Skin", "Granite", "Brown", "Gold", "Medium", "Polished", "B", "Indian", "Zone C", 9.5, 4.5, 2, 145, "processing"),
  S("KSH-B0008", "Indian Green", "Marble", "Green", null, "Medium", "Polished", "B", "Indian", "Zone D", 6.5, 3, 1.5, 180, "sold"),
  S("KSH-B0009", "Black Galaxy", "Granite", "Black", null, "None", "Polished", "A", "Indian", "Zone C", 10, 5, 1.8, 280, "sold"),
  S("KSH-B0010", "Jodhpur Pink", "Sandstone", "Beige", null, "Light", "Natural", "A", "Indian", "Zone D", 8, 4, 1.5, 80, "sold"),
  S("KSH-B0011", "Italian Statuario", "Marble", "White", null, "Heavy", "Polished", "A", "Imported", "Zone A", 9, 5, 1.5, 800, "sold"),
  S("KSH-B0012", "Banswara Green", "Marble", "Green", null, "Medium", "Block", "A", "Indian", "Zone A", 9, 5, 60, null, "cut"),
  S("KSH-B0021", "Calacatta Oro", "Marble", "White", "Gold", "Heavy", "Polished", "A", "Imported", "Zone A", 11, 5.4, 1.5, 920, "available"),
  S("KSH-B0022", "Statuario Venato", "Marble", "White", "Grey", "Heavy", "Polished", "A", "Imported", "Zone B", 10.2, 4.8, 1.5, 870, "available"),
  S("KSH-B0023", "Emperador Dark", "Marble", "Brown", "Cream", "Medium", "Polished", "A", "Imported", "Zone C", 9.4, 4.6, 1.5, 540, "available"),
  S("KSH-B0024", "Rosso Levanto", "Marble", "Red", "White", "Heavy", "Polished", "A", "Imported", "Zone D", 8.8, 4.2, 1.5, 610, "available"),
  S("KSH-B0025", "Travertine Classico", "Marble", "Beige", null, "Light", "Honed", "B", "Imported", "Zone A", 9.6, 5, 1.5, 280, "available"),
  S("KSH-B0026", "Black Galaxy", "Granite", "Black", "Gold", "None", "Polished", "A", "Indian", "Zone B", 8.5, 4.5, 1.5, 320, "available"),
  S("KSH-B0027", "Alaska White", "Granite", "White", "Grey", "Light", "Polished", "A", "Imported", "Zone C", 9, 4.8, 1.5, 360, "available"),
  S("KSH-B0028", "Tan Brown", "Granite", "Brown", "Black", "Light", "Polished", "B", "Indian", "Zone D", 8.2, 4, 1.5, 240, "available"),
  S("KSH-B0029", "Green Onyx", "Onyx", "Green", "White", "Heavy", "Polished", "A", "Imported", "Zone A", 7.6, 3.8, 1.5, 1450, "available"),
  S("KSH-B0030", "Banswara Pink", "Marble", "Pink", "White", "Medium", "Polished", "B", "Indian", "Zone B", 9.2, 4.6, 1.5, 190, "available"),
];

// StoneX's blockSearchRow, for these fields.
const rowOf = (s: Stone): Row => ({
  kind: "block",
  text: [s.code, s.variety, s.type, s.c1, s.c2, s.vein, s.finish, `grade ${s.grade}`, s.zone, s.origin, STATUS_WORDS[s.status]].filter(Boolean).join(" "),
  strong: `${s.code} ${s.variety}`,
  zone: s.zone, grade: s.grade, length: s.l, width: s.w, thicknessIn: s.t, rate: s.rate,
});
const tokensOf = (s: Stone) => lc(rowOf(s).text).split(/[\s·,/()-]+/).filter(Boolean);

/** How each typed word was read: as typed, a typo forgiven ("whte" → "white"), or found nowhere. */
export type Word = { typed: string; read?: string; miss?: boolean };

export function searchYard(query: string) {
  const parsed = parseQuery(query);
  const match = makeMatcher(query);
  const results = match
    ? STOCK.map((s) => ({ s, n: match(rowOf(s)) })).filter((x) => x.n > 0).sort((a, b) => b.n - a.n).map((x) => x.s)
    : STOCK;
  const words: Word[] = parsed.words.map((typed) => {
    const pool = results.length && match ? results : STOCK;
    if (pool.some((s) => lc(rowOf(s).text).includes(typed))) return { typed };
    const fix = pool.flatMap(tokensOf).find((t) => typed.length >= 4 && !/\d/.test(typed) && Math.abs(t.length - typed.length) <= 1 && lev(t, typed) <= 1);
    return fix ? { typed, read: fix } : { typed, miss: true };
  });
  return { parsed, words, results };
}

// Typed one after another in the demo; each finds real stock above (checked by a script).
export const EXAMPLES = [
  "whte marble zone a",
  "blak granite under 350",
  "calacata 11x5.4",
  "brwn polished above 500",
  "statuario for sale",
];
