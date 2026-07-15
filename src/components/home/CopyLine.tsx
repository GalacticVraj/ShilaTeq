/**
 * S8 memory-hooks copy affordance (Phase-3 11 #194/#306) — SERVER component;
 * the SceneRunner binds the clipboard handler via [data-copy-line] and writes
 * the quiet past-tense confirmation into [data-copy-status].
 */
export function CopyLine({ line }: { line: string }) {
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <button
        type="button"
        data-copy-line={line}
        className="prose-link text-label cursor-pointer border-0 bg-transparent p-0 font-mono"
      >
        copy this line
      </button>
      <span
        data-copy-status=""
        role="status"
        aria-live="polite"
        className="text-label text-ok-600 font-mono"
      />
    </span>
  );
}
