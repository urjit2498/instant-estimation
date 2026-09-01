"use client";

import { BackButton } from "@/components/quote/BackButton";
import type { PriceEstimate } from "@/types/quote";

interface EstimateStepProps {
  estimate: PriceEstimate;
  onBack: () => void;
  onContinue: () => void;
}

export function EstimateStep({ estimate, onBack, onContinue }: EstimateStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-asphalt-950">Your instant estimate</h2>
        <p className="mt-1 text-sm text-asphalt-700">
          {/* TODO: once the real pricing API exists, remove this "mock" disclosure. */}
          Estimated with placeholder pricing logic — final numbers will come from the real
          pricing API. This is an estimate, not a binding quote.
        </p>
      </div>

      <div className="price-reveal-gradient rounded-xl border-2 border-asphalt-950 p-6 text-center">
        <p className="text-sm text-accent-bright">Estimated price</p>
        <p className="mt-1 font-mono text-4xl font-semibold text-paper">
          ${estimate.price.toLocaleString()}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md border border-asphalt-200 bg-paper-raised p-3">
          <dt className="text-asphalt-700">Area</dt>
          <dd className="font-mono font-medium text-asphalt-950">
            {estimate.breakdown.areaSqFt.toLocaleString()} sq ft
          </dd>
        </div>
        <div className="rounded-md border border-asphalt-200 bg-paper-raised p-3">
          <dt className="text-asphalt-700">Material</dt>
          <dd className="font-medium text-asphalt-950">{estimate.breakdown.materialName}</dd>
        </div>
        <div className="rounded-md border border-asphalt-200 bg-paper-raised p-3">
          <dt className="text-asphalt-700">Rate per sq ft</dt>
          <dd className="font-mono font-medium text-asphalt-950">
            ${estimate.breakdown.baseRatePerSqFt.toFixed(2)}
          </dd>
        </div>
        <div className="rounded-md border border-asphalt-200 bg-paper-raised p-3">
          <dt className="text-asphalt-700">Material multiplier</dt>
          <dd className="font-mono font-medium text-asphalt-950">
            {estimate.breakdown.materialMultiplier.toFixed(2)}x
          </dd>
        </div>
      </dl>

      <div className="flex items-center justify-between">
        <BackButton onClick={onBack} />
        <button
          type="button"
          onClick={onContinue}
          className="btn-gradient rounded-md px-5 py-2.5 text-sm font-medium"
        >
          Looks good, continue
        </button>
      </div>
    </div>
  );
}
