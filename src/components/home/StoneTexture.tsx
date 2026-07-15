/**
 * Procedural stone texture (Phase-3 02 §3, 06 §3.3): deterministic vector
 * material in the palette's stone range. Presented as MATERIAL, never as fake
 * photography. Zero client JS.
 *
 * PERFORMANCE (AMENDMENT A-007): the first implementation used feTurbulence,
 * which cost ~2s of style/layout on the throttled-mobile profile (filter
 * rasterization). Replaced with plain vector paint — layered tonal washes
 * (gradients as material tonality, sanctioned by Phase-3 02 §11), bedding
 * veins, and seeded mineral speckle. Same material language, ~free to paint.
 */

/** Deterministic LCG so every render of a seed is identical (no Math.random — build-stable). */
function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export function StoneTexture({ seed = 7, className }: { seed?: number; className?: string }) {
  const rand = seeded(seed);
  const speckles = Array.from({ length: 34 }, () => ({
    cx: Math.round(rand() * 400),
    cy: Math.round(rand() * 300),
    r: (0.6 + rand() * 1.6).toFixed(1),
    o: (0.12 + rand() * 0.2).toFixed(2),
    dark: rand() > 0.45,
  }));
  const veinY = [70 + rand() * 30, 150 + rand() * 30, 225 + rand() * 30].map(Math.round);
  const gid = `stone-wash-${seed}`;

  return (
    <svg
      className={className}
      aria-hidden="true"
      role="presentation"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 400 300"
    >
      <defs>
        <radialGradient id={gid} cx="30%" cy="25%" r="90%">
          <stop offset="0%" stopColor="var(--color-stone-sand)" />
          <stop offset="55%" stopColor="var(--color-stone-ochre)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-stone-clay)" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="var(--color-stone-sand)" />
      <rect width="400" height="300" fill={`url(#${gid})`} />
      {/* bedding veins — flat side elevation, engineering-drawing convention */}
      <g stroke="var(--color-stone-clay)" fill="none" opacity="0.35">
        {veinY.map((y, i) => (
          <path
            key={y}
            strokeWidth={0.8 - i * 0.15}
            d={`M0 ${y} Q ${90 + i * 30} ${y - 10 + i * 6} ${210 + i * 15} ${y + 6 - i * 4} T 400 ${y - 4 + i * 3}`}
          />
        ))}
      </g>
      {/* seeded mineral speckle */}
      <g>
        {speckles.map((s, i) => (
          <circle
            key={i}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            opacity={s.o}
            fill={s.dark ? "var(--color-stone-clay)" : "var(--color-paper-2)"}
          />
        ))}
      </g>
    </svg>
  );
}
