import React, { useState, useEffect } from 'react';
import { apiRequest, uploadFile } from '../../services/api';
import { Building, Upload, CheckCircle2, Image, Link2 } from 'lucide-react';

export const ResortProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const res = await uploadFile(file);
      setProfile((prev: any) => ({ ...prev, [field]: res.url }));
    } catch (err: any) {
      alert(err.message || 'File upload failed');
    } finally {
      setUploadingLogo(false);
    }
  };

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

      <form onSubmit={handleSubmit} className="p-8 bg-slate-900 border border-slate-800 rounded-2xl space-y-6 text-slate-100 shadow-2xl">
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
            placeholder="3BHK Private Villa near Forest Border"
            value={profile.tagline}
            onChange={e => setProfile({ ...profile, tagline: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
          />
        </div>

        <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Resort Logo & Emblem</h4>
              <p className="text-[11px] text-slate-400">Upload your logo image directly or enter image URL</p>
            </div>
            {profile.logo_url && (
              <div className="h-12 w-12 rounded-lg bg-slate-900 border border-slate-800 p-1 flex items-center justify-center">
                <img src={profile.logo_url} alt="Logo Preview" className="h-full w-auto object-contain" />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="https://... or uploaded image URL"
                value={profile.logo_url}
                onChange={e => setProfile({ ...profile, logo_url: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
              />
            </div>

            <label className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-colors shrink-0">
              <Upload className="w-4 h-4" />
              <span>{uploadingLogo ? 'Uploading...' : 'Upload Logo File'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => handleFileUpload(e, 'logo_url')}
                disabled={uploadingLogo}
              />
            </label>
          </div>
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

        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg font-sans uppercase tracking-wider">
          {saving ? 'Saving Profile...' : 'Save Resort Profile & Logo'}
        </button>
      </form>
    </div>
  );
};

export default ResortProfile;
