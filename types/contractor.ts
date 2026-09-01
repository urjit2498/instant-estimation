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
  /** Base price per square foot, used by the mock pricing calculator. */
  basePricePerSqFt: number;
}
