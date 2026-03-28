import React, { createContext, useContext, useState, useEffect } from 'react';

export interface InterventionRequest {
  id: string;
  brand: string;
  model: string;
  vin: string;
  briefIssue: string;
  detailedIssue: string;
  isUrgent: boolean;
  isDriveable: boolean;
  pickUpOnSite: boolean;
  photoUrl?: string;
  videoUrl?: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
}

interface GarageContextType {
  requests: InterventionRequest[];
  addRequest: (req: Omit<InterventionRequest, 'id' | 'status' | 'createdAt'>) => void;
  updateRequestStatus: (id: string, status: InterventionRequest['status']) => void;
}

const GarageContext = createContext<GarageContextType | undefined>(undefined);

export const GarageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<InterventionRequest[]>([]);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('garage_requests');
    if (saved) {
      try {
        setRequests(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local requests", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('garage_requests', JSON.stringify(requests));
  }, [requests]);

  const addRequest = (req: Omit<InterventionRequest, 'id' | 'status' | 'createdAt'>) => {
    const newRequest: InterventionRequest = {
      ...req,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setRequests(prev => [newRequest, ...prev]);
  };

  const updateRequestStatus = (id: string, status: InterventionRequest['status']) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <GarageContext.Provider value={{ requests, addRequest, updateRequestStatus }}>
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
