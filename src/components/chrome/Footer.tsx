import Link from "next/link";
import { footerColumns } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 font-mono text-sm font-bold text-slate-950 shadow">
                🪨
              </div>
              <span className="text-xl font-extrabold text-white">
                Shila<span className="text-emerald-400">Teq</span>
              </span>
            </Link>
            <p className="max-w-sm text-xs text-slate-400 leading-relaxed">
              The modern ERP operating system for Indian stone yards, marble processors, and granite traders. Real-time QR identity, gangsaw yield recovery, and 1-tap WhatsApp GST invoicing.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
              <span>🇮🇳 Built for Indian Stone Yards</span>
              <span>•</span>
              <span>100% Offline Capable</span>
            </div>
          </div>

          {/* Nav Columns from site config */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold tracking-wider text-slate-200 uppercase font-mono">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5 text-xs">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-400 transition-colors hover:text-emerald-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Direct Column */}
          <div>
            <h3 className="text-xs font-bold tracking-wider text-slate-200 uppercase font-mono">
              Direct Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <span className="text-slate-500">Sales (Vraj):</span>{" "}
                <a href="tel:7043765580" className="text-slate-300 hover:text-emerald-400">
                  +91 70437 65580
                </a>
              </li>
              <li>
                <span className="text-slate-500">Support (Lakshya):</span>{" "}
                <a href="tel:+918078686994" className="text-slate-300 hover:text-emerald-400">
                  +91 8078 686 994
                </a>
              </li>
              <li>
                <span className="text-slate-500">Email:</span>{" "}
                <a href="mailto:shilateq@gmail.com" className="text-slate-300 hover:text-emerald-400">
                  shilateq@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/shilateq/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  LinkedIn Page ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-900 pt-8 text-xs text-slate-500 sm:flex-row">
          <div>
            &copy; {new Date().getFullYear()} ShilaTeq Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/legal/privacy" className="hover:text-slate-400">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="hover:text-slate-400">
              Terms of Service
            </Link>
            <Link href="/security" className="hover:text-slate-400">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
