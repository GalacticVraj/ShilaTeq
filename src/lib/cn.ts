/** Minimal class joiner — no runtime deps by design (phase-4/14 rule 13). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
