import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Wrench, Settings, History } from 'lucide-react';
import { useGarage } from '../context/GarageContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { requests } = useGarage();

  const recentRequests = requests.slice(0, 3); // Get 3 most recent

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem', marginTop: '1rem' }}>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '2rem' }}>
          <Wrench className="text-neon-red" size={32} />
          Garage<span className="text-neon-blue">App</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Bienvenue. Prêt pour une nouvelle intervention ?</p>
      </header>

      <section style={{ marginBottom: '2rem' }}>
        <div 
          className="glass-panel" 
          style={{ 
            padding: '24px', 
            textAlign: 'center',
            background: 'linear-gradient(145deg, rgba(28,29,36,0.9) 0%, rgba(15,16,21,0.8) 100%)',
            border: '1px solid rgba(255,0,60,0.2)'
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <img 
              src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
              alt="Car engine" 
              style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(0,225,255,0.2)' }}
            />
          </div>
          <button 
            className="btn-primary" 
            style={{ width: '100%', fontSize: '1.1rem', padding: '16px' }}
            onClick={() => navigate('/nouveau')}
          >
            <PlusCircle size={24} />
            Demander une intervention
          </button>
        </div>
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={20} className="text-neon-blue" />
            Interventions récentes
          </h2>
          <button 
            style={{ background: 'none', border: 'none', color: 'var(--accent-blue-neon)', cursor: 'pointer', fontSize: '0.9rem' }}
            onClick={() => navigate('/historique')}
          >
            Voir tout
          </button>
        </div>

        {recentRequests.length === 0 ? (
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Aucune demande récente.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentRequests.map(req => (
              <div key={req.id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>{req.nom_client} - {req.immatriculation}</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                    <Settings size={12} /> {req.description_panne}
                  </p>
                </div>
                <div>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '8px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    backgroundColor: req.status === 'En attente' ? 'rgba(255, 165, 0, 0.2)' : 'rgba(0, 225, 255, 0.2)',
                    color: req.status === 'En attente' ? '#ffa500' : 'var(--accent-blue-neon)'
                  }}>
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
