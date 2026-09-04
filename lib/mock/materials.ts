import type { Material, MaterialListItem } from "@/types/material";

/**
 * Local fallback catalog only. Live materials come from `get-brand-details` via /api/materials.
 */
export const MOCK_MATERIALS: Material[] = [
  {
    id: "standard-sealcoat",
    name: "Standard Sealcoat",
    imageUrl: null,
    shortDescription: "Asphalt-emulsion sealcoat. The most common choice for residential driveways.",
    category: "Sealcoat",
    priceMultiplier: 1,
  },
];

export function getMaterialById(id: string): Material | null {
  return MOCK_MATERIALS.find((m) => m.id === id) ?? null;
}

export function toMaterialListItem(material: Material): MaterialListItem {
  return {
    id: material.id,
    name: material.name,
    imageUrl: material.imageUrl,
    shortDescription: material.shortDescription,
    categoryId: null,
    category: material.category,
    heights: [],
  };
}
