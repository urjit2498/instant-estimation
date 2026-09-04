import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerEnv } from "@/lib/env";

/**
 * Server-only Supabase client using the anon key.
 * Use from Route Handlers / Server Components / Server Actions only.
 * Writes succeed only if RLS policies allow them for the anon role.
 */
export function createSupabaseServerClient(): SupabaseClient {
  const { url, anonKey } = getSupabaseServerEnv();
  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Server-only admin client (bypasses RLS). Requires SUPABASE_SERVICE_ROLE_KEY.
 * Never import this into client components.
 */
export function createSupabaseAdminClient(): SupabaseClient {
  const { url, serviceRoleKey } = getSupabaseServerEnv();
  if (!serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Ask the client for it if you need to bypass RLS.",
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
