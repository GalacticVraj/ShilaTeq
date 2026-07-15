"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/config/site";
import { cn } from "@/lib/cn";

/**
 * Global header (phase-4/01 §3, Phase-3 09 §6): quiet paper-on-paper; hairline
 * appears after 8px scroll; padding compacts one step after 200px; never hides.
 * Mobile: full-height drawer as a table of contents. No mega-menus.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setCompact(window.scrollY > 200);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on route change (adjust-state-during-render pattern).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "bg-paper-0 ease-standard sticky top-0 z-40 transition-[padding,border-color] duration-240",
        scrolled ? "border-line-100 border-b" : "border-b border-transparent",
      )}
    >
      <div
        className={cn(
          "ease-standard mx-auto flex max-w-6xl items-center justify-between px-4 transition-[padding] duration-240 sm:px-6",
          compact ? "py-2.5" : "py-4",
        )}
      >
        <Link
          href="/"
          className="font-display text-heading-2 text-ink-900 font-medium tracking-tight"
        >
          ShilaTeq
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "text-body text-ink-700 ease-standard hover:text-ink-900 relative py-1 transition-colors duration-180",
                isActive(item.href) &&
                  "text-ink-900 after:bg-accent-600 font-bold after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-5",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/demo"
            className="rounded-paper bg-ink-900 text-body text-paper-2 ease-standard px-4 py-2 font-bold transition-colors duration-180 hover:bg-black active:scale-[0.98] motion-reduce:active:scale-100"
          >
            Try the demo
          </Link>
        </nav>

        {/* Mobile trigger */}
        <button
          type="button"
          className="rounded-paper-sm text-ink-900 p-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg
            viewBox="0 0 24 24"
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile drawer — a table of contents, doors at the foot (Phase-3 09 §6) */}
      {open ? (
        <div
          id="mobile-drawer"
          className="border-line-100 bg-paper-0 fixed inset-x-0 top-[57px] bottom-0 z-40 flex flex-col overflow-y-auto border-t px-6 py-8 md:hidden"
        >
          <nav aria-label="Primary mobile" className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "border-line-100 text-heading-2 text-ink-900 border-b py-4 font-sans font-bold",
                  isActive(item.href) && "text-accent-700",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pt-8">
            <Link
              href="/demo"
              className="rounded-paper bg-ink-900 text-body text-paper-2 block px-6 py-3.5 text-center font-bold"
            >
              Try the full demo
            </Link>
            <p className="text-label text-ink-500 mt-3 text-center font-mono">
              no signup · nothing to install
            </p>
          </div>
        </div>
      ) : null}
    </header>
  );
}
