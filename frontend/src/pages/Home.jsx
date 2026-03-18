import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FileText, ShieldCheck, CreditCard, Leaf } from 'lucide-react';

// Highly sophisticated text reveal animation component (Masked character cascade)
const TextReveal = ({ text, delay = 0, style }) => {
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: delay }
    })
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { type: "spring", damping: 12, stiffness: 100 }
    },
    hidden: {
      opacity: 0,
      y: 100,
      rotateX: -45,
    }
  };

  return (
    <motion.div style={{ ...style, display: 'flex', flexWrap: 'wrap', overflow: 'hidden' }} variants={container} initial="hidden" animate="visible">
      {text.split('').map((char, index) => (
        <motion.span variants={child} key={index} style={{ paddingRight: char === ' ' ? '1vw' : '0' }}>
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

const Home = () => {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const imageY = useTransform(scrollYProgress, [0, 0.5], [100, -100]);

  return (
    <div style={{ position: 'relative', width: '100vw', left: 'calc(-50vw + 50%)', backgroundColor: 'var(--bg-main)' }}>
      
      {/* SECTION 1: HERO */}
      <motion.section style={{ 
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'var(--primary)',
        paddingTop: '30vh',
        paddingLeft: '4vw',
        paddingRight: '4vw',
        paddingBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: 'var(--text-light)',
        overflow: 'hidden',
        scale: heroScale, // Subtle zoom out on scroll
        transformOrigin: 'top center'
      }}>
        {/* Draw faint light grid lines over the hero background */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right, var(--grid-line-light) 1px, transparent 1px)',
          backgroundSize: '12.5vw 100%',
          zIndex: 0
        }} />
        
        {/* Rich radial gradient spotlight mimic 3D lighting */}
        <div style={{
          position: 'absolute',
          top: '0', left: '50%', transform: 'translateX(-50%)',
          width: '100vw', height: '100%',
          background: 'radial-gradient(ellipse at 50% -20%, var(--primary-glow) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        {/* Hero Title and Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 10 }}>
          <TextReveal 
            text="AgriLease™" 
            delay={0.2}
            style={{ 
              fontSize: 'min(15vw, 180px)', 
              fontWeight: 500, 
              lineHeight: 0.85,
              letterSpacing: '-0.04em',
              margin: 0,
              color: 'var(--text-light)'
            }} 
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            style={{ marginTop: '2rem' }}
          >
            <Link to="/discovery" style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'var(--text-light)',
              padding: '0.8rem 1.8rem',
              borderRadius: '99px',
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '1.5px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
            >
              <span style={{ marginRight: '0.8rem', opacity: 0.5, fontSize: '10px' }}>●</span> 
              EXPLORE LANDS 
              <span style={{ marginLeft: '0.8rem', opacity: 0.5, fontSize: '10px' }}>●</span>
            </Link>
          </motion.div>
        </div>

        {/* Hero Subtext Bottom (Parallaxed) */}
        <motion.div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end',
            width: '100%',
            zIndex: 10,
            y: heroY,
            opacity: opacityFade
          }}
        >
          <div style={{ maxWidth: '300px', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.8 }}>
            AGRICULTURAL LEASING, REINVENTED.
          </div>
          <div style={{ maxWidth: '300px', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.5px', textAlign: 'right', textTransform: 'uppercase', opacity: 0.8 }}>
            100 ACRES OF PAPERWORK —<br/>REIMAGINED AS A DIGITAL CONTRACT.
          </div>
        </motion.div>

        {/* Central Graphic overlapping next section */}
        <motion.div 
          initial={{ y: 200, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
          style={{
            position: 'absolute',
            bottom: '-15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(50vw, 500px)',
            height: 'min(50vw, 500px)',
            backgroundColor: '#15190D', // Very dark green
            borderRadius: '40px',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.1)',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            y: imageY // Parallax effect
          }}
        >
          <Leaf size={140} color="var(--primary-glow)" style={{ opacity: 0.4 }} />
        </motion.div>
      </motion.section>

      {/* SECTION 2: TRANSITION (Asymmetrical Text) */}
      <section style={{ 
        minHeight: '60vh', 
        paddingTop: '25vh', 
        paddingBottom: '10vh',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr auto 1fr', 
          width: '100%', 
          maxWidth: '1400px',
          alignItems: 'center',
          padding: '0 4vw'
        }}>
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: 'min(5vw, 80px)', fontWeight: 400, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.1, textAlign: 'left' }}
          >
            Most agricultural<br/>leases
          </motion.h2>
          <div style={{ padding: '0 4rem' }}>
             <motion.div 
               initial={{ opacity: 0, scale: 0.5 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: 0.2 }}
               style={{ width: '80px', height: '120px', backgroundColor: 'var(--primary)', opacity: 0.15, borderRadius: '40px' }} 
             />
          </div>
          <motion.h2 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ fontSize: 'min(5vw, 80px)', fontWeight: 400, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.1, textAlign: 'right', marginTop: '10vh' }}
          >
            never offer<br/>true security.
          </motion.h2>
        </div>
      </section>

      {/* SECTION 3: FEATURES GRID (3 Columns Beige on Green) */}
      <section style={{ 
        backgroundColor: 'var(--primary)', 
        color: 'var(--text-light)',
        padding: '10vh 4vw',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Draw faint light grid lines over the green background manually */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right, var(--grid-line-light) 1px, transparent 1px)',
          backgroundSize: '12.5vw 100%'
        }} />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '8vh', position: 'relative', zIndex: 10 }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.7 }}>Platform Solutions</span>
          <h2 style={{ fontSize: 'min(4vw, 60px)', fontWeight: 500, letterSpacing: '-0.02em', marginTop: '1rem' }}>Solving the land gap.</h2>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1px', // Creates grid line effect
          backgroundColor: 'var(--grid-line-light)', 
          maxWidth: '1300px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10
        }}>
          {[
            { id: 1, title: 'Verified Land', icon: ShieldCheck, desc: 'Government 7/12 document extraction ensures every acre is legitimate and dispute-free before it reaches the grid.' },
            { id: 2, title: 'Smart Contracts', icon: FileText, desc: 'Digital agreements bind both parties instantly, with self-declarations replacing weeks of paperwork.' },
            { id: 3, title: 'Escrow Payments', icon: CreditCard, desc: 'Tokens are held securely until the lease terms are completely activated, protecting investments.' },
          ].map((feat, index) => (
            <motion.div 
              key={feat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              style={{ 
                backgroundColor: 'var(--bg-card)', 
                color: 'var(--primary)', 
                padding: '5rem 4rem', 
                aspectRatio: '1/1.1', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <feat.icon size={48} strokeWidth={1} style={{ opacity: 0.5 }} />
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '1rem' }}>{feat.title}</h3>
                <p style={{ fontSize: '1.2rem', opacity: 0.7, lineHeight: 1.4, fontWeight: 400 }}>{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS (Sticky Scroll Layout) */}
      <section style={{ backgroundColor: 'var(--bg-main)', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '150vh' }}>
          
          {/* Left Side: Sticky Content */}
          <div style={{ 
            position: 'sticky', 
            top: 0, 
            height: '100vh', 
            padding: '20vh 8vw',
            borderRight: '1px solid var(--grid-line)'
          }}>
             <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--primary)', opacity: 0.7 }}>How it works</span>
             <h2 style={{ fontSize: 'min(4.5vw, 70px)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: '2rem', color: 'var(--text-main)' }}>
                Three steps to<br/>activate your land.
             </h2>
             <div style={{ marginTop: '4rem', paddingLeft: '2rem', borderLeft: '2px solid var(--primary)', position: 'relative' }}>
               <div style={{ position: 'absolute', left: '-6px', top: 0, width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
               <h4 style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-main)' }}>1. List & Verify</h4>
               <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>Upload land details and 7/12 documents. Our OCR verifies it.</p>
             </div>
             <div style={{ marginTop: '3rem', paddingLeft: '2rem', borderLeft: '2px solid var(--grid-line)' }}>
               <h4 style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-muted)' }}>2. Tenant Match</h4>
               <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>Receive requests from farmers browsing the discovery grid.</p>
             </div>
             <div style={{ marginTop: '3rem', paddingLeft: '2rem', borderLeft: '2px solid var(--grid-line)' }}>
               <h4 style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-muted)' }}>3. Secure Contract</h4>
               <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>Digitally sign the lease and trigger the escrow deposit.</p>
             </div>
          </div>

          {/* Right Side: Scrollable imagery (Actual App Screenshots) */}
          <div style={{ padding: '20vh 4vw', display: 'flex', flexDirection: 'column', gap: '20vh' }}>
             <motion.img 
               src="/dashboard_preview.png"
               alt="AgriLease Dashboard"
               initial={{ opacity: 0, y: 100 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: false, margin: "-20%" }}
               transition={{ duration: 0.8 }}
               style={{ width: '100%', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 30px 60px rgba(0,0,0,0.15)', border: '1px solid var(--grid-line)' }}
             />
             <motion.img 
               src="/discovery_preview.png"
               alt="AgriLease Discovery Grid"
               initial={{ opacity: 0, y: 100 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: false, margin: "-20%" }}
               transition={{ duration: 0.8 }}
               style={{ width: '100%', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 30px 60px rgba(0,0,0,0.15)', border: '1px solid var(--grid-line)' }}
             />
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
