export interface CountryPhoneConfig {
  /** ISO 3166-1 alpha-2 */
  iso2: string;
  name: string;
  dialCode: string;
  /** Expected national number length (digits only, excluding trunk prefix 0). */
  minLength: number;
  maxLength: number;
  /** Example shown as placeholder when this country is selected. */
  example: string;
}

/** Dialing countries — US first as the default for this product. */
export const COUNTRY_PHONE_CONFIGS: CountryPhoneConfig[] = [
  { iso2: "US", name: "United States", dialCode: "1", minLength: 10, maxLength: 10, example: "(555) 123-4567" },
  { iso2: "CA", name: "Canada", dialCode: "1", minLength: 10, maxLength: 10, example: "(555) 123-4567" },
  { iso2: "GB", name: "United Kingdom", dialCode: "44", minLength: 10, maxLength: 10, example: "07123 456789" },
  { iso2: "AU", name: "Australia", dialCode: "61", minLength: 9, maxLength: 9, example: "0412 345 678" },
  { iso2: "IN", name: "India", dialCode: "91", minLength: 10, maxLength: 10, example: "98765 43210" },
  { iso2: "MX", name: "Mexico", dialCode: "52", minLength: 10, maxLength: 10, example: "55 1234 5678" },
  { iso2: "DE", name: "Germany", dialCode: "49", minLength: 10, maxLength: 11, example: "0151 23456789" },
  { iso2: "FR", name: "France", dialCode: "33", minLength: 9, maxLength: 9, example: "06 12 34 56 78" },
  { iso2: "IT", name: "Italy", dialCode: "39", minLength: 9, maxLength: 10, example: "312 345 6789" },
  { iso2: "ES", name: "Spain", dialCode: "34", minLength: 9, maxLength: 9, example: "612 34 56 78" },
  { iso2: "NL", name: "Netherlands", dialCode: "31", minLength: 9, maxLength: 9, example: "06 12345678" },
  { iso2: "BE", name: "Belgium", dialCode: "32", minLength: 9, maxLength: 9, example: "0470 12 34 56" },
  { iso2: "CH", name: "Switzerland", dialCode: "41", minLength: 9, maxLength: 9, example: "078 123 45 67" },
  { iso2: "SE", name: "Sweden", dialCode: "46", minLength: 9, maxLength: 9, example: "070-123 45 67" },
  { iso2: "NO", name: "Norway", dialCode: "47", minLength: 8, maxLength: 8, example: "412 34 567" },
  { iso2: "DK", name: "Denmark", dialCode: "45", minLength: 8, maxLength: 8, example: "20 12 34 56" },
  { iso2: "IE", name: "Ireland", dialCode: "353", minLength: 9, maxLength: 9, example: "085 123 4567" },
  { iso2: "NZ", name: "New Zealand", dialCode: "64", minLength: 9, maxLength: 10, example: "021 123 4567" },
  { iso2: "SG", name: "Singapore", dialCode: "65", minLength: 8, maxLength: 8, example: "8123 4567" },
  { iso2: "AE", name: "United Arab Emirates", dialCode: "971", minLength: 9, maxLength: 9, example: "50 123 4567" },
  { iso2: "SA", name: "Saudi Arabia", dialCode: "966", minLength: 9, maxLength: 9, example: "50 123 4567" },
  { iso2: "ZA", name: "South Africa", dialCode: "27", minLength: 9, maxLength: 9, example: "082 123 4567" },
  { iso2: "BR", name: "Brazil", dialCode: "55", minLength: 10, maxLength: 11, example: "11 91234-5678" },
  { iso2: "AR", name: "Argentina", dialCode: "54", minLength: 10, maxLength: 10, example: "11 2345-6789" },
  { iso2: "JP", name: "Japan", dialCode: "81", minLength: 10, maxLength: 10, example: "090-1234-5678" },
  { iso2: "KR", name: "South Korea", dialCode: "82", minLength: 9, maxLength: 10, example: "010-1234-5678" },
  { iso2: "PH", name: "Philippines", dialCode: "63", minLength: 10, maxLength: 10, example: "0917 123 4567" },
  { iso2: "PK", name: "Pakistan", dialCode: "92", minLength: 10, maxLength: 10, example: "0300 1234567" },
];

export const DEFAULT_COUNTRY_ISO2 = "US";

export function getCountryByIso2(iso2: string): CountryPhoneConfig {
  return COUNTRY_PHONE_CONFIGS.find((c) => c.iso2 === iso2) ?? COUNTRY_PHONE_CONFIGS[0];
}

export function countryFlagEmoji(iso2: string): string {
  const code = iso2.toUpperCase();
  if (code.length !== 2) return "";
  return String.fromCodePoint(
    ...[...code].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65),
  );
}
