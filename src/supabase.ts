
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  const msg = "CRITICAL ERROR: Supabase keys are missing in .env file. Database connection will fail.";
  console.error(msg);
  // Alert in browser so it is obvious
  if (typeof window !== 'undefined') {
      alert(msg);
  }
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '') as any;
