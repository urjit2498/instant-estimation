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
 * Server-only Supabase env. Read these only from Route Handlers / Server Components /
 * Server Actions — never import into a "use client" file.
 *
 * Prefer the anon key + RLS for normal writes. Use service role only when you must bypass RLS.
 */
export function getSupabaseServerEnv() {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_ANON_KEY. Add them to .env.local.",
    );
  }

  return { url, anonKey, serviceRoleKey };
}
