import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Lazily-created, server-only Supabase client. We create it on first use (at
 * request time) rather than at import time so that `next build` never crashes
 * if env vars are momentarily unset. The key lives in server env vars and is
 * never shipped to the browser — all data access goes through Server
 * Components and Route Handlers guarded by the app's own admin auth.
 */
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  if (!url || !key) {
    throw new Error(
      "Не заданы переменные окружения SUPABASE_URL и SUPABASE_KEY. " +
        "Добавьте их в .env.local (локально) или в настройки проекта на Vercel."
    );
  }
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

export const DOC = {
  content: "content",
  course: "course",
  users: "users",
  leads: "leads",
} as const;
