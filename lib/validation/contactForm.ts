/**
 * Client-side validation only — a placeholder until the real save API exists and does
 * server-side validation too. TODO: revisit once the backend dev's save+email API is live;
 * never trust client-side validation alone for data that gets persisted.
 */

export interface ContactFormValues {
  name: string;
  phone: string;
  email: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts common US formats: 5551234567, 555-123-4567, (555) 123-4567, +1 555 123 4567
const PHONE_RE = /^\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export function validateName(name: string): string | undefined {
  if (!name.trim()) return "Name is required.";
  if (name.trim().length < 2) return "Name looks too short.";
  return undefined;
}

export function validatePhone(phone: string): string | undefined {
  if (!phone.trim()) return "Phone number is required.";
  if (!PHONE_RE.test(phone.trim())) return "Enter a valid phone number.";
  return undefined;
}

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Email is required.";
  if (!EMAIL_RE.test(email.trim())) return "Enter a valid email address.";
  return undefined;
}

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const nameError = validateName(values.name);
  const phoneError = validatePhone(values.phone);
  const emailError = validateEmail(values.email);
  if (nameError) errors.name = nameError;
  if (phoneError) errors.phone = phoneError;
  if (emailError) errors.email = emailError;
  return errors;
}
