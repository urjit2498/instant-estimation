import type { Metadata } from "next";
import { PageFrame } from "@/components/layout/PageFrame";
import { QuoteExperience } from "@/components/quote/QuoteExperience";
import { QuoteUnavailable } from "@/components/quote/QuoteUnavailable";
import { loadQuoteBrand } from "@/lib/brand/loadQuoteBrand";
import { metadataFromQuoteBrand } from "@/lib/brand/pageMetadata";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<{
    brandId?: string;
    address?: string;
    lat?: string;
    lng?: string;
  }>;
}

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const { brandId } = await searchParams;
  const result = await loadQuoteBrand(brandId);
  return metadataFromQuoteBrand(result, brandId);
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { brandId, address, lat, lng } = await searchParams;
  const result = await loadQuoteBrand(brandId);
  const brand =
    result.status === "active" || result.status === "inactive" ? result.contractor : null;

  const frame = {
    brandName: brand?.name,
    logoUrl: brand?.logoUrl,
    brandId: brand?.brandId ?? brandId,
  };

  if (result.status === "missing_id") {
    return (
      <PageFrame {...frame}>
        <QuoteUnavailable variant="missing" />
      </PageFrame>
    );
  }

  if (result.status === "error") {
    return (
      <PageFrame {...frame}>
        <QuoteUnavailable variant="error" />
      </PageFrame>
    );
  }

  if (result.status === "inactive") {
    return (
      <PageFrame {...frame}>
        <QuoteUnavailable variant="inactive" brandName={brand?.name} />
      </PageFrame>
    );
  }

  const queryCenter = lat && lng ? { lat: Number(lat), lng: Number(lng) } : undefined;

  return (
    <PageFrame {...frame}>
      <QuoteExperience
        contractor={result.contractor}
        initialAddress={address ?? ""}
        initialCenter={queryCenter}
      />
    </PageFrame>
  );
}
