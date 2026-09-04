"use client";

import { CountryCodeSelect } from "@/components/quote/CountryCodeSelect";
import { getCountryByIso2 } from "@/lib/phone/countries";
import { formatNationalPhone } from "@/lib/phone/format";

const inputBaseClass =
  "w-full rounded-md border bg-paper-raised px-3 py-2 text-sm text-asphalt-950 focus:outline-none focus:ring-2";
const inputOkClass =
  "border-asphalt-200 focus:border-asphalt-950 focus:ring-accent/50";
const inputErrorClass = "border-error focus:border-error focus:ring-error/30";

interface PhoneNumberInputProps {
  countryIso2: string;
  nationalNumber: string;
  onCountryChange: (iso2: string) => void;
  onNationalNumberChange: (formatted: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}

export function PhoneNumberInput({
  countryIso2,
  nationalNumber,
  onCountryChange,
  onNationalNumberChange,
  onBlur,
  error,
  disabled,
}: PhoneNumberInputProps) {
  const country = getCountryByIso2(countryIso2);

  function handleCountryChange(iso2: string) {
    onCountryChange(iso2);
    if (nationalNumber) {
      onNationalNumberChange(formatNationalPhone(iso2, nationalNumber));
    }
  }

  function handleNumberChange(value: string) {
    onNationalNumberChange(formatNationalPhone(countryIso2, value));
  }

  return (
    <div>
      <div className="flex gap-2">
        <div className="shrink-0">
          <label htmlFor="phone-country" className="sr-only">
            Country code
          </label>
          <CountryCodeSelect
            value={countryIso2}
            onChange={handleCountryChange}
            disabled={disabled}
            invalid={!!error}
          />
        </div>
        <div className="min-w-0 flex-1">
          <label htmlFor="phone-national" className="sr-only">
            Phone number
          </label>
          <input
            id="phone-national"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={nationalNumber}
            onChange={(e) => handleNumberChange(e.target.value)}
            onBlur={onBlur}
            placeholder={country.example}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? "phone-error" : undefined}
            className={`${inputBaseClass} ${error ? inputErrorClass : inputOkClass}`}
          />
        </div>
      </div>
    </div>
  );
}
