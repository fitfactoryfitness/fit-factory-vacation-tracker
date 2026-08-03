import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Server-only client using the service role key. Never import this from a
// client component — it bypasses Row Level Security entirely. It's only
// ever used inside src/app/api/**/route.ts handlers, which run on the
// server and are the only thing that talks to Supabase (see .env.example).
let client: ReturnType<typeof createClient<Database>> | null = null;

export function supabaseServer() {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Copy .env.example to .env.local and fill them in (see README.md)."
    );
  }

  client = createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
  return client;
}
