import React from 'react';
import { useTenant } from '../../context/TenantContext';
import { LuxuryDarkTheme } from '../themes/LuxuryDarkTheme';
import { KeralaNatureTheme } from '../themes/KeralaNatureTheme';
import { ModernHotelTheme } from '../themes/ModernHotelTheme';
import { LexurForestTheme } from '../themes/LexurForestTheme';

export const SectionRenderer: React.FC = () => {
  const { siteData, loading, error } = useTenant();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071F13] flex items-center justify-center text-emerald-400">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif italic text-sm text-emerald-200">Loading Lexur Green Serviced Villa...</p>
        </div>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-200">
        <div className="max-w-md text-center bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-4">
          <h2 className="text-2xl font-serif font-bold text-rose-400">Resort Not Found</h2>
          <p className="text-xs text-slate-400">{error || 'The requested resort website could not be found or has been deactivated.'}</p>
        </div>
      </div>
    );
  }

  const themeId = siteData.theme?.theme_id || 'lexur-forest';
  const slug = siteData.resort?.slug;

  if (themeId === 'lexur-forest' || slug === 'lexur-green') {
    return <LexurForestTheme data={siteData} />;
  }

  switch (themeId) {
    case 'kerala-nature':
      return <KeralaNatureTheme data={siteData} />;
    case 'modern-hotel':
      return <ModernHotelTheme data={siteData} />;
    case 'luxury-dark':
    default:
      return <LuxuryDarkTheme data={siteData} />;
  }
};

