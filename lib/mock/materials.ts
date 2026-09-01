import type { Material, MaterialListItem } from "@/types/material";

/**
 * TODO: this whole file is a placeholder for a real materials catalog API. Content (names,
 * descriptions, categories, images) is illustrative sealcoating-industry copy, not sourced from
 * any real contractor's actual product line.
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
  {
    id: "premium-polymer-sealcoat",
    name: "Premium Polymer-Modified Sealcoat",
    imageUrl: null,
    shortDescription: "Extra-durable formula with added flexibility for hot/cold climates.",
    category: "Sealcoat",
    priceMultiplier: 1.35,
  },
  {
    id: "asphalt-rejuvenator",
    name: "Asphalt Rejuvenator",
    imageUrl: null,
    shortDescription: "Penetrating oil treatment that restores flexibility without a black coating.",
    category: "Rejuvenator",
    priceMultiplier: 0.85,
  },
  {
    id: "crack-fill-and-seal-bundle",
    name: "Crack Fill + Standard Seal Bundle",
    imageUrl: null,
    shortDescription: "Hot-pour crack filling followed by a standard sealcoat application.",
    category: "Bundle",
    priceMultiplier: 1.2,
  },
];

export function getMaterialById(id: string): Material | null {
  return MOCK_MATERIALS.find((m) => m.id === id) ?? null;
}

/** Strips the internal-only priceMultiplier before sending to the client. */
export function toMaterialListItem(material: Material): MaterialListItem {
  return {
    id: material.id,
    name: material.name,
    imageUrl: material.imageUrl,
    shortDescription: material.shortDescription,
    category: material.category,
  };
}
