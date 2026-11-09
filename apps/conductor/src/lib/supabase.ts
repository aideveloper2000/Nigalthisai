import { createSupabaseClient, readSupabaseEnv } from "@sbt/supabase-client";

function createClientSafe() {
  try {
    return createSupabaseClient(readSupabaseEnv(import.meta.env));
  } catch (e) {
    // Missing/misconfigured env must not blank the whole app at import time.
    // Fall back to an unreachable placeholder; callers handle the failure
    // gracefully (offline/degraded mode) instead of crashing on load.
    console.warn("Supabase env missing/invalid, running without backend:", e);
    return createSupabaseClient({
      url: "https://placeholder.supabase.co",
      anonKey: "placeholder-anon-key",
    });
  }
}

export const supabase = createClientSafe();
