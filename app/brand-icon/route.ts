import { NextResponse } from "next/server";
import { loadQuoteBrand } from "@/lib/brand/loadQuoteBrand";

/**
 * Same-origin favicon for a brand. Uses the brand logo when present, otherwise the
 * default IQ mark at `/icon`.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get("brandId") ?? undefined;
  const fallback = NextResponse.redirect(new URL("/icon", request.url));

  if (!brandId) return fallback;

  const result = await loadQuoteBrand(brandId);
  const logoUrl =
    result.status === "active" || result.status === "inactive"
      ? result.contractor.logoUrl
      : null;

  if (!logoUrl) return fallback;

  try {
    const imageRes = await fetch(logoUrl, { cache: "no-store" });
    if (!imageRes.ok || !imageRes.body) return fallback;

    const contentType = imageRes.headers.get("content-type") || "image/png";
    return new NextResponse(imageRes.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return fallback;
  }
}
