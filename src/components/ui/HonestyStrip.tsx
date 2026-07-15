import { Badge } from "@/components/ui/Badge";

/**
 * The candor module (phase-4/09 §10). Ships PLAIN by law: no imagery, no accent
 * color, no hover states, one-block reveal. Decorating candor is defacing it
 * (phase-4/14 rule 5).
 */
export type HonestyItem = {
  fact: string;
  reason: string;
  roadmap?: boolean;
};

export function HonestyStrip({
  title = "What ShilaTeq doesn't do. Yet.",
  items,
  headingLevel = "h2",
}: {
  title?: string;
  items: HonestyItem[];
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <section aria-label="Honest limitations">
      <Heading className="font-display text-heading-1 text-ink-900 font-medium">{title}</Heading>
      <ul className="mt-6">
        {items.map((item) => (
          <li key={item.fact} className="border-line-100 border-b py-4 first:border-t">
            <p className="text-body text-ink-900">
              {item.fact}
              {item.roadmap ? (
                <Badge variant="roadmap" className="ml-2 align-middle">
                  Roadmap
                </Badge>
              ) : null}
            </p>
            <p className="text-body-sm text-ink-700 mt-1">{item.reason}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
