import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, HeartPulse, Scale, Info } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './SmartCheck.css';

const questions = {
  obesity: [
    { id: 1, text: 'How often do you exercise per week?', options: ['None', '1-2 times', '3+ times'], values: [3, 2, 1] },
    { id: 2, text: 'How often do you consume fast food or sugary drinks?', options: ['Daily', 'Few times a week', 'Rarely'], values: [3, 2, 1] },
    { id: 3, text: 'Do you feel you are currently overweight?', options: ['Yes, significantly', 'Slightly', 'No'], values: [3, 2, 1] }
  ],
  cholesterol: [
    { id: 1, text: 'Do you have a family history of high cholesterol?', options: ['Yes', 'Not sure', 'No'], values: [3, 2, 1] },
    { id: 2, text: 'How often do you eat fried or greasy foods?', options: ['Daily', 'Sometimes', 'Rarely'], values: [3, 2, 1] },
    { id: 3, text: 'Do you smoke?', options: ['Yes', 'Occasionally', 'No'], values: [3, 2, 1] }
  ]
};

export default function SmartCheck() {
  const navigate = useNavigate();
  const [type, setType] = useState(null);
  const [step, setStep] = useState('intro'); // intro -> q1 -> q2 -> q3 -> loading -> result
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);

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
    if (currentQIndex < questions[type].length - 1) {
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
                  <div className="progress-text">Question {currentQIndex + 1} of {questions[type].length}</div>
                  
                  <div className="question-box">
                    <h2>{questions[type][currentQIndex].text}</h2>
                    <div className="options-list">
                      {questions[type][currentQIndex].options.map((opt, idx) => (
                        <button 
                          key={idx} 
                          className="option-btn"
                          onClick={() => handleAnswer(questions[type][currentQIndex].values[idx])}
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
