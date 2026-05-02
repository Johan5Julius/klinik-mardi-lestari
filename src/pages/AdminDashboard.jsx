import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Users, Calendar, CalendarDays, Video, HelpCircle,
  Image, Settings, LogOut, Menu, X, Plus, Pencil, Trash2,
  ChevronRight, Bell,
} from 'lucide-react';
import { adminDummyData } from '../data/dummyData';
import './AdminDashboard.css';

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
      { key: 'phone', label: 'Phone' },
      { key: 'status', label: 'Status', badge: true },
    ],
    fields: [
      { key: 'name', label: 'Full Name', type: 'text' },
      { key: 'specialization', label: 'Specialization', type: 'text' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'On Leave', 'Inactive'] },
    ],
  },
  schedules: {
    label: 'Schedule Management',
    columns: [
      { key: 'id', label: '#' },
      { key: 'doctor', label: 'Doctor' },
      { key: 'day', label: 'Day' },
      { key: 'time', label: 'Time' },
      { key: 'room', label: 'Room' },
    ],
    fields: [
      { key: 'doctor', label: 'Doctor Name', type: 'text' },
      { key: 'day', label: 'Day(s)', type: 'text' },
      { key: 'time', label: 'Time Range', type: 'text' },
      { key: 'room', label: 'Room', type: 'text' },
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
    ],
  },
  profile: {
    label: 'Clinic Profile Management',
    columns: [
      { key: 'id', label: '#' },
      { key: 'field', label: 'Field' },
      { key: 'value', label: 'Value' },
    ],
    rows: [
      { id: 1, field: 'Clinic Name', value: 'Klinik Mardi Lestari' },
      { id: 2, field: 'Motto', value: 'Kasih Untuk Sembuh' },
      { id: 3, field: 'Address', value: 'Jl. Kesehatan No. 123, Jakarta Timur' },
      { id: 4, field: 'Phone', value: '+62 21 1234 5678' },
      { id: 5, field: 'Email', value: 'info@mardilestari.com' },
    ],
    fields: [
      { key: 'field', label: 'Field Name', type: 'text' },
      { key: 'value', label: 'Value', type: 'text' },
    ],
  },
};

const MENU_ITEMS = [
  { key: 'doctors', label: 'Doctors', icon: Users },
  { key: 'schedules', label: 'Schedules', icon: Calendar },
  { key: 'events', label: 'Events', icon: CalendarDays },
  { key: 'videos', label: 'Videos', icon: Video },
  { key: 'smartcheck', label: 'Smart Check', icon: HelpCircle },
  { key: 'gallery', label: 'Gallery', icon: Image },
  { key: 'profile', label: 'Clinic Profile', icon: Settings },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('doctors');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null); // { type: 'add'|'edit', data: {} }
  const [formData, setFormData] = useState({});

  // Local row state per panel
  const [rows, setRows] = useState({
    doctors: [...adminDummyData.doctors],
    schedules: [...adminDummyData.schedules],
    events: [...adminDummyData.events],
    videos: [...adminDummyData.videos],
    smartcheck: [...PANELS.smartcheck.rows],
    gallery: [...adminDummyData.gallery],
    profile: [...PANELS.profile.rows],
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const panel = PANELS[activePanel];
  const currentRows = rows[activePanel];

  const handleAdd = () => {
    const blank = {};
    panel.fields.forEach(f => { blank[f.key] = ''; });
    setFormData(blank);
    setModal({ type: 'add' });
  };

  const handleEdit = (row) => {
    setFormData({ ...row });
    setModal({ type: 'edit' });
  };

  const handleDelete = (row) => {
    setRows(prev => ({ ...prev, [activePanel]: prev[activePanel].filter(r => r !== row) }));
    showToast('Record deleted successfully.');
  };

  const handleSave = () => {
    if (modal.type === 'add') {
      const newRow = { ...formData, id: (currentRows.length || 0) + 1 };
      setRows(prev => ({ ...prev, [activePanel]: [...prev[activePanel], newRow] }));
      showToast('Record added successfully.');
    } else {
      setRows(prev => ({
        ...prev,
        [activePanel]: prev[activePanel].map(r => r.id === formData.id ? { ...formData } : r),
      }));
      showToast('Record updated successfully.');
    }
    setModal(null);
  };

  const handleLogout = () => navigate('/admin/login');

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
            <DataTable
              columns={panel.columns}
              rows={currentRows}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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
              {panel.fields.map(field => (
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
