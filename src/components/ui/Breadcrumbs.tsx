import Link from "next/link";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/config/site";

/**
 * Breadcrumbs (Milestone-2 directive; BreadcrumbList schema per phase-4/08).
 * Quiet mono trail — wayfinding, never decoration. The last item is the
 * current page (aria-current, not a link).
 */
export function Breadcrumbs({ items }: { items: Array<{ label: string; href: string }> }) {
  const base = site.url ?? "";
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="text-label text-ink-500 flex flex-wrap items-center gap-x-1 gap-y-1 font-mono">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1">
                {i > 0 ? <span aria-hidden="true">/</span> : null}
                {last ? (
                  <span
                    aria-current="page"
                    className="text-ink-700 inline-flex min-h-6 items-center"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-ink-700 inline-flex min-h-6 items-center px-1 hover:underline hover:underline-offset-2"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            item: `${base}${item.href}`,
          })),
        }}
      />
    </>
  );
}
