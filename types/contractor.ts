/**
 * A contractor (tenant) using the Instant Quote Engine.
 * TODO: this will eventually be a Supabase table (`contractors`) looked up by slug;
 * lib/mock/contractors.ts stands in for that until the backend exists.
 */
export interface Contractor {
  slug: string;
  name: string;
  tagline: string;
  serviceArea: string;
  phone: string;
  email: string;
  /** TODO: replace with a real uploaded logo once branding is finalized. */
  logoUrl: string | null;
  /**
   * Supabase brand UUID used by `get-brand-details`.
   * Materials/pricing for this contractor are loaded for this brand.
   */
  brandId: string;
  /** @deprecated Prefer height unit prices from brand materials. Kept for local fallback. */
  basePricePerSqFt: number;
}
