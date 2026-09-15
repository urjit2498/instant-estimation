import { NextResponse } from "next/server";
import { QUOTES_UNAVAILABLE_API_ERROR } from "@/lib/brand/quotesUnavailable";
import { materialsFromBrandDetails } from "@/lib/materials/fromBrandDetails";
import { getContractorBySlug } from "@/lib/mock/contractors";
import { fetchBrandDetails } from "@/lib/supabase/brandDetails";
import { isSubscriptionActive } from "@/lib/subscription/isActive";

/**
 * Proxies `get-brand-details` and returns the public materials list for a brand.
 * Brands without an active subscription cannot load materials.
 *
 * Query: ?brandId=... OR ?contractorSlug=... (slug resolves to brandId via contractor mock).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandIdParam = searchParams.get("brandId");
  const contractorSlug = searchParams.get("contractorSlug");

  let brandId = brandIdParam;
  if (!brandId && contractorSlug) {
    const contractor = getContractorBySlug(contractorSlug);
    if (!contractor) {
      return NextResponse.json({ error: "Unknown contractor" }, { status: 404 });
    }
    brandId = contractor.brandId;
  }

  if (!brandId) {
    return NextResponse.json(
      { error: "brandId or contractorSlug is required" },
      { status: 400 },
    );
  }

  try {
    const details = await fetchBrandDetails(brandId);
    if (!isSubscriptionActive(details.subscription)) {
      return NextResponse.json({ error: QUOTES_UNAVAILABLE_API_ERROR }, { status: 403 });
    }

    return NextResponse.json(materialsFromBrandDetails(details.material ?? []));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load materials";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
