const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ahhvovmcaokqswjabdae.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoaHZvdm1jYW9rcXN3amFiZGFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDExOTg2MCwiZXhwIjoyMDk1Njk1ODYwfQ.IvbNOg4Y9nq95RM97WM08jmxtnQppH3XdJBrz31wzL4');
async function run() {
  const { data: gallery, error: gError } = await supabase.from('gallery').select('*');
  console.log('Gallery rows details:', JSON.stringify(gallery, null, 2));

  const { data: events, error: eError } = await supabase.from('events').select('*');
  console.log('Events rows details:', JSON.stringify(events, null, 2));
}
run();
