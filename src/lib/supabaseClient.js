import { createClient } from '@supabase/supabase-js';

// Ensure you set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vite environment.
const supabaseUrl = 'https://ahhvovmcaokqswjabdae.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoaHZvdm1jYW9rcXN3amFiZGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTk4NjAsImV4cCI6MjA5NTY5NTg2MH0.jESdfF5LiykYEJSrOHvNTRRd1eqgghabOVHwoaExxk4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
