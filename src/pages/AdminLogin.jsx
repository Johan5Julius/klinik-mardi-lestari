import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Activity, Lock, Mail, AlertCircle } from 'lucide-react';
import './AdminLogin.css';
import { supabase } from '../lib/supabaseClient';

const DUMMY_EMAIL = 'admin@mardilestari.com';
const DUMMY_PASSWORD = 'admin123';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email address.';
    if (!password) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setAuthError('');
    if (!validate()) return;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message || 'Authentication failed.');
        return;
      }
      // Successful sign in
      navigate('/admin/dashboard');
    } catch (err) {
      setAuthError(err.message || 'Authentication error.');
    }
  };

  return (
    <motion.div
      className="admin-login-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="admin-login-bg">
        <div className="admin-blob ab-1" />
        <div className="admin-blob ab-2" />
      </div>

      <motion.div
        className="admin-login-card"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div className="admin-login-logo">
          <div className="admin-logo-circle">
            <Activity size={28} />
          </div>
          <div>
            <h1>Admin Panel</h1>
            <p>Klinik Mardi Lestari</p>
          </div>
        </div>

        {authError && (
          <div className="admin-auth-error" role="alert">
            <AlertCircle size={18} /> {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`admin-field ${errors.email ? 'field-error' : ''}`}>
            <label htmlFor="admin-email">Email</label>
            <div className="admin-input-wrap">
              <Mail size={18} className="field-icon" aria-hidden="true" />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mardilestari.com"
                autoComplete="username"
                aria-describedby={errors.email ? 'email-err' : undefined}
              />
            </div>
            {errors.email && <p id="email-err" className="field-err-msg" role="alert">{errors.email}</p>}
          </div>

          <div className={`admin-field ${errors.password ? 'field-error' : ''}`}>
            <label htmlFor="admin-password">Password</label>
            <div className="admin-input-wrap">
              <Lock size={18} className="field-icon" aria-hidden="true" />
              <input
                id="admin-password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                aria-describedby={errors.password ? 'pass-err' : undefined}
              />
              <button
                type="button"
                className="show-pass-btn"
                onClick={() => setShowPass(s => !s)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p id="pass-err" className="field-err-msg" role="alert">{errors.password}</p>}
          </div>

          <motion.button
            type="submit"
            className="admin-login-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Login to admin dashboard"
          >
            Sign In
          </motion.button>
        </form>

        <p className="admin-hint">Hint: admin@mardilestari.com / admin123</p>
      </motion.div>
    </motion.div>
  );
}
