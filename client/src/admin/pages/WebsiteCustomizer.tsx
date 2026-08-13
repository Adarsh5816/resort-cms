import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { ThemeSettings, HomepageSection, WebsiteSettings, ContactInformation } from '../../types';
import { Palette, Layers, Search, Phone, ArrowUp, ArrowDown, Eye, CheckCircle2, Code2, Sliders, Sparkles } from 'lucide-react';

export const WebsiteCustomizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'theme' | 'sections' | 'seo' | 'contact' | 'code'>('theme');
  const [loading, setLoading] = useState(true);

  const [theme, setTheme] = useState<ThemeSettings>({ theme_id: 'lexur-forest', hero_overlay_opacity: 0.65 });
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [seo, setSeo] = useState<Partial<WebsiteSettings>>({});
  const [contact, setContact] = useState<Partial<ContactInformation>>({});

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/website/settings');
      setTheme(data.theme || { theme_id: 'lexur-forest', hero_overlay_opacity: 0.65 });
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

  const handleSaveTheme = async (selectedThemeId?: string, overrideOpacity?: number) => {
    setSaving(true);
    const targetThemeId = selectedThemeId || theme.theme_id;
    const targetOpacity = overrideOpacity !== undefined ? overrideOpacity : (theme.hero_overlay_opacity || 0.65);
    try {
      await apiRequest('/website/theme', {
        method: 'PUT',
        body: {
          ...theme,
          theme_id: targetThemeId,
          hero_overlay_opacity: targetOpacity
        }
      });
      setTheme(prev => ({ ...prev, theme_id: targetThemeId, hero_overlay_opacity: targetOpacity }));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update theme');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCustomCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiRequest('/website/theme', {
        method: 'PUT',
        body: theme
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save custom code');
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
          <h1 className="text-3xl font-serif font-bold text-white">Website & Theme Studio</h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual themes, green opacity controls, homepage builder, and live custom CSS/JS code studio.
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
      <div className="flex border-b border-slate-800 text-xs font-bold uppercase tracking-wider overflow-x-auto">
        <button
          onClick={() => setActiveTab('theme')}
          className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'theme' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Visual Themes & Opacity</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'code' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span>Front-End Code & CSS Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'sections' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Section Builder</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'seo' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>SEO Metadata</span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'contact' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>WhatsApp & Contact</span>
        </button>
      </div>

      {/* TAB 1: VISUAL THEMES & OPACITY */}
      {activeTab === 'theme' && (
        <div className="space-y-8">
          {/* GREEN OPACITY & OVERLAY INTENSITY SLIDER */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4" />
                  <span>Landing Page Green Color Intensity & Opacity</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adjust how deep/opaque the forest green overlay is over your villa background photo.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-950 text-emerald-300 font-mono text-xs font-bold border border-emerald-800 rounded-lg">
                {Math.round((theme.hero_overlay_opacity || 0.65) * 100)}% Opaque
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={theme.hero_overlay_opacity || 0.65}
                onChange={e => setTheme({ ...theme, hero_overlay_opacity: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>10% (Light Green Tint)</span>
                <span>50% (Balanced Forest)</span>
                <span>85% (Deep Opaque Emerald)</span>
                <span>100% (Solid Dark Green)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleSaveTheme(theme.theme_id, theme.hero_overlay_opacity)}
                disabled={saving}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                {saving ? 'Saving Opacity...' : 'Apply Green Intensity'}
              </button>
            </div>
          </div>

          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Select Resort Theme</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* THEME 0: LEXUR FOREST */}
            <div
              onClick={() => handleSaveTheme('lexur-forest')}
              className={`cursor-pointer rounded-2xl p-6 border-2 transition-all flex flex-col justify-between space-y-4 ${
                theme.theme_id === 'lexur-forest'
                  ? 'border-emerald-500 bg-slate-900 shadow-2xl'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="h-28 bg-[#071F13] border border-emerald-700/40 rounded-xl p-3 flex flex-col justify-between text-white">
                  <span className="text-[10px] font-serif text-emerald-300">Merriweather</span>
                  <p className="text-xs font-serif font-bold text-emerald-100">Lexur Green Serviced Villa</p>
                  <div className="w-full h-2 bg-emerald-600 rounded" />
                </div>
                <h4 className="text-base font-serif font-bold text-white">Lexur Forest Theme</h4>
                <p className="text-xs text-slate-400">
                  Deep forest emerald (`#071F13`), deer emblem, night safari highlight badges, OTA direct booking.
                </p>
              </div>
              <button className={`w-full py-2 rounded-lg text-xs font-bold ${
                theme.theme_id === 'lexur-forest' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}>
                {theme.theme_id === 'lexur-forest' ? '✓ Currently Active' : 'Apply Lexur Forest'}
              </button>
            </div>

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
                <h4 className="text-base font-serif font-bold text-white">Luxury Modern</h4>
                <p className="text-xs text-slate-400">
                  Dark midnight navy, gold accents, full-screen hero, serif typography.
                </p>
              </div>
              <button className={`w-full py-2 rounded-lg text-xs font-bold ${
                theme.theme_id === 'luxury-dark' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}>
                {theme.theme_id === 'luxury-dark' ? '✓ Currently Active' : 'Apply Luxury'}
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
                <h4 className="text-base font-serif font-bold text-white">Kerala Nature</h4>
                <p className="text-xs text-slate-400">
                  Warm terracotta red, emerald green, warm sand background.
                </p>
              </div>
              <button className={`w-full py-2 rounded-lg text-xs font-bold ${
                theme.theme_id === 'kerala-nature' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}>
                {theme.theme_id === 'kerala-nature' ? '✓ Currently Active' : 'Apply Kerala Nature'}
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
                <h4 className="text-base font-bold text-white">Modern Hotel</h4>
                <p className="text-xs text-slate-400">
                  Clean bright modern UI, royal blue accents, compact room cards.
                </p>
              </div>
              <button className={`w-full py-2 rounded-lg text-xs font-bold ${
                theme.theme_id === 'modern-hotel' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}>
                {theme.theme_id === 'modern-hotel' ? '✓ Currently Active' : 'Apply Modern Hotel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: FRONT-END CODE & CUSTOM CSS STUDIO */}
      {activeTab === 'code' && (
        <form onSubmit={handleSaveCustomCode} className="p-8 bg-slate-900 border border-slate-800 rounded-2xl space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                <span>Tenant Front-End Custom CSS & Code Studio</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Inject custom CSS rules, override colors/fonts, or embed custom tracking & script tags live on this resort's public website.
              </p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors"
            >
              {saving ? 'Deploying Code...' : 'Save & Deploy Code'}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-300">Custom CSS Rules (Live Front-End Overrides)</label>
                <span className="text-[10px] text-emerald-400 font-mono">Injected into public DOM &lt;style&gt;</span>
              </div>
              <textarea
                rows={10}
                placeholder={`/* Example Custom CSS Overrides */
header {
  background-color: #05180E !important;
}

h1 {
  letter-spacing: -0.03em;
}

.hero-overlay {
  background: rgba(7, 31, 19, 0.85) !important;
}`}
                value={theme.custom_css || ''}
                onChange={e => setTheme({ ...theme, custom_css: e.target.value })}
                className="w-full p-4 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-300">Custom Head HTML/JS Code (Analytics / Meta Pixel / Widgets)</label>
                <span className="text-[10px] text-amber-400 font-mono">Google Analytics & Tracking Scripts</span>
              </div>
              <textarea
                rows={6}
                placeholder={`<!-- Example Analytics Script -->
<script>
  console.log("Lexur Green Serviced Villa Loaded");
</script>`}
                value={theme.custom_head_code || ''}
                onChange={e => setTheme({ ...theme, custom_head_code: e.target.value })}
                className="w-full p-4 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-amber-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </form>
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

export default WebsiteCustomizer;
