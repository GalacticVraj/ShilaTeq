import QRCode from "qrcode";
import { StoneTexture } from "@/components/home/StoneTexture";
import { site } from "@/config/site";

/**
 * The followed block — the homepage's protagonist (phase-4/09 §18), same
 * texture seed everywhere (continuity law). Server component: the QR is
 * generated at build time (zero client JS).
 *
 * QR honesty (AMENDMENTS A-006 §5): encodes the real demo URL when the domain
 * gate resolves; until then, honest scannable text. Never a fake domain.
 */

export const BLOCK_CODE = "KSH-B0001";
export const BLOCK_SEED = 7;

async function qrSvg(): Promise<{ svg: string; scannableToUrl: boolean }> {
  const target = site.url ? `${site.url}/demo?src=qr` : `ShilaTeq — demo block ${BLOCK_CODE}`;
  const svg = await QRCode.toString(target, {
    type: "svg",
    margin: 0,
    color: { dark: "#262016", light: "#fffefa" },
    errorCorrectionLevel: "M",
  });
  return { svg, scannableToUrl: Boolean(site.url) };
}

export async function BlockQRLabel({ className }: { className?: string }) {
  const { svg } = await qrSvg();
  return (
    <div
      className={className}
      role="img"
      aria-label={`QR label for demo block ${BLOCK_CODE} — scannable`}
    >
      <div className="rounded-paper-sm border-ink-900 bg-paper-2 shadow-desk border p-2">
        <div
          className="size-16 sm:size-20 [&_svg]:size-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <p className="text-ink-700 mt-1 text-center font-mono text-[10px] leading-tight">
          ShilaTeq
        </p>
      </div>
    </div>
  );
}

/** The block face: flat frontal elevation, texture + ink frame (Phase-3 06 §3.3). */
export function BlockFace({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={
        "rounded-paper-sm border-ink-900 shadow-desk relative overflow-hidden border " +
        (className ?? "")
      }
    >
      <StoneTexture seed={BLOCK_SEED} className="absolute inset-0 size-full" />
      {children}
    </div>
  );
}
