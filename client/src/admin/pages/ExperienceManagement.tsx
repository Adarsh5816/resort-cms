import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { Experience } from '../../types';
import { Plus, Trash2, Edit3, Compass } from 'lucide-react';

export const ExperienceManagement: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    price: 0,
    duration: '2 Hours',
    location: 'Resort Premises'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/experiences');
      setExperiences(data);
    } catch (err) {
      console.error('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingExp(null);
    setFormData({ title: '', description: '', image_url: '', price: 1500, duration: '2 Hours', location: 'Resort Premises' });
    setIsModalOpen(true);
  };

  const openEditModal = (exp: Experience) => {
    setEditingExp(exp);
    setFormData({
      title: exp.title,
      description: exp.description || '',
      image_url: exp.image_url || '',
      price: exp.price || 0,
      duration: exp.duration || '2 Hours',
      location: exp.location || 'Resort Premises'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExp) {
        await apiRequest(`/experiences/${editingExp.id}`, { method: 'PUT', body: formData });
      } else {
        await apiRequest('/experiences', { method: 'POST', body: formData });
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save experience');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete experience?')) return;
    try {
      await apiRequest(`/experiences/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete experience');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Experiences & Activities</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage resort activities, plantation walks, sunset cruises, or bonfire evenings.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 font-mono text-xs">Loading experiences...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map(exp => (
            <div key={exp.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between">
              <div>
                {exp.image_url && (
                  <img src={exp.image_url} alt={exp.title} className="w-full h-44 object-cover" />
                )}
                <div className="p-6 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-serif font-bold text-white">{exp.title}</h3>
                    {exp.price ? <span className="text-amber-400 font-bold text-xs">₹{exp.price}</span> : null}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{exp.description}</p>
                  <p className="text-[11px] text-slate-500">📍 {exp.location} • ⏳ {exp.duration}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end gap-2">
                <button onClick={() => openEditModal(exp)} className="px-3 py-1.5 bg-slate-800 text-amber-400 text-xs font-semibold rounded-lg">
                  Edit
                </button>
                <button onClick={() => handleDelete(exp.id)} className="px-3 py-1.5 bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 space-y-4">
            <h3 className="text-xl font-serif font-bold text-amber-400">
              {editingExp ? 'Edit Experience' : 'Add Experience'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Plantation Trek & Tea Tasting"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="2 Hours"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. On-site Plantation"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Activity details..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.image_url}
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg">
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
