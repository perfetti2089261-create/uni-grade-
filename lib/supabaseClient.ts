import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  // Avoid throwing during Next.js build so pages can be compiled.
  // Runtime requests will still fail if env vars are missing; keep a warning for debugging.
  // Ensure imports don't crash the build.
  // eslint-disable-next-line no-console
  console.warn('Warning: Missing Supabase environment variables. Supabase client will be created with empty values.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_KEY || ''
);
