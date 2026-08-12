import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { RestaurantItem } from '../../types';
import { Plus, Trash2, UtensilsCrossed, Power } from 'lucide-react';

export const RestaurantManagement: React.FC = () => {
  const [items, setItems] = useState<RestaurantItem[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Main Course',
    description: '',
    price: 350,
    image_url: '',
    is_vegetarian: false
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/restaurant/items');
      setItems(data.items);
      setEnabled(data.enabled);
    } catch (err) {
      console.error('Failed to load restaurant menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async () => {
    try {
      const res = await apiRequest('/restaurant/toggle', {
        method: 'POST',
        body: { enabled: !enabled }
      });
      setEnabled(res.enabled);
    } catch (err: any) {
      alert(err.message || 'Failed to toggle restaurant');
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/restaurant/items', { method: 'POST', body: formData });
      setIsModalOpen(false);
      setFormData({ name: '', category: 'Main Course', description: '', price: 350, image_url: '', is_vegetarian: false });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to add item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Delete menu item?')) return;
    try {
      await apiRequest(`/restaurant/items/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete item');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Restaurant & Menu Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure restaurant section visibility and edit dining menu items.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Restaurant Section Enable/Disable Switcher */}
          <button
            onClick={handleToggle}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
              enabled
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>Restaurant Section: {enabled ? 'ENABLED' : 'DISABLED'}</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {!enabled && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs">
          ⚠️ <strong>Restaurant Section is Disabled:</strong> The restaurant & dining section will automatically disappear from your public resort website.
        </div>
      )}

      {loading ? (
        <div className="text-slate-400 font-mono text-xs">Loading restaurant items...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map(item => (
            <div key={item.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                {item.image_url && <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    {item.is_vegetarian ? (
                      <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-bold border border-emerald-500/30 rounded">VEG</span>
                    ) : (
                      <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-400 text-[9px] font-bold border border-rose-500/30 rounded">NON-VEG</span>
                    )}
                  </div>
                  <p className="text-xs text-amber-400 font-bold mt-0.5">₹{item.price}</p>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-1">{item.description}</p>
                </div>
              </div>

              <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-rose-400 hover:bg-slate-800 rounded-lg">
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
            <h3 className="text-xl font-serif font-bold text-amber-400">Add Menu Item</h3>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Karimeen Pollichathu"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="Lunch / Dinner / Specials"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Ingredients and culinary style..."
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="veg"
                  checked={formData.is_vegetarian}
                  onChange={e => setFormData({ ...formData, is_vegetarian: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500 bg-slate-950 border-slate-800"
                />
                <label htmlFor="veg" className="text-xs text-slate-300">Is Vegetarian Dish</label>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg">
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
