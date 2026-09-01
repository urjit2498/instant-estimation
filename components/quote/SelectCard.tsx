import type { ReactNode } from "react";

interface SelectCardProps {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
  cornerBadge?: string;
}

/**
 * Shared "pick one of N" card used by the method-selection and material-selection steps.
 * Crisp solid border rather than a soft drop shadow — deliberately not the generic
 * rounded-card-with-gradient-wash look.
 */
export function SelectCard({ selected, onSelect, children, cornerBadge }: SelectCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative flex flex-col gap-2 rounded-xl border-2 bg-paper-raised p-4 text-left transition-colors ${
        selected
          ? "border-accent ring-2 ring-accent/40"
          : "border-asphalt-200 hover:border-asphalt-700"
      }`}
    >
      {cornerBadge && (
        <span className="absolute -top-2.5 right-3 rounded-full bg-asphalt-950 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-bright">
          {cornerBadge}
        </span>
      )}
      {children}
    </button>
  );
}
