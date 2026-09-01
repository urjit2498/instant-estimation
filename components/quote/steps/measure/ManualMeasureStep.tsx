"use client";

import { BackButton } from "@/components/quote/BackButton";
import { useState } from "react";
import type { Measurement } from "@/types/quote";

interface ManualMeasureStepProps {
  onBack: () => void;
  onComplete: (measurement: Measurement) => void;
}

export function ManualMeasureStep({ onBack, onComplete }: ManualMeasureStepProps) {
  const [value, setValue] = useState("");
  const areaSqFt = Number(value);
  const isValid = value.trim() !== "" && Number.isFinite(areaSqFt) && areaSqFt > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onComplete({ method: "manual", shapeType: "polygon", areaSqFt });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <h2 className="font-heading text-xl font-semibold text-asphalt-950">
          Enter your driveway&apos;s square footage
        </h2>
        <p className="mt-1 text-sm text-asphalt-700">
          Already know the number? Type it in — no map needed. Not sure? Go back and use
          &quot;Draw on the map&quot; instead for a precise measurement.
        </p>
      </div>

      <div>
        <label htmlFor="manual-area" className="mb-1 block text-sm font-medium text-asphalt-950">
          Total driveway area
        </label>
        <div className="flex items-center gap-2">
          <input
            id="manual-area"
            type="number"
            min={1}
            step="1"
            inputMode="numeric"
            placeholder="e.g. 600"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-40 rounded-md border border-asphalt-200 bg-paper-raised px-3 py-2 font-mono text-sm text-asphalt-950 focus:border-asphalt-950 focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
          <span className="text-sm text-asphalt-700">sq ft</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <BackButton onClick={onBack} />
        <button
          type="submit"
          disabled={!isValid}
          className="btn-gradient rounded-md px-5 py-2.5 text-sm font-medium"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
