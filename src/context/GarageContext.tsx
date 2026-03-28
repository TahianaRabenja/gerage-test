import React, { createContext, useContext, useState, useEffect } from 'react';

export interface InterventionRequest {
  id?: string;
  nom_client: string;
  telephone: string;
  email: string;
  immatriculation: string;
  marque: string;
  description_panne: string;
  localisation: string;
  status?: string;
  createdAt?: string;

  // Optionnel: Champs locaux/legacy si vous voulez les garder en application 
  // (ne seront pas envoyés au serveur s'ils n'existent pas dans le Doctype Frappe)
  isUrgent?: boolean;
  isDriveable?: boolean;
  pickUpOnSite?: boolean;
}

interface GarageContextType {
  requests: InterventionRequest[];
  addRequest: (req: Omit<InterventionRequest, 'id' | 'status' | 'createdAt'>) => Promise<boolean>;
  updateRequestStatus: (id: string, status: string) => void;
  fetchRequests: () => Promise<void>;
  isLoading: boolean;
}

const GarageContext = createContext<GarageContextType | undefined>(undefined);

export const GarageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<InterventionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch History from Frappe
  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const API_KEY = import.meta.env.VITE_API_KEY || import.meta.env.API_KEY;
      const API_SECRET = import.meta.env.VITE_API_SECRET || import.meta.env.API_SECRET;

      // Requêter Frappe. On demande explicitement les champs nécessaires via limit_page_length et fields
      const params = new URLSearchParams({
        fields: '["name","nom_client","immatriculation","description_panne","creation","docstatus","telephone","email","localisation","marque"]',
        limit_page_length: '50',
        order_by: 'creation desc'
      });

      const response = await fetch(`/api/resource/Demande Intervention Vehicule?${params.toString()}`, {
        method: 'GET',
        credentials: 'omit',
        headers: {
          'Accept': 'application/json',
          'Authorization': `token ${API_KEY}:${API_SECRET}`
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        const apiRequests: InterventionRequest[] = responseData.data.map((doc: any) => ({
          id: doc.name,
          nom_client: doc.nom_client,
          telephone: doc.telephone || '',
          email: doc.email || '',
          immatriculation: doc.immatriculation,
          marque: doc.marque || '',
          description_panne: doc.description_panne,
          localisation: doc.localisation || '',
          status: doc.docstatus === 0 ? 'Brouillon' : (doc.docstatus === 1 ? 'Validé' : 'Annulé'),
          createdAt: doc.creation
        }));
        setRequests(apiRequests);
      } else {
        console.error('Erreur lors de la récupération des demandes', await response.text());
      }
    } catch (e) {
      console.error("Erreur réseau fetchRequests:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger depuis LocalStorage et appeler l'API au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('garage_requests');
    if (saved) {
      try {
        setRequests(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local requests", e);
      }
    }
    fetchRequests();
  }, []);

  // Sauvegarder dans LocalStorage pour la persistance locale offline
  useEffect(() => {
    localStorage.setItem('garage_requests', JSON.stringify(requests));
  }, [requests]);

  const addRequest = async (req: Omit<InterventionRequest, 'id' | 'status' | 'createdAt'>): Promise<boolean> => {
    try {
      const API_KEY = import.meta.env.VITE_API_KEY || import.meta.env.API_KEY;
      const API_SECRET = import.meta.env.VITE_API_SECRET || import.meta.env.API_SECRET;

      console.log('Sending to Frappe Backend...', req);

      const response = await fetch('/api/resource/Demande%20Intervention%20Vehicule', {
        method: 'POST',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `token ${API_KEY}:${API_SECRET}`
        },
        body: JSON.stringify(req)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur serveur API:", errorData);
        throw new Error(errorData.exc_type || 'Erreur lors de la création de la demande');
      }

      const responseData = await response.json();

      // Stocker localement avec les ID du serveur Frappe
      const newRequest: InterventionRequest = {
        ...req,
        id: responseData.data.name,
        status: responseData.data.docstatus === 0 ? 'En attente' : 'Autre',
        createdAt: responseData.data.creation || new Date().toISOString()
      };

      setRequests(prev => [newRequest, ...prev]);
      return true;

    } catch (error) {
      console.error("Erreur addRequest:", error);
      alert("Une erreur de connexion au serveur s'est produite. Vérifiez vos identifiants ou l'URL du serveur.");
      return false;
    }
  };

  const updateRequestStatus = (id: string, status: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <GarageContext.Provider value={{ requests, addRequest, updateRequestStatus, fetchRequests, isLoading }}>
      {children}
    </GarageContext.Provider>
  );
};

export const useGarage = () => {
  const context = useContext(GarageContext);
  if (!context) {
    throw new Error('useGarage must be used within a GarageProvider');
  }
  return context;
};
