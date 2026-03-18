import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Leaf, Shield, LayoutDashboard, Search, Home as HomeIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import './index.css';
import './forms.css';
import Dashboard from './pages/Dashboard';
import Discovery from './pages/Discovery';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AIAssistant from './components/AIAssistant';

// Layout Component
const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <nav className="fm-nav" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        padding: '2rem 3rem',
        position: 'absolute',
        top: 0, left: 0, width: '100%',
        zIndex: 50,
        mixBlendMode: 'difference' /* For contrast against dark hero */
      }}>
        {/* Left - Menu */}
        <div style={{ flex: 1, color: 'var(--fm-beige)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.5px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>⛌</span> MENU
          </span>
        </div>

        {/* Center - Logo */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--fm-beige)' }}>
          <Leaf size={24} style={{ marginBottom: '0.3rem' }} />
          <span style={{ fontSize: '1.2rem', fontWeight: 500, letterSpacing: '-0.5px' }}>AgriLease</span>
        </div>

        {/* Right - Contact/Dashboard */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '2rem', color: 'var(--fm-beige)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.5px' }}>
          <Link to="/discovery" style={{ color: 'inherit', textDecoration: 'none' }}>DISCOVER</Link>
          <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>DASHBOARD</Link>
          <Link to="/login" style={{ color: 'var(--primary)', background: 'var(--bg-main)', padding: '0.4rem 1.2rem', borderRadius: '50px', textDecoration: 'none', mixBlendMode: 'normal' }}>LOGIN</Link>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
      <AIAssistant />
      <footer style={{ 
        background: 'var(--bg-card)', 
        borderTop: '1px solid var(--grid-line)',
        padding: '6rem 4rem 2rem 4rem'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr 1fr', 
          gap: '2rem',
          maxWidth: '100%', 
          marginBottom: '6rem'
        }}>
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
              <li><Link to="/discovery" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Discover</Link></li>
              <li><Link to="/dashboard" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Dashboard</Link></li>
            </ul>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderTop: '1px solid var(--grid-line)', 
          paddingTop: '2rem', 
          color: 'var(--text-main)', 
          fontSize: '0.85rem',
          fontWeight: 500
        }}>
          <div>AgriLease HQ — Maharashtra, India</div>
          <p>&copy; {new Date().getFullYear()} AgriLease. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Replaced placeholder HomePage with imported Home component

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
