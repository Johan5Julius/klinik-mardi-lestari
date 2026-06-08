import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabaseClient';
import { fetchFacilities, fetchFacilityDetail } from '../lib/publicApi';
import { getFacilityIcon } from '../lib/facilityIcons';
import './FacilitiesPage.css';

function DoctorCard({ doctor, color }) {
  const isActive = doctor.status === 'Active';
  const statusClass = String(doctor.status || 'Active').toLowerCase().replace(' ', '-');

  return (
    <div className="facility-doctor-card glass-panel">
      <div className="facility-doctor-avatar" style={{ backgroundColor: `${color}25`, color }}>
        {doctor.name?.charAt(0) || '?'}
      </div>
      <div className="facility-doctor-info">
        <h4>{doctor.name}</h4>
        <p className="facility-doctor-spec">{doctor.specialization}</p>

        {isActive ? (
          doctor.schedules?.length > 0 ? (
            <ul className="facility-doctor-schedules">
              {doctor.schedules.map(s => (
                <li key={s.id}>
                  <Calendar size={14} aria-hidden="true" />
                  <span>{s.day}</span>
                  <Clock size={14} aria-hidden="true" />
                  <span>{s.time_slot}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="facility-doctor-no-schedule">Jadwal belum tersedia</p>
          )
        ) : (
          <span className={`facility-doctor-status status-${statusClass}`}>
            {doctor.status}
          </span>
        )}
      </div>
    </div>
  );
}

export default function FacilitiesPage() {
  const { id: slug } = useParams();
  const navigate = useNavigate();
  const [facility, setFacility] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadFromSupabase() {
      let fac = null;

      const { data: exactMatch } = await supabase
        .from('facilities')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (exactMatch) {
        fac = exactMatch;
      } else {
        const { data: allFacilities } = await supabase.from('facilities').select('*');
        fac = (allFacilities || []).find(
          f => f.slug?.toLowerCase() === String(slug).toLowerCase()
        ) || null;
      }

      if (!fac) return null;

      const { data: facilitySchedules } = await supabase
        .from('schedules')
        .select('*')
        .eq('facility_id', fac.id);

      const scheduleDoctorIds = [...new Set((facilitySchedules || []).map(s => s.doctor_id))];

      let directDoctorIds = [];
      const { data: directDoctors, error: docErr } = await supabase
        .from('doctors')
        .select('*')
        .eq('facility_id', fac.id);

      if (!docErr) {
        directDoctorIds = (directDoctors || []).map(d => d.id);
      }

      const allDoctorIds = [...new Set([...scheduleDoctorIds, ...directDoctorIds])];
      if (!allDoctorIds.length) {
        return { facility: fac, doctors: [] };
      }

      const { data: docRows } = await supabase
        .from('doctors')
        .select('*')
        .in('id', allDoctorIds)
        .order('name', { ascending: true });

      const { data: schedRows } = await supabase
        .from('schedules')
        .select('*')
        .in('doctor_id', allDoctorIds);

      const schedules = (schedRows || []).filter(
        s => s.facility_id === fac.id || s.facility_id == null
      );

      return {
        facility: fac,
        doctors: (docRows || []).map(doc => ({
          ...doc,
          schedules: schedules.filter(s => s.doctor_id === doc.id),
        })),
      };
    }

    async function loadFacility() {
      setLoading(true);
      try {
        let result = await loadFromSupabase();

        if (!result) {
          result = await fetchFacilityDetail(slug);
        }

        if (!result) {
          const allFacilities = await fetchFacilities();
          const matched = (allFacilities || []).find(
            f => f.slug === slug || f.slug?.toLowerCase() === String(slug).toLowerCase()
          );
          if (matched) {
            result = { facility: matched, doctors: [] };
          }
        }

        if (!mounted) return;

        if (result?.facility) {
          setFacility(result.facility);
          setDoctors(result.doctors || []);
        } else {
          setFacility(null);
          setDoctors([]);
        }
      } catch (e) {
        console.warn('Unable to load facility:', e.message || e);
        if (mounted) {
          setFacility(null);
          setDoctors([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadFacility();
    return () => { mounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main className="facility-main facility-loading">
          <p>Loading facility…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main className="facility-main facility-loading">
          <p>Facility not found.</p>
          <button className="btn btn-outline" onClick={() => navigate('/')}>Back to Home</button>
        </main>
        <Footer />
      </div>
    );
  }

  const color = facility.color || '#0284c7';
  const bgStyle = facility.background_image_url
    ? {
        backgroundImage: `linear-gradient(rgba(255,255,255,0.82), rgba(255,255,255,0.88)), url(${facility.background_image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {
        background: `linear-gradient(135deg, ${color}12 0%, ${color}28 100%)`,
      };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-wrapper"
    >
      <Navbar />

      <main className="facility-main" style={bgStyle}>
        <div className="container">
          <button className="btn btn-outline back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Back
          </button>

          <div className="facility-header">
            <motion.div
              className="facility-hero-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              style={{ color, backgroundColor: 'white' }}
            >
              {getFacilityIcon(facility.icon, 64)}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ color }}
            >
              {facility.name}
            </motion.h1>
            {facility.motto && (
              <motion.p
                className="motto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                &ldquo;{facility.motto}&rdquo;
              </motion.p>
            )}
          </div>

          {facility.description && (
            <motion.div
              className="facility-description glass-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="section-title">About This Facility</h2>
              <p>{facility.description}</p>
            </motion.div>
          )}

          <motion.div
            className="facility-doctors-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="section-title">Our Professionals</h2>
            {doctors.length > 0 ? (
              <div className="facility-doctors-grid">
                {doctors.map(doc => (
                  <DoctorCard key={doc.id} doctor={doc} color={color} />
                ))}
              </div>
            ) : (
              <p className="facility-doctors-empty">Belum ada dokter yang ditugaskan ke fasilitas ini.</p>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}
