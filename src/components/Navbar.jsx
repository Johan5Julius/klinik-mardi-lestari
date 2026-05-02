import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ArrowDown } from 'lucide-react';
import './Navbar.css';

const navLinks = [
  { name: 'Home', path: '/dashboard' },
  { name: 'Profile', path: '/profile' },
  { name: 'Events', path: '/events' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Smart Check', path: '/smartcheck' },
];

const searchData = [
  { type: 'Doctor', name: 'Dr. Andi Susanto', path: '/profile', sub: 'Cardiology' },
  { type: 'Doctor', name: 'Dr. Budi Darmawan', path: '/profile', sub: 'Pediatrics' },
  { type: 'Doctor', name: 'Dr. Citra Lestari', path: '/profile', sub: 'General Practice' },
  { type: 'Doctor', name: 'Dr. Diana Putri', path: '/profile', sub: 'Dermatology' },
  { type: 'Doctor', name: 'Dr. Eko Wibowo', path: '/profile', sub: 'Neurology' },
  { type: 'Facility', name: 'Outpatient Services', path: '/facilities/outpatient', sub: 'Rawat jalan' },
  { type: 'Facility', name: 'Inpatient Services', path: '/facilities/inpatient', sub: 'Rawat inap' },
  { type: 'Facility', name: '24-Hour Ambulance', path: '/facilities/ambulance', sub: 'Ambulans' },
  { type: 'Facility', name: 'EKG Services', path: '/facilities/ekg', sub: 'Pemeriksaan EKG' },
  { type: 'Event', name: 'Free Health Check', path: '/events', sub: 'Health event' },
  { type: 'Event', name: 'Blood Donation Drive', path: '/events', sub: 'Social event' },
  { type: 'Event', name: 'Mental Health Seminar', path: '/events', sub: 'Education event' },
  { type: 'Video', name: 'Healthy Heart Tips', path: '/dashboard', sub: 'Health Education' },
  { type: 'Video', name: 'Managing Stress', path: '/dashboard', sub: 'Health Education' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const isHeroPage = location.pathname === '/dashboard' || location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [location.pathname]);

  useEffect(() => {
    if (searchQuery.trim().length >= 1) {
      const q = searchQuery.toLowerCase();
      setSearchResults(
        searchData.filter(item =>
          item.name.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          item.sub.toLowerCase().includes(q)
        ).slice(0, 6)
      );
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  const closeSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleResultClick = (path) => {
    closeSearch();
    setIsOpen(false);
    navigate(path);
  };

  const isWhiteText = isHeroPage && !scrolled;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <nav
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${isWhiteText ? 'navbar-hero' : ''}`}
      aria-label="Main navigation"
    >
      <div className="nav-inner">
        <Link to="/dashboard" className="nav-brand" aria-label="Klinik Mardi Lestari - Beranda">
          <img src="/clinic-logo.png" alt="Logo Klinik Mardi Lestari" className="nav-logo-image" />
          <span className="nav-brand-name">Mardi Lestari</span>
        </Link>

        {/* Desktop Links */}
        <ul className="nav-links" role="menubar">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.path} role="none">
                <Link
                  to={link.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      className="nav-indicator"
                      layoutId="nav-active"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Controls */}
        <div className="nav-right">
          {/* Hamburger Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={26} />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu size={26} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            <div className="mobile-overlay-head">
              <button
                className="overlay-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup menu"
              >
                <X size={34} />
              </button>
              <div className="overlay-search-wrap">
                <div className="overlay-search-input-wrap">
                  <input
                    id="overlay-search-input"
                    ref={inputRef}
                    type="text"
                    className="overlay-search-inline-input"
                    placeholder="Cari dokter, fasilitas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Cari"
                    aria-autocomplete="list"
                    aria-controls="overlay-search-dropdown"
                  />
                  <button
                    className="overlay-search-clear"
                    onClick={closeSearch}
                    aria-label="Kosongkan pencarian"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>

            {!isSearching && (
              <div className="mobile-overlay-content">
                <div className="mobile-overlay-links">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                    >
                      <Link
                        to={link.path}
                        className={`mobile-overlay-link ${idx === 0 ? 'primary' : ''}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mobile-overlay-arrows" aria-hidden="true">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={`${link.path}-arrow`}
                      className={`overlay-arrow ${idx === 0 ? 'primary' : ''}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 + 0.1 }}
                    >
                      <ArrowDown size={52} strokeWidth={2.4} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence>
              {isSearching && (
                <motion.div
                  id="overlay-search-dropdown"
                  className="overlay-search-results"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  role="listbox"
                >
                  <span className="overlay-search-kicker">PRODUCTS</span>
                  {searchResults.length > 0 ? searchResults.map((item, idx) => (
                    <button
                      key={idx}
                      className="search-result-item"
                      onClick={() => handleResultClick(item.path)}
                      role="option"
                      aria-label={`${item.type}: ${item.name}`}
                    >
                      <div className="result-text">
                        <span className="result-name">{item.name}</span>
                        <span className="result-sub">{item.sub}</span>
                      </div>
                    </button>
                  )) : (
                    <div className="search-empty">Tidak ada hasil untuk "{searchQuery}"</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
