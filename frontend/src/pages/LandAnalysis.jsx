import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Layers, Droplets, Sprout, Calendar, ArrowRight, ArrowLeft, Ruler, BarChart3, Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

const TALUKAS = {
  Pune: ['Pune City', 'Haveli', 'Maval', 'Mulshi', 'Baramati', 'Indapur', 'Daund', 'Shirur', 'Junnar', 'Ambegaon', 'Khed', 'Bhor', 'Velhe', 'Purandar'],
  Nashik: ['Nashik', 'Dindori', 'Igatpuri', 'Sinnar', 'Niphad', 'Yeola', 'Malegaon', 'Kalwan', 'Deola', 'Surgana', 'Trimbakeshwar', 'Chandwad', 'Satana', 'Baglan']
};
const SOIL_OPTIONS = [
  { value: 'Black', label: 'Black (Regur)', icon: '🟤', desc: 'Rich, moisture-retaining' },
  { value: 'Red', label: 'Red (Laterite)', icon: '🔴', desc: 'Well-drained, iron-rich' },
  { value: 'Sandy', label: 'Sandy', icon: '🟡', desc: 'Light, fast-draining' },
  { value: 'Loamy', label: 'Loamy', icon: '🟢', desc: 'Balanced, fertile' }
];
const IRRIGATION_OPTIONS = [
  { value: 'Rain-fed', label: 'Rain-fed', icon: '🌧️', desc: 'Monsoon dependent' },
  { value: 'Drip', label: 'Drip', icon: '💧', desc: 'Efficient, modern' },
  { value: 'Canal', label: 'Canal', icon: '🏞️', desc: 'Government canal' },
  { value: 'Borewell', label: 'Borewell', icon: '🔩', desc: 'Groundwater' }
];
const SEASON_OPTIONS = [
  { value: 'Kharif', label: 'Kharif', icon: '🌧️', desc: 'June – October', color: '#22c55e' },
  { value: 'Rabi', label: 'Rabi', icon: '❄️', desc: 'October – March', color: '#3b82f6' },
  { value: 'Summer', label: 'Summer', icon: '☀️', desc: 'March – June', color: '#f59e0b' }
];
const PREVIOUS_CROPS = ['None', 'Cotton', 'Soybean', 'Sugarcane', 'Grapes', 'Pomegranate', 'Onion', 'Tomato', 'Wheat', 'Bajra', 'Jowar', 'Maize', 'Groundnut'];

const LandAnalysis = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({ district: '', taluka: '', area: 5, soilType: '', irrigationType: '', previousCrop: 'None', season: '', landName: '' });

  // ─── 7/12 Upload State ───
  const [isExtracting, setIsExtracting] = useState(false);
  const [docPreview, setDocPreview] = useState(null);
  const [docResult, setDocResult] = useState(null);
  const [docError, setDocError] = useState(null);
  const fileRef = useRef(null);

  const totalSteps = 3;
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'district') setFormData(prev => ({ ...prev, district: value, taluka: '' }));
  };
  const canProceed = () => {
    if (step === 1) return formData.district && formData.taluka && formData.area > 0;
    if (step === 2) return formData.soilType && formData.irrigationType;
    if (step === 3) return formData.season;
    return false;
  };

  // ─── 7/12 Document Upload Handler ───
  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setDocError('File must be under 10MB'); return; }

    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setDocPreview(ev.target.result);
    reader.readAsDataURL(file);

    setIsExtracting(true);
    setDocError(null);
    setDocResult(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const fd = new FormData();
      fd.append('document', file);

      const res = await fetch(`${apiUrl}/api/document/extract-712`, { method: 'POST', body: fd });
      const data = await res.json();

      if (data.success && data.formFields) {
        const f = data.formFields;
        setFormData(prev => ({
          ...prev,
          district: f.district || prev.district,
          taluka: f.taluka || prev.taluka,
          area: f.area || prev.area,
          soilType: f.soilType || prev.soilType,
          irrigationType: f.irrigationType || prev.irrigationType,
          previousCrop: f.previousCrop || prev.previousCrop,
          season: f.season || prev.season,
          landName: f.landName || prev.landName
        }));
        setDocResult(data);
      } else {
        // Clean up error message for user
        let errMsg = data.error || 'Extraction failed';
        if (errMsg.includes('quota') || errMsg.includes('429')) {
          errMsg = '⏳ API quota exceeded. Please wait 1-2 minutes and try again.';
        } else if (errMsg.length > 120) {
          errMsg = errMsg.slice(0, 120) + '...';
        }
        setDocError(errMsg);
      }
    } catch (err) {
      setDocError('Upload failed. Make sure backend is running.');
    } finally {
      setIsExtracting(false);
    }
  };

  const clearDoc = () => { setDocPreview(null); setDocResult(null); setDocError(null); if (fileRef.current) fileRef.current.value = ''; };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/analysis`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      navigate('/results', { state: { analysis: data } });
    } catch (err) {
      alert('Analysis failed. Please make sure the backend server is running on port 5000.');
    } finally { setIsAnalyzing(false); }
  };

  const SelectionCard = ({ selected, onClick, icon, label, desc, style }) => (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={onClick}
      style={{ padding: '1.2rem', border: selected ? '2px solid var(--primary)' : '1px solid var(--grid-line)', borderRadius: '16px', cursor: 'pointer', background: selected ? 'rgba(40, 48, 24, 0.05)' : 'var(--bg-card)', transition: 'all 0.2s', textAlign: 'center', ...style }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{label}</div>
      {desc && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{desc}</div>}
    </motion.div>
  );

  return (
    <motion.div className="page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(40,48,24,0.08)', padding: '0.5rem 1.2rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem' }}>
          <BarChart3 size={16} /> Land Intelligence Engine
        </motion.div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-2px', color: 'var(--fm-olive)', lineHeight: 1, marginBottom: '0.8rem' }}>Analyze Your Land</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
          Enter your land details or <strong>upload your 7/12 document</strong> to auto-fill.
        </p>
      </div>

      {/* ─── 7/12 Document Upload Banner ─── */}
      <div style={{ maxWidth: '700px', margin: '0 auto 2rem' }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: 'linear-gradient(135deg, rgba(40,48,24,0.04), rgba(40,48,24,0.08))', border: '2px dashed var(--grid-line)', borderRadius: '20px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>

          {/* Extracting overlay */}
          {isExtracting && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.92)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', borderRadius: '20px' }}>
              <Sprout size={32} className="spin" style={{ color: 'var(--primary)' }} />
              <div style={{ fontWeight: 700, color: 'var(--primary)' }}>Extracting data from 7/12 document...</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Using Gemini Vision AI to read your Satbara</div>
            </motion.div>
          )}

          {/* Success result */}
          {docResult && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle size={22} color="#22c55e" />
                  <span style={{ fontWeight: 700, color: '#22c55e', fontSize: '0.95rem' }}>7/12 Data Extracted Successfully!</span>
                </div>
                <button onClick={clearDoc} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem', fontSize: '0.85rem', background: 'rgba(34,197,94,0.06)', padding: '1rem', borderRadius: '12px' }}>
                <div><strong>👤 Owner:</strong> {docResult.documentData?.ownerName || '—'}</div>
                <div><strong>🏘️ Village:</strong> {docResult.documentData?.village || '—'}</div>
                <div><strong>📋 Survey No:</strong> {docResult.documentData?.surveyNumber || '—'}</div>
                <div><strong>📐 Area:</strong> {docResult.documentData?.totalAreaHectare || '—'} ha ({docResult.formFields?.area} acres)</div>
                <div><strong>🌾 Crop:</strong> {docResult.documentData?.cropEntries?.[0]?.cropName || '—'}</div>
                <div><strong>💧 Irrigation:</strong> {docResult.documentData?.cropEntries?.[0]?.irrigationSource || '—'}</div>
                {docResult.documentData?.otherRights && <div style={{ gridColumn: 'span 2' }}><strong>📝 Other Rights:</strong> {docResult.documentData.otherRights}</div>}
              </div>
              <div style={{ marginTop: '0.8rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                ✅ Form fields auto-filled • Confidence: <strong>{docResult.documentData?.confidence || 'high'}</strong> • Review & adjust below
              </div>
            </motion.div>
          )}

          {/* Error */}
          {docError && !isExtracting && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <AlertCircle size={18} color="#ef4444" />
              <span style={{ color: '#ef4444', fontSize: '0.85rem' }}>{docError}</span>
              <button onClick={clearDoc} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginLeft: 'auto' }}><X size={16} /></button>
            </div>
          )}

          {/* Upload area (show when no result) */}
          {!docResult && !isExtracting && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {docPreview ? (
                <img src={docPreview} alt="7/12 Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--grid-line)' }} />
              ) : (
                <div style={{ width: '70px', height: '70px', borderRadius: '16px', background: 'rgba(40,48,24,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={28} color="var(--primary)" />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--fm-olive)', marginBottom: '0.3rem' }}>
                  Upload 7/12 Document (Satbara Utara)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                  Upload a photo or scan of your 7/12 extract. AI will read it and auto-fill all fields.
                </div>
                <input type="file" accept="image/*" ref={fileRef} onChange={handleDocUpload} style={{ display: 'none' }} />
                <button onClick={() => fileRef.current?.click()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: 'var(--primary)', color: 'var(--fm-beige)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font-main)' }}>
                  <Upload size={16} /> Upload 7/12 Document
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div style={{ maxWidth: '700px', margin: '0 auto 2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
          {['Location & Size', 'Soil & Irrigation', 'Season & Analyze'].map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step > i ? 'var(--primary)' : step === i + 1 ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: step >= i + 1 ? 600 : 400, fontSize: '0.85rem', transition: 'all 0.3s' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step > i ? 'var(--primary)' : 'transparent', border: step >= i + 1 ? '2px solid var(--primary)' : '2px solid var(--grid-line)', color: step > i ? '#fff' : 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.3s' }}>
                {step > i ? '✓' : i + 1}
              </div>
              <span style={{ display: window.innerWidth > 600 ? 'inline' : 'none' }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ height: '3px', background: 'var(--grid-line)', borderRadius: '99px', overflow: 'hidden' }}>
          <motion.div animate={{ width: `${(step / totalSteps) * 100}%` }} style={{ height: '100%', background: 'var(--primary)', borderRadius: '99px' }} transition={{ duration: 0.4 }} />
        </div>
      </div>

      {/* Form Card */}
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--grid-line)', borderRadius: '24px', padding: '2.5rem', minHeight: '350px' }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--fm-olive)', fontSize: '1.4rem' }}><MapPin size={22} /> Location & Size</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Where is your land and how big is it?</p>
                <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Land Name (optional)</label>
                  <input type="text" placeholder="e.g., My Farm at Baramati" value={formData.landName} onChange={e => updateField('landName', e.target.value)} style={{ paddingLeft: '1rem' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="input-group">
                    <label>District *</label>
                    <select value={formData.district} onChange={e => updateField('district', e.target.value)} style={{ paddingLeft: '1rem' }}>
                      <option value="">Select District</option>
                      <option value="Pune">Pune</option>
                      <option value="Nashik">Nashik</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Taluka *</label>
                    <select value={formData.taluka} onChange={e => updateField('taluka', e.target.value)} disabled={!formData.district} style={{ paddingLeft: '1rem', opacity: formData.district ? 1 : 0.5 }}>
                      <option value="">Select Taluka</option>
                      {formData.district && TALUKAS[formData.district].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label>Land Area: <strong>{formData.area} acres</strong></label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Ruler size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input type="range" min="1" max="50" step="0.5" value={formData.area} onChange={e => updateField('area', parseFloat(e.target.value))} style={{ padding: '0.5rem 0', border: 'none', background: 'transparent', accentColor: 'var(--primary)', flex: 1, cursor: 'pointer' }} />
                    <input type="number" min="0.5" max="100" step="0.5" value={formData.area} onChange={e => updateField('area', parseFloat(e.target.value) || 1)} style={{ width: '80px', textAlign: 'center', paddingLeft: '0.5rem' }} />
                  </div>
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--fm-olive)', fontSize: '1.4rem' }}><Layers size={22} /> Soil & Irrigation</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>What type of soil and water source does your land have?</p>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-main)', marginBottom: '0.8rem', display: 'block' }}>Soil Type *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', marginBottom: '2rem' }}>
                  {SOIL_OPTIONS.map(s => <SelectionCard key={s.value} selected={formData.soilType === s.value} onClick={() => updateField('soilType', s.value)} icon={s.icon} label={s.label} desc={s.desc} />)}
                </div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-main)', marginBottom: '0.8rem', display: 'block' }}>Irrigation Type *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', marginBottom: '2rem' }}>
                  {IRRIGATION_OPTIONS.map(i => <SelectionCard key={i.value} selected={formData.irrigationType === i.value} onClick={() => updateField('irrigationType', i.value)} icon={i.icon} label={i.label} desc={i.desc} />)}
                </div>
                <div className="input-group">
                  <label>Previous Crop (optional)</label>
                  <select value={formData.previousCrop} onChange={e => updateField('previousCrop', e.target.value)} style={{ paddingLeft: '1rem' }}>
                    {PREVIOUS_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--fm-olive)', fontSize: '1.4rem' }}><Calendar size={22} /> Season</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Which season are you planning to cultivate?</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
                  {SEASON_OPTIONS.map(s => <SelectionCard key={s.value} selected={formData.season === s.value} onClick={() => updateField('season', s.value)} icon={s.icon} label={s.label} desc={s.desc} />)}
                </div>
                <div style={{ background: 'var(--bg-main)', border: '1px solid var(--grid-line)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '1rem' }}>Analysis Summary</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', fontSize: '0.95rem' }}>
                    <div><strong>📍 Location:</strong> {formData.taluka}, {formData.district}</div>
                    <div><strong>📐 Area:</strong> {formData.area} acres</div>
                    <div><strong>🟤 Soil:</strong> {formData.soilType}</div>
                    <div><strong>💧 Irrigation:</strong> {formData.irrigationType}</div>
                    <div><strong>🌱 Previous:</strong> {formData.previousCrop}</div>
                    <div><strong>📅 Season:</strong> {formData.season || '—'}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
          <button className="btn-secondary" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} style={{ opacity: step === 1 ? 0.3 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={18} /> Back
          </button>
          {step < totalSteps ? (
            <button className="btn-primary" onClick={() => setStep(step + 1)} disabled={!canProceed()} style={{ opacity: canProceed() ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button className="btn-primary large" onClick={handleAnalyze} disabled={!canProceed() || isAnalyzing}
              style={{ opacity: canProceed() && !isAnalyzing ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: '0.5rem', background: isAnalyzing ? 'var(--text-muted)' : 'var(--primary)', minWidth: '200px', justifyContent: 'center' }}>
              {isAnalyzing ? (<><Sprout size={20} className="spin" /> Analyzing...</>) : (<><BarChart3 size={20} /> Analyze My Land</>)}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LandAnalysis;
