import type { MetadataRoute } from "next";
import { getAllContractorSlugs } from "@/lib/mock/contractors";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// TODO: once contractors live in Supabase, replace getAllContractorSlugs() with a real query.
export default function sitemap(): MetadataRoute.Sitemap {
  const contractorRoutes: MetadataRoute.Sitemap = getAllContractorSlugs().map((slug) => ({
    url: `${SITE_URL}/quote/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...contractorRoutes,
  ];
}
