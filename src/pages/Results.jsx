import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, ShieldCheck, Activity, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Results.css';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, type, numQuestions } = location.state || { score: 0, type: 'unknown', numQuestions: 3 };

  if (type === 'unknown') {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main className="results-main">
          <div className="container">
            <p>No results found. Please complete the Smart Check first.</p>
            <button className="btn btn-primary" onClick={() => navigate('/smartcheck')}>Go to Smart Check</button>
          </div>
        </main>
      </div>
    );
  }

  // Calculate risk dynamically
  const maxPossibleScore = (numQuestions || 3) * 3;
  let riskCategory = 'Low';
  let riskColor = 'var(--secondary)'; // teal
  let RiskIcon = ShieldCheck;
  
  if (score >= maxPossibleScore * 0.75) {
    riskCategory = 'High';
    riskColor = '#dc2626'; // red
    RiskIcon = AlertTriangle;
  } else if (score >= maxPossibleScore * 0.5) {
    riskCategory = 'Medium';
    riskColor = '#f59e0b'; // amber
    RiskIcon = Activity;
  }

  // Format type nicely (Title Case)
  const formattedType = type.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-wrapper"
    >
      <Navbar />
      
      <main className="results-main">
        <div className="container">
          <motion.div 
            className="results-card glass-panel"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="results-header">
              <h2>{formattedType} Risk Assessment</h2>
              <p>Based on your answers, here is your initial screening result.</p>
            </div>

            <div className="score-section">
              <motion.div 
                className="score-circle"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
                style={{ borderColor: riskColor, color: riskColor }}
              >
                <RiskIcon size={48} className="mb-2" />
                <div className="risk-level">{riskCategory} Risk</div>
                <div className="score-number">Score: {score}/{maxPossibleScore}</div>
              </motion.div>
            </div>

            <div className="disclaimer-box">
              <AlertCircle size={24} className="disclaimer-icon" />
              <p>
                <strong>Disclaimer:</strong> This result is an initial screening based on an educational algorithm and does not constitute a medical diagnosis. It is recommended to consult a healthcare professional for further clinical evaluation.
              </p>
            </div>

            <div className="action-section">
              <p>Take the next step towards better health.</p>
              <button 
                className="btn btn-primary btn-large"
                onClick={() => navigate('/dashboard')}
              >
                <Calendar size={20} /> View Doctor Schedule
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}
