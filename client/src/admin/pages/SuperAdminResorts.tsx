import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { Resort } from '../../types';
import { Plus, Building, Trash2, Edit3, Shield, Globe, ExternalLink, X } from 'lucide-react';

export const SuperAdminResorts: React.FC = () => {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResortId, setEditingResortId] = useState<string | null>(null);

  const [createData, setCreateData] = useState({
    name: '',
    slug: '',
    custom_domain: '',
    theme_id: 'lexur-forest',
    admin_email: '',
    admin_name: '',
    admin_password: 'resort123'
  });

  const [editData, setEditData] = useState({
    name: '',
    slug: '',
    custom_domain: '',
    theme_id: 'lexur-forest',
    status: 'active'
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
      await apiRequest('/resorts', { method: 'POST', body: createData });
      setIsCreateModalOpen(false);
      setCreateData({
        name: '',
        slug: '',
        custom_domain: '',
        theme_id: 'lexur-forest',
        admin_email: '',
        admin_name: '',
        admin_password: 'resort123'
      });
      loadResorts();
    } catch (err: any) {
      alert(err.message || 'Failed to create resort');
    }
  };

  const handleOpenEditModal = (resort: Resort) => {
    setEditingResortId(resort.id);
    setEditData({
      name: resort.name,
      slug: resort.slug,
      custom_domain: resort.custom_domain || '',
      theme_id: resort.theme_id || 'lexur-forest',
      status: resort.status || 'active'
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateResort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResortId) return;
    try {
      await apiRequest(`/resorts/${editingResortId}`, { method: 'PUT', body: editData });
      setIsEditModalOpen(false);
      setEditingResortId(null);
      loadResorts();
    } catch (err: any) {
      alert(err.message || 'Failed to update resort');
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
            Super Admin Portal: Spawn new resorts, edit domains & themes, manage admin access.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
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
            <div key={resort.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 flex flex-col justify-between shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold rounded-full uppercase">
                    Theme: {resort.theme_id || 'lexur-forest'}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                    resort.status === 'active' || !resort.status
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {resort.status || 'ACTIVE'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-white">{resort.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">Slug: {resort.slug}</p>
                  {resort.custom_domain && (
                    <p className="text-xs text-slate-300 font-mono flex items-center gap-1 mt-1">
                      <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{resort.custom_domain}</span>
                    </p>
                  )}
                </div>

                {resort.admin_email && (
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-xs space-y-0.5 text-slate-300">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Resort Administrator</p>
                    <p className="font-semibold text-white">{resort.admin_name || 'Admin'}</p>
                    <p className="text-slate-400 font-mono">{resort.admin_email}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800 gap-2">
                <div className="flex gap-2">
                  <a
                    href={`/?resort=${resort.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleOpenEditModal(resort)}
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                <button
                  onClick={() => handleDeleteResort(resort.id)}
                  className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE RESORT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif font-bold text-amber-400">Create New Resort Tenant</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateResort} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resort Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Pine Heritage Resort"
                  value={createData.name}
                  onChange={e => {
                    const val = e.target.value;
                    const slugVal = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setCreateData({ ...createData, name: val, slug: slugVal });
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Slug (URL Identifier) *</label>
                  <input
                    type="text"
                    required
                    value={createData.slug}
                    onChange={e => setCreateData({ ...createData, slug: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Custom Domain (Optional)</label>
                  <input
                    type="text"
                    placeholder="www.resortname.com"
                    value={createData.custom_domain}
                    onChange={e => setCreateData({ ...createData, custom_domain: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Website Theme</label>
                <select
                  value={createData.theme_id}
                  onChange={e => setCreateData({ ...createData, theme_id: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                >
                  <option value="lexur-forest">Lexur Forest Theme (Deep Forest Emerald & Deer Emblem)</option>
                  <option value="kerala-nature">Kerala Nature Theme (Warm Teak & Traditional Heritage)</option>
                  <option value="luxury-dark">Luxury Dark Theme (Gold & Sleek Night)</option>
                  <option value="modern-hotel">Modern Hotel Theme (Clean Blue & Business)</option>
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
                    value={createData.admin_email}
                    onChange={e => setCreateData({ ...createData, admin_email: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Admin Name</label>
                    <input
                      type="text"
                      placeholder="Resort Manager"
                      value={createData.admin_name}
                      onChange={e => setCreateData({ ...createData, admin_name: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Password</label>
                    <input
                      type="text"
                      required
                      value={createData.admin_password}
                      onChange={e => setCreateData({ ...createData, admin_password: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg">
                  Spawn Resort Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT RESORT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif font-bold text-amber-400">Edit Resort Tenant Details</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateResort} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resort Name *</label>
                <input
                  type="text"
                  required
                  value={editData.name}
                  onChange={e => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Slug (URL Keyword) *</label>
                  <input
                    type="text"
                    required
                    value={editData.slug}
                    onChange={e => setEditData({ ...editData, slug: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Custom Domain</label>
                  <input
                    type="text"
                    placeholder="www.resortname.com"
                    value={editData.custom_domain}
                    onChange={e => setEditData({ ...editData, custom_domain: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Website Theme</label>
                  <select
                    value={editData.theme_id}
                    onChange={e => setEditData({ ...editData, theme_id: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="lexur-forest">Lexur Forest Theme (Emerald & Deer)</option>
                    <option value="kerala-nature">Kerala Nature Theme (Warm Teak)</option>
                    <option value="luxury-dark">Luxury Dark Theme (Gold & Night)</option>
                    <option value="modern-hotel">Modern Hotel Theme (Clean Blue)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tenant Status</label>
                  <select
                    value={editData.status}
                    onChange={e => setEditData({ ...editData, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white font-bold"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive / Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-md">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminResorts;
