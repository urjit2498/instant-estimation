import { digitsOnly } from "@/lib/phone/format";
import { callEdgeFunction } from "@/lib/supabase/edge";
import type { ContactInfo } from "@/types/quote";

export interface CreateQuotePayload {
  first_name: string;
  last_name: string;
  phone_number: number;
  address: string;
  zip_code: number;
  email: string;
  note: string;
  connected_by: string;
  brand: string;
}

export interface CreatedQuote {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  phone_number: number;
  address: string;
  zip_code: number;
  email: string;
  note: string;
  connected_by: string;
  brand: string;
}

export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "-" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

/** National digits as a number for create-quote (e.g. 5551234567). */
export function phoneToApiNumber(phoneNational: string): number {
  const digits = digitsOnly(phoneNational);
  return Number(digits);
}

export function toCreateQuotePayload(
  contact: ContactInfo,
  brandId: string,
  options?: { materialId?: string; heightId?: string },
): CreateQuotePayload {
  const { firstName, lastName } = splitFullName(contact.name);
  const userNote = contact.notes?.trim() || "";
  const metaParts: string[] = [];
  if (options?.materialId) metaParts.push(`material_id=${options.materialId}`);
  if (options?.heightId) metaParts.push(`height_id=${options.heightId}`);
  const note =
    metaParts.length > 0
      ? [userNote, `[${metaParts.join(", ")}]`].filter(Boolean).join(" ")
      : userNote;

  return {
    first_name: firstName,
    last_name: lastName,
    phone_number: phoneToApiNumber(contact.phoneNational),
    address: contact.propertyAddress,
    zip_code: Number(contact.zipCode),
    email: contact.email,
    note,
    connected_by: "website",
    // Must be a row in `brand` — quote_brand_fkey rejects material UUIDs.
    brand: brandId,
  };
}

export async function createQuote(payload: CreateQuotePayload): Promise<CreatedQuote> {
  return callEdgeFunction<CreatedQuote>("create-quote", payload);
}
