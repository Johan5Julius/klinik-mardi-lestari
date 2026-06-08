import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getFacilityIcon } from '../lib/facilityIcons';
import './FacilitiesSlider.css';

export default function FacilitiesSlider({ facilities = [] }) {
  const navigate = useNavigate();

  if (!facilities.length) {
    return (
      <p className="facilities-empty text-white/80">
        Belum ada data fasilitas. Kelola fasilitas melalui halaman Admin.
      </p>
    );
  }

  return (
    <div className="facilities-slider-wrapper">
      <div className="facilities-slider">
        {facilities.map((fac, idx) => {
          const color = fac.color || '#0284c7';
          const slug = fac.slug;
          const description = fac.description || fac.motto || `Layanan ${fac.name} kami siap melayani kebutuhan kesehatan Anda.`;

          return (
            <motion.div
              key={fac.id}
              className="slide-item facility-card glass-panel"
              whileHover={{ y: -10 }}
              onClick={() => navigate(`/facilities/${slug}`)}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.1 }}
            >
              <div
                className="facility-icon"
                style={{ backgroundColor: `${color}20`, color }}
              >
                {getFacilityIcon(fac.icon, 40)}
              </div>
              <h3>{fac.name}</h3>
              <p>{description}</p>
              <div className="card-action">View Details →</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
