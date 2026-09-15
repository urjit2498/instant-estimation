import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/layout/PageFrame";
import { QuoteExperience } from "@/components/quote/QuoteExperience";
import { QuoteUnavailable } from "@/components/quote/QuoteUnavailable";
import { loadQuoteBrand } from "@/lib/brand/loadQuoteBrand";
import { metadataFromQuoteBrand } from "@/lib/brand/pageMetadata";
import { getAllContractorSlugs, getContractorBySlug } from "@/lib/mock/contractors";

export const dynamic = "force-dynamic";

interface QuotePageProps {
  params: Promise<{ contractorSlug: string }>;
  searchParams: Promise<{ address?: string; lat?: string; lng?: string }>;
}

export async function generateStaticParams() {
  return getAllContractorSlugs().map((contractorSlug) => ({ contractorSlug }));
}

export async function generateMetadata({ params }: QuotePageProps): Promise<Metadata> {
  const { contractorSlug } = await params;
  const listed = getContractorBySlug(contractorSlug);
  if (!listed) return {};

  const result = await loadQuoteBrand(listed.brandId);
  return metadataFromQuoteBrand(result, listed.brandId);
}

export default async function QuotePage({ params, searchParams }: QuotePageProps) {
  const { contractorSlug } = await params;
  const { address, lat, lng } = await searchParams;

  const listed = getContractorBySlug(contractorSlug);
  if (!listed) notFound();

  const result = await loadQuoteBrand(listed.brandId);
  const brand =
    result.status === "active" || result.status === "inactive" ? result.contractor : null;

  const frame = {
    brandName: brand?.name ?? listed.name,
    logoUrl: brand?.logoUrl ?? listed.logoUrl,
    brandId: listed.brandId,
  };

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
        <QuoteUnavailable variant="inactive" brandName={frame.brandName} />
      </PageFrame>
    );
  }

  if (result.status !== "active") {
    return (
      <PageFrame {...frame}>
        <QuoteUnavailable variant="error" />
      </PageFrame>
    );
  }

  const contractor = {
    ...result.contractor,
    slug: listed.slug,
    phone: listed.phone,
    email: listed.email,
  };

  const queryCenter = lat && lng ? { lat: Number(lat), lng: Number(lng) } : undefined;

  return (
    <PageFrame {...frame}>
      <QuoteExperience
        contractor={contractor}
        initialAddress={address ?? ""}
        initialCenter={queryCenter}
      />
    </PageFrame>
  );
}
