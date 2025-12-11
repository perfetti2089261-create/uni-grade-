import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Always export the names so TypeScript imports work; they may be `null` at build time
// if env vars aren't set. Use the runtime accessors below to get safe clients.
export let supabase: SupabaseClient | null = null;
export let supabaseAdmin: SupabaseClient | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  // Avoid throwing during Next.js build so pages can be compiled.
  // Do NOT call createClient with empty values because the SDK validates inputs and will throw.
  // eslint-disable-next-line no-console
  console.warn('Warning: Missing Supabase environment variables. Supabase client NOT created.');
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_KEY || '');
}

/**
 * Runtime-safe accessors. Use these when you need a clear runtime error
 * if Supabase is not configured (preferred for server-side use).
 */
export function getSupabase() {
  if (!supabase) {
    throw new Error('Supabase client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
  return supabase;
}

export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client is not configured. Set SUPABASE_SERVICE_KEY.');
  }
  return supabaseAdmin;
}
