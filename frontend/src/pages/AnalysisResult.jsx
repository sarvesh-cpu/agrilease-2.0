import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, Droplets, TrendingUp, Shield, AlertTriangle, CheckCircle, Sprout, Plus, MapPin, Layers, Download } from 'lucide-react';

const AnalysisResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis;

  if (!analysis || !analysis.recommendations) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: '15vh' }}>
        <h2 style={{ color: 'var(--fm-olive)', marginBottom: '1rem' }}>No Analysis Data</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Please run an analysis first to see results.</p>
        <Link to="/analyze" className="btn-primary" style={{ textDecoration: 'none' }}>
          <BarChart3 size={18} /> Analyze My Land
        </Link>
      </div>
    );
  }

  const { recommendations, profile } = analysis;

  const formatCurrency = (num) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
    return `₹${num}`;
  };

  const RiskBadge = ({ risk }) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      padding: '0.3rem 0.8rem', borderRadius: '99px',
      background: risk.color + '15', color: risk.color,
      fontWeight: 700, fontSize: '0.8rem', border: `1px solid ${risk.color}30`
    }}>
      {risk.level === 'Low' ? <CheckCircle size={14} /> : risk.level === 'Medium' ? <AlertTriangle size={14} /> : <Shield size={14} />}
      {risk.level} Risk
    </span>
  );

  const WaterBar = ({ need, compatible }) => {
    const levels = { 'Very Low': 1, 'Low': 2, 'Medium': 3, 'High': 4, 'Very High': 5 };
    const level = levels[need] || 3;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Droplets size={16} color={compatible ? '#3b82f6' : '#ef4444'} />
        <div style={{ display: 'flex', gap: '3px' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{
              width: '12px', height: '16px', borderRadius: '3px',
              background: i <= level ? (compatible ? '#3b82f6' : '#ef4444') : 'var(--grid-line)',
              transition: 'all 0.3s'
            }} />
          ))}
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {need} {compatible ? '✓' : '✗'}
        </span>
      </div>
    );
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
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.8rem', fontSize: '0.9rem', fontFamily: 'var(--font-main)' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-2px', color: 'var(--fm-olive)', lineHeight: 1, marginBottom: '0.5rem' }}>
            Crop Intelligence Report
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            AI-powered recommendations for your land
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button onClick={() => window.print()} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Download size={18} /> Export PDF
          </button>
          <Link to="/analyze" className="btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> New Analysis
          </Link>
          <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Dashboard
          </Link>
        </div>
      </div>

      {/* Land Profile Summary */}
      {profile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--grid-line)',
            borderRadius: '20px', padding: '1.5rem 2rem', marginBottom: '2rem',
            display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            <MapPin size={18} color="var(--primary)" />
            <strong>{profile.taluka}, {profile.district}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            <Layers size={18} color="var(--primary)" />
            <strong>{profile.area} acres</strong> · {profile.soilType} soil
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            <Droplets size={18} color="var(--primary)" />
            {profile.irrigationType}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            <Sprout size={18} color="var(--primary)" />
            {profile.season} season
          </div>
        </motion.div>
      )}

      {/* Crop Recommendation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {recommendations.map((crop, index) => (
          <motion.div
            key={crop.key}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * index, duration: 0.5 }}
            style={{
              background: 'var(--bg-card)',
              border: index === 0 ? '2px solid var(--primary)' : '1px solid var(--grid-line)',
              borderRadius: '24px',
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Rank badge */}
            <div style={{
              position: 'absolute', top: '1.2rem', right: '1.2rem',
              width: '36px', height: '36px', borderRadius: '50%',
              background: index === 0 ? 'var(--primary)' : 'var(--bg-main)',
              border: `1px solid ${index === 0 ? 'var(--primary)' : 'var(--grid-line)'}`,
              color: index === 0 ? '#fff' : 'var(--text-main)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.9rem'
            }}>
              #{crop.rank}
            </div>

            {/* Crop header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '2.5rem' }}>{crop.icon}</span>
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.5px', lineHeight: 1 }}>{crop.name}</h3>
                <RiskBadge risk={crop.risk} />
              </div>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {crop.description}
            </p>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* Yield */}
              <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--grid-line)' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem', letterSpacing: '0.5px' }}>
                  Est. Yield
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {crop.yieldRange}
                </div>
              </div>

              {/* Revenue */}
              <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--grid-line)' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <TrendingUp size={12} /> Revenue
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {formatCurrency(crop.revenueMin)} – {formatCurrency(crop.revenueMax)}
                </div>
              </div>
            </div>

            {/* Water compatibility */}
            <div style={{ marginBottom: '1.2rem' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
                Water Requirement
              </div>
              <WaterBar need={crop.waterNeed} compatible={crop.waterCompatible} />
            </div>

            {/* Factors */}
            <div style={{ borderTop: '1px solid var(--grid-line)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
                Key Factors
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {crop.factors.map((f, i) => (
                  <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, flexShrink: 0 }}>•</span> {f}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          textAlign: 'center', padding: '3rem', background: 'var(--primary)',
          borderRadius: '24px', color: 'var(--fm-beige)'
        }}
      >
        <h3 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
          Ready to lease this land?
        </h3>
        <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>
          Browse verified lands in the Pune-Nashik region on our discovery marketplace.
        </p>
        <Link to="/discovery" className="btn-secondary" style={{ textDecoration: 'none', background: 'transparent', color: 'var(--fm-beige)', borderColor: 'rgba(255,255,255,0.3)' }}>
          Explore Discovery →
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default AnalysisResult;
