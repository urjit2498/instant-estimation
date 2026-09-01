import { NextResponse } from "next/server";
import { getContractorBySlug } from "@/lib/mock/contractors";
import { validateContactForm } from "@/lib/validation/contactForm";
import type { QuoteSubmission, QuoteSubmissionResult } from "@/types/quote";

/**
 * TODO: this entire route is a placeholder standing in for the backend dev's real save-to-Supabase
 * + send-confirmation-email API. Delete it once that API exists. Real implementation will need:
 *  - server-side validation (not just the client-side checks reused here)
 *  - writing the submission to Supabase
 *  - triggering a confirmation email
 *  - CORS/auth considerations if this is ever called from an embedded widget on a contractor's
 *    own domain rather than same-origin
 */

function simulateLatency() {
  return new Promise((resolve) => setTimeout(resolve, 700));
}

export async function POST(request: Request) {
  const body = (await request.json()) as QuoteSubmission;
  const { contractorSlug, contact, measurement, materialId, priceEstimate } = body;

  const contractor = getContractorBySlug(contractorSlug);
  if (!contractor) {
    return NextResponse.json({ error: "Unknown contractor" }, { status: 404 });
  }

  const errors = validateContactForm(contact);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Invalid contact info", fields: errors }, { status: 400 });
  }

  if (!measurement || !materialId || !priceEstimate) {
    return NextResponse.json({ error: "Missing quote data" }, { status: 400 });
  }

  await simulateLatency();

  const result: QuoteSubmissionResult = {
    success: true,
    confirmationId: `mock-conf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
  return NextResponse.json(result);
}
