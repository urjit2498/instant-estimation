import type { BrandRecord } from "@/types/brand";
import type { Contractor } from "@/types/contractor";

function formatServiceArea(brand: BrandRecord): string {
  const parts = [brand.address, brand.zip_code ? String(brand.zip_code) : ""]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean);
  return parts.join(", ");
}

/** Maps `get-brand-details` brand payload onto the Contractor shape used by the quote UI. */
export function contractorFromBrand(brand: BrandRecord): Contractor {
  const serviceArea = formatServiceArea(brand);

  return {
    slug: brand.id,
    name: brand.name,
    tagline: "Instant quotes from your property measurement",
    serviceArea,
    phone: "",
    email: "",
    logoUrl: brand.logo || null,
    brandId: brand.id,
  };
}
