import type { BrandSubscription } from "@/types/brand";

function parseBoundary(value: string | undefined | null): number | null {
  if (!value) return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

/**
 * A brand can use the quote tool only when `get-brand-details` returns a subscription
 * object that has not expired (and has started, if start_date is present).
 */
export function isSubscriptionActive(
  subscription: BrandSubscription | null | undefined,
): boolean {
  if (!subscription || typeof subscription !== "object" || !subscription.id) {
    return false;
  }

  const now = Date.now();
  const start = parseBoundary(subscription.start_date);
  if (start != null && now < start) return false;

  if (subscription.end_date) {
    const end = parseBoundary(subscription.end_date);
    if (end == null || now > end) return false;
  }

  return true;
}
