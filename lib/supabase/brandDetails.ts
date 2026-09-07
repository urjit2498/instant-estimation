import { callEdgeFunction } from "@/lib/supabase/edge";
import type { BrandDetailsData } from "@/types/brand";

/**
 * Calls the `get-brand-details` Edge Function (server-only).
 * Never invoke this from a client component — keep the key off the browser.
 */
export async function fetchBrandDetails(brandId: string): Promise<BrandDetailsData> {
  return callEdgeFunction<BrandDetailsData>("get-brand-details", { brand_id: brandId });
}
