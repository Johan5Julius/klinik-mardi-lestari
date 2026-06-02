import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, HeartPulse, Scale, Info } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './SmartCheck.css';
import { supabase } from '../lib/supabaseClient';

const defaultOptions = ['Low', 'Medium', 'High'];
const defaultValues = [1, 2, 3];

// questions loaded from DB grouped by category
// shape: { categoryKey: [ { id, text, options, values } ] }
const useQuestionsFromDb = () => {
  const [q, setQ] = useState(null);
  useEffect(() => {
    let mounted = true;
    async function loadQs() {
      try {
        // try both table names
        let res = await supabase.from('smartcheck').select('*');
        if (res.error || !res.data || res.data.length === 0) {
          res = await supabase.from('smartcheck_questions').select('*');
        }
        if (!mounted) return;
        if (!res.error && res.data) {
          const grouped = {};
          res.data.forEach(item => {
            const cat = (item.category || 'general').toLowerCase();
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push({ id: item.id, text: item.question_text || item.title || item.text || 'Question', options: defaultOptions, values: defaultValues });
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
  const questions = questionsFromDb || questionsFromDb === null ? questionsFromDb : null;

  // fallback to local static questions if DB not available
  const getQuestionsForType = (t) => {
    if (questionsFromDb && questionsFromDb[t]) return questionsFromDb[t];
    // fallback small set to keep UI working
    if (t === 'obesity') return [
      { id: 1, text: 'How often do you exercise per week?', options: ['Never', '1–2', '3+'], values: [3,2,1] },
      { id: 2, text: 'How often do you consume fast food?', options: ['Daily','Sometimes','Rarely'], values: [3,2,1] },
      { id: 3, text: 'Do you feel overweight?', options: ['Yes','Somewhat','No'], values: [3,2,1] }
    ];
    if (t === 'cholesterol') return [
      { id: 1, text: 'Family history of high cholesterol?', options: ['Yes','Not sure','No'], values: [3,2,1] },
      { id: 2, text: 'How often do you eat fried foods?', options: ['Daily','Sometimes','Rarely'], values: [3,2,1] },
      { id: 3, text: 'Do you smoke?', options: ['Yes','Occasionally','No'], values: [3,2,1] }
    ];
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
      // finish
      const finalScore = score + value;
      navigate('/results', { state: { score: finalScore, type } });
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
                  {/* ini nanti di ganti dengan isi smart check */}
                  <h2>Select Screening Type</h2>
                  <div className="type-cards">
                    <div className="type-card" onClick={() => handleSelectType('obesity')}>
                      <div className="type-icon bg-primary-light text-primary"><Scale size={32} /></div>
                      <h3>Obesity Risk</h3>
                      <p>Evaluate your lifestyle and risk factors for obesity.</p>
                    </div>
                    <div className="type-card" onClick={() => handleSelectType('cholesterol')}>
                      <div className="type-icon bg-secondary-light text-secondary"><HeartPulse size={32} /></div>
                      <h3>Cholesterol Risk</h3>
                      <p>Check your dietary habits and family history impacts.</p>
                    </div>
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
                  <button className="btn-icon" onClick={() => setType(null)}><ArrowLeft size={24} /></button>
                  <div className="intro-card">
                    <div className="intro-icon"><Info size={48} /></div>
                    <h2>{type === 'obesity' ? 'Obesity' : 'Cholesterol'} Screening</h2>
                    <p>
                      This brief questionnaire is designed to help you understand your potential risk factors. 
                      It consists of 3 simple questions about your lifestyle and habits.
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
                      style={{ width: `${((currentQIndex) / questions[type].length) * 100}%` }}
                    />
                  </div>
                  <div className="progress-text">Question {currentQIndex + 1} of {getQuestionsForType(type).length}</div>
                  
                  <div className="question-box">
                    <h2>{getQuestionsForType(type)[currentQIndex].text}</h2>
                    <div className="options-list">
                      {getQuestionsForType(type)[currentQIndex].options.map((opt, idx) => (
                        <button 
                          key={idx} 
                          className="option-btn"
                          onClick={() => handleAnswer(getQuestionsForType(type)[currentQIndex].values[idx])}
                        >
                          {opt}
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
