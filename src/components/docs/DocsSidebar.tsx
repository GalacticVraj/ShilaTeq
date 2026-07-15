"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsIndex } from "@/content/docs-index";
import { cn } from "@/lib/cn";

/**
 * Docs sidebar (phase-4/04 §9): the ordered doc list with the active page
 * marked. One small client island (usePathname only) shared across all docs
 * routes via the docs layout.
 */
export function DocsSidebar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Documentation" className="text-body-sm">
      <Link
        href="/docs"
        aria-current={pathname === "/docs" ? "page" : undefined}
        className={cn(
          "block border-l-2 py-1.5 pl-3",
          pathname === "/docs"
            ? "border-accent-600 text-ink-900 font-bold"
            : "text-ink-700 hover:text-ink-900 border-transparent",
        )}
      >
        Overview
      </Link>
      <ul className="mt-1 space-y-0.5">
        {docsIndex.map((d) => {
          const href = `/docs/${d.slug}`;
          const active = pathname === href;
          return (
            <li key={d.slug}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block border-l-2 py-1.5 pl-3",
                  active
                    ? "border-accent-600 text-ink-900 font-bold"
                    : "text-ink-700 hover:border-line-300 hover:text-ink-900 border-transparent",
                )}
              >
                {d.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
