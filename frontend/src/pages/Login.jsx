import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Phone, ShieldCheck, FileSignature } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({
      role: 'lessee',
      isVerified: true, 
      name: 'Test User'
    }));
    navigate('/dashboard');
  };

  return (
    <div className="auth-container" style={{ display: 'flex', minHeight: 'calc(100vh - 120px)', paddingTop: '120px', paddingBottom: '4rem', paddingLeft: '4rem', paddingRight: '4rem', gap: '4rem', alignItems: 'center', justifyContent: 'center' }}>

      {/* Left Side Info Layer */}
      <motion.div 
        className="auth-info"
        style={{ flex: 1, maxWidth: '600px' }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={{ fontSize: '4.5rem', fontWeight: 800, color: 'var(--fm-olive)', lineHeight: 1, letterSpacing: '-2px', marginBottom: '1.5rem' }}>
          Secure,<br/>Transparent<br/>Leasing.
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Join thousands of landowners and lessees scaling Indian agriculture through verified digital agreements and escrow-secured payments.
        </p>
        
        <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--primary)', padding: '0.8rem', borderRadius: '50%', color: 'var(--fm-beige)' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ color: 'var(--text-main)', fontWeight: 700 }}>100% Secure</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Escrow Payments</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--primary)', padding: '0.8rem', borderRadius: '50%', color: 'var(--fm-beige)' }}>
              <FileSignature size={24} />
            </div>
            <div>
              <h4 style={{ color: 'var(--text-main)', fontWeight: 700 }}>Legal Safety</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Digital Agreements</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side Form Layer */}
      <div className="auth-form-container" style={{ flex: 1, maxWidth: '500px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, type: 'spring' }}
          style={{ width: '100%', background: 'transparent', border: '1px solid var(--grid-line)', padding: '3rem', borderRadius: 'var(--border-radius)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            <div className="input-group">
              <label>Phone Number</label>
              <div className="input-wrapper">
                <Phone size={18} className="input-icon" />
                <input type="tel" placeholder="9876543210" required />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input type="password" placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" className="btn-primary large" style={{ width: '100%', marginTop: '1rem' }}>
              Sign In
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
            Don't have an account? {' '}
            <span 
              onClick={() => navigate('/signup')} 
              style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}
            >
              Sign up
            </span>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default Login;
