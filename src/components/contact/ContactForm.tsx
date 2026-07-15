"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { WhatsAppGlyph } from "@/components/ui/DoorsBlock";
import { site } from "@/config/site";

/**
 * Contact form (phase-4/04 §11; M6): React Hook Form + Zod, blur validation,
 * keyboard- and mobile-first. NO backend (channel honesty) — on submit it
 * composes a WhatsApp message and hands off (the lead record), or shows an
 * honest pending state when the number isn't set yet. Errors are accessible;
 * input is never lost.
 */

const schema = z.object({
  name: z.string().trim().min(1, "Please tell us your name."),
  place: z.string().trim().optional(),
  message: z.string().trim().min(1, "Please add a short message."),
});
type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  const [sent, setSent] = useState<null | "wa" | "pending">(null);

  const buildMessage = (v: FormValues) => {
    const where = v.place?.trim() ? ` (${v.place.trim()})` : "";
    return `Hi — I'm ${v.name.trim()}${where}. ${v.message.trim()}`;
  };

  const waNumber = site.whatsappNumber;

  const onSubmit = (v: FormValues) => {
    if (waNumber) {
      window.open(
        `https://wa.me/${waNumber}?text=${encodeURIComponent(buildMessage(v))}`,
        "_blank",
        "noopener",
      );
      setSent("wa");
    } else {
      setSent("pending");
    }
  };

  if (sent === "wa") {
    return (
      <div
        role="status"
        className="rounded-paper border-line-300 bg-paper-2 shadow-desk border p-6"
      >
        <p className="text-body-lg text-ink-900 flex items-center gap-2 font-bold">
          <WhatsAppGlyph className="text-ok-600 size-5" />
          Opening WhatsApp with your message.
        </p>
        <p className="text-body text-ink-700 mt-2">
          If it didn&rsquo;t open,{" "}
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(buildMessage(getValues()))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="prose-link"
          >
            tap here to message us
          </a>
          . We reply during business hours — usually within minutes.
        </p>
      </div>
    );
  }

  if (sent === "pending") {
    return (
      <div
        role="status"
        className="rounded-paper border-line-300 bg-paper-2 shadow-desk border p-6"
      >
        <p className="text-body-lg text-ink-900 font-bold">Thanks for reaching out.</p>
        <p className="text-body text-ink-700 mt-2">
          Our contact channels are being set up right now. The fastest way to see ShilaTeq in the
          meantime is the demo — a full sample yard, no conversation needed.
        </p>
        <a
          href="/demo"
          className="rounded-paper border-line-300 bg-paper-2 text-body text-ink-900 hover:border-ink-700 mt-4 inline-flex min-h-11 items-center border px-4 py-2 font-bold"
        >
          Try the demo →
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-paper border-line-100 bg-paper-2 shadow-desk border p-6 sm:p-8"
    >
      <Field
        id="c-name"
        label="Your name"
        error={errors.name?.message}
        register={register("name")}
        autoComplete="name"
      />
      <Field
        id="c-place"
        label="Where's your yard?"
        optional
        error={errors.place?.message}
        register={register("place")}
        placeholder="e.g. Kishangarh"
      />
      <div className="mt-6">
        <label htmlFor="c-message" className="text-body-sm text-ink-900 block font-bold">
          Your message
        </label>
        <textarea
          id="c-message"
          rows={4}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "c-message-err" : undefined}
          {...register("message")}
          className="rounded-paper-sm border-line-300 bg-paper-2 text-body text-ink-900 placeholder:text-ink-500 mt-1.5 w-full border px-3 py-2.5"
          placeholder="Tell us a little about your yard, or ask us anything."
        />
        {errors.message ? (
          <p
            id="c-message-err"
            className="text-body-sm text-danger-600 mt-1.5 flex items-start gap-1.5"
          >
            <span aria-hidden="true">!</span>
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-paper bg-ink-900 text-body text-paper-2 ease-standard mt-8 inline-flex min-h-12 items-center gap-2 px-6 py-3 font-bold transition-colors duration-180 hover:bg-black active:scale-[0.98] disabled:opacity-70 motion-reduce:active:scale-100"
      >
        {waNumber ? <WhatsAppGlyph className="size-5" /> : null}
        Send message
      </button>
      <p className="text-body-sm text-ink-500 mt-3">
        No account, no spam. This opens a message to us — you choose to send it.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  register,
  optional,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  error?: string;
  register: ReturnType<ReturnType<typeof useForm<FormValues>>["register"]>;
  optional?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div className="mt-6 first:mt-0">
      <label htmlFor={id} className="text-body-sm text-ink-900 block font-bold">
        {label} {optional ? <span className="text-ink-500 font-normal">(optional)</span> : null}
      </label>
      <input
        id={id}
        type="text"
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        {...register}
        className="rounded-paper-sm border-line-300 bg-paper-2 text-body text-ink-900 placeholder:text-ink-500 mt-1.5 w-full border px-3 py-2.5"
      />
      {error ? (
        <p
          id={`${id}-err`}
          className="text-body-sm text-danger-600 mt-1.5 flex items-start gap-1.5"
        >
          <span aria-hidden="true">!</span>
          {error}
        </p>
      ) : null}
    </div>
  );
}
