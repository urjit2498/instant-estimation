import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";

interface PageFrameProps {
  children: ReactNode;
  brandName?: string | null;
  logoUrl?: string | null;
  brandId?: string | null;
}

/** Header + main so each quote page can pass the loaded brand into the chrome. */
export function PageFrame({ children, brandName, logoUrl, brandId }: PageFrameProps) {
  return (
    <>
      <Header brandName={brandName} logoUrl={logoUrl} brandId={brandId} />
      <main className="relative z-10 flex-1">{children}</main>
    </>
  );
}
