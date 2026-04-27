import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Leaf, LayoutDashboard, Search, BarChart3, LogOut, Menu, X, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';
import './forms.css';
import Dashboard from './pages/Dashboard';
import Discovery from './pages/Discovery';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LandAnalysis from './pages/LandAnalysis';
import AnalysisResult from './pages/AnalysisResult';
import MarketPrices from './pages/MarketPrices';
import AIAssistant from './components/AIAssistant';
import Preloader from './components/Preloader';

// ─── Auth Helper ─────────────────────────────────────────────────
const isLoggedIn = () => !!localStorage.getItem('token');
const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');

// ─── Protected Route ─────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  return children;
};

// ─── Layout ──────────────────────────────────────────────────────
const Layout = ({ children }) => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [user, setUser] = useState(getUser());
  const location = useLocation();

  useEffect(() => {
    setUser(getUser());
    setMobileMenu(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <div className="app-container">
      <nav className="fm-nav" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        padding: '2rem 3rem', position: 'absolute', top: 0, left: 0, width: '100%',
        zIndex: 50, mixBlendMode: 'difference'
      }}>
        {/* Mobile Menu Toggle */}
        <div className="mobile-menu-toggle" style={{ display: 'none' }}>
          <button onClick={() => setMobileMenu(!mobileMenu)} style={{ background: 'none', border: 'none', color: 'var(--fm-beige)', cursor: 'pointer' }}>
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Left */}
        <div className="nav-left" style={{ flex: 1, color: 'var(--fm-beige)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.5px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}>
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>⛌</span> MENU
          </Link>
        </div>

        {/* Center - Logo */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--fm-beige)' }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Leaf size={24} style={{ marginBottom: '0.3rem' }} />
            <span style={{ fontSize: '1.2rem', fontWeight: 500, letterSpacing: '-0.5px' }}>AgriLease</span>
          </Link>
        </div>

        {/* Right - Nav Links */}
        <div className="nav-right" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', color: 'var(--fm-beige)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.5px', alignItems: 'center' }}>
          <Link to="/analyze" style={{ color: 'inherit', textDecoration: 'none' }}>ANALYZE</Link>
          <Link to="/market" style={{ color: 'inherit', textDecoration: 'none' }}>MARKET</Link>
          <Link to="/discovery" style={{ color: 'inherit', textDecoration: 'none' }}>DISCOVER</Link>
          {user ? (
            <>
              <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>DASHBOARD</Link>
              <button onClick={handleLogout} style={{ color: 'var(--primary)', background: 'var(--bg-main)', padding: '0.4rem 1rem', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: 'var(--font-main)', mixBlendMode: 'normal', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <LogOut size={14} /> {user.name?.split(' ')[0] || 'Logout'}
              </button>
            </>
          ) : (
            <Link to="/login" style={{ color: 'var(--primary)', background: 'var(--bg-main)', padding: '0.4rem 1.2rem', borderRadius: '50px', textDecoration: 'none', mixBlendMode: 'normal', fontSize: '0.8rem' }}>LOGIN</Link>
          )}
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
            style={{ position: 'fixed', inset: 0, background: 'var(--bg-main)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
            <button onClick={() => setMobileMenu(false)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><X size={28} /></button>
            {['/', '/analyze', '/market', '/discovery', '/dashboard'].map((path, i) => (
              <Link key={i} to={path} onClick={() => setMobileMenu(false)} style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none' }}>
                {['Home', 'Analyze', 'Market', 'Discover', 'Dashboard'][i]}
              </Link>
            ))}
            {user ? (
              <button onClick={() => { handleLogout(); setMobileMenu(false); }} style={{ fontSize: '1.2rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-main)' }}>Logout</button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenu(false)} style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>Login</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="main-content">{children}</main>
      <AIAssistant />

      {/* Footer */}
      <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--grid-line)', padding: '6rem 4rem 2rem 4rem' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '2rem', maxWidth: '100%', marginBottom: '6rem' }}>
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', color: 'var(--primary)' }}>
              <Leaf size={32} style={{ marginBottom: '0.5rem' }} />
              <span style={{ fontSize: '1.5rem', fontWeight: 500, letterSpacing: '-0.5px' }}>AgriLease</span>
            </div>
            <div style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
              <p><strong>Team:</strong> Vidhi, Harshita, Vedant, Sarvesh</p>
              <p><strong>Contact:</strong> sarveshkasar1210@gmail.com</p>
            </div>
          </div>
          <div style={{ paddingLeft: '2rem', borderLeft: '1px solid var(--grid-line)' }}>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '0.85rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Legal</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '1.1rem' }}>
              <li><a href="#" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Privacy Policy</a></li>
              <li><a href="#" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Terms</a></li>
            </ul>
          </div>
          <div style={{ paddingLeft: '2rem', borderLeft: '1px solid var(--grid-line)' }}>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '0.85rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '1.1rem' }}>
              <li><Link to="/analyze" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Analyze Land</Link></li>
              <li><Link to="/market" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Market Prices</Link></li>
              <li><Link to="/discovery" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Discover</Link></li>
              <li><Link to="/dashboard" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--grid-line)', paddingTop: '2rem', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 500 }}>
          <div>AgriLease HQ — Maharashtra, India</div>
          <p>&copy; {new Date().getFullYear()} AgriLease. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<LandAnalysis />} />
            <Route path="/results" element={<AnalysisResult />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/market" element={<MarketPrices />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
