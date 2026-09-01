/**
 * Central, typed access to environment variables.
 *
 * NEXT_PUBLIC_* vars are inlined into the client bundle at build time — anything in that
 * namespace is effectively public. Server-only vars (e.g. the future Supabase service role
 * key) must NEVER be prefixed with NEXT_PUBLIC_ and must only be read from server-side code
 * (Route Handlers, Server Components, Server Actions) — never imported into a "use client" file.
 */

/**
 * Public — safe to expose to the browser. Used to load the Google Maps JS API script.
 * Intentionally does NOT throw when missing: components that need it (map, autocomplete)
 * check for an empty string themselves and render a friendly "not configured" state instead
 * of crashing the page during early setup.
 */
export function getGoogleMapsApiKey(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
}

/**
 * TODO: server-only vars for the future Supabase integration. Not used yet — declared here so
 * the public/server boundary is established up front. Read these only from server-side code.
 */
export function getSupabaseServerEnv() {
  return {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}
