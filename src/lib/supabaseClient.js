import { createClient } from '@supabase/supabase-js';

// Ensure you set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vite environment.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
