/** User-facing copy when a brand cannot use the tool. Never mention payment or subscription. */

export const QUOTES_UNAVAILABLE_API_ERROR =
  "Quotes are not available right now. Please contact the contractor to continue.";

export const QUOTES_UNAVAILABLE_TITLE = "Instant quotes aren't available right now";

export function quotesUnavailableBody(brandName?: string | null): string {
  if (brandName) {
    return `Please contact ${brandName} to continue with your estimate.`;
  }
  return "Please contact your contractor to continue with your estimate.";
}
