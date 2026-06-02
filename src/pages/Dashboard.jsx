import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Award, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FacilitiesSlider from '../components/FacilitiesSlider';
import Videos from '../components/Videos';
import { supabase } from '../lib/supabaseClient';
import './Dashboard.css';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

const testimonials = [
  { name: 'Ibu Sari', text: 'Pelayanan sangat ramah dan profesional. Dokternya sangat sabar menjelaskan kondisi saya.', rating: 5 },
  { name: 'Bapak Rudi', text: 'Klinik yang bersih dan nyaman. Waktu tunggu tidak lama dan harga terjangkau.', rating: 5 },
  { name: 'Ananda P.', text: 'Smart Check sangat membantu saya memahami risiko kesehatan saya. Terima kasih!', rating: 5 },
];

const DEFAULT_CLINIC_PROFILE = {
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [clinicProfile, setClinicProfile] = useState(DEFAULT_CLINIC_PROFILE);
  const p = clinicProfile;
  const [eventIdx, setEventIdx] = useState(0);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [doctorsData, setDoctorsData] = useState([]);
  const [schedulesData, setSchedulesData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [galleryData, setGalleryData] = useState([]);
  const previewCount = 2;

  useEffect(() => {
    const rotator = setInterval(() => {
      setEventIdx((prev) => (prev + 1) % Math.max(1, eventsData.length));
      setGalleryIdx((prev) => (prev + 1) % Math.max(1, galleryData.length));
    }, 60000);

    return () => clearInterval(rotator);
  }, [eventsData, galleryData]);

  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      try {
        const [doctorsRes, schedulesRes, eventsRes, galleryRes, profileRes] = await Promise.all([
          supabase.from('doctors').select('*'),
          supabase.from('schedules').select('*'),
          supabase.from('events').select('*').order('date', { ascending: true }),
          supabase.from('gallery').select('*').order('id', { ascending: false }),
          supabase.from('clinic_profile').select('*').single(),
        ]);

        if (!mounted) return;
        console.debug('Dashboard Supabase results:', {
          doctorsRows: doctorsRes.data?.length,
          doctorsError: doctorsRes.error?.message,
          schedulesRows: schedulesRes.data?.length,
          schedulesError: schedulesRes.error?.message,
          eventsRows: eventsRes.data?.length,
          eventsError: eventsRes.error?.message,
          galleryRows: galleryRes.data?.length,
          galleryError: galleryRes.error?.message,
          profileError: profileRes.error?.message,
        });
        if (!doctorsRes.error && doctorsRes.data) setDoctorsData(doctorsRes.data);
        if (!schedulesRes.error && schedulesRes.data) setSchedulesData(schedulesRes.data);
        if (!eventsRes.error && eventsRes.data) setEventsData(eventsRes.data);
        if (!galleryRes.error && galleryRes.data) setGalleryData(galleryRes.data);
        if (!profileRes.error && profileRes.data) {
          setClinicProfile(prev => ({ ...prev, ...profileRes.data }));
        } else if (profileRes.error) {
          console.warn('Clinic profile not available:', profileRes.error.message || profileRes.error);
        }
      } catch (e) {
        console.warn('Unable to load dashboard data from DB', e.message || e);
      }
    }
    fetchAll();
    return () => { mounted = false; };
  }, []);

  const rotatingEvents = eventsData.length > 0
    ? Array.from({ length: Math.min(previewCount, eventsData.length) }, (_, i) => eventsData[(eventIdx + i) % eventsData.length])
    : [];
  const rotatingGallery = galleryData.length > 0
    ? Array.from({ length: Math.min(previewCount, galleryData.length) }, (_, i) => galleryData[(galleryIdx + i) % galleryData.length])
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-wrapper"
    >
      <Navbar />

      <main className="dashboard-main">
        {/* ── Hero ── */}
        <section className="dashboard-section section-hero">
          <div className="container section-container hero-split-container">
            <div className="hero-content-left">
              
              <motion.h1 className="hero-title" {...fadeUp(0.1)}>
                Klinik Mardi Lestari
              </motion.h1>
              <motion.p className="hero-subtitle" {...fadeUp(0.2)}>
                {p.tagline}
              </motion.p>

              <motion.div className="hero-buttons" {...fadeUp(0.3)}>
                <button
                  className="btn btn-primary"
                  onClick={() => document.getElementById('facilities')?.scrollIntoView({ behavior: 'smooth' })}
                  aria-label="Lihat fasilitas kami"
                >
                  Our Facilities
                </button>
                <button
                  className="btn btn-secondary-orange"
                  onClick={() => navigate('/smartcheck')}
                  aria-label="Mulai Smart Check"
                >
                  Smart Check <ArrowRight size={18} />
                </button>
              </motion.div>
            </div>

            {/* Combined right panel: schedule + event + gallery */}
            <div className="hero-content-right">
              <motion.div
                className="schedule-panel glass-panel schedule-panel-expanded"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 }}
              >
                <div className="panel-header">
                  <Calendar size={26} className="panel-icon" aria-hidden="true" />
                  <h2 className="panel-title">Doctor Schedule</h2>
                </div>

                <div className="schedule-panel-body">
                  <div className="schedule-list">
                    {/* ini nanti di ganti yang ada di supabase */}
                    {doctorsData.slice(0, 3).map((doc) => (
                      <div key={doc.id} className="schedule-item">
                        <div className="schedule-avatar" aria-hidden="true">
                          {doc.name?.split(' ').pop()?.[0] || '?'}
                        </div>
                        <div className="doctor-info">
                          <h4>{doc.name}</h4>
                          <span className="spec-badge">{doc.specialization}</span>
                          <div className="time-info">
                            <Clock size={13} aria-hidden="true" />
                            <span>{
                              (() => {
                                const sched = schedulesData.find(s => s.doctor_id === doc.id || s.doctor === doc.name);
                                return sched ? (sched.time_slot || sched.time || sched.time) : (doc.schedule || '-');
                              })()
                            }</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                    className="btn btn-outline schedule-more-btn"
                    onClick={() => navigate('/profile')}
                    aria-label="View full doctor schedule"
                  >
                    View Full Schedule
                  </button>
                  </div>

                  <div className="hero-mini-sections">
                    <div className="hero-mini-block">
                      <div className="hero-mini-head">
                        <h3>Event</h3>
                        <button type="button" onClick={() => navigate('/events')}>See all</button>
                      </div>
                      <div className="hero-mini-list">
                        {rotatingEvents.map((ev) => (
                          <button
                            key={ev.id}
                            type="button"
                            className="hero-mini-item"
                            onClick={() => navigate('/events')}
                          >
                            <strong>{ev.title}</strong>
                            <span>{ev.date}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="hero-mini-block">
                      <div className="hero-mini-head">
                        <h3>Gallery</h3>
                        <button type="button" onClick={() => navigate('/gallery')}>See all</button>
                      </div>
                      <div className="hero-mini-list">
                        {rotatingGallery.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className="hero-mini-item"
                            onClick={() => navigate('/gallery')}
                          >
                            <strong>{item.title}</strong>
                            <span>{item.category}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        {/* <section className="dashboard-section section-stats">
          <div className="container">
            <div className="stats-grid">
              {p.stats.map((s, i) => (
                <motion.div key={i} className="stat-item" {...fadeUp(i * 0.1)}>
                  <span className="stat-val">{s.value}</span>
                  <span className="stat-lbl">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}

        {/* ── Motto / Trust ── */}
        {/* <section className="dashboard-section section-motto">
          <div className="container">
            <motion.div className="motto-strip" {...fadeUp(0)}>
              <Award size={36} className="motto-award-icon" aria-hidden="true" />
              <div>
                <h2>"{p.motto}"</h2>
                <p>Under the auspices of <strong>{p.foundation}</strong> — serving the community since {p.founded}.</p>
              </div>
            </motion.div>
          </div>
        </section> */}

        {/* ── Facilities ── */}
        <section id="facilities" className="dashboard-section section-facilities">
          <div className="container section-container">
            <motion.h2 className="section-large-title text-white drop-shadow mb-4" {...fadeUp(0)}>
              Our Facilities
            </motion.h2>
            <FacilitiesSlider />
          </div>
        </section>

        {/* ── Testimonials ── */}
        {/* <section className="dashboard-section section-testimonials">
          <div className="container">
            <motion.h2 className="section-center-title dark" {...fadeUp(0)}>
              What Patients Say
            </motion.h2>
            <div className="testimonials-grid">
              {testimonials.map((t, i) => (
                <motion.div key={i} className="testimonial-card glass-panel" {...fadeUp(i * 0.1)}>
                  <div className="testi-stars" aria-label={`${t.rating} stars`}>
                    {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={16} fill="#f59e0b" color="#f59e0b" />)}
                  </div>
                  <p className="testi-text">"{t.text}"</p>
                  <span className="testi-name">— {t.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}

        {/* ── Education Videos ── */}
        <section id="education-videos" className="dashboard-section section-videos">
          <div className="container section-container">
            <motion.h2 className="section-large-title text-dark mb-4" {...fadeUp(0)}>
              Health Education
            </motion.h2>
            <Videos />
          </div>
        </section>

        <Footer />
      </main>
    </motion.div>
  );
}
