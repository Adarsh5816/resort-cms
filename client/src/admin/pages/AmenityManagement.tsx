import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { Amenity } from '../../types';
import { Plus, Trash2, Edit3, Sparkles } from 'lucide-react';
import { IconHelper } from '../../public/components/IconHelper';

export const AmenityManagement: React.FC = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    icon_name: 'wifi',
    description: '',
    is_featured: true
  });

  const availableIcons = [
    'wifi', 'waves', 'coffee', 'utensils', 'flame', 'trees', 'droplet',
    'heart-pulse', 'sparkles', 'tv', 'user-check', 'dumbbell', 'briefcase',
    'navigation', 'shield', 'sun', 'moon', 'car', 'wine', 'compass'
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/amenities');
      setAmenities(data);
    } catch (err) {
      console.error('Failed to load amenities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingAmenity(null);
    setFormData({ name: '', icon_name: 'wifi', description: '', is_featured: true });
    setIsModalOpen(true);
  };

  const openEditModal = (a: Amenity) => {
    setEditingAmenity(a);
    setFormData({
      name: a.name,
      icon_name: a.icon_name,
      description: a.description || '',
      is_featured: !!a.is_featured
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAmenity) {
        await apiRequest(`/amenities/${editingAmenity.id}`, { method: 'PUT', body: formData });
      } else {
        await apiRequest('/amenities', { method: 'POST', body: formData });
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save amenity');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete amenity?')) return;
    try {
      await apiRequest(`/amenities/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete amenity');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Dynamic Amenities Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Add custom resort amenities with dynamic Lucide icons and descriptions.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Amenity</span>
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 font-mono text-xs">Loading amenities...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {amenities.map(a => (
            <div key={a.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-950 text-amber-400 border border-amber-500/30 rounded-lg flex items-center justify-center">
                  <IconHelper name={a.icon_name} className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{a.name}</h4>
                  <p className="text-[11px] text-slate-400">{a.description || 'Resort feature'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => openEditModal(a)} className="p-1.5 text-amber-400 hover:bg-slate-800 rounded-lg">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(a.id)} className="p-1.5 text-rose-400 hover:bg-slate-800 rounded-lg">
                  <Trash2 className="w-4 h-4" />
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
              {editingAmenity ? 'Edit Amenity' : 'Create Amenity'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Amenity Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Infinity Pool, High-Speed Wi-Fi"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Icon Selector</label>
                <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-2 bg-slate-950 border border-slate-800 rounded-lg">
                  {availableIcons.map(ic => (
                    <button
                      type="button"
                      key={ic}
                      onClick={() => setFormData({ ...formData, icon_name: ic })}
                      className={`p-2 rounded-lg border flex items-center justify-center ${
                        formData.icon_name === ic
                          ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <IconHelper name={ic} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="Brief description..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg"
                >
                  Save Amenity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
