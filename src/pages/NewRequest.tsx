import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, QrCode, AlertTriangle, Send, Video, Car, Navigation } from 'lucide-react';
import { useGarage } from '../context/GarageContext';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';

const NewRequest: React.FC = () => {
  const navigate = useNavigate();
  const { addRequest } = useGarage();
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    vin: '',
    briefIssue: '',
    detailedIssue: '',
    isUrgent: false,
    isDriveable: true,
    pickUpOnSite: false,
    photoUrl: '',
  });

  const [isScanning, setIsScanning] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleToggle = (field: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleScanVIN = async () => {
    // Simulate a barcode scanner delay for mockup
    setIsScanning(true);
    setTimeout(() => {
      setFormData(prev => ({ ...prev, vin: 'VF123456789XYZ000' }));
      setIsScanning(false);
      alert('VIN scanné avec succès : VF123456789XYZ000');
    }, 1500);
  };

  const handleTakePicture = async () => {
    try {
      const image = await CapCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      if (image.webPath) {
        setFormData(prev => ({ ...prev, photoUrl: image.webPath! }));
      }
    } catch (e) {
      console.warn("Camera not available / cancelled", e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brand || !formData.model || !formData.briefIssue) {
      alert("Veuillez remplir les champs obligatoires.");
      return;
    }
    
    addRequest({
      brand: formData.brand,
      model: formData.model,
      vin: formData.vin,
      briefIssue: formData.briefIssue,
      detailedIssue: formData.detailedIssue,
      isUrgent: formData.isUrgent,
      isDriveable: formData.isDriveable,
      pickUpOnSite: formData.pickUpOnSite,
      photoUrl: formData.photoUrl
    });
    
    navigate('/historique');
  };

  return (
    <div className="container">
      <h1 className="page-title">Nouvelle Intervention</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Vehicule Section */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Car className="text-neon-blue" />
            Identification du Véhicule
          </h2>
          
          <div className="form-group">
            <label className="label">Marque</label>
            <select name="brand" value={formData.brand} onChange={handleInputChange} className="input-field">
              <option value="">Sélectionner une marque...</option>
              <option value="Renault">Renault</option>
              <option value="Peugeot">Peugeot</option>
              <option value="Citroën">Citroën</option>
              <option value="Volkswagen">Volkswagen</option>
              <option value="Audi">Audi</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="label">Modèle</label>
            <input 
              type="text" 
              name="model" 
              value={formData.model} 
              onChange={handleInputChange} 
              className="input-field" 
              placeholder="Ex: Clio IV, Golf 7..." 
            />
          </div>

          <div className="form-group">
            <label className="label">Numéro de VIN (Châssis)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                name="vin" 
                value={formData.vin} 
                onChange={handleInputChange} 
                className="input-field" 
                placeholder="Scanner ou taper le VIN" 
              />
              <button type="button" onClick={handleScanVIN} className="btn-secondary" style={{ padding: '14px', flexShrink: 0 }}>
                {isScanning ? '...' : <QrCode size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Problem Section */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle className="text-neon-red" />
            Description du Problème
          </h2>
          
          <div className="form-group">
            <label className="label">Résumé court (requis)</label>
            <input 
              type="text" 
              name="briefIssue" 
              value={formData.briefIssue} 
              onChange={handleInputChange} 
              className="input-field" 
              placeholder="Ex: Bruit moteur, Voyant allumé..." 
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Description détaillée</label>
            <textarea 
              name="detailedIssue" 
              value={formData.detailedIssue} 
              onChange={handleInputChange} 
              className="input-field" 
              placeholder="Décrivez précisément ce qui se passe..." 
            />
          </div>

          <div className="form-group">
            <label className="label">Médias (Photos/Vidéos)</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={handleTakePicture} className="btn-secondary" style={{ flex: 1 }}>
                <Camera size={20} /> Photo
              </button>
              <button type="button" className="btn-secondary" style={{ flex: 1, opacity: 0.5, cursor: 'not-allowed' }}>
                <Video size={20} /> Vidéo
              </button>
            </div>
            {formData.photoUrl && (
              <div style={{ marginTop: '12px' }}>
                <img src={formData.photoUrl} alt="Capture" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--accent-blue-neon)' }} />
              </div>
            )}
          </div>
        </div>

        {/* Logistics Section */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation className="text-neon-blue" />
            Logistique
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Toggle Urgent */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-card)', borderRadius: '8px', border: formData.isUrgent ? '1px solid var(--accent-neon)' : '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color={formData.isUrgent ? 'var(--accent-red)' : 'currentColor'} />
                <span style={{ fontWeight: 500 }}>Demande Urgente</span>
              </div>
              <div 
                onClick={() => handleToggle('isUrgent')}
                style={{ width: '48px', height: '24px', background: formData.isUrgent ? 'var(--accent-red)' : 'rgba(255,255,255,0.1)', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                <div style={{ position: 'absolute', top: '2px', left: formData.isUrgent ? '26px' : '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: 'all 0.3s' }} />
              </div>
            </div>

            {/* Toggle Roulant */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-card)', borderRadius: '8px' }}>
              <span style={{ fontWeight: 500 }}>Véhicule Roulant ?</span>
              <div 
                onClick={() => handleToggle('isDriveable')}
                style={{ width: '48px', height: '24px', background: formData.isDriveable ? 'var(--accent-blue-neon)' : 'rgba(255,255,255,0.1)', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                <div style={{ position: 'absolute', top: '2px', left: formData.isDriveable ? '26px' : '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: 'all 0.3s' }} />
              </div>
            </div>

            {/* Toggle Pick Up */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-card)', borderRadius: '8px' }}>
              <span style={{ fontWeight: 500 }}>Récupérer sur place (Dépanneuse)</span>
              <div 
                onClick={() => handleToggle('pickUpOnSite')}
                style={{ width: '48px', height: '24px', background: formData.pickUpOnSite ? 'var(--accent-blue)' : 'rgba(255,255,255,0.1)', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                <div style={{ position: 'absolute', top: '2px', left: formData.pickUpOnSite ? '26px' : '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: 'all 0.3s' }} />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
          <Send size={20} />
          Envoyer la demande
        </button>

      </form>
    </div>
  );
};

export default NewRequest;
