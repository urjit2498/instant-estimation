import { digitsOnly } from "@/lib/phone/format";
import { callEdgeFunction } from "@/lib/supabase/edge";
import type { ContactInfo, PriceEstimate } from "@/types/quote";

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
  brand_material: string;
  brand_material_height: string;
  estimated_sq_ft: string;
}

export interface CreatedQuoteMaterial {
  id: string;
  brand: string;
  image: string;
  title: string;
  category: string;
  created_at: string;
  description: string;
}

export interface CreatedQuoteHeight {
  id: string;
  price: number;
  title: string;
  material: string;
  created_at: string;
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
  brand_material: CreatedQuoteMaterial;
  brand_material_height: CreatedQuoteHeight;
  estimated_sq_ft: number;
  /** Edge function returns this exact key (space included). */
  "Estimated price": number;
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
  options: {
    materialId: string;
    heightId: string;
    estimatedSqFt: number;
  },
): CreateQuotePayload {
  const { firstName, lastName } = splitFullName(contact.name);

  return {
    first_name: firstName,
    last_name: lastName,
    phone_number: phoneToApiNumber(contact.phoneNational),
    address: contact.propertyAddress,
    zip_code: Number(contact.zipCode),
    email: contact.email,
    note: contact.notes?.trim() || "",
    connected_by: "website",
    brand: brandId,
    brand_material: options.materialId,
    brand_material_height: options.heightId,
    estimated_sq_ft: String(Math.round(options.estimatedSqFt)),
  };
}

/** Maps create-quote response into the shape used by the estimate screen. */
export function createdQuoteToPriceEstimate(
  created: CreatedQuote,
  quantityUnit: "ft" | "sq ft",
): PriceEstimate {
  const price = created["Estimated price"];
  const material = created.brand_material;
  const height = created.brand_material_height;

  return {
    price,
    currency: "USD",
    breakdown: {
      quantity: created.estimated_sq_ft,
      quantityUnit,
      ratePerUnit: height.price,
      materialName: `${material.title} (${height.title})`,
      heightTitle: height.title,
      subtotal: price,
    },
    estimateId: created.id,
  };
}

export async function createQuote(payload: CreateQuotePayload): Promise<CreatedQuote> {
  return callEdgeFunction<CreatedQuote>("create-quote", payload);
}
