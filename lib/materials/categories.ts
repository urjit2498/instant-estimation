/**
 * Static material categories until a categories API exists.
 * Titles use corrected spelling where the source data had typos (Vinel → Vinyl).
 */
export interface MaterialCategory {
  id: string;
  title: string;
  index: number;
}

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  {
    id: "4155b0be-8860-42ff-8c87-062010ea755d",
    title: "Wood",
    index: 1,
  },
  {
    id: "fa853aa7-af9c-4f0c-970d-a4df457432c2",
    title: "Vinyl",
    index: 2,
  },
  {
    id: "6a987f2d-505f-4df1-9251-7054dbaf6bd5",
    title: "Chain Link",
    index: 3,
  },
].sort((a, b) => a.index - b.index);

const CATEGORY_BY_ID = new Map(MATERIAL_CATEGORIES.map((c) => [c.id, c]));

export function getCategoryTitle(categoryId: string | null | undefined): string | null {
  if (!categoryId) return null;
  return CATEGORY_BY_ID.get(categoryId)?.title ?? null;
}
