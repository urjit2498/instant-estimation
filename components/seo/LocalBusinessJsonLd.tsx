import type { Contractor } from "@/types/contractor";

interface LocalBusinessJsonLdProps {
  contractor: Contractor;
}

/**
 * schema.org LocalBusiness structured data for a contractor's quote page.
 * TODO: fill in real fields (address, geo coordinates, priceRange, sameAs social links, real
 * logo/image URLs) once actual business details are available — everything here beyond name
 * comes straight from the mock contractor data.
 */
export function LocalBusinessJsonLd({ contractor }: LocalBusinessJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: contractor.name,
    description: contractor.tagline,
    telephone: contractor.phone,
    email: contractor.email,
    areaServed: contractor.serviceArea,
    // TODO: real "@type" is likely more specific, e.g. "PavingContractor" — confirm with the business.
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
