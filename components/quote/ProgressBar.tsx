const STEP_LABELS = ["Method", "Measure", "Material", "Contact", "Estimate"] as const;

interface ProgressBarProps {
  /** 0-indexed current step, or STEP_LABELS.length to show the bar fully complete (confirmation). */
  currentStepIndex: number;
}

/**
 * The one deliberate gradient in the whole UI (see globals.css .progress-fill-gradient) — spent
 * here rather than scattered across every card.
 */
export function ProgressBar({ currentStepIndex }: ProgressBarProps) {
  const total = STEP_LABELS.length;
  const clampedIndex = Math.min(currentStepIndex, total - 1);
  const stepNumber = Math.min(currentStepIndex + 1, total);
  const filledFraction = Math.min(currentStepIndex + 1, total) / total;
  const currentLabel = STEP_LABELS[clampedIndex];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-6 sm:px-6" aria-hidden={false}>
      <div
        role="progressbar"
        aria-valuenow={stepNumber}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Estimate progress, step ${stepNumber} of ${total}: ${currentLabel}`}
        className="relative h-1.5 w-full overflow-hidden rounded-full bg-asphalt-200"
      >
        <div
          className="progress-fill-gradient h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${filledFraction * 100}%` }}
        />
      </div>
      <p className="mt-2 text-center text-[11px] font-medium text-asphalt-950 sm:hidden">
        Step {stepNumber} of {total} · {currentLabel}
      </p>
      <ol className="mt-2 hidden justify-between text-[11px] font-medium text-asphalt-700 sm:flex">
        {STEP_LABELS.map((label, i) => (
          <li
            key={label}
            className={i <= currentStepIndex ? "text-asphalt-950" : "text-asphalt-300"}
          >
            {label}
          </li>
        ))}
      </ol>
    </div>
  );
}
