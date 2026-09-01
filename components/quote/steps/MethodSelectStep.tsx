import { SelectCard } from "@/components/quote/SelectCard";
import type { MeasurementMethod } from "@/types/quote";

interface MethodSelectStepProps {
  onSelect: (method: MeasurementMethod) => void;
}

const METHODS: {
  value: MeasurementMethod;
  title: string;
  description: string;
  cornerBadge?: string;
}[] = [
  {
    value: "draw",
    title: "Draw on the map",
    description: "Trace your driveway on a satellite view. Fastest and most accurate.",
    cornerBadge: "Recommended",
  },
  {
    value: "upload",
    title: "Upload a survey",
    description: "Have a plot plan or survey image? Upload it and trace over it.",
  },
  {
    value: "manual",
    title: "Enter it myself",
    description: "Already know the square footage? Type it in directly.",
  },
];

export function MethodSelectStep({ onSelect }: MethodSelectStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-heading text-xl font-semibold text-asphalt-950">
          How would you like to measure your driveway?
        </h2>
        <p className="mt-1 text-sm text-asphalt-700">Pick whichever is easiest for you.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {METHODS.map((method) => (
          <SelectCard
            key={method.value}
            selected={false}
            onSelect={() => onSelect(method.value)}
            cornerBadge={method.cornerBadge}
          >
            <span className="font-heading text-base font-semibold text-asphalt-950">
              {method.title}
            </span>
            <span className="text-sm text-asphalt-700">{method.description}</span>
          </SelectCard>
        ))}
      </div>
    </div>
  );
}
