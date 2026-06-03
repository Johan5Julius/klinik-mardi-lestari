const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Key.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log('Attempting to create "facilities" table via exec_sql RPC...');
  
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS public.facilities (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      color TEXT NOT NULL DEFAULT '#0284c7',
      motto TEXT,
      icon TEXT NOT NULL DEFAULT 'Hospital',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSql });
    if (error) {
      console.warn('RPC exec_sql failed:', error.message || error);
      console.log('Please execute this SQL manually in your Supabase dashboard SQL editor:');
      console.log(createTableSql);
    } else {
      console.log('Success! Table "facilities" created or already exists.', data);
    }
  } catch (err) {
    console.error('Unexpected error executing RPC:', err);
  }
}

run();
