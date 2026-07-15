import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import type { AnchorHTMLAttributes } from "react";

/**
 * Renders scrubbed documentation markdown (phase-4/04 §9). Server component,
 * zero client JS. remark-gfm for tables; rehype-slug for heading ids
 * (powers the TOC and copy-link anchors). Internal links use next/link.
 */

function ProseLink({ href = "", children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const internal = href.startsWith("/") || href.startsWith("#");
  if (internal) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

const components = {
  a: ProseLink,
};

export function DocContent({ source }: { source: string }) {
  return (
    <div className="prose">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        }}
      />
    </div>
  );
}
