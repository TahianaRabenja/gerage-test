import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, AlertTriangle, Send, User, Car, MapPin } from 'lucide-react';
import { useGarage } from '../context/GarageContext';

const NewRequest: React.FC = () => {
  const navigate = useNavigate();
  const { addRequest } = useGarage();
  
  const [formData, setFormData] = useState({
    nom_client: '',
    telephone: '',
    email: '',
    immatriculation: '',
    marque: '',
    description_panne: '',
    localisation: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScanVIN = async () => {
    setIsScanning(true);
    setTimeout(() => {
      setFormData(prev => ({ ...prev, immatriculation: 'AB-123-CD' }));
      setIsScanning(false);
      alert('Immatriculation scannée : AB-123-CD');
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom_client || !formData.immatriculation || !formData.description_panne) {
      alert("Veuillez remplir les champs obligatoires (Nom, Immatriculation, Description).");
      return;
    }
    
    setIsSubmitting(true);
    
    // Le payload correspond parfaitement aux "names" de vos champs ERPNext.
    const success = await addRequest({
      nom_client: formData.nom_client,
      telephone: formData.telephone,
      email: formData.email,
      immatriculation: formData.immatriculation,
      marque: formData.marque,
      description_panne: formData.description_panne,
      localisation: formData.localisation
    });
    
    setIsSubmitting(false);

    if (success) {
      navigate('/historique');
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Nouvelle Intervention</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Informations Client */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User className="text-neon-blue" />
            Informations Client
          </h2>
          
          <div className="form-group">
            <label className="label">Nom client <span className="text-neon-red">*</span></label>
            <input 
              type="text" 
              name="nom_client" 
              value={formData.nom_client} 
              onChange={handleInputChange} 
              className="input-field" 
              required
            />
          </div>
          
          <div className="form-group">
            <label className="label">Téléphone</label>
            <input 
              type="tel" 
              name="telephone" 
              value={formData.telephone} 
              onChange={handleInputChange} 
              className="input-field" 
            />
          </div>

          <div className="form-group">
            <label className="label">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              className="input-field" 
            />
          </div>
        </div>

        {/* Vehicule */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Car className="text-neon-blue" />
            Véhicule
          </h2>
          
          <div className="form-group">
            <label className="label">Immatriculation <span className="text-neon-red">*</span></label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                name="immatriculation" 
                value={formData.immatriculation} 
                onChange={handleInputChange} 
                className="input-field" 
                placeholder="Ex: AA-123-BB" 
                required
              />
              <button type="button" onClick={handleScanVIN} className="btn-secondary" style={{ padding: '14px', flexShrink: 0 }}>
                {isScanning ? '...' : <QrCode size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="label">Marque</label>
            <input 
              type="text" 
              name="marque" 
              value={formData.marque} 
              onChange={handleInputChange} 
              className="input-field"  
            />
          </div>
        </div>

        {/* Demande Section */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle className="text-neon-red" />
            Demande
          </h2>
          
          <div className="form-group">
            <label className="label">Description de la panne <span className="text-neon-red">*</span></label>
            <textarea 
              name="description_panne" 
              value={formData.description_panne} 
              onChange={handleInputChange} 
              className="input-field" 
              placeholder="Décrivez précisément ce qui se passe..." 
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Localisation <MapPin size={16} style={{ display: 'inline', marginLeft: '4px' }} /></label>
            <input 
              type="text" 
              name="localisation" 
              value={formData.localisation} 
              onChange={handleInputChange} 
              className="input-field" 
              placeholder="Ex: Parking, Route Nationale, Garage..." 
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '10px' }} disabled={isSubmitting}>
          {isSubmitting ? (
            'Envoi en cours...'
          ) : (
            <>
              <Send size={20} />
              Créer dans ERPNext
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default NewRequest;
