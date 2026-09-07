/**
 * A selectable product shown in the material step.
 * Sourced from `get-brand-details` (mapped server-side).
 */
export interface MaterialHeightOption {
  id: string;
  title: string;
  /** Unit price from backend — used only after server re-lookup for estimates. */
  price: number;
}

export interface MaterialListItem {
  id: string;
  name: string;
  imageUrl: string | null;
  shortDescription: string;
  /** Category UUID from brand material API. */
  categoryId: string | null;
  /** Resolved display label from static category list. */
  category: string | null;
  heights: MaterialHeightOption[];
}