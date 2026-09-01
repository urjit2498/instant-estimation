/**
 * Client-side validation only — a placeholder until the real save API exists and does
 * server-side validation too. TODO: revisit once the backend dev's save+email API is live;
 * never trust client-side validation alone for data that gets persisted.
 */

import { DEFAULT_COUNTRY_ISO2 } from "@/lib/phone/countries";
import { toE164, validateNationalPhone } from "@/lib/phone/format";

export type PreferredContactMethod = "phone" | "email" | "either";

export interface ContactFormValues {
  name: string;
  email: string;
  phoneCountry: string;
  phoneNational: string;
  propertyAddress: string;
  preferredContactMethod: PreferredContactMethod;
  notes: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTES_MAX_LENGTH = 500;

export const EMPTY_CONTACT_FORM_VALUES: ContactFormValues = {
  name: "",
  email: "",
  phoneCountry: DEFAULT_COUNTRY_ISO2,
  phoneNational: "",
  propertyAddress: "",
  preferredContactMethod: "either",
  notes: "",
};

export function validateName(name: string): string | undefined {
  if (!name.trim()) return "Name is required.";
  if (name.trim().length < 2) return "Name looks too short.";
  return undefined;
}

export function validatePhoneNational(
  phoneCountry: string,
  phoneNational: string,
): string | undefined {
  return validateNationalPhone(phoneCountry, phoneNational);
}

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Email is required.";
  if (!EMAIL_RE.test(email.trim())) return "Enter a valid email address.";
  return undefined;
}

export function validatePropertyAddress(address: string): string | undefined {
  if (!address.trim()) return "Property address is required.";
  if (address.trim().length < 5) return "Enter the full street address.";
  return undefined;
}

export function validateNotes(notes: string): string | undefined {
  if (notes.length > NOTES_MAX_LENGTH) {
    return `Notes must be ${NOTES_MAX_LENGTH} characters or fewer.`;
  }
  return undefined;
}

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const nameError = validateName(values.name);
  const phoneError = validatePhoneNational(values.phoneCountry, values.phoneNational);
  const emailError = validateEmail(values.email);
  const addressError = validatePropertyAddress(values.propertyAddress);
  const notesError = validateNotes(values.notes);
  if (nameError) errors.name = nameError;
  if (phoneError) errors.phoneNational = phoneError;
  if (emailError) errors.email = emailError;
  if (addressError) errors.propertyAddress = addressError;
  if (notesError) errors.notes = notesError;
  return errors;
}

/** Build the API payload with a normalized E.164 phone for downstream systems. */
export function toContactInfo(values: ContactFormValues) {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    phoneCountry: values.phoneCountry,
    phoneNational: values.phoneNational,
    phone: toE164(values.phoneCountry, values.phoneNational),
    propertyAddress: values.propertyAddress.trim(),
    preferredContactMethod: values.preferredContactMethod,
    notes: values.notes.trim() || undefined,
  };
}

/** Server-side validation for the submitted ContactInfo payload. */
export function validateContactInfo(contact: {
  name?: string;
  email?: string;
  phoneCountry?: string;
  phoneNational?: string;
  phone?: string;
  propertyAddress?: string;
  preferredContactMethod?: PreferredContactMethod;
  notes?: string;
}): ContactFormErrors {
  return validateContactForm({
    name: contact.name ?? "",
    email: contact.email ?? "",
    phoneCountry: contact.phoneCountry ?? DEFAULT_COUNTRY_ISO2,
    phoneNational: contact.phoneNational ?? "",
    propertyAddress: contact.propertyAddress ?? "",
    preferredContactMethod: contact.preferredContactMethod ?? "either",
    notes: contact.notes ?? "",
  });
}
