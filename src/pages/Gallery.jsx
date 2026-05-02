import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryItems } from '../data/dummyData';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { X, ZoomIn } from 'lucide-react';
import './Gallery.css';

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null);

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
        <section className="gallery-grid-section">
          <div className="container">
            <div className="gallery-grid">
              {galleryItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="gallery-item"
                  style={{ background: item.color }}
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
                  <div className="gallery-placeholder">
                    <span className="gallery-emoji">🏥</span>
                  </div>
                  <div className="gallery-overlay">
                    <ZoomIn size={24} />
                    <span>{item.title}</span>
                  </div>
                  <div className="gallery-category-badge">{item.category}</div>
                </motion.div>
              ))}
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
                style={{ background: lightbox.color }}
                aria-label={`Placeholder image for ${lightbox.title}`}
              >
                <span className="lightbox-emoji">🏥</span>
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
