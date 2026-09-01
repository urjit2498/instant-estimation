/** A single lat/lng point, matching the shape returned by the Google Maps JS API. */
export interface LatLngPoint {
  lat: number;
  lng: number;
}

/** Whether the customer traced an enclosed area (driveway) or a line (e.g. a crack run). */
export type ShapeType = "polygon" | "line";

/** How the customer produced their measurement — drives which step-2 screen renders. */
export type MeasurementMethod = "draw" | "upload" | "manual";

/**
 * The customer's measurement, how they got there is preserved via `method` mostly for the
 * estimate summary / any future analytics — pricing only ever looks at shapeType + area/length.
 */
export interface Measurement {
  method: MeasurementMethod;
  shapeType: ShapeType;
  /** Present when shapeType is "polygon". */
  areaSqFt?: number;
  /** Present when shapeType is "line". */
  lengthFt?: number;
  /** Real lat/lng path — present only for method "draw" (drawn directly on the satellite map). */
  path?: LatLngPoint[];
}

/** Response shape expected from the real pricing API. Mocked for now in lib/mock/pricing.ts. */
export interface PriceEstimate {
  price: number;
  currency: "USD";
  breakdown: {
    baseRatePerSqFt: number;
    areaSqFt: number;
    materialName: string;
    materialMultiplier: number;
    subtotal: number;
  };
  /** TODO: real API should return a stable estimate id we can reference when the customer later submits contact info. */
  estimateId: string;
}

export type PreferredContactMethod = "phone" | "email" | "either";

export interface ContactInfo {
  name: string;
  email: string;
  /** ISO 3166-1 alpha-2 country code for the phone number. */
  phoneCountry: string;
  /** National number as entered by the customer (formatted for display). */
  phoneNational: string;
  /** Full international number in E.164 form, e.g. +15551234567 */
  phone: string;
  propertyAddress: string;
  preferredContactMethod: PreferredContactMethod;
  notes?: string;
}

/** Body sent to POST /api/quote/submit (mocked). Mirrors what the real save+email API will expect. */
export interface QuoteSubmission {
  contractorSlug: string;
  measurement: Measurement;
  materialId: string;
  priceEstimate: PriceEstimate;
  contact: ContactInfo;
}

export interface QuoteSubmissionResult {
  success: true;
  confirmationId: string;
}
