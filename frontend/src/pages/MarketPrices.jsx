import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, IndianRupee, RefreshCw } from 'lucide-react';

const CROP_ICONS = { Sugarcane: '🌾', Cotton: '🏵️', Soybean: '🫘', Onion: '🧅', Grapes: '🍇', Pomegranate: '🔴', Tomato: '🍅', Wheat: '🌾', Bajra: '🌿', Jowar: '🌿', Maize: '🌽', Groundnut: '🥜' };
const TREND_ICON = { rising: <TrendingUp size={14} color="#22c55e" />, stable: <Minus size={14} color="#eab308" />, volatile: <TrendingDown size={14} color="#ef4444" />, seasonal: <RefreshCw size={14} color="#3b82f6" /> };
const TREND_COLOR = { rising: '#22c55e', stable: '#eab308', volatile: '#ef4444', seasonal: '#3b82f6' };

const MarketPrices = () => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/market/prices`);
        const data = await res.json();
        setPrices(data.prices || {});
      } catch (e) { console.error('Failed to fetch prices'); }
      finally { setLoading(false); }
    };
    fetchPrices();
  }, []);

  return (
    <motion.div className="page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(40,48,24,0.08)', padding: '0.5rem 1.2rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem' }}>
          <IndianRupee size={16} /> APMC Market Data
        </motion.div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-2px', color: 'var(--fm-olive)', marginBottom: '0.5rem' }}>Market Prices</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Live APMC rates for Pune–Nashik region crops</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading market data...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem', maxWidth: '1000px', margin: '0 auto' }}>
          {Object.entries(prices).map(([crop, data], i) => (
            <motion.div key={crop} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--grid-line)', borderRadius: '16px', padding: '1.5rem', transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>{CROP_ICONS[crop] || '🌱'}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>{crop}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{data.unit}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: `${TREND_COLOR[data.trend]}15`, padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, color: TREND_COLOR[data.trend] }}>
                  {TREND_ICON[data.trend]} {data.trend}
                </div>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.3rem' }}>
                ₹{data.avgPrice.toLocaleString()}
              </div>
              {data.note && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.5rem', lineHeight: 1.3 }}>{data.note}</div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Min: ₹{data.minPrice.toLocaleString()}</span>
                <span>Max: ₹{data.maxPrice.toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '3rem', padding: '1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '3rem auto 0' }}>
        <p><strong>Source:</strong> Government of India — MSP for Kharif 2025-26 & Rabi RMS 2026-27 (PIB, CACP)</p>
        <p style={{ marginTop: '0.3rem' }}>APMC market ranges from MSAMB Maharashtra. Prices may vary by quality, grade & local mandi.</p>
      </div>
    </motion.div>
  );
};

export default MarketPrices;
