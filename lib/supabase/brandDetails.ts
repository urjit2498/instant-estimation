import { cache } from "react";
import { callEdgeFunction } from "@/lib/supabase/edge";
import type { BrandDetailsData } from "@/types/brand";

/**
 * Calls the `get-brand-details` Edge Function (server-only).
 * Never invoke this from a client component — keep the key off the browser.
 * Wrapped in React `cache()` so metadata and the page share one request per render.
 */
export const fetchBrandDetails = cache(async (brandId: string): Promise<BrandDetailsData> => {
  return callEdgeFunction<BrandDetailsData>("get-brand-details", { brand_id: brandId });
});
