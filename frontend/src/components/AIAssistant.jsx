import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, ImagePlus, Sprout, Trash2, MapPin, ChevronDown, Sparkles, RefreshCw } from 'lucide-react';

const QUICK_ACTIONS = [
  'What should I grow?',
  'Best crop for black soil?',
  'Is sugarcane risky?',
  'Kharif season crops',
  'Grapes in Nashik',
  'Revenue estimates'
];

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // ─── Personalization State ───
  const [userLands, setUserLands] = useState([]);
  const [activeLandId, setActiveLandId] = useState(null);
  const [activeLandSummary, setActiveLandSummary] = useState(null);
  const [showLandSelector, setShowLandSelector] = useState(false);
  const [userId, setUserId] = useState(null);

  // Get userId from localStorage on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user.id || user.userId || null;
    setUserId(id);

    // Set welcome message
    setMessages([{
      role: 'bot',
      text: "🌱 **Welcome to AgriLease AI!**\n\nI'm your **personalized crop intelligence advisor** for the Pune–Nashik region.\n\nI can help with:\n• 🌾 Crop recommendations based on your land\n• 📊 Risk assessment for specific crops\n• 📅 Season-wise planting guides\n• 💰 Revenue and yield estimates\n\nTry a quick action below or ask anything!"
    }]);
  }, []);

  // Fetch user's land profiles
  useEffect(() => {
    if (!isOpen) return;
    fetchUserLands();
  }, [isOpen]);

  const fetchUserLands = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // Fetch all land profiles (since userId might be null for demo)
      const effectiveId = userId || 'all';
      const res = await fetch(`${apiUrl}/api/chat/lands/${effectiveId}`);
      const data = await res.json();
      const lands = data.lands || [];
      setUserLands(lands);

      // Auto-select first land if none selected
      if (lands.length > 0 && !activeLandId) {
        setActiveLandId(lands[0].id);
        setActiveLandSummary(lands[0].summary);
      }
    } catch (err) {
      // Fallback: try to fetch all land profiles
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/lands`);
        const data = await res.json();
        const lands = Array.isArray(data) ? data.map(l => ({
          id: l.id,
          name: l.name || 'My Land',
          district: l.district,
          taluka: l.taluka,
          area: l.area,
          soilType: l.soilType,
          irrigationType: l.irrigationType,
          season: l.season,
          summary: `${l.name || 'My Land'} — ${l.area} acres of ${l.soilType} soil in ${l.taluka}, ${l.district}. Irrigation: ${l.irrigationType}. Season: ${l.season}.`
        })) : [];
        setUserLands(lands);
        if (lands.length > 0 && !activeLandId) {
          setActiveLandId(lands[0].id);
          setActiveLandSummary(lands[0].summary);
        }
      } catch (e) {
        console.log('No land profiles available');
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async (text, imgData = null) => {
    const userMsg = { role: 'user', text: text || '📷 [Sent an image for analysis]', image: imgData };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Clear image state
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Use personalized endpoint if we have a land selected
      const endpoint = activeLandId
        ? `${apiUrl}/api/chat/personalized`
        : `${apiUrl}/api/chat`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          image: imgData,
          userId: userId || 'guest',
          activeLandId: activeLandId
        })
      });
      const data = await res.json();
      
      const botMsg = {
        role: 'bot',
        text: data.reply,
        personalized: data.personalized
      };
      setMessages(prev => [...prev, botMsg]);

      // Update active land info if returned
      if (data.activeLand) {
        setActiveLandSummary(data.activeLand.summary);
      }
      if (data.availableLands && data.availableLands.length > userLands.length) {
        setUserLands(data.availableLands);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: '⚠️ Connection failed. Please check that the backend server is running on port 5000.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() && !selectedImage) return;
    sendMessage(input.trim(), imagePreview);
  };

  const handleQuickAction = (text) => {
    sendMessage(text);
  };

  const handleClearHistory = async () => {
    setMessages([{
      role: 'bot',
      text: "🔄 **Chat cleared!**\n\nConversation history has been reset. Ask me anything!"
    }]);
    if (userId) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await fetch(`${apiUrl}/api/chat/history/${userId}`, { method: 'DELETE' });
      } catch (e) { /* silent */ }
    }
  };

  const selectLand = (land) => {
    setActiveLandId(land.id);
    setActiveLandSummary(land.summary);
    setShowLandSelector(false);
    setMessages(prev => [...prev, {
      role: 'bot',
      text: `🔄 **Context switched!**\n\nNow advising for: **${land.name}**\n📍 ${land.area} acres, ${land.soilType} soil in ${land.taluka}, ${land.district}\n💧 ${land.irrigationType} irrigation\n\nAsk me anything about this land!`
    }]);
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  const activeLand = userLands.find(l => l.id === activeLandId);

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(true)}
            style={{
              position: 'fixed', bottom: '2rem', right: '2rem',
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'var(--primary)', color: 'var(--fm-beige)',
              border: 'none', cursor: 'pointer', zIndex: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(40,48,24,0.4)'
            }}
          >
            <MessageCircle size={26} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            style={{
              position: 'fixed', bottom: '2rem', right: '2rem',
              width: '440px', height: '640px',
              background: 'var(--bg-card)', borderRadius: '24px',
              border: '1px solid var(--grid-line)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              zIndex: 100, display: 'flex', flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1rem 1.2rem',
              borderBottom: '1px solid var(--grid-line)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--primary)', color: 'var(--fm-beige)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sprout size={22} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>AgriLease AI</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                    {activeLand ? `Advising for ${activeLand.name}` : 'Crop Intelligence Assistant'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button onClick={handleClearHistory} title="Clear history" style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'inherit', cursor: 'pointer', padding: '0.4rem', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                  <RefreshCw size={16} />
                </button>
                <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'inherit', cursor: 'pointer', padding: '0.4rem', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Land Context Bar */}
            {userLands.length > 0 && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowLandSelector(!showLandSelector)}
                  style={{
                    width: '100%', padding: '0.6rem 1.2rem',
                    background: activeLandId ? 'rgba(40,48,24,0.06)' : 'rgba(239,68,68,0.06)',
                    border: 'none', borderBottom: '1px solid var(--grid-line)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    gap: '0.5rem', fontSize: '0.78rem', fontFamily: 'var(--font-main)',
                    color: 'var(--text-main)', textAlign: 'left'
                  }}
                >
                  {activeLandId ? (
                    <>
                      <Sparkles size={14} color="var(--primary)" />
                      <span style={{ flex: 1, fontWeight: 600 }}>
                        <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
                        {' '}{activeLand?.name} — {activeLand?.area} acres, {activeLand?.soilType}
                      </span>
                    </>
                  ) : (
                    <>
                      <MapPin size={14} color="var(--text-muted)" />
                      <span style={{ flex: 1, color: 'var(--text-muted)' }}>Select a land profile for personalized advice</span>
                    </>
                  )}
                  <ChevronDown size={14} style={{ transform: showLandSelector ? 'rotate(180deg)' : 'none', transition: 'all 0.2s' }} />
                </button>

                {/* Land Dropdown */}
                <AnimatePresence>
                  {showLandSelector && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{
                        position: 'absolute', top: '100%', left: 0, right: 0,
                        background: 'var(--bg-card)', borderBottom: '1px solid var(--grid-line)',
                        zIndex: 10, maxHeight: '200px', overflow: 'auto',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                      }}
                    >
                      {userLands.map((land) => (
                        <button
                          key={land.id}
                          onClick={() => selectLand(land)}
                          style={{
                            width: '100%', padding: '0.7rem 1.2rem',
                            background: land.id === activeLandId ? 'rgba(40,48,24,0.08)' : 'transparent',
                            border: 'none', borderBottom: '1px solid var(--grid-line)',
                            cursor: 'pointer', textAlign: 'left',
                            fontFamily: 'var(--font-main)', fontSize: '0.8rem',
                            display: 'flex', flexDirection: 'column', gap: '0.2rem'
                          }}
                        >
                          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                            {land.id === activeLandId && '✓ '}{land.name}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                            {land.area} acres · {land.soilType} soil · {land.taluka}, {land.district} · {land.irrigationType}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Messages */}
            <div style={{ flex: 1, overflow: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex', gap: '0.6rem',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start'
                  }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    background: msg.role === 'bot' ? 'var(--primary)' : 'var(--bg-main)',
                    border: msg.role === 'user' ? '1px solid var(--grid-line)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {msg.role === 'bot' ? <Bot size={14} color="var(--fm-beige)" /> : <User size={14} />}
                  </div>
                  <div>
                    {msg.image && (
                      <img src={msg.image} alt="Uploaded" style={{ maxWidth: '180px', borderRadius: '12px', marginBottom: '0.5rem', border: '1px solid var(--grid-line)' }} />
                    )}
                    <div style={{
                      padding: '0.7rem 0.9rem', borderRadius: '14px',
                      background: msg.role === 'user' ? 'var(--primary)' : 'var(--bg-main)',
                      color: msg.role === 'user' ? 'var(--fm-beige)' : 'var(--text-main)',
                      fontSize: '0.84rem', lineHeight: 1.5, maxWidth: '290px',
                      border: msg.role === 'bot' ? '1px solid var(--grid-line)' : 'none'
                    }}
                      dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                    />
                    {msg.personalized && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem', fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 600 }}>
                        <Sparkles size={10} /> Personalized response
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}
                >
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={14} color="var(--fm-beige)" />
                  </div>
                  <div style={{ padding: '0.7rem 0.9rem', borderRadius: '14px', background: 'var(--bg-main)', border: '1px solid var(--grid-line)' }}>
                    <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                      {[0, 0.2, 0.4].map((d, i) => (
                        <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: d }}
                          style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                      ))}
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.3rem' }}>
                        {activeLandId ? 'Analyzing your land...' : 'Thinking...'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Actions — show only at start */}
              {messages.length <= 1 && !loading && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                  {QUICK_ACTIONS.map((action, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                      onClick={() => handleQuickAction(action)}
                      style={{
                        background: 'transparent', border: '1px solid var(--grid-line)',
                        borderRadius: '99px', padding: '0.35rem 0.75rem',
                        fontSize: '0.75rem', cursor: 'pointer', color: 'var(--primary)',
                        fontWeight: 600, fontFamily: 'var(--font-main)',
                        transition: 'all 0.2s'
                      }}
                    >
                      {action}
                    </motion.button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid var(--grid-line)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src={imagePreview} alt="Preview" style={{ height: '40px', borderRadius: '8px', border: '1px solid var(--grid-line)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flex: 1 }}>Image ready</span>
                <button onClick={() => { setSelectedImage(null); setImagePreview(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.3rem' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            )}

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{
              padding: '0.7rem 0.8rem', borderTop: '1px solid var(--grid-line)',
              display: 'flex', gap: '0.4rem', alignItems: 'center'
            }}>
              <input
                type="file" accept="image/*" ref={fileInputRef}
                onChange={handleImageSelect} style={{ display: 'none' }}
              />
              <button type="button" onClick={() => fileInputRef.current?.click()} style={{
                background: 'var(--bg-main)', color: 'var(--text-main)',
                border: '1px solid var(--grid-line)', borderRadius: '50%',
                width: '36px', height: '36px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'all 0.3s', flexShrink: 0
              }}>
                <ImagePlus size={15} />
              </button>
              <input
                type="text" value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={activeLandId ? `Ask about your ${activeLand?.soilType || ''} soil land...` : 'Ask about crops, soil, risk...'}
                style={{
                  flex: 1, padding: '0.65rem 1rem',
                  border: '1px solid var(--grid-line)', borderRadius: '99px',
                  background: 'var(--bg-main)', fontSize: '0.84rem',
                  fontFamily: 'var(--font-main)', color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
              <button type="submit" disabled={loading || (!input.trim() && !selectedImage)} style={{
                background: 'var(--primary)', color: 'var(--fm-beige)',
                border: 'none', borderRadius: '50%',
                width: '36px', height: '36px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                opacity: (loading || (!input.trim() && !selectedImage)) ? 0.5 : 1,
                transition: 'all 0.3s', flexShrink: 0
              }}>
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
