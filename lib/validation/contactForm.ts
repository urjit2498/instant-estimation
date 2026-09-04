/**
 * Contact form validation used on both client (ContactStep) and server (quote create API).
 * Never trust client-side validation alone for data that gets persisted.
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
  zipCode: string;
  preferredContactMethod: PreferredContactMethod;
  notes: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
/** Letters (any script), marks, spaces, hyphens, apostrophes, periods. */
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s'.-]*$/u;
const ZIP_RE = /^\d{5}(-\d{4})?$/;
const PREFERRED_METHODS = new Set<PreferredContactMethod>(["phone", "email", "either"]);

const NAME_MAX_LENGTH = 80;
const EMAIL_MAX_LENGTH = 254;
const ADDRESS_MAX_LENGTH = 200;
const NOTES_MAX_LENGTH = 500;

export const EMPTY_CONTACT_FORM_VALUES: ContactFormValues = {
  name: "",
  email: "",
  phoneCountry: DEFAULT_COUNTRY_ISO2,
  phoneNational: "",
  propertyAddress: "",
  zipCode: "",
  preferredContactMethod: "either",
  notes: "",
};

export function validateName(name: string): string | undefined {
  const trimmed = name.trim();
  if (!trimmed) return "Name is required.";
  if (trimmed.length < 2) return "Enter your full name (at least 2 characters).";
  if (trimmed.length > NAME_MAX_LENGTH) {
    return `Name must be ${NAME_MAX_LENGTH} characters or fewer.`;
  }
  if (!NAME_RE.test(trimmed)) {
    return "Name can only include letters, spaces, hyphens, and apostrophes.";
  }
  return undefined;
}

export function validatePhoneNational(
  phoneCountry: string,
  phoneNational: string,
): string | undefined {
  return validateNationalPhone(phoneCountry, phoneNational);
}

export function validateEmail(email: string): string | undefined {
  const trimmed = email.trim();
  if (!trimmed) return "Email is required.";
  if (trimmed.length > EMAIL_MAX_LENGTH) {
    return `Email must be ${EMAIL_MAX_LENGTH} characters or fewer.`;
  }
  if (!EMAIL_RE.test(trimmed)) return "Enter a valid email address.";
  return undefined;
}

export function validatePropertyAddress(address: string): string | undefined {
  const trimmed = address.trim();
  if (!trimmed) return "Property address is required.";
  if (trimmed.length < 5) return "Enter the full street address.";
  if (trimmed.length > ADDRESS_MAX_LENGTH) {
    return `Address must be ${ADDRESS_MAX_LENGTH} characters or fewer.`;
  }
  return undefined;
}

export function validateZipCode(zipCode: string): string | undefined {
  const trimmed = zipCode.trim();
  if (!trimmed) return "Zip code is required.";
  if (!ZIP_RE.test(trimmed)) return "Enter a valid 5-digit zip code.";
  return undefined;
}

export function validatePreferredContactMethod(
  method: string,
): string | undefined {
  if (!PREFERRED_METHODS.has(method as PreferredContactMethod)) {
    return "Choose how you'd like to be contacted.";
  }
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
  const zipError = validateZipCode(values.zipCode);
  const preferredError = validatePreferredContactMethod(values.preferredContactMethod);
  const notesError = validateNotes(values.notes);
  if (nameError) errors.name = nameError;
  if (phoneError) errors.phoneNational = phoneError;
  if (emailError) errors.email = emailError;
  if (addressError) errors.propertyAddress = addressError;
  if (zipError) errors.zipCode = zipError;
  if (preferredError) errors.preferredContactMethod = preferredError;
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
    zipCode: values.zipCode.trim().slice(0, 5),
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
  zipCode?: string;
  preferredContactMethod?: PreferredContactMethod;
  notes?: string;
}): ContactFormErrors {
  return validateContactForm({
    name: contact.name ?? "",
    email: contact.email ?? "",
    phoneCountry: contact.phoneCountry ?? DEFAULT_COUNTRY_ISO2,
    phoneNational: contact.phoneNational ?? "",
    propertyAddress: contact.propertyAddress ?? "",
    zipCode: contact.zipCode ?? "",
    preferredContactMethod: contact.preferredContactMethod ?? "either",
    notes: contact.notes ?? "",
  });
}
