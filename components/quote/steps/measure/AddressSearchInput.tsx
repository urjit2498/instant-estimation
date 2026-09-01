"use client";

import { Autocomplete } from "@react-google-maps/api";
import { useRef, useState } from "react";
import { useGoogleMapsLoader } from "@/hooks/useGoogleMapsLoader";
import type { LatLngPoint } from "@/types/quote";

interface AddressSearchInputProps {
  initialAddress?: string;
  onAddressSelected: (address: string, center?: LatLngPoint) => void;
}

/**
 * Inline address search — no navigation. Lives inside the "Draw on map" branch of the measure
 * step so address entry and the map are on the same screen, per the merged flow.
 */
export function AddressSearchInput({ initialAddress, onAddressSelected }: AddressSearchInputProps) {
  const { isLoaded, loadError, apiKeyConfigured } = useGoogleMapsLoader();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [address, setAddress] = useState(initialAddress ?? "");

  function handlePlaceChanged() {
    const place = autocompleteRef.current?.getPlace();
    const formattedAddress = place?.formatted_address ?? address;
    const lat = place?.geometry?.location?.lat();
    const lng = place?.geometry?.location?.lng();
    setAddress(formattedAddress);
    onAddressSelected(formattedAddress, lat !== undefined && lng !== undefined ? { lat, lng } : undefined);
  }

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) return;
    // No place selected from the dropdown — the map step falls back to geocoding this itself.
    onAddressSelected(address.trim());
  }

  if (!apiKeyConfigured) {
    return (
      <div className="rounded-lg border border-accent bg-accent-100 p-3 text-sm text-asphalt-950">
        Address search is not configured yet. Add{" "}
        <code className="font-mono text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to{" "}
        <code className="font-mono text-xs">.env.local</code>.
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-lg border border-error bg-error-bg p-3 text-sm text-asphalt-950">
        Couldn&apos;t load address search. Check your API key and enabled APIs (Places API).
      </div>
    );
  }

  return (
    <form onSubmit={handleManualSubmit} className="flex w-full flex-col gap-2 sm:flex-row">
      <label htmlFor="measure-address" className="sr-only">
        Your property address
      </label>
      {isLoaded ? (
        <Autocomplete
          onLoad={(instance) => (autocompleteRef.current = instance)}
          onPlaceChanged={handlePlaceChanged}
          options={{ types: ["address"] }}
          className="flex-1"
        >
          <input
            id="measure-address"
            name="address"
            type="text"
            placeholder="Enter your property address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-md border border-asphalt-200 bg-paper-raised px-4 py-2.5 text-sm text-asphalt-950 shadow-sm focus:border-asphalt-950 focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </Autocomplete>
      ) : (
        <input
          disabled
          placeholder="Loading address search…"
          className="flex-1 rounded-md border border-asphalt-200 px-4 py-2.5 text-sm text-asphalt-300"
        />
      )}
      <button
        type="submit"
        disabled={!isLoaded}
        className="btn-gradient rounded-md px-5 py-2.5 text-sm font-medium"
      >
        Find my property
      </button>
    </form>
  );
}
