import { useJsApiLoader } from "@react-google-maps/api";
import { getGoogleMapsApiKey } from "@/lib/env";

const GOOGLE_MAPS_LIBRARIES: "places"[] = ["places"];

/**
 * Shared loader for the Google Maps JS API. Uses a fixed `id` so calling this from multiple
 * components (landing page autocomplete, quote flow map) reuses the same script tag instead of
 * injecting it twice.
 */
export function useGoogleMapsLoader() {
  const apiKey = getGoogleMapsApiKey();

  const loader = useJsApiLoader({
    id: "instant-estimation-google-maps",
    googleMapsApiKey: apiKey,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  return { ...loader, apiKeyConfigured: apiKey.length > 0 };
}
