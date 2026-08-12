import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { Resort } from '../../types';
import { Plus, Building, Trash2, Edit3, Shield, Globe, ExternalLink } from 'lucide-react';

export const SuperAdminResorts: React.FC = () => {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    custom_domain: '',
    theme_id: 'luxury-dark',
    admin_email: '',
    admin_name: '',
    admin_password: 'resort123'
  });

  const loadResorts = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/resorts');
      setResorts(data);
    } catch (err) {
      console.error('Failed to load resorts list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResorts();
  }, []);

  const handleCreateResort = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/resorts', { method: 'POST', body: formData });
      setIsModalOpen(false);
      setFormData({
        name: '',
        slug: '',
        custom_domain: '',
        theme_id: 'luxury-dark',
        admin_email: '',
        admin_name: '',
        admin_password: 'resort123'
      });
      loadResorts();
    } catch (err: any) {
      alert(err.message || 'Failed to create resort');
    }
  };

  const handleDeleteResort = async (id: string) => {
    if (!confirm('Are you sure? Deleting this resort will permanently remove all rooms, content, and admin accounts!')) return;
    try {
      await apiRequest(`/resorts/${id}`, { method: 'DELETE' });
      loadResorts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete resort');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Platform Tenant Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Super Admin Portal: Spawn new resorts, assign themes, create resort admin credentials.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Resort</span>
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 font-mono text-xs">Loading resorts list...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resorts.map(resort => (
            <div key={resort.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold rounded-full uppercase">
                    Theme: {resort.theme_id || 'luxury-dark'}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">
                    {resort.status || 'ACTIVE'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-white">{resort.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">Slug: {resort.slug}</p>
                  {resort.custom_domain && (
                    <p className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      <span>{resort.custom_domain}</span>
                    </p>
                  )}
                </div>

                {resort.admin_email && (
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-xs space-y-0.5 text-slate-300">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Resort Administrator</p>
                    <p className="font-semibold text-white">{resort.admin_name || 'Admin'}</p>
                    <p className="text-slate-400">{resort.admin_email}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <a
                  href={`/?resort=${resort.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <span>Open Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => handleDeleteResort(resort.id)}
                  className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 space-y-4">
            <h3 className="text-xl font-serif font-bold text-amber-400">Create New Resort Tenant</h3>

            <form onSubmit={handleCreateResort} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resort Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Pine Heritage Resort"
                  value={formData.name}
                  onChange={e => {
                    const val = e.target.value;
                    const slugVal = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setFormData({ ...formData, name: val, slug: slugVal });
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Slug (URL Keyword) *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Custom Domain (Optional)</label>
                  <input
                    type="text"
                    placeholder="resortname.com"
                    value={formData.custom_domain}
                    onChange={e => setFormData({ ...formData, custom_domain: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Theme</label>
                <select
                  value={formData.theme_id}
                  onChange={e => setFormData({ ...formData, theme_id: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                >
                  <option value="luxury-dark">Theme 1 — Luxury Modern Dark</option>
                  <option value="kerala-nature">Theme 2 — Kerala Nature Warm</option>
                  <option value="modern-hotel">Theme 3 — Modern Hotel Clean</option>
                </select>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Create Resort Admin Credentials</h4>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Admin Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@newresort.com"
                    value={formData.admin_email}
                    onChange={e => setFormData({ ...formData, admin_email: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Admin Name</label>
                    <input
                      type="text"
                      placeholder="Resort Manager"
                      value={formData.admin_name}
                      onChange={e => setFormData({ ...formData, admin_name: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Password</label>
                    <input
                      type="text"
                      required
                      value={formData.admin_password}
                      onChange={e => setFormData({ ...formData, admin_password: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg">
                  Spawn Resort Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
