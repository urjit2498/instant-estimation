import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllContractorSlugs, getContractorBySlug } from "@/lib/mock/contractors";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { QuoteFlow } from "@/components/quote/QuoteFlow";

interface QuotePageProps {
  params: Promise<{ contractorSlug: string }>;
  searchParams: Promise<{ address?: string; lat?: string; lng?: string }>;
}

export async function generateStaticParams() {
  return getAllContractorSlugs().map((contractorSlug) => ({ contractorSlug }));
}

export async function generateMetadata({ params }: QuotePageProps): Promise<Metadata> {
  const { contractorSlug } = await params;
  const contractor = getContractorBySlug(contractorSlug);
  if (!contractor) return {};

  return {
    title: `Get a Quote from ${contractor.name}`,
    description: contractor.tagline,
  };
}

// The page shell (heading, contractor info, JSON-LD) is server-rendered so it stays crawlable.
// The measurement/material/estimate/contact experience inside <QuoteFlow> is necessarily a
// client component — Google Maps JS, canvas-based tracing, and multi-step form state all
// require the browser — but it is mounted inside this server-rendered shell rather than
// replacing the whole page, so crawlers still see the contractor name, description, and
// structured data even without executing JS.
export default async function QuotePage({ params, searchParams }: QuotePageProps) {
  const { contractorSlug } = await params;
  const { address, lat, lng } = await searchParams;

  const contractor = getContractorBySlug(contractorSlug);
  if (!contractor) notFound();

  const initialCenter = lat && lng ? { lat: Number(lat), lng: Number(lng) } : undefined;

  return (
    <div className="pb-10">
      <LocalBusinessJsonLd contractor={contractor} />

      <div className="mx-auto max-w-4xl px-4 pt-8 text-center sm:px-6">
        <h1 className="font-heading text-2xl font-bold text-asphalt-950">
          Get your quote from {contractor.name}
        </h1>
        <p className="mt-1 text-sm text-asphalt-700">{contractor.tagline}</p>
      </div>

      <QuoteFlow
        contractor={contractor}
        initialAddress={address ?? ""}
        initialCenter={initialCenter}
      />
    </div>
  );
}
