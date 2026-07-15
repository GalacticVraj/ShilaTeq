"use client";

import { useState } from "react";

/**
 * The recovery mini-calculator (phase-4/04 §2a; Phase-2 content §9):
 * teaches the product's documented cutting math and nothing else —
 *   recovery % = output ÷ consumed × 100
 *   wastage = consumed − output
 *   slab material cost/sqft = block cost × consumed ÷ output area
 * (Phase-1 knowledge base, ✅-confirmed formulas.) Client island; inputs are
 * plain numbers, validation is blame-free, results are honest (no inputs →
 * no invented outputs).
 */
export function RecoveryCalculator() {
  const [consumed, setConsumed] = useState("");
  const [output, setOutput] = useState("");
  const [cost, setCost] = useState("");

  const c = parseFloat(consumed);
  const o = parseFloat(output);
  const k = parseFloat(cost);

  const valid = c > 0 && o > 0 && o <= c;
  const recovery = valid ? (o / c) * 100 : null;
  const wastage = valid ? c - o : null;
  // Nominal rate spreads cost over consumed area; the true rate spreads the
  // same cost over what actually survived — wastage raises the unit cost.
  const nominalRate = k > 0 && c > 0 ? k / c : null;
  const trueCostPerSqft = valid && k > 0 ? k / o : null;

  return (
    <div className="rounded-paper border-line-100 bg-paper-2 shadow-desk border p-5 sm:p-6">
      <p className="eyebrow">Try the math</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field
          id="calc-consumed"
          label="Block area consumed (sqft)"
          value={consumed}
          onChange={setConsumed}
          example="100"
        />
        <Field
          id="calc-output"
          label="Slab area produced (sqft)"
          value={output}
          onChange={setOutput}
          example="68"
        />
        <Field
          id="calc-cost"
          label="Cost of consumed stone (₹, optional)"
          value={cost}
          onChange={setCost}
          example="40000"
        />
      </div>

      <div aria-live="polite" className="border-line-100 mt-5 border-t pt-4">
        {c > 0 && o > c ? (
          <p className="text-body-sm text-danger-600">
            Output can&rsquo;t exceed the area consumed — ShilaTeq&rsquo;s cut engine rejects that
            entry too.
          </p>
        ) : valid ? (
          <dl className="grid gap-3 sm:grid-cols-3">
            <Result label="Recovery" value={`${recovery!.toFixed(1)}%`} />
            <Result label="Wastage" value={`${wastage!.toFixed(1)} sqft`} />
            {trueCostPerSqft && nominalRate ? (
              <Result
                label="True slab cost/sqft"
                value={`₹${trueCostPerSqft.toFixed(0)}`}
                note={`vs ₹${nominalRate.toFixed(0)} nominal — the wastage priced in`}
              />
            ) : (
              <Result label="True slab cost/sqft" value="add a cost to see it" muted />
            )}
          </dl>
        ) : (
          <p className="text-body-sm text-ink-500">
            Enter consumed and produced areas to see recovery, wastage, and the true cost of the
            surviving slabs.
          </p>
        )}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  example,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  example: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-body-sm text-ink-900 block font-bold">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={example}
        className="rounded-paper-sm border-line-300 bg-paper-2 text-body text-ink-900 placeholder:text-ink-500 mt-1.5 w-full border px-3 py-2.5 font-mono"
      />
    </div>
  );
}

function Result({
  label,
  value,
  note,
  muted,
}: {
  label: string;
  value: string;
  note?: string;
  muted?: boolean;
}) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className={`text-heading-3 mt-1 font-mono ${muted ? "text-ink-500" : "text-ink-900"}`}>
        {value}
      </dd>
      {note ? <dd className="text-body-sm text-ink-700 mt-0.5">{note}</dd> : null}
    </div>
  );
}
