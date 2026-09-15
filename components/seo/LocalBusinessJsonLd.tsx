import type { Contractor } from "@/types/contractor";

interface LocalBusinessJsonLdProps {
  contractor: Contractor;
}

/**
 * schema.org LocalBusiness structured data for a contractor's quote page.
 */
export function LocalBusinessJsonLd({ contractor }: LocalBusinessJsonLdProps) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: contractor.name,
    description: contractor.tagline,
    areaServed: contractor.serviceArea,
  };

  if (contractor.phone) jsonLd.telephone = contractor.phone;
  if (contractor.email) jsonLd.email = contractor.email;
  if (contractor.logoUrl) jsonLd.image = contractor.logoUrl;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
