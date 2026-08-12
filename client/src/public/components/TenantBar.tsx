import React from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Sparkles, Building2, Palmtree, LogIn } from 'lucide-react';

export const TenantBar: React.FC = () => {
  const { availableResorts, activeResortSlug, setActiveResortSlug, siteData } = useTenant();
  const { user } = useAuth();

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-200 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-Tenant Demo Switcher:</span>
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {availableResorts.map(resort => {
            const isActive = activeResortSlug === resort.slug;
            return (
              <button
                key={resort.id}
                onClick={() => setActiveResortSlug(resort.slug)}
                className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {resort.theme_id === 'kerala-nature' ? (
                  <Palmtree className="w-3 h-3" />
                ) : resort.theme_id === 'modern-hotel' ? (
                  <Building2 className="w-3 h-3" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                <span>{resort.name}</span>
                <span className="text-[9px] opacity-75 uppercase font-mono">({resort.theme_id || 'luxury-dark'})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <Link
            to="/admin"
            className="px-3 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 rounded-md font-semibold text-[11px] flex items-center gap-1.5 transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin Dashboard ({user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.resort?.name || 'Resort Admin'})</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-[11px] flex items-center gap-1.5 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Admin Login</span>
          </Link>
        )}
      </div>
    </div>
  );
};
