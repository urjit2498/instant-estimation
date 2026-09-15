import { NextResponse } from "next/server";
import { QUOTES_UNAVAILABLE_API_ERROR } from "@/lib/brand/quotesUnavailable";
import { getContractorBySlug } from "@/lib/mock/contractors";
import { getMeasurementQuantity } from "@/lib/pricing/brandPrice";
import {
  createQuote,
  createdQuoteToPriceEstimate,
  toCreateQuotePayload,
} from "@/lib/supabase/createQuote";
import { fetchBrandDetails } from "@/lib/supabase/brandDetails";
import { isSubscriptionActive } from "@/lib/subscription/isActive";
import { validateContactInfo } from "@/lib/validation/contactForm";
import type { ContactInfo, Measurement } from "@/types/quote";

interface CreateQuoteRequestBody {
  brandId?: string;
  contractorSlug?: string;
  contact: ContactInfo;
  materialId: string;
  heightId: string;
  measurement: Measurement;
}

/**
 * Creates a lead/quote via the `create-quote` Edge Function.
 * Returns the server-computed estimate (`Estimated price`) for the estimate screen.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as CreateQuoteRequestBody;
  const { contact, materialId, heightId, measurement } = body;

  let brandId = body.brandId;
  if (!brandId && body.contractorSlug) {
    const contractor = getContractorBySlug(body.contractorSlug);
    if (!contractor) {
      return NextResponse.json({ error: "Unknown contractor" }, { status: 404 });
    }
    brandId = contractor.brandId;
  }

  if (!brandId) {
    return NextResponse.json({ error: "brandId is required" }, { status: 400 });
  }

  if (!materialId || !heightId || !measurement) {
    return NextResponse.json(
      { error: "Missing materialId, heightId, or measurement" },
      { status: 400 },
    );
  }

  const errors = validateContactInfo(contact);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Invalid contact info", fields: errors }, { status: 400 });
  }

  const { quantity, quantityUnit } = getMeasurementQuantity(measurement);
  if (!(quantity > 0)) {
    return NextResponse.json({ error: "Invalid measurement quantity" }, { status: 400 });
  }

  try {
    const details = await fetchBrandDetails(brandId);
    if (!isSubscriptionActive(details.subscription)) {
      return NextResponse.json({ error: QUOTES_UNAVAILABLE_API_ERROR }, { status: 403 });
    }

    const payload = toCreateQuotePayload(contact, brandId, {
      materialId,
      heightId,
      estimatedSqFt: quantity,
    });
    if (!Number.isFinite(payload.phone_number) || payload.phone_number <= 0) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }
    if (!Number.isFinite(payload.zip_code) || payload.zip_code <= 0) {
      return NextResponse.json({ error: "Invalid zip code" }, { status: 400 });
    }

    const created = await createQuote(payload);
    const estimate = createdQuoteToPriceEstimate(created, quantityUnit);

    return NextResponse.json({
      success: true,
      confirmationId: created.id,
      quote: created,
      estimate,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create quote";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
