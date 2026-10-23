import { SiteMenu, type MenuGroup } from "./SiteMenu";
import "./site-header.css";

type Link = { href: string; label: string; current?: boolean };

/**
 * The site's top bar, the same on every page: the wordmark, the three products
 * (the page you're on underlined) and, on phones, the menu. It lies over each
 * page's opening and scrolls away; it is the same element across pages (a view
 * transition name), so it holds still while the page changes under it.
 */
export function SiteHeader({
  home,
  links,
  more = [],
  demo,
}: {
  home: { href: string; label: string };
  links: Link[];
  more?: MenuGroup[];
  demo: string;
}) {
  return (
    <header className="x-top on-light">
      <a href={home.href} className="x-wordmark x-top__mark" aria-label={home.label}>
        <span aria-hidden="true">
          Sh
          <span className="x-wordmark__i">
            ı<span className="x-wordmark__dot" />
          </span>
          laTeq
        </span>
      </a>
      <nav aria-label="Products" className="x-top__nav">
        {links.map((l) => (
          <a key={l.href} href={l.href} aria-current={l.current ? "page" : undefined}>
            {l.label}
          </a>
        ))}
      </nav>
      <SiteMenu
        id="x-menu"
        tone="light"
        groups={[{ label: "Products", links }, ...more]}
        cta={{ href: demo, label: "Book a demo" }}
        className="x-top__menu"
      />
    </header>
  );
}
