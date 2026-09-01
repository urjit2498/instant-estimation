import type { Contractor } from "@/types/contractor";

/**
 * TODO: replace with a real lookup against the Supabase `contractors` table once the
 * backend exists. Keyed by slug so app/quote/[contractorSlug]/page.tsx can do a simple lookup.
 */
export const MOCK_CONTRACTORS: Record<string, Contractor> = {
  "acme-sealcoating": {
    slug: "acme-sealcoating",
    name: "Acme Sealcoating",
    tagline: "Springfield's trusted driveway sealcoating crew since 2010",
    serviceArea: "Springfield, IL and surrounding counties",
    phone: "(555) 010-2020",
    email: "quotes@acme-sealcoating.example",
    logoUrl: null,
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
    basePricePerSqFt: 0.27,
  },
};

export function getContractorBySlug(slug: string): Contractor | null {
  return MOCK_CONTRACTORS[slug] ?? null;
}

export function getAllContractorSlugs(): string[] {
  return Object.keys(MOCK_CONTRACTORS);
}
