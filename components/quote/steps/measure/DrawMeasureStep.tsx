"use client";

import { useEffect, useState } from "react";
import { BackButton } from "@/components/quote/BackButton";
import { AddressSearchInput } from "@/components/quote/steps/measure/AddressSearchInput";
import { DrawStep } from "@/components/quote/steps/measure/DrawStep";
import { addressPartsFromComponents, splitAddressAndZip } from "@/lib/geo/address";
import { useGoogleMapsLoader } from "@/hooks/useGoogleMapsLoader";
import type { LatLngPoint, Measurement } from "@/types/quote";

interface DrawMeasureStepProps {
  initialAddress: string;
  initialCenter?: LatLngPoint;
  onBack: () => void;
  onAddressChange?: (address: string, zipCode?: string) => void;
  onComplete: (measurement: Measurement) => void;
}

/** Address search first; satellite map only appears after a property location is resolved. */
export function DrawMeasureStep({
  initialAddress,
  initialCenter,
  onBack,
  onAddressChange,
  onComplete,
}: DrawMeasureStepProps) {
  const { isLoaded } = useGoogleMapsLoader();
  const [address, setAddress] = useState(initialAddress);
  const [center, setCenter] = useState<LatLngPoint | undefined>(initialCenter);
  const [pendingGeocodeAddress, setPendingGeocodeAddress] = useState<string | null>(
    initialCenter || !initialAddress.trim() ? null : initialAddress.trim(),
  );
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  function handleAddressSelected(nextAddress: string, nextCenter?: LatLngPoint, zipCode?: string) {
    const parts = zipCode
      ? { address: nextAddress.trim(), zipCode }
      : splitAddressAndZip(nextAddress);
    const trimmed = parts.address;
    setAddress(trimmed);
    onAddressChange?.(trimmed, parts.zipCode || undefined);
    setLocationError(null);

    if (nextCenter) {
      setPendingGeocodeAddress(null);
      setIsResolvingLocation(false);
      setCenter(nextCenter);
      return;
    }

    if (!trimmed) {
      setPendingGeocodeAddress(null);
      setCenter(undefined);
      return;
    }

    setCenter(undefined);
    setPendingGeocodeAddress(trimmed);
  }

  useEffect(() => {
    if (!pendingGeocodeAddress || !isLoaded) return;

    let cancelled = false;
    setIsResolvingLocation(true);
    setLocationError(null);

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: pendingGeocodeAddress }, (results, status) => {
      if (cancelled) return;
      setIsResolvingLocation(false);
      setPendingGeocodeAddress(null);

      if (status === "OK" && results?.[0]?.geometry?.location) {
        const loc = results[0].geometry.location;
        const parts = addressPartsFromComponents(
          results[0].address_components,
          results[0].formatted_address ?? pendingGeocodeAddress,
        );
        setAddress(parts.address);
        onAddressChange?.(parts.address, parts.zipCode || undefined);
        setCenter({ lat: loc.lat(), lng: loc.lng() });
        return;
      }

      setLocationError("We couldn't find that address. Pick a suggestion from the list.");
    });

    return () => {
      cancelled = true;
    };
  }, [pendingGeocodeAddress, isLoaded]);

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
        onAddressSelected={handleAddressSelected}
      />

      {locationError && (
        <div
          role="alert"
          className="rounded-md border border-error bg-error-bg px-4 py-3 text-sm text-asphalt-950"
        >
          {locationError}
        </div>
      )}

      {center ? (
        <DrawStep
          key={`${center.lat.toFixed(5)}-${center.lng.toFixed(5)}`}
          center={center}
          onBack={onBack}
          onComplete={onComplete}
        />
      ) : (
        <>
          <div className="-mx-4 flex h-80 w-[calc(100%+2rem)] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-asphalt-200 bg-paper-raised px-6 text-center sm:-mx-6 sm:h-96 sm:w-[calc(100%+3rem)]">
            {isResolvingLocation ? (
              <p className="text-sm text-asphalt-700">Finding your property…</p>
            ) : (
              <>
                <p className="font-heading text-sm font-semibold text-asphalt-950">
                  Map will appear here
                </p>
                <p className="max-w-sm text-sm text-asphalt-700">
                  Enter your property address above and choose it from the suggestions to load a
                  satellite view you can trace on.
                </p>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <BackButton onClick={onBack} />
          </div>
        </>
      )}
    </div>
  );
}
