const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export async function fetchFacilities() {
  try {
    const res = await fetch(`${API_BASE}/facilities`);
    if (!res.ok) throw new Error('Failed to fetch facilities');
    return await res.json();
  } catch (e) {
    console.warn('Facilities API unavailable:', e.message || e);
    return null;
  }
}

export async function fetchFacilityDetail(slug) {
  try {
    const res = await fetch(`${API_BASE}/facilities/slug/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('Failed to fetch facility detail');
    return await res.json();
  } catch (e) {
    console.warn('Facility detail API unavailable:', e.message || e);
    return null;
  }
}
