import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import "./cross.css";

/**
 * Root layout for the Cross-Section prototype (hero + section 2 only, for review).
 * Its own route group and root layout, so it never shares CSS or fonts with the
 * KERF or legacy routes. Not linked from anywhere and not indexed.
 */

// Display voice: Archivo's width axis, set expanded in CSS. next/font can only
// serve the full variable file (~88 KB latin) when an axis is requested; a
// production build would pin one expanded instance (~14 KB) with next/font/local.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

// Text voice: Geist, the typeface of the ShilaTeq wordmark and print collateral.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

// Codes, sizes, zones.
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  themeColor: "#111715",
};

export const metadata: Metadata = {
  title: "Cross-Section prototype — ShilaTeq",
  description: "Throwaway visual prototype for review. Fictional sample data.",
  robots: { index: false, follow: false },
};

export default function CrossLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // The inline script strips `no-js` before hydration (progressive enhancement).
      suppressHydrationWarning
      className={`${archivo.variable} ${geist.variable} ${geistMono.variable} no-js`}
    >
      <body>
        <script
          dangerouslySetInnerHTML={{
            // Comparison only: ?hero=daylight | sandstone picks a light hero variant.
            __html:
              "var d=document.documentElement;d.classList.remove('no-js');" +
              "var h=new URLSearchParams(location.search).get('hero');if(h)d.dataset.hero=h;" +
              // Page transitions (cross.css): the two edges of the red cut, only while one runs.
              "addEventListener('pagereveal',function(e){var t=e.viewTransition;if(!t)return;" +
              "var c=['a','b'].map(function(s){var l=document.createElement('div');" +
              "l.className='x-vtcut x-vtcut--'+s;l.setAttribute('aria-hidden','true');document.body.append(l);return l});" +
              "t.finished.finally(function(){c.forEach(function(l){l.remove()})})})",
          }}
        />
        <a href="#main" className="x-skip">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
