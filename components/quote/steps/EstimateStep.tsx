"use client";

import { StepActions } from "@/components/quote/StepActions";
import type { PriceEstimate } from "@/types/quote";

interface EstimateStepProps {
  estimate: PriceEstimate;
  onBack: () => void;
  onContinue: () => void;
}

export function EstimateStep({
  estimate,
  onBack,
  onContinue,
}: EstimateStepProps) {
  const { breakdown } = estimate;
  const quantityLabel = breakdown.quantityUnit === "ft" ? "Length" : "Area";
  const rateLabel =
    breakdown.quantityUnit === "ft" ? "Rate per ft" : "Rate per sq ft";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-asphalt-950">Your instant estimate</h2>
        <p className="mt-1 text-sm text-asphalt-700">
          Based on your measurement and selected material. This is an estimate, not a binding
          quote.
        </p>
      </div>

      <div className="price-reveal-gradient rounded-xl border-2 border-asphalt-950 p-6 text-center">
        <p className="text-sm text-accent-bright">Estimated price</p>
        <p className="mt-1 font-mono text-4xl font-semibold text-paper">
          ${estimate.price.toLocaleString()}
        </p>
      </div>

      <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-md border border-asphalt-200 bg-paper-raised p-3">
          <dt className="text-asphalt-700">{quantityLabel}</dt>
          <dd className="font-mono font-medium text-asphalt-950">
            {breakdown.quantity.toLocaleString()} {breakdown.quantityUnit}
          </dd>
        </div>
        <div className="rounded-md border border-asphalt-200 bg-paper-raised p-3">
          <dt className="text-asphalt-700">Material</dt>
          <dd className="font-medium text-asphalt-950">{breakdown.materialName}</dd>
        </div>
        <div className="rounded-md border border-asphalt-200 bg-paper-raised p-3">
          <dt className="text-asphalt-700">{rateLabel}</dt>
          <dd className="font-mono font-medium text-asphalt-950">
            ${breakdown.ratePerUnit.toFixed(2)}
          </dd>
        </div>
        <div className="rounded-md border border-asphalt-200 bg-paper-raised p-3">
          <dt className="text-asphalt-700">Subtotal</dt>
          <dd className="font-mono font-medium text-asphalt-950">
            ${breakdown.subtotal.toLocaleString()}
          </dd>
        </div>
      </dl>

      <StepActions onBack={onBack}>
        <button
          type="button"
          onClick={onContinue}
          className="btn-gradient shrink-0 rounded-md px-5 py-2.5 text-sm font-medium"
        >
          Finish
        </button>
      </StepActions>
    </div>
  );
}
