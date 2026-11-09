import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { ensurePassengerSession } from "@sbt/supabase-client";
import { supabase } from "../lib/supabase";

/** Silently establishes the anonymous Supabase session on first mount (zero-login UX).
 * Non-blocking: if the backend is unreachable/misconfigured, the app still
 * renders in degraded mode (session=null, error set) instead of a dead end. */
export function usePassengerSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    ensurePassengerSession(supabase)
      .then((s) => {
        if (cancelled) return;
        setSession(s);
        setSettled(true);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to start session");
        setSettled(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { session, isReady: settled, error };
}
