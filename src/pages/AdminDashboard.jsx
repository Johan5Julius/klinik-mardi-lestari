import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Users, Calendar, CalendarDays, Video, HelpCircle,
  Image, Settings, LogOut, Menu, X, Plus, Pencil, Trash2,
  ChevronRight, Bell,
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { adminApi } from '../lib/adminApi';
import './AdminDashboard.css';

const LOGO_STORAGE_KEY = 'clinicLogoBase64';
const LOGO_NAME_KEY = 'clinicLogoName';
const EVENT_IMAGE_PREFIX = 'eventImage_';
const DEFAULT_LOGO = '/clinic-logo.png';
const MAX_LOGO_SIZE_MB = 2;

// ── Toast ──────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  return (
    <motion.div
      className="admin-toast"
      initial={{ x: 120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 120, opacity: 0 }}
    >
      ✅ {msg}
      <button onClick={onClose} aria-label="Close notification">✕</button>
    </motion.div>
  );
}

// ── Generic Table ──────────────────────────────────────────────────────────
function DataTable({ columns, rows, onAdd, onEdit, onDelete }) {
  return (
    <div className="admin-table-wrap">
      <div className="admin-table-header">
        <button className="admin-action-btn btn-add" onClick={onAdd} aria-label="Add new record">
          <Plus size={15} /> Add New
        </button>
      </div>
      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map(c => <th key={c.key}>{c.label}</th>)}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id ?? i}>
                {columns.map(c => (
                  <td key={c.key}>
                    {c.badge
                      ? <span className={`status-badge badge-${String(row[c.key]).toLowerCase().replace(' ', '-')}`}>{row[c.key]}</span>
                      : row[c.key]}
                  </td>
                ))}
                <td className="action-cell">
                  <button className="icon-btn edit-btn" onClick={() => onEdit(row)} aria-label={`Edit record`}><Pencil size={15} /></button>
                  <button className="icon-btn del-btn" onClick={() => onDelete(row)} aria-label={`Delete record`}><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <motion.div
        className="modal-panel"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal"><X size={20} /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

// ── Panel configs ──────────────────────────────────────────────────────────
const PANELS = {
  doctors: {
    label: 'Doctor Management',
    columns: [
      { key: 'id', label: '#' },
      { key: 'name', label: 'Name' },
      { key: 'specialization', label: 'Specialization' },
      { key: 'status', label: 'Status', badge: true },
    ],
    fields: [
      { key: 'name', label: 'Full Name', type: 'text' },
      { key: 'specialization', label: 'Specialization', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'On Leave', 'Inactive'] },
    ],
  },
  schedules: {
    label: 'Schedule Management',
  },
  facilities: {
    label: 'Facilities Management',
    columns: [
      { key: 'id', label: '#' },
      { key: 'name', label: 'Name' },
      { key: 'slug', label: 'Slug' },
      { key: 'motto', label: 'Motto' },
      { key: 'icon', label: 'Icon' },
    ],
    fields: [
      { key: 'name', label: 'Facility Name', type: 'text' },
      { key: 'slug', label: 'Slug (e.g., outpatient)', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'color', label: 'Theme Color (Hex, e.g., #0284c7)', type: 'text' },
      { key: 'motto', label: 'Motto', type: 'text' },
      { key: 'icon', label: 'Icon Name (e.g., Stethoscope, Heart, Activity, ShieldPlus, Home)', type: 'select', options: ['Stethoscope', 'Heart', 'Activity', 'ShieldPlus', 'Home', 'Hospital'] },
    ],
  },
  events: {
    label: 'Event Management',
    columns: [
      { key: 'id', label: '#' },
      { key: 'title', label: 'Title' },
      { key: 'date', label: 'Date' },
      { key: 'category', label: 'Category' },
      { key: 'status', label: 'Status', badge: true },
    ],
    fields: [
      { key: 'title', label: 'Event Title', type: 'text' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'category', label: 'Category', type: 'select', options: ['Health', 'Education', 'Social'] },
      { key: 'status', label: 'Status', type: 'select', options: ['Upcoming', 'Ongoing', 'Done'] },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Event Photo', type: 'file' },
    ],
  },
  videos: {
    label: 'Video Education Management',
    columns: [
      { key: 'id', label: '#' },
      { key: 'title', label: 'Title' },
      { key: 'url', label: 'URL' },
      { key: 'duration', label: 'Duration' },
    ],
    fields: [
      { key: 'title', label: 'Video Title', type: 'text' },
      { key: 'url', label: 'YouTube URL', type: 'text' },
      { key: 'duration', label: 'Duration (e.g. 5:30)', type: 'text' },
    ],
  },
  smartcheck: {
    label: 'Smart Check Questions',
    columns: [
      { key: 'id', label: '#' },
      { key: 'title', label: 'Question' },
      { key: 'category', label: 'Category' },
    ],
    rows: [
      { id: 1, title: 'How often do you exercise per week?', category: 'Obesity' },
      { id: 2, title: 'How often do you consume fast food?', category: 'Obesity' },
      { id: 3, title: 'Do you feel you are currently overweight?', category: 'Obesity' },
      { id: 4, title: 'Do you have a family history of high cholesterol?', category: 'Cholesterol' },
      { id: 5, title: 'How often do you eat fried or greasy foods?', category: 'Cholesterol' },
    ],
    fields: [
      { key: 'title', label: 'Question Text', type: 'textarea' },
      { key: 'category', label: 'Category', type: 'select', options: ['Obesity', 'Cholesterol'] },
    ],
  },
  gallery: {
    label: 'Gallery Management',
    columns: [
      { key: 'id', label: '#' },
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
    ],
    fields: [
      { key: 'title', label: 'Photo Title', type: 'text' },
      { key: 'category', label: 'Category', type: 'select', options: ['Facility', 'Activity'] },
      { key: 'image', label: 'Photo', type: 'file' },
    ],
  },
  branding: {
    label: 'Branding & Logo',
  }
};

const MENU_ITEMS = [
  { key: 'branding', label: 'Branding', icon: Settings },
  { key: 'doctors', label: 'Doctors', icon: Users },
  { key: 'schedules', label: 'Schedules', icon: Calendar },
  { key: 'facilities', label: 'Facilities', icon: Activity },
  { key: 'events', label: 'Events', icon: CalendarDays },
  { key: 'videos', label: 'Videos', icon: Video },
  { key: 'smartcheck', label: 'Smart Check', icon: HelpCircle },
  { key: 'gallery', label: 'Gallery', icon: Image },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('doctors');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null); // { type: 'add'|'edit', data: {} }
  const [formData, setFormData] = useState({});

  // Local row state per panel (will try to load from Supabase)
  const [rows, setRows] = useState({
    doctors: [],
    schedules: [],
    facilities: [],
    events: [],
    videos: [],
    smartcheck: [...PANELS.smartcheck.rows],
    gallery: [],
  });
  const [brandingPreview, setBrandingPreview] = useState(DEFAULT_LOGO);
  const [brandingName, setBrandingName] = useState('');
  const [brandingError, setBrandingError] = useState(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem(LOGO_STORAGE_KEY);
    const savedName = localStorage.getItem(LOGO_NAME_KEY);
    if (savedLogo) setBrandingPreview(savedLogo);
    if (savedName) setBrandingName(savedName);
  }, []);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === LOGO_STORAGE_KEY) {
        setBrandingPreview(event.newValue || DEFAULT_LOGO);
      }
      if (event.key === LOGO_NAME_KEY) {
        setBrandingName(event.newValue || '');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogoChange = (event) => {
    setBrandingError(null);
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setBrandingError('Silakan pilih file gambar PNG, JPEG, atau SVG.');
      return;
    }
    if (file.size > MAX_LOGO_SIZE_MB * 1024 * 1024) {
      setBrandingError(`File terlalu besar. Maksimal ${MAX_LOGO_SIZE_MB} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setBrandingPreview(result);
        setBrandingName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const saveBranding = () => {
    localStorage.setItem(LOGO_STORAGE_KEY, brandingPreview);
    localStorage.setItem(LOGO_NAME_KEY, brandingName);
    showToast('Logo berhasil disimpan.');
  };

  const resetBranding = () => {
    localStorage.removeItem(LOGO_STORAGE_KEY);
    localStorage.removeItem(LOGO_NAME_KEY);
    setBrandingPreview(DEFAULT_LOGO);
    setBrandingName('');
    showToast('Logo dikembalikan ke default.');
  };

  // Upload a file to Supabase Storage under the existing 'events' bucket.
  // When saving gallery photos, use a subfolder path inside the same bucket.
  const uploadToStorage = async (file, folder = 'events') => {
    if (!file) return null;
    try {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = reader.result;
          try {
            const res = await fetch('http://localhost:4000/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                file: base64,
                name: file.name,
                folder
              })
            });
            if (!res.ok) {
              const err = await res.json();
              console.warn('Backend upload error:', err.error);
              resolve(null);
              return;
            }
            const data = await res.json();
            resolve(data.publicUrl || null);
          } catch (e) {
            console.warn('Backend upload fetch error:', e);
            resolve(null);
          }
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    } catch (e) {
      console.warn('Unexpected upload error:', e.message || e);
      return null;
    }
  };

  // Load data from API when component mounts (fallback to Supabase if backend unavailable)
  useEffect(() => {
    let mounted = true;

    async function loadAll() {
      try {
        let doctors, schedules, facilities, events, videos, gallery, smartcheck;

        // Try backend first
        try {
          const results = await Promise.all([
            adminApi.doctors.getAll(),
            adminApi.schedules.getAll(),
            adminApi.facilities.getAll(),
            adminApi.events.getAll(),
            adminApi.videos.getAll(),
            adminApi.gallery.getAll(),
            adminApi.smartcheck.getAll(),
          ]);
          [doctors, schedules, facilities, events, videos, gallery, smartcheck] = results;
        } catch (backendErr) {
          // Backend failed, fallback to Supabase client
          console.warn('Backend unavailable, loading from Supabase client:', backendErr.message);
          const [doctorsRes, schedulesRes, facilitiesRes, eventsRes, videosRes, galleryRes, smartcheckRes] = await Promise.all([
            supabase.from('doctors').select('*'),
            supabase.from('schedules').select('*'),
            supabase.from('facilities').select('*').order('id', { ascending: true }),
            supabase.from('events').select('*').order('date', { ascending: true }),
            supabase.from('videos').select('*'),
            supabase.from('gallery').select('*').order('id', { ascending: false }),
            supabase.from('smartcheck_questions').select('*'),
          ]);

          doctors = doctorsRes.error ? [] : doctorsRes.data;
          schedules = schedulesRes.error ? [] : schedulesRes.data;
          facilities = facilitiesRes.error ? [] : facilitiesRes.data;
          events = eventsRes.error ? [] : eventsRes.data;
          videos = videosRes.error ? [] : videosRes.data;
          gallery = galleryRes.error ? [] : galleryRes.data;
          smartcheck = smartcheckRes.error ? [] : smartcheckRes.data;
        }

        if (!mounted) return;

        // Map schedules to include doctor name
        const doctorsList = doctors || [];
        const facilitiesList = facilities || [];
        let schedulesList = schedules || [];
        if (schedulesList.length) {
          schedulesList = schedulesList.map(s => ({
            ...s,
            doctor: doctorsList.find(d => d.id === s.doctor_id)?.name || s.doctor || '',
            day: s.day || '',
            time: s.time_slot || s.time || '',
            room: s.room || facilitiesList.find(f => f.id === s.facility_id)?.name || ''
          }));
        }

        setRows(prev => ({
          ...prev,
          doctors: doctors && doctors.length ? doctors : prev.doctors,
          schedules: schedulesList,
          facilities: facilitiesList.length ? facilitiesList : prev.facilities,
          events: events && events.length ? events : prev.events,
          videos: videos && videos.length ? videos : prev.videos,
          gallery: gallery && gallery.length ? gallery : prev.gallery,
          smartcheck: smartcheck && smartcheck.length ? smartcheck : prev.smartcheck,
        }));
      } catch (e) {
        console.warn('Error loading admin data:', e.message || e);
      }
    }

    loadAll();
    return () => { mounted = false; };
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const panel = PANELS[activePanel];
  const currentRows = rows[activePanel];

  const handleAdd = () => {
    if (!panel.fields) return; // panels with custom UI (schedules) handle their own add
    const blank = {};
    panel.fields.forEach(f => { blank[f.key] = ''; });
    setFormData(blank);
    setModal({ type: 'add' });
  };

  const handleEdit = (row) => {
    const initialData = { ...row };
    if (activePanel === 'events' || activePanel === 'gallery') {
      if (initialData.image_url) {
        initialData.image = initialData.image || initialData.image_url;
      }
    }
    setFormData(initialData);
    setModal({ type: 'edit' });
  };

  const saveEventImage = (row) => {
    if (!row || (!row.image && !row.image_url) || !row.id) return;
    try {
      // Prefer storing base64 preview locally if available (fallback)
      const toStore = row.image || row.image_url;
      localStorage.setItem(`${EVENT_IMAGE_PREFIX}${row.id}`, toStore);
    } catch (e) {
      console.warn('Unable to save event image locally:', e);
    }
  };

  const handleDelete = async (row) => {
    try {
      if (activePanel === 'doctors') {
        await adminApi.doctors.delete(row.id);
        setRows(prev => ({ ...prev, doctors: prev.doctors.filter(r => r.id !== row.id) }));
      } else if (activePanel === 'schedules') {
        await adminApi.schedules.delete(row.id);
        setRows(prev => ({ ...prev, schedules: prev.schedules.filter(r => r.id !== row.id) }));
      } else if (activePanel === 'facilities') {
        await adminApi.facilities.delete(row.id);
        setRows(prev => ({ ...prev, facilities: prev.facilities.filter(r => r.id !== row.id) }));
      } else if (activePanel === 'events') {
        await adminApi.events.delete(row.id);
        setRows(prev => ({ ...prev, events: prev.events.filter(r => r.id !== row.id) }));
        if (row?.id) localStorage.removeItem(`${EVENT_IMAGE_PREFIX}${row.id}`);
      } else if (activePanel === 'gallery') {
        await adminApi.gallery.delete(row.id);
        setRows(prev => ({ ...prev, gallery: prev.gallery.filter(r => r.id !== row.id) }));
      } else if (activePanel === 'videos') {
        await adminApi.videos.delete(row.id);
        setRows(prev => ({ ...prev, videos: prev.videos.filter(r => r.id !== row.id) }));
      } else if (activePanel === 'smartcheck') {
        await adminApi.smartcheck.delete(row.id);
        setRows(prev => ({ ...prev, smartcheck: prev.smartcheck.filter(r => r.id !== row.id) }));
      }
      showToast('Record deleted successfully.');
    } catch (err) {
      console.error('Error deleting record:', err);
      showToast('Error: ' + (err.message || 'Failed to delete record'));
    }
  };

  const handleSave = async () => {
    try {
      // Handle persistence for all panels through API
      if (activePanel === 'doctors') {
        const payload = { name: formData.name, specialization: formData.specialization, status: formData.status };
        if (modal.type === 'add') {
          const insertData = await adminApi.doctors.create(payload);
          setRows(prev => ({ ...prev, doctors: [...prev.doctors, insertData] }));
          showToast('Doctor added successfully.');
        } else {
          const updateData = await adminApi.doctors.update(formData.id, payload);
          setRows(prev => ({ ...prev, doctors: prev.doctors.map(d => d.id === updateData.id ? updateData : d) }));
          showToast('Doctor updated successfully.');
        }
      } else if (activePanel === 'facilities') {
        const payload = { name: formData.name, slug: formData.slug, description: formData.description, color: formData.color, motto: formData.motto, icon: formData.icon };
        if (modal.type === 'add') {
          const insertData = await adminApi.facilities.create(payload);
          setRows(prev => ({ ...prev, facilities: [...prev.facilities, insertData] }));
          showToast('Facility added successfully.');
        } else {
          const updateData = await adminApi.facilities.update(formData.id, payload);
          setRows(prev => ({ ...prev, facilities: prev.facilities.map(f => f.id === updateData.id ? updateData : f) }));
          showToast('Facility updated successfully.');
        }
      } else if (activePanel === 'events') {
        const existingEventUrl = typeof formData.image === 'string' && !formData.image.startsWith('data:') ? formData.image : formData.image_url;
      const payload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        category: formData.category,
        status: formData.status,
        location: formData.location,
        image_url: existingEventUrl || null,
      };

        // Upload image if available
        const file = formData.imageFile || (formData.image instanceof File ? formData.image : null);
        if (file) {
          const url = await uploadToStorage(file, 'events');
          if (url) payload.image_url = url;
        }

        if (modal.type === 'add') {
          const insertData = await adminApi.events.create(payload);
          setRows(prev => ({ ...prev, events: [...prev.events, insertData] }));
          saveEventImage(insertData);
          showToast('Event added successfully.');
        } else {
          const updateData = await adminApi.events.update(formData.id, payload);
          setRows(prev => ({ ...prev, events: prev.events.map(r => r.id === updateData.id ? updateData : r) }));
          saveEventImage(updateData);
          showToast('Event updated successfully.');
        }
      } else if (activePanel === 'gallery') {
        const existingUrl = typeof formData.image === 'string' && !formData.image.startsWith('data:') ? formData.image : formData.image_url;
        const payload = {
          title: formData.title,
          category: formData.category,
          image_url: existingUrl || '',
          description: formData.description || '',
        };
        const file = formData.imageFile || (formData.image instanceof File ? formData.image : null);
        if (file) {
          const url = await uploadToStorage(file, 'gallery');
          if (url) payload.image_url = url;
        }

        if (modal.type === 'add') {
          const insertData = await adminApi.gallery.create(payload);
          setRows(prev => ({ ...prev, gallery: [...prev.gallery, insertData] }));
          showToast('Gallery item added successfully.');
        } else {
          const updateData = await adminApi.gallery.update(formData.id, payload);
          setRows(prev => ({ ...prev, gallery: prev.gallery.map(g => g.id === updateData.id ? updateData : g) }));
          showToast('Gallery item updated successfully.');
        }
      } else if (activePanel === 'videos') {
        const payload = { title: formData.title, url: formData.url, duration: formData.duration, category: formData.category };
        if (modal.type === 'add') {
          const insertData = await adminApi.videos.create(payload);
          setRows(prev => ({ ...prev, videos: [...prev.videos, insertData] }));
          showToast('Video added successfully.');
        } else {
          const updateData = await adminApi.videos.update(formData.id, payload);
          setRows(prev => ({ ...prev, videos: prev.videos.map(v => v.id === updateData.id ? updateData : v) }));
          showToast('Video updated successfully.');
        }
      } else if (activePanel === 'smartcheck') {
        const payload = { question_text: formData.title || formData.question_text, category: formData.category };
        if (modal.type === 'add') {
          const insertData = await adminApi.smartcheck.create(payload);
          setRows(prev => ({ ...prev, smartcheck: [...prev.smartcheck, insertData] }));
          showToast('Question added successfully.');
        } else {
          const updateData = await adminApi.smartcheck.update(formData.id, payload);
          setRows(prev => ({ ...prev, smartcheck: prev.smartcheck.map(s => s.id === updateData.id ? updateData : s) }));
          showToast('Question updated successfully.');
        }
      }
    } catch (err) {
      console.error('Error saving record:', err);
      showToast('Error: ' + (err.message || 'Failed to save record'));
    }

    setModal(null);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    navigate('/admin/login');
  };

  return (
    <div className="admin-dash-root">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo"><Activity size={20} /></div>
          <span>Admin Panel</span>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Admin navigation">
          {MENU_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`sidebar-item ${activePanel === item.key ? 'sidebar-active' : ''}`}
                onClick={() => { setActivePanel(item.key); setSidebarOpen(false); }}
                aria-current={activePanel === item.key ? 'page' : undefined}
                aria-label={item.label}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {activePanel === item.key && <ChevronRight size={14} className="sidebar-arrow" />}
              </button>
            );
          })}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout} aria-label="Logout">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}

      {/* Main */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar menu">
              <Menu size={22} />
            </button>
            <h1 className="topbar-title">{panel.label}</h1>
          </div>
          <div className="topbar-right">
            <button className="topbar-icon-btn" aria-label="Notifications"><Bell size={20} /></button>
            <div className="topbar-avatar" aria-label="Admin user">A</div>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">
          <motion.div
            key={activePanel}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activePanel === 'branding' ? (
              <div className="branding-panel">
                <div className="branding-preview-card">
                  <div className="branding-preview-frame">
                    <img src={brandingPreview} alt="Preview logo" className="branding-preview-image" />
                  </div>
                  <div className="branding-labels">
                    <strong>Preview Logo</strong>
                    <p>{brandingName || 'Logo default saat ini'}</p>
                  </div>
                </div>

                <div className="branding-form-card">
                  <div className="branding-form-row">
                    <label htmlFor="brand-logo-upload">Upload logo baru</label>
                    <input
                      id="brand-logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="branding-file-input"
                      aria-describedby="branding-help-text"
                    />
                    <p id="branding-help-text" className="branding-help">
                      Pilih file gambar logo. Ukuran maksimal {MAX_LOGO_SIZE_MB} MB. Gambar akan otomatis menyesuaikan ukuran logo yang ada.
                    </p>
                    {brandingError && <p className="branding-error">{brandingError}</p>}
                  </div>

                  <div className="branding-actions">
                    <button className="admin-action-btn btn-add" onClick={saveBranding} type="button">Simpan Logo</button>
                    <button className="admin-action-btn btn-reset" onClick={resetBranding} type="button">Reset ke Default</button>
                  </div>
                </div>
              </div>
            ) : activePanel === 'smartcheck' ? (
              <SmartCheckAccordionPanel
                rows={rows.smartcheck}
                setRows={setRows}
                showToast={showToast}
              />
            ) : activePanel === 'schedules' ? (
              <SchedulesAccordionPanel
                doctors={rows.doctors}
                schedules={rows.schedules}
                facilities={rows.facilities}
                setRows={setRows}
                showToast={showToast}
              />
            ) : (
              <DataTable
                columns={panel.columns}
                rows={currentRows}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <Modal
            title={modal.type === 'add' ? `Add ${panel.label}` : `Edit ${panel.label}`}
            onClose={() => setModal(null)}
          >
            <div className="modal-form">
              {(panel.fields || []).map(field => (
                <div key={field.key} className="modal-field">
                  <label htmlFor={`modal-${field.key}`}>{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      id={`modal-${field.key}`}
                      value={formData[field.key] || ''}
                      onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                    >
                      <option value="">Select…</option>
                      {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      id={`modal-${field.key}`}
                      value={formData[field.key] || ''}
                      onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                      rows={3}
                    />
                  ) : field.type === 'file' ? (
                    <>
                      <input
                        id={`modal-${field.key}`}
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!file.type.startsWith('image/')) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            const result = reader.result;
                            if (typeof result === 'string') {
                              // store preview and raw File for upload
                              setFormData(p => ({ ...p, [field.key]: result, [`${field.key}File`]: file }));
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      {formData[field.key] && (
                        <div className="modal-file-preview">
                          <img src={formData[field.key]} alt="preview" style={{ maxWidth: 140, display: 'block' }} />
                        </div>
                      )}
                    </>
                  ) : (
                    <input
                      id={`modal-${field.key}`}
                      type={field.type}
                      value={formData[field.key] || ''}
                      onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
              <div className="modal-actions">
                <button className="modal-cancel" onClick={() => setModal(null)}>Cancel</button>
                <button className="modal-save" onClick={handleSave}>Save</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ── Schedules Accordion Panel ──────────────────────────────────────────────
function SchedulesAccordionPanel({ doctors, schedules, facilities, setRows, showToast }) {
  const [expandedDoctors, setExpandedDoctors] = useState(new Set());
  const [localModal, setLocalModal] = useState(null);
  const [schedForm, setSchedForm] = useState({ day: '', time_slot: '', facility_id: '', room: '' });
  const [targetDoctor, setTargetDoctor] = useState(null);
  const [targetSchedule, setTargetSchedule] = useState(null);

  const toggleDoctor = (docId) => {
    setExpandedDoctors(prev => {
      const next = new Set(prev);
      if (next.has(docId)) next.delete(docId); else next.add(docId);
      return next;
    });
  };

  const getDoctorSchedules = (docId) =>
    schedules.filter(s => s.doctor_id === docId || (s.doctor_id == null && s.doctor === doctors.find(d => d.id === docId)?.name));

  const openAddSchedule = (doc) => {
    setTargetDoctor(doc);
    setTargetSchedule(null);
    setSchedForm({ day: '', time_slot: '', facility_id: '', room: '' });
    setLocalModal('add');
  };

  const openEditSchedule = (doc, sched) => {
    setTargetDoctor(doc);
    setTargetSchedule(sched);
    setSchedForm({
      day: sched.day || '',
      time_slot: sched.time_slot || sched.time || '',
      facility_id: sched.facility_id || '',
      room: sched.room || '',
    });
    setLocalModal('edit');
  };

  const handleSaveSchedule = async () => {
    if (!schedForm.day.trim() || !schedForm.time_slot.trim()) {
      showToast('Please fill in Day and Time Slot.');
      return;
    }
    try {
      const selectedFacility = facilities.find(f => String(f.id) === String(schedForm.facility_id));
      const payload = {
        doctor_id: targetDoctor.id,
        day: schedForm.day,
        time_slot: schedForm.time_slot,
        facility_id: schedForm.facility_id || null,
        room: selectedFacility ? selectedFacility.name : schedForm.room || '',
      };

      if (localModal === 'add') {
        const inserted = await adminApi.schedules.create(payload);
        const mapped = {
          ...inserted,
          doctor: targetDoctor.name,
          time: inserted.time_slot,
          room: selectedFacility ? selectedFacility.name : inserted.room || '',
        };
        setRows(prev => ({ ...prev, schedules: [...prev.schedules, mapped] }));
        showToast('Schedule added successfully.');
      } else {
        const updated = await adminApi.schedules.update(targetSchedule.id, payload);
        const mapped = {
          ...updated,
          doctor: targetDoctor.name,
          time: updated.time_slot,
          room: selectedFacility ? selectedFacility.name : updated.room || '',
        };
        setRows(prev => ({
          ...prev,
          schedules: prev.schedules.map(s => s.id === mapped.id ? mapped : s)
        }));
        showToast('Schedule updated successfully.');
      }
      setLocalModal(null);
    } catch (err) {
      showToast('Error: ' + (err.message || 'Failed to save schedule'));
    }
  };

  const handleDeleteSchedule = async (schedId) => {
    if (!window.confirm('Delete this schedule?')) return;
    try {
      await adminApi.schedules.delete(schedId);
      setRows(prev => ({ ...prev, schedules: prev.schedules.filter(s => s.id !== schedId) }));
      showToast('Schedule deleted.');
    } catch (err) {
      showToast('Error: ' + (err.message || 'Failed to delete schedule'));
    }
  };

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="smartcheck-accordion-panel">
      {doctors.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', background: '#fff', borderRadius: '1rem' }}>
          <p>No doctors found. Please add doctors first in the <strong>Doctors</strong> panel.</p>
        </div>
      )}

      <div className="accordion-list">
        {doctors.map(doc => {
          const docSchedules = getDoctorSchedules(doc.id);
          const isExpanded = expandedDoctors.has(doc.id);

          return (
            <div key={doc.id} className="accordion-item glass-panel">
              <div className="accordion-header" onClick={() => toggleDoctor(doc.id)}>
                <div className="accordion-header-left">
                  <ChevronRight size={18} className={`accordion-arrow ${isExpanded ? 'rotated' : ''}`} />
                  <div className="sched-doc-avatar" style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: `hsl(${(doc.id * 55) % 360}, 60%, 88%)`,
                    color: `hsl(${(doc.id * 55) % 360}, 60%, 35%)`,
                    display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0,
                  }}>
                    {doc.name?.split(' ').pop()?.[0] || '?'}
                  </div>
                  <div>
                    <span className="category-title">{doc.name}</span>
                    <span style={{ marginLeft: '0.6rem', fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>
                      {doc.specialization}
                    </span>
                  </div>
                  <span className="question-count">({docSchedules.length} schedule{docSchedules.length !== 1 ? 's' : ''})</span>
                </div>
                <div className="category-actions" onClick={e => e.stopPropagation()}>
                  <span className={`status-badge badge-${(doc.status || 'active').toLowerCase().replace(' ', '-')}`}>
                    {doc.status || 'Active'}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="accordion-content">
                  {docSchedules.length === 0 ? (
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem', fontStyle: 'italic' }}>
                      No schedules for this doctor yet.
                    </p>
                  ) : (
                    <div className="admin-table-scroll">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Day</th>
                            <th>Time Slot</th>
                            <th>Room / Facility</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {docSchedules.map((s, idx) => (
                            <tr key={s.id || idx}>
                              <td>{s.day}</td>
                              <td>{s.time_slot || s.time}</td>
                              <td>
                                <span style={{
                                  background: '#eff6ff', color: '#2563eb',
                                  padding: '0.2rem 0.6rem', borderRadius: '9999px',
                                  fontSize: '0.8rem', fontWeight: 700
                                }}>
                                  {s.room || '—'}
                                </span>
                              </td>
                              <td className="action-cell" style={{ justifyContent: 'center' }}>
                                <button className="icon-btn edit-btn" onClick={() => openEditSchedule(doc, s)} aria-label="Edit schedule"><Pencil size={14} /></button>
                                <button className="icon-btn del-btn" onClick={() => handleDeleteSchedule(s.id)} aria-label="Delete schedule"><Trash2 size={14} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <button className="btn-add-q" onClick={() => openAddSchedule(doc)}>
                    <Plus size={14} /> Add Schedule for {doc.name}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Schedule Modal */}
      <AnimatePresence>
        {localModal && (
          <Modal
            title={localModal === 'add' ? `Add Schedule — ${targetDoctor?.name}` : `Edit Schedule — ${targetDoctor?.name}`}
            onClose={() => setLocalModal(null)}
          >
            <div className="modal-form">
              <div className="modal-field">
                <label htmlFor="sched-day">Day</label>
                <select
                  id="sched-day"
                  value={schedForm.day}
                  onChange={e => setSchedForm(p => ({ ...p, day: e.target.value }))}
                >
                  <option value="">Select day…</option>
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="modal-field">
                <label htmlFor="sched-time">Time Slot (e.g. 08:00 – 12:00)</label>
                <input
                  id="sched-time"
                  type="text"
                  placeholder="e.g. 08:00 – 12:00"
                  value={schedForm.time_slot}
                  onChange={e => setSchedForm(p => ({ ...p, time_slot: e.target.value }))}
                />
              </div>
              <div className="modal-field">
                <label htmlFor="sched-facility">Room / Facility</label>
                <select
                  id="sched-facility"
                  value={schedForm.facility_id}
                  onChange={e => {
                    const fac = facilities.find(f => String(f.id) === e.target.value);
                    setSchedForm(p => ({
                      ...p,
                      facility_id: e.target.value,
                      room: fac ? fac.name : p.room,
                    }));
                  }}
                >
                  <option value="">Select facility / room…</option>
                  {facilities.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button className="modal-cancel" onClick={() => setLocalModal(null)}>Cancel</button>
                <button className="modal-save" onClick={handleSaveSchedule}>Save</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── SmartCheck Accordion Panel ─────────────────────────────────────────────
function SmartCheckAccordionPanel({ rows, setRows, showToast }) {
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [emptyCategories, setEmptyCategories] = useState([]);
  
  // localModal: { type: 'add_cat'|'edit_cat'|'add_q'|'edit_q' }
  const [localModal, setLocalModal] = useState(null);
  const [categoryInput, setCategoryInput] = useState('');
  const [questionInput, setQuestionInput] = useState('');
  
  const [targetCategory, setTargetCategory] = useState('');
  const [targetQuestion, setTargetQuestion] = useState(null);

  // Group database questions by category
  const categoriesMap = {};
  rows.forEach(q => {
    const cat = q.category || 'General';
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = [];
    }
    categoriesMap[cat].push(q);
  });

  // Combine with empty categories to list all
  const allCategories = Array.from(new Set([
    ...Object.keys(categoriesMap),
    ...emptyCategories
  ])).sort((a, b) => a.localeCompare(b));

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const handleOpenAddCategory = () => {
    setCategoryInput('');
    setLocalModal({ type: 'add_cat' });
  };

  const handleAddCategorySubmit = () => {
    const name = categoryInput.trim();
    if (!name) return;
    if (allCategories.some(c => c.toLowerCase() === name.toLowerCase())) {
      showToast('Category already exists.');
      return;
    }
    setEmptyCategories(prev => [...prev, name]);
    setExpandedCategories(prev => new Set(prev).add(name));
    setCategoryInput('');
    setLocalModal(null);
    showToast(`Category "${name}" created.`);
  };

  const handleOpenEditCategory = (cat) => {
    setTargetCategory(cat);
    setCategoryInput(cat);
    setLocalModal({ type: 'edit_cat' });
  };

  const handleRenameCategorySubmit = async () => {
    const oldName = targetCategory;
    const newName = categoryInput.trim();
    if (!newName || oldName === newName) {
      setLocalModal(null);
      return;
    }
    if (allCategories.some(c => c.toLowerCase() === newName.toLowerCase() && c !== oldName)) {
      showToast('Category name already exists.');
      return;
    }

    try {
      // Renames the category for all rows in DB matching oldName
      await adminApi.smartcheck.updateCategory(oldName, newName);
      
      // Update local parent rows state
      setRows(prev => ({
        ...prev,
        smartcheck: prev.smartcheck.map(q => q.category === oldName ? { ...q, category: newName } : q)
      }));

      // Update empty categories list if it was empty
      setEmptyCategories(prev => prev.map(c => c === oldName ? newName : c));

      // Update expanded set
      setExpandedCategories(prev => {
        const next = new Set(prev);
        if (next.has(oldName)) {
          next.delete(oldName);
          next.add(newName);
        }
        return next;
      });

      setLocalModal(null);
      showToast(`Category renamed to "${newName}".`);
    } catch (err) {
      console.error(err);
      showToast('Error renaming category: ' + (err.message || err));
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat}" and all its questions?`)) return;
    try {
      await adminApi.smartcheck.deleteCategory(cat);
      
      // Update parent rows
      setRows(prev => ({
        ...prev,
        smartcheck: prev.smartcheck.filter(q => q.category !== cat)
      }));

      // Update local empty categories list
      setEmptyCategories(prev => prev.filter(c => c !== cat));

      // Update expanded set
      setExpandedCategories(prev => {
        const next = new Set(prev);
        next.delete(cat);
        return next;
      });

      showToast(`Category "${cat}" and its questions deleted.`);
    } catch (err) {
      console.error(err);
      showToast('Error deleting category: ' + (err.message || err));
    }
  };

  const handleOpenAddQuestion = (cat) => {
    setTargetCategory(cat);
    setQuestionInput('');
    setLocalModal({ type: 'add_q' });
  };

  const handleAddQuestionSubmit = async () => {
    const text = questionInput.trim();
    if (!text) return;
    try {
      const newQ = await adminApi.smartcheck.create({
        question_text: text,
        category: targetCategory
      });

      // Update parent state
      setRows(prev => ({
        ...prev,
        smartcheck: [...prev.smartcheck, newQ]
      }));

      // Remove from empty categories if it has a question now
      setEmptyCategories(prev => prev.filter(c => c !== targetCategory));

      setLocalModal(null);
      showToast('Question added successfully.');
    } catch (err) {
      console.error(err);
      showToast('Error adding question: ' + (err.message || err));
    }
  };

  const handleOpenEditQuestion = (q) => {
    setTargetQuestion(q);
    setQuestionInput(q.question_text || q.title || '');
    setLocalModal({ type: 'edit_q' });
  };

  const handleEditQuestionSubmit = async () => {
    const text = questionInput.trim();
    if (!text || !targetQuestion) return;
    try {
      const updatedQ = await adminApi.smartcheck.update(targetQuestion.id, {
        question_text: text,
        category: targetQuestion.category
      });

      // Update parent state
      setRows(prev => ({
        ...prev,
        smartcheck: prev.smartcheck.map(q => q.id === updatedQ.id ? updatedQ : q)
      }));

      setLocalModal(null);
      showToast('Question updated successfully.');
    } catch (err) {
      console.error(err);
      showToast('Error updating question: ' + (err.message || err));
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await adminApi.smartcheck.delete(id);
      
      // Update parent state
      setRows(prev => ({
        ...prev,
        smartcheck: prev.smartcheck.filter(q => q.id !== id)
      }));

      showToast('Question deleted successfully.');
    } catch (err) {
      console.error(err);
      showToast('Error deleting question: ' + (err.message || err));
    }
  };

  return (
    <div className="smartcheck-accordion-panel">
      <div className="admin-table-header" style={{ marginBottom: '1.5rem', padding: 0, borderBottom: 0 }}>
        <button className="admin-action-btn btn-add" onClick={handleOpenAddCategory}>
          <Plus size={15} /> Add Category
        </button>
      </div>

      <div className="accordion-list">
        {allCategories.map(cat => {
          const questions = categoriesMap[cat] || [];
          const isExpanded = expandedCategories.has(cat);

          return (
            <div key={cat} className="accordion-item glass-panel">
              <div className="accordion-header" onClick={() => toggleCategory(cat)}>
                <div className="accordion-header-left">
                  <ChevronRight size={18} className={`accordion-arrow ${isExpanded ? 'rotated' : ''}`} />
                  <span className="category-title">{cat}</span>
                  <span className="question-count">({questions.length} questions)</span>
                </div>
                <div className="category-actions" onClick={e => e.stopPropagation()}>
                  <button className="icon-btn edit-btn" onClick={() => handleOpenEditCategory(cat)} title="Rename Category"><Pencil size={14} /></button>
                  <button className="icon-btn del-btn" onClick={() => handleDeleteCategory(cat)} title="Delete Category"><Trash2 size={14} /></button>
                </div>
              </div>

              {isExpanded && (
                <div className="accordion-content">
                  {questions.length === 0 ? (
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem', fontStyle: 'italic' }}>
                      No questions in this category yet.
                    </p>
                  ) : (
                    <div className="admin-table-scroll">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th style={{ width: '80px' }}>ID</th>
                            <th>Question Text</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {questions.map((q, idx) => (
                            <tr key={q.id || idx}>
                              <td>{q.id}</td>
                              <td>{q.question_text || q.title}</td>
                              <td className="action-cell" style={{ justifyContent: 'center' }}>
                                <button className="icon-btn edit-btn" onClick={() => handleOpenEditQuestion(q)} aria-label="Edit question"><Pencil size={14} /></button>
                                <button className="icon-btn del-btn" onClick={() => handleDeleteQuestion(q.id)} aria-label="Delete question"><Trash2 size={14} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <button className="btn-add-q" onClick={() => handleOpenAddQuestion(cat)}>
                    <Plus size={14} /> Add Question to {cat}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modals for SmartCheck Accordion */}
      <AnimatePresence>
        {localModal && (
          <Modal
            title={
              localModal.type === 'add_cat' ? 'Add Category' :
              localModal.type === 'edit_cat' ? 'Rename Category' :
              localModal.type === 'add_q' ? `Add Question to "${targetCategory}"` :
              'Edit Question'
            }
            onClose={() => setLocalModal(null)}
          >
            <div className="modal-form">
              {(localModal.type === 'add_cat' || localModal.type === 'edit_cat') ? (
                <div className="modal-field">
                  <label htmlFor="cat-name-input">Category Name</label>
                  <input
                    id="cat-name-input"
                    type="text"
                    value={categoryInput}
                    onChange={e => setCategoryInput(e.target.value)}
                    placeholder="e.g. Hypertension Risk..."
                    autoFocus
                  />
                </div>
              ) : (
                <div className="modal-field">
                  <label htmlFor="quest-text-input">Question Text</label>
                  <textarea
                    id="quest-text-input"
                    value={questionInput}
                    onChange={e => setQuestionInput(e.target.value)}
                    placeholder="e.g. How often do you check your blood pressure?"
                    rows={4}
                    autoFocus
                  />
                </div>
              )}
              <div className="modal-actions">
                <button className="modal-cancel" onClick={() => setLocalModal(null)}>Cancel</button>
                <button
                  className="modal-save"
                  onClick={
                    localModal.type === 'add_cat' ? handleAddCategorySubmit :
                    localModal.type === 'edit_cat' ? handleRenameCategorySubmit :
                    localModal.type === 'add_q' ? handleAddQuestionSubmit :
                    handleEditQuestionSubmit
                  }
                >
                  Save
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
