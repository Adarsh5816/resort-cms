import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { ThemeSettings, HomepageSection, WebsiteSettings, ContactInformation } from '../../types';
import { Palette, Layers, Search, Phone, ArrowUp, ArrowDown, Eye, CheckCircle2 } from 'lucide-react';

export const WebsiteCustomizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'theme' | 'sections' | 'seo' | 'contact'>('theme');
  const [loading, setLoading] = useState(true);

  const [theme, setTheme] = useState<ThemeSettings>({ theme_id: 'luxury-dark' });
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [seo, setSeo] = useState<Partial<WebsiteSettings>>({});
  const [contact, setContact] = useState<Partial<ContactInformation>>({});

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/website/settings');
      setTheme(data.theme || { theme_id: 'luxury-dark' });
      setSections(data.sections || []);
      setSeo(data.settings || {});
      setContact(data.contact || {});
    } catch (err) {
      console.error('Failed to load website customization settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveTheme = async (selectedThemeId: string) => {
    setSaving(true);
    try {
      await apiRequest('/website/theme', {
        method: 'PUT',
        body: { theme_id: selectedThemeId }
      });
      setTheme(prev => ({ ...prev, theme_id: selectedThemeId }));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update theme');
    } finally {
      setSaving(false);
    }
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const updated = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;

    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Recalculate display_order
    const reordered = updated.map((sec, idx) => ({ ...sec, display_order: idx + 1 }));
    setSections(reordered);
  };

  const handleToggleSection = (index: number) => {
    const updated = [...sections];
    updated[index].is_enabled = updated[index].is_enabled ? 0 : 1;
    setSections(updated);
  };

  const handleSaveSections = async () => {
    setSaving(true);
    try {
      await apiRequest('/website/sections', {
        method: 'PUT',
        body: { sections }
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save section order');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiRequest('/website/seo', { method: 'PUT', body: seo });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save SEO settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiRequest('/website/contact', { method: 'PUT', body: contact });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save contact info');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-slate-400 font-mono text-xs">Loading website builder...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Website & Theme Customizer</h1>
          <p className="text-xs text-slate-400 mt-1">
            Choose visual themes, reorder homepage sections, edit SEO tags and WhatsApp contact details.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Changes Saved Live!</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('theme')}
          className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'theme' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Visual Themes</span>
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'sections' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Section Builder</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'seo' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>SEO Metadata</span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'contact' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>WhatsApp & Contact</span>
        </button>
      </div>

      {/* TAB 1: VISUAL THEMES */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Select Resort Theme</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* THEME 1: LUXURY DARK */}
            <div
              onClick={() => handleSaveTheme('luxury-dark')}
              className={`cursor-pointer rounded-2xl p-6 border-2 transition-all flex flex-col justify-between space-y-4 ${
                theme.theme_id === 'luxury-dark'
                  ? 'border-amber-500 bg-slate-900 shadow-2xl'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="h-28 bg-slate-950 border border-amber-500/30 rounded-xl p-3 flex flex-col justify-between">
                  <span className="text-[10px] font-serif text-amber-400">Playfair Display</span>
                  <p className="text-xs font-serif font-bold text-white">Luxury Oceanside Haven</p>
                  <div className="w-full h-2 bg-gradient-to-r from-amber-500 to-amber-700 rounded" />
                </div>
                <h4 className="text-base font-serif font-bold text-white">THEME 1 — Luxury Modern</h4>
                <p className="text-xs text-slate-400">
                  Dark midnight navy, gold accents, full-screen hero, serif typography, spacious photography emphasis.
                </p>
              </div>
              <button className={`w-full py-2 rounded-lg text-xs font-bold ${
                theme.theme_id === 'luxury-dark' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}>
                {theme.theme_id === 'luxury-dark' ? '✓ Currently Active Theme' : 'Apply Luxury Theme'}
              </button>
            </div>

            {/* THEME 2: KERALA NATURE */}
            <div
              onClick={() => handleSaveTheme('kerala-nature')}
              className={`cursor-pointer rounded-2xl p-6 border-2 transition-all flex flex-col justify-between space-y-4 ${
                theme.theme_id === 'kerala-nature'
                  ? 'border-amber-500 bg-slate-900 shadow-2xl'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="h-28 bg-[#F7F3E9] border border-amber-800/20 rounded-xl p-3 flex flex-col justify-between text-stone-900">
                  <span className="text-[10px] font-serif text-amber-800 italic">Merriweather</span>
                  <p className="text-xs font-serif font-bold text-amber-950">Heritage Spice Retreat</p>
                  <div className="w-full h-2 bg-amber-800 rounded" />
                </div>
                <h4 className="text-base font-serif font-bold text-white">THEME 2 — Kerala Nature</h4>
                <p className="text-xs text-slate-400">
                  Warm terracotta red, emerald green, warm sand background, traditional arch accents, storytelling layout.
                </p>
              </div>
              <button className={`w-full py-2 rounded-lg text-xs font-bold ${
                theme.theme_id === 'kerala-nature' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}>
                {theme.theme_id === 'kerala-nature' ? '✓ Currently Active Theme' : 'Apply Kerala Nature Theme'}
              </button>
            </div>

            {/* THEME 3: MODERN HOTEL */}
            <div
              onClick={() => handleSaveTheme('modern-hotel')}
              className={`cursor-pointer rounded-2xl p-6 border-2 transition-all flex flex-col justify-between space-y-4 ${
                theme.theme_id === 'modern-hotel'
                  ? 'border-amber-500 bg-slate-900 shadow-2xl'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="h-28 bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between text-gray-900">
                  <span className="text-[10px] font-sans font-bold text-blue-600">Plus Jakarta Sans</span>
                  <p className="text-xs font-bold text-slate-900">MetroStar City & Beach</p>
                  <div className="w-full h-2 bg-blue-600 rounded" />
                </div>
                <h4 className="text-base font-bold text-white">THEME 3 — Modern Hotel</h4>
                <p className="text-xs text-slate-400">
                  Clean bright modern UI, royal blue accents, compact room cards grid, prominent CTA buttons.
                </p>
              </div>
              <button className={`w-full py-2 rounded-lg text-xs font-bold ${
                theme.theme_id === 'modern-hotel' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}>
                {theme.theme_id === 'modern-hotel' ? '✓ Currently Active Theme' : 'Apply Modern Hotel Theme'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SECTION BUILDER */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Homepage Section Ordering & Visibility</h3>
            <button
              onClick={handleSaveSections}
              disabled={saving}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow"
            >
              {saving ? 'Saving...' : 'Save Section Order'}
            </button>
          </div>

          <div className="space-y-3">
            {sections.map((sec, idx) => (
              <div
                key={sec.id || sec.section_key}
                className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <span className="w-7 h-7 bg-slate-950 text-amber-400 border border-slate-800 rounded-lg flex items-center justify-center font-mono text-xs font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white capitalize">{sec.section_key} Section</h4>
                    <p className="text-xs text-slate-400">{sec.title || sec.section_key}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={!!sec.is_enabled}
                      onChange={() => handleToggleSection(idx)}
                      className="w-4 h-4 text-amber-500 rounded bg-slate-950 border-slate-800"
                    />
                    <span>{sec.is_enabled ? 'Visible' : 'Hidden'}</span>
                  </label>

                  <div className="flex items-center gap-1 border-l border-slate-800 pl-3">
                    <button
                      onClick={() => handleMoveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveSection(idx, 'down')}
                      disabled={idx === sections.length - 1}
                      className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SEO METADATA */}
      {activeTab === 'seo' && (
        <form onSubmit={handleSaveSeo} className="p-8 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Search Engine Optimization (SEO)</h3>
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Title Tag</label>
            <input
              type="text"
              placeholder="Resort Name | 5-Star Luxury Resort"
              value={seo.meta_title || ''}
              onChange={e => setSeo({ ...seo, meta_title: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Description</label>
            <textarea
              rows={3}
              placeholder="Book your stay at our luxury resort..."
              value={seo.meta_description || ''}
              onChange={e => setSeo({ ...seo, meta_description: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Keywords</label>
            <input
              type="text"
              placeholder="luxury resort, ocean view villa, hotel booking"
              value={seo.keywords || ''}
              onChange={e => setSeo({ ...seo, keywords: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
            />
          </div>

          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow">
            {saving ? 'Saving SEO...' : 'Save SEO Settings'}
          </button>
        </form>
      )}

      {/* TAB 4: CONTACT & WHATSAPP */}
      {activeTab === 'contact' && (
        <form onSubmit={handleSaveContact} className="p-8 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Contact & WhatsApp CTA Config</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={contact.phone || ''}
                onChange={e => setContact({ ...contact, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Number (e.g. 919847012345)</label>
              <input
                type="text"
                value={contact.whatsapp_number || ''}
                onChange={e => setContact({ ...contact, whatsapp_number: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Concierge Email</label>
            <input
              type="email"
              value={contact.email || ''}
              onChange={e => setContact({ ...contact, email: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Physical Address</label>
            <textarea
              rows={2}
              value={contact.address || ''}
              onChange={e => setContact({ ...contact, address: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
            />
          </div>

          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow">
            {saving ? 'Saving Details...' : 'Save Contact Details'}
          </button>
        </form>
      )}
    </div>
  );
};
