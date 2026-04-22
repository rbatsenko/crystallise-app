import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Service-role client. Server-only. Bypasses RLS — never expose the key
// to the browser or ship it in client bundles.
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
