import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { QuoteFlow } from "@/components/quote/QuoteFlow";
import type { Contractor } from "@/types/contractor";

interface QuoteExperienceProps {
  contractor: Contractor;
  initialAddress?: string;
  initialCenter?: { lat: number; lng: number };
}

export function QuoteExperience({
  contractor,
  initialAddress = "",
  initialCenter,
}: QuoteExperienceProps) {
  return (
    <div className="pb-10">
      <LocalBusinessJsonLd contractor={contractor} />

      <div className="mx-auto max-w-4xl px-4 pt-8 text-center sm:px-6">
        <h1 className="font-heading text-2xl font-bold text-asphalt-950">
          Get your quote from {contractor.name}
        </h1>
      </div>

      <QuoteFlow
        contractor={contractor}
        initialAddress={initialAddress}
        initialCenter={initialCenter}
      />
    </div>
  );
}
