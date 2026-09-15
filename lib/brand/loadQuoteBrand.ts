import { contractorFromBrand } from "@/lib/brand/contractorFromBrand";
import { fetchBrandDetails } from "@/lib/supabase/brandDetails";
import { isSubscriptionActive } from "@/lib/subscription/isActive";
import type { Contractor } from "@/types/contractor";

export type QuoteBrandLoadResult =
  | { status: "missing_id" }
  | { status: "error" }
  | { status: "inactive"; contractor: Contractor }
  | {
      status: "active";
      contractor: Contractor;
      brandCenter?: { lat: number; lng: number };
    };

export async function loadQuoteBrand(
  brandId: string | undefined,
): Promise<QuoteBrandLoadResult> {
  if (!brandId) return { status: "missing_id" };

  try {
    const details = await fetchBrandDetails(brandId);
    const contractor = contractorFromBrand(details.brand);
    const lat = details.brand.latitude;
    const lng = details.brand.longitude;
    const brandCenter =
      Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : undefined;

    if (!isSubscriptionActive(details.subscription)) {
      return { status: "inactive", contractor };
    }

    return { status: "active", contractor, brandCenter };
  } catch {
    return { status: "error" };
  }
}
