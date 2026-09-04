import { getSupabaseServerEnv } from "@/lib/env";
import { callEdgeFunction } from "@/lib/supabase/edge";
import type { BrandDetailsData, BrandMaterial } from "@/types/brand";

/**
 * Calls the `get-brand-details` Edge Function (server-only).
 * Never invoke this from a client component — keep the key off the browser.
 */
export async function fetchBrandDetails(brandId: string): Promise<BrandDetailsData> {
  // Keep env check so missing keys fail early with a clear message.
  getSupabaseServerEnv();
  return callEdgeFunction<BrandDetailsData>("get-brand-details", { brand_id: brandId });
}

export function findBrandMaterial(
  materials: BrandMaterial[],
  materialId: string,
): BrandMaterial | undefined {
  return materials.find((m) => m.id === materialId);
}

export function findBrandHeight(material: BrandMaterial, heightId: string) {
  return material.height.find((h) => h.id === heightId);
}
