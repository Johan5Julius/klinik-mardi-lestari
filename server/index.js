require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Helper function untuk reset sequence (ID) ke 1
const resetSequence = async (tableName, sequenceName) => {
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `ALTER SEQUENCE ${sequenceName} RESTART WITH 1;`
    }).catch(() => {
      // Fallback jika rpc tidak tersedia, gunakan raw query
      return supabase.from(tableName).select('COUNT(*)');
    });
    
    return !error;
  } catch (e) {
    console.warn('Could not reset sequence:', e.message);
    return false;
  }
};

// ============ DOCTORS ============
app.get('/api/doctors', async (req, res) => {
  const { data, error } = await supabase.from('doctors').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/doctors', async (req, res) => {
  const { name, specialization, phone, status } = req.body;
  const { data, error } = await supabase.from('doctors')
    .insert([{ name, specialization, phone, status }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/doctors/:id', async (req, res) => {
  const { id } = req.params;
  const { name, specialization, phone, status } = req.body;
  const { data, error } = await supabase.from('doctors')
    .update({ name, specialization, phone, status })
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/doctors/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('doctors').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, id });
});

// ============ SCHEDULES ============
app.get('/api/schedules', async (req, res) => {
  const { data, error } = await supabase.from('schedules').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/schedules', async (req, res) => {
  const { doctor_id, day, time_slot, room } = req.body;
  const { data, error } = await supabase.from('schedules')
    .insert([{ doctor_id, day, time_slot, room }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/schedules/:id', async (req, res) => {
  const { id } = req.params;
  const { doctor_id, day, time_slot, room } = req.body;
  const { data, error } = await supabase.from('schedules')
    .update({ doctor_id, day, time_slot, room })
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/schedules/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('schedules').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, id });
});

// ============ EVENTS ============
app.get('/api/events', async (req, res) => {
  const { data, error } = await supabase.from('events').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/events', async (req, res) => {
  const { title, description, date, category, status, location, image_url } = req.body;
  const { data, error } = await supabase.from('events')
    .insert([{ title, description, date, category, status, location, image_url }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, date, category, status, location, image_url } = req.body;
  const { data, error } = await supabase.from('events')
    .update({ title, description, date, category, status, location, image_url })
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, id });
});

// ============ VIDEOS ============
app.get('/api/videos', async (req, res) => {
  const { data, error } = await supabase.from('videos').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/videos', async (req, res) => {
  const { title, url, duration, category } = req.body;
  const { data, error } = await supabase.from('videos')
    .insert([{ title, url, duration, category }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/videos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, url, duration, category } = req.body;
  const { data, error } = await supabase.from('videos')
    .update({ title, url, duration, category })
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/videos/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('videos').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, id });
});

// ============ GALLERY ============
app.get('/api/gallery', async (req, res) => {
  const { data, error } = await supabase.from('gallery').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/gallery', async (req, res) => {
  const { title, image_url, category, description } = req.body;
  const { data, error } = await supabase.from('gallery')
    .insert([{ title, image_url, category, description }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/gallery/:id', async (req, res) => {
  const { id } = req.params;
  const { title, image_url, category, description } = req.body;
  const { data, error } = await supabase.from('gallery')
    .update({ title, image_url, category, description })
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/gallery/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, id });
});

// ============ SMART CHECK ============
app.get('/api/smartcheck', async (req, res) => {
  const { data, error } = await supabase.from('smartcheck_questions').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/smartcheck', async (req, res) => {
  const { question_text, category } = req.body;
  const { data, error } = await supabase.from('smartcheck_questions')
    .insert([{ question_text, category }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/smartcheck/:id', async (req, res) => {
  const { id } = req.params;
  const { question_text, category } = req.body;
  const { data, error } = await supabase.from('smartcheck_questions')
    .update({ question_text, category })
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/smartcheck/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('smartcheck_questions').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, id });
});

// ============ RESET SEQUENCE (AUTO-INCREMENT ID) ============
// Endpoint untuk reset ID ke 1 setelah semua data dihapus
const sequences = {
  doctors: 'doctors_id_seq',
  schedules: 'schedules_id_seq',
  events: 'events_id_seq',
  videos: 'videos_id_seq',
  gallery: 'gallery_id_seq',
  smartcheck_questions: 'smartcheck_questions_id_seq',
};

app.post('/api/reset-sequence/:table', async (req, res) => {
  const { table } = req.params;
  const sequenceName = sequences[table];
  
  if (!sequenceName) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  try {
    // Gunakan raw SQL query untuk reset sequence
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `ALTER SEQUENCE ${sequenceName} RESTART WITH 1;`
    });

    if (error) {
      // Jika RPC tidak tersedia, berikan instruksi manual
      return res.json({
        warning: 'Could not auto-reset via RPC',
        instruction: `Run this SQL in Supabase: ALTER SEQUENCE ${sequenceName} RESTART WITH 1;`,
        success: false
      });
    }

    res.json({ 
      success: true, 
      message: `Sequence ${sequenceName} reset to 1` 
    });
  } catch (e) {
    console.error('Reset sequence error:', e);
    res.status(500).json({ 
      error: e.message,
      instruction: `Run this SQL in Supabase: ALTER SEQUENCE ${sequences[table]} RESTART WITH 1;`
    });
  }
});

// GET endpoint untuk check ID terakhir di table
app.get('/api/last-id/:table', async (req, res) => {
  const { table } = req.params;
  
  const { data, error } = await supabase
    .from(table)
    .select('id')
    .order('id', { ascending: false })
    .limit(1);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const lastId = data && data.length > 0 ? data[0].id : 0;
  res.json({ table, lastId });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));