# Klinik Mardi Lestari — Setup Guide
pasword supabase klinikmardilestari
klinikmardilestari5
Panduan singkat untuk menjalankan project frontend dan integrasi Supabase (PostgreSQL) serta opsi backend Node/Express.

## Prasyarat
- Node.js 18+ dan npm atau yarn
- Akun Supabase (untuk database & authentication)

## Environment (Vite)
Buat file `.env.local` di root project dengan variabel berikut:

VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"

Jangan pernah menaruh Service Role Key di frontend.

## Install dependencies
Jalankan di folder project:

```bash
npm install
# atau
yarn
```

Jika Anda belum menginstal Supabase client (sudah disiapkan sebelumnya), jalankan:

```bash
npm install @supabase/supabase-js
```

## Menjalankan development server

```bash
npm run dev
# atau dengan yarn
yarn dev
```

Frontend akan berjalan menggunakan Vite (default: http://localhost:5173).

## Konfigurasi Supabase

1. Masuk ke dashboard Supabase dan buat project baru.
2. Buat tabel-tabel dasar yang digunakan admin: `doctors`, `schedules`, `events`, `videos`, `gallery`, `smartcheck`.
   - Contoh skema minimal `doctors`:
     - id (serial / bigint, primary key)
     - name (text)
     - specialization (text)
     - phone (text)
     - status (text)

   - Contoh skema `smartcheck` minimal:
     - id
     - title (text)
     - category (text)

3. Pada menu `Authentication` → `Users`, buat akun admin untuk login (atau gunakan sign-up flow di aplikasi jika tersedia).

4. Ambil `Project URL` dan `anon/public key` dari `Settings` → `API` lalu masukkan ke `.env.local`.

## Integrasi yang telah dilakukan di project

- `src/lib/supabaseClient.js`: helper Supabase client yang membaca `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
- `src/pages/AdminLogin.jsx`: menggunakan `supabase.auth.signInWithPassword({ email, password })` untuk autentikasi.
- `src/pages/AdminDashboard.jsx`: mencoba memuat data dari tabel Supabase (`doctors`, `schedules`, `events`, `videos`, `gallery`, `smartcheck`) dengan fallback ke data dummy.

Pastikan schema tabel cocok dengan kolom yang digunakan di `AdminDashboard.jsx`. Jika tidak, sesuaikan mapping field atau ubah query.

## Opsi: Backend Node.js + Express (direkomendasikan untuk operasi sensitif)

Untuk operasi yang membutuhkan kunci service (mis. write terproteksi, perhitungan Smart Check sensitif), buat server backend:

1. Inisialisasi project baru di folder `server/`:

```bash
mkdir server && cd server
npm init -y
npm install express cors dotenv @supabase/supabase-js
```

2. Contoh `server/index.js` singkat:

```js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Contoh endpoint: ambil daftar dokter (privileged)
app.get('/api/doctors', async (req, res) => {
  const { data, error } = await supabase.from('doctors').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.listen(process.env.PORT || 4000, () => console.log('Server running'));
```

3. Tambahkan `.env` di folder `server/`:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

4. Jalankan server:

```bash
node index.js
```

Frontend kemudian dapat memanggil endpoint backend (`/api/...`) untuk operasi sensitif.

## Keamanan & Best Practices
- Jangan simpan Service Role Key di frontend. Gunakan backend untuk operasi privileged.
- Batasi RLS (Row Level Security) di Supabase bila perlu, dan gunakan claims/roles untuk membatasi akses.
- Untuk produksi, gunakan HTTPS dan atur CORS dengan benar.

## Tambahan
Jika Anda mau, saya bisa:
- Menyediakan skrip scaffold Express lebih lengkap (auth, proxy, contoh endpoint CRUD),
- Membuat migration SQL contoh untuk tabel-tabel yang dibutuhkan,
- Membuat skrip pembuatan akun admin otomatis menggunakan Supabase Admin key.

---
Terakhir diperbarui: May 30, 2026
