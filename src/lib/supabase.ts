import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!supabaseConfigured) {
  console.warn(
    "Supabase n'est pas configuré : définis VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.local (voir .env.example)."
  );
}

// createClient() throws immediately on an invalid URL, which would crash the whole
// app (landing page included) whenever the env vars are missing. Fall back to a
// syntactically valid placeholder so the app still renders; real calls will just
// fail (and are surfaced as normal errors) until Supabase is actually configured.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
