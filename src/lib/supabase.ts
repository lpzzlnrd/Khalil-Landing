import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient<any, "public", any> | null = null;

/**
 * Returns a cached server-side Supabase client.
 * Throws only when the client is actually needed by a request.
 */
export function getSupabaseAdmin() {
  if (adminClient) {
    return adminClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  adminClient = createClient(supabaseUrl, supabaseServiceKey);
  return adminClient;
}
