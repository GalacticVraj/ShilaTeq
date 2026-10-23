import { stoneMeanLin } from "@/vendor/stonex-vision/lib/vision/lighting.js";

/** The live demo's rooms: free Unsplash photos (Unsplash License), not anyone's real enquiry. */
export const DEMO_ROOMS = [
  {
    id: "bright",
    src: "/vision-demo/room-bright.jpg",
    label: "Bright room",
    credit: "Lisa Anna / Unsplash",
  },
  {
    id: "hall",
    src: "/vision-demo/room-hall.jpg",
    label: "Open hall",
    credit: "Salvo Media / Unsplash",
  },
] as const;

/**
 * The live demo's stones, as StoneX hands StoneVision a slab (a VisionStone): one demo slab each,
 * from the site's own slab photos. Sizes follow each photo's shape (the engine never stretches one).
 */
export const DEMO_STONES = [
  {
    slabId: "demo-statuarietto-s01",
    slabCode: "DEMO-B01-S01",
    slabNo: 1,
    blockId: "demo-b01",
    blockCode: "DEMO-B01",
    name: "Statuarietto",
    type: "Marble",
    colour: "White",
    lengthFt: 9.5,
    widthFt: 5.3,
    thicknessIn: 0.75,
    finish: "Polished",
    grade: null,
    availability: "available",
    twinUrl: "/stone/statuarietto-slab.jpg",
    thumbUrl: "/stone/statuarietto-slab.jpg",
    twinConfidence: null,
    twinId: null,
    twinSize: [1240, 2214],
    source: "demo",
    isLot: false,
  },
  {
    slabId: "demo-azul-s01",
    slabCode: "DEMO-B02-S01",
    slabNo: 1,
    blockId: "demo-b02",
    blockCode: "DEMO-B02",
    name: "Azul Macaubas",
    type: "Quartzite",
    colour: "Blue",
    lengthFt: 7.5,
    widthFt: 6,
    thicknessIn: 0.75,
    finish: "Polished",
    grade: null,
    availability: "available",
    twinUrl: "/stone/azul-macaubas.jpg",
    thumbUrl: "/stone/azul-macaubas.jpg",
    twinConfidence: null,
    twinId: null,
    twinSize: [2048, 1639],
    source: "demo",
    isLot: false,
  },
] as const;
export type DemoStone = (typeof DEMO_STONES)[number];

/**
 * StoneX's loadStoneImage (src/lib/vision/stones.js, eb9a0d8), verbatim but for types: decode a
 * slab photo for the GPU and measure its mean linear luminance for the exposure match.
 */
export async function loadStoneImage(url: string, { maxSide = 4096 } = {}) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.decoding = "async";
  img.src = url;
  await img.decode();
  const w = img.naturalWidth,
    h = img.naturalHeight;
  if (!(w > 0 && h > 0)) throw new Error("STONE_IMAGE_EMPTY");
  const k = Math.min(1, maxSide / Math.max(w, h)); // only to fit the GPU; the shape is kept
  const bitmap = await createImageBitmap(
    img,
    k < 1
      ? { resizeWidth: Math.round(w * k), resizeHeight: Math.round(h * k), resizeQuality: "high" }
      : undefined,
  );
  const probe = document.createElement("canvas");
  const ps = Math.min(1, 96 / Math.max(w, h));
  probe.width = Math.max(1, Math.round(w * ps));
  probe.height = Math.max(1, Math.round(h * ps));
  const ctx = probe.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, probe.width, probe.height);
  const meanLin = stoneMeanLin(ctx.getImageData(0, 0, probe.width, probe.height), 1);
  return {
    bitmap,
    width: bitmap.width,
    height: bitmap.height,
    naturalWidth: w,
    naturalHeight: h,
    resampled: k < 1,
    meanLin,
  };
}

/** A small copy of a public image, through Next's image optimiser (its default sizes; quality 75). */
export const thumb = (src: string, w: 128 | 256 | 384) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;

/** Own-photo tries a visitor gets in the demo (counted in this browser only: a teaser, not a lock). */
export const OWN_PHOTO_TRIES = 2;
const KEY = "sv-own-photos";
export const ownPhotosUsed = () => {
  try {
    return Number(localStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
};
export const countOwnPhoto = () => {
  try {
    localStorage.setItem(KEY, String(ownPhotosUsed() + 1));
  } catch {
    /* private mode: not counted */
  }
};
