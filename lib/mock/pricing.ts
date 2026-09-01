import type { Measurement, PriceEstimate } from "@/types/quote";
import type { Material } from "@/types/material";
import type { Contractor } from "@/types/contractor";

/**
 * TODO: this whole function is a placeholder. The real pricing calculation will live in the
 * backend dev's API (given measurement + materialId, returns a price) — this only exists so
 * the frontend has something concrete to build the UI against. Formula is illustrative only.
 */
export function calculateMockPrice(
  contractor: Contractor,
  measurement: Measurement,
  material: Material
): PriceEstimate {
  const areaSqFt =
    measurement.areaSqFt ?? (measurement.lengthFt ?? 0) * 2; // rough fallback if a line was traced instead of an area

  const baseRatePerSqFt = contractor.basePricePerSqFt;
  const subtotal = areaSqFt * baseRatePerSqFt * material.priceMultiplier;

  // Simple minimum-job-price floor, common in this industry.
  const price = Math.max(Math.round(subtotal), 150);

  return {
    price,
    currency: "USD",
    breakdown: {
      baseRatePerSqFt,
      areaSqFt: Math.round(areaSqFt),
      materialName: material.name,
      materialMultiplier: material.priceMultiplier,
      subtotal: Math.round(subtotal),
    },
    estimateId: `mock-est-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
}
