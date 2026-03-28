import React from 'react';
import { useGarage } from '../context/GarageContext';
import { Settings, Image as ImageIcon, Calendar, CheckCircle } from 'lucide-react';

const History: React.FC = () => {
  const { requests } = useGarage();

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
      <h1 className="page-title">Historique</h1>
      
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
                    {req.brand} {req.model}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={14} />
                    {formatDate(req.createdAt)}
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
                  backgroundColor: req.status === 'completed' ? 'rgba(0, 225, 255, 0.2)' : 'rgba(255, 165, 0, 0.2)',
                  color: req.status === 'completed' ? 'var(--accent-blue-neon)' : '#ffa500'
                }}>
                  {req.status === 'completed' && <CheckCircle size={14} />}
                  {req.status === 'pending' ? 'En attente' : 'Terminé'}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', margin: '12px 0' }} />

              <div style={{ marginBottom: '8px' }}>
                <strong>Problème : </strong> {req.briefIssue}
              </div>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                {req.isUrgent && (
                  <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(255,0,60,0.1)', color: 'var(--accent-red)', borderRadius: '4px' }}>
                    Urgent
                  </span>
                )}
                {!req.isDriveable && (
                  <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                    Non Roulant
                  </span>
                )}
                {req.pickUpOnSite && (
                  <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(0,225,255,0.1)', color: 'var(--accent-blue-neon)', borderRadius: '4px' }}>
                    À récupérer (Dépanneuse)
                  </span>
                )}
                {req.photoUrl && (
                  <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '4px' }}>
                    <ImageIcon size={12} /> Photo
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
