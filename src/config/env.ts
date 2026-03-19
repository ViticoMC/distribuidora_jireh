export const ENV = {
  APP_NAME: import.meta.env.VITE_APP_NAME || "Distribuidora Jireh",
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === "true",
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
} as const;
