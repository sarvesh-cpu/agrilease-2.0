import { useState } from 'react';
import { FileSignature, ShieldAlert, CheckSquare, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

const AgreementModal = ({ land, lessee, onClose, onSign }) => {
  const [agreed, setAgreed] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const handleSign = () => {
    setIsSigning(true);
    onSign();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(26,26,26,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card"
        style={{ width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div style={{ padding: '0 0.5rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-glow)', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
            <FileSignature size={28} /> Digital Lease Agreement
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
            
            <div style={{ background: 'var(--bg-main)', border: '1px solid var(--grid-line)', padding: '1rem', borderRadius: '4px' }}>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '-0.2px' }}>1. Parties Involved</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: 'var(--text-muted)' }}>
                <div>
                  <strong>Landowner:</strong> To be confirmed
                  <br /><strong>Lessee:</strong> {lessee?.name || 'Test User'}
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-main)', border: '1px solid var(--grid-line)', padding: '1rem', borderRadius: '4px' }}>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '-0.2px' }}>2. Land Details</h4>
              <div style={{ color: 'var(--text-muted)' }}>
                <p>Type: {land.type}</p>
                <p>Location: {land.location}</p>
                <p>Area: {land.area} Acres</p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-main)', border: '1px solid var(--grid-line)', padding: '1rem', borderRadius: '4px' }}>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '-0.2px' }}>3. Financial Terms</h4>
              <div style={{ color: 'var(--text-muted)' }}>
                <p><strong style={{ color: 'var(--text-main)' }}>Total Price:</strong> ₹{land.price} / acre per year</p>
                <p><strong style={{ color: 'var(--text-main)' }}>Duration:</strong> {land.duration}</p>
                <p><strong style={{ color: 'var(--text-main)' }}>Initial Token:</strong> 10% (₹{(land.price * 0.1).toFixed(0)}) to be held in secure escrow.</p>
              </div>
            </div>

            {/* Self Declarations */}
            <div style={{ border: '1px dashed #ef4444', padding: '1rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.05)' }}>
              <h4 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <ShieldAlert size={18} /> Legal Self-Declarations
              </h4>
              <label style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={agreed} 
                  onChange={(e) => setAgreed(e.target.checked)} 
                  style={{ width: '20px', height: '20px', marginTop: '0.2rem', accentColor: 'var(--primary)' }}
                />
                <span style={{ lineHeight: '1.5' }}>
                  I solemnly declare that the information provided is true. I understand this constitutes a legally binding intent to lease. I confirm there are no existing legal disputes over this agreement logic to my knowledge.
                </span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button 
              className="btn-primary" 
              onClick={handleSign} 
              disabled={!agreed || isSigning}
              style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            >
              {isSigning ? 'Signing securely...' : <><Fingerprint size={18} /> Acknowledge & Request Sublease</>}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AgreementModal;
