"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A real, scannable QR for a path on THIS deployment (localhost, preview or
 * production alike), so it always resolves to a page that exists. Generated in
 * the browser only once it is near the viewport; the encoder is a lazy chunk.
 * Never baked into imagery.
 */
export function LiveQr({
  path,
  label,
  className,
  enabled = true,
}: {
  path: string;
  label: string;
  className?: string;
  enabled?: boolean;
}) {
  const [svg, setSvg] = useState<string | null>(null);
  const [near, setNear] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), {
      rootMargin: "200px",
    });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!enabled || !near) return;
    let cancelled = false;
    import("qrcode")
      .then(({ default: QR }) =>
        QR.toString(new URL(path, window.location.origin).href, {
          type: "svg",
          margin: 0,
          errorCorrectionLevel: "M",
          color: { dark: "#121311", light: "#ffffff" },
        }),
      )
      .then((s) => {
        if (!cancelled) setSvg(s);
      })
      .catch(() => {
        /* no QR is better than a broken one */
      });
    return () => {
      cancelled = true;
    };
  }, [path, enabled, near]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className={className}
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
}
