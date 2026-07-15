import { Badge } from "@/components/ui/Badge";

/**
 * The Exhibit Pending system (Milestone-2 directive + A-006 §3): real product
 * screenshots don't exist yet, and fake ones are banned forever (phase-4/14
 * rule 8/11). This frame holds the exhibit's place HONESTLY — it names what
 * will appear, and states plainly that the real screenshot is coming. It must
 * never contain invented UI, lorem, or stock imagery.
 */
export function ExhibitPending({
  caption,
  will,
  aspect = "aspect-[4/3]",
}: {
  /** The exhibit caption (mono, factual) — what this exhibit documents. */
  caption: string;
  /** One line describing the real screenshot that will appear here. */
  will: string;
  aspect?: string;
}) {
  return (
    <figure className="max-w-xl">
      <div
        className={`${aspect} rounded-paper border-line-300 bg-paper-1 flex flex-col items-start justify-end border border-dashed p-5`}
      >
        <Badge variant="in-progress">Exhibit pending</Badge>
        <p className="text-body-sm text-ink-700 mt-3">
          A real product screenshot goes here: {will} We photograph the real thing or show nothing —
          no mock-ups, ever.
        </p>
      </div>
      <figcaption className="text-label text-ink-500 mt-2 font-mono">{caption}</figcaption>
    </figure>
  );
}
