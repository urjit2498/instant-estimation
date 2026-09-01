"use client";

import { BackButton } from "@/components/quote/BackButton";
import { PhoneNumberInput } from "@/components/quote/PhoneNumberInput";
import { useState, type ReactNode } from "react";
import {
  EMPTY_CONTACT_FORM_VALUES,
  toContactInfo,
  validateContactForm,
  validateEmail,
  validateName,
  validateNotes,
  validatePhoneNational,
  validatePropertyAddress,
  type ContactFormErrors,
  type ContactFormValues,
  type PreferredContactMethod,
} from "@/lib/validation/contactForm";
import type { ContactInfo } from "@/types/quote";

const inputClass =
  "w-full rounded-md border border-asphalt-200 bg-paper-raised px-3 py-2 text-sm text-asphalt-950 focus:border-asphalt-950 focus:outline-none focus:ring-2 focus:ring-accent/50";

function FormField({
  id,
  label,
  optional,
  error,
  children,
  className = "",
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-asphalt-950">
        {label}
        {optional && <span className="font-normal text-asphalt-300"> (optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
}

interface ContactStepProps {
  initialPropertyAddress?: string;
  onBack: () => void;
  onSubmit: (values: ContactInfo) => void;
  isSubmitting: boolean;
}

export function ContactStep({
  initialPropertyAddress = "",
  onBack,
  onSubmit,
  isSubmitting,
}: ContactStepProps) {
  const [values, setValues] = useState<ContactFormValues>({
    ...EMPTY_CONTACT_FORM_VALUES,
    propertyAddress: initialPropertyAddress,
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});

  const fieldValidators = {
    name: validateName,
    phoneNational: (v: string) => validatePhoneNational(values.phoneCountry, v),
    email: validateEmail,
    propertyAddress: validatePropertyAddress,
    notes: validateNotes,
  } as const;

  function handleFieldChange<K extends keyof ContactFormValues>(
    field: K,
    value: ContactFormValues[K],
  ) {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const validator = fieldValidators[field as keyof typeof fieldValidators];
      if (!validator) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      const error = validator(value as string);
      if (error) return { ...prev, [field]: error };
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateContactForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(toContactInfo(values));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div>
        <h2 className="font-heading text-xl font-semibold text-asphalt-950">
          Last step — how do we reach you?
        </h2>
        <p className="mt-1 text-sm text-asphalt-700">
          We&apos;ll email you a copy of this estimate and follow up about your project.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
        <FormField id="name" label="Full name" error={errors.name}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputClass}
          />
        </FormField>

        <FormField id="email" label="Email" error={errors.email}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputClass}
          />
        </FormField>

        <div className="sm:col-span-2">
          <label htmlFor="phone-national" className="mb-1 block text-sm font-medium text-asphalt-950">
            Phone number
          </label>
          <PhoneNumberInput
            countryIso2={values.phoneCountry}
            nationalNumber={values.phoneNational}
            onCountryChange={(iso2) => handleFieldChange("phoneCountry", iso2)}
            onNationalNumberChange={(formatted) => handleFieldChange("phoneNational", formatted)}
            error={errors.phoneNational}
            disabled={isSubmitting}
          />
          {errors.phoneNational && (
            <p id="phone-error" className="mt-1 text-xs text-error">
              {errors.phoneNational}
            </p>
          )}
        </div>

        <FormField
          id="property-address"
          label="Property address"
          error={errors.propertyAddress}
          className="sm:col-span-2"
        >
          <input
            id="property-address"
            type="text"
            autoComplete="street-address"
            value={values.propertyAddress}
            onChange={(e) => handleFieldChange("propertyAddress", e.target.value)}
            placeholder="Street address where work will be done"
            aria-invalid={!!errors.propertyAddress}
            aria-describedby={errors.propertyAddress ? "property-address-error" : undefined}
            className={inputClass}
          />
        </FormField>

        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-medium text-asphalt-950">
            Preferred way to reach you
          </legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(
              [
                { value: "phone", label: "Phone call" },
                { value: "email", label: "Email" },
                { value: "either", label: "Either is fine" },
              ] as const
            ).map(({ value, label }) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm transition-colors ${
                  values.preferredContactMethod === value
                    ? "border-asphalt-950 bg-asphalt-50 text-asphalt-950"
                    : "border-asphalt-200 text-asphalt-700 hover:border-asphalt-300"
                }`}
              >
                <input
                  type="radio"
                  name="preferred-contact"
                  value={value}
                  checked={values.preferredContactMethod === value}
                  onChange={() =>
                    handleFieldChange("preferredContactMethod", value as PreferredContactMethod)
                  }
                  className="accent-asphalt-950"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <FormField
          id="notes"
          label="Project notes"
          optional
          error={errors.notes}
          className="sm:col-span-2"
        >
          <textarea
            id="notes"
            rows={3}
            value={values.notes}
            onChange={(e) => handleFieldChange("notes", e.target.value)}
            placeholder="Gate code, driveway condition, timing preferences, etc."
            aria-invalid={!!errors.notes}
            aria-describedby={errors.notes ? "notes-error" : undefined}
            className={`${inputClass} resize-y`}
          />
        </FormField>
      </div>

      <div className="flex items-center justify-between border-t border-asphalt-100 pt-5">
        <BackButton onClick={onBack} />
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-gradient rounded-md px-5 py-2.5 text-sm font-medium"
        >
          {isSubmitting ? "Submitting…" : "Send me this quote"}
        </button>
      </div>
    </form>
  );
}
