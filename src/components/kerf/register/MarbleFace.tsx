/**
 * The block face: a static, art-directed vector rendering of a sawn
 * Makrana-white face (clouding, flowing veins, faint gangsaw striations).
 * Server-rendered, no filters, no JS, no WebGL — cheap to paint and present from
 * the first frame. It is a material rendering, never presented as a photograph;
 * real stone photography replaces it when supplied.
 *
 * Each vein is drawn twice — a wide, faint stroke and a fine one — which reads
 * as a soft-edged vein without an SVG blur filter.
 */

// Kinked, branching veins; a fading stroke gradient tapers both ends.
const VEINS: Array<[d: string, width: number, opacity: number]> = [
  [
    "M-30 160C40 150 90 190 150 178S250 140 300 196C330 230 380 214 430 250S520 300 575 292C640 282 700 330 760 338S880 352 1030 318",
    1.6,
    0.6,
  ],
  ["M300 196C318 236 300 268 334 300S392 352 386 392C382 430 420 470 470 486", 0.9, 0.5],
  [
    "M60 540C120 520 170 548 228 536S330 506 380 546C420 578 470 566 530 590S640 640 720 612C790 590 860 640 1030 676",
    1.3,
    0.55,
  ],
  ["M540 -20C548 40 590 70 600 120S650 190 690 214C730 238 760 280 820 300", 0.8, 0.45],
  ["M-20 806C70 790 120 820 190 804S300 772 360 796C430 822 520 780 600 806", 1, 0.45],
  ["M180 -20C200 60 170 120 214 180S250 280 236 330", 0.5, 0.4],
  ["M900 400C880 450 912 500 888 556S910 650 892 700C880 760 905 820 890 920", 0.6, 0.4],
  ["M430 640C470 668 520 662 556 700S620 742 668 744", 0.5, 0.4],
  ["M720 612C740 650 790 660 806 704", 0.5, 0.35],
];

export function MarbleFace({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="mf-light" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3f0ea" />
          <stop offset="1" stopColor="#dcd7cd" />
        </linearGradient>
        <radialGradient id="mf-cloud">
          <stop offset="0" stopColor="#cdc7bb" stopOpacity="0.42" />
          <stop offset="1" stopColor="#cdc7bb" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mf-vein">
          <stop offset="0" stopColor="#85867f" stopOpacity="0" />
          <stop offset="0.22" stopColor="#85867f" />
          <stop offset="0.78" stopColor="#85867f" />
          <stop offset="1" stopColor="#85867f" stopOpacity="0" />
        </linearGradient>
        <pattern id="mf-saw" width="8" height="5" patternUnits="userSpaceOnUse">
          <path d="M0 4.5h8" stroke="#000" strokeOpacity="0.03" />
        </pattern>
      </defs>
      <rect width="1000" height="900" fill="url(#mf-light)" />
      <ellipse cx="760" cy="220" rx="380" ry="200" fill="url(#mf-cloud)" />
      <ellipse cx="220" cy="700" rx="420" ry="230" fill="url(#mf-cloud)" />
      <ellipse cx="520" cy="470" rx="300" ry="140" fill="url(#mf-cloud)" opacity="0.6" />
      <g fill="none" stroke="url(#mf-vein)" strokeLinecap="round" strokeLinejoin="round">
        {VEINS.map(([d, w, o]) => (
          <g key={d}>
            <path d={d} strokeWidth={w * 7} strokeOpacity={o * 0.12} />
            <path d={d} strokeWidth={w} strokeOpacity={o} />
          </g>
        ))}
      </g>
      <rect width="1000" height="900" fill="url(#mf-saw)" />
    </svg>
  );
}
