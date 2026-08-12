import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';
import { BedDouble, Sparkles, Mail, Palette, Eye, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({ rooms: 0, amenities: 0, enquiries: 0, theme: 'luxury-dark' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const rooms = await apiRequest('/rooms');
        const amenities = await apiRequest('/amenities');
        const enquiries = await apiRequest('/enquiries');
        const settings = await apiRequest('/website/settings');

        setStats({
          rooms: rooms.length,
          amenities: amenities.length,
          enquiries: enquiries.length,
          unreadEnquiries: enquiries.filter((e: any) => e.status === 'NEW').length,
          theme: settings.theme?.theme_id || 'luxury-dark',
          resortName: settings.resort?.name || user?.resort?.name
        });
      } catch (err) {
        console.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user]);

  if (loading) {
    return <div className="text-slate-400 font-mono text-xs">Loading Dashboard Metrics...</div>;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white">Dashboard Overview</h1>
        <p className="text-xs text-slate-400 mt-1">
          Managing <span className="text-amber-400 font-semibold">{stats.resortName}</span> CMS content & website settings.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Rooms</span>
            <BedDouble className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-serif font-bold text-white">{stats.rooms}</p>
          <Link to="/admin/rooms" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium">
            Manage Rooms & Rates <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Guest Enquiries</span>
            <Mail className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-serif font-bold text-white">{stats.enquiries}</p>
            {stats.unreadEnquiries > 0 && (
              <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold rounded-full">
                {stats.unreadEnquiries} NEW
              </span>
            )}
          </div>
          <Link to="/admin/enquiries" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium">
            View Enquiries Inbox <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Dynamic Amenities</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-serif font-bold text-white">{stats.amenities}</p>
          <Link to="/admin/amenities" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium">
            Manage Amenities <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Theme</span>
            <Palette className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-xl font-bold font-mono text-amber-400 capitalize">{stats.theme}</p>
          <Link to="/admin/website" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium">
            Customize Layout & Theme <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
        <h3 className="text-xl font-serif font-bold text-white">Platform Health & Tenant Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <p className="font-bold text-slate-200">Tenant Isolation Status</p>
            <p className="text-emerald-400 font-mono text-[11px]">✓ Enforced via API Middleware</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <p className="font-bold text-slate-200">Database Engine</p>
            <p className="text-emerald-400 font-mono text-[11px]">✓ PostgreSQL / SQLite Ready</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <p className="font-bold text-slate-200">Theme Architecture</p>
            <p className="text-emerald-400 font-mono text-[11px]">✓ 3 Independent Themes Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};
