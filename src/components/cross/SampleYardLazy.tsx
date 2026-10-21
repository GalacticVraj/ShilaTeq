"use client";

import { lazy, Suspense } from "react";

/**
 * Section 3's interactive island hydrates only when the section nears the viewport, so the
 * hero and section 2 don't pay for `motion` and the sample-yard code on first load. The
 * server still renders the full HTML; until then the first step is readable, just not yet
 * interactive. (React keeps server HTML in place while a lazy boundary waits to hydrate.)
 */
function whenNear(id: string) {
  return new Promise<void>((resolve) => {
    const el = document.getElementById(id);
    if (!el || !("IntersectionObserver" in window)) return resolve();
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          resolve();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
  });
}

const Island = lazy(async () => {
  if (typeof window !== "undefined") await whenNear("sample-yard");
  const m = await import("./SampleYard");
  return { default: m.SampleYard };
});

export function SampleYardLazy({ qr }: { qr: string }) {
  return (
    <Suspense fallback={null}>
      <Island qr={qr} />
    </Suspense>
  );
}
