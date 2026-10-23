"use client";

import { useRef, useState } from "react";
import "./site-menu.css";

export type MenuGroup = { label: string; links: { href: string; label: string }[] };

/**
 * The phone's menu: a button in the top bar and a panel under it. A native
 * popover, so Escape, a tap outside and the browser's focus order all work
 * without code; a link closes it as it goes. `tone` matches the bar it sits in.
 */
export function SiteMenu({
  id,
  groups,
  cta,
  tone = "dark",
  className = "",
}: {
  id: string;
  groups: MenuGroup[];
  cta?: { href: string; label: string };
  tone?: "dark" | "light";
  className?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const close = () => panel.current?.hidePopover();

  return (
    <>
      <button
        type="button"
        className={`sm-btn sm--${tone} ${className}`}
        popoverTarget={id}
        aria-expanded={open}
        aria-controls={id}
      >
        <span className="sm-btn__icon" aria-hidden="true">
          <i />
          <i />
        </span>
        {open ? "Close" : "Menu"}
      </button>
      <div
        ref={panel}
        id={id}
        popover="auto"
        className={`sm-panel sm--${tone}`}
        onToggle={(e) => setOpen(e.newState === "open")}
      >
        {groups.map((g) => (
          <nav key={g.label} aria-label={g.label} className="sm-group">
            <p className="sm-group__label x-label">{g.label}</p>
            <ul>
              {g.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={close}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        {cta && (
          <a href={cta.href} className="x-btn x-btn--signal sm-panel__cta" onClick={close}>
            {cta.label} <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </>
  );
}
