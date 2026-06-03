import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { X, ZoomIn } from 'lucide-react';
import './Gallery.css';
import { supabase } from '../lib/supabaseClient';

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function fetchGallery() {
      try {
        const { data, error } = await supabase.from('gallery').select('*').order('id', { ascending: false });
        console.debug('Gallery fetch:', { rows: data?.length, error: error?.message });
        if (!mounted) return;
        if (!error && data) {
          setItems(data);
        }
      } catch (e) {
        console.warn('Unable to load gallery from DB', e.message || e);
      }
    }
    fetchGallery();
    return () => { mounted = false; };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-wrapper">
      <Navbar />

      <main className="gallery-main">
        {/* Hero */}
        <section className="gallery-hero">
          <div className="container">
            <motion.p className="gallery-eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              Klinik Mardi Lestari
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              Photo Gallery
            </motion.h1>
            <motion.p className="gallery-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              A glimpse into our facilities and community activities.
            </motion.p>
          </div>
        </section>

        {/* Grid */}
        {/* untuk mengganti isi dari gallery */}
        <section className="gallery-grid-section">
          <div className="container">
            <div className="gallery-grid">
              {items.map((item, i) => {
                const imageSrc = item.image_url || item.image;
                const itemStyle = imageSrc
                  ? {
                      backgroundImage: `url(${imageSrc})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : { background: item.color || '#e2e8f0' };

                return (
                  <motion.div
                    key={item.id}
                    className="gallery-item"
                    style={itemStyle}
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setLightbox(item)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Lihat foto: ${item.title}`}
                    onKeyDown={(e) => e.key === 'Enter' && setLightbox(item)}
                  >
                  {!imageSrc && (
                    <div className="gallery-placeholder">
                      <span className="gallery-emoji">🏥</span>
                    </div>
                  )}
                  <div className="gallery-overlay">
                    <ZoomIn size={24} />
                    <span>{item.title}</span>
                  </div>
                  <div className="gallery-category-badge">{item.category}</div>
                </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            aria-modal="true"
            role="dialog"
            aria-label={`Foto: ${lightbox.title}`}
          >
            <motion.div
              className="lightbox-panel"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="lightbox-img"
                style={lightbox.image_url || lightbox.image ? {
                  backgroundImage: `url(${lightbox.image_url || lightbox.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                } : { background: lightbox.color || '#e2e8f0' }}
                aria-label={lightbox.image_url || lightbox.image ? `Image for ${lightbox.title}` : `Placeholder image for ${lightbox.title}`}
              >
                {!(lightbox.image_url || lightbox.image) && <span className="lightbox-emoji">🏥</span>}
              </div>
              <div className="lightbox-info">
                <h2>{lightbox.title}</h2>
                <span className="lightbox-cat">{lightbox.category}</span>
              </div>
              <button
                className="lightbox-close"
                onClick={() => setLightbox(null)}
                aria-label="Tutup lightbox"
              >
                <X size={22} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </motion.div>
  );
}
