import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Use fallback values during build time if env vars are not available
// These will be replaced with actual values at runtime in Google Cloud
// The placeholder values allow the build to complete successfully
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder';

// Create client with fallback values (will work at runtime when real env vars are provided)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Optional: specific client for server-side operations if the secret key is needed and available
const supabaseSecretKey = process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY;

export const supabaseAdmin = supabaseSecretKey 
  ? createClient<Database>(supabaseUrl, supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;
