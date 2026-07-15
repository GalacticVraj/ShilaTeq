/**
 * JSON-LD helper (phase-4/08 §schema): schema states only what pages visibly
 * state; no rating/review markup until real reviews exist.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
