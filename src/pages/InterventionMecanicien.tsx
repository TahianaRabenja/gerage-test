import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGarage } from '../context/GarageContext';
import { Wrench, CheckCircle, ArrowLeft } from 'lucide-react';

const InterventionMecanicien: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addMechanicIntervention } = useGarage();

  const [statut, setStatut] = useState('Nouveau');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status list built from user screenshot
  const options = [
    'Nouveau',
    'En attente diagnostic',
    'Diagnostic terminé',
    'En attente validation client',
    'En cours',
    'En attente pièces',
    'Terminé',
    'Véhicule prêt',
    'Clôturé'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSubmitting(true);
    
    const success = await addMechanicIntervention(id, statut);
    setIsSubmitting(false);

    if (success) {
      alert("Fiche d'intervention mécanicien créée avec succès !");
      navigate('/historique'); // Return to history list
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '12px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="page-title" style={{ margin: 0 }}>Fiche Mécanicien</h1>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench className="text-neon-blue" />
            Création Fiche Intervention
          </h2>
          
          <div className="form-group">
            <label className="label">ID de la demande client liée (Réf Frappe)</label>
            <input 
              type="text" 
              value={id || ''} 
              disabled 
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '1rem',
                cursor: 'not-allowed'
              }} 
            />
            <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
              Cette intervention mécanicien sera automatiquement rattachée à cette demande.
            </small>
          </div>
          
          <div className="form-group">
            <label className="label">Statut initial des travaux <span className="text-neon-red">*</span></label>
            <div style={{ position: 'relative' }}>
              <select 
                value={statut} 
                onChange={(e) => setStatut(e.target.value)} 
                className="input-field" 
                required
                style={{ appearance: 'auto', paddingRight: '40px' }}
              >
                {options.map((opt) => (
                  <option key={opt} value={opt} style={{ color: '#000' }}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '10px' }} disabled={isSubmitting}>
          {isSubmitting ? (
            'Création en cours...'
          ) : (
            <>
              <CheckCircle size={20} />
              Enregistrer l'Intervention
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default InterventionMecanicien;
