import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, MapPin, Search as SearchIcon, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LandListings = ({ user }) => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'add'
  const [lands, setLands] = useState([]);
  
  // New Land Form State
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    surveyNumber: '',
    area: '',
    location: '',
    landType: 'Agricultural',
    pricePerAcre: '',
    leaseDuration: '1 Year',
    documentUrl: null
  });

  useEffect(() => {
    // In MVP, we fetch from local DB through API or just mock for now
    // Since we created an SQLite backend, we should technically call it, 
    // but for UI flow, let's inject a mock until we hook up full Axios calls
    setLands([
      { id: 1, surveyNumber: "SV-101", area: 10.5, location: "Pune, Maharashtra", status: "approved" },
      { id: 2, surveyNumber: "SV-102", area: 5.0, location: "Nashik, Maharashtra", status: "pending" }
    ]);
  }, []);

  const handleDocumentMockOCR = (file) => {
    setIsProcessing(true);
    setFormData({ ...formData, documentUrl: file.name });
    
    setFormData(prev => ({
      ...prev,
      surveyNumber: "EXTRACTED-9901",
      area: 7.2,
      location: "Solapur, Maharashtra"
    }));
    setIsProcessing(false);
    setStep(2);
  };

  const submitListing = () => {
    // Mock submit
    setLands([...lands, { id: Date.now(), ...formData, status: 'pending' }]);
    setActiveTab('list');
    setStep(1);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--primary-glow)' }}>My Lands</h2>
        <button 
          className="btn-primary" 
          onClick={() => setActiveTab(activeTab === 'list' ? 'add' : 'list')}
        >
          {activeTab === 'list' ? '+ Add New Land' : 'Cancel'}
        </button>
      </div>

      {activeTab === 'list' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {lands.length === 0 ? <p>No lands listed yet.</p> : lands.map(land => (
            <div key={land.id} className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Survey: {land.surveyNumber}</h3>
                <span className={`badge ${land.status}`} style={{ fontSize: '0.7rem' }}>
                  {land.status}
                </span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14}/> {land.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={14}/> {land.area} Acres</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'add' && (
        <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', overflow: 'hidden' }}>
          
          {/* Progress Indicators */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ color: step >= 1 ? 'var(--primary-glow)' : 'var(--text-muted)' }}>1. 7/12 Upload</div>
            <div style={{ color: step >= 2 ? 'var(--primary-glow)' : 'var(--text-muted)' }}>2. Details Verification</div>
            <div style={{ color: step >= 3 ? 'var(--primary-glow)' : 'var(--text-muted)' }}>3. Pricing</div>
          </div>

          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <h3>Upload 7/12 Document</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Upload the official 7/12 extract for automated detail extraction via OCR.</p>
                
                <div style={{ border: '2px dashed var(--primary-accent)', borderRadius: '12px', padding: '3rem', textAlign: 'center' }}>
                  {isProcessing ? (
                    <div>
                      <SearchIcon className="spin" size={32} style={{ color: 'var(--primary-glow)', margin: '0 auto 1rem' }} />
                      <p>Running OCR extraction on document...</p>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                      <input type="file" id="land-doc" style={{ display: 'none' }} onChange={(e) => handleDocumentMockOCR(e.target.files[0])} />
                      <label htmlFor="land-doc" className="btn-secondary">Select File</label>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <h3>Verify Extracted Details</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Please verify the details extracted from your document.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="input-group">
                    <label>Survey / Gat Number</label>
                    <input type="text" value={formData.surveyNumber} onChange={e => setFormData({...formData, surveyNumber: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label>Land Area (Acres)</label>
                    <input type="number" step="0.1" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label>Location</label>
                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                  
                  <button className="btn-primary" onClick={() => setStep(3)} style={{ marginTop: '1rem' }}>Proceed</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <h3>Set Pricing & Lease Terms</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                  
                  <div className="input-group">
                    <label>Pricing Per Acre (₹)</label>
                    <div className="input-wrapper">
                      <IndianRupee size={16} className="input-icon" />
                      <input type="number" placeholder="25000" value={formData.pricePerAcre} onChange={e => setFormData({...formData, pricePerAcre: e.target.value})} />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Lease Duration</label>
                    <select className="input" value={formData.leaseDuration} onChange={e => setFormData({...formData, leaseDuration: e.target.value})}>
                      <option value="1 Year">1 Year</option>
                      <option value="2 Years">2 Years</option>
                      <option value="3 Years">3 Years</option>
                      <option value="5 Years">5 Years</option>
                    </select>
                  </div>

                  <button className="btn-primary" onClick={submitListing} style={{ marginTop: '2rem' }}>Submit Listing</button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default LandListings;
