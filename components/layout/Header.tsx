import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";

const FALLBACK_NAME = "Instant Quote Engine";

interface HeaderProps {
  brandName?: string | null;
  logoUrl?: string | null;
  brandId?: string | null;
}

export function Header({ brandName, logoUrl, brandId }: HeaderProps) {
  const name = brandName?.trim() || FALLBACK_NAME;
  const href = brandId ? `/?brandId=${encodeURIComponent(brandId)}` : "/";

  return (
    <header className="header-gradient-band border-b border-asphalt-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href={href} className="flex min-w-0 items-center gap-2.5">
          {logoUrl ? (
            <BrandLogo
              src={
                brandId
                  ? `/brand-icon?brandId=${encodeURIComponent(brandId)}`
                  : logoUrl
              }
              alt={`${name} logo`}
            />
          ) : null}
          <span className="font-heading truncate text-lg font-semibold text-paper">{name}</span>
        </Link>

        <span className="badge-gradient hidden rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white sm:inline-block">
          Instant Estimate — No Obligation
        </span>
      </div>
    </header>
  );
}
