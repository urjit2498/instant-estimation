import { NextResponse } from "next/server";
import { getCategoryTitle } from "@/lib/materials/categories";
import { getContractorBySlug } from "@/lib/mock/contractors";
import { fetchBrandDetails } from "@/lib/supabase/brandDetails";
import type { MaterialListItem } from "@/types/material";

/**
 * Proxies `get-brand-details` and returns the public materials list for a contractor/brand.
 * Pricing stays on the server for estimate calculation — heights include unit prices here so
 * the UI can show options; the calculate route re-fetches and re-validates before quoting.
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
    const materials: MaterialListItem[] = details.material.map((m) => ({
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
    return NextResponse.json(materials);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load materials";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
