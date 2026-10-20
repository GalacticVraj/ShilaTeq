import { tornClipPath } from "./torn";

/**
 * A page from a stone yard's paper stock register — fictional, handwritten
 * sample entries. An ARIA table laid out with CSS grid (cheaper than HTML table
 * layout) so it stays readable, translatable and accessible; the WebGL paper is
 * painted from this exact layout. The marked entries are the trade's everyday
 * losses, read straight off the page.
 */

type Row = {
  no: string;
  date: string;
  block: string;
  stone: string;
  size: string;
  party: string;
  note?: string;
  mark?: "date" | "block" | "party";
  hero?: boolean;
};

const ROWS: Row[] = [
  {
    no: "31",
    date: "02/01",
    block: "1139",
    stone: "Makrana white",
    size: "9×4×5",
    party: "",
    note: "still here?",
    mark: "date",
  },
  {
    no: "32",
    date: "14/02",
    block: "1143",
    stone: "Udaipur green",
    size: "8×4×4",
    party: "Sharma ji ✓",
  },
  {
    no: "33",
    date: "28/06",
    block: "1147",
    stone: "Makrana white",
    size: "9×4×5",
    party: "",
    hero: true,
  },
  {
    no: "34",
    date: "05/07",
    block: "1149",
    stone: "Lakha red",
    size: "9×5×4",
    party: "Mehta 5/7",
    mark: "block",
  },
  {
    no: "35",
    date: "12/07",
    block: "1149",
    stone: "Lakha red",
    size: "”",
    party: "Joshi",
    note: "2 buyers?",
    mark: "block",
  },
  {
    no: "36",
    date: "03/08",
    block: "1152",
    stone: "Jaisalmer yel.",
    size: "7×4×4",
    party: "Row 6?",
    note: "where?",
    mark: "party",
  },
  {
    no: "37",
    date: "19/08",
    block: "1156",
    stone: "Kota blue",
    size: "8×4×3",
    party: "Gupta udhaar",
    note: "limit?",
    mark: "party",
  },
];

const BLANK_ROWS = 3;

function Mark({ children }: { children: React.ReactNode }) {
  return (
    <span className="ledger-mark">
      {children}
      <svg data-ink-svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M9 23C5 10 38 3 68 5c27 2 31 25 6 31-27 6-61 4-66-9-3-9 11-16 26-17"
          fill="none"
          stroke="#b2461e"
          strokeWidth="1.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

export function Ledger() {
  return (
    <div
      data-ledger=""
      className="ledger relative aspect-[4/5] overflow-hidden"
      style={{ clipPath: tornClipPath }}
    >
      <div className="flex items-end justify-between px-[4cqi] pt-[6cqi] pb-[2.4cqi]">
        <span className="ledger-printed">Stock register</span>
        <span className="ledger-printed">
          Page{" "}
          <span className="font-hand text-[length:var(--hand)] tracking-normal normal-case">
            84
          </span>
        </span>
      </div>
      <div
        role="table"
        aria-label="A sample page from a stone yard's paper stock register. Fictional entries."
      >
        <div role="row" className="ledger-row ledger-head ledger-printed">
          <span role="columnheader" className="col-opt ledger-no">
            No.
          </span>
          <span role="columnheader">Date</span>
          <span role="columnheader">Block</span>
          <span role="columnheader">Stone</span>
          <span role="columnheader" className="col-opt">
            Size (ft)
          </span>
          <span role="columnheader">Party / remarks</span>
        </div>
        {ROWS.map((r) => {
          const ink = (v: string) =>
            r.hero ? (
              <span className="ink-lift" data-skip-texture="">
                {v}
              </span>
            ) : (
              v
            );
          return (
            <div
              key={r.no}
              role="row"
              className="ledger-row"
              {...(r.hero ? { "data-hero-row": "" } : {})}
            >
              <span role="cell" className="col-opt ledger-no">
                {ink(r.no)}
              </span>
              <span role="cell">{r.mark === "date" ? <Mark>{r.date}</Mark> : ink(r.date)}</span>
              <span role="cell">{r.mark === "block" ? <Mark>{r.block}</Mark> : ink(r.block)}</span>
              <span role="cell">{ink(r.stone)}</span>
              <span role="cell" className="col-opt">
                {ink(r.size)}
              </span>
              <span role="cell">
                {r.mark === "party" ? <Mark>{r.party}</Mark> : ink(r.party)}
                {r.note ? <span className="ledger-note">&nbsp;← {r.note}</span> : null}
              </span>
            </div>
          );
        })}
      </div>
      {/* Ruled but empty lines: decoration, outside the table semantics */}
      <div aria-hidden="true">
        {Array.from({ length: BLANK_ROWS }, (_, i) => (
          <div key={i} className="ledger-row">
            <span className="col-opt ledger-no" />
            <span />
            <span />
            <span />
            <span className="col-opt" />
            <span />
          </div>
        ))}
      </div>
    </div>
  );
}
