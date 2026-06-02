# Fungsi Edit dan Delete ke Supabase

## Ringkasan Implementasi

Telah ditambahkan fungsi **Edit** dan **Delete** yang langsung terintegrasi dengan Supabase melalui backend API.

## Perubahan yang Dilakukan

### 1. Backend Server (`server/index.js`)
Menambahkan DELETE endpoints untuk semua table:

```javascript
// DELETE /api/doctors/:id
app.delete('/api/doctors/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('doctors').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, id });
});
```

Endpoints yang tersedia:
- `DELETE /api/doctors/:id`
- `DELETE /api/schedules/:id`
- `DELETE /api/events/:id`
- `DELETE /api/videos/:id`
- `DELETE /api/gallery/:id`
- `DELETE /api/smartcheck/:id`

### 2. API Helper (`src/lib/adminApi.js`)
Menambahkan method `.delete(id)` untuk setiap panel:

```javascript
// Contoh untuk doctors
doctors: {
  async getAll() { /* ... */ },
  async create(data) { /* ... */ },
  async update(id, data) { /* ... */ },
  async delete(id) {  // ← NEW
    const res = await fetch(`${API_BASE}/doctors/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete doctor');
    }
    return res.json();
  },
}
```

### 3. Admin Dashboard (`src/pages/AdminDashboard.jsx`)
Update `handleDelete` untuk call API:

```javascript
const handleDelete = async (row) => {
  try {
    if (activePanel === 'doctors') {
      await adminApi.doctors.delete(row.id);
      setRows(prev => ({ ...prev, doctors: prev.doctors.filter(r => r.id !== row.id) }));
    }
    // ... handle untuk panel lainnya
    showToast('Record deleted successfully.');
  } catch (err) {
    showToast('Error: ' + err.message);
  }
};
```

## Cara Menggunakan

### Edit Data
1. Buka admin dashboard
2. Klik **Edit** (icon pensil) di row yang ingin diubah
3. Update field yang diperlukan
4. Klik **Save**
5. Data akan tersimpan langsung ke Supabase

### Hapus Data
1. Buka admin dashboard
2. Klik **Delete** (icon tempat sampah) di row yang ingin dihapus
3. Konfirmasi (jika ada dialog)
4. Data akan dihapus langsung dari Supabase

## Alur Data (Edit)

```
Admin UI
  ↓
handleSave() → adminApi.{panel}.update(id, data)
  ↓
Backend API → PUT /api/{panel}/:id
  ↓
Supabase.from(table).update()
  ↓
Database
```

## Alur Data (Delete)

```
Admin UI
  ↓
handleDelete() → adminApi.{panel}.delete(id)
  ↓
Backend API → DELETE /api/{panel}/:id
  ↓
Supabase.from(table).delete()
  ↓
Database
```

## Error Handling

Jika terjadi error, user akan melihat toast notification:

```
❌ Error: Failed to update doctor
```

Console akan menunjukkan detail error untuk debugging.

## Testing

Untuk test fungsi edit dan delete:

1. **Test Edit:**
   ```
   1. Login admin
   2. Pilih panel (misal: Doctors)
   3. Klik Edit pada salah satu dokter
   4. Ubah nama
   5. Klik Save
   6. Refresh halaman - data seharusnya masih berubah
   ```

2. **Test Delete:**
   ```
   1. Login admin
   2. Pilih panel (misal: Events)
   3. Klik Delete pada salah satu event
   4. Refresh halaman - data seharusnya hilang
   ```

3. **Verify di Supabase:**
   - Buka Supabase Dashboard
   - Lihat table yang bersangkutan
   - Konfirmasi data benar-benar ter-update/terhapus

## Endpoints Summary

| Operasi | Method | Endpoint | Fungsi |
|---------|--------|----------|--------|
| List | GET | `/api/{panel}` | Ambil semua data |
| Create | POST | `/api/{panel}` | Tambah data baru |
| Update | PUT | `/api/{panel}/:id` | Edit data |
| Delete | DELETE | `/api/{panel}/:id` | Hapus data |

## Troubleshooting

### Delete tidak berhasil

1. **Check console browser (F12)**
   - Tab Network: lihat request ke DELETE endpoint
   - Tab Console: lihat error message

2. **Check server logs**
   - Lihat terminal tempat server jalan
   - Pastikan tidak ada error

3. **Check Supabase**
   - Pastikan ada policy yang allow delete untuk service role

### Data tidak hilang setelah delete

- Refresh halaman (Ctrl+F5)
- Check console untuk error
- Lihat Supabase dashboard untuk konfirmasi

## File yang Dimodifikasi

- ✅ `server/index.js` - Tambah DELETE endpoints
- ✅ `src/lib/adminApi.js` - Tambah delete methods
- ✅ `src/pages/AdminDashboard.jsx` - Update handleDelete
- 📄 `EDIT_DELETE_FUNCTIONS.md` - File ini (dokumentasi)
