import type { Metadata } from "next";
import type { QuoteBrandLoadResult } from "@/lib/brand/loadQuoteBrand";

function brandIcons(brandId?: string): Metadata["icons"] | undefined {
  if (!brandId) return undefined;
  const url = `/brand-icon?brandId=${encodeURIComponent(brandId)}`;
  return {
    icon: [{ url }],
    apple: [{ url }],
    shortcut: url,
  };
}

export function metadataFromQuoteBrand(
  result: QuoteBrandLoadResult,
  brandId?: string,
): Metadata {
  const icons = brandIcons(brandId);
  const contractor =
    result.status === "active" || result.status === "inactive" ? result.contractor : null;

  if (contractor) {
    const title = `Get a Quote from ${contractor.name}`;
    return {
      title: { absolute: title },
      description: contractor.tagline,
      applicationName: contractor.name,
      icons,
      openGraph: {
        siteName: contractor.name,
        title,
        description: contractor.tagline,
      },
    };
  }

  return {
    title: { absolute: "Get an Instant Quote" },
    description:
      "Pick your address, trace your driveway, and get an instant price estimate — no in-person visit required.",
    icons,
  };
}
