import type { Metadata } from "next";
import Link from "next/link";
import { getAllContractorSlugs } from "@/lib/mock/contractors";

export const metadata: Metadata = {
  title: "Get an Instant Driveway Sealcoating Quote",
  description:
    "Pick your address, trace your driveway, and get an instant sealcoating price estimate — no in-person visit required.",
};

/**
 * TODO (product decision, not just code): in the real product, which contractor's quote flow a
 * homeowner lands on will presumably be determined by which contractor's site/link they came
 * from (e.g. contractorSlug baked into the embed URL), not chosen here. For this frontend-only
 * phase there's no contractor picker, so the CTA below just points at the first demo contractor
 * to keep the flow clickable end-to-end. Revisit once the real entry point is defined.
 */
const DEMO_CONTRACTOR_SLUG = getAllContractorSlugs()[0];

// Fully server-rendered — no client component on this page at all, so the marketing copy is
// crawlable with zero JS. The interactive quote flow lives entirely behind the CTA below.
export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 px-4 py-20 text-center sm:px-6">
      <div className="flex flex-col gap-4">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-asphalt-950 sm:text-4xl">
          Get your driveway sealcoating price in under a minute
        </h1>
        <p className="text-lg text-asphalt-700">
          No waiting for a contractor to visit. Measure your driveway your way, pick a material,
          and see an instant estimate.
        </p>
      </div>

      <Link
        href={`/quote/${DEMO_CONTRACTOR_SLUG}`}
        className="rounded-md bg-asphalt-950 px-8 py-3.5 text-base font-medium text-paper shadow-sm transition hover:bg-asphalt-800"
      >
        Start My Estimate
      </Link>

      <ol className="mt-4 grid grid-cols-1 gap-6 text-left sm:grid-cols-3">
        <li>
          <p className="font-heading text-sm font-semibold text-asphalt-950">1. Measure</p>
          <p className="mt-1 text-sm text-asphalt-700">
            Draw on a satellite map, upload a survey, or type in the square footage — your choice.
          </p>
        </li>
        <li>
          <p className="font-heading text-sm font-semibold text-asphalt-950">2. Pick a material</p>
          <p className="mt-1 text-sm text-asphalt-700">
            Choose from our sealcoating options — one quick step.
          </p>
        </li>
        <li>
          <p className="font-heading text-sm font-semibold text-asphalt-950">3. Get your price</p>
          <p className="mt-1 text-sm text-asphalt-700">
            See an instant estimate and request a follow-up.
          </p>
        </li>
      </ol>
    </div>
  );
}
