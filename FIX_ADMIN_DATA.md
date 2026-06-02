# Fix: Admin Data Tidak Tersimpan ke Supabase

## Penyebab Masalah

Ada beberapa masalah yang menyebabkan data admin tidak tersimpan ke Supabase:

### 1. **Row Level Security (RLS) Memblokir Anonymous Access**
   - Admin dashboard menggunakan `supabase.anonKey` (anonymous key)
   - Tabel Supabase kemungkinan memiliki RLS policies yang memblokir insert/update dari anonymous user
   - Server memiliki `SUPABASE_SERVICE_KEY` yang punya akses penuh, tapi tidak digunakan

### 2. **Error Handling Tidak Transparan**
   - Kode lama menggunakan fallback ke local state tanpa memberitahu user
   - Ketika insert/update gagal, user melihat data tersimpan (di UI lokal) padahal DB tidak updated

### 3. **API Backend Tidak Dimanfaatkan**
   - Backend server sudah ada di `server/index.js` dengan service key
   - Admin hanya menggunakan Supabase client langsung dengan anonymous key

## Solusi yang Diterapkan

### ✅ 1. Update Backend Server (`server/index.js`)
Menambahkan API endpoints lengkap untuk semua operasi:
- `POST/PUT /api/doctors`
- `POST/PUT /api/schedules`
- `POST/PUT /api/events`
- `POST/PUT /api/videos`
- `POST/PUT /api/gallery`
- `POST/PUT /api/smartcheck`

Semua endpoint menggunakan `SUPABASE_SERVICE_KEY` yang punya akses penuh.

### ✅ 2. Buat API Helper (`src/lib/adminApi.js`)
File baru dengan fungsi helper untuk memanggil backend API:
```javascript
adminApi.doctors.create(data)
adminApi.doctors.update(id, data)
adminApi.schedules.create(data)
// ... etc
```

### ✅ 3. Update Admin Dashboard (`src/pages/AdminDashboard.jsx`)
- Import `adminApi` dari `src/lib/adminApi.js`
- Ganti semua direct Supabase calls ke API calls
- Update `loadAll()` useEffect
- Update `handleSave()` function
- Error messages sekarang jelas dan transparan

## Cara Setup

### 1. Pastikan Environment Variables di Server
Di `server/.env`:
```
SUPABASE_URL=https://ahhvovmcaokqswjabdae.supabase.co
SUPABASE_SERVICE_KEY=your-service-key-here
PORT=4000
```

### 2. Jalankan Backend Server
```bash
cd server
npm install
npm start
```

Server akan berjalan di `http://localhost:4000`

### 3. Jalankan Frontend
```bash
npm run dev
```

### 4. Test Admin Dashboard
1. Login ke admin dashboard
2. Tambah/edit data di salah satu panel (Doctors, Events, dll)
3. Data seharusnya tersimpan ke Supabase
4. Refresh halaman - data masih ada (buktian berhasil di DB)

## Apa yang Berubah?

| Sebelum | Sesudah |
|---------|---------|
| Direct Supabase client call dengan anonKey | Backend API call dengan serviceKey |
| Error handling fallback silent | Error ditampilkan ke user |
| RLS policies bisa block | Service key bypass RLS |
| Sulit debug | Clear error messages |

## Troubleshooting

### Data masih tidak tersimpan?

1. **Check server berjalan:**
   ```
   curl http://localhost:4000/api/doctors
   ```

2. **Check environment variable:**
   ```
   Pastikan server/.env punya SUPABASE_SERVICE_KEY yang valid
   ```

3. **Check console browser:**
   - Buka DevTools (F12)
   - Lihat tab Network untuk melihat API calls
   - Lihat Console untuk error messages

4. **Check Supabase RLS policies:**
   - Buka Supabase dashboard
   - Menu Authentication > Policies
   - Pastikan ada policy yang allow service role untuk select/insert/update

5. **Check CORS:**
   - Server sudah punya `cors()` middleware
   - Pastikan frontend URL tercakup dalam CORS configuration

### Error "Failed to fetch"?
- Pastikan backend server sudah dijalankan di `http://localhost:4000`
- Check apakah ada port conflict

### Error "connection refused"?
- Backend server mungkin belum started
- Cek console server untuk error messages

## File yang Dibuat/Diubah

- ✅ `server/index.js` - Ditambah API endpoints
- ✅ `src/lib/adminApi.js` - Baru, helper untuk API calls
- ✅ `src/pages/AdminDashboard.jsx` - Updated untuk pakai API
- 📄 `FIX_ADMIN_DATA.md` - File ini (dokumentasi)

## Next Steps (Optional)

1. **Add Delete Endpoints** - Tambah DELETE endpoints untuk semua tables
2. **Add Authentication** - Middleware untuk verify admin token
3. **Add Logging** - Server-side logging untuk audit trail
4. **Add Rate Limiting** - Prevent abuse
5. **Environment Config** - Update untuk production (change localhost)
