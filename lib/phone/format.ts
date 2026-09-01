import { getCountryByIso2 } from "@/lib/phone/countries";

/** Strip everything except digits from a phone string. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function formatUsCa(digits: string): string {
  const d = digits.slice(0, 10);
  if (d.length <= 3) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function formatGb(digits: string): string {
  const d = digits.slice(0, 10);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)} ${d.slice(5)}`;
}

function formatIn(digits: string): string {
  const d = digits.slice(0, 10);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)} ${d.slice(5)}`;
}

function formatAu(digits: string): string {
  const d = digits.slice(0, 9);
  if (d.length <= 4) return d;
  if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
}

function formatMx(digits: string): string {
  const d = digits.slice(0, 10);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `${d.slice(0, 2)} ${d.slice(2)}`;
  return `${d.slice(0, 2)} ${d.slice(2, 6)} ${d.slice(6)}`;
}

function formatDe(digits: string): string {
  const d = digits.slice(0, 11);
  if (d.length <= 4) return d;
  return `${d.slice(0, 4)} ${d.slice(4)}`;
}

function formatFr(digits: string): string {
  const d = digits.slice(0, 9);
  const parts: string[] = [];
  for (let i = 0; i < d.length; i += 2) {
    parts.push(d.slice(i, i + 2));
  }
  return parts.join(" ");
}

function formatGrouped(digits: string, groups: number[]): string {
  const parts: string[] = [];
  let offset = 0;
  for (const size of groups) {
    if (offset >= digits.length) break;
    parts.push(digits.slice(offset, offset + size));
    offset += size;
  }
  if (offset < digits.length) {
    parts.push(digits.slice(offset));
  }
  return parts.join(" ");
}

function formatJpKr(digits: string): string {
  const d = digits.slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

function formatBr(digits: string): string {
  const d = digits.slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `${d.slice(0, 2)} ${d.slice(2)}`;
  return `${d.slice(0, 2)} ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Format national digits for display as the user types. */
export function formatNationalPhone(iso2: string, raw: string): string {
  const digits = digitsOnly(raw);
  const country = getCountryByIso2(iso2);
  const max = country.maxLength;
  const d = digits.slice(0, max);

  switch (iso2) {
    case "US":
    case "CA":
      return formatUsCa(d);
    case "GB":
      return formatGb(d);
    case "IN":
      return formatIn(d);
    case "AU":
      return formatAu(d);
    case "MX":
      return formatMx(d);
    case "DE":
      return formatDe(d);
    case "FR":
      return formatFr(d);
    case "IT":
      return formatGrouped(d, [3, 3, 4]);
    case "ES":
      return formatGrouped(d, [3, 2, 2, 2]);
    case "NL":
      return formatGrouped(d, [2, 8]);
    case "BE":
      return formatGrouped(d, [4, 2, 2, 2]);
    case "CH":
      return formatGrouped(d, [3, 3, 2, 2]);
    case "SE":
      return formatGrouped(d, [3, 3, 3]);
    case "NO":
    case "DK":
      return formatGrouped(d, [3, 2, 3]);
    case "IE":
      return formatGrouped(d, [3, 3, 4]);
    case "NZ":
      return formatGrouped(d, [3, 3, 4]);
    case "SG":
      return formatGrouped(d, [4, 4]);
    case "AE":
    case "SA":
      return formatGrouped(d, [2, 3, 4]);
    case "ZA":
      return formatGrouped(d, [3, 3, 4]);
    case "BR":
      return formatBr(d);
    case "AR":
      return formatGrouped(d, [2, 4, 4]);
    case "JP":
    case "KR":
      return formatJpKr(d);
    case "PH":
      return formatGrouped(d, [4, 3, 3]);
    case "PK":
      return formatGrouped(d, [4, 7]);
    default:
      return d;
  }
}

/** Full international number in E.164 form, e.g. +15551234567 */
export function toE164(iso2: string, nationalFormatted: string): string {
  const country = getCountryByIso2(iso2);
  const digits = digitsOnly(nationalFormatted);
  return `+${country.dialCode}${digits}`;
}

export function validateNationalPhone(iso2: string, nationalFormatted: string): string | undefined {
  const country = getCountryByIso2(iso2);
  const digits = digitsOnly(nationalFormatted);
  if (!digits) return "Phone number is required.";
  if (digits.length < country.minLength) {
    return `Enter a valid number (e.g. ${country.example}).`;
  }
  if (digits.length > country.maxLength) {
    return `Enter a valid number (e.g. ${country.example}).`;
  }
  return undefined;
}
