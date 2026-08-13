import React, { useState, useEffect } from 'react';
import { apiRequest, uploadFile, getFullImageUrl } from '../../services/api';
import { Building, Upload, CheckCircle2, Image as ImageIcon, Link2 } from 'lucide-react';

export const ResortProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
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
        favicon_url: data.settings?.favicon_url || '',
        hero_image_url: data.settings?.hero_image_url || '',
        about_image_url: data.settings?.about_image_url || ''
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

    setUploadingField(field);
    try {
      const res = await uploadFile(file);
      setProfile((prev: any) => ({ ...prev, [field]: res.url }));
    } catch (err: any) {
      alert(err.message || 'File upload failed');
    } finally {
      setUploadingField(null);
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
          <h1 className="text-3xl font-serif font-bold text-white">Resort Profile & Villa Images</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage resort name, tagline, logo, main Villa background photo, and about section images.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile & Images Saved!</span>
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

        {/* LOGO UPLOAD BOX */}
        <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">1. Resort Emblem Logo</h4>
              <p className="text-[11px] text-slate-400">Upload your logo image directly for top header & footer</p>
            </div>
            {profile.logo_url && (
              <div className="h-12 w-12 rounded-lg bg-slate-900 border border-slate-800 p-1 flex items-center justify-center">
                <img src={getFullImageUrl(profile.logo_url)} alt="Logo Preview" className="h-full w-auto object-contain" />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <input
              type="text"
              placeholder="https://... or uploaded image URL"
              value={profile.logo_url}
              onChange={e => setProfile({ ...profile, logo_url: e.target.value })}
              className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
            />
            <label className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-colors shrink-0">
              <Upload className="w-4 h-4" />
              <span>{uploadingField === 'logo_url' ? 'Uploading...' : 'Upload Logo File'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => handleFileUpload(e, 'logo_url')}
                disabled={uploadingField === 'logo_url'}
              />
            </label>
          </div>
        </div>

        {/* HERO VILLA BACKGROUND IMAGE UPLOAD BOX */}
        <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">2. Main Villa Hero Background Image</h4>
              <p className="text-[11px] text-slate-400">Upload full exterior villa photo for top hero background banner</p>
            </div>
            {profile.hero_image_url && (
              <div className="h-14 w-24 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
                <img src={getFullImageUrl(profile.hero_image_url)} alt="Hero Background Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <input
              type="text"
              placeholder="Hero background photo URL..."
              value={profile.hero_image_url}
              onChange={e => setProfile({ ...profile, hero_image_url: e.target.value })}
              className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
            />
            <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-colors shrink-0">
              <Upload className="w-4 h-4" />
              <span>{uploadingField === 'hero_image_url' ? 'Uploading...' : 'Upload Villa Hero Image'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => handleFileUpload(e, 'hero_image_url')}
                disabled={uploadingField === 'hero_image_url'}
              />
            </label>
          </div>
        </div>

        {/* ABOUT SECTION VILLA IMAGE UPLOAD BOX */}
        <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">3. About Section ("Nature at Your Doorstep") Villa Photo</h4>
              <p className="text-[11px] text-slate-400">Upload high quality villa or garden photo displayed in the About section</p>
            </div>
            {profile.about_image_url && (
              <div className="h-14 w-24 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
                <img src={getFullImageUrl(profile.about_image_url)} alt="About Section Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <input
              type="text"
              placeholder="About section photo URL..."
              value={profile.about_image_url}
              onChange={e => setProfile({ ...profile, about_image_url: e.target.value })}
              className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
            />
            <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-colors shrink-0">
              <Upload className="w-4 h-4" />
              <span>{uploadingField === 'about_image_url' ? 'Uploading...' : 'Upload About Villa Image'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => handleFileUpload(e, 'about_image_url')}
                disabled={uploadingField === 'about_image_url'}
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
          {saving ? 'Saving Profile...' : 'Save Resort Profile & All Images'}
        </button>
      </form>
    </div>
  );
};

export default ResortProfile;
