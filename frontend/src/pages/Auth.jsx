import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Phone, UserCheck, Briefcase, ShieldCheck, FileSignature } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('lessee');
  const navigate = useNavigate();

  const handleToggle = () => setIsLogin(!isLogin);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({
      role: role,
      isVerified: true, 
      name: isLogin ? 'Test User' : 'New User'
    }));
    navigate('/dashboard');
  };

  return (
    <div className="auth-container" style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', paddingTop: '80px', paddingBottom: '4rem', paddingLeft: '4rem', paddingRight: '4rem', gap: '4rem', alignItems: 'center', justifyContent: 'center' }}>

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
        <AnimatePresence mode="wait">
          <motion.div 
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, type: 'spring' }}
            style={{ width: '100%', background: 'transparent', border: '1px solid var(--grid-line)', padding: '3rem', borderRadius: 'var(--border-radius)' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                {isLogin ? 'Sign in to access your dashboard' : 'Join AgriLease to list or find land'}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              {!isLogin && (
                <div className="input-group">
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input type="text" placeholder="John Doe" required />
                  </div>
                </div>
              )}

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

              {!isLogin && (
                <div className="role-selector">
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>I want to...</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      type="button" 
                      className={`role-btn ${role === 'lessee' ? 'active' : ''}`}
                      onClick={() => setRole('lessee')}
                    >
                      <UserCheck size={20} />
                      Lease Land
                    </button>
                    <button 
                      type="button" 
                      className={`role-btn ${role === 'landowner' ? 'active' : ''}`}
                      onClick={() => setRole('landowner')}
                    >
                      <Briefcase size={20} />
                      List Land
                    </button>
                  </div>
                </div>
              )}

              <button type="submit" className="btn-primary large" style={{ width: '100%', marginTop: '1rem' }}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span 
                onClick={handleToggle} 
                style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}
              >
                {isLogin ? 'Sign up' : 'Login'}
              </span>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Auth;
