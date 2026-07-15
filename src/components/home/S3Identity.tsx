/**
 * S3 shell — SERVER component (A-007): the choreography (label settle, the
 * one typing flourish, leader draws, annotation fades) is pure CSS driven by
 * `.is-live`/`.is-done` classes that the SceneRunner toggles on [data-s3].
 * Play-once variant (the blueprint's shipped default; pin gated per A-006 §2).
 * Tap-through completion (#183) is handled by the runner's click listener.
 */
export function S3Identity({ children }: { children: React.ReactNode }) {
  return <div data-s3="">{children}</div>;
}
