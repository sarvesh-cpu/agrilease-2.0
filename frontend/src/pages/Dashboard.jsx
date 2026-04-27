import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, FileText, MapPin, Settings, CreditCard, Plus, BarChart3, Sprout, Clock, Layers, Droplets, TrendingUp, ChevronRight } from 'lucide-react';
import AdminDashboard from '../components/AdminDashboard';
import LandListings from '../components/LandListings';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const name = user.name || user.fullName || 'Guest';
  const role = user.role || 'All-Access';
  const isAdmin = role === 'admin';
  const isVerified = user.isVerified !== false;

  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [landProfiles, setLandProfiles] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchHistory();
    fetchLandProfiles();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/analysis/history`);
      const data = await res.json();
      setAnalysisHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchLandProfiles = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/lands`);
      const data = await res.json();
      setLandProfiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch land profiles:', err);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analysis', label: 'Analysis History', icon: Clock },
    ...(isAdmin ? [] : [{ id: 'verification', label: 'Verification Center', icon: ShieldCheck }]),
    ...(isAdmin ? [] : [{ id: 'lands', label: 'My Lands', icon: FileText }]),
    ...(isAdmin ? [] : [{ id: 'requests', label: 'My Requests', icon: MapPin }]),
    ...(isAdmin ? [{ id: 'admin', label: 'All Transactions', icon: CreditCard }] : [{ id: 'transactions', label: 'All Transactions', icon: CreditCard }])
  ];

  const formatCurrency = (num) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
    return `₹${num}`;
  };

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-2px', color: 'var(--fm-olive)', lineHeight: 1, marginBottom: '0.3rem' }}>
            Welcome, {name}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Role: <strong>{role}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <Link to="/analyze" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Analyze Land
          </Link>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', border: '1px solid var(--grid-line)',
            borderRadius: '99px', fontSize: '0.9rem', fontWeight: 600
          }}>
            {isVerified ? <ShieldCheck size={18} color="var(--primary)" /> : <ShieldCheck size={18} color="var(--text-muted)" />}
            {isVerified ? 'Verified' : 'Pending'}
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.8rem',
                padding: '1rem 1.2rem', textAlign: 'left', width: '100%',
                justifyContent: 'flex-start'
              }}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          <AnimatePresence mode="wait">
            {/* ─── OVERVIEW TAB ─── */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Dashboard Overview</h2>
                
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem', marginBottom: '2.5rem' }}>
                  {[
                    { label: 'LAND PROFILES', value: landProfiles.length, icon: Layers },
                    { label: 'ANALYSES RUN', value: analysisHistory.length, icon: BarChart3 },
                    { label: 'ACTIVE LEASES', value: 0, icon: FileText }
                  ].map((stat, i) => (
                    <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--grid-line)', borderRadius: '20px', padding: '1.5rem 2rem', textAlign: 'center' }}>
                      <stat.icon size={24} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>{stat.value}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent Analyses */}
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)' }}>Recent Analyses</h3>
                {analysisHistory.length === 0 ? (
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--grid-line)', borderRadius: '20px', padding: '3rem', textAlign: 'center' }}>
                    <BarChart3 size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No analyses yet. Start your first land analysis!</p>
                    <Link to="/analyze" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Plus size={18} /> Analyze My Land
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {analysisHistory.slice(0, 3).map((a, i) => (
                      <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--grid-line)', borderRadius: '16px', padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(40,48,24,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sprout size={20} color="var(--primary)" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{a.name || 'Land Analysis'}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '0.8rem', marginTop: '0.2rem' }}>
                              <span>{a.district}, {a.taluka}</span>
                              <span>•</span>
                              <span>{a.area} acres</span>
                              <span>•</span>
                              <span>{a.soilType} soil</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          {a.recommendations.slice(0, 3).map((r, j) => (
                            <span key={j} style={{ fontSize: '1.4rem' }} title={r.name}>{r.icon}</span>
                          ))}
                          <ChevronRight size={18} color="var(--text-muted)" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── ANALYSIS HISTORY TAB ─── */}
            {activeTab === 'analysis' && (
              <motion.div key="analysis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Analysis History</h2>
                  <Link to="/analyze" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <Plus size={16} /> New Analysis
                  </Link>
                </div>

                {loadingHistory ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</div>
                ) : analysisHistory.length === 0 ? (
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--grid-line)', borderRadius: '20px', padding: '3rem', textAlign: 'center' }}>
                    <Clock size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
                    <p style={{ color: 'var(--text-muted)' }}>No past analyses found. Run your first analysis!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {analysisHistory.map((a, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i }}
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--grid-line)', borderRadius: '20px', padding: '1.5rem 2rem' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <div>
                            <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.3rem' }}>{a.name || 'Land Analysis'}</h3>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={14} /> {a.district}, {a.taluka}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Layers size={14} /> {a.area} acres · {a.soilType}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Droplets size={14} /> {a.irrigationType || 'N/A'}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Sprout size={14} /> {a.season}</span>
                            </div>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                            {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                          {a.recommendations.map((rec, j) => (
                            <div key={j} style={{ background: 'var(--bg-main)', border: '1px solid var(--grid-line)', borderRadius: '14px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                              <span style={{ fontSize: '2rem' }}>{rec.icon}</span>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>#{rec.rank} {rec.name}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                                  <span style={{
                                    padding: '0.1rem 0.5rem', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700,
                                    background: rec.risk.color + '15', color: rec.risk.color, border: `1px solid ${rec.risk.color}30`
                                  }}>
                                    {rec.risk.level}
                                  </span>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                                    {formatCurrency(rec.revenueMin)}–{formatCurrency(rec.revenueMax)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── VERIFICATION TAB ─── */}
            {activeTab === 'verification' && (
              <motion.div key="verification" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Verification Center</h2>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--grid-line)', borderRadius: '20px', padding: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <ShieldCheck size={32} color={isVerified ? 'var(--primary)' : 'var(--text-muted)'} />
                    <div>
                      <h3 style={{ fontWeight: 700 }}>{isVerified ? 'Identity Verified' : 'Verification Pending'}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {isVerified ? 'Your identity has been verified. You can list lands and sign agreements.' : 'Upload your Aadhaar/PAN documents to complete verification.'}
                      </p>
                    </div>
                  </div>
                  {!isVerified && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ background: 'var(--bg-main)', border: '1px dashed var(--grid-line)', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
                        <FileText size={32} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
                        <p style={{ fontWeight: 600 }}>Upload Aadhaar</p>
                      </div>
                      <div style={{ background: 'var(--bg-main)', border: '1px dashed var(--grid-line)', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
                        <FileText size={32} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
                        <p style={{ fontWeight: 600 }}>Upload PAN</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── MY LANDS TAB ─── */}
            {activeTab === 'lands' && (
              <motion.div key="lands" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <LandListings />
              </motion.div>
            )}

            {/* ─── REQUESTS TAB ─── */}
            {activeTab === 'requests' && (
              <motion.div key="requests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-main)' }}>My Requests</h2>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--grid-line)', borderRadius: '20px', padding: '3rem', textAlign: 'center' }}>
                  <MapPin size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
                  <p style={{ color: 'var(--text-muted)' }}>No lease requests yet. Browse lands in Discovery to send a request.</p>
                  <Link to="/discovery" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    Explore Lands
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ─── TRANSACTIONS / ADMIN TAB ─── */}
            {(activeTab === 'transactions' || activeTab === 'admin') && (
              <motion.div key="transactions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <AdminDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
