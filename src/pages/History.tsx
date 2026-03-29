import React from 'react';
import { useGarage } from '../context/GarageContext';
import { Settings, Calendar, CheckCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const History: React.FC = () => {
  const { requests, isLoading, fetchRequests } = useGarage();
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Historique</h1>
        <button 
          onClick={fetchRequests} 
          disabled={isLoading}
          style={{ background: 'none', border: 'none', color: 'var(--accent-blue-neon)', cursor: isLoading ? 'not-allowed' : 'pointer' }}
        >
          <RefreshCw size={20} className={isLoading ? 'spinning' : ''} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
        </button>
      </div>

      <style>
        {`
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      
      {requests.length === 0 ? (
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Settings size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
          <p>Aucune demande dans l'historique.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {requests.map(req => (
            <div key={req.id} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                    {req.nom_client} - {req.immatriculation}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={14} />
                    {req.createdAt && formatDate(req.createdAt)}
                  </div>
                </div>
                
                <div style={{ 
                  padding: '6px 12px', 
                  borderRadius: '12px', 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: req.status === 'En attente' ? 'rgba(255, 165, 0, 0.2)' : 'rgba(0, 225, 255, 0.2)',
                  color: req.status === 'En attente' ? '#ffa500' : 'var(--accent-blue-neon)'
                }}>
                  {req.status !== 'En attente' && <CheckCircle size={14} />}
                  {req.status}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', margin: '12px 0' }} />

              <div style={{ marginBottom: '8px' }}>
                <strong>Problème : </strong> {req.description_panne}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button 
                  onClick={() => navigate(`/mecanicien/nouvelle/${req.id}`)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Ouvrir Fiche Mécano
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
