require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Helper to ensure storage bucket exists
const ensureBucketExists = async (bucketName) => {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) return;
    const exists = buckets.some(b => b.name === bucketName);
    if (!exists) {
      console.log(`Bucket "${bucketName}" not found. Creating programmatically...`);
      await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      });
    }
  } catch (e) {
    console.warn('Error ensuring bucket exists:', e.message);
  }
};

// ============ FILE UPLOAD (BYPASS RLS VIA SERVICE KEY) ============
app.post('/api/upload', async (req, res) => {
  const { file, name, folder } = req.body;
  if (!file || !name) {
    return res.status(400).json({ error: 'File data and file name are required.' });
  }

  try {
    const matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 image data format.' });
    }

    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const folderName = folder || 'events';
    const filePath = `${folderName}/${Date.now()}_${name}`;

    // Ensure the bucket exists before attempting upload
    await ensureBucketExists('events');

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('events')
      .upload(filePath, buffer, {
        contentType,
        upsert: true
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError.message || uploadError);
      return res.status(500).json({ error: uploadError.message || 'Storage upload failed.' });
    }

    const { data } = supabase.storage
      .from('events')
      .getPublicUrl(filePath);

    res.json({ publicUrl: data?.publicUrl || null });
  } catch (err) {
    console.error('Unexpected upload endpoint error:', err);
    res.status(500).json({ error: err.message });
  }
});

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
  const { doctor_id, day, time_slot, room, facility_id } = req.body;
  const { data, error } = await supabase.from('schedules')
    .insert([{ doctor_id, day, time_slot, room, facility_id }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/schedules/:id', async (req, res) => {
  const { id } = req.params;
  const { doctor_id, day, time_slot, room, facility_id } = req.body;
  const { data, error } = await supabase.from('schedules')
    .update({ doctor_id, day, time_slot, room, facility_id })
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

// ============ FACILITIES ============
app.get('/api/facilities', async (req, res) => {
  const { data, error } = await supabase.from('facilities').select('*').order('id', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/facilities', async (req, res) => {
  const { slug, name, description, color, motto, icon } = req.body;
  const { data, error } = await supabase.from('facilities')
    .insert([{ slug, name, description, color, motto, icon }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/facilities/:id', async (req, res) => {
  const { id } = req.params;
  const { slug, name, description, color, motto, icon } = req.body;
  const { data, error } = await supabase.from('facilities')
    .update({ slug, name, description, color, motto, icon })
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/facilities/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('facilities').delete().eq('id', id);
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
    .insert([{ title, image_url: image_url || '', category, description }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/gallery/:id', async (req, res) => {
  const { id } = req.params;
  const { title, image_url, category, description } = req.body;
  const { data, error } = await supabase.from('gallery')
    .update({ title, image_url: image_url || '', category, description })
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

// ============ SMART CHECK CATEGORIES ============
app.put('/api/smartcheck/category/:oldName', async (req, res) => {
  const { oldName } = req.params;
  const { newName } = req.body;
  const { data, error } = await supabase.from('smartcheck_questions')
    .update({ category: newName })
    .eq('category', oldName)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/smartcheck/category/:name', async (req, res) => {
  const { name } = req.params;
  const { error } = await supabase.from('smartcheck_questions')
    .delete()
    .eq('category', name);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, category: name });
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
  facilities: 'facilities_id_seq',
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