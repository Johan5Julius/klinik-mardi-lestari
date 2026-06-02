import { motion } from 'framer-motion';
import './WhatsAppButton.css';

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/628001234567?text=Halo%20Klinik%20Mardi%20Lestari"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      aria-label="Hubungi kami via WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.93 }}
    >
      <svg viewBox="0 0 32 32" fill="currentColor" width="28" height="28" aria-hidden="true">
        <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.703-1.813A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22.5c-1.98 0-3.85-.535-5.465-1.47l-.39-.23-4.58 1.078 1.1-4.47-.254-.4A10.45 10.45 0 015.5 15C5.5 9.201 10.201 4.5 16 4.5S26.5 9.201 26.5 15 21.799 25.5 16 25.5zm5.82-7.63c-.32-.16-1.893-.934-2.188-1.04-.294-.107-.508-.16-.722.16-.214.32-.828 1.04-.916 1.254-.107.214-.214.24-.508.08-.294-.16-1.24-.457-2.36-1.457-.873-.78-1.462-1.742-1.634-2.036-.16-.294-.017-.454.12-.6.124-.13.294-.32.428-.48.134-.16.186-.267.267-.454.08-.186.04-.347-.02-.48-.054-.134-.722-1.75-.988-2.396-.26-.627-.527-.536-.722-.547H9.8c-.214 0-.56.08-.854.4s-1.12 1.094-1.12 2.668 1.147 3.094 1.307 3.308c.16.214 2.254 3.44 5.462 4.827.764.33 1.36.527 1.823.672.766.244 1.464.21 2.016.127.614-.093 1.893-.774 2.16-1.521.267-.748.267-1.389.187-1.521-.08-.134-.293-.214-.614-.374z"/>
      </svg>
      <span className="whatsapp-label">WhatsApp</span>
    </motion.a>
  );
}
