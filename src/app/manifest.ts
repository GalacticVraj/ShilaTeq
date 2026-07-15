import type { MetadataRoute } from "next";

/**
 * Web app manifest (M7): installability + rich home-screen presence, in the
 * warm-stone palette. Icons reference the app icon routes.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ShilaTeq — the operating system for stone yards",
    short_name: "ShilaTeq",
    description:
      "Run your whole stone yard from one phone — every block, every rupee, every worker, every customer.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf8f2",
    theme_color: "#262016",
    lang: "en",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
