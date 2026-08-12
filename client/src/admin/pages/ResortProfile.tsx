import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { Building, Upload, CheckCircle2 } from 'lucide-react';

export const ResortProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/website/settings');
      setProfile({
        name: data.resort?.name || '',
        tagline: data.settings?.tagline || '',
        short_description: data.settings?.short_description || '',
        full_description: data.settings?.full_description || '',
        logo_url: data.settings?.logo_url || '',
        favicon_url: data.settings?.favicon_url || ''
      });
    } catch (err) {
      console.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiRequest('/website/profile', { method: 'PUT', body: profile });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-slate-400 font-mono text-xs">Loading resort profile...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Resort Profile & Branding</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage resort name, tagline, descriptions, logos, and favicon.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-8 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 text-slate-100">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Resort Name *</label>
          <input
            type="text"
            required
            value={profile.name}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline</label>
          <input
            type="text"
            placeholder="Exquisite Opulence on the Oceanfront"
            value={profile.tagline}
            onChange={e => setProfile({ ...profile, tagline: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Short Summary Description</label>
          <input
            type="text"
            placeholder="One-line summary for cards..."
            value={profile.short_description}
            onChange={e => setProfile({ ...profile, short_description: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Full Detailed Story Description</label>
          <textarea
            rows={4}
            placeholder="Full resort history, architectural highlights, and philosophy..."
            value={profile.full_description}
            onChange={e => setProfile({ ...profile, full_description: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Logo Image URL</label>
          <input
            type="text"
            placeholder="https://..."
            value={profile.logo_url}
            onChange={e => setProfile({ ...profile, logo_url: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
          />
        </div>

        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow">
          {saving ? 'Saving Profile...' : 'Save Resort Profile'}
        </button>
      </form>
    </div>
  );
};
