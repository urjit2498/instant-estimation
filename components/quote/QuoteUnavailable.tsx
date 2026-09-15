import {
  QUOTES_UNAVAILABLE_TITLE,
  quotesUnavailableBody,
} from "@/lib/brand/quotesUnavailable";

type QuoteUnavailableVariant = "inactive" | "missing" | "error";

interface QuoteUnavailableProps {
  variant: QuoteUnavailableVariant;
  brandName?: string | null;
}

const COPY: Record<
  QuoteUnavailableVariant,
  { title: string; body: (brandName?: string | null) => string }
> = {
  inactive: {
    title: QUOTES_UNAVAILABLE_TITLE,
    body: quotesUnavailableBody,
  },
  missing: {
    title: "This estimate link is incomplete",
    body: () => "Please use the quote link provided by your contractor.",
  },
  error: {
    title: "We couldn't load this quote page",
    body: () => "Please try again, or use the quote link provided by your contractor.",
  },
};

export function QuoteUnavailable({ variant, brandName }: QuoteUnavailableProps) {
  const copy = COPY[variant];

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-5 px-4 py-20 text-center sm:px-6">
      <h1 className="font-heading text-2xl font-bold text-asphalt-950">{copy.title}</h1>
      <p className="text-sm text-asphalt-700">{copy.body(brandName)}</p>
    </div>
  );
}
