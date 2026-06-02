import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Stethoscope } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './NotFound.css';

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-wrapper"
    >
      <Navbar />
      <main className="notfound-main">
        <motion.div
          className="notfound-content"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            className="notfound-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2, stiffness: 150 }}
          >
            <Stethoscope size={72} />
          </motion.div>
          <h1 className="notfound-code">404</h1>
          <h2 className="notfound-title">Halaman Tidak Ditemukan</h2>
          <p className="notfound-desc">
            Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.<br />
            Silakan kembali ke beranda.
          </p>
          <Link to="/dashboard" className="btn btn-primary notfound-btn">
            <Home size={18} /> Kembali ke Beranda
          </Link>
        </motion.div>
      </main>
      <Footer />
    </motion.div>
  );
}
