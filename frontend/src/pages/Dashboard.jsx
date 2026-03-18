import { useState, useEffect } from 'react';
import { Upload, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import LandListings from '../components/LandListings';
import AdminDashboard from '../components/AdminDashboard';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Mock user fetching from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser({ role: 'all-access', name: 'Guest', isVerified: true });
    }
  }, []);

  if (!user) return <div className="page">Loading...</div>;

  return (
    <motion.div 
      className="page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-1px', color: 'var(--fm-olive)', marginBottom: '0.5rem', lineHeight: 1 }}>Welcome, {user.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Role: <span style={{ textTransform: 'capitalize', color: 'var(--primary)', fontWeight: 600 }}>{user.role}</span></p>
        </div>
        
        {/* Verification Status Badge */}
        <div className={`badge ${user.isVerified ? 'verified' : 'pending'}`}>
          {user.isVerified ? <><CheckCircle size={16}/> Verified</> : <><Clock size={16}/> Pending Verification</>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Sidebar Nav */}
        <div className="glass-card" style={{ width: '250px', height: 'fit-content', padding: '1.5rem' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li>
              <button 
                className={`role-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                Overview
              </button>
            </li>
            <li>
              <button 
                className={`role-btn ${activeTab === 'verification' ? 'active' : ''}`}
                onClick={() => setActiveTab('verification')}
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                Verification Center
              </button>
            </li>
            <li>
              <button 
                className={`role-btn ${activeTab === 'listings' ? 'active' : ''}`}
                onClick={() => setActiveTab('listings')}
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                My Lands
              </button>
            </li>
            <li>
              <button 
                className={`role-btn ${activeTab === 'requests' ? 'active' : ''}`}
                onClick={() => setActiveTab('requests')}
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                My Requests
              </button>
            </li>
            <li>
              <button 
                className={`role-btn ${activeTab === 'transactions' ? 'active' : ''}`}
                onClick={() => setActiveTab('transactions')}
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                All Transactions
              </button>
            </li>
          </ul>
        </div>

        {/* Main Panel Content */}
        <div className="glass-card" style={{ flex: 1, padding: '2rem' }}>
          
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 style={{ marginBottom: '1.5rem', color: 'var(--fm-olive)', fontSize: '1.8rem', letterSpacing: '-0.5px' }}>Dashboard Overview</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                 <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', letterSpacing: '-1px' }}>0</h3>
                  <p style={{ color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', marginTop: '0.5rem' }}>Active Leases</p>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', letterSpacing: '-1px' }}>₹0</h3>
                  <p style={{ color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', marginTop: '0.5rem' }}>In Escrow</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'verification' && (
            <VerificationPanel user={user} setUser={setUser} />
          )}

          {activeTab === 'listings' && <LandListings user={user} />}
          {activeTab === 'requests' && <div><h2>My Requests</h2><p>Lease requests management coming soon.</p></div>}
          {activeTab === 'transactions' && <AdminDashboard />}

        </div>
      </div>
    </motion.div>
  );
};

// Extracted Component for Verification
const VerificationPanel = ({ user, setUser }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setUploading(false);
    const updatedUser = { ...user, isVerified: true };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    alert("Documents verified successfully!");
  };

  if (user.isVerified) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <CheckCircle size={64} style={{ color: 'var(--primary-glow)', margin: '0 auto 1.5rem' }} />
        <h2>Identity Verified</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem', maxWidth: '400px', margin: '1rem auto' }}>
          Your Aadhaar and PAN documents have been successfully verified. You can now list lands on the platform.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-glow)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <AlertTriangle size={24} color="#facc15" /> Identity Verification Required
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        To ensure trust across the AgriLease platform, all landowners must verify their identity before listing lands.
      </p>

      <div className="glass-card" style={{ padding: '3rem 2rem', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'var(--grid-line)', background: 'transparent', textAlign: 'center', marginBottom: '2rem' }}>
        <Upload size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
        <h3>Upload Documents</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          Please upload a clear image or PDF of your Aadhaar card or PAN card.
        </p>
        
        <input 
          type="file" 
          id="file-upload" 
          style={{ display: 'none' }} 
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="file-upload" className="btn-secondary" style={{ display: 'inline-block' }}>
          Choose File
        </label>
        
        {file && (
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
            <FileText size={18} /> {file.name}
          </div>
        )}
      </div>

      <button 
        className="btn-primary" 
        style={{ width: '100%' }} 
        disabled={!file || uploading}
        onClick={handleUpload}
      >
        {uploading ? 'Verifying...' : 'Submit for Verification'}
      </button>
    </div>
  );
};

export default Dashboard;
