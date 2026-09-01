/** Flag image URLs from flagcdn.com (WxH format — `w24` alone returns 404). */
export function countryFlagUrl(iso2: string): string {
  return `https://flagcdn.com/24x18/${iso2.toLowerCase()}.png`;
}
