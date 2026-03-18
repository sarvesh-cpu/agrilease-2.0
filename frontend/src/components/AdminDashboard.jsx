import { useState, useEffect } from 'react';
import { IndianRupee, ShieldCheck, ArrowRightLeft, FileCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  
  useEffect(() => {
    // Mock admin transactions
    setTransactions([
      { id: 'TX-9001', amount: 35000, type: 'Token Payment', status: 'held', from: 'Alice Farmer', to: 'John Owner', landId: 'SV-101' },
      { id: 'TX-9002', amount: 150000, type: 'Full Payment', status: 'released', from: 'Alice Farmer', to: 'John Owner', landId: 'SV-101' },
      { id: 'TX-9003', amount: 20000, type: 'Token Payment', status: 'held', from: 'Test Lessee', to: 'Jane Owner', landId: 'SV-205' },
    ]);
  }, []);

  const releaseFunds = (id) => {
    setTransactions(transactions.map(tx => 
      tx.id === id ? { ...tx, status: 'released' } : tx
    ));
    alert(`Funds for transaction ${id} released from escrow.`);
  };

  return (
    <div style={{ padding: '0 1rem' }}>
      <h2 style={{ color: 'var(--primary-glow)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShieldCheck size={28} /> Platform Administration
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', letterSpacing: '-1px' }}>
            <IndianRupee size={28}/> 55,000
          </h3>
          <p style={{ color: '#D6A848', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', marginTop: '0.5rem' }}>Total Held in Escrow</p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', letterSpacing: '-1px' }}>
            <IndianRupee size={28}/> 1,50,000
          </h3>
          <p style={{ color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', marginTop: '0.5rem' }}>Total Released Safely</p>
        </div>

      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem' }}>
          Recent Transactions
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence>
            {transactions.map(tx => (
              <motion.div 
                key={tx.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                layout
                className="glass-card" 
                style={{ padding: '1.2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)' }}
              >
                <div>
                  <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '0.2rem', fontWeight: 700 }}>{tx.id}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{tx.type} • Land: {tx.landId}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-main)' }}>
                  <div style={{ textAlign: 'right', fontSize: '0.9rem', fontWeight: 600 }}>{tx.from}</div>
                  <ArrowRightLeft size={16} color="var(--primary)" />
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{tx.to}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem' }}>₹{tx.amount.toLocaleString()}</h3>
                  
                  {tx.status === 'held' ? (
                    <button 
                      className="btn-primary" 
                      onClick={() => releaseFunds(tx.id)}
                      style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                    >
                      Release to Owner
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-glow)', fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                      <FileCheck size={16} /> Released
                    </div>
                  )}
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
