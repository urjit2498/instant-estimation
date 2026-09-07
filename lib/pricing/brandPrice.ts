import type { Measurement } from "@/types/quote";

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
