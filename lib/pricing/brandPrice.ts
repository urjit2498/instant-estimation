import type { Measurement, PriceEstimate } from "@/types/quote";
import type { BrandHeightOption, BrandMaterial } from "@/types/brand";

/** Quantity used for pricing and create-quote `estimated_sq_ft`. */
export function getMeasurementQuantity(measurement: Measurement): {
  quantity: number;
  quantityUnit: "ft" | "sq ft";
} {
  const usesLength =
    measurement.shapeType === "line" ||
    (measurement.lengthFt != null && measurement.areaSqFt == null);

  const quantity = usesLength
    ? (measurement.lengthFt ?? 0)
    : (measurement.areaSqFt ?? (measurement.lengthFt ?? 0));

  return {
    quantity,
    quantityUnit: usesLength ? "ft" : "sq ft",
  };
}

/**
 * Builds an estimate from brand material + selected height unit price.
 * Fence-style pricing: quantity (linear ft preferred, else sq ft) × height.price.
 */
export function calculateBrandPrice(
  measurement: Measurement,
  material: BrandMaterial,
  height: BrandHeightOption,
): PriceEstimate {
  const { quantity, quantityUnit } = getMeasurementQuantity(measurement);
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
