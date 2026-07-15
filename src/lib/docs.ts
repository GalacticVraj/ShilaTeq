import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import { docsIndex, type DocMeta } from "@/content/docs-index";

/**
 * Documentation content pipeline (phase-4/04 §9): the 15-doc product hub,
 * ported through the editorial scrub (Phase-2 content §5 / phase-4 A-006):
 * internal codename and legacy URLs removed, broken Business-Logic links
 * de-linked, cross-links rewritten to /docs slugs, mermaid diagrams replaced
 * by an honest pending-redraw note.
 *
 * RULE-9 ENFORCEMENT: the transform THROWS at build time if any banned token
 * survives — the brand law is a compiler error, not a review item.
 *
 * The pure index (no fs) lives in @/content/docs-index for client use.
 */

const SRC = path.join(process.cwd(), "src/content/docs-src");

const fileToSlug: Record<string, string> = Object.fromEntries(
  docsIndex.map((d) => [d.file, d.slug]),
);

const BANNED = ["StoneX", "stonevl", "vercel.app", "11_Business_Logic"];

/** Split a markdown string into [code, non-code, code, …] segments. */
function splitFences(s: string): string[] {
  return s.split(/(```[\s\S]*?```)/g);
}

/**
 * Rewrite heading levels so the rendered hierarchy never skips a level
 * (WCAG heading-order), regardless of the source's own inconsistencies.
 * Stack-based: the page's own <h1> is the virtual root; the first content
 * heading becomes h2, and every heading sits exactly one below its nearest
 * shallower ancestor. Fenced code is left untouched.
 */
function shiftHeadings(s: string): string {
  const segs = splitFences(s);
  const stack: Array<{ src: number; out: number }> = [{ src: 0, out: 1 }];
  for (let i = 0; i < segs.length; i += 2) {
    segs[i] = segs[i].replace(/^(#{1,6})(\s+)/gm, (_m, hashes: string, sp: string) => {
      const src = hashes.length;
      while (stack.length > 1 && stack[stack.length - 1].src >= src) stack.pop();
      const out = Math.min(6, stack[stack.length - 1].out + 1);
      stack.push({ src, out });
      return "#".repeat(out) + sp;
    });
  }
  return segs.join("");
}

function transform(raw: string, file: string): string {
  let s = raw;

  // Strip the source's own leading H1 title and the "back to hub" link — the
  // page renders its own <h1> from meta (one-h1-per-page law, phase-4/07).
  s = s.replace(/^\s*#\s+.+$/m, "");
  s = s.replace(/^\s*\[.*?Back to Documentation Hub.*?\]\([^)]*\)\s*$/m, "");

  // Normalize heading depth so each doc's shallowest section becomes h2
  // (several docs use `#` for section headers → many h1s). Applied outside
  // code fences. Shift = 2 − shallowest, only ever demoting.
  s = shiftHeadings(s);

  // Legacy URL parentheticals, then any residue of the URL itself.
  s = s.replace(/\s*\((?:the live app runs at|such as)?\s*`?stonevl\.vercel\.app`?[^)]*\)/g, "");
  s = s.replace(/`?stonevl\.vercel\.app`?/g, "the live application");

  // Internal codename: titled combos first, then residuals.
  s = s.replace(/ShilaTeq \(StoneX\)/g, "ShilaTeq");
  s = s.replace(/\(StoneX\)\s*/g, "");
  s = s.replace(/StoneX/g, "ShilaTeq");

  // The missing Business-Logic doc: de-link, keep readable text.
  s = s.replace(/\[([^\]]+)\]\(11_Business_Logic\.md[^)]*\)/g, "the business-logic reference");

  // Cross-links between docs → /docs slugs (drop anchors on unknown targets).
  s = s.replace(/\]\((\d{2}_[A-Za-z_]+\.md)(#[^)]*)?\)/g, (_m, f, anchor) => {
    const slug = fileToSlug[f];
    return slug ? `](/docs/${slug}${anchor ?? ""})` : "](/docs)";
  });
  s = s.replace(/\]\(README\.md\)/g, "](/docs)");

  // Mermaid diagrams → honest pending-redraw note (A-006-style placeholder).
  s = s.replace(
    /```mermaid[\s\S]*?```/g,
    "> **Diagram pending.** This figure is being redrawn in the documentation's ink-diagram style; the surrounding text describes the full flow.",
  );

  // MDX safety, applied only outside code fences/spans (which are preserved
  // by the split): normalize void HTML tags to self-closing, escape stray
  // braces, and neutralize a bare "<" that isn't opening a tag.
  const parts = s.split(/(```[\s\S]*?```|`[^`]*`)/g);
  s = parts
    .map((part, i) => {
      if (i % 2 === 1) return part; // code — leave verbatim
      return part
        .replace(/<(br|hr|img|wbr)\s*\/?>/gi, "<$1 />")
        .replace(/\{/g, "&#123;")
        .replace(/\}/g, "&#125;")
        .replace(/<(?![a-zA-Z/!])/g, "&lt;");
    })
    .join("");

  for (const token of BANNED) {
    if (s.includes(token)) {
      throw new Error(
        `docs transform: banned token "${token}" survived in ${file} — rule 9 violation.`,
      );
    }
  }
  return s;
}

export function getDoc(slug: string): {
  meta: DocMeta;
  content: string;
  toc: Array<{ id: string; text: string }>;
  prev: DocMeta | null;
  next: DocMeta | null;
} | null {
  const idx = docsIndex.findIndex((d) => d.slug === slug);
  if (idx === -1) return null;
  const meta = docsIndex[idx];
  const raw = fs.readFileSync(path.join(SRC, meta.file), "utf8");
  const content = transform(raw, meta.file);

  // TOC from h2s, with ids generated by the SAME slugger rehype-slug uses.
  // Slug every heading in document order (so duplicate-dedup counters align
  // exactly with the rendered ids), then keep the level-2 ones.
  const slugger = new GithubSlugger();
  const toc: Array<{ id: string; text: string }> = [];
  for (const m of content.matchAll(/^(#{1,6})\s+(.+)$/gm)) {
    const level = m[1].length;
    const text = m[2]
      .replace(/[*_`]/g, "")
      .replace(/&#\d+;/g, "")
      .trim();
    const id = slugger.slug(text);
    if (level === 2) toc.push({ id, text });
  }

  return {
    meta,
    content,
    toc,
    prev: idx > 0 ? docsIndex[idx - 1] : null,
    next: idx < docsIndex.length - 1 ? docsIndex[idx + 1] : null,
  };
}
