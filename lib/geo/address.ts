export interface AddressParts {
  address: string;
  zipCode: string;
}

interface AddressComponentLike {
  long_name: string;
  short_name: string;
  types: string[];
}

/** Strip a trailing US zip (and optional country) so street/city/state stay in `address`. */
export function splitAddressAndZip(fullAddress: string): AddressParts {
  const withoutCountry = fullAddress
    .trim()
    .replace(/,?\s*United States\s*$/i, "")
    .replace(/,?\s*USA\s*$/i, "")
    .trim();

  const match = withoutCountry.match(/^(.*?)(?:,)?\s+(\d{5})(?:-\d{4})?\s*$/);
  if (!match) return { address: withoutCountry, zipCode: "" };

  return {
    address: match[1].replace(/[,\s]+$/, "").trim(),
    zipCode: match[2],
  };
}

function componentValue(
  components: AddressComponentLike[] | undefined,
  type: string,
  short = false,
): string {
  const found = components?.find((c) => c.types.includes(type));
  if (!found) return "";
  return short ? found.short_name : found.long_name;
}

/** Prefer Google address_components (Places / Geocoder); fall back to parsing the formatted string. */
export function addressPartsFromComponents(
  components: AddressComponentLike[] | undefined,
  fallbackFormatted = "",
): AddressParts {
  const zip = componentValue(components, "postal_code").slice(0, 5);
  const street = [componentValue(components, "street_number"), componentValue(components, "route")]
    .filter(Boolean)
    .join(" ");
  const city =
    componentValue(components, "locality") ||
    componentValue(components, "sublocality_level_1") ||
    componentValue(components, "postal_town") ||
    componentValue(components, "administrative_area_level_2");
  const state = componentValue(components, "administrative_area_level_1", true);
  const assembled = [street, city, state].filter(Boolean).join(", ");

  if (assembled) return { address: assembled, zipCode: zip };

  const split = splitAddressAndZip(fallbackFormatted);
  return { address: split.address, zipCode: zip || split.zipCode };
}
