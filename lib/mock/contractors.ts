import type { Contractor } from "@/types/contractor";

/**
 * TODO: replace with a real lookup against the Supabase `contractors` / brands table once the
 * backend exists. Keyed by slug so app/quote/[contractorSlug]/page.tsx can do a simple lookup.
 *
 * `brandId` is the UUID passed to `get-brand-details`.
 */
export const MOCK_CONTRACTORS: Record<string, Contractor> = {
  "acme-sealcoating": {
    slug: "acme-sealcoating",
    name: "Test Brand",
    tagline: "Instant fence quotes from your property measurement",
    serviceArea: "Kalamazoo, MI and surrounding areas",
    phone: "(555) 010-2020",
    email: "quotes@test-brand.example",
    logoUrl: null,
    brandId: "6b71c69c-66de-41e8-a24b-0e7c8b3dd241",
    basePricePerSqFt: 0.22,
  },
  "summit-paving": {
    slug: "summit-paving",
    name: "Summit Paving & Sealcoating",
    tagline: "Fast, fair driveway quotes with no in-person visit required",
    serviceArea: "Denver metro area",
    phone: "(555) 040-8080",
    email: "hello@summit-paving.example",
    logoUrl: null,
    // Same test brand until each contractor has its own brand row.
    brandId: "6b71c69c-66de-41e8-a24b-0e7c8b3dd241",
    basePricePerSqFt: 0.27,
  },
};

export function getContractorBySlug(slug: string): Contractor | null {
  return MOCK_CONTRACTORS[slug] ?? null;
}

export function getAllContractorSlugs(): string[] {
  return Object.keys(MOCK_CONTRACTORS);
}
