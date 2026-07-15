import { cn } from "@/lib/cn";

/**
 * Reveal wrapper — SERVER component (A-007 follow-up: choreography runs via
 * the single SceneRunner client island, so reveal wrappers carry zero
 * hydration cost). `data-reveal` marks the element; CSS owns the animation
 * and every end-state (reduced-motion, no-JS).
 */
export function Reveal({
  as: Tag = "div",
  className,
  children,
  ...rest
}: {
  as?: "div" | "section" | "ul" | "li" | "header";
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag data-reveal="" className={cn(className)} {...rest}>
      {children}
    </Tag>
  );
}
