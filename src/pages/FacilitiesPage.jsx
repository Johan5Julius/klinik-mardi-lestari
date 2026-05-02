import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ArrowLeft, Stethoscope, Heart, Activity, ShieldPlus, Home } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './FacilitiesPage.css';

const facilitiesData = {
  outpatient: {
    name: 'Outpatient Services',
    icon: <Stethoscope size={64} />,
    color: '#0284c7',
    motto: 'Expert care, without the overnight stay.',
    bgImage: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    professionals: [
      { id: 1, name: 'Dr. Sarah Lee', role: 'General Physician', bio: '10+ years experience in general medicine.' },
      { id: 2, name: 'Dr. Michael Chen', role: 'Internal Medicine', bio: 'Specialist in adult diseases and chronic care.' }
    ]
  },
  inpatient: {
    name: 'Inpatient Services',
    icon: <Heart size={64} />,
    color: '#0d9488',
    motto: 'Comfort and healing, round the clock.',
    bgImage: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
    professionals: [
      { id: 3, name: 'Dr. Emily Wong', role: 'Chief Resident', bio: 'Overseeing patient recovery and daily rounds.' },
      { id: 4, name: 'Nurse Clara', role: 'Head Nurse', bio: 'Ensuring top-notch patient care and comfort.' }
    ]
  },
  ambulance: {
    name: '24-Hour Ambulance',
    icon: <Activity size={64} />,
    color: '#dc2626',
    motto: 'Rapid response when every second counts.',
    bgImage: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    professionals: [
      { id: 5, name: 'Paramedic John', role: 'Lead Paramedic', bio: 'Trained for high-stress emergency situations.' }
    ]
  },
  ekg: {
    name: 'EKG Services',
    icon: <ShieldPlus size={64} />,
    color: '#f59e0b',
    motto: 'Precision diagnostics for your heart health.',
    bgImage: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    professionals: [
      { id: 6, name: 'Dr. Alan Smith', role: 'Cardiologist', bio: 'Expert in heart rhythm diagnostics.' }
    ]
  },
  homecare: {
    name: 'Homecare Services',
    icon: <Home size={64} />,
    color: '#6366f1',
    motto: 'Bringing quality healthcare to your doorstep.',
    bgImage: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
    professionals: [
      { id: 7, name: 'Nurse Ratna', role: 'Homecare Specialist', bio: 'Compassionate care in the comfort of your home.' }
    ]
  }
};

function ProfileCard({ prof, color }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="profile-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
    >
      <div className="profile-basic glass-panel">
        <div className="profile-avatar" style={{ backgroundColor: `${color}30`, color: color }}>
          {prof.name.charAt(0)}
        </div>
        <h4>{prof.name}</h4>
        <p>{prof.role}</p>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div 
            className="profile-animated-card"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ borderTop: `4px solid ${color}` }}
          >
            <h4>{prof.name}</h4>
            <span className="badge" style={{ backgroundColor: `${color}20`, color: color }}>{prof.role}</span>
            <p className="bio">{prof.bio}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FacilitiesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const facility = facilitiesData[id];

  if (!facility) return <div>Facility not found</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-wrapper"
    >
      <Navbar />
      
      <main className="facility-main" style={{ background: facility.bgImage }}>
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
              style={{ color: facility.color, backgroundColor: 'white' }}
            >
              {facility.icon}
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ color: facility.color }}
            >
              {facility.name}
            </motion.h1>
            <motion.p 
              className="motto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              "{facility.motto}"
            </motion.p>
          </div>

          <div className="professionals-section">
            <h2 className="section-title">Our Professionals</h2>
            <div className="professionals-grid">
              {facility.professionals.map((prof, idx) => (
                <motion.div
                  key={prof.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (idx * 0.1) }}
                >
                  <ProfileCard prof={prof} color={facility.color} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}
