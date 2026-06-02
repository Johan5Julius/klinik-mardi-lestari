import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <br /><br />
      <div className="footer-top container">
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-circle">
              <Activity size={22} />
            </div>
            <span>Mardi Lestari</span>
          </div>
          <p className="footer-desc">
            Providing compassionate, affordable, and high-quality healthcare to the community since 1998.
          </p>
          <p className="footer-foundation">
            🏥 Under the auspices of <strong>Yayasan Mardi Lestari</strong>
          </p>
          <a
            href="https://instagram.com/klinik.mardilestari"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-insta"
            aria-label="Instagram Klinik Mardi Lestari"
          >
            <Instagram size={18} /> @klinik.mardilestari
          </a>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/dashboard">Home</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/smartcheck">Smart Check</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <ul>
            <li>
              <Phone size={16} aria-hidden="true" />
              <a href="tel:+622112345678">+62 21 1234 5678</a>
            </li>
            <li>
              <Mail size={16} aria-hidden="true" />
              <a href="mailto:info@mardilestari.com">info@mardilestari.com</a>
            </li>
            <li>
              <MapPin size={16} aria-hidden="true" />
              <span>Jl. Kesehatan No. 123, Jakarta Timur, 13220</span>
            </li>
          </ul>
        </div>
      </div>
      <br /> <br />
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Klinik Mardi Lestari. All rights reserved.</p>
        <p className="footer-admin-link">
          <Link to="/admin/login">Admin Login</Link>
        </p>
      </div>
    </footer>
  );
}
