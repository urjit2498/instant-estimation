import { getCategoryTitle } from "@/lib/materials/categories";
import type { BrandMaterial } from "@/types/brand";
import type { MaterialListItem } from "@/types/material";

export function materialsFromBrandDetails(materials: BrandMaterial[]): MaterialListItem[] {
  return materials.map((m) => ({
    id: m.id,
    name: m.title,
    imageUrl: m.image || null,
    shortDescription: m.description,
    categoryId: m.category || null,
    category: getCategoryTitle(m.category),
    heights: m.height.map((h) => ({
      id: h.id,
      title: h.title,
      price: h.price,
    })),
  }));
}
