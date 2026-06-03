import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Award, MapPin, Phone, Mail, BookOpen, Eye, Target } from 'lucide-react';
import './Profile.css';
import { supabase } from '../lib/supabaseClient';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

const DEFAULT_PROFILE = {
  name: 'Klinik Mardi Lestari',
  motto: 'Kasih Untuk Sembuh',
  tagline: 'Aku Mau Supaya Engkau Sembuh',
  foundation: 'Yayasan Mardi Lestari',
  founded: '1998',
  address: 'Jl. Kesehatan No. 123, Jakarta Timur, 13220',
  phone: '+62 21 1234 5678',
  whatsapp: '628001234567',
  email: 'info@mardilestari.com',
  instagram: '@klinik.mardilestari',
  history: 'Klinik Mardi Lestari was founded in 1998 under the auspices of Yayasan Mardi Lestari with a mission to provide affordable, compassionate, and high-quality healthcare to the surrounding community.',
  vision: 'To become the most trusted community health centre in Jakarta, known for compassionate care, clinical excellence, and innovation.',
  mission: [
    'Provide affordable and accessible healthcare to all members of the community.',
    'Uphold the highest standards of medical ethics and patient safety.',
    'Continuously improve clinical skills and medical knowledge.',
    'Build a culture of caring, respect, and professionalism in every interaction.',
  ],
  stats: [
    { label: 'Years of Service', value: '27+' },
    { label: 'Medical Doctors', value: '12' },
    { label: 'Patients / Day', value: '150+' },
    { label: 'Specializations', value: '8' },
  ],
  staff: [
    { id: 1, name: 'Dr. Andi Susanto', specialization: 'Cardiologist', role: 'Medical Director' },
    { id: 2, name: 'Dr. Budi Darmawan', specialization: 'Pediatrician', role: 'Head of Pediatrics' },
    { id: 3, name: 'Dr. Citra Lestari', specialization: 'General Practitioner', role: 'Senior GP' },
    { id: 4, name: 'Dr. Dewi Rahayu', specialization: 'Dermatologist', role: 'Skin & Aesthetic Specialist' },
    { id: 5, name: 'Dr. Eko Prasetyo', specialization: 'Orthopedic Surgeon', role: 'Bone & Joint Specialist' },
    { id: 6, name: 'Ns. Ratna Sari', specialization: 'Nursing', role: 'Head Nurse' },
  ],
};

export default function Profile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [doctors, setDoctors] = useState(DEFAULT_PROFILE.staff);
  const p = profile;

  useEffect(() => {
    let mounted = true;

    async function fetchProfile() {
      try {
        const { data, error } = await supabase.from('clinic_profile').select('*').single();
        if (!mounted) return;
        if (!error && data) {
          setProfile(prev => ({ ...prev, ...data }));
        } else if (error) {
          // Table may not exist yet, keep default profile and log only once.
          console.warn('Clinic profile not available:', error.message || error);
        }
      } catch (err) {
        console.warn('Unable to load clinic profile from Supabase:', err.message || err);
      }
    }

    async function fetchDoctors() {
      try {
        const { data, error } = await supabase.from('doctors').select('*').eq('status', 'Active');
        if (!mounted) return;
        if (!error && data && data.length > 0) {
          setDoctors(data);
        }
      } catch (err) {
        console.warn('Unable to load doctors from Supabase:', err.message || err);
      }
    }

    fetchProfile();
    fetchDoctors();
    return () => { mounted = false; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-wrapper"
    >
      <Navbar />

      <main className="profile-main">
        {/* ── Hero ── */}
        <section className="profile-hero">
          <div className="container profile-hero-inner">
            <motion.div className="profile-logo-circle" {...fadeUp(0.1)}>
              <span>ML</span>
            </motion.div>
            <motion.h1 {...fadeUp(0.2)}>{p.name}</motion.h1>
            <motion.p className="profile-tagline" {...fadeUp(0.3)}>"{p.tagline}"</motion.p>
            
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="profile-stats-section">
          <div className="container">
            <div className="profile-stats-grid">
              {p.stats.map((s, i) => (
                <motion.div key={i} className="profile-stat-card" {...fadeUp(i * 0.1)}>
                  <span className="stat-value">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Motto ── */}
        <section className="profile-motto-section">
          <div className="container">
            <motion.div className="motto-banner" {...fadeUp(0)}>
              <Award size={40} className="motto-icon" />
              <div>
                <h2>"{p.motto}"</h2>
                <p>Our motto and commitment to every patient.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── History ── */}
        <section className="profile-section">
          <div className="container">
            <div className="profile-two-col">
              <motion.div {...fadeUp(0)}>
                <div className="profile-section-label"><BookOpen size={18} /> History</div>
                <h2 className="profile-section-title">Our Story</h2>
                <p className="profile-text">{p.history}</p>
              </motion.div>

              <motion.div className="vision-mission-block" {...fadeUp(0.15)}>
                <div className="vm-card">
                  <div className="profile-section-label"><Eye size={18} /> Vision</div>
                  <p>{p.vision}</p>
                </div>
                <div className="vm-card">
                  <div className="profile-section-label"><Target size={18} /> Mission</div>
                  <ul className="mission-list">
                    {p.mission.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Medical Staff ── */}
        <section className="profile-staff-section">
          <div className="container">
            <motion.h2 className="section-center-title" {...fadeUp(0)}>Medical Staff</motion.h2>
            <div className="staff-grid">
              {doctors.map((s, i) => (
                <motion.div key={s.id || i} className="staff-card glass-panel" {...fadeUp(i * 0.08)}>
                  <div className="staff-avatar" style={{ background: `hsl(${(i * 55) % 360}, 70%, 90%)`, color: `hsl(${(i * 55) % 360}, 60%, 35%)` }}>
                    {s.name ? s.name.split(' ').slice(-1)[0][0] : '?'}
                  </div>
                  <h3 className="staff-name">{s.name}</h3>
                  <span className="staff-spec">{s.specialization}</span>
                  {s.role && <span className="staff-role">{s.role}</span>}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="profile-contact-section">
          <div className="container">
            <motion.h2 className="section-center-title" {...fadeUp(0)}>Contact &amp; Location</motion.h2>
            <div className="contact-grid">
              <motion.div className="contact-card glass-panel" {...fadeUp(0.05)}>
                <MapPin size={28} className="contact-icon" />
                <h4>Address</h4>
                <p>{p.address}</p>
              </motion.div>
              <motion.div className="contact-card glass-panel" {...fadeUp(0.1)}>
                <Phone size={28} className="contact-icon" />
                <h4>Phone</h4>
                <p><a href={`tel:${p.phone}`}>{p.phone}</a></p>
              </motion.div>
              <motion.div className="contact-card glass-panel" {...fadeUp(0.15)}>
                <Mail size={28} className="contact-icon" />
                <h4>Email</h4>
                <p><a href={`mailto:${p.email}`}>{p.email}</a></p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
}
