import React, { createContext, useContext, useState, useEffect } from 'react';
import { PublicSiteData, Resort } from '../types';
import { apiRequest } from '../services/api';

interface TenantContextType {
  siteData: PublicSiteData | null;
  loading: boolean;
  error: string | null;
  availableResorts: Resort[];
  activeResortSlug: string;
  setActiveResortSlug: (slug: string) => void;
  refreshSiteData: () => Promise<void>;
  selectedRoomForBooking: any | null;
  setSelectedRoomForBooking: (room: any | null) => void;
  isEnquiryModalOpen: boolean;
  setIsEnquiryModalOpen: (open: boolean) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteData, setSiteData] = useState<PublicSiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableResorts, setAvailableResorts] = useState<Resort[]>([]);
  const [activeResortSlug, setActiveResortSlug] = useState<string>('lexur-green');
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<any | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  // Fetch available resorts for dev switcher
  useEffect(() => {
    async function loadResorts() {
      try {
        const resorts = await apiRequest<Resort[]>('/public/resorts');
        setAvailableResorts(resorts);
      } catch (err) {
        console.error('Failed to load available resorts');
      }
    }
    loadResorts();
  }, []);

  // Fetch site data whenever activeResortSlug changes
  const fetchSite = async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<PublicSiteData>(`/public/site?resort=${slug}`);
      setSiteData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load resort website');
      setSiteData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSite(activeResortSlug);
  }, [activeResortSlug]);

  const refreshSiteData = async () => {
    await fetchSite(activeResortSlug);
  };

  return (
    <TenantContext.Provider
      value={{
        siteData,
        loading,
        error,
        availableResorts,
        activeResortSlug,
        setActiveResortSlug,
        refreshSiteData,
        selectedRoomForBooking,
        setSelectedRoomForBooking,
        isEnquiryModalOpen,
        setIsEnquiryModalOpen,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) throw new Error('useTenant must be used within TenantProvider');
  return context;
};
