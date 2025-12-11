import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  // Avoid throwing during Next.js build so pages can be compiled.
  // Do NOT call createClient with empty values because the SDK validates inputs and will throw.
  // Export null stubs so importing modules don't crash at build time. Runtime usage should
  // check for the presence of a configured client and surface a clear error.
  // eslint-disable-next-line no-console
  console.warn('Warning: Missing Supabase environment variables. Supabase client NOT created.');

  // Export typed `any` to keep compatibility with existing imports.
  // At runtime, attempts to use these will throw a helpful error instead of failing during build.
  export const supabase: any = null;
  export const supabaseAdmin: any = null;
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);

  export const supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_KEY || ''
  );
}
