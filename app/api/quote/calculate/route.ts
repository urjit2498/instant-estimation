import { NextResponse } from "next/server";
import { getContractorBySlug } from "@/lib/mock/contractors";
import { calculateBrandPrice } from "@/lib/pricing/brandPrice";
import {
  fetchBrandDetails,
  findBrandHeight,
  findBrandMaterial,
} from "@/lib/supabase/brandDetails";
import type { Measurement } from "@/types/quote";

/**
 * Server-side estimate using brand material heights from `get-brand-details`.
 * Client sends materialId + heightId only — unit price is looked up on the server.
 */

interface CalculateRequestBody {
  contractorSlug: string;
  measurement: Measurement;
  materialId: string;
  heightId: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as CalculateRequestBody;
  const { contractorSlug, measurement, materialId, heightId } = body;

  const contractor = getContractorBySlug(contractorSlug);
  if (!contractor) {
    return NextResponse.json({ error: "Unknown contractor" }, { status: 404 });
  }
  if (!measurement || !materialId || !heightId) {
    return NextResponse.json(
      { error: "Missing measurement, materialId, or heightId" },
      { status: 400 },
    );
  }

  try {
    const details = await fetchBrandDetails(contractor.brandId);
    const material = findBrandMaterial(details.material, materialId);
    if (!material) {
      return NextResponse.json({ error: "Unknown material" }, { status: 404 });
    }
    const height = findBrandHeight(material, heightId);
    if (!height) {
      return NextResponse.json({ error: "Unknown height option" }, { status: 404 });
    }

    const estimate = calculateBrandPrice(measurement, material, height);
    return NextResponse.json(estimate);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to calculate estimate";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
