// API helper untuk admin operations
// Menggunakan backend server dengan service key (lebih aman dan punya akses penuh)

const API_BASE = 'http://localhost:4000/api';

// Try to parse JSON error body, fallback to text when server returns HTML or plain text
async function parseApiError(res) {
  try {
    const err = await res.json();
    return err && (err.error || err.message || JSON.stringify(err));
  } catch (e) {
    try {
      const text = await res.text();
      return text;
    } catch (e2) {
      return res.statusText || 'Unknown error';
    }
  }
}
export const adminApi = {
  // ============ DOCTORS ============
  doctors: {
    async getAll() {
      const res = await fetch(`${API_BASE}/doctors`);
      if (!res.ok) throw new Error('Failed to fetch doctors');
      return res.json();
    },
    async create(data) {
      const res = await fetch(`${API_BASE}/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to create doctor');
      }
      return res.json();
    },
    async update(id, data) {
      const res = await fetch(`${API_BASE}/doctors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to update doctor');
      }
      return res.json();
    },
    async delete(id) {
      const res = await fetch(`${API_BASE}/doctors/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to delete doctor');
      }
      return res.json();
    },
  },

  // ============ SCHEDULES ============
  schedules: {
    async getAll() {
      const res = await fetch(`${API_BASE}/schedules`);
      if (!res.ok) throw new Error('Failed to fetch schedules');
      return res.json();
    },
    async create(data) {
      const res = await fetch(`${API_BASE}/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to create schedule');
      }
      return res.json();
    },
    async update(id, data) {
      const res = await fetch(`${API_BASE}/schedules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to update schedule');
      }
      return res.json();
    },
    async delete(id) {
      const res = await fetch(`${API_BASE}/schedules/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to delete schedule');
      }
      return res.json();
    },
  },

  // ============ EVENTS ============
  events: {
    async getAll() {
      const res = await fetch(`${API_BASE}/events`);
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    },
    async create(data) {
      const res = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to create event');
      }
      return res.json();
    },
    async update(id, data) {
      const res = await fetch(`${API_BASE}/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to update event');
      }
      return res.json();
    },
    async delete(id) {
      const res = await fetch(`${API_BASE}/events/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to delete event');
      }
      return res.json();
    },
  },

  // ============ VIDEOS ============
  videos: {
    async getAll() {
      const res = await fetch(`${API_BASE}/videos`);
      if (!res.ok) throw new Error('Failed to fetch videos');
      return res.json();
    },
    async create(data) {
      const res = await fetch(`${API_BASE}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to create video');
      }
      return res.json();
    },
    async update(id, data) {
      const res = await fetch(`${API_BASE}/videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to update video');
      }
      return res.json();
    },
    async delete(id) {
      const res = await fetch(`${API_BASE}/videos/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to delete video');
      }
      return res.json();
    },
  },

  // ============ GALLERY ============
  gallery: {
    async getAll() {
      const res = await fetch(`${API_BASE}/gallery`);
      if (!res.ok) throw new Error('Failed to fetch gallery');
      return res.json();
    },
    async create(data) {
      const res = await fetch(`${API_BASE}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to create gallery item');
      }
      return res.json();
    },
    async update(id, data) {
      const res = await fetch(`${API_BASE}/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to update gallery item');
      }
      return res.json();
    },
    async delete(id) {
      const res = await fetch(`${API_BASE}/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to delete gallery item');
      }
      return res.json();
    },
  },

  // ============ SMART CHECK CATEGORIES ============
  smartcheckCategories: {
    async getAll() {
      const res = await fetch(`${API_BASE}/smartcheck/categories`);
      if (!res.ok) throw new Error('Failed to fetch smartcheck categories');
      return res.json();
    },
    async update(id, data) {
      const res = await fetch(`${API_BASE}/smartcheck/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to update smartcheck category');
      }
      return res.json();
    },
  },

  // ============ SMART CHECK ============
  smartcheck: {
    async getAll() {
      const res = await fetch(`${API_BASE}/smartcheck`);
      if (!res.ok) throw new Error('Failed to fetch smartcheck questions');
      return res.json();
    },
    async create(data) {
      const res = await fetch(`${API_BASE}/smartcheck`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to create smartcheck question');
      }
      return res.json();
    },
    async update(id, data) {
      const res = await fetch(`${API_BASE}/smartcheck/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to update smartcheck question');
      }
      return res.json();
    },
    async delete(id) {
      const res = await fetch(`${API_BASE}/smartcheck/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to delete smartcheck question');
      }
      return res.json();
    },
    async updateCategory(oldName, newName) {
      const res = await fetch(`${API_BASE}/smartcheck/category/${encodeURIComponent(oldName)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName }),
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to update category');
      }
      return res.json();
    },
    async deleteCategory(name) {
      const res = await fetch(`${API_BASE}/smartcheck/category/${encodeURIComponent(name)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to delete category');
      }
      return res.json();
    },
  },

  // ============ FACILITIES ============
  facilities: {
    async getAll() {
      const res = await fetch(`${API_BASE}/facilities`);
      if (!res.ok) throw new Error('Failed to fetch facilities');
      return res.json();
    },
    async create(data) {
      const res = await fetch(`${API_BASE}/facilities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to create facility');
      }
      return res.json();
    },
    async update(id, data) {
      const res = await fetch(`${API_BASE}/facilities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to update facility');
      }
      return res.json();
    },
    async delete(id) {
      const res = await fetch(`${API_BASE}/facilities/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errMsg = await parseApiError(res);
        throw new Error(errMsg || 'Failed to delete facility');
      }
      return res.json();
    },
  },

  // ============ UTILITIES ============
  async resetSequence(tableName) {
    const res = await fetch(`${API_BASE}/reset-sequence/${tableName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const errMsg = await parseApiError(res);
      throw new Error(errMsg || `Failed to reset sequence for ${tableName}`);
    }
    return res.json();
  },

  async getLastId(tableName) {
    const res = await fetch(`${API_BASE}/last-id/${tableName}`);
    if (!res.ok) {
      throw new Error('Failed to get last ID');
    }
    return res.json();
  },
};
