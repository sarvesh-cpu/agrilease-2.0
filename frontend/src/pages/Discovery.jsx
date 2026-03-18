import { useState, useEffect } from 'react';
import { Search, MapPin, IndianRupee, SlidersHorizontal, ArrowRight, Heart, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import AgreementModal from '../components/AgreementModal';

const Discovery = () => {
  const [lands, setLands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [selectedLand, setSelectedLand] = useState(null);

  useEffect(() => {
    // Mock data for verified lands available for lease
    setLands([
      { id: 1, type: 'Agricultural', area: 10.5, price: 15000, location: 'Pune, Maharashtra', duration: '1 Year', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop' },
      { id: 2, type: 'Orchard', area: 3.2, price: 25000, location: 'Nashik, Maharashtra', duration: '3 Years', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=800&auto=format&fit=crop' },
      { id: 3, type: 'Agricultural', area: 15.0, price: 12000, location: 'Solapur, Maharashtra', duration: '5 Years', image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=800&auto=format&fit=crop' },
    ]);
  }, []);

  const filteredLands = lands.filter(land => 
    land.location.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (priceFilter === '' || land.price <= parseInt(priceFilter))
  );

  return (
    <motion.div 
      className="page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 800, letterSpacing: '-2px', color: 'var(--fm-olive)', lineHeight: 1, marginBottom: '0.5rem' }}>Discover Lands</h1>
        <p style={{ color: 'var(--text-muted)' }}>Browse verified agricultural lands available for secure leasing.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card" style={{ display: 'flex', gap: '1rem', padding: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div className="input-wrapper" style={{ flex: 2, minWidth: '250px' }}>
          <Search size={18} className="input-icon" />
          <input 
            type="text" 
            placeholder="Search by location (e.g., Pune)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="input-wrapper" style={{ flex: 1, minWidth: '200px' }}>
          <IndianRupee size={18} className="input-icon" />
          <select 
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="">Any Price</option>
            <option value="15000">Under ₹15,000/acre</option>
            <option value="20000">Under ₹20,000/acre</option>
            <option value="30000">Under ₹30,000/acre</option>
          </select>
        </div>

        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SlidersHorizontal size={18} /> Filters
        </button>
      </div>

      {/* Grid of Lands */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {filteredLands.map((land, index) => (
          <motion.div 
            key={land.id} 
            className="glass-card" 
            style={{ padding: 0, display: 'flex', flexDirection: 'column' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div style={{ position: 'relative', height: '220px', borderBottom: '1px solid var(--grid-line)' }}>
              <img src={land.image} alt="Land" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--bg-card)', padding: '0.6rem', borderRadius: '50%', cursor: 'pointer', transition: 'all 0.3s', border: '1px solid var(--grid-line)' }}>
                <Heart size={20} color="var(--primary)" />
              </div>
              <div className="badge verified" style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'var(--bg-main)', color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                Verified Land
              </div>
            </div>
            
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{land.type}</h3>
                  <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', marginTop: '0.3rem', fontWeight: 500 }}>
                    <MapPin size={16} /> {land.location}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ color: 'var(--primary)', fontSize: '1.4rem', letterSpacing: '-0.5px' }}>₹{land.price}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase' }}>per acre/yr</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-main)', padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid var(--grid-line)' }}><Target size={16} color="var(--primary)"/> {land.area} Acres</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-main)', padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid var(--grid-line)' }}>⏳ {land.duration}</span>
              </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%', marginTop: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                onClick={() => setSelectedLand(land)}
              >
                Request Lease <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedLand && (
        <AgreementModal 
          land={selectedLand} 
          lessee={{ name: 'Current User' }} 
          onClose={() => setSelectedLand(null)} 
          onSign={() => {
            alert("Digital Agreement Signed! Payment escrow initiated.");
            setSelectedLand(null);
          }} 
        />
      )}

    </motion.div>
  );
};

export default Discovery;
