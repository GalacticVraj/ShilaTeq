import Link from "next/link";
import { footerColumns, site } from "@/config/site";

/**
 * Footer: a calm index, not a dumping ground (phase-4/03 S8). Carries the
 * category line as the closing signature and the live-showroom proof link.
 * No entrance motion, ever (phase-4/05).
 */
export function Footer() {
  return (
    <footer className="border-line-100 bg-paper-1 border-t">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {footerColumns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="eyebrow">{col.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-ink-700 hover:underline hover:underline-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <h2 className="eyebrow">Contact Sales</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <span className="text-body-sm text-ink-700 font-medium">Vraj:</span>{" "}
                <a
                  href="tel:7043765580"
                  className="text-body-sm text-ink-700 hover:underline hover:underline-offset-2"
                >
                  7043765580
                </a>
              </li>
              <li>
                <span className="text-body-sm text-ink-700 font-medium">Lakshya:</span>{" "}
                <a
                  href="tel:+918078686994"
                  className="text-body-sm text-ink-700 hover:underline hover:underline-offset-2"
                >
                  +91 8078 686 994
                </a>
              </li>
              <li>
                <span className="text-body-sm text-ink-700 font-medium">Email:</span>{" "}
                <a
                  href="mailto:shilateq@gmail.com"
                  className="text-body-sm text-ink-700 hover:underline hover:underline-offset-2"
                >
                  shilateq@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/shilateq/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-ink-700 hover:underline hover:underline-offset-2"
                >
                  LinkedIn ↗
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="eyebrow">The yard</h2>
            <ul className="mt-4 space-y-2.5">
              {site.showroomUrl ? (
                <li>
                  <a
                    href={site.showroomUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm text-ink-700 hover:underline hover:underline-offset-2"
                  >
                    See a live showroom ↗<span className="sr-only">(opens in new tab)</span>
                  </a>
                </li>
              ) : null}
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-body-sm text-ink-700 hover:underline hover:underline-offset-2"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="text-body-sm text-ink-700 hover:underline hover:underline-offset-2"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-body-sm text-ink-700 hover:underline hover:underline-offset-2"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-line-100 mt-12 flex flex-col gap-2 border-t pt-6 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="eyebrow">{site.categoryLine}</p>
          <p className="text-body-sm text-ink-500">© {new Date().getFullYear()} ShilaTeq</p>
        </div>
      </div>
    </footer>
  );
}
