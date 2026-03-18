import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    const duration = 2000; // 2 seconds total loading time
    const intervalTime = 20; // Update every 20ms
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        // Add a slight delay at 100% before triggering the exit animation
        setTimeout(() => {
          setIsVisible(false);
          // Allow exit animation to finish before unmounting/enabling scroll
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 800); 
        }, 400);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100vh' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            background: 'var(--fm-olive)',
            color: 'var(--fm-beige)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2rem 3rem',
            overflow: 'hidden'
          }}
        >
          {/* Top Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.5px' }}>
            <span>SYSTEM INITIALIZATION</span>
            <span>v1.0.0</span>
          </div>

          {/* Center Brand */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}
            >
              AgriLease
            </motion.h1>
          </div>

          {/* Bottom Loading Bar & Percentage */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div style={{ width: '30%', height: '2px', background: 'rgba(229, 225, 216, 0.2)', position: 'relative', marginBottom: '0.5rem' }}>
              <motion.div 
                style={{ 
                  position: 'absolute', 
                  top: 0, left: 0, height: '100%', 
                  background: 'var(--fm-beige)',
                  width: `${progress}%`
                }} 
              />
            </div>
            
            <motion.div 
              style={{ fontSize: 'clamp(4rem, 10vw, 12rem)', fontWeight: 300, lineHeight: 0.8, fontFamily: 'monospace' }}
            >
              {progress}
              <span style={{ fontSize: '0.5em', marginLeft: '0.2rem' }}>%</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
