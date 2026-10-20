import type { Metadata } from "next";
import { PillarPage, type PillarConfig } from "@/components/product/PillarPage";
import { ExhibitPending } from "@/components/ui/ExhibitPending";
import { Reveal } from "@/components/home/Reveal";

export const metadata: Metadata = {
  title: "A worker app in Hindi that works without signal",
  description:
    "Username-only login, icon-first bilingual screens, an offline outbox that syncs exactly once, and every worker seeing his own pay. Built for the shed, not the office.",
};

const config: PillarConfig = {
  slug: "worker-app",
  eyebrow: "The people",
  h1: "“My workers won't use software.”",
  sting:
    "They will — if it speaks their language, works in the shed's dead zone, and gives them something back. Most yard software fails here first: the best system in the world is worthless if the cutter won't touch it.",
  objection: {
    q: "Honestly — a gangsaw operator, on an app?",
    a: "He logs in with just a username his admin created — no email, no password to memorize. His screens are icons and numbers, in Hindi if he prefers. He enters what he cut; the math happens elsewhere; prices are hidden from him entirely. And the app pays him back: he sees his own attendance, his own earnings, and can request an advance from his phone. Adoption isn't a training problem — it's a respect problem, and this app was built respectfully.",
  },
  register: [
    [
      "Username-only login",
      "No email, no self-signup — the admin creates access in a tap; the worker just types his name.",
    ],
    [
      "English / हिंदी",
      "Every worker screen is fully bilingual, icon- and number-first, with the choice remembered.",
    ],
    [
      "The offline outbox",
      "Work saves on the device and syncs when signal returns — oldest first, exactly once, never twice.",
    ],
    [
      "The sync chip",
      "Green synced, amber syncing, red needs-attention — the worker always knows his shift is safe.",
    ],
    [
      "Task checklists",
      "Assigned jobs as step-by-step lists, strictly in order, impossible to double-complete.",
    ],
    [
      "The cut screen",
      "Consumed area and slab rows in; recovery, wastage, and the remnant computed — prices never shown.",
    ],
    [
      "Deliveries, forward-only",
      "A driver sees only his own runs: In Transit, then Delivered. One tap closes the whole order.",
    ],
    [
      "My Pay",
      "Own attendance calendar, earnings, advances, and net balance — transparency that ends pay disputes.",
    ],
    [
      "Wage snapshots",
      "Each day's wage is frozen when attendance is marked. A later rate change never rewrites history.",
    ],
    [
      "Advance requests",
      "Asked from the phone, approved by the admin, settled in the payroll — controlled, not chaotic.",
    ],
  ],
  registerCaption: "Worker app and payroll capabilities",
  limit: {
    fact: "The office side needs a connection to first load.",
    reason:
      "Offline-first covers the worker's actions — cutting, tasks, deliveries — which is where signal actually dies. The admin app requires network to open its pages; full office-side offline is on the roadmap.",
    roadmap: true,
  },
  demoHref: "/demo?step=4",
  demoMicroline: "step 4: the Hindi, offline cut",
  waPrefix: "Mujhe worker app ke baare mein jaanna hai.",
  comparison: { label: "See why generic ERPs lose the shop floor →", href: "/why/vs-erp" },
};

const CHIP_STATES = [
  ["ok", "Synced", "Everything is saved to the server."],
  ["warn", "3 syncing", "Actions queued; sync in progress — keep working."],
  ["danger", "1 not synced", "Needs attention — listed plainly, with a retry button."],
] as const;

export default function WorkerAppPage() {
  return (
    <PillarPage config={config}>
      {/* Mechanism: offline that can be trusted */}
      <Reveal as="section" aria-labelledby="mech-sync" className="reveal mt-16">
        <h2 id="mech-sync" className="font-display text-heading-1 text-ink-900 font-medium">
          The mechanism: offline you can trust
        </h2>
        <div className="text-body text-ink-700 mt-6 max-w-2xl space-y-4">
          <p>
            Sheds have concrete walls and metal roofs; yards have dead zones. So the worker app
            never depends on signal: every tap is saved to the device instantly and queued. When
            connectivity returns, the queue drains in order — and an idempotency guarantee makes it
            structurally impossible for a double-tap or a replay to count the same cut twice.
          </p>
          <p>
            The worker doesn&rsquo;t take that on faith. A chip on his screen tells him, at a
            glance, whether his shift is safe:
          </p>
        </div>
        <ul className="mt-6 max-w-2xl space-y-3" aria-label="The sync chip's three states">
          {CHIP_STATES.map(([tone, label, line]) => (
            <li
              key={label}
              className="rounded-paper border-line-100 bg-paper-2 flex items-center gap-4 border p-4"
            >
              <span
                aria-hidden="true"
                className={
                  "inline-flex size-5 shrink-0 rounded-full border " +
                  (tone === "ok"
                    ? "border-ok-600 bg-ok-100"
                    : tone === "warn"
                      ? "border-warn-600 bg-warn-100"
                      : "border-danger-600 bg-danger-100")
                }
              />
              <span className="text-data text-ink-900 font-mono font-medium">{label}</span>
              <span className="text-body-sm text-ink-700">{line}</span>
            </li>
          ))}
        </ul>
        <p className="text-body text-ink-700 mt-6 max-w-2xl">
          And because attendance <em>is</em> payroll here, each day&rsquo;s wage is frozen the
          moment it&rsquo;s marked — pay history that can&rsquo;t be quietly rewritten protects the
          worker and the owner alike. In a trade that runs on trust, the software should be the most
          trustworthy thing in the yard.
        </p>
      </Reveal>

      {/* Proof exhibits (pending founder assets — the Hindi screens ARE the argument) */}
      <Reveal as="section" aria-labelledby="proof-h" className="reveal mt-16">
        <h2 id="proof-h" className="font-display text-heading-1 text-ink-900 font-medium">
          Seen in the product
        </h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <ExhibitPending
            caption="EXHIBIT · the worker dashboard, in हिंदी"
            will="the real Hindi worker home — status toggle, My Work list, and the sync chip."
            aspect="aspect-[9/16] max-w-[280px]"
          />
          <ExhibitPending
            caption="EXHIBIT · the cut screen"
            will="a cut being logged — consumed area, slab rows, and no prices anywhere."
            aspect="aspect-[9/16] max-w-[280px]"
          />
        </div>
      </Reveal>
    </PillarPage>
  );
}
