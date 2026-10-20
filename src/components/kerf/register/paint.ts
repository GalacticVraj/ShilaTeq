import { TORN_EDGE } from "./torn";

/**
 * Rasterises the live HTML ledger into a canvas texture by measuring the DOM:
 * borders, hand-drawn SVG marks and every text run are redrawn at their exact
 * positions, so the WebGL sheet matches the HTML page it replaces. Anything
 * inside [data-skip-texture] (the entry that lifts off) is left out.
 */
export async function paintLedger(
  ledger: HTMLElement,
  rotated: HTMLElement,
  scale: number,
): Promise<HTMLCanvasElement> {
  await document.fonts.ready;

  // Measure the natural layout. Removing and restoring the rotation inside one
  // task means the browser never paints the unrotated state.
  const prev = rotated.style.transform;
  const prevTransition = rotated.style.transition;
  rotated.style.transition = "none";
  rotated.style.transform = "none";
  const base = ledger.getBoundingClientRect();
  const W = base.width;
  const H = base.height;
  const root = getComputedStyle(ledger);

  type Box = { x: number; y: number; w: number; h: number };
  const box = (r: DOMRect): Box => ({
    x: r.left - base.left,
    y: r.top - base.top,
    w: r.width,
    h: r.height,
  });
  const fills: Array<Box & { color: string }> = [];
  const svgs: Array<Box & { src: string }> = [];
  const texts: Array<{
    text: string;
    x: number;
    y: number;
    font: string;
    color: string;
    ls: string;
    stretch: string;
    clip: Box | null;
  }> = [];

  const skip = (el: Element) => el.closest("[data-skip-texture], .sr-only, caption") !== null;

  for (const el of [ledger, ...Array.from(ledger.querySelectorAll("*"))]) {
    if (skip(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    if (el instanceof SVGSVGElement) {
      if (el.hasAttribute("data-ink-svg")) {
        // Rasterise at texture resolution; non-scaling strokes need scaling by hand.
        const clone = el.cloneNode(true) as SVGSVGElement;
        clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        clone.setAttribute("width", String(r.width * scale));
        clone.setAttribute("height", String(r.height * scale));
        clone.querySelectorAll("[stroke-width]").forEach((p) => {
          p.setAttribute(
            "stroke-width",
            String(parseFloat(p.getAttribute("stroke-width")!) * scale),
          );
        });
        const markup = new XMLSerializer().serializeToString(clone);
        svgs.push({
          ...box(r),
          src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`,
        });
      }
      continue;
    }
    if (el instanceof SVGElement) continue;
    const b = box(r);
    const side = (name: "Top" | "Right" | "Bottom" | "Left") => {
      const w = parseFloat(cs.getPropertyValue(`border-${name.toLowerCase()}-width`));
      if (!w || cs.getPropertyValue(`border-${name.toLowerCase()}-style`) === "none") return;
      const color = cs.getPropertyValue(`border-${name.toLowerCase()}-color`);
      if (name === "Top") fills.push({ x: b.x, y: b.y, w: b.w, h: w, color });
      if (name === "Bottom") fills.push({ x: b.x, y: b.y + b.h - w, w: b.w, h: w, color });
      if (name === "Left") fills.push({ x: b.x, y: b.y, w, h: b.h, color });
      if (name === "Right") fills.push({ x: b.x + b.w - w, y: b.y, w, h: b.h, color });
    };
    side("Top");
    side("Right");
    side("Bottom");
    side("Left");
  }

  const walker = document.createTreeWalker(ledger, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n.textContent?.replace(/\s+/g, " ").trim();
    const parent = n.parentElement;
    if (!text || !parent || skip(parent)) continue;
    const cs = getComputedStyle(parent);
    if (cs.visibility === "hidden") continue;
    range.selectNodeContents(n);
    const r = range.getBoundingClientRect();
    if (!r.width) continue;
    const cell = parent.closest(".ledger-row > *");
    texts.push({
      text,
      x: r.left - base.left,
      y: r.top - base.top,
      font: `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`,
      color: cs.color,
      ls: cs.letterSpacing,
      stretch: cs.fontStretch,
      clip: cell ? box(cell.getBoundingClientRect()) : null,
    });
  }
  rotated.style.transform = prev;
  rotated.getBoundingClientRect(); // settle the restored transform before transitions return
  rotated.style.transition = prevTransition;

  const images = await Promise.all(
    svgs.map(async (s) => {
      const img = new Image();
      img.src = s.src;
      await img.decode();
      return { ...s, img };
    }),
  );

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(W * scale);
  canvas.height = Math.round(H * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  // Paper, clipped to the torn edge
  ctx.beginPath();
  TORN_EDGE.forEach(([x, y], i) =>
    (i ? ctx.lineTo : ctx.moveTo).call(ctx, (x / 100) * W, (y / 100) * H),
  );
  ctx.closePath();
  ctx.clip();
  const rx = W * 1.3;
  const ry = H;
  ctx.save();
  ctx.translate(W * 0.5, H * 0.38);
  ctx.scale(rx, ry);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  g.addColorStop(0.58, root.getPropertyValue("--color-paper").trim() || "#f7f2e4");
  g.addColorStop(1, root.getPropertyValue("--color-paper-shade").trim() || "#ebe0c6");
  ctx.fillStyle = g;
  ctx.fillRect((-0.5 * W) / rx, (-0.38 * H) / ry, W / rx, H / ry);
  ctx.restore();

  for (const f of fills) {
    ctx.fillStyle = f.color;
    ctx.fillRect(f.x, f.y, f.w, f.h);
  }
  for (const s of images) ctx.drawImage(s.img, s.x, s.y, s.w, s.h);

  const stretchKeyword = (v: string) => {
    const pct = parseFloat(v);
    if (pct <= 65) return "extra-condensed";
    if (pct <= 80) return "condensed";
    if (pct <= 92) return "semi-condensed";
    return "normal";
  };
  const c2 = ctx as CanvasRenderingContext2D & { letterSpacing?: string; fontStretch?: string };
  ctx.textBaseline = "alphabetic";
  for (const t of texts) {
    ctx.save();
    if (t.clip) {
      ctx.beginPath();
      ctx.rect(t.clip.x, t.clip.y, t.clip.w, t.clip.h);
      ctx.clip();
    }
    ctx.font = t.font;
    if ("fontStretch" in c2) c2.fontStretch = stretchKeyword(t.stretch);
    if ("letterSpacing" in c2) c2.letterSpacing = t.ls === "normal" ? "0px" : t.ls;
    ctx.fillStyle = t.color;
    const m = ctx.measureText(t.text);
    ctx.fillText(t.text, t.x, t.y + (m.fontBoundingBoxAscent || m.actualBoundingBoxAscent));
    ctx.restore();
  }
  return canvas;
}
