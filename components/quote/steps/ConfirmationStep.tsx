import type { Contractor } from "@/types/contractor";

interface ConfirmationStepProps {
  contractor: Contractor;
  confirmationId: string;
}

export function ConfirmationStep({ contractor, confirmationId }: ConfirmationStepProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-bg text-2xl text-success">
        ✓
      </div>
      <h2 className="font-heading text-xl font-semibold text-asphalt-950">You&apos;re all set!</h2>
      <p className="max-w-sm text-sm text-asphalt-700">
        We&apos;ve sent your estimate by email. {contractor.name} will follow up at{" "}
        {contractor.phone} if you have questions.
      </p>
      <p className="font-mono text-xs text-asphalt-300">Confirmation #{confirmationId}</p>
    </div>
  );
}
