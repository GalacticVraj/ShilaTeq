import Link from "next/link";
import { DoorsBlock } from "@/components/ui/DoorsBlock";
import { TrackOnMount } from "@/components/analytics/TrackOnMount";

/**
 * 404 — "This block isn't in the yard." (phase-4/04 §14). Full nav is present
 * via the layout; here: the line, a mini-map, the two doors. noindex is set
 * via metadata.
 */
export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const miniMap = [
  { label: "Product", href: "/product" },
  { label: "Demo", href: "/demo" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
] as const;

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <TrackOnMount event="not_found" />
      <div className="max-w-2xl">
        <p className="eyebrow">404</p>
        <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
          This block isn&rsquo;t in the yard.
        </h1>
        <p className="text-body-lg text-ink-700 mt-4">
          The page you&rsquo;re looking for doesn&rsquo;t exist here. These do:
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {miniMap.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="prose-link text-body">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <DoorsBlock />
        </div>
      </div>
    </div>
  );
}
