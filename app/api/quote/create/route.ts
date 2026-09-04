import { NextResponse } from "next/server";
import { getContractorBySlug } from "@/lib/mock/contractors";
import { createQuote, toCreateQuotePayload } from "@/lib/supabase/createQuote";
import { validateContactInfo } from "@/lib/validation/contactForm";
import type { ContactInfo } from "@/types/quote";

interface CreateQuoteRequestBody {
  contractorSlug: string;
  contact: ContactInfo;
  materialId?: string;
  heightId?: string;
}

/**
 * Creates a lead/quote via the `create-quote` Edge Function.
 * `brand` must be the brand UUID (FK quote_brand_fkey) — not a material id.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as CreateQuoteRequestBody;
  const { contractorSlug, contact, materialId, heightId } = body;

  const contractor = getContractorBySlug(contractorSlug);
  if (!contractor) {
    return NextResponse.json({ error: "Unknown contractor" }, { status: 404 });
  }

  const errors = validateContactInfo(contact);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Invalid contact info", fields: errors }, { status: 400 });
  }

  try {
    const payload = toCreateQuotePayload(contact, contractor.brandId, {
      materialId,
      heightId,
    });
    if (!Number.isFinite(payload.phone_number) || payload.phone_number <= 0) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }
    if (!Number.isFinite(payload.zip_code) || payload.zip_code <= 0) {
      return NextResponse.json({ error: "Invalid zip code" }, { status: 400 });
    }

    const created = await createQuote(payload);
    return NextResponse.json({
      success: true,
      confirmationId: created.id,
      quote: created,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create quote";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
