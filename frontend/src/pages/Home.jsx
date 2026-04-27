import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FileText, ShieldCheck, CreditCard, Leaf, BarChart3, Sprout, MapPin, TrendingUp, ArrowRight, Droplets, Users } from 'lucide-react';

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
      opacity: 1, y: 0, rotateX: 0,
      transition: { type: "spring", damping: 12, stiffness: 100 }
    },
    hidden: { opacity: 0, y: 100, rotateX: -45 }
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
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const imageY = useTransform(scrollYProgress, [0, 0.5], [100, -100]);

  return (
    <div style={{ position: 'relative', width: '100vw', left: 'calc(-50vw + 50%)', backgroundColor: 'var(--bg-main)' }}>
      
      {/* ═══ SECTION 1: HERO ═══ */}
      <motion.section style={{ 
        position: 'relative', minHeight: '100vh', backgroundColor: 'var(--primary)',
        paddingTop: '28vh', paddingLeft: '4vw', paddingRight: '4vw', paddingBottom: '2rem',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        color: 'var(--text-light)', overflow: 'hidden', scale: heroScale, transformOrigin: 'top center'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', backgroundImage: 'linear-gradient(to right, var(--grid-line-light) 1px, transparent 1px)', backgroundSize: '12.5vw 100%', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '100vw', height: '100%', background: 'radial-gradient(ellipse at 50% -20%, var(--primary-glow) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 10, flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ maxWidth: '900px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1.2rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <BarChart3 size={14} /> LAND INTELLIGENCE PLATFORM
            </motion.div>
            <TextReveal 
              text="Know what to grow" 
              delay={0.2}
              style={{ fontSize: 'min(12vw, 140px)', fontWeight: 500, lineHeight: 0.9, letterSpacing: '-0.04em', color: 'var(--text-light)' }} 
            />
            <TextReveal 
              text="before you sow." 
              delay={0.6}
              style={{ fontSize: 'min(12vw, 140px)', fontWeight: 500, lineHeight: 0.9, letterSpacing: '-0.04em', color: 'var(--text-light)', marginTop: '0.2em' }} 
            />
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1, duration: 0.8 }} style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <Link to="/analyze" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', backgroundColor: 'var(--fm-beige)', color: 'var(--primary)', padding: '1rem 2rem', borderRadius: '99px', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.5px', textDecoration: 'none', transition: 'all 0.3s ease' }}>
              <BarChart3 size={18} /> ANALYZE MY LAND
            </Link>
            <Link to="/discovery" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'var(--text-light)', padding: '0.8rem 1.8rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '1.5px', textDecoration: 'none', transition: 'all 0.3s ease' }}>
              EXPLORE LANDS
            </Link>
          </motion.div>
        </div>

        <motion.div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', zIndex: 10, opacity: opacityFade }}>
          <div style={{ maxWidth: '300px', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.8 }}>
            DATA-DRIVEN FARMING<br/>FOR PUNE–NASHIK REGION.
          </div>
          <div style={{ maxWidth: '300px', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.5px', textAlign: 'right', textTransform: 'uppercase', opacity: 0.8 }}>
            INCREASE ROI. REDUCE RISK.<br/>GROW SMARTER.
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 200, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
          style={{
            position: 'absolute', bottom: '-30%', right: '8%',
            width: 'min(30vw, 320px)', height: 'min(30vw, 320px)',
            backgroundColor: '#15190D', borderRadius: '40px',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.1)',
            zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', y: imageY
          }}
        >
          <Leaf size={100} color="var(--primary-glow)" style={{ opacity: 0.4 }} />
        </motion.div>
      </motion.section>

      {/* ═══ SECTION 2: STATS BAR ═══ */}
      <section style={{ backgroundColor: 'var(--fm-olive)', padding: '4rem 4vw', position: 'relative', zIndex: 30 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center', color: 'var(--fm-beige)' }}>
          {[
            { num: '12+', label: 'Crop Models' },
            { num: '2', label: 'Districts Covered' },
            { num: '28', label: 'Talukas Mapped' },
            { num: '100%', label: 'Free to Use' }
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}>
              <h3 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1 }}>{stat.num}</h3>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.7, marginTop: '0.3rem' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 3: TRANSITION TEXT ═══ */}
      <section style={{ minHeight: '50vh', paddingTop: '20vh', paddingBottom: '10vh', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', width: '100%', maxWidth: '1400px', alignItems: 'center', padding: '0 4vw' }}>
          <motion.h2 initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
            style={{ fontSize: 'min(5vw, 80px)', fontWeight: 400, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Most farmers<br/>grow crops
          </motion.h2>
          <div style={{ padding: '0 4rem' }}>
            <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
              style={{ width: '80px', height: '120px', backgroundColor: 'var(--primary)', opacity: 0.15, borderRadius: '40px' }} />
          </div>
          <motion.h2 initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.4 }}
            style={{ fontSize: 'min(5vw, 80px)', fontWeight: 400, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.1, textAlign: 'right', marginTop: '10vh' }}>
            without knowing<br/>the real risk.
          </motion.h2>
        </div>
      </section>

      {/* ═══ SECTION 4: FEATURES GRID ═══ */}
      <section style={{ backgroundColor: 'var(--primary)', color: 'var(--text-light)', padding: '10vh 4vw', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', backgroundImage: 'linear-gradient(to right, var(--grid-line-light) 1px, transparent 1px)', backgroundSize: '12.5vw 100%' }} />
        
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '8vh', position: 'relative', zIndex: 10 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.7 }}>Platform Features</span>
          <h2 style={{ fontSize: 'min(4vw, 60px)', fontWeight: 500, letterSpacing: '-0.02em', marginTop: '1rem' }}>Intelligent farming decisions.</h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: 'var(--grid-line-light)', maxWidth: '1300px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          {[
            { title: 'Crop Intelligence', icon: Sprout, desc: 'AI-powered analysis of your land conditions to recommend the top 3 most profitable and least risky crops for your specific plot.' },
            { title: 'Risk Scoring', icon: ShieldCheck, desc: 'Every recommendation comes with a clear Low/Medium/High risk indicator based on soil, irrigation, season, and market conditions.' },
            { title: 'Revenue Estimates', icon: TrendingUp, desc: 'Get expected yield ranges and revenue potential in ₹ for each crop, calculated based on your land area and current market rates.' },
          ].map((feat, index) => (
            <motion.div key={feat.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.1 * index }}
              style={{ backgroundColor: 'var(--bg-card)', color: 'var(--primary)', padding: '5rem 4rem', aspectRatio: '1/1.1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.3s ease', cursor: 'default' }}
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

      {/* ═══ SECTION 5: HOW IT WORKS ═══ */}
      <section style={{ backgroundColor: 'var(--bg-main)', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '120vh' }}>
          <div style={{ position: 'sticky', top: 0, height: '100vh', padding: '20vh 8vw', borderRight: '1px solid var(--grid-line)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--primary)', opacity: 0.7 }}>How it works</span>
            <h2 style={{ fontSize: 'min(4.5vw, 70px)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: '2rem', color: 'var(--text-main)' }}>
              Three steps to<br/>smarter farming.
            </h2>
            {[
              { num: '1', title: 'Input Land Details', desc: 'Enter your district, soil type, irrigation, and season.', active: true },
              { num: '2', title: 'Get AI Analysis', desc: 'Our engine scores 12+ crops across multiple factors.' },
              { num: '3', title: 'Grow with Confidence', desc: 'See risk scores, revenue estimates, and water compatibility.' }
            ].map((s, i) => (
              <div key={i} style={{ marginTop: i === 0 ? '4rem' : '2.5rem', paddingLeft: '2rem', borderLeft: `2px solid ${s.active ? 'var(--primary)' : 'var(--grid-line)'}`, position: 'relative' }}>
                {s.active && <div style={{ position: 'absolute', left: '-6px', top: 0, width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />}
                <h4 style={{ fontSize: '1.5rem', fontWeight: 500, color: s.active ? 'var(--text-main)' : 'var(--text-muted)' }}>{s.num}. {s.title}</h4>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ padding: '20vh 4vw', display: 'flex', flexDirection: 'column', gap: '15vh', alignItems: 'center', justifyContent: 'center' }}>
            {/* CTA Card instead of images */}
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-20%" }}
              transition={{ duration: 0.8 }}
              style={{
                width: '100%', maxWidth: '500px', background: 'var(--primary)', borderRadius: '24px',
                padding: '4rem 3rem', color: 'var(--fm-beige)', textAlign: 'center',
                boxShadow: '0 30px 60px rgba(0,0,0,0.15)'
              }}
            >
              <BarChart3 size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.7 }} />
              <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.5px' }}>Ready to analyze?</h3>
              <p style={{ opacity: 0.8, marginBottom: '2rem', fontSize: '1.1rem' }}>Enter your land details and get instant, data-driven crop recommendations.</p>
              <Link to="/analyze" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'var(--fm-beige)', color: 'var(--primary)',
                padding: '1rem 2rem', borderRadius: '99px',
                fontWeight: 700, textDecoration: 'none', fontSize: '1rem'
              }}>
                Analyze My Land <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-20%" }}
              transition={{ duration: 0.8 }}
              style={{
                width: '100%', maxWidth: '500px', background: 'var(--bg-card)', borderRadius: '24px',
                padding: '3rem', border: '1px solid var(--grid-line)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.08)'
              }}
            >
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Crops We Analyze</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                {[
                  { icon: '🍇', name: 'Grapes' }, { icon: '🧅', name: 'Onion' }, { icon: '🍎', name: 'Pomegranate' },
                  { icon: '🌾', name: 'Sugarcane' }, { icon: '🌿', name: 'Cotton' }, { icon: '🫘', name: 'Soybean' },
                  { icon: '🌽', name: 'Maize' }, { icon: '🍅', name: 'Tomato' }, { icon: '🥜', name: 'Groundnut' }
                ].map(c => (
                  <div key={c.name} style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--grid-line)' }}>
                    <div style={{ fontSize: '1.8rem' }}>{c.icon}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.3rem' }}>{c.name}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6: TESTIMONIALS ═══ */}
      <section style={{ padding: '10vh 4vw', backgroundColor: 'var(--bg-main)' }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--primary)', opacity: 0.7 }}>Testimonials</span>
          <h2 style={{ fontSize: 'min(4vw, 50px)', fontWeight: 500, letterSpacing: '-0.02em', marginTop: '1rem', color: 'var(--text-main)' }}>What farmers say</h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { name: 'Rajesh Patil', location: 'Baramati, Pune', quote: 'The crop analysis helped me switch from sugarcane to pomegranate on my water-scarce land. Revenue doubled in the second year.', role: 'Landowner, 8 acres' },
            { name: 'Sunita Jadhav', location: 'Niphad, Nashik', quote: 'I was growing onion every season. The platform suggested crop rotation with soybean — my soil health improved and onion yields went up.', role: 'Progressive Farmer, 5 acres' },
            { name: 'Vikram Shinde', location: 'Maval, Pune', quote: 'The risk scoring saved me from planting sugarcane on rain-fed land. Bajra turned out to be the right choice — low cost, guaranteed MSP.', role: 'Smallholder, 3 acres' }
          ].map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--grid-line)', borderRadius: '20px', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '2rem' }}>"{t.quote}"</p>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{t.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.role}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem' }}><MapPin size={12} /> {t.location}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
