import { ImageResponse } from "next/og";

/**
 * Apple touch icon (M7): the QR-corner mark on ink, generated at build.
 * Apple requires a raster; ImageResponse produces a crisp 180×180 PNG.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#262016",
        borderRadius: 40,
      }}
    >
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 96,
          fontWeight: 700,
          color: "#fbf8f2",
        }}
      >
        ▚
      </div>
    </div>,
    size,
  );
}
