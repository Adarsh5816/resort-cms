import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { Attraction } from '../../types';
import { Plus, Trash2, MapPin } from 'lucide-react';

export const AttractionManagement: React.FC = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    distance: '10 km',
    travel_time: '20 mins drive',
    image_url: '',
    google_maps_url: 'https://maps.google.com'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/attractions');
      setAttractions(data);
    } catch (err) {
      console.error('Failed to load attractions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/attractions', { method: 'POST', body: formData });
      setIsModalOpen(false);
      setFormData({ name: '', description: '', distance: '10 km', travel_time: '20 mins drive', image_url: '', google_maps_url: 'https://maps.google.com' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to add attraction');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete attraction?')) return;
    try {
      await apiRequest(`/attractions/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete attraction');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Nearby Attractions</h1>
          <p className="text-xs text-slate-400 mt-1">
            Display nearby sightseeing spots, distance in km, and estimated travel time.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Attraction</span>
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 font-mono text-xs">Loading attractions...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {attractions.map(att => (
            <div key={att.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                {att.image_url && <img src={att.image_url} alt={att.name} className="w-16 h-16 rounded-lg object-cover" />}
                <div>
                  <h4 className="text-sm font-bold text-white">{att.name}</h4>
                  <p className="text-xs text-amber-400 font-semibold">📍 {att.distance} • 🚗 {att.travel_time}</p>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-1">{att.description}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(att.id)} className="p-2 text-rose-400 hover:bg-slate-800 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 space-y-4">
            <h3 className="text-xl font-serif font-bold text-amber-400">Add Nearby Attraction</h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Attraction Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Edakkal Caves"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Distance (km)</label>
                  <input
                    type="text"
                    placeholder="15 km"
                    value={formData.distance}
                    onChange={e => setFormData({ ...formData, distance: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Travel Time</label>
                  <input
                    type="text"
                    placeholder="30 mins drive"
                    value={formData.travel_time}
                    onChange={e => setFormData({ ...formData, travel_time: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Attraction summary..."
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
                  Save Attraction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
