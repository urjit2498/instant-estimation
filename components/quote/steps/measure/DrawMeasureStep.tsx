"use client";

import { useState } from "react";
import { AddressSearchInput } from "@/components/quote/steps/measure/AddressSearchInput";
import { DrawStep } from "@/components/quote/steps/measure/DrawStep";
import type { LatLngPoint, Measurement } from "@/types/quote";

interface DrawMeasureStepProps {
  initialAddress: string;
  initialCenter?: LatLngPoint;
  onBack: () => void;
  onAddressChange?: (address: string) => void;
  onComplete: (measurement: Measurement) => void;
}

/** Address search and the satellite map live on one screen, per the merged flow. */
export function DrawMeasureStep({
  initialAddress,
  initialCenter,
  onBack,
  onAddressChange,
  onComplete,
}: DrawMeasureStepProps) {
  const [address, setAddress] = useState(initialAddress);
  const [center, setCenter] = useState<LatLngPoint | undefined>(initialCenter);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-heading text-xl font-semibold text-asphalt-950">
          Find your property, then trace your driveway
        </h2>
        <p className="mt-1 text-sm text-asphalt-700">
          Search your address to load a satellite view, then click points on the map to outline
          your driveway. Drag any point to adjust it.
        </p>
      </div>

      <AddressSearchInput
        initialAddress={address}
        onAddressSelected={(nextAddress, nextCenter) => {
          setAddress(nextAddress);
          onAddressChange?.(nextAddress);
          if (nextCenter) setCenter(nextCenter);
        }}
      />

      <DrawStep address={address} center={center} onBack={onBack} onComplete={onComplete} />
    </div>
  );
}
