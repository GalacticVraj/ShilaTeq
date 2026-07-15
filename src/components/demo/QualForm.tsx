"use client";

import { useState } from "react";
import { WhatsAppGlyph } from "@/components/ui/DoorsBlock";
import { writeProgress } from "@/lib/demoProgress";
import { cn } from "@/lib/cn";
import { site } from "@/config/site";

/**
 * Completion qualification (phase-4/04 §3; GTM §5). The four approved
 * questions only — role, yard, tools, trigger — every field optional and
 * value-framed. There is no backend and no email: the answers BECOME the
 * WhatsApp prefill, which is the lead record (Phase-2 08 §10). Skipping is
 * always available via the plain door below (rendered by the page).
 */

const ROLES = [
  "I own the yard",
  "I'm family in the business",
  "I manage / supervise",
  "Something else",
] as const;

const TOOLS = ["A paper register", "Excel", "WhatsApp", "Tally", "Something else"] as const;

export function QualForm() {
  const [role, setRole] = useState<string>("");
  const [yard, setYard] = useState("");
  const [tools, setTools] = useState<string[]>([]);
  const [trigger, setTrigger] = useState("");
  const [sent, setSent] = useState(false);

  const toggleTool = (t: string) =>
    setTools((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const buildMessage = () => {
    const parts: string[] = ["Hi — I just went through the ShilaTeq demo."];
    if (role) parts.push(role + ".");
    if (yard.trim()) parts.push(`Yard: ${yard.trim()}.`);
    if (tools.length) parts.push(`Today we use: ${tools.join(", ")}.`);
    if (trigger.trim()) parts.push(`What made me look: ${trigger.trim()}.`);
    if (parts.length === 1) parts.push("I'd like to know more.");
    return parts.join(" ");
  };

  const waNumber = site.whatsappNumber;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    writeProgress({ qualified: true });
    if (!waNumber) {
      setSent(true);
      return;
    }
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(buildMessage())}`;
    setSent(true);
    window.open(url, "_blank", "noopener");
  };

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-paper border-line-300 bg-paper-2 shadow-desk border p-6"
      >
        {waNumber ? (
          <>
            <p className="text-body-lg text-ink-900 flex items-center gap-2 font-bold">
              <WhatsAppGlyph className="text-ok-600 size-5" />
              Opening WhatsApp with your yard&rsquo;s details.
            </p>
            <p className="text-body text-ink-700 mt-2">
              If it didn&rsquo;t open,{" "}
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(buildMessage())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="prose-link"
              >
                tap here to message us
              </a>
              . We reply during business hours — usually within minutes.
            </p>
          </>
        ) : (
          <>
            <p className="text-body-lg text-ink-900 font-bold">
              Thanks — that&rsquo;s genuinely useful.
            </p>
            <p className="text-body text-ink-700 mt-2">
              Our WhatsApp line is being set up. In the meantime, the demo is the fastest way to see
              everything for yourself — no conversation needed.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-paper border-line-100 bg-paper-2 shadow-desk border p-6 sm:p-8"
    >
      <p className="text-body-lg text-ink-900">
        Want us to make it about <em>your</em> yard?
      </p>
      <p className="text-body-sm text-ink-700 mt-1">
        Tell us a little and the conversation starts already tailored. Every field is optional.
      </p>

      {/* Role */}
      <fieldset className="mt-6">
        <legend className="text-body-sm text-ink-900 font-bold">You are…</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={role === r}
              onClick={() => setRole(role === r ? "" : r)}
              className={cn(
                "rounded-paper text-body-sm min-h-11 border px-3 py-2 transition-colors duration-180",
                role === r
                  ? "border-ink-900 bg-ink-900 text-paper-2"
                  : "border-line-300 bg-paper-2 text-ink-900 hover:border-ink-700",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Yard */}
      <div className="mt-6">
        <label htmlFor="q-yard" className="text-body-sm text-ink-900 block font-bold">
          Where&rsquo;s your yard, and roughly how big?
        </label>
        <input
          id="q-yard"
          type="text"
          value={yard}
          onChange={(e) => setYard(e.target.value)}
          placeholder="e.g. Kishangarh · around 800 blocks"
          className="rounded-paper-sm border-line-300 bg-paper-2 text-body text-ink-900 placeholder:text-ink-500 mt-1.5 w-full border px-3 py-2.5"
        />
      </div>

      {/* Tools */}
      <fieldset className="mt-6">
        <legend className="text-body-sm text-ink-900 font-bold">
          What do you use today? (pick any)
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {TOOLS.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tools.includes(t)}
              onClick={() => toggleTool(t)}
              className={cn(
                "rounded-paper text-body-sm min-h-11 border px-3 py-2 transition-colors duration-180",
                tools.includes(t)
                  ? "border-ink-900 bg-ink-900 text-paper-2"
                  : "border-line-300 bg-paper-2 text-ink-900 hover:border-ink-700",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Trigger */}
      <div className="mt-6">
        <label htmlFor="q-trigger" className="text-body-sm text-ink-900 block font-bold">
          What made you look today? <span className="text-ink-500 font-normal">(optional)</span>
        </label>
        <input
          id="q-trigger"
          type="text"
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          placeholder="e.g. lost a sale hunting for a block"
          className="rounded-paper-sm border-line-300 bg-paper-2 text-body text-ink-900 placeholder:text-ink-500 mt-1.5 w-full border px-3 py-2.5"
        />
      </div>

      <button
        type="submit"
        className="rounded-paper bg-ink-900 text-body text-paper-2 ease-standard mt-8 inline-flex min-h-12 items-center gap-2 px-6 py-3 font-bold transition-colors duration-180 hover:bg-black active:scale-[0.98] motion-reduce:active:scale-100"
      >
        {waNumber ? <WhatsAppGlyph className="size-5" /> : null}
        Start the conversation
      </button>
    </form>
  );
}
