import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, HeartPulse, Scale, Info, HelpCircle, Activity } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './SmartCheck.css';
import { adminApi } from '../lib/adminApi';

const defaultOptions = ['Low', 'Medium', 'High'];
const defaultValues = [1, 2, 3];

// questions loaded from admin Smart Check data grouped by category
// shape: { categoryKey: [ { id, text, options, values } ] }
const useQuestionsFromDb = () => {
  const [q, setQ] = useState(null);
  useEffect(() => {
    let mounted = true;
    async function loadQs() {
      try {
        const data = await adminApi.smartcheck.getAll();
        if (!mounted) return;
        if (data && Array.isArray(data)) {
          const grouped = {};
          data.forEach(item => {
            const cat = item.category || 'General';
            if (!grouped[cat]) grouped[cat] = [];
            const options = Array.isArray(item.options) && item.options.length
              ? item.options
              : defaultOptions.map((label, idx) => ({ label, value: defaultValues[idx] || 0 }));
            grouped[cat].push({
              id: item.id,
              text: item.question_text || item.title || item.text || 'Question',
              options,
            });
          });
          setQ(grouped);
        }
      } catch (e) {
        console.warn('Error loading smartcheck questions', e.message || e);
      }
    }
    loadQs();
    return () => { mounted = false; };
  }, []);
  return q;
};

export default function SmartCheck() {
  const navigate = useNavigate();
  const [type, setType] = useState(null);
  const [step, setStep] = useState('intro'); // intro -> q1 -> q2 -> q3 -> loading -> result
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const questionsFromDb = useQuestionsFromDb();

  // fallback to local static questions if DB not available
  const getQuestionsForType = (t) => {
    if (questionsFromDb) {
      const foundKey = Object.keys(questionsFromDb).find(k => k.toLowerCase() === t.toLowerCase());
      if (foundKey && questionsFromDb[foundKey]) return questionsFromDb[foundKey];
    }
    
    // fallback small set to keep UI working
    
    return [];
  };

  const handleSelectType = (selectedType) => {
    setType(selectedType);
    setStep('intro');
  };

  const startQuiz = () => {
    setStep('quiz');
    setCurrentQIndex(0);
    setScore(0);
  };

  const handleAnswer = (value) => {
    setScore(prev => prev + value);
    const qs = getQuestionsForType(type);
    if (currentQIndex < qs.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      const finalScore = score + value;
      const maxPossibleScore = qs.reduce((sum, q) => {
        const maxValue = Array.isArray(q.options) && q.options.length > 0
          ? Math.max(...q.options.map(o => Number(o.value) || 0))
          : 3;
        return sum + maxValue;
      }, 0);
      navigate('/results', { state: { score: finalScore, type, numQuestions: qs.length, maxPossibleScore } });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-wrapper"
    >
      <Navbar />
      
      <main className="smartcheck-main">
        <div className="container">
          <div className="smartcheck-header">
            <h1>Smart Check</h1>
            <p>Quick self-screening for your health awareness.</p>
          </div>

          <div className="smartcheck-content glass-panel">
            <AnimatePresence mode="wait">
              {!type && (
                <motion.div 
                  key="select-type"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="type-selection"
                >
                  <h2>Select Screening Type</h2>
                  <div className="type-cards">
                    {(() => {
                      const getCategories = () => {
                        if (questionsFromDb && Object.keys(questionsFromDb).length > 0) {
                          return Object.keys(questionsFromDb);
                        }
                        return [];
                      };
                      return getCategories().map((catName, idx) => {
                        const lower = catName.toLowerCase();
                        let IconComponent = HelpCircle;
                        let iconColorClass = "bg-primary-light text-primary";
                        
                        if (lower.includes('obesity') || lower.includes('obesitas')) {
                          IconComponent = Scale;
                          iconColorClass = "bg-primary-light text-primary";
                        } else if (lower.includes('cholesterol') || lower.includes('kolesterol')) {
                          IconComponent = HeartPulse;
                          iconColorClass = "bg-secondary-light text-secondary";
                        } else {
                          if (idx % 2 === 1) {
                            iconColorClass = "bg-secondary-light text-secondary";
                            IconComponent = Activity;
                          } else {
                            IconComponent = HelpCircle;
                          }
                        }

                        // Dynamic description
                        const desc = lower.includes('obesity') || lower.includes('obesitas')
                          ? "Evaluate your lifestyle and risk factors for obesity."
                          : lower.includes('cholesterol') || lower.includes('kolesterol')
                          ? "Check your dietary habits and family history impacts."
                          : `Quick screening questions to evaluate your risk factors for ${catName.toLowerCase()}.`;

                        return (
                          <div key={catName} className="type-card" onClick={() => handleSelectType(catName)}>
                            <div className={`type-icon ${iconColorClass}`}><IconComponent size={32} /></div>
                            <h3>{catName} Risk</h3>
                            <p>{desc}</p>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </motion.div>
              )}

              {type && step === 'intro' && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="intro-section"
                >
                  <button className="btn-icon" onClick={() => setType(null)} aria-label="Back to selection"><ArrowLeft size={24} /></button>
                  <div className="intro-card">
                    <div className="intro-icon"><Info size={48} /></div>
                    <h2>{type} Screening</h2>
                    <p>
                      This brief questionnaire is designed to help you understand your potential risk factors. 
                      It consists of {getQuestionsForType(type).length} simple questions about your lifestyle and habits.
                    </p>
                    <div className="alert-box">
                      <strong>Note:</strong> This is an educational tool and does not replace professional medical advice.
                    </div>
                    <button className="btn btn-primary mt-4" onClick={startQuiz}>
                      Begin Questionnaire <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {type && step === 'quiz' && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="quiz-section"
                >
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${((currentQIndex) / getQuestionsForType(type).length) * 100}%` }}
                    />
                  </div>
                  <div className="progress-text">Question {currentQIndex + 1} of {getQuestionsForType(type).length}</div>
                  
                  <div className="question-box">
                    <h2>{getQuestionsForType(type)[currentQIndex]?.text}</h2>
                    <div className="options-list">
                      {getQuestionsForType(type)[currentQIndex]?.options.map((opt, idx) => (
                        <button 
                          key={idx} 
                          className="option-btn"
                          onClick={() => handleAnswer(opt.value)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}
