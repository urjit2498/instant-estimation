import Link from "next/link";

// TODO: replace with real business name/logo once branding is finalized.
const SITE_NAME = "Instant Quote Engine";

export function Header() {
  return (
    <header className="header-gradient-band border-b border-asphalt-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          {/* TODO: replace with a real logo mark once branding is finalized. */}
          <span className="badge-gradient flex h-8 w-8 shrink-0 items-center justify-center rounded-md font-heading text-sm font-bold text-white">
            IQ
          </span>
          <span className="font-heading truncate text-lg font-semibold text-paper">{SITE_NAME}</span>
        </Link>

        <span className="badge-gradient hidden rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white sm:inline-block">
          Instant Estimate — No Obligation
        </span>
      </div>
    </header>
  );
}
