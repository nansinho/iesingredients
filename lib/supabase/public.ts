import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Anonymous Supabase client for cacheable, cookie-free reads.
 *
 * Use this in Server Components that should remain statically rendered with
 * ISR. The standard server client reads cookies (via next/headers) which opts
 * the route out of static generation; this one does not, so pages that call
 * it can still be cached and revalidated on a timer.
 */
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
