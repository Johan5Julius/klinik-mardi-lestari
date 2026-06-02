import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, MapPin, Tag } from 'lucide-react';
import './Events.css';

const EVENT_IMAGE_PREFIX = 'eventImage_';

const applyStoredEventImages = (items) => items.map(item => {
  const stored = item.id ? localStorage.getItem(`${EVENT_IMAGE_PREFIX}${item.id}`) : null;
  return stored && !item.image ? { ...item, image: stored } : item;
});

const CATEGORIES = ['All', 'Health', 'Education', 'Social'];

const CATEGORY_COLORS = {
  Health: { bg: '#dcfce7', text: '#166534' },
  Education: { bg: '#dbeafe', text: '#1d4ed8' },
  Social: { bg: '#fee2e2', text: '#991b1b' },
};

const CATEGORY_EMOJI = {
  Health: '🩺',
  Education: '📚',
  Social: '🤝',
};

export default function Events() {
  const [active, setActive] = useState('All');
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        console.debug('Events fetch:', { rows: data?.length, error: error?.message });
        if (!mounted) return;
        if (!error && data && data.length > 0) {
          setEventsData(applyStoredEventImages(data));
        }
      } catch (err) {
        console.warn('Unable to load events from database:', err.message || err);
      }
    }

    fetchEvents();
    return () => { mounted = false; };
  }, []);

  const filtered = active === 'All' ? eventsData : eventsData.filter(e => e.category === active);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-wrapper">
      <Navbar />

      <main className="events-main">
        {/* Header */}
        <section className="events-hero">
          <div className="container">
            <motion.p className="events-eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              Klinik Mardi Lestari
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              Events &amp; Activities
            </motion.h1>
            
          </div>
        </section>

        {/* Filter */}
        <section className="events-filter-section">
          <div className="container">
            <div className="filter-bar" role="group" aria-label="Filter events by category">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${active === cat ? 'filter-active' : ''}`}
                  onClick={() => setActive(cat)}
                  aria-pressed={active === cat}
                >
                  {cat !== 'All' && CATEGORY_EMOJI[cat]} {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="events-grid-section">
          <div className="container">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="events-grid"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {filtered.map((ev, i) => {
                  const col = CATEGORY_COLORS[ev.category] || CATEGORY_COLORS.Health;
                  const imageSrc = ev.image_url || ev.image || (ev.id ? localStorage.getItem(`${EVENT_IMAGE_PREFIX}${ev.id}`) : null);
                  const hasImage = !!imageSrc;
                  return (
                    <motion.article
                      key={ev.id}
                      className="event-card glass-panel"
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                      whileHover={{ y: -4 }}
                    >
                      <div
                        className="event-img"
                        style={hasImage ? {
                          backgroundImage: `url(${imageSrc})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        } : {
                          background: `linear-gradient(135deg, ${col.bg}, ${col.bg}99)`,
                        }}
                        aria-hidden={hasImage ? 'false' : 'true'}
                      >
                        {!hasImage && (
                          <span className="event-img-emoji">{CATEGORY_EMOJI[ev.category]}</span>
                        )}
                      </div>

                      <div className="event-body">
                        <span
                          className="event-badge"
                          style={{ background: col.bg, color: col.text }}
                        >
                          <Tag size={12} /> {ev.category}
                        </span>
                        <h2 className="event-title">{ev.title}</h2>
                        <p className="event-desc">{ev.description || 'Deskripsi belum tersedia.'}</p>
                        <div className="event-meta">
                          <span><Calendar size={14} aria-hidden="true" /> {formatDate(ev.date)}</span>
                          <span><MapPin size={14} aria-hidden="true" /> {ev.location || '-'}</span>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {filtered.length === 0 && (
              <p className="events-empty">No events found for this category.</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
}
