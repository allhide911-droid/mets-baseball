import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/env";

const config = getSupabaseConfig();

export function getSupabaseConfigError(): string | null {
  return getSupabaseConfig().error;
}

export const supabase: SupabaseClient = createClient(
  config.url || "https://placeholder.supabase.co",
  config.anonKey || "placeholder",
);
