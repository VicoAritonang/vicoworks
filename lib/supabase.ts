import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Optional: specific client for server-side operations if the secret key is needed and available
// (e.g. for incrementing visitor count if RLS forbids anon updates)
const supabaseSecretKey = process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY;

export const supabaseAdmin = supabaseSecretKey 
  ? createClient<Database>(supabaseUrl, supabaseSecretKey)
  : null;

