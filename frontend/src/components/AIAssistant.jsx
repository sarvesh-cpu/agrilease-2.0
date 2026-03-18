import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, ImagePlus } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm your AgriLease AI Assistant. I can help you value your land, find the perfect lease, or advise on crops. How can I help?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    const userMessage = input;
    const imageToSend = selectedImage;
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage, image: imageToSend }]);
    setInput('');
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, image: imageToSend })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting to the server. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              background: 'var(--fm-olive)',
              color: 'var(--fm-beige)',
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(40, 48, 24, 0.3)',
              zIndex: 100
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare size={24} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              width: '380px',
              height: '550px',
              background: 'var(--fm-beige)',
              border: '1px solid var(--grid-line)',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 100,
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              background: 'var(--fm-olive)',
              color: 'var(--fm-beige)',
              padding: '1.2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Bot size={24} />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Agri Assistant</h3>
                  <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>Powered by Intelligence</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--fm-beige)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div style={{
              flex: 1,
              padding: '1.5rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              background: 'var(--bg-main)'
            }}>
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    display: 'flex',
                    gap: '0.5rem',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                  }}
                >
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: msg.role === 'user' ? 'var(--text-main)' : 'var(--fm-olive-light)',
                    color: 'var(--fm-beige)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div style={{
                    background: msg.role === 'user' ? 'var(--text-main)' : 'white',
                    color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                    padding: '0.8rem 1rem',
                    borderRadius: '12px',
                    borderTopRightRadius: msg.role === 'user' ? '0' : '12px',
                    borderTopLeftRadius: msg.role === 'ai' ? '0' : '12px',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    border: msg.role === 'ai' ? '1px solid var(--grid-line)' : 'none',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}>
                    {msg.image && (
                      <img 
                        src={msg.image} 
                        alt="Uploaded land" 
                        style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: msg.content ? '0.5rem' : '0' }}
                      />
                    )}
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--fm-olive-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={16} /></div>
                  <div style={{ background: 'white', padding: '0.8rem 1rem', borderRadius: '12px', borderTopLeftRadius: 0, fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
              background: 'white',
              borderTop: '1px solid var(--grid-line)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {selectedImage && (
                <div style={{ padding: '0.8rem 1rem 0 1rem', position: 'relative' }}>
                  <img src={selectedImage} alt="Preview" style={{ height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', padding: '2px', cursor: 'pointer' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <form 
                onSubmit={handleSend}
                style={{
                  padding: '1rem',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center'
                }}
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleImageSelect} 
                  style={{ display: 'none' }} 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--grid-line)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  <ImagePlus size={18} />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about lands, upload image..."
                  style={{
                    flex: 1,
                    padding: '0.8rem 1rem',
                    border: '1px solid var(--grid-line)',
                    borderRadius: '99px',
                    background: 'var(--bg-main)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-main)'
                  }}
                />
                <button
                  type="submit"
                  disabled={(!input.trim() && !selectedImage) || isTyping}
                  style={{
                    background: 'var(--fm-olive)',
                    color: 'var(--fm-beige)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: (!input.trim() && !selectedImage) || isTyping ? 'not-allowed' : 'pointer',
                    opacity: (!input.trim() && !selectedImage) || isTyping ? 0.5 : 1,
                    transition: 'all 0.3s'
                  }}
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
