import { NextResponse } from "next/server";
import { getContractorBySlug } from "@/lib/mock/contractors";
import { getMaterialById } from "@/lib/mock/materials";
import { calculateMockPrice } from "@/lib/mock/pricing";
import type { Measurement } from "@/types/quote";

/**
 * TODO: this entire route is a placeholder standing in for the backend dev's real pricing API.
 * Delete it (or keep it as a local fallback) once that API exists — the frontend just needs the
 * request/response shape below to stay compatible.
 *
 * Deliberately takes a `materialId`, not a client-supplied price — the server looks up the
 * material (and its price multiplier) itself, the same way the real pricing API should, so a
 * tampered client request can't set its own price.
 */

interface CalculateRequestBody {
  contractorSlug: string;
  measurement: Measurement;
  materialId: string;
}

// Small artificial delay so loading states are visible during development.
function simulateLatency() {
  return new Promise((resolve) => setTimeout(resolve, 500));
}

export async function POST(request: Request) {
  const body = (await request.json()) as CalculateRequestBody;
  const { contractorSlug, measurement, materialId } = body;

  const contractor = getContractorBySlug(contractorSlug);
  if (!contractor) {
    return NextResponse.json({ error: "Unknown contractor" }, { status: 404 });
  }
  if (!measurement || !materialId) {
    return NextResponse.json({ error: "Missing measurement or materialId" }, { status: 400 });
  }
  const material = getMaterialById(materialId);
  if (!material) {
    return NextResponse.json({ error: "Unknown material" }, { status: 404 });
  }

  await simulateLatency();

  const estimate = calculateMockPrice(contractor, measurement, material);
  return NextResponse.json(estimate);
}
