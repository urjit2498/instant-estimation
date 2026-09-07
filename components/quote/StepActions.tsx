import type { ReactNode } from "react";
import { BackButton } from "@/components/quote/BackButton";

interface StepActionsProps {
  onBack: () => void;
  backDisabled?: boolean;
  message?: string | null;
  children: ReactNode;
}

/** Shared Back + primary CTA row. Optional status line sits above the buttons on phone. */
export function StepActions({ onBack, backDisabled, message, children }: StepActionsProps) {
  if (!message) {
    return (
      <div className="flex items-center justify-between gap-3">
        <BackButton onClick={onBack} disabled={backDisabled} />
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <p className="text-center text-sm text-asphalt-700 sm:order-2 sm:min-w-0 sm:flex-1 sm:text-left">
        {message}
      </p>
      <div className="flex items-center justify-between gap-3 sm:contents">
        <BackButton onClick={onBack} disabled={backDisabled} />
        <div className="sm:order-3">{children}</div>
      </div>
    </div>
  );
}
