"use client";

import { BackButton } from "@/components/quote/BackButton";
import { useState } from "react";
import {
  validateContactForm,
  validateEmail,
  validateName,
  validatePhone,
  type ContactFormErrors,
  type ContactFormValues,
} from "@/lib/validation/contactForm";

interface ContactStepProps {
  onBack: () => void;
  onSubmit: (values: ContactFormValues) => void;
  isSubmitting: boolean;
}

export function ContactStep({ onBack, onSubmit, isSubmitting }: ContactStepProps) {
  const [values, setValues] = useState<ContactFormValues>({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState<ContactFormErrors>({});

  const fieldValidators = {
    name: validateName,
    phone: validatePhone,
    email: validateEmail,
  } as const;

  function handleFieldChange(field: keyof ContactFormValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const error = fieldValidators[field](value);
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
      onSubmit(values);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div>
        <h2 className="font-heading text-xl font-semibold text-asphalt-950">
          Last step — how do we reach you?
        </h2>
        <p className="mt-1 text-sm text-asphalt-700">
          We&apos;ll email you a copy of this estimate right away.
        </p>
      </div>

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-asphalt-950">
          Full name
        </label>
        <input
          id="name"
          type="text"
          value={values.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="w-full rounded-md border border-asphalt-200 bg-paper-raised px-3 py-2 text-sm text-asphalt-950 focus:border-asphalt-950 focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-xs text-error">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-asphalt-950">
          Phone number
        </label>
        <input
          id="phone"
          type="tel"
          value={values.phone}
          onChange={(e) => handleFieldChange("phone", e.target.value)}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className="w-full rounded-md border border-asphalt-200 bg-paper-raised px-3 py-2 text-sm text-asphalt-950 focus:border-asphalt-950 focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
        {errors.phone && (
          <p id="phone-error" className="mt-1 text-xs text-error">
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-asphalt-950">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => handleFieldChange("email", e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="w-full rounded-md border border-asphalt-200 bg-paper-raised px-3 py-2 text-sm text-asphalt-950 focus:border-asphalt-950 focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-xs text-error">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <BackButton onClick={onBack} />
        {/* Submit disabled while a request is in flight — simple guard against duplicate submissions / hammering the (future) save API. */}
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
