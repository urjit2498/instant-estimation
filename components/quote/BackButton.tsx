interface BackButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function BackButton({ onClick, disabled }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="btn-secondary inline-flex shrink-0 items-center gap-1.5 rounded-md px-5 py-2.5 text-sm font-medium"
    >
      <svg
        aria-hidden
        className="h-4 w-4"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 3.5 5.5 8 10 12.5" />
      </svg>
      Back
    </button>
  );
}
