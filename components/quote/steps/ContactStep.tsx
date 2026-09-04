"use client";

import { BackButton } from "@/components/quote/BackButton";
import { PhoneNumberInput } from "@/components/quote/PhoneNumberInput";
import { useRef, useState, type ReactNode } from "react";
import {
  EMPTY_CONTACT_FORM_VALUES,
  toContactInfo,
  validateContactForm,
  validateEmail,
  validateName,
  validateNotes,
  validatePhoneNational,
  validatePropertyAddress,
  validateZipCode,
  type ContactFormErrors,
  type ContactFormValues,
  type PreferredContactMethod,
} from "@/lib/validation/contactForm";
import type { ContactInfo } from "@/types/quote";

const inputBaseClass =
  "w-full rounded-md border bg-paper-raised px-3 py-2 text-sm text-asphalt-950 focus:outline-none focus:ring-2";
const inputOkClass =
  "border-asphalt-200 focus:border-asphalt-950 focus:ring-accent/50";
const inputErrorClass = "border-error focus:border-error focus:ring-error/30";

function fieldClass(hasError: boolean) {
  return `${inputBaseClass} ${hasError ? inputErrorClass : inputOkClass}`;
}

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
        {optional ? (
          <span className="font-normal text-asphalt-300"> (optional)</span>
        ) : (
          <span className="text-error" aria-hidden>
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const FIELD_FOCUS_ORDER: (keyof ContactFormValues)[] = [
  "name",
  "email",
  "phoneNational",
  "propertyAddress",
  "zipCode",
  "notes",
];

const FIELD_INPUT_IDS: Partial<Record<keyof ContactFormValues, string>> = {
  name: "name",
  email: "email",
  phoneNational: "phone-national",
  propertyAddress: "property-address",
  zipCode: "zip-code",
  notes: "notes",
};

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
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<ContactFormValues>({
    ...EMPTY_CONTACT_FORM_VALUES,
    propertyAddress: initialPropertyAddress,
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormValues, boolean>>>({});

  function validateField(field: keyof ContactFormValues, nextValues: ContactFormValues) {
    switch (field) {
      case "name":
        return validateName(nextValues.name);
      case "email":
        return validateEmail(nextValues.email);
      case "phoneNational":
      case "phoneCountry":
        return validatePhoneNational(nextValues.phoneCountry, nextValues.phoneNational);
      case "propertyAddress":
        return validatePropertyAddress(nextValues.propertyAddress);
      case "zipCode":
        return validateZipCode(nextValues.zipCode);
      case "notes":
        return validateNotes(nextValues.notes);
      default:
        return undefined;
    }
  }

  function setFieldError(field: keyof ContactFormValues, error: string | undefined) {
    setErrors((prev) => {
      if (!error) {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return { ...prev, [field]: error };
    });
  }

  function handleFieldChange<K extends keyof ContactFormValues>(
    field: K,
    value: ContactFormValues[K],
  ) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);

    if (field === "phoneCountry") {
      const phoneError = validatePhoneNational(nextValues.phoneCountry, nextValues.phoneNational);
      if (touched.phoneNational || errors.phoneNational) {
        setFieldError("phoneNational", phoneError);
      }
      return;
    }

    if (touched[field] || errors[field]) {
      const errorField = field === "phoneNational" ? "phoneNational" : field;
      setFieldError(errorField, validateField(field, nextValues));
    }
  }

  function handleBlur(field: keyof ContactFormValues) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFieldError(field === "phoneCountry" ? "phoneNational" : field, validateField(field, values));
  }

  function focusFirstError(validationErrors: ContactFormErrors) {
    for (const field of FIELD_FOCUS_ORDER) {
      if (!validationErrors[field]) continue;
      const id = FIELD_INPUT_IDS[field];
      if (!id) continue;
      const el = formRef.current?.querySelector<HTMLElement>(`#${id}`);
      el?.focus();
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      break;
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateContactForm(values);
    setErrors(validationErrors);
    setTouched({
      name: true,
      email: true,
      phoneNational: true,
      propertyAddress: true,
      zipCode: true,
      notes: true,
      preferredContactMethod: true,
    });
    if (Object.keys(validationErrors).length > 0) {
      focusFirstError(validationErrors);
      return;
    }
    onSubmit(toContactInfo(values));
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div>
        <h2 className="font-heading text-xl font-semibold text-asphalt-950">
          How do we reach you?
        </h2>
        <p className="mt-1 text-sm text-asphalt-700">
          Enter your details and we&apos;ll show your instant estimate. We&apos;ll also email you
          a copy and follow up about your project.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
        <FormField id="name" label="Full name" error={errors.name}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            maxLength={80}
            value={values.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={fieldClass(!!errors.name)}
            disabled={isSubmitting}
          />
        </FormField>

        <FormField id="email" label="Email" error={errors.email}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            value={values.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClass(!!errors.email)}
            disabled={isSubmitting}
          />
        </FormField>

        <div className="sm:col-span-2">
          <label htmlFor="phone-national" className="mb-1 block text-sm font-medium text-asphalt-950">
            Phone number
            <span className="text-error" aria-hidden>
              {" "}
              *
            </span>
          </label>
          <PhoneNumberInput
            countryIso2={values.phoneCountry}
            nationalNumber={values.phoneNational}
            onCountryChange={(iso2) => handleFieldChange("phoneCountry", iso2)}
            onNationalNumberChange={(formatted) => handleFieldChange("phoneNational", formatted)}
            onBlur={() => handleBlur("phoneNational")}
            error={errors.phoneNational}
            disabled={isSubmitting}
          />
          {errors.phoneNational && (
            <p id="phone-error" className="mt-1 text-xs text-error" role="alert">
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
            maxLength={200}
            value={values.propertyAddress}
            onChange={(e) => handleFieldChange("propertyAddress", e.target.value)}
            onBlur={() => handleBlur("propertyAddress")}
            placeholder="Street address where work will be done"
            aria-invalid={!!errors.propertyAddress}
            aria-describedby={errors.propertyAddress ? "property-address-error" : undefined}
            className={fieldClass(!!errors.propertyAddress)}
            disabled={isSubmitting}
          />
        </FormField>

        <FormField id="zip-code" label="Zip code" error={errors.zipCode}>
          <input
            id="zip-code"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={10}
            value={values.zipCode}
            onChange={(e) => handleFieldChange("zipCode", e.target.value)}
            onBlur={() => handleBlur("zipCode")}
            placeholder="49006"
            aria-invalid={!!errors.zipCode}
            aria-describedby={errors.zipCode ? "zip-code-error" : undefined}
            className={fieldClass(!!errors.zipCode)}
            disabled={isSubmitting}
          />
        </FormField>

        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-medium text-asphalt-950">
            Preferred way to reach you
            <span className="text-error" aria-hidden>
              {" "}
              *
            </span>
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
                  disabled={isSubmitting}
                />
                {label}
              </label>
            ))}
          </div>
          {errors.preferredContactMethod && (
            <p className="mt-1 text-xs text-error" role="alert">
              {errors.preferredContactMethod}
            </p>
          )}
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
            maxLength={500}
            value={values.notes}
            onChange={(e) => handleFieldChange("notes", e.target.value)}
            onBlur={() => handleBlur("notes")}
            placeholder="Gate code, driveway condition, timing preferences, etc."
            aria-invalid={!!errors.notes}
            aria-describedby={errors.notes ? "notes-error" : undefined}
            className={`${fieldClass(!!errors.notes)} resize-y`}
            disabled={isSubmitting}
          />
          <p className="mt-1 text-right text-[11px] text-asphalt-300">
            {values.notes.length}/500
          </p>
        </FormField>
      </div>

      <div className="flex items-center justify-between border-t border-asphalt-100 pt-5">
        <BackButton onClick={onBack} disabled={isSubmitting} />
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-gradient rounded-md px-5 py-2.5 text-sm font-medium"
        >
          {isSubmitting ? "Saving…" : "See my estimate"}
        </button>
      </div>
    </form>
  );
}
