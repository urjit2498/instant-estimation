import type { Metadata } from "next";
import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageBackground } from "@/components/layout/PageBackground";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["500", "600"],
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// TODO: replace all business details below with the real business name, description, and OG image.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Instant Quote Engine — Instant Driveway Sealcoating Quotes",
    template: "%s | Instant Quote Engine",
  },
  description:
    "Get an instant, no-visit-required price estimate for driveway sealcoating. Enter your address, trace your driveway, and see your price in seconds.",
  openGraph: {
    title: "Instant Quote Engine — Instant Driveway Sealcoating Quotes",
    description:
      "Get an instant, no-visit-required price estimate for driveway sealcoating.",
    url: SITE_URL,
    siteName: "Instant Quote Engine",
    // TODO: add a real /public/og-image.png (1200x630) before launch.
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${plexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="relative flex min-h-full flex-col bg-paper text-asphalt-950">
        <PageBackground />
        <Header />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
