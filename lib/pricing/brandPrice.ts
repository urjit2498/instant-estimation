import type { Measurement, PriceEstimate } from "@/types/quote";
import type { BrandHeightOption, BrandMaterial } from "@/types/brand";

/**
 * Builds an estimate from brand material + selected height unit price.
 * Fence-style pricing: quantity (linear ft preferred, else sq ft) × height.price.
 */
export function calculateBrandPrice(
  measurement: Measurement,
  material: BrandMaterial,
  height: BrandHeightOption,
): PriceEstimate {
  const usesLength =
    measurement.shapeType === "line" ||
    (measurement.lengthFt != null && measurement.areaSqFt == null);

  const quantity = usesLength
    ? (measurement.lengthFt ?? 0)
    : (measurement.areaSqFt ?? (measurement.lengthFt ?? 0));

  const quantityUnit = usesLength ? "ft" : "sq ft";
  const ratePerUnit = height.price;
  const subtotal = quantity * ratePerUnit;
  const price = Math.max(Math.round(subtotal), 0);
  const materialName = `${material.title} (${height.title})`;

  return {
    price,
    currency: "USD",
    breakdown: {
      quantity: Math.round(quantity * 10) / 10,
      quantityUnit,
      ratePerUnit,
      materialName,
      heightTitle: height.title,
      subtotal: Math.round(subtotal),
    },
    estimateId: `est-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
}
