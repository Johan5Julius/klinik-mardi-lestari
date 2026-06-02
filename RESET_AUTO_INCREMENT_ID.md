# Reset Auto-Increment ID ke 1

## Masalah

Ketika semua data dihapus dari suatu table, ID berikutnya tidak mulai dari 1 lagi, melainkan melanjut dari nomor terakhir yang pernah ada.

**Contoh:**
```
Awal:
id: 1, name: "Dr. A"
id: 2, name: "Dr. B"
id: 3, name: "Dr. C"

Hapus semua data

Tambah data baru → id: 4 (bukan 1)
```

Ini karena PostgreSQL menggunakan **SEQUENCE** untuk auto-increment, dan sequence tidak otomatis direset saat data dihapus.

## Solusi

Saya sudah menambahkan dua cara untuk reset ID:

### **Cara 1: Auto-Reset via API (Recommended)**

Gunakan endpoint yang sudah dibuat:

```bash
POST /api/reset-sequence/{tableName}
```

**Daftar table names yang valid:**
- `doctors`
- `schedules`
- `events`
- `videos`
- `gallery`
- `smartcheck_questions`

**Contoh di JavaScript:**

```javascript
import { adminApi } from './lib/adminApi';

// Reset ID doctors ke 1
try {
  const result = await adminApi.resetSequence('doctors');
  console.log(result);
  // Output: { success: true, message: 'Sequence doctors_id_seq reset to 1' }
} catch (err) {
  console.error('Reset gagal:', err.message);
}
```

### **Cara 2: Manual Reset via Supabase SQL**

Jika endpoint tidak bekerja, bisa reset manual via Supabase:

1. **Buka Supabase Dashboard**
2. **Klik menu SQL Editor**
3. **Jalankan query ini:**

```sql
-- Reset ID doctors ke 1
ALTER SEQUENCE doctors_id_seq RESTART WITH 1;

-- Reset ID events ke 1
ALTER SEQUENCE events_id_seq RESTART WITH 1;

-- Reset ID videos ke 1
ALTER SEQUENCE videos_id_seq RESTART WITH 1;

-- Reset semua sequence
ALTER SEQUENCE doctors_id_seq RESTART WITH 1;
ALTER SEQUENCE schedules_id_seq RESTART WITH 1;
ALTER SEQUENCE events_id_seq RESTART WITH 1;
ALTER SEQUENCE videos_id_seq RESTART WITH 1;
ALTER SEQUENCE gallery_id_seq RESTART WITH 1;
ALTER SEQUENCE smartcheck_questions_id_seq RESTART WITH 1;
```

## Cara Integrasi di Admin Dashboard

### **Opsi A: Add Button di Branding Panel**

Tambahkan button "Reset All IDs" di section branding:

```javascript
const handleResetAllSequences = async () => {
  try {
    const tables = ['doctors', 'schedules', 'events', 'videos', 'gallery', 'smartcheck_questions'];
    
    for (const table of tables) {
      await adminApi.resetSequence(table);
    }
    
    showToast('All ID sequences reset to 1');
  } catch (err) {
    showToast('Error: ' + err.message);
  }
};
```

### **Opsi B: Add Reset Button di Setiap Panel**

Tambahkan button "Reset ID" di DataTable header:

```javascript
<button className="admin-action-btn btn-reset" onClick={() => handleResetSequence(activePanel)}>
  🔄 Reset ID to 1
</button>
```

### **Opsi C: Auto-Reset Saat Semua Data Dihapus**

Modifikasi `handleDelete` untuk auto-reset jika table kosong:

```javascript
const handleDelete = async (row) => {
  try {
    // ... existing delete logic
    
    // Check apakah table sudah kosong
    const updatedRows = rows[activePanel].filter(r => r.id !== row.id);
    if (updatedRows.length === 0) {
      // Auto-reset sequence jika table kosong
      await adminApi.resetSequence(activePanel);
      showToast('All records deleted. ID reset to 1 for next entry.');
    }
  } catch (err) {
    console.error('Error:', err);
  }
};
```

## Helper Methods yang Tersedia

### **Reset Sequence**
```javascript
await adminApi.resetSequence('doctors')
// Mengembalikan: { success: true, message: '...' }
```

### **Get Last ID**
```javascript
const result = await adminApi.getLastId('doctors')
// Mengembalikan: { table: 'doctors', lastId: 42 }
```

## Testing

### Test 1: Manual Reset
```bash
# Terminal 1 - Jalankan server
cd server && npm start

# Terminal 2 - Test reset API
curl -X POST http://localhost:4000/api/reset-sequence/doctors

# Response:
# {"success":true,"message":"Sequence doctors_id_seq reset to 1"}
```

### Test 2: Check Last ID
```bash
curl http://localhost:4000/api/last-id/doctors

# Response:
# {"table":"doctors","lastId":42}
```

### Test 3: Full Flow
```
1. Login admin
2. Hapus semua dokter
3. Jalankan: await adminApi.resetSequence('doctors')
4. Tambah dokter baru → should be id: 1
```

## Endpoints Summary

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| POST | `/api/reset-sequence/:table` | Reset ID ke 1 |
| GET | `/api/last-id/:table` | Get ID terakhir |

## Important Notes

⚠️ **Pastikan:**
1. Backend server sudah running di port 4000
2. Environment variable `SUPABASE_SERVICE_KEY` sudah set
3. User memiliki permission untuk ALTER SEQUENCE

⚠️ **Jangan lupa:**
- Reset sequence hanya berpengaruh untuk data **baru** yang ditambahkan
- Data yang sudah ada **tidak terpengaruh**
- Jika ada foreign key constraints, pastikan parent table juga direset jika diperlukan

## File yang Dimodifikasi

- ✅ `server/index.js` - Tambah endpoints untuk reset sequence
- ✅ `src/lib/adminApi.js` - Tambah methods untuk reset sequence
- 📄 `RESET_AUTO_INCREMENT_ID.md` - File ini (dokumentasi)

## Troubleshooting

### Reset sequence tidak bekerja

**Error: "Could not auto-reset via RPC"**
- Ini normal jika RPC method tidak enable di Supabase
- Gunakan cara manual (SQL query di Supabase dashboard)

**Error: "Invalid table name"**
- Pastikan table name benar (case-sensitive)
- Valid names: doctors, schedules, events, videos, gallery, smartcheck_questions

### Sequence sudah direset tapi ID masih tidak dari 1

- Mungkin ada prepared statement yang cache sequence value
- Solution: Restart backend server dan refresh browser

## Alternative: Custom ID Management

Jika ingin lebih kontrol, bisa implement custom ID logic:

```javascript
// Saat create, find max ID + 1
const getNextId = async (tableName) => {
  const result = await adminApi.getLastId(tableName);
  return (result.lastId || 0) + 1;
};
```

Tapi ini lebih complicated dan not recommended untuk production.
