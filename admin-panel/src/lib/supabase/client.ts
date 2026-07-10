import { createClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client using the public anon key. Currently unused by the
 * admin panel (all writes go through server API routes with the service role
 * key), but provided for future client-side reads (e.g. Supabase Auth,
 * realtime subscriptions) once you extend the panel.
 */
export function getSupabaseBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
