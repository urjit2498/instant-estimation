/**
 * A selectable sealcoating material/product, shown as a single-select card grid in step 3.
 * TODO: this will come from a real backend catalog eventually; lib/mock/materials.ts stands in.
 *
 * `imageUrl` matches the shape the backend dev agreed to return (id, name, imageUrl,
 * shortDescription, category). `priceMultiplier` is an EXTRA field beyond that contract, used
 * only by our mock pricing route — deliberately never sent to the client as part of a price the
 * client could tamper with; the real pricing API should look up material cost server-side by id
 * the same way our mock does in lib/mock/pricing.ts.
 */
export interface Material {
  id: string;
  name: string;
  imageUrl: string | null;
  shortDescription: string;
  category: string;
  priceMultiplier: number;
}

/** Public shape returned by GET /api/materials — omits priceMultiplier (see note above). */
export type MaterialListItem = Omit<Material, "priceMultiplier">;
