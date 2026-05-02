import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, Heart, ShieldPlus, Stethoscope, Home } from 'lucide-react';
import './FacilitiesSlider.css';

const facilities = [
  { id: 'outpatient', name: 'Outpatient Services', icon: <Stethoscope size={40} />, color: '#0284c7' },
  { id: 'inpatient', name: 'Inpatient Services', icon: <Heart size={40} />, color: '#0d9488' },
  { id: 'ambulance', name: '24-Hour Ambulance', icon: <Activity size={40} />, color: '#dc2626' },
  { id: 'ekg', name: 'EKG Services', icon: <ShieldPlus size={40} />, color: '#f59e0b' },
  { id: 'homecare', name: 'Homecare Services', icon: <Home size={40} />, color: '#6366f1' }
];

export default function FacilitiesSlider() {
  const navigate = useNavigate();

  return (
    <div className="facilities-slider-wrapper">
      <div className="facilities-slider">
        {facilities.map((fac, idx) => (
          <motion.div 
            key={fac.id}
            className="slide-item facility-card glass-panel"
            whileHover={{ y: -10 }}
            onClick={() => navigate(`/facilities/${fac.id}`)}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="facility-icon" style={{ backgroundColor: `${fac.color}20`, color: fac.color }}>
              {fac.icon}
            </div>
            <h3>{fac.name}</h3>
            <p>Explore our state-of-the-art {fac.name.toLowerCase()} tailored for your needs.</p>
            <div className="card-action">View Details →</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
