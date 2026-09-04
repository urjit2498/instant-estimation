import { getSupabaseServerEnv } from "@/lib/env";

/**
 * Shared server-only caller for Supabase Edge Functions.
 */
export async function callEdgeFunction<T>(
  functionName: string,
  body: unknown,
): Promise<T> {
  const { url, anonKey } = getSupabaseServerEnv();

  const res = await fetch(`${url}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${anonKey}`,
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  let payload: { status?: number; message?: string; data?: T | null };
  try {
    payload = (await res.json()) as { status?: number; message?: string; data?: T | null };
  } catch {
    throw new Error(`${functionName} response was not valid JSON`);
  }

  if (!res.ok || payload.status !== 200 || payload.data == null) {
    throw new Error(payload.message || `${functionName} failed (${res.status})`);
  }

  return payload.data;
}
