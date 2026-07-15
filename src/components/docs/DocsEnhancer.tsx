"use client";

import { useEffect } from "react";

/**
 * Progressive docs enhancement (one small island): appends a copy-link "#"
 * anchor to each h2/h3[id] and scroll-spies the on-page TOC. Zero effect on
 * SSR/no-JS — deep links and headings work natively without it.
 */
export function DocsEnhancer() {
  useEffect(() => {
    const article = document.querySelector<HTMLElement>("[data-doc-article]");
    if (!article) return;
    const cleanups: Array<() => void> = [];

    const headings = Array.from(article.querySelectorAll<HTMLElement>("h2[id], h3[id]"));

    // Copy-link anchors.
    for (const h of headings) {
      if (h.querySelector(".heading-anchor")) continue;
      const a = document.createElement("a");
      a.href = `#${h.id}`;
      a.className = "heading-anchor";
      a.textContent = "#";
      a.setAttribute("aria-label", `Link to “${h.textContent ?? ""}”`);
      const onClick = (e: MouseEvent) => {
        e.preventDefault();
        const url = `${location.origin}${location.pathname}#${h.id}`;
        history.replaceState(null, "", `#${h.id}`);
        navigator.clipboard?.writeText(url).then(
          () => {
            a.textContent = "copied";
            setTimeout(() => (a.textContent = "#"), 1500);
          },
          () => {},
        );
      };
      a.addEventListener("click", onClick);
      h.appendChild(a);
      cleanups.push(() => {
        a.removeEventListener("click", onClick);
        a.remove();
      });
    }

    // TOC scroll-spy.
    const tocLinks = new Map<string, HTMLElement>();
    document.querySelectorAll<HTMLElement>("[data-toc] a[href^='#']").forEach((a) => {
      const id = a.getAttribute("href")!.slice(1);
      tocLinks.set(id, a);
    });
    if (tocLinks.size && headings.length) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              tocLinks.forEach((el) => el.removeAttribute("data-active"));
              tocLinks.get(e.target.id)?.setAttribute("data-active", "true");
            }
          }
        },
        { rootMargin: "-10% 0px -80% 0px", threshold: 0 },
      );
      headings.forEach((h) => io.observe(h));
      cleanups.push(() => io.disconnect());
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
