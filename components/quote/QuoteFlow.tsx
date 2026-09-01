"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { Contractor } from "@/types/contractor";
import type {
  ContactInfo,
  Measurement,
  MeasurementMethod,
  PriceEstimate,
} from "@/types/quote";
import { ProgressBar } from "@/components/quote/ProgressBar";
import { MethodSelectStep } from "@/components/quote/steps/MethodSelectStep";
import { MaterialSelectStep } from "@/components/quote/steps/MaterialSelectStep";
import { EstimateStep } from "@/components/quote/steps/EstimateStep";
import { ContactStep } from "@/components/quote/steps/ContactStep";
import { ConfirmationStep } from "@/components/quote/steps/ConfirmationStep";

// Google Maps + Turf are browser-only and heavy — load them only when the user picks a measure method.
const DrawMeasureStep = dynamic(
  () =>
    import("@/components/quote/steps/measure/DrawMeasureStep").then((mod) => mod.DrawMeasureStep),
  { ssr: false, loading: () => <MeasureStepLoading label="Loading map…" /> },
);
const UploadMeasureStep = dynamic(
  () =>
    import("@/components/quote/steps/measure/UploadMeasureStep").then(
      (mod) => mod.UploadMeasureStep,
    ),
  { ssr: false, loading: () => <MeasureStepLoading label="Loading upload tool…" /> },
);
const ManualMeasureStep = dynamic(
  () =>
    import("@/components/quote/steps/measure/ManualMeasureStep").then(
      (mod) => mod.ManualMeasureStep,
    ),
  { ssr: false },
);

function MeasureStepLoading({ label }: { label: string }) {
  return <p className="py-8 text-center text-sm text-asphalt-700">{label}</p>;
}

type Step = "method" | "measure" | "material" | "estimate" | "contact" | "confirmation";

const STEP_INDEX: Record<Step, number> = {
  method: 0,
  measure: 1,
  material: 2,
  estimate: 3,
  contact: 4,
  confirmation: 5,
};

interface QuoteFlowProps {
  contractor: Contractor;
  initialAddress: string;
  initialCenter?: { lat: number; lng: number };
}

/**
 * Owns the whole multi-step flow as in-memory state (no per-step URL/query sync). Simple and
 * fast to build; if deep-linking to a specific step or preserving position across a reload
 * becomes a requirement, this is the place to switch to URL-driven step state.
 */
export function QuoteFlow({ contractor, initialAddress, initialCenter }: QuoteFlowProps) {
  const [step, setStep] = useState<Step>("method");
  const [measurementMethod, setMeasurementMethod] = useState<MeasurementMethod | null>(null);
  const [propertyAddress, setPropertyAddress] = useState(initialAddress);
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const [materialId, setMaterialId] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<PriceEstimate | null>(null);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleMeasurementComplete(m: Measurement) {
    setMeasurement(m);
    setStep("material");
  }

  async function handleMaterialSubmit(selectedMaterialId: string) {
    if (!measurement) return;
    setMaterialId(selectedMaterialId);
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/quote/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractorSlug: contractor.slug,
          measurement,
          materialId: selectedMaterialId,
        }),
      });
      if (!res.ok) throw new Error("Failed to calculate estimate");
      const data: PriceEstimate = await res.json();
      setEstimate(data);
      setStep("estimate");
    } catch {
      setErrorMessage("Something went wrong calculating your estimate. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleContactSubmit(contact: ContactInfo) {
    if (!measurement || !materialId || !estimate) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/quote/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractorSlug: contractor.slug,
          measurement,
          materialId,
          priceEstimate: estimate,
          contact,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit quote");
      const data: { success: true; confirmationId: string } = await res.json();
      setConfirmationId(data.confirmationId);
      setStep("confirmation");
    } catch {
      setErrorMessage("Something went wrong submitting your info. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <ProgressBar currentStepIndex={STEP_INDEX[step]} />

      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 rounded-md border border-error bg-error-bg px-4 py-3 text-sm text-asphalt-950"
          >
            {errorMessage}
          </div>
        )}

        {step === "method" && (
          <MethodSelectStep
            onSelect={(method) => {
              setMeasurementMethod(method);
              setStep("measure");
            }}
          />
        )}

        {step === "measure" && measurementMethod === "draw" && (
          <DrawMeasureStep
            initialAddress={propertyAddress}
            initialCenter={initialCenter}
            onBack={() => setStep("method")}
            onAddressChange={setPropertyAddress}
            onComplete={handleMeasurementComplete}
          />
        )}
        {step === "measure" && measurementMethod === "upload" && (
          <UploadMeasureStep
            onBack={() => setStep("method")}
            onComplete={handleMeasurementComplete}
          />
        )}
        {step === "measure" && measurementMethod === "manual" && (
          <ManualMeasureStep
            onBack={() => setStep("method")}
            onComplete={handleMeasurementComplete}
          />
        )}

        {step === "material" && (
          <MaterialSelectStep
            onBack={() => setStep("measure")}
            onSubmit={handleMaterialSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {step === "estimate" && estimate && (
          <EstimateStep
            estimate={estimate}
            onBack={() => setStep("material")}
            onContinue={() => setStep("contact")}
          />
        )}

        {step === "contact" && (
          <ContactStep
            initialPropertyAddress={propertyAddress}
            onBack={() => setStep("estimate")}
            onSubmit={handleContactSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {step === "confirmation" && confirmationId && (
          <ConfirmationStep contractor={contractor} confirmationId={confirmationId} />
        )}
      </div>
    </div>
  );
}
