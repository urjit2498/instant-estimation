/**
 * Shapes returned by the Supabase Edge Function `get-brand-details`.
 */

export interface BrandHeightOption {
  id: string;
  created_at: string;
  title: string;
  /** Unit price used for estimate (typically per linear foot). */
  price: number;
  material: string;
}

export interface BrandMaterial {
  id: string;
  created_at: string;
  title: string;
  description: string;
  /** Category UUID from backend — not a display label. */
  category: string;
  brand: string;
  /** Public Supabase Storage URL for the material photo. */
  image: string | null;
  height: BrandHeightOption[];
}

export interface BrandRecord {
  id: string;
  created_at: string;
  name: string;
  address: string;
  zip_code: number;
  latitude: number;
  longitude: number;
  user: string;
  /** Public Supabase Storage URL for the brand logo. */
  logo?: string | null;
}

export interface BrandSubscription {
  id: string;
  created_at: string;
  brand: string;
  start_date: string;
  end_date: string;
}

export interface BrandDetailsData {
  brand: BrandRecord;
  /** Present only when the brand currently has a tool subscription. */
  subscription?: BrandSubscription | null;
  material: BrandMaterial[];
}

export interface BrandDetailsResponse {
  status: number;
  message: string;
  data: BrandDetailsData | null;
}
