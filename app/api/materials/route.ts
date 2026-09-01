import { NextResponse } from "next/server";
import { MOCK_MATERIALS, toMaterialListItem } from "@/lib/mock/materials";

/**
 * TODO: placeholder standing in for the backend dev's real materials catalog API. Response
 * shape: { id, name, imageUrl, shortDescription, category }[] — matches what was agreed on.
 * Pricing (priceMultiplier) is intentionally never included here; see lib/mock/materials.ts.
 */

function simulateLatency() {
  return new Promise((resolve) => setTimeout(resolve, 350));
}

export async function GET() {
  await simulateLatency();
  return NextResponse.json(MOCK_MATERIALS.map(toMaterialListItem));
}
